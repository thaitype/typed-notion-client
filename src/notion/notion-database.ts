import { Client as NotionClient } from '@notionhq/client';
import type { PageObjectResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import type {
  CommonTypeFilter,
  MapResponseToNotionType,
  MapTypePropertyFilter,
  PageProperties,
  WithAuth,
} from './types';
import { NotionPage } from './notion-page';
export type InferPropTypes<T> = T extends NotionDatabase<infer U> ? U : never;
export type InferNotionDatabase<T> = NotionDatabase<InferPropTypes<T>>;

export type TypedPageObjectResponse<T> = Omit<PageObjectResponse, 'properties'> & {
  properties: T;
};
export type NotionDatabaseQueryArgs = WithAuth<Omit<QueryDatabaseParameters, 'database_id'>>;
export type QueryPredidcate<T extends Record<string, PageProperties['type']>> = (
  props: MapTypePropertyFilter<T>
) => NotionDatabaseQueryArgs;

export interface NotionDatabaseOptions<T extends Record<string, PageProperties['type']>> {
  notionClient: NotionClient;
  databaseId: string;
  propTypes?:T;
}

export class NotionDatabase<T extends Record<string, PageProperties['type']> = Record<string, PageProperties['type']>> {
  propTypes: T = {} as T;
  public readonly notion: NotionClient;
  public readonly databaseId: string

  constructor(
    public readonly option: NotionDatabaseOptions<T>
  ) {
    this.notion = option.notionClient;
    this.databaseId = option.databaseId;
    this.propTypes = option.propTypes ?? {} as T;
  }

  // setPropTypes<const T extends Record<string, PageProperties['type']>>(props: T) {
  //   this.propTypes = {
  //     ...this.propTypes,
  //     ...props,
  //   };
  //   return this as unknown as NotionDatabase<T>;
  // }

  /**
   * Make sure the propType is correct
   */

  async validate() {
    if (Object.values(this.propTypes).length === 0) {
      console.log(`Skipping validate because no prop type provided`);
      return this;
    }

    const response = await this.notion.databases.retrieve({ database_id: this.databaseId });
    const remoteProps = response.properties;
    for (const [propName, propType] of Object.entries(this.propTypes)) {
      if (!remoteProps[propName]) {
        throw new Error(`No property "${propName}" defined in Notion Database Properties`);
      }
      if (propName !== remoteProps[propName]?.name) {
        throw new Error(
          `Both key and name property should be same!, please check the notion API response schema, https://api.notion.com/v1/databases/{database_id}`
        );
      }

      if (propType !== remoteProps[propName]?.type) {
        throw new Error(
          `The property "${propName}" don't match type, (Expected: "${propType}", Actual: "${remoteProps[propName]?.type}")`
        );
      }
    }
    console.log('Schema Validated');
    return this;
  }

  /**
   * TODO: Handle pagination with Async Iterators later
   */
  async query(
    func?: QueryPredidcate<T> | NotionDatabaseQueryArgs
  ): Promise<TypedPageObjectResponse<MapResponseToNotionType<T>>[]> {
    await this.validate();
    const response = await this.notion.databases.query({
      database_id: this.databaseId,
      ...(this.processQueryPredicate(func) ?? {}),
    });
    const results = response.results.filter(page => NotionPage.isPageObjectResponse(page)) as TypedPageObjectResponse<
      MapResponseToNotionType<T>
    >[];
    return results;
  }

  protected processQueryPredicate(
    funcOrArgs?: QueryPredidcate<T> | NotionDatabaseQueryArgs
  ): NotionDatabaseQueryArgs | undefined {
    if (funcOrArgs === undefined) return undefined;
    if (typeof funcOrArgs !== 'function') return funcOrArgs;
    const injectProps: Record<string, unknown> = {};
    for (const [propName, propType] of Object.entries(this.propTypes)) {
      injectProps[propName] = {
        filter: (filterProp: Record<string, unknown>) =>
          ({
            ...filterProp,
            property: propName,
            type: propType,
          } as CommonTypeFilter),
      };
    }
    if(Object.keys(injectProps).length === 0) {
      throw new Error(`No prop type provided, please define typeProps in the constructor before calling query`);
    }
    return funcOrArgs(injectProps as MapTypePropertyFilter<T>);
  }

  get page() {
    return new NotionPage({
      notionClient: this.notion,
      propTypes: this.propTypes,
      parent: {
        database_id: this.databaseId,
      }
    });
  }
}


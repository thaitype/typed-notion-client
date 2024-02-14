import { Client as NotionClient } from '@notionhq/client';
import type { CreatePageParameters, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { MapTypeCreatePageProperties, PageProperties } from './types';
import invariant from 'tiny-invariant';

export type PageParent = CreatePageParameters['parent'];
export type CreatePageArgs = Omit<CreatePageParameters, 'parent'>;
export type CreatePagePredidcate<T extends Record<string, PageProperties['type']>> = (
  props: MapTypeCreatePageProperties<T>
) => CreatePageArgs;

export interface NotionPageOptions<T extends Record<string, PageProperties['type']>> {
  notionClient: NotionClient;
  parent?: PageParent;
  propTypes?: T;
}

export class NotionPage<T extends Record<string, PageProperties['type']> = Record<string, PageProperties['type']>> {
  propTypes: T = {} as T;
  /**
   * The Notion Client
   */
  public readonly notion: NotionClient;
  /**
   * Parent of the page
   */
  public readonly parent?: PageParent;

  constructor(protected readonly options: NotionPageOptions<T>) {
    this.notion = options.notionClient;
    this.parent = options.parent;
    this.propTypes = options.propTypes ?? ({} as T);
  }

  static isPageObjectResponse(arg: any): arg is PageObjectResponse {
    return arg.object === 'page' && 'properties' in arg;
  }

  updateTitle(args: { pageId: string; title: string; propName?: string }) {
    return this.notion.pages.update({
      page_id: args.pageId,
      properties: {
        [args.propName ?? 'Name']: {
          title: [
            {
              text: {
                content: args.title,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * Create a Notion Page
   *
   * Ref: https://developers.notion.com/reference/post-page
   */
  // create(args: { title: string }) {
  create(funcOrArgs: CreatePagePredidcate<T> | CreatePageArgs) {
    invariant(this.parent, `Parent is required to create a page`);
    return this.notion.pages.create({
      parent: this.parent,
      ...this.processCreatePredidcate(funcOrArgs),
    });
  }

  protected processCreatePredidcate(funcOrArgs: CreatePagePredidcate<T> | CreatePageArgs): CreatePageArgs {
    if (typeof funcOrArgs !== 'function') {
      return funcOrArgs;
    }
    const injectProps: Record<string, unknown> = {};
    throw new Error(`Not implemented`);

    // return funcOrArgs(injectProps as );
  }
}

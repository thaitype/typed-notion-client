import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';
import { ExtractRecordValue } from './utils';
import { PageProperties } from './notion-database';
import { Expect, ExpectExtends } from './type-check';

// From @notionhq/client
export type CreatePageProperties = ExtractRecordValue<CreatePageParameters['properties']>;

export type MapTypeCreatePageProperties<T extends Record<string, PageProperties['type']>> = {
  [K in keyof T]: {
    value: (args: MapTypeToNotionType<T[K]>) => {
      [P in K]: MapTypeToNotionType<T[K]>;
    };
  };
};

type MapTypeToNotionType<TType extends PageProperties['type']> = TType extends NonNullable<NumberPropCreatePage['type']>
  ? NumberPropCreatePage
  : TType extends NonNullable<DatePropCreatePage['type']>
  ? DatePropCreatePage
  : TType extends NonNullable<TitlePropCreatePage['type']>
  ? TitlePropCreatePage
  : /**
     * Fall back to any record
     */
    Record<string, unknown>;

export type DatePropCreatePage = Extract<CreatePageProperties, { type?: 'date' }>;
export type NumberPropCreatePage = Extract<CreatePageProperties, { type?: 'number' }>;
export type TitlePropCreatePage = Extract<CreatePageProperties, { type?: 'title' }>;

/**
 * The redefined type is still matched the original type
 */
type Test = [
  Expect<ExpectExtends<CreatePageProperties, NumberPropCreatePage>>,
  Expect<ExpectExtends<CreatePageProperties, DatePropCreatePage>>,
  Expect<ExpectExtends<CreatePageProperties, TitlePropCreatePage>>
];

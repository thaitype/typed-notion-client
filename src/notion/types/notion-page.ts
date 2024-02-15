import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints';

import type { ExtractRecordValue } from './utils';
import type { PageProperties } from './notion-database';
import type { Expect, ExpectExtends } from './type-check';

// From @notionhq/client
export type CreatePageProperties = ExtractRecordValue<CreatePageParameters['properties']>;

export type MapTypeCreatePageProperties<T extends Record<string, PageProperties['type']>> = {
  [K in keyof T]: {
    params: (args: MapTypeToNotionType<T[K]>) => {
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
  : TType extends NonNullable<RichTextProp['type']>
  ? RichTextProp
  : TType extends NonNullable<SelectProp['type']>
  ? SelectProp
  : TType extends NonNullable<StatusProp['type']>
  ? StatusProp
  : TType extends NonNullable<PeopleProp['type']>
  ? PeopleProp
  : TType extends NonNullable<UrlProp['type']>
  ? UrlProp
  : TType extends NonNullable<CreatedTimeProp['type']>
  ? CreatedTimeProp
  : TType extends NonNullable<LastEditedTimeProp['type']>
  ? LastEditedTimeProp
  : never;

export type DatePropCreatePage = Extract<CreatePageProperties, { type?: 'date' }>;
export type NumberPropCreatePage = Extract<CreatePageProperties, { type?: 'number' }>;
export type TitlePropCreatePage = Extract<CreatePageProperties, { type?: 'title' }>;
export type RichTextProp  = Extract<CreatePageProperties, { type?: 'rich_text' }>;
export type SelectProp = Extract<CreatePageProperties, { type?: 'select' }>;
export type StatusProp = Extract<CreatePageProperties, { type?: 'status' }>;
export type PeopleProp = Extract<CreatePageProperties, { type?: 'people' }>;
export type UrlProp = Extract<CreatePageProperties, { type?: 'url' }>;
export type CreatedTimeProp = Extract<CreatePageProperties, { type?: 'created_time' }>;
export type LastEditedTimeProp = Extract<CreatePageProperties, { type?: 'last_edited_time' }>;

/**
 * The redefined type is still matched the original type
 */
type Test = [
  Expect<ExpectExtends<CreatePageProperties, NumberPropCreatePage>>,
  Expect<ExpectExtends<CreatePageProperties, DatePropCreatePage>>,
  Expect<ExpectExtends<CreatePageProperties, TitlePropCreatePage>>,
  Expect<ExpectExtends<CreatePageProperties, RichTextProp>>,
  Expect<ExpectExtends<CreatePageProperties, SelectProp>>,
  Expect<ExpectExtends<CreatePageProperties, StatusProp>>,
  Expect<ExpectExtends<CreatePageProperties, PeopleProp>>,
  Expect<ExpectExtends<CreatePageProperties, UrlProp>>,
  Expect<ExpectExtends<CreatePageProperties, CreatedTimeProp>>,
  Expect<ExpectExtends<CreatePageProperties, LastEditedTimeProp>>,
];

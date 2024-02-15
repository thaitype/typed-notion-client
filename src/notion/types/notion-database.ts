import type { PageObjectResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

import type { ExtractRecordValue } from './utils';
import type { Expect, ExpectExtends } from './type-check';

// From @notionhq/client
export type PageProperties = ExtractRecordValue<PageObjectResponse['properties']>;
export type TypedQueryDatabaseResponse<T> = Omit<QueryDatabaseResponse, 'results'> & {
  untypedResults: QueryDatabaseResponse['results'];
  results: T[];
};

type NumberProp = Extract<PageProperties, { type: 'number' }>;
type DateProp = Extract<PageProperties, { type: 'date' }>;
type TitleProp = Extract<PageProperties, { type: 'title' }>;
type RichTextProp = Extract<PageProperties, { type: 'rich_text' }>;
type SelectProp = Extract<PageProperties, { type: 'select' }>;
type StatusProp = Extract<PageProperties, { type: 'status' }>;
type PeopleProp = Extract<PageProperties, { type: 'people' }>;
type UrlProp = Extract<PageProperties, { type: 'url' }>;
type CreatedTimeProp = Extract<PageProperties, { type: 'created_time' }>;
type LastEditedTimeProp = Extract<PageProperties, { type: 'last_edited_time' }>;

/**
 * The redefined type is still matched the original type
 */
type Test = [
  Expect<ExpectExtends<PageProperties, NumberProp>>,
  Expect<ExpectExtends<PageProperties, DateProp>>,
  Expect<ExpectExtends<PageProperties, TitleProp>>,
  Expect<ExpectExtends<PageProperties, RichTextProp>>,
  Expect<ExpectExtends<PageProperties, SelectProp>>,
  Expect<ExpectExtends<PageProperties, StatusProp>>,
  Expect<ExpectExtends<PageProperties, PeopleProp>>,
  Expect<ExpectExtends<PageProperties, UrlProp>>,
  Expect<ExpectExtends<PageProperties, CreatedTimeProp>>,
  Expect<ExpectExtends<PageProperties, LastEditedTimeProp>>
];

export type MapResponseToNotionType<T extends Record<string, PageProperties['type']>> = {
  [K in keyof T]: MapTypeToNotionType<T[K]>;
};

export type MapTypeToNotionType<T extends PageProperties['type']> = T extends NumberProp['type']
  ? NumberProp
  : T extends TitleProp['type']
  ? TitleProp
  : T extends DateProp['type']
  ? DateProp
  : T extends RichTextProp['type']
  ? RichTextProp
  : T extends SelectProp['type']
  ? SelectProp
  : T extends StatusProp['type']
  ? StatusProp
  : T extends PeopleProp['type']
  ? PeopleProp
  : T extends UrlProp['type']
  ? UrlProp
  : T extends CreatedTimeProp['type']
  ? CreatedTimeProp
  : T extends LastEditedTimeProp['type']
  ? LastEditedTimeProp
  : never;

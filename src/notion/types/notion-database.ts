import { PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { DateResponse } from './notion';
import { Expect, ExpectExtends } from './type-check';
import { ExtractRecordValue } from './utils';

// From @notionhq/client
export type PageProperties = ExtractRecordValue<PageObjectResponse['properties']>;

export type NumberProp = Extract<PageProperties, { type: 'number' }>;
export type DateProp = Extract<PageProperties, { type: 'date' }>;
export type TitleProp = Extract<PageProperties, { type: 'title' }>;

/**
 * The redefined type is still matched the original type
 */
type Test = [
  Expect<ExpectExtends<PageProperties, NumberProp>>,
  Expect<ExpectExtends<PageProperties, DateProp>>,
  Expect<ExpectExtends<PageProperties, TitleProp>>
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
  : never;

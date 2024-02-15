import type { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

import type { PropertyFilter } from './notion';
import type { PageProperties } from './notion-database';
import type { Expect, ExpectExtends } from './type-check';

export type QueryFilterArgs = QueryDatabaseParameters['filter'];

export type MapTypePropertyFilter<T extends Record<string, PageProperties['type']>> = {
  [K in keyof T]: {
    params: (args: Omit<MapTypeToNotionType<T[K], K>, 'property' | 'type'>) => MapTypeToNotionType<T[K], K>;
  };
};

type MapTypeToNotionType<TType extends PageProperties['type'], TProp extends keyof any> = TType extends NonNullable<
  NumberPropFilter<TType>['type']
>
  ? NumberPropFilter<TProp>
  : TType extends NonNullable<DatePropFilter<TType>['type']>
  ? DatePropFilter<TProp>
  : TType extends NonNullable<TitlePropFilter<TType>['type']>
  ? TitlePropFilter<TProp>
  : TType extends NonNullable<RichTextPropFilter<TType>['type']>
  ? RichTextPropFilter<TProp>
  : TType extends NonNullable<SelectPropFilter<TType>['type']>
  ? SelectPropFilter<TProp>
  : TType extends NonNullable<StatusPropFilter<TType>['type']>
  ? StatusPropFilter<TProp>
  : TType extends NonNullable<PeoplePropFilter<TType>['type']>
  ? PeoplePropFilter<TProp>
  : TType extends NonNullable<UrlPropFilter<TType>['type']>
  ? UrlPropFilter<TProp>
  : TType extends NonNullable<CreatedTimePropFilter<TType>['type']>
  ? CreatedTimePropFilter<TProp>
  : TType extends NonNullable<LastEditedTimePropFilter<TType>['type']>
  ? LastEditedTimePropFilter<TProp>
  : never;

export interface CommonTypeFilter {
  property: string;
  type: string;
}

// TODO: Fix TProp later, it should be only string
/**
 * Extract the property filter from the original type
 */
export type ExtractPropertyFilter<TSignature, TProp extends keyof any> = Omit<
  Extract<PropertyFilter, TSignature>,
  'property'
> & {
  property: TProp;
};

export type NumberPropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'number' }, TProp>;
export type DatePropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'date' }, TProp>;
export type TitlePropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'title' }, TProp>;
export type RichTextPropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'rich_text' }, TProp>;
export type SelectPropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'select' }, TProp>;
export type StatusPropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'status' }, TProp>;
export type PeoplePropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'people' }, TProp>;
export type UrlPropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<{ type?: 'url' }, TProp>;
export type CreatedTimePropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<
  { type?: 'created_time' },
  TProp
>;
export type LastEditedTimePropFilter<TProp extends keyof any = string> = ExtractPropertyFilter<
  { type?: 'last_edited_time' },
  TProp
>;

/**
 * The redefined type is still matched the original type
 */
type Test = [
  Expect<ExpectExtends<QueryFilterArgs, NumberPropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, DatePropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, TitlePropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, RichTextPropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, SelectPropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, StatusPropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, PeoplePropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, UrlPropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, CreatedTimePropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, LastEditedTimePropFilter>>
];

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
  : never;

export interface CommonTypeFilter {
  property: string;
  type: string;
}

// TODO: Fix TProp later, it should be only string
export type DatePropFilter<TProp extends keyof any = string> = Omit<
  Extract<PropertyFilter, { type?: 'date' }>,
  'property'
> & {
  property: TProp;
};

// TODO: Fix TProp later, it should be only string
export type NumberPropFilter<TProp extends keyof any = string> = Omit<
  Extract<PropertyFilter, { type?: 'number' }>,
  'property'
> & {
  property: TProp;
};

/**
 * The redefined type is still matched the original type
 */
type Test = [
  Expect<ExpectExtends<QueryFilterArgs, NumberPropFilter>>,
  Expect<ExpectExtends<QueryFilterArgs, DatePropFilter>>
];

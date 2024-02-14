import { expect, test, describe } from 'vitest';
import { NotionDatabase } from './notion-database';
import { PageProperties } from './types';

const sharedOptions = {
  notionClient: {} as any,
  databaseId: '',
};

class FakeNotionDatabase<T extends Record<string, PageProperties['type']>> extends NotionDatabase<T> {
  processQueryPredicate = super.processQueryPredicate;

  // setPropTypes<const T extends Record<string, PageProperties['type']>>(props: T) {
  //   super.setPropTypes(props);
  //   return this as unknown as TestNotionDatabase<T>;
  // }
}

describe('Test processQueryPredicate', () => {
  test('When predicate is undefined', () => {
    expect(new FakeNotionDatabase(sharedOptions).processQueryPredicate()).toBe(undefined);
  });

  test('When predicate is plain filter object', () => {
    expect(
      new FakeNotionDatabase(sharedOptions).processQueryPredicate({
        filter: {
          property: 'Test',
          date: {
            is_empty: true,
          },
        },
      })
    ).toStrictEqual({
      filter: {
        property: 'Test',
        date: {
          is_empty: true,
        },
      },
    });
  });

  test('When predicate is function, with helper function', () => {
    expect(
      new FakeNotionDatabase({
        ...sharedOptions,
        propTypes: {
          Test: 'date',
        },
      }).processQueryPredicate(prop => ({
        filter: prop['Test'].filter({
          date: {
            is_empty: true,
          },
        }),
      }))
    ).toStrictEqual({
      filter: {
        property: 'Test',
        type: 'date',
        date: {
          is_empty: true,
        },
      },
    });
  });
});

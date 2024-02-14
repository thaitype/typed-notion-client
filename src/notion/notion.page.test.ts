import { expect, test, describe } from 'vitest';
import { PageProperties } from './types';
import { NotionPage } from './notion-page';

class FakeNotionPage<T extends Record<string, PageProperties['type']>> extends NotionPage<T> {
  override processCreatePredidcate = super.processCreatePredidcate;
}

describe('Test processCreatePredidcate', () => {
  test('When predicate is plain filter object', () => {
    expect(
      new FakeNotionPage({ notionClient: {} as any }).processCreatePredidcate({
        properties: {
          Test: {
            date: {
              start: '2022-01-01',
            },
          },
        },
      })
    ).toStrictEqual({
      properties: {
        Test: {
          date: {
            start: '2022-01-01',
          },
        },
      },
    });
  });

  test('When predicate is function, with helper function', () => {
    expect(
      new FakeNotionPage({
        notionClient: {} as any,
        propTypes: {
          Test: 'date',
        },
      }).processCreatePredidcate(prop => ({
        properties: {
          ...prop['Test'].params({
            date: {
              start: '2022-01-01',
            },
          }),
        },
      }))
    ).toStrictEqual({
      properties: {
        Test: {
          date: {
            start: '2022-01-01',
          },
        },
      },
    });
  });
});

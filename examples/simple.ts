import { Client as NotionClient } from '@notionhq/client';
import { NotionDatabase } from '../src/main';
import { z } from 'zod';

export const schema = z.object({
  DATABASE_ID: z.string(),
  NOTION_KEY: z.string(),
});

export const env = schema.parse(process.env);
const notion = new NotionClient({ auth: env.NOTION_KEY });
export const myDatabase = new NotionDatabase({
  notionClient: notion,
  databaseId: env.DATABASE_ID,
  propTypes: {
    Name: 'title',
    Date: 'date',
    Note: 'rich_text',
  },
});

/**
 * Create a new page under the database (new record)
 */

async function createPage() {
  const page = await myDatabase.page.create(prop => ({
    properties: {
      ...prop['Note'].params({
        rich_text: [
          {
            text: {
              content: 'My Note!',
            },
          },
        ]
      }),
      ...prop['Name'].params({
        title: [
          {
            text: {
              content: 'Hello, world!',
            },
          },
        ],
      }),
      ...prop['Date'].params({
        date: {
          start: new Date().toISOString(),
        },
      }),
    },
  }));
  console.log(`Created page: ${page.id}`);
  return page.id;
}

async function filterToday() {
  const pages = await myDatabase.query(prop => ({
    filter: prop['Date'].params({
      date: {
        equals: new Date().toISOString(),
      },
    }),
  }));
  for (const page of pages) {
    const title = page.properties.Name.title[0].plain_text;
    console.log(`Today's page: ${page.id} - ${title}`);
  }
}


async function main(){
  await createPage();
  await filterToday();
}
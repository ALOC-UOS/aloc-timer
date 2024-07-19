import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';
import { PageObjectResponse, PartialPageObjectResponse, PartialDatabaseObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID ?? '';

function isPageObjectResponse(obj: PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse): obj is PageObjectResponse {
  return 'properties' in obj && 'Name' in obj.properties && 'title' in obj.properties.Name;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Date',
        date: {
          equals: new Date().toISOString().split('T')[0], // Today's date
        },
      },
    });

    const participants = response.results
    .filter(isPageObjectResponse)
    .map((page) => {
      return {
        id: page.id,
        name: page.properties.Name || 'Unknown',
      };
    });

  res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching study participants:', error);
    res.status(500).json({ error: 'Failed to fetch study participants' });
  }
}

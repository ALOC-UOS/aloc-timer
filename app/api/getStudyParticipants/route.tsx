import { NextResponse } from 'next/server';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID; // 환경 변수에서 가져옵니다

export async function POST() {
  if (!NOTION_API_KEY || !DATABASE_ID) {
    return NextResponse.json({ error: 'Missing API key or Database ID' }, { status: 500 });
  }

  try {
    console.log(DATABASE_ID);
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: "참여여부",
          status: {
            equals: "참여"
          }
        }
      })
    });
    if (!response.ok) {
      throw new Error(`Notion API responded with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Response22222", data);
    const participants = data.results.map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title[0]?.plain_text || 'Unknown',
    }));

    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching study participants:', error);
    return NextResponse.json({ error: 'Failed to fetch study participants' }, { status: 500 });
  }
}
// pages/api/getStudyParticipants.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID ?? '';

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

    const participants = response.results.map((page: PageObjectResponse) => {
      return {
        id: page.id,
        name: page.properties.Name.title[0]?.plain_text || 'Unknown',
      };
    });

    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching study participants:', error);
    res.status(500).json({ error: 'Failed to fetch study participants' });
  }
}

// pages/study-participants.tsx
import { useState, useEffect } from 'react';

interface Participant {
  id: string;
  name: string;
}

export default function StudyParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const response = await fetch('/api/getStudyParticipants');
        if (!response.ok) {
          throw new Error('Failed to fetch participants');
        }
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchParticipants();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Today Study Participants</h1>
      {participants.length === 0 ? (
        <p>No participants for today&apos;s study.</p>
      ) : (
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>{participant.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
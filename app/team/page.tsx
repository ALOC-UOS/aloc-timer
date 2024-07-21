'use client'
import { useState, useEffect } from 'react';
const NOTION_API_KEY = process.env.NEXT_PUBLIC_NOTION_API_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID || '';
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: '2022-06-28'
});

  // 이후 notion 객체를 활용해서 api를 사용합시다.

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
        const response = await notion.databases.query({database_id: DATABASE_ID });
        // const data = await response.json();
        console.log(response);
        // setParticipants(data);
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
      <h1>Todays Study Participants</h1>
      {participants.length === 0 ? (
        <p>No participants for todays study.</p>
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
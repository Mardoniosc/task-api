import { parse } from "csv-parse";
import fs from 'node:fs';

const path = new URL('../assets/tasks.csv', import.meta.url);

const stream = fs.createReadStream(path);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // skip the header line
});

export async function importCSV() {
  const row = stream.pipe(csvParse);

  for await (const line of row) {
    const [title, description] = line;

    await fetch('http://localhost:3332/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }
}
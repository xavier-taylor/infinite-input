import { Pool, Client, PoolConfig } from 'pg';
import { CEDictEntry, parseLine } from './cedict';

describe('cedict ingestion integration tests', () => {
  it('canary test', async () => {
    // pool constructor can read the env itself, just passing in
    // explicitly for clarity
    const pool = new Pool({
      database: 'test',
    });

    // you can also use async/await
    const res = await pool.query('SELECT NOW()');
    await pool.end();
    expect(res.rows[0]).toHaveProperty('now');
  });
  it('', async () => {
    const lines = [
      '著 着 [zhao1] /(chess) move/trick/all right!/(dialect) to add/',
      '著 着 [zhao2] /to touch/to come in contact with/to feel/to be affected by/to catch fire/to burn/(coll.) to fall asleep/(after a verb) hitting the mark/succeeding in/',
      '著 着 [zhe5] /aspect particle indicating action in progress/',
      '著 着 [zhuo2] /to wear (clothes)/to contact/to use/to apply/',
      '著 著 [zhu4] /to make known/to show/to prove/to write/book/outstanding/',
    ];
    const entries = lines.map(parseLine);
    // expect there to be 2 word rows in the db
    // expect there to be 5 cc_cedict rows in the db
    // expect there to be some biggish number of cc_definitions
  });
});

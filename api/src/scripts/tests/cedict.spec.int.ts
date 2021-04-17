import { Pool, Client, PoolConfig, PoolClient } from 'pg';
import { cc_cedictInitializer } from '../../model';
import { CEDictEntry, parseLine, loadEntryIntoDB } from '../cedict';

describe('cedict ingestion integration tests', () => {
  let pool: Pool;
  let client: PoolClient;

  beforeAll(async () => {
    pool = new Pool({
      database: 'test',
    });
    client = await pool.connect();
  });
  afterAll(async () => {
    client.release();
    await pool.end();
  });

  it('canary test', async () => {
    // pool constructor can read the env itself, just passing in
    // explicitly for clarity

    // you can also use async/await
    const res = await pool.query('SELECT NOW()');
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
    for (const e of entries) {
      const init: cc_cedictInitializer = {
        simplified: e.simplified,
        traditional: e.traditional,
        pinyin: e.pinyinNumbers,
        definitions: e.definitions,
      };
      await loadEntryIntoDB(init, client);
    }
    const words = await pool.query(`SELECT * FROM mandarin.word`);

    const cc = await pool.query(`SELECT * FROM mandarin.cc_cedict`);
    const ccs = await pool.query(`SELECT * FROM mandarin.cc_cedict_definition`);

    expect(words.rowCount).toBe(2);
    expect(cc.rowCount).toBe(5);
    expect(ccs.rowCount).toBe(24);
    // expect there to be 2 word rows in the db
    // expect there to be 5 cc_cedict rows in the db
    // expect there to be some biggish number of cc_definitions
  });
});

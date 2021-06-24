import fs from 'fs';
import readline from 'readline';
import path from 'path';

import hskLevelList from '../../data/wordLists.json';
// TODO more generally check that I currently have the right set of words
// tagged at each hsk level in this dataset!
// This script is imperfect (or so it seems),
// as the numbers don't quite add up. Maybe its because of
// different senses of the same word at different levels? any case, must sort out!
// TODO check that every HSK word was in CEdict!
import { Pool, PoolClient } from 'pg';

export interface wordInitializer {
  hanzi: string;
  hsk_word_2010: number;
  hsk_char_2010: number;
}
export default interface cc_cedict {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  definitions: string[];
}
export type cc_cedictInitializer = Omit<cc_cedict, 'id'>;

// build maps HSK_level_N -> Set of words at level N
const simplifiedSets: Record<string, Set<string>> = {};
const traditionalSets: Record<string, Set<string>> = {};
for (let i = 1; i < 7; i++) {
  const index = `${i}` as '1' | '2' | '3' | '4' | '5' | '6';
  simplifiedSets[`${i}`] = new Set(
    hskLevelList[index].map((a) => a.simplified)
  );
  traditionalSets[`${i}`] = new Set(
    hskLevelList[index].map((a) => a.traditional)
  );
}
// build maps of the hsk level where a character first appears
// ie, if simplifiedCharSets['2'].has(x), x first appeared as a char at hsk level 2
const simplifiedCharSets: Record<string, Set<string>> = {};
const traditionalCharSets: Record<string, Set<string>> = {};
for (let i = 1; i < 7; i++) {
  const index = `${i}` as '1' | '2' | '3' | '4' | '5' | '6';
  simplifiedCharSets[index] = new Set();
  traditionalCharSets[index] = new Set();
  for (const word of hskLevelList[index]) {
    const tradCharsFirstSeenAtThisLevel = word.traditional
      .split('')
      .filter((c) => {
        // loop through lower levels and check whether already saw this char
        for (let l = 1; l < i; l++) {
          if (traditionalCharSets[`${l}`].has(c)) {
            return false;
          }
        }
        return true;
      });
    for (const char of tradCharsFirstSeenAtThisLevel) {
      traditionalCharSets[index].add(char);
    }
    const simpCharsFirstSeenAtThisLevel = word.simplified
      .split('')
      .filter((c) => {
        // loop through lower levels and check whether already saw this char
        for (let l = 1; l < i; l++) {
          if (simplifiedCharSets[`${l}`].has(c)) {
            return false;
          }
        }
        return true;
      });
    for (const char of simpCharsFirstSeenAtThisLevel) {
      simplifiedCharSets[index].add(char);
    }
  }
}
// xavier you brilliant idiot, the above horror produces the right numbers per https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi#Between_2010%E2%80%932020
// for (let i = 1; i < 7; i++) {
//   console.log(simplifiedCharSets[`${i}`].size);
// }

type traditional = string;
type simplified = string;

export interface CEDictEntry {
  traditional: traditional;
  simplified: simplified;
  pinyinNumbers: string;
  //pinyinDiacritics: string;
  definitions: string[];
  // refersToWord: [simplified, traditional]; // line 54, 38, 123 etc.
}

export function parseLine(line: string): CEDictEntry {
  const regex = /^([\S]+) ([\S]+) \[([^\]]+)\] \/(.*)\/$/;
  const matches = line.match(regex);
  if (matches) {
    return {
      traditional: matches[1],
      simplified: matches[2],
      pinyinNumbers: matches[3],
      definitions: matches[4].split('/'),
    };
  } else {
    console.error('couldnt match', line);
    throw 'gah';
  }
}

/* types of relationships in this data - could use regex for hanzi?
38/(Internet slang) bye-bye (alternative for 拜拜[bai2 bai2])/
54/abbr. for B型超聲|B型超声[B xing2 chao1 sheng1]/
73/see also 啃書|啃书[ken3 shu1]/
79/nude picture (from 裸照[luo3 zhao4])/
117/see also 閃存盤|闪存盘[shan3 cun2 pan2]/
131/(Internet slang) ten thousand (abbr. for 萬|万[wan4])/
132/my (Internet slang variant of 我的[wo3 de5])/
133/my big sister (Internet slang version of 我的姐[wo3 de5 jie3])/
135/(etymologically, a contracted form of 不一樣|不一样[bu4 yi1 yang4])/
136/also pr. [biu4]/
139/"bamboo" radical in Chinese characters (Kangxi radical 118)/
158/archaic variant of 五[wu3]/
// up to line 158 looking for types
*/

export async function processLineByLine(client: PoolClient) {
  const fileStream = fs.createReadStream(
    path.join(process.env.FILES_PATH as string, 'cedict/cedict_ts.u8')
  );

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line[0] !== '#') {
      const l = parseLine(line);
      const init: cc_cedictInitializer = {
        // TODO get rid of intermediary type
        simplified: l.simplified,
        traditional: l.traditional,
        pinyin: l.pinyinNumbers,
        definitions: l.definitions,
      };
      await loadEntryIntoDB(init, client);
    } else {
      // console.log(line);
    }
  }
}
// use with the word levels sets
function findWordLevel(
  levels: Record<string, Set<string>>,
  word: string
): number {
  for (let i = 1; i < 7; i++) {
    if (levels[`${i}`].has(word)) {
      return i;
    }
  }
  return 7;
}

function findCharLevel(
  charlevels: Record<string, Set<string>>,
  char: string
): number {
  for (let i = 1; i < 7; i++) {
    if (charlevels[`${i}`].has(char)) {
      return i;
    }
  }
  return 7;
}
// For a chinese word ABC, where A, B and C appeared as chars at hsk levels x,y,z
// return the highest of x,y,z
// In other words, return the hsk level at which one is familiar with all the constituent
// chars in ABC. For a single zi chinese word A, obviously this just gives us the level where A first appeared,
function findWordCharLevel(
  charlevels: Record<string, Set<string>>,
  word: string
): number {
  const chars = word.split('');
  const charLevels: number[] = chars.map((c) => findCharLevel(charlevels, c));
  return Math.max(...charLevels);
}

export async function loadEntryIntoDB(
  ce: cc_cedictInitializer,
  client: PoolClient
): Promise<void> {
  const INSERT_WORD = `INSERT INTO mandarin.word (hanzi, hsk_word_2010, hsk_char_2010)  VALUES ($1,$2,$3) ON CONFLICT DO NOTHING;`;
  const wordSimp: wordInitializer = {
    hanzi: ce.simplified,
    hsk_word_2010: findWordLevel(simplifiedSets, ce.simplified),
    hsk_char_2010: findWordCharLevel(simplifiedCharSets, ce.simplified),
  };
  try {
    await client.query(INSERT_WORD, [
      wordSimp.hanzi,
      wordSimp.hsk_word_2010,
      wordSimp.hsk_char_2010,
    ]);
  } catch (e) {
    console.error(e);
  }

  if (ce.simplified !== ce.traditional) {
    // upsert this string of hanzi
    const wordTrad: wordInitializer = {
      hanzi: ce.traditional,
      hsk_word_2010: findWordLevel(traditionalSets, ce.simplified),
      hsk_char_2010: findWordCharLevel(traditionalCharSets, ce.simplified),
    };
    try {
      await client.query(INSERT_WORD, [
        wordTrad.hanzi,
        wordTrad.hsk_word_2010,
        wordTrad.hsk_char_2010,
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  const INSERT_CEDICT = `INSERT INTO mandarin.cc_cedict (simplified, traditional, pinyin, definitions) VALUES ($1,$2,$3,$4) RETURNING id;`;
  const res = await client.query<cc_cedict>(INSERT_CEDICT, [
    ce.simplified,
    ce.traditional,
    ce.pinyin,
    ce.definitions,
  ]);
  const id = res.rows[0].id;

  const INSERT_CEDICT_DEFINITION = `INSERT INTO mandarin.cc_cedict_definition (cc_cedict_id, definition_meaning) VALUES ($1,$2) ON CONFLICT DO NOTHING; `;
  for (const d of ce.definitions) {
    await client.query(INSERT_CEDICT_DEFINITION, [id, d]);
  }
}

/*
著 着 [zhao1] /(chess) move/trick/all right!/(dialect) to add/
著 着 [zhao2] /to touch/to come in contact with/to feel/to be affected by/to catch fire/to burn/(coll.) to fall asleep/(after a verb) hitting the mark/succeeding in/
著 着 [zhe5] /aspect particle indicating action in progress/
著 着 [zhuo2] /to wear (clothes)/to contact/to use/to apply/
著 著 [zhu4] /to make known/to show/to prove/to write/book/outstanding/

*/

async function seedDB() {
  const pool = new Pool(); // params read from env vars
  const client = await pool.connect();
  try {
    await processLineByLine(client);
  } finally {
    client.release();
    pool.end();
  }
}

if (require.main === module) {
  // like if name == main from python
  seedDB();
}

// TODO - document what this file does in english
// I think it ingests CEDICt and also creates WORD entities for each CEDICT entry

// TODO redo this script with pinyin tone marks instead of pinyin numbers?

import fs from 'fs';
import readline from 'readline';
import path from 'path';

type traditional = string;
type simplified = string;
interface CEDictEntry {
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

// import neo4j from "neo4j-driver";

// const { NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
// console.log(`read neo4j username ${NEO4J_USERNAME}`);

export async function processLineByLine() {
  const fileStream = fs.createReadStream(
    path.join(
      __dirname,
      '../../../data/cedict/cedict_1_0_ts_utf-8_mdbg_TEST.txt'
    )
  );

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    // const result = await session.writeTransaction((tx) => {
    //   tx.run(); // continue reading and applying here: https://neo4j.com/docs/javascript-manual/current/session-api/#js-driver-async-transaction-fn
    // });
    if (line[0] !== '#') {
      console.log(parseLine(line));
    } else {
      console.log(line);
    }
  }
}

function loadEntryIntoDB(ce: CEDictEntry): void {
  // query to create the ce dict, returns the cedicts uuid
  // query to merge the trad hanzi as a word, returning the words id.
  // query to merge the simplified hanzi as a word, returning the words id
  // query to merge the trad-> cedict relationship
  // if trad!==simpl, query to merge the simp -> cedict relationship?
  // I think that is too painful, instead should make a custom mutation for creating a CEdict that does all that under the hood for me.
}

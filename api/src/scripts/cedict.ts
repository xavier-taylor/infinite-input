import fs from 'fs';
import readline from 'readline';
import path from 'path';

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

export async function processLineByLine() {
  const fileStream = fs.createReadStream(
    path.join(process.env.FILES_PATH as string, 'cedict/cedict_ts.u8')
  );

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line[0] !== '#') {
      console.log(parseLine(line));
    } else {
      // console.log(line);
    }
  }
}

function loadEntryIntoDB(ce: CEDictEntry): void {}

processLineByLine();

/*
著 着 [zhao1] /(chess) move/trick/all right!/(dialect) to add/
著 着 [zhao2] /to touch/to come in contact with/to feel/to be affected by/to catch fire/to burn/(coll.) to fall asleep/(after a verb) hitting the mark/succeeding in/
著 着 [zhe5] /aspect particle indicating action in progress/
著 着 [zhuo2] /to wear (clothes)/to contact/to use/to apply/
著 著 [zhu4] /to make known/to show/to prove/to write/book/outstanding/

*/

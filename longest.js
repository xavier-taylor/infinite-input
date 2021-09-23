var fs = require('fs'),
  readline = require('readline');

var rd = readline.createInterface({
  input: fs.createReadStream('cedict_ts.u8'),
  console: false,
});

let longest_word = '1';

rd.on('line', function (line) {
  const length = line.split(' ')[0].length;
  if (length > longest_word.length) longest_word = line.split(' ')[0];
});

rd.on('close', () => {
  console.log(longest_word);
  //無一事而不學，無一時而不學，無一處而不得
});

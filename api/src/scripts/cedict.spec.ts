import { parseLine } from './cedict';

// TODO should also write tests that assert the preconditions for the validity of our parsing
// methods (basically that each string has the things our regex assumes it does) - onerous but
// worth it for data quality

// TODO add pinyinDiacritics and correct nu with umlaut etc

// todo handle 桔 桔 [ju2] /variant of 橘[ju2]/ - really need the variant of relationship

describe('cedict parsing and inserting script', () => {
  describe('parseLine()', () => {
    it('handles line with numeric words', () => {
      const input =
        '996 996 [jiu3 jiu3 liu4] /9am-9pm, six days a week (work schedule)/';
      const output = parseLine(input);
      expect(output.definitions).toEqual([
        '9am-9pm, six days a week (work schedule)',
      ]);
      expect(output.simplified).toEqual('996');
      expect(output.traditional).toEqual('996');
      expect(output.pinyinNumbers).toEqual('jiu3 jiu3 liu4');
    });
    it('handles word with several definitions', () => {
      const input =
        '桔子 桔子 [ju2 zi5] /tangerine/also written 橘子/CL:個|个[ge4],瓣[ban4]/';
      const output = parseLine(input);
      expect(output.definitions).toEqual([
        'tangerine',
        'also written 橘子',
        'CL:個|个[ge4],瓣[ban4]',
      ]);
    });
  });
});

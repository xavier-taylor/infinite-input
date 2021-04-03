-- select * from mandarin.word where hsk_word_2010 < 2; -- forget that this includes trad variants lol
CREATE INDEX idx_test on mandarin.document USING GIN (words_upos_not_punct);
WITH hsk1 AS ( 
	select array_agg(hanzi) as word_list from mandarin.word where hsk_word_2010 < 7
)
select * from mandarin.document where words_upos_not_punct <@ ( SELECT word_list from hsk1 )
;
-- takes 180ms for hsk 6 without index, when documents was 1000 rows long.
-- dont know exactly when index is ready, but created index at 10:35 and retested it at 11pm:
-- note - the index possibly wouldnt even be used or useful on such a tiny data set.
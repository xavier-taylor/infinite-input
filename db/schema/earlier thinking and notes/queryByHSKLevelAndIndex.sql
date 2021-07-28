-- select * from mandarin.word where hsk_word_2010 < 2; -- forget that this includes trad variants lol
-- CREATE INDEX idx_test on mandarin.document USING GIN (words_upos_not_punct);
-- CREATE INDEX idx_hsk_word_2010 on mandarin.word  (hsk_word_2010);

WITH hsk1 AS ( 
	select array_agg(hanzi) as word_list from mandarin.word where hsk_word_2010 < 7
)
select * from mandarin.document where words_upos_not_punct <@ ( SELECT word_list from hsk1 )
;
-- takes 180ms for hsk 6 without index, when documents was 1000 rows long.
-- dont know exactly when index is ready, but created index at 10:35 and retested it at 11pm:
-- note - the index possibly wouldnt even be used or useful on such a tiny data set.
-- it took 3seconds 300ms with the index! perhaps it introduces overhead that isn't helpful at low size?
-- then with the index deleted, it again just takes 193ms! very interesting. 
-- somehow (I think) just the whereclause itself is doing its job 'rows removed by filter = 995'




-- with 450k rows: and no index:
-- hsk6 takes: 19 seconds
-- hsk3 takes: 2 seconds

-- after creating the index:
-- hsk6 87 seconds - down to ~ 76 seconds with index on hsk_word_2010
--hsk4 took 18.5 seconds
-- hsk3 8 seconds
-- is it possible that the index isnt built yet?
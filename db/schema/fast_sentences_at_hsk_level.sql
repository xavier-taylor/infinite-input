-- question are these indexes being used? are they the right kind?
-- CREATE INDEX idx_sentence_word_sentence_id on mandarin.sentence_word  (sentence_id);
-- CREATE INDEX idx_sentence_word_word_hanzi on mandarin.sentence_word  (word_hanzi);
-- CREATE INDEX idx_sentence_word_word_upos on mandarin.sentence_word  (universal_part_of_speech);
-- CREATE INDEX idx_sentence_document_id on mandarin.sentence (document_id);
-- CREATE INDEX idx_word_hsk_word_2010 on mandarin.word (hsk_word_2010);
-- CREATE INDEX idx_sentence_word_ner on mandarin.sentence_word  (ner);
--select title, count(document.id) from mandarin.sub_corpus join mandarin.document on sub_corpus_title = title group by title;

SELECT document.id, document.chinese, document.english, document.words_upos_not_punct FROM mandarin.document
WHERE NOT EXISTS (
	SELECT sentence.id FROM mandarin.sentence
	INNER JOIN mandarin.sentence_word ON sentence_word.sentence_id = sentence.id
	INNER JOIN mandarin.word ON sentence_word.word_hanzi = word.hanzi 
	WHERE word.hsk_word_2010 > 5 
	AND sentence.document_id = document.id 
	AND sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM') AND sentence_word.ner ='O'
	 -- can I put this where earlier?
	--AND sentence_word.ner !='O'  -- not can have ner of O but be a PROPN - nER is imperfect
	-- PROPN unfortunately is unreliable - it returns lots of things that are actually just regular nouns. so wont use it in this filter
); -- todo should probs use ner property (with index) to exclude rather than use propn!!

--! 1.711seconds for this, rather than 1 min 15 seconds the old way!!! niceee-- 
---! after all the indexes added, only down to 1.67ish seconds lol, but maybe useful at larger data sizes!!

-- note that in reality we wont be searching by hsk level, instead by the inclusion of the words in a users known words,
-- but I *think* this is a useful heuristic.
-- also really important ASAP to get a few million documents in and see how these queries hold up.

-- TODO at some point check that stack overflow I found - there might be options even faster than this 'not exists'

-- re materialized view comparision. the above query at word.hsk_word_2010 > 5 took Total query runtime: 9 secs 677 msec. 34721 rows affected.

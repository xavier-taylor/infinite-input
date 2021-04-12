/* CREATE MATERIALIZED VIEW [ IF NOT EXISTS ] table_name
    [ (column_name [, ...] ) ]
    [ USING method ]
    [ WITH ( storage_parameter [= value] [, ... ] ) ]
    [ TABLESPACE tablespace_name ]
    AS query
    [ WITH [ NO ] DATA ]
	*/

/*CREATE MATERIALIZED VIEW mandarin.document_word
	(document_id, document_chinese, document_english, sentence_id, word, word_upos)
	AS 
	(SELECT document.id, document.chinese, document.english, sentence.id, sentence_word.word_hanzi, sentence_word.universal_part_of_speech
	FROM mandarin.document
	JOIN mandarin.sentence ON mandarin.document.id = mandarin.sentence.document_id
	JOIN mandarin.sentence_word on mandarin.sentence.id = mandarin.sentence_word.sentence_id)
	WITH DATA;*/
		-- took 2 min 7 sec
/* 
CREATE INDEX idx_mv_document_id on mandarin.document_word  (document_id);
CREATE INDEX idx_mv_sentence_id on mandarin.document_word  (sentence_id);
CREATE INDEX idx_mv_word on mandarin.document_word  (word);
CREATE INDEX idx_mv_upos on mandarin.document_word  (word_upos);
-- took 3 min*/

/*
	SELECT document.id, document.chinese, document.english FROM mandarin.document
	WHERE NOT EXISTS (
		SELECT document_word.document_id from mandarin.document_word
		JOIN mandarin.word ON word.hanzi = document_word.word
		WHERE document_word.document_id = document.id
		AND word.hsk_word_2010 > 5        -- this line is a subsitutute for identifying the users set of known words
		AND document_word.word_upos NOT IN ('PUNCT', 'NUM', 'PROPN') 
	);
	-- this is based on my potentially incorrect assyumption that index is created once query for it returns
--Above Query is correct in that it returns the 28737 rows, but far slower - taking 29 seconds and 309ms*/

	
	
-- Attempt number two:

/*CREATE MATERIALIZED VIEW mandarin.full_sentence_word
	(document_id, sentence_id, word_hanzi, word_upos, ner)
	AS 
	(SELECT document.id, sentence.id, sentence_word.word_hanzi, sentence_word.universal_part_of_speech, sentence_word.ner
	FROM mandarin.document
	JOIN mandarin.sentence ON mandarin.document.id = mandarin.sentence.document_id
	JOIN mandarin.sentence_word on mandarin.sentence.id = mandarin.sentence_word.sentence_id)
	WITH DATA;
CREATE INDEX idx_mv_document_id2 on mandarin.full_sentence_word  (document_id);
CREATE INDEX idx_mv_sentence_id2 on mandarin.full_sentence_word  (sentence_id);
CREATE INDEX idx_mv_word2 on mandarin.full_sentence_word  (word_hanzi);
CREATE INDEX idx_mv_upos2 on mandarin.full_sentence_word  (word_upos);
CREATE INDEX idx_mv_ner2 on mandarin.full_sentence_word  (ner); */
 SELECT document.id, document.chinese, document.english FROM mandarin.document
	WHERE NOT EXISTS (
		SELECT full_sentence_word.document_id from mandarin.full_sentence_word
		JOIN mandarin.word ON word.hanzi = full_sentence_word.word_hanzi
		WHERE full_sentence_word.document_id = document.id
		AND word.hsk_word_2010 > 5        -- this line is a subsitutute for identifying the users set of known words
		AND full_sentence_word.word_upos NOT IN ('PUNCT', 'NUM') 
		AND full_sentence_word.ner = 'O'
	);
	/*
Successfully run. Total query runtime: 7 secs 206 msec.
34721 rows affected.
Successfully run. Total query runtime: 9 secs 145 msec.
34721 rows affected.
	*/
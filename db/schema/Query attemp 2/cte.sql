SET search_path TO mandarin;

--Create some test data - the person knows hsk 4, and by chance all of hsk 2 is due today
--INSERT INTO mandarin.student (first_name, last_name) values ('xavier', 'taylor');
--INSERT INTO student_word_read (word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count)
--SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE, CURRENT_DATE ,0,0  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2;
--INSERT INTO student_word_read (word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count)
--SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE+180, CURRENT_DATE+180 ,0,0  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 in (1,3,4);



--SELECT * FROM student; -- my id is xavier

-- TODO incorporate due after first have limited to known!
-- WITH due as
-- (SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE)
--WITH known as
--(SELECT word_hanzi FROM student_word_read WHERE student_id =1)
-- TODO: 
-- 1 try a query without any materialized view

-- 2 try a query with below materialized view 1
-- 3 try a query with below materialized view 2
-- 4 try a query without materialized view but (somehow) more efficient
 -- fetch all my due cards
 
--1. 
/*
SELECT id, chinese FROM document WHERE
NOT EXISTS (
	SELECT 1 from sentence 
	JOIN sentence_word on sentence.id = sentence_word.sentence_id AND sentence.document_id = document.id AND sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM') 
	AND sentence_word.ner = 'O' 
	LEFT JOIN student_word_read ON student_word_read.word_hanzi = sentence_word.word_hanzi AND student_word_read.student_id = 1
	WHERE student_word_read.word_hanzi is null
	
); -- 27 seconds 20,449 documents returned
*/
-- TODO, before move on to below materialized view attempt, check that above query has required indexes (including attempt with hash indexes)



-- Materialized view version 1 
/*

CREATE MATERIALIZED VIEW mandarin.document_word_minus
	(document_id, document_chinese, document_english, sentence_id, word)
	AS 
	( SELECT document.id, document.chinese, document.english, sentence.id, sentence_word.word_hanzi 
	FROM mandarin.document
	JOIN mandarin.sentence ON mandarin.document.id = mandarin.sentence.document_id
	JOIN mandarin.sentence_word on mandarin.sentence.id = mandarin.sentence_word.sentence_id
	WHERE sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM') 
	AND sentence_word.ner = 'O')
	WITH DATA;

CREATE INDEX idx_mv_document_id2 on mandarin.document_word_minus  (document_id);
CREATE INDEX idx_mv_sentence_id2 on mandarin.document_word_minus  (sentence_id);
CREATE INDEX idx_mv_word2 on mandarin.document_word_minus  (word);*/

-- Materialized view version 2
-- should have one tuple per document, and a column with a list of the words 
/*
CREATE MATERIALIZED VIEW mandarin.document_with_words
	(document_id, document_chinese, document_english, words)
	AS 
(SELECT document.id, document.chinese, document.english,  array_agg(distinct(sentence_word.word_hanzi)) FROM
document join sentence on document.id = sentence.document_id JOIN
sentence_word on sentence.id = sentence_word.sentence_id
WHERE sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM') 
	AND sentence_word.ner = 'O'
GROUP BY document.id)
WITH DATA; -- took 1 minute
*/

WITH known AS ( 
	SELECT array_agg(word_hanzi) as lexicon, student_id from student_word_read Where student_id = 1 GROUP by student_id
),
 due as (
SELECT array_agg(word_hanzi) as items FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE
)
select words from mandarin.document_with_words where words && (select items from due) and    ( SELECT lexicon from known ) @> words
; -- 17 seconds but only 17274 rows returns without indexes. need to work out why returns 3000 less documents than query 1!
-- took 1 min and 14 seconds with the GIN index (again 17274 rows)

-- 23 seconds for 10515 results when added the due words search with no index
-- 1 min and 12 seconds for 10515 results with the index. 

-- more and more seems like this approach will not work

--CREATE INDEX idx_document_with_words on document_with_words USING GIN (words); --took 2 min 38 second

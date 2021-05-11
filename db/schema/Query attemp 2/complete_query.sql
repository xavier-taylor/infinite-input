SET search_path TO mandarin;

/*CREATE MATERIALIZED VIEW mandarin.document_word
	(document_id, word)
	AS
(select distinct document.id as document_id, word_hanzi from 
	document 
	JOIN 
	sentence on document.id = sentence.document_id
	JOIN
	sentence_word on
	sentence.id = sentence_id
	WHERE sentence_word.universal_part_of_speech NOT IN ('PUNCT'))
WITH DATA;
*/


 /*CREATE INDEX idx_dw_document_id_hash ON document_word USING HASH (document_id);
 CREATE INDEX idx_dw_document_id ON document_word (document_id);
 CREATE INDEX idx_dw_word_hash ON document_word USING HASH (word);
 CREATE INDEX idx_dw_word ON document_word (word); */
 -- these 4 indexs took 18 mins! (its teh hash ones, which take 17 mins together!)
 
-- CREATE index d_chinese on document (chinese);
-- CREATE index d_id on document (id);
with candidates as ( 
SELECT chinese,id, english from document WHERE
-- doesn't exist a word I don't know
NOT EXISTS (
	Select 1 FROM document_word
	left join student_word_read ON student_word_read.word_hanzi = document_word.word AND student_word_read.student_id = 1
	WHERE student_word_read.word_hanzi is null
	and document_word.document_id = document.id
	) ),
due as (SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE)
-- exists a word that is due today
-- Potentially can use a recursive CTE to reuse the expensive 'candidates' query to get the
-- list of all the sentences needed to read
select id, chinese, english, count(word_hanzi), array_agg(word_hanzi)as due, cast(count(word_hanzi) as float)/cast((length(chinese)-1) as float) as fraction_due from candidates JOIN document_word on candidates.id = document_word.document_id
JOIN due on document_word.word = due.word_hanzi group by id, chinese, english order by count(word_hanzi) desc, fraction_due desc
;

-- with -SET max_parallel_workers_per_gather = 8;   --SET max_parallel_workers = 8; and max_worker_processes at 8
-- this query takes 5 seconds, when you only know hsk 4 (~1000 words).
-- now with the student knowing 5000 words (ie hsk 6), it still took 5 seconds.
-- TODO - record the indexes that are being used by the query.
-- next test is what happens when we increase number of documents by 10x

-- somehow became 8 seconds? when there were hash indexes on document it takes 8 seconds! when I deleted them and replaced with
-- btree indexes on  document, it takes 5 seconds!
 
-- the query is just as fast (5.5ish seconds) when there are no indexes on document_word, ie, it isn't using those indexes?
 
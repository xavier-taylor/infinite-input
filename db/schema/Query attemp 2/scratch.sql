
SET search_path TO mandarin;
--select * from mandarin.student_word_read where student_id = 1 and due <= CURRENT_DATE; -- ones due today
--select * from mandarin.student_word_read where student_id = 1; -- every word I know
--INSERT INTO student_word_read (word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count)
--SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE, CURRENT_DATE ,0,0  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2;
--INSERT INTO student_word_read (word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count)
--SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE+180, CURRENT_DATE+180 ,0,0  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 in (1,3,4);

/*
-- lesson from this one - had to move conditions from a final where into the on clauses, otherwise the 'where' was operating after the left join
SELECT sentence.chinese, sentence.id, sentence_word.word_hanzi, student_word_read.word_hanzi from sentence 
	JOIN sentence_word on sentence.id = sentence_word.sentence_id AND sentence.document_id =1
	LEFT JOIN student_word_read ON student_word_read.word_hanzi = sentence_word.word_hanzi AND student_word_read.student_id = 1
	WHERE student_word_read.word_hanzi is null
	; */
	
--  CREATE INDEX idx_swr_word_hanzi ON student_word_read  (word_hanzi);
-- CREATE INDEX idx_swr_student_id ON student_word_read USING HASH (student_id);

SELECT word_hanzi FROM student_word_read WHERE student_id = 1  AND due <= CURRENT_DATE




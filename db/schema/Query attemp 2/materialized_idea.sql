SET search_path TO mandarin;

-- this query seemed to take ages. maybe run it over night. -- starts around 9:45pm  not completed 12 hours later
CREATE MATERIALIZED VIEW mandarin.document_augmented
	(document_id, document_chinese, document_english, n_non_punct, unique_words_no_punct, unique_words_no_num_no_punct)
	AS 

(SELECT document.id, document.chinese, document.english, document.n_non_punct,
 jsonb_build_array (array(
	 (select distinct(sentence_word.word_hanzi) from sentence  JOIN
sentence_word on sentence.id = sentence_word.sentence_id
WHERE document.id = sentence.document_id
	and sentence_word.universal_part_of_speech NOT IN ('PUNCT')
 ))),
  jsonb_build_array (array(
	 (select distinct(sentence_word.word_hanzi) from sentence  JOIN
sentence_word on sentence.id = sentence_word.sentence_id
WHERE document.id = sentence.document_id
 and sentence_word.universal_part_of_speech NOT IN ('PUNCT', 'NUM') --AND sentence_word.ner = 'O'
 )))
 
	 FROM
document)

WITH DATA;  

--CREATE INDEX idx_mv_1 on mandarin.document_augmented using gin  (unique_words_no_punct); 
--CREATE INDEX idx_mv_2 on mandarin.document_augmented using gin  (unique_words_no_num_no_punct); 
--CREATE INDEX idx_mv_3 on mandarin.document_augmented (unique_words_no_punct); 
--CREATE INDEX idx_mv_4 on mandarin.document_augmented  (unique_words_no_num_no_punct); 

select * from document_augmented where
-- DUE_WORDS intersection with words in this doc is not empty set
--to_jsonb(array(SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE)) && unique_words_no_punct
unique_words_no_punct ?| array(SELECT word_hanzi FROM student_word_read WHERE student_id = 1 AND due <= CURRENT_DATE)
and
-- ALL_KNOWN_WORDS is a superset of words in this doc
to_jsonb(array(SELECT word_hanzi FROM student_word_read WHERE student_id = 1 )) @> unique_words_no_num_no_punct 

-- currently takes 50 seconds (and returns a couple more rows) than the best query. see if indexes can save it.
-- with the index takes 5 minutes lol
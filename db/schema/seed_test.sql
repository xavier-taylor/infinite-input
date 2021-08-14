
--INSERT INTO mandarin.student (first_name, last_name) values ('xavier', 'taylor');


-- due today 
INSERT INTO mandarin.student_word
(word_hanzi, student_id, locked, date_last_unlocked, learning)
SELECT distinct(hanzi),1, false,  CURRENT_DATE-1, 'learned'::mandarin.learning_state  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2;

INSERT INTO mandarin.student_word_read 
(word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count,  understood)
SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE, CURRENT_DATE ,0,0,   ARRAY[]::boolean[]  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2;


-- due later,
INSERT INTO mandarin.student_word
(word_hanzi, student_id, locked, date_last_unlocked, learning)
SELECT distinct(hanzi),1, false,  CURRENT_DATE-1, 'learned'::mandarin.learning_state  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010  in(1,3,4);

INSERT INTO mandarin.student_word_read 
(word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count,  understood)
SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE+180, CURRENT_DATE+180 ,0,0 , ARRAY[]::boolean[] from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 in (1,3,4);


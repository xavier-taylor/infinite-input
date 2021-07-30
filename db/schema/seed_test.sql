
--INSERT INTO mandarin.student (first_name, last_name) values ('xavier', 'taylor');
--INSERT INTO mandarin.student_word_read (word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count, locked, learning_index, understood)
--SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE, CURRENT_DATE ,0,0, false, 1, ARRAY[]::boolean[]  from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 =2;
---INSERT INTO mandarin.student_word_read (word_hanzi, student_id, f1, f2, due, previous, understood_count, understood_distinct_documents_count, locked, learning_index,understood)
---SELECT distinct(hanzi),1, 0, 1, CURRENT_DATE+180, CURRENT_DATE+180 ,0,0 ,false, 1, ARRAY[]::boolean[] from mandarin.word JOIN mandarin.cc_cedict ON hanzi = simplified WHERE hsk_word_2010 in (1,3,4);


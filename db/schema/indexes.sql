SET search_path TO mandarin;

-- delete the indexes
drop index s_w_r_word_hanzi;
drop index s_w_l_word_hanzi;

drop  index s_w_r_due;
drop  index s_w_l_due;

drop  index s_w_r_word_hanzi;
drop  index s_w_l_word_hanzi;

drop  index s_w_r_student_id ;
drop  index s_w_l_student_id;

drop  index s_w_word_hanzi ;
drop  index s_w_upos ;
drop  index s_w_document_id;

drop index d_id;


-- using the default b tree which allows =, <, > etc.
create index s_w_r_word_hanzi ON student_word_read (word_hanzi);
create index s_w_l_word_hanzi ON student_word_listen (word_hanzi);

create index s_w_r_due ON student_word_read (due);
create index s_w_l_due ON student_word_listen (due);

create index s_w_r_student_id ON student_word_read (student_id);
create index s_w_r_word_hanzi ON student_word_read (word_hanzi);
create index s_w_l_student_id ON student_word_listen (student_id);
create index s_w_l_word_hanzi ON student_word_listen (word_hanzi);

create index sw_position on student_word (position);
create index sw_learning on student_word (learning);


create index s_w_word_hanzi ON sentence_word (word_hanzi);
create index s_w_upos ON sentence_word (universal_part_of_speech);
create index s_w_document_id ON sentence_word (document_id);

create index st_w_date_learned ON student_word(date_learned);
create index st_w_date_last_unlocked ON student_word(date_last_unlocked);

create index d_id on document (id);


-- using the hash index, which might be faster, but which only allows =
create index s_w_r_word_hanzi ON student_word_read USING HASH (word_hanzi);
create index s_w_l_word_hanzi ON student_word_listen USING HASH  (word_hanzi);

-- actually hash index useless for these because i need to use gt/lt so even in hash world make these ones b tree
create index s_w_r_due ON student_word_read (due);
create index s_w_l_due ON student_word_listen (due);

create index s_w_r_student_id ON student_word_read USING HASH  (student_id);
create index s_w_l_student_id ON student_word_listen  USING HASH (student_id);

-- this one takes ages - 55 minutes! (on UM-Corpus\science)
create index s_w_word_hanzi ON sentence_word USING HASH (word_hanzi);
-- below 2 not yet done
create index s_w_upos ON sentence_word USING HASH  (universal_part_of_speech);
create index s_w_document_id ON sentence_word USING HASH (document_id);
-- done
create index d_id on document USING HASH  (id);

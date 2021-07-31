SET search_path TO mandarin;

create index s_w_r_word_hanzi ON student_word_read (word_hanzi);
create index s_w_l_word_hanzi ON student_word_listen (word_hanzi);

create index s_w_r_due ON student_word_read (due);
create index s_w_l_due ON student_word_listen (due);

create index s_w_r_student_id ON student_word_read (student_id);
create index s_w_l_student_id ON student_word_listen (student_id);

create index s_w_word_hanzi ON sentence_word (word_hanzi);
create index s_w_upos ON sentence_word (universal_part_of_speech);
create index s_w_document_id ON sentence_word (document_id);

create index d_id on document (id);


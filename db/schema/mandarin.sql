BEGIN;

CREATE SCHEMA mandarin;

CREATE TABLE mandarin.word
(
    hanzi text,
    hsk_word_2010 integer NOT NULL CHECK (hsk_word_2010 BETWEEN 1 AND 7),
    hsk_char_2010 integer NOT NULL CHECK (hsk_char_2010 BETWEEN 1 AND 7),
    PRIMARY KEY (hanzi)
);
COMMENT ON TABLE mandarin.word
    IS 'Represents a string of hanzi(traditional or simplified) and or alphanumeric characters that constitutes a word in Chinese. ';
COMMENT ON COLUMN mandarin.word.hsk_word_2010
    IS 'In range [1,7], 7 denotes not in hsk. This denotes the first level where this word appeared as a hsk word. So for example, 朋友 would appear as 1, but 朋 友 would each be some other level (maybe 7), because as single character words, they are not part of HSK 1';
COMMENT ON COLUMN mandarin.word.hsk_char_2010
    IS 'In range [1,7] where 7 denotes not appearing in HSK. This is the first level where all the charactes in this word had appeared (by this or previous levels). So for some word ABC where A appeared in level 1, B appeared in level two (as part of some word BD) and C appeared at level 3, we would have the value 3. Hsk level 1 has 174 distinct characters, so to find the hsk level 1 characters you would select * from word where hsk_char_2010 =1 && length(hanz)=1.';

CREATE TABLE mandarin.cc_cedict
(
    id bigserial,
    simplified text NOT NULL REFERENCES mandarin.word (hanzi),
    traditional text NOT NULL REFERENCES mandarin.word (hanzi),
    pinyin text NOT NULL,
    definitions text[] NOT NULL,
    PRIMARY KEY (id)
);
COMMENT ON TABLE mandarin.cc_cedict
    IS 'Represents an entry in the https://cc-cedict.org/wiki/start dictionary. Note that in this table the simplfied or traditional values are not unique - there can be entries with the same string of chinese characters. It is possible that the pinyin and the simplified+trad would be a composite key, but not sure about that, so just using an id. The definitions array is redundant data, i will calculate the cost of using cc_cedict_definition for finding words (as opposed to finding synonyms), and possibly delete definitions array.';
COMMENT ON COLUMN mandarin.cc_cedict.definitions
    IS 'This is redundant data, the definitions are stored in the definition table. I am just including it so I can compare query times against the joined data, in future I will probably delete this once I confirm that I am not paying a cost at query time for normalizing the definitions.';

CREATE TABLE mandarin.cc_cedict_definition
(
    cc_cedict_id bigserial REFERENCES mandarin.cc_cedict (id),
    definition_meaning text,
    PRIMARY KEY (cc_cedict_id, definition_meaning)
);

CREATE TABLE mandarin.student
(
    id bigserial,
    first_name text NOT NULL,
    last_name text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE mandarin.student_word_listen
(
    student_id bigserial REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    f1 bigint NOT NULL,
    f2 bigint NOT NULL,
    due date,
    previous date,
    understood_count bigint NOT NULL,
    PRIMARY KEY (student_id, word_hanzi)
);

CREATE TABLE mandarin.student_word_read
(
    student_id bigserial REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    f1 bigint NOT NULL,
    f2 bigint NOT NULL,
    due date,
    previous date,
    understood_count bigint NOT NULL,
    PRIMARY KEY (student_id, word_hanzi)
);

CREATE TABLE mandarin.corpus
(
    name text,
    licence text NOT NULL,
    website text NOT NULL,
    PRIMARY KEY (name)
);

CREATE TABLE mandarin.sentence
(
    id bigserial,
    english text NOT NULL,
    chinese text NOT NULL,
    corpus_name text NOT NULL REFERENCES mandarin.corpus (name),
    next_sentence bigserial REFERENCES mandarin.sentence (id),
    PRIMARY KEY (id)
);

CREATE TABLE mandarin.student_sentence_read
(
    student_id bigserial REFERENCES mandarin.student (id),
    sentence_id bigserial REFERENCES mandarin.sentence (id),
    read_count integer NOT NULL,
    PRIMARY KEY (student_id, sentence_id)
);

CREATE TABLE mandarin.student_sentence_listen
(
    student_id bigserial REFERENCES mandarin.student (id),
    sentence_id bigserial REFERENCES mandarin.student (id),
    listen_count integer NOT NULL,
    PRIMARY KEY (student_id, sentence_id)
);

CREATE TABLE mandarin.sentence_word
(
    sentence_id bigserial REFERENCES mandarin.sentence (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    part_of_speech text NOT NULL,
    sentence_index integer CHECK (sentence_index > -1),
    PRIMARY KEY (sentence_id, word_hanzi, sentence_index)
);

CREATE TABLE mandarin.read_log
(
    date_time date,
    student_id bigserial REFERENCES mandarin.student (id),
    sentence_id bigserial,
    word_hanzi text NOT NULL,
    sentence_index integer NOT NULL,
    understood boolean NOT NULL,
    PRIMARY KEY (date_time, student_id, sentence_id),
    FOREIGN KEY (sentence_id, word_hanzi, sentence_index)
        REFERENCES mandarin.sentence_word (sentence_id, word_hanzi, sentence_index)
);

CREATE TABLE mandarin.listen_log
(
    date_time date,
    student_id bigserial REFERENCES mandarin.student (id),
    sentence_id bigserial,
    word_hanzi text NOT NULL,
    sentence_index integer NOT NULL,
    understood boolean NOT NULL,
    PRIMARY KEY (date_time, student_id, sentence_id),
    FOREIGN KEY (sentence_id, word_hanzi, sentence_index)
        REFERENCES mandarin.sentence_word (sentence_id, word_hanzi, sentence_index)
);

END;
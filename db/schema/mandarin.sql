BEGIN;

DROP SCHEMA IF EXISTS mandarin CASCADE;

CREATE SCHEMA mandarin;

-- TODO - need to include unihan data
-- which will allow me to map things like 'is simplified variant/is traditional variant'
CREATE TABLE mandarin.word
(
    hanzi text,
    hsk_word_2010 integer CHECK (hsk_word_2010 BETWEEN 1 AND 7),
    hsk_char_2010 integer CHECK (hsk_char_2010 BETWEEN 1 AND 7),
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
    cc_cedict_id bigint REFERENCES mandarin.cc_cedict (id),
    definition_meaning text NOT NULL,
    PRIMARY KEY (cc_cedict_id, definition_meaning)
);

CREATE TABLE mandarin.student
(
    id bigserial,
    first_name text NOT NULL,
    last_name text NOT NULL,
    PRIMARY KEY (id)
);

-- locked could have gone on the mandarin.word itself. This approachs allows more finegrained
-- locking and unlocking, however. To start with, I will just have words unlocked as pairs (listen and read)
-- but in future UI could allow you to lock just the reads, for example.
-- This approch is also better because the flexibility might allow me to
-- block the unlocking of say, student_word_listen for traditional variants
CREATE TABLE mandarin.student_word_listen
(
    locked boolean not null;
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    learning_index int NOT NULL, -- This indexes the array of 'learning' steps, in minutes, ie [1,10] etc - this array is hardcoded in the server for now
    f1 bigint NOT NULL,
    f2 bigint NOT NULL,
    due date NOT NULL,         
    previous date NOT NULL,  
    understood boolean[] CONSTRAINT ten_elements CHECK (cardinality(understood) < 11) NOT NULL,
    understood_count bigint NOT NULL,
    understood_distinct_documents_count bigint NOT NULL, -- increment this only when a new student_document_listen is created for this word
    PRIMARY KEY (student_id, word_hanzi)
);
COMMENT ON COLUMN mandarin.student_word_listen.understood
    IS 'A record of the last 10 times you listened to this word. understood[9] is most recent, understood[0] is oldest';

CREATE TABLE mandarin.student_word_read
(
    locked boolean not null;
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    learning_index int NOT NULL,
    f1 bigint NOT NULL,
    f2 bigint NOT NULL,
    due date NOT NULL,
    previous date NOT NULL,
    understood boolean[] CONSTRAINT ten_elements CHECK (cardinality(understood) < 11) NOT NULL,
    understood_count bigint NOT NULL,
    understood_distinct_documents_count bigint NOT NULL, -- increment this only when a new student_document_listen is created for this word
    PRIMARY KEY (student_id, word_hanzi)
);
COMMENT ON COLUMN mandarin.student_word_listen.understood
    IS 'A record of the last 10 times you listened to this word. understood[9] is most recent, understood[0] is oldest';

CREATE TABLE mandarin.corpus
(
    title text,
    licence text NOT NULL,
    website text NOT NULL,
    summary text NOT NULL,
    PRIMARY KEY (title)
);

CREATE TABLE mandarin.sub_corpus -- for corpuses with no parts, this is a singleton
(
    title text,
    corpus_title text REFERENCES mandarin.corpus (title),
    summary text NOT NULL,
    PRIMARY KEY (title, corpus_title)
);

CREATE TABLE mandarin.document
(
    id bigserial,
    sub_corpus_title text NOT NULL,
    corpus_title text NOT NULL,
    previous_document bigint NULL REFERENCES mandarin.document (id),
    english text NULL,
    chinese text NOT NULL,
    FOREIGN KEY (corpus_title, sub_corpus_title) REFERENCES mandarin.sub_corpus (corpus_title, title),
    PRIMARY KEY (id)
);


CREATE TABLE mandarin.sentence
(
    id bigserial,
    document_id bigint NOT NULL REFERENCES mandarin.document (id),
    document_index int NOT NULL, -- the index of the sentence in its document, starting at 0. ie, 'ABC. DEF.' The sentence 'ABC' has document_index 0
    chinese text NOT NULL,
    sentiment text NOT NULL, -- http://a1-www.is.tokushima-u.ac.jp/member/ren/Ren-CECps1.0/Ren-CECps1.0.html
    PRIMARY KEY (id)
);
CREATE TABLE mandarin.named_entity
(
    id bigserial,
    chinese text NOT NULL,                                      -- stanza.span.text
    entity_type text NOT NULL,                                     -- stanza.span.type 
    start_char int NOT NULL,                                    -- zero indexed, in the document
    end_char int NOT NULL,
    document_id bigint NOT NULL REFERENCES mandarin.document (id),    -- stanza.span.doc
    PRIMARY KEY (id)
);

CREATE TABLE mandarin.sentence_word 
( -- note we map 1 token to 1 word to 1 sentence_word because in the chinese model 1 token = 1 word
 -- the combination of head and deprel makes the sentence.dependencies data redundant, so we will not store it. 
 -- however, i am not sure if the ner field makes the entire NER representation (the Span) redundant, so will store it in named_entity
    stanza_id int,                 --standa.word.id 1 based index of word in sentence
    sentence_id bigint REFERENCES mandarin.sentence (id),
    document_id bigint NOT NULL REFERENCES mandarin.document (id),
    word_hanzi text NOT NULL REFERENCES mandarin.word (hanzi),  -- stanza.word.text
    lemma text NOT NULL REFERENCES mandarin.word (hanzi),                -- stanza.word.lemma
    part_of_speech text NOT NULL,                               -- stanza.word.xpos
    universal_part_of_speech text NOT NULL,                     -- stanza.word.upos
    head integer NOT NULL CHECK (head > -1),                    -- stanza.word.head
    deprel text NOT NULL,                                       -- stanza.word.deprel
    feats jsonb NOT NULL,                                       -- stanza.word.feats //The morphological features of this word. Example: ‘Gender=Fem|Person=3’. we convert into json
    start_char int NOT NULL,                                    -- stanza.token.start_char
    end_char int NOT NULL,                                      -- standa.token.end_char indexes into document
    ner text NOT NULL,                                          -- stanza.token.ner, apparently in in BIOES format (with 'O' denoting none)
    named_entity_id bigint NULL REFERENCES mandarin.named_entity (id),  -- stanza.span.words/tokens
    PRIMARY KEY (stanza_id, sentence_id)
);
COMMENT ON COLUMN mandarin.sentence_word.named_entity_id 
    IS 'The named entity, if any, that this word is part of. 1 named_entity has 1+ sentence_words, one sentence_word has 1 or 0 NE.';



CREATE TABLE mandarin.student_document_read
(
    student_id bigint REFERENCES mandarin.student (id),
    document_id bigint REFERENCES mandarin.document (id),
    read_count bigint NOT NULL,
    last_read date, -- UTC
    PRIMARY KEY (student_id, document_id)
);

CREATE TABLE mandarin.student_document_listen
(
    student_id bigint REFERENCES mandarin.student (id),
    document_id bigint REFERENCES mandarin.document (id),
    listen_count bigint NOT NULL,
    last_listened date, -- UTC
    PRIMARY KEY (student_id, document_id)
);

CREATE TABLE mandarin.student_document
(
    student_id bigint REFERENCES mandarin.student (id),
    document_id bigint REFERENCES mandarin.document (id),
    marked_as_bad boolean NOT NULL, -- if A student marks a document as bad, we don't show them this document ever again TODO
    -- bad could mean they didn't like it(rude? etc) or they thought the language/translation etc was poor quality
    PRIMARY KEY (student_id, document_id)
);


-- not planning to use these two  short term. these tables would grow pretty big and I am not sure what the value would be
CREATE TABLE mandarin.read_log
(
    date_time date,
    student_id bigint REFERENCES mandarin.student (id),
    understood boolean NOT NULL,
    sentence_word_id int,
    sentence_id bigint,
    FOREIGN KEY (sentence_word_id, sentence_id) REFERENCES mandarin.sentence_word (stanza_id, sentence_id),
    PRIMARY KEY (date_time, student_id, sentence_word_id, sentence_id)
);

CREATE TABLE mandarin.listen_log
(
    date_time date,
    student_id bigint REFERENCES mandarin.student (id),
    understood boolean NOT NULL,
    sentence_word_id int,
    sentence_id bigint,
    FOREIGN KEY (sentence_word_id, sentence_id) REFERENCES mandarin.sentence_word (stanza_id, sentence_id),
    PRIMARY KEY (date_time, student_id, sentence_word_id, sentence_id)
);

END;
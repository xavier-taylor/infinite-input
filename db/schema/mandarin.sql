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

/*
 * When in state 'not_yet_learned, you first get shown a card with all the details about that word there - then you read it, try and learn it, click next
  - state gets set to 'meaning' and a due gets set.
 * then have: 2/3 -> 1/3 meaning[] (can you remember the meaning when shown char and pronunciation/audio)
 * then into: 2/3 -> 1/3 pronunciation[] can you remember the pronunciation when shown char and meaning
 * then into: 2/3 -> 1/3 recognition[] can you pick the character (against some random others) when given audio/pronuncation and meaning
 * then into 1/3 -> 2/3 reading[] can you read the character (remember its meaning and pronunciation)
*/
CREATE TYPE mandarin.learning_state AS ENUM ('not_yet_learned', 'meaning', 'pronunciation', 'recognition', 'reading', 'learned');

-- Note that whenever we createa a student_word, we start it with learning_state in not_yet_learned. 
-- Note that when a card is in 'not_yet_learned' there should not be an option to 'get it wrong' in the UI - you are just reading it!
-- future TODO - have button to skip straight from 'not_yet_learned' to 'learned' if you already know it.

CREATE TABLE mandarin.student_word 
(
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    locked boolean not null,
    date_last_unlocked timestamp with time zone, -- not used for now, could be useful to sort by these in browser
    date_learned timestamp with time zone,
    learning mandarin.learning_state not null,
    due timestamp with time zone, -- when in learning state other than not_yet_learned or learned, you must have a 'due'
    position int not null,-- this tracks the priority for when a word is pulled for study.
    -- basically, the lower the better. By default, when we unlock a word, we just set this to 
    -- current max + 1
     --todo will need code to limit the magnitude of this int!
     -- TODO will need code to control the size of this tags list
    tags text[] not null,
    CONSTRAINT if_learning_need_due
        CHECK ((due is not null)OR (learning = 'learned'::mandarin.learning_state OR learning ='not_yet_learned'::mandarin.learning_state)),
    CONSTRAINT if_learned_date_learned_not_null
        CHECK ((date_learned is not null)OR (learning != 'learned'::mandarin.learning_state)),
    CONSTRAINT if_unlocked_then_date_last_unlocked_is_not_null 
        CHECK ( ( locked) OR (date_last_unlocked IS NOT NULL) ) ,
    PRIMARY KEY (student_id, word_hanzi)
);

-- for now 'locked' is only on student_word
-- if we want to ability to lock student_word_listen or student_word_read
-- we will have to either a) merge those tables with student_word or b)
-- give them their own locked property. Will do that once I need it.
-- It might be nicer to have these next two tables as aprt of student_word. Can think about that
-- in future.
CREATE TABLE mandarin.student_word_listen
(
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    f1 int NOT NULL,
    f2 int NOT NULL,
    due timestamp with time zone NOT NULL,         
    previous timestamp with time zone NOT NULL,  
    understood boolean[] CONSTRAINT ten_elements CHECK (cardinality(understood) < 11) NOT NULL,
    -- TODO need logic for when these understood_count ints
    -- get to their max size
    understood_count int NOT NULL,
    understood_distinct_documents_count int NOT NULL, -- increment this only when a new student_document_listen is created for this word
    FOREIGN KEY (student_id, word_hanzi) REFERENCES mandarin.student_word (student_id, word_hanzi),
    PRIMARY KEY (student_id, word_hanzi)
);
COMMENT ON COLUMN mandarin.student_word_listen.understood
    IS 'A record of the last 10 times you listened to this word. understood[9] is most recent, understood[0] is oldest';

CREATE TABLE mandarin.student_word_read
(
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    f1 int NOT NULL,
    f2 int NOT NULL,
    due timestamp with time zone NOT NULL,
    previous timestamp with time zone NOT NULL,
    understood boolean[] CONSTRAINT ten_elements CHECK (cardinality(understood) < 11) NOT NULL,
    understood_count int NOT NULL,
    understood_distinct_documents_count int NOT NULL, -- increment this only when a new student_document_listen is created for this word
    FOREIGN KEY (student_id, word_hanzi) REFERENCES mandarin.student_word (student_id, word_hanzi),
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
    n_non_punct integer NOT NULL, -- the number of sentence_words this document has that aren't upos punct
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
    read_count int NOT NULL,
    last_read timestamp with time zone,
    PRIMARY KEY (student_id, document_id)
);

CREATE TABLE mandarin.student_document_listen
(
    student_id bigint REFERENCES mandarin.student (id),
    document_id bigint REFERENCES mandarin.document (id),
    listen_count int NOT NULL,
    last_listened timestamp with time zone,
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
    date_time timestamp with time zone,
    student_id bigint REFERENCES mandarin.student (id),
    understood boolean NOT NULL,
    sentence_word_id int,
    sentence_id bigint,
    FOREIGN KEY (sentence_word_id, sentence_id) REFERENCES mandarin.sentence_word (stanza_id, sentence_id),
    PRIMARY KEY (date_time, student_id, sentence_word_id, sentence_id)
);

CREATE TABLE mandarin.listen_log
(
    date_time timestamp with time zone,
    student_id bigint REFERENCES mandarin.student (id),
    understood boolean NOT NULL,
    sentence_word_id int,
    sentence_id bigint,
    FOREIGN KEY (sentence_word_id, sentence_id) REFERENCES mandarin.sentence_word (stanza_id, sentence_id),
    PRIMARY KEY (date_time, student_id, sentence_word_id, sentence_id)
);

END;
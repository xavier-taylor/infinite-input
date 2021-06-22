BEGIN;

DROP SCHEMA IF EXISTS mandarin CASCADE;

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

CREATE TABLE mandarin.student_word_listen
(
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    f1 bigint NOT NULL,
    f2 bigint NOT NULL,
    due date NOT NULL,          -- TODO probably need index on this, or perhaps a student_id + this row index...
    previous date NOT NULL,       -- TODO determine whether not null makes sense here TODO decide if we even need this!
    understood_count bigint NOT NULL,
    understood_distinct_documents_count bigint NOT NULL,
    PRIMARY KEY (student_id, word_hanzi)
);

CREATE TABLE mandarin.student_word_read
(
    student_id bigint REFERENCES mandarin.student (id),
    word_hanzi text REFERENCES mandarin.word (hanzi),
    f1 bigint NOT NULL,
    f2 bigint NOT NULL,
    due date NOT NULL,
    previous date NOT NULL,
    understood_count bigint NOT NULL,
    understood_distinct_documents_count bigint NOT NULL,
    PRIMARY KEY (student_id, word_hanzi)
);

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
    -- TODO change this ones name to words lol 
    words_upos_not_punct text[] NOT NULL, -- distinct words TODO consider deleting this once have investigated quick query
    FOREIGN KEY (corpus_title, sub_corpus_title) REFERENCES mandarin.sub_corpus (corpus_title, title),
    PRIMARY KEY (id)
);


CREATE TABLE mandarin.sentence
(
    id bigserial, -- serial creates a sequence, and since I created sentences in order
    -- this 'id' can be used to sort the sentences in the same order as they appear
    -- in their document.
    -- however, TODO add 'index int' field, where index = 0 means this was the first sentence
    -- in the document, index = 2 means this was teh second sentence in the document etc.
    -- TODO adjust script to populate this field when importing corpus
    -- TODO adjust existing data via some clever update query to have this set based on
    -- the order implicit in the id field - ideally in pure sql, but worst can scenario can do it in a script
    -- TODO adjust types, regenerate types etc throughout project as required.
    -- add constraint that document_id and index = composite unique, but keep the id field, so can use in apollo cache etc 
    document_id bigint NOT NULL REFERENCES mandarin.document (id),
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
    id int,   --consider renaming this to index                 --standa.word.id 1 based index of word in sentence
    sentence_id bigint REFERENCES mandarin.sentence (id),
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
    PRIMARY KEY (id, sentence_id)
);
COMMENT ON COLUMN mandarin.sentence_word.named_entity_id 
    IS 'The named entity, if any, that this word is part of. 1 named_entity has 1+ sentence_words, one sentence_word has 1 or 0 NE.';


CREATE TABLE mandarin.student_document_read
(
    student_id bigint REFERENCES mandarin.student (id),
    document_id bigint REFERENCES mandarin.document (id),
    read_count bigint NOT NULL,
    PRIMARY KEY (student_id, document_id)
);

CREATE TABLE mandarin.student_document_listen
(
    student_id bigint REFERENCES mandarin.student (id),
    document_id bigint REFERENCES mandarin.document (id),
    listen_count bigint NOT NULL,
    PRIMARY KEY (student_id, document_id)
);

CREATE TABLE mandarin.read_log
(
    date_time date,
    student_id bigint REFERENCES mandarin.student (id),
    understood boolean NOT NULL,
    sentence_word_id int,
    sentence_id bigint,
    FOREIGN KEY (sentence_word_id, sentence_id) REFERENCES mandarin.sentence_word (id, sentence_id),
    PRIMARY KEY (date_time, student_id, sentence_word_id, sentence_id)
);

CREATE TABLE mandarin.listen_log
(
    date_time date,
    student_id bigint REFERENCES mandarin.student (id),
    understood boolean NOT NULL,
    sentence_word_id int,
    sentence_id bigint,
    FOREIGN KEY (sentence_word_id, sentence_id) REFERENCES mandarin.sentence_word (id, sentence_id),
    PRIMARY KEY (date_time, student_id, sentence_word_id, sentence_id)
);

END;
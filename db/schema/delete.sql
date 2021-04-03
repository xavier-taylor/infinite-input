-- psql xavier -d infinite_input -f delete.sql


DELETE FROM mandarin.sentence_word;
DELETE FROM mandarin.named_entity;
DELETE FROM mandarin.sentence;
DELETE FROM mandarin.document;
DELETE FROM mandarin.sub_corpus;
DELETE FROM mandarin.corpus;

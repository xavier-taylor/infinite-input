#! /usr/bin/python3.8
import psycopg2
import stanza
from typing import List
from datetime import datetime
from psycopg2.extras import Json

'''
Notes: - can do nlp at rate of 21 sentences per sec
'''
#word: stanza.models.common.doc.Word

def extract_feats(word):
    feats = {}
    if(word.feats is None or word.feats == ''):
        return feats
    else:
        feat_list = word.feats.split('|')
        feat_pairs = list(map((lambda x: x.split('=')), feat_list))
        for pair in feat_pairs:
            key = pair[0]
            value = pair[1]
            feats[key] = value
        return feats


class SubCorpus:
    def __init__(self, title: str, path: str, summary: str):
        self.title = title
        self.path = path
        self.summary = summary

SubCorpusList = List[SubCorpus]

class Corpus:
    def __init__(
        self, 
        title: str,
        root_dir: str,
        licence: str,
        website: str,
        summary: str,
        sub_corpuses: SubCorpusList
        ):
        self.title = title
        self.root_dir = root_dir
        self.licence = licence
        self.website = website
        self.summary = summary
        self.sub_corpuses = sub_corpuses
    
um_summary = '''The UM-Corpus has been designed to be a multi-domain and balanced parallel corpus for research and development purpose. In this version, a two million English-Chinese aligned corpus is provided, and it is categorized into eight different text domains, covering several topics and text genres, including: Education, Laws, Microblog, News, Science, Spoken, Subtitles, and Thesis. For a detailed description of the corpus, you may refer to [1].

You should acknowledge with appropriate citation in any publication or presentation containing research results obtained in whole or in part through the use of the UM-Corpus. The following reference should be cited: [1].

Download UM-Corpus

Reference

[1] Liang Tian, Derek F. Wong, Lidia S. Chao, Paulo Quaresma, Francisco Oliveira, Shuo Li, Yiming Wang, Yi Lu, "UM-Corpus: A Large English-Chinese Parallel Corpus for Statistical Machine Translation". Proceedings of the 9th International Conference on Language Resources and Evaluation (LREC'14), Reykjavik, Iceland, 2014.'''
um_ed_summary = 'The texts in this domain are acquired from online  teaching  materials,  such  as  language  teaching resources,  dictionaries,  etc.,  which  can  be  served  as language education'



corpus = Corpus(
    title='UM-Corpus', 
    root_dir='../../../files/UM-Corpus/data/Bilingual/',
    licence='https://creativecommons.org/licenses/by-nc-nd/4.0/',
    website='http://nlp2ct.cis.umac.mo/um-corpus/',
    summary=um_summary,
    sub_corpuses=[SubCorpus(title='Education', path='Education/Bi-Education.txt', summary=um_ed_summary)])

path = corpus.root_dir+corpus.sub_corpuses[0].path

zh_nlp = stanza.Pipeline('zh')
# records = cur.fetchall()
# print(records[0])

# INSERT corpus
conn = psycopg2.connect("dbname=infinite_input user=xavier password=localdb-4301")
conn.autocommit = True
cur = conn.cursor()

cur.execute('''
    INSERT INTO mandarin.corpus (title, licence, website, summary) 
    VALUES (%(title)s, %(licence)s, %(website)s, %(summary)s);''',
    {
        'title': corpus.title,
        'licence': corpus.licence,
        'website': corpus.website,
        'summary': corpus.summary
    }
    )

# FOR subcorpus
# -- INSERT subcorpus
for subcorpus in corpus.sub_corpuses:
    cur.execute('''
        INSERT INTO mandarin.sub_corpus (title, corpus_title, summary) 
        VALUES (%(title)s, %(corpus_title)s, %(summary)s);''',
        {
            'title': subcorpus.title,
            'corpus_title': corpus.title,
            'summary': subcorpus.summary
        }
        )

# -- FOR text in corpus
# -- -- run nlp
test = "香港中文大学首席研究员艾琳•黄说，“夫妇们的婚姻满足感可能取决于他们上下班的时候是否同路。”"
doc = zh_nlp(test)

# -- -- insert document
words = list(map((lambda x: x.text),filter((lambda x: x.upos !='PUNCT'),doc.iter_words())))

cur.execute('''
    INSERT INTO mandarin.document (sub_corpus_title, corpus_title, english, chinese, words_upos_not_punct) 
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id;''',
    (subcorpus.title, corpus.title, '', test, words)
    )
document_id = cur.fetchone()[0]
# -- -- FOR sentence in document
for sentence in doc.sentences:
# -- -- -- insert sentence
    cur.execute('''
        INSERT INTO mandarin.sentence (document_id, chinese, sentiment) 
        VALUES (%s, %s, %s)
        RETURNING id;''',
        (document_id, sentence.text, sentence.sentiment)
        )
    sentence_id = cur.fetchone()[0]
    assert(len(sentence.words) == len(sentence.tokens))
# -- -- -- FOR word in sentence
# -- -- -- -- upsert lemma
# -- -- -- -- upsert word sycopg2.extras.execute_batch(cur, sql, argslist, page_size=100)
# -- -- -- -- insert sentence_word https://www.psycopg.org/docs/extras.html#fast-exec
    ## TODO need to write script to create 'hsk level' like the javascript I have
    # TODO for now this is POTENTIALLY ERRONEOUSLY  declaring all as hsk 7!!
    for i in range(len(sentence.words)):
        word = sentence.words[i]
        token = sentence.tokens[i]
        feats = extract_feats(word)
        cur.execute('''
        INSERT INTO mandarin.word (hanzi, hsk_word_2010, hsk_char_2010) 
        VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;
        ''',
        (word.text, 7, 7))
        if(word.text != word.lemma):
            cur.execute('''
            INSERT INTO mandarin.word (hanzi, hsk_word_2010, hsk_char_2010) 
            VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;
            ''',
            (word.lemma, 7, 7))
        cur.execute('''
        INSERT INTO mandarin.sentence_word (
            id, 
            sentence_id, 
            word_hanzi,
            lemma,
            part_of_speech,
            universal_part_of_speech,
            head,
            deprel,
            feats,
            start_char,
            end_char,
            ner
        ) 
        VALUES (
            %s, 
            %s, 
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
            );
        ''',
        (
            word.id,
            sentence_id,
            word.text,
            word.lemma,
            word.xpos,
            word.upos,
            word.head,
            word.deprel,
            Json(feats),
            token.start_char,
            token.end_char,
            token.ner
        ))
# -- -- -- FOR ent in sentence
# -- -- -- -- insert named_entity
    for ent in sentence.ents:
        cur.execute('''
        INSERT INTO mandarin.named_entity (chinese, entity_type, start_char, end_char, document_id) 
        VALUES (%s, %s, %s, %s, %s) RETURNING id;
        ''',
        (ent.text, ent.type, ent.start_char, ent.end_char, document_id))
        entity_id = cur.fetchone()[0]
# -- -- -- -- FOR word in ent
# -- -- -- -- -- update sentence_word with named_entity
        for word in ent.words:
            cur.execute('''
            UPDATE mandarin.sentence_word
            SET named_entity_id = %s
            WHERE 
                id = %s AND
                sentence_id = %s
            ;
            ''',
            (entity_id, word.id, sentence_id))


        
            



'''
with open(path) as f:
    i = 0 
    english = ''
    chinese = ''
    before = datetime.now()
    for line in f:
        if (i%2 == 0):
            english = line
            i = i + 1
        else:
            chinese = line
            doc = zh_nlp(chinese)
            if (doc.num_tokens != doc.num_words):
                print('tokens not same count as words')
            # print(doc)
            # print(line) 
            i = i + 1
            if( i > 5000):
                break
    after = datetime.now()
    print('sentences: '+ str(i/2))
    print(after - before)
    delta = after - before
    print('seconds ' +str(delta.seconds))
    print(delta.seconds / 60)
    print(delta.seconds % 60)
    print('sentences per second ', str(i/2/delta.seconds))
'''
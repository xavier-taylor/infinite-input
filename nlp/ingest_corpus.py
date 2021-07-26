#! /usr/bin/python3.8
import psycopg2
import stanza
from typing import List
from datetime import datetime
from psycopg2.extras import Json

'''
Notes: - can do nlp at rate of 21 sentences per sec
- But with the below database ingestion and file i/o, seem to be able to do.... 15.64 when inserted 1000 sentences.
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

# I just so happened to ingest the 8 corpora (+ 1 test set) in these chunks, no significance in their order etc
# A B done, C done
#sub_corpora_a=[SubCorpus(title='Education', path='Education/Bi-Education.txt', summary=um_ed_summary)])
#sub_corpora_b = [SubCorpus(title='Laws', path='Laws/Bi-Laws.txt', summary='TBD'), SubCorpus(title='Microblog', path='Microblog/Bi-Microblog.txt', summary='TBD'), SubCorpus(title='News', path='News/Bi-News.txt', summary='TBD'), SubCorpus(title='Spoken', path='Spoken/Bi-Spoken.txt', summary='TBD') ]
sub_corpora_c = [SubCorpus(title='Science', path='Science/Bi-Science.txt', summary='TBD'), SubCorpus(title='Subtitles', path='Subtitles/Bi-Subtitles.txt', summary='TBD'), SubCorpus(title='Thesis', path='Thesis/Bi-Thesis.txt', summary='TBD'), SubCorpus(title='Testing', path='Testing/Testing-Data.txt', summary='Test data for the um corpus') ]

corpus = Corpus(
    title='UM-Corpus', 
    root_dir='../../../files/UM-Corpus/data/Bilingual/',
    licence='https://creativecommons.org/licenses/by-nc-nd/4.0/',
    website='http://nlp2ct.cis.umac.mo/um-corpus/',
    summary=um_summary,
    #sub_corpuses=[SubCorpus(title='Education', path='Education/Bi-Education.txt', summary=um_ed_summary)])
    sub_corpuses=sub_corpora_c)

zh_nlp = stanza.Pipeline('zh')
# records = cur.fetchall()
# print(records[0])

# INSERT corpus
conn = psycopg2.connect("dbname=infinite_input user=xavier password=localdb-4301")
conn.autocommit = True
cur = conn.cursor()

if (False):
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
    print('starting to process subcorpus: '+subcorpus.title)
    cur.execute('''
        INSERT INTO mandarin.sub_corpus (title, corpus_title, summary) 
        VALUES (%(title)s, %(corpus_title)s, %(summary)s);''',
        {
            'title': subcorpus.title,
            'corpus_title': corpus.title,
            'summary': subcorpus.summary
        }
        )
    path = corpus.root_dir + subcorpus.path
    with open(path) as f:
        line_index = 0 
        english = ''
        chinese = ''
        before = datetime.now()
        document_id = None # the first document has a null reference for its previous_document ref
        # TODO the english and chinese for at least some sentences have unstripped newlines at their end, ie 溜达
        # so need to strip those before ingestion


        # TODO should probably delete or exclude sentences which just have a single word ie
        # select * from mandarin.document join mandarin.sentence on document.id = sentence.document_id join mandarin.sentence_word on sentence_word.sentence_id = sentence.id
        #where document.chinese = '溜达
        #'; 
        # which is clearly a bloody dictionary definition? Or maybe this is just more generally a case of 'um corpus is bad'.
        for line in f:

            if (line_index%2 == 0):
                english = line
                line_index = line_index + 1
            else:
                chinese = line

                # -- FOR text in corpus
                # -- -- run nlp
                doc = zh_nlp(chinese)

                # -- -- insert document
                words = list(map((lambda x: x.text),filter((lambda x: x.upos !='PUNCT'),doc.iter_words())))

                cur.execute('''
                    INSERT INTO mandarin.document (sub_corpus_title, corpus_title, previous_document, english, chinese, words_upos_not_punct) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id;''',
                    (subcorpus.title, corpus.title, document_id, english, chinese, words)
                    )
                document_id = cur.fetchone()[0]
                # -- -- FOR sentence in document
                for sentence in doc.sentences:
                # -- -- -- insert sentence
                    # add sentence index TODO (ie a field called document_index that has value 0 for first sentence in a document)
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
                            stanza_id, 
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
                            ner,
                            document_id
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
                            token.ner,
                            document_id
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




                line_index = line_index + 1
                # if( line_index > 2000):
                    # break
        print(line_index)
        after = datetime.now()
        print('sentences: '+ str(line_index/2))
        print(after - before)
        delta = after - before
        print('seconds ' +str(delta.seconds))
        print(delta.seconds / 60)
        print(delta.seconds % 60)
        if (delta.seconds > 0):
            print('sentences per second ', str(line_index/2/delta.seconds))

       # TODO undo set session_replication_role to replica;, which you did before running this for the subcorpus.  
            

'''
First ingestion run of um corpus education, with: set session_replication_role to replica;
sentences: 450000.0
6:14:39.901219
seconds 22479
374.65
39
sentences per second  20.01868410516482


second run:
starting to process subcorpus: Laws
440000
sentences: 220000.0
5:14:20.435927
seconds 18860
314.3333333333333
20
sentences per second  11.664899257688228
starting to process subcorpus: Microblog
10000
sentences: 5000.0
0:04:58.521549
seconds 298
4.966666666666667
58
sentences per second  16.778523489932887
starting to process subcorpus: News
900000
sentences: 450000.0
8:55:38.378672
seconds 32138
535.6333333333333
38
sentences per second  14.00211587528782
starting to process subcorpus: Spoken
440000
sentences: 220000.0
2:43:13.488250
seconds 9793
163.21666666666667
13
sentences per second  22.465026039007455


third lot:
starting to process subcorpus: Science
540000
sentences: 270000.0
4:10:53.951784
seconds 15053
250.88333333333333
53
sentences per second  17.93662392878496
starting to process subcorpus: Subtitles
600000
sentences: 300000.0
3:10:27.442756
seconds 11427
190.45
27
sentences per second  26.253609871357312
starting to process subcorpus: Thesis
600000
sentences: 300000.0
6:00:16.124225
seconds 21616
360.26666666666665
16
sentences per second  13.87860843819393
starting to process subcorpus: Testing
9998
sentences: 4999.0
0:04:50.749203
seconds 290
4.833333333333333
50
sentences per second  17.23793103448276

'''

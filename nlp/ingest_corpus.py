#! /usr/bin/python3.8
import psycopg2
import stanza
from typing import List

class SubCorpus:
    def __init__(self, title: str, path: str):
        self.title = title
        self.path = path

SubCorpusList = List[SubCorpus]

class Corpus:
    def __init__(
        self, 
        title: str,
        root_dir: str,
        licence: str,
        website: str,
        sub_corpuses: SubCorpusList
        ):
        self.title = title
        self.root_dir = root_dir
        self.licence = licence
        self.website = website
        self.sub_corpuses = sub_corpuses


conn = psycopg2.connect("dbname=infinite_input user=xavier password=localdb-4301")

cur = conn.cursor()

#something = cur.execute("SELECT * FROM mandarin.cc_cedict")

#records = cur.fetchall()

#print(records[0])


def ingest_sub_corpus():
    print('hello world')

# these two things might be objects of some sort. have a think about it!
def create_corpus(corpus, sub_corpuses ):
    print('hello world')

# maybe this will be a class in the future
corpus = Corpus(
    title='UM-Corpus', 
    root_dir='../../../files/UM-Corpus/data/Bilingual/',
    licence='https://creativecommons.org/licenses/by-nc-nd/4.0/',
    website='http://nlp2ct.cis.umac.mo/um-corpus/',
    sub_corpuses=[SubCorpus(title='Education', path='Education/Bi-Education.txt')])

path = corpus.root_dir+corpus.sub_corpuses[0].path

with open(path) as f:
    i = 0 
    english = ''
    chinese = ''
    for line in f:
        if (i%2 == 0):
            english = line
        else:
            chinese = line
            #doc = zh_nlp()
            #if (doc.num_tokens != doc.num_words):
            #    print('tokens not same count as words')
            #print(doc)
            print(line) 
            break
        i = i + 1

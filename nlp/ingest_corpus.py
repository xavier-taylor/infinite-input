import psycopg2

conn = psycopg2.connect("dbname=infinite_input user=xavier password=localdb-4301")

cur = conn.cursor()

something = cur.execute("SELECT * FROM mandarin.cc_cedict")

records = cur.fetchall()

print(records[0])

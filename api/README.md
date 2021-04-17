# .env

Your dotenv needs:
FILES_PATH= absolute path (until I work out something smarter) to a files folder for common files
These postgres badboys are needed for int tests and actual code.
Note that int tests need to set their own PGDATABASE at the code level to 'test'
PGUSER=
PGPASSWORD=
PGDATABASE=

# SQL Model

The source of truth for the SQL model is the schema stored in ../db/schema/mandarin.sql.

I tried using kanel, but unfortunately it doesn't support composite keys.

In the future, it would be good to have something like kanel/slonik etc available to give me interfaces for the results of my sql queries.

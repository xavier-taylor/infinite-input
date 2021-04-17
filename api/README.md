# API Project structure

## gql-model

This folder contains typescript types that represent the model defined
in the graphql schema.
Hopefully these can be automatically generated (from the gql schema).

## repository

This layer enscapulates access to the persistence layer - at the moment, a postgresql database. Graphql Docs suggest that authorization might suitably live here. If I manage to generate typescript types representing the persistence layer, they would be stored in src/sql-model, and used here.

## resolvers

This contains the graphql resolvers, whose job it is to process queries and mutations. These should not contain auth logic. Repository objects are dependencies that need to be made available in resolvers. Resolvers return objects defined in the gql schema, which have typescript types defined in src/gql-model

## schema

This contains the graphql schema, which itself is composed of type definitions, query definitions and mutation definitions.

## sql-model

The ultimate source of truth for the persistence layer of this project is currently the SQL model stored in ../db/schema/mandarin.sql.
If a tool like kanel/slonik etc can be successfully used to generate typescript types representing the SQL schema, that will be stored in src/persistence. Note, Kanel almost accomplished this goal, but it doesn't handle composite keys well.
For now, this folder is empty.

Perhaps for now it would be best to keep using Kanel, and just manually fix the couple of types that need to be fixed (could do a PR into the project to fix it??)

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

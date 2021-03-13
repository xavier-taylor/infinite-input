# Logging into postgres server locally

Switch to postgres account on ubuntu
sudo -i -u postgres
Then can access psql prompt via
psql
Exit with \q

Or access postgres directyl with:
sudo -u postgres psql

# Roles:

SELECT rolename FROM pg_roles;
The default role is 'postgres'
Roles are distinct from OS roles, but many commands will use your OS role by default, so convenient to create role with same name as OS user, ie xavier
CREATE ROLE xavier LOGIN CREATEDB CREATEROLE PASSWORD 'something';
CREATE ROLE SUxavier SUPERUSER PASSWORD 'something'; // not sure if su gets the other roles by default
Now can, from command line as ubuntu xavier, run commands like createdb

#pgadmin
Pgadmin has its own 'users', distinct from psql users etc. There I have xaviermt1@gmail.com with a common password of mine. Then under servers I made one where I set host to localhost, port to 5432 and username to xavier, which allowed me to connect pgadmin to the local postgres server

# schemas

A schema is a namespace. There is a default one in each database called 'public'

# pgadmin er tool

its pretty cool, but it is incomplete - for example, it lacks unique constraint. So any schema diagram created with it is just the first step - afterwards, you need to go through and add more details

# running a .sql file
psql xavier -d infinite_input -f  mandarin.sql
-d indicates the database, -f indicates the file, and xavier is the role
This command runs that .sql file

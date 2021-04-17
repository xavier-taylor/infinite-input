const path = require('path');

module.exports = {
  connection: {
    host: 'localhost',
    user: 'xavier',
    password: 'localdb-4301',
    database: 'infinite_input',
  },

  preDeleteModelFolder: true,

  customTypeMap: {
    'text[]': 'string[]',
    'date[]': 'Date[]',
  },

  schemas: [
    {
      name: 'mandarin',
      ignore: ['knex_migrations', 'knex_migrations_lock'],
      modelFolder: path.join(__dirname, 'src', 'sql-model'),
    },
  ],
};

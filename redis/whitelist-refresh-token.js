const redis = require('redis');
const manipulaLista = require('./manipula-lista');
const whitelist = redis.createClient({ prefix: 'white-refresh-token:' });
module.exports = manipulaLista(whitelist);
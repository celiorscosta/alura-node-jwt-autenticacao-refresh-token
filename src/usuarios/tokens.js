const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const { InvalidArgumentError } = require('../erros');
const whiteListRefreshToken = require('../../redis/whitelist-refresh-token');
const blacklistAccessToken = require('../../redis/blacklist-access-token');

function criaTokenJWT(id, [tempoQuantidade, tempoUnidade]) {
    const payload = { id };

    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQuantidade + tempoUnidade });
    return token;
}

async function verificaTokenJWT(token, nome, blacklist) {
    await verificaTokenNaBlacklist(token, nome, blacklist);
    const { id } = jwt.verify(token, process.env.CHAVE_JWT);
    return id;
}

async function verificaTokenNaBlacklist(token, nome, blacklist) {
    const tokenNaBlacklist = await blacklist.contemToken(token);
    if (tokenNaBlacklist) {
        throw new jwt.JsonWebTokenError(`${nome} inválido por logout!`);
    }
}

function invalidaTokenJWT(token, blacklist) {
    return blacklist.adiciona(token);
}

async function criaTokenOpaco(id, [tempoQuantidade, tempoUnidade], whitelist) {
    const tokeOpaco = crypto.randomBytes(24).toString('hex');
    const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();
    await whitelist.adiciona(tokeOpaco, id, dataExpiracao);
    return tokeOpaco;
}

async function verificaTokenOpaco(token, nome, whitelist) {
    verificaTokenEnviado(token, nome);
    const id = await whitelist.buscaValor(token);
    verificaTokenValido(id, nome);
    return id;
}

async function invalidaTokenOpaco(token, whitelist) {
    await whitelist.deleta(token);
  }
  

function verificaTokenValido(id, nome) {
    if (!id) {
        throw new InvalidArgumentError(`${nome} token inválido!`);
    }
}

function verificaTokenEnviado(token, nome) {
    if (!token) {
        throw new InvalidArgumentError(`${nome} não enviado!`);
    }
}

module.exports = {
    access: {
        nome: 'access token',
        lista: blacklistAccessToken,
        expiracao: [15, 'm'],
        cria(id) {
            return criaTokenJWT(id, this.expiracao);
        },
        verifica(token) {
            return verificaTokenJWT(token, this.nome, blacklistAccessToken);
        },
        invalida(token) {
            return invalidaTokenJWT(token, this.lista);
        }
    },
    refresh: {
        nome: 'refresh token',
        lista: whiteListRefreshToken,
        expiracao: [5, 'd'],
        cria(id) {
            return criaTokenOpaco(id, this.expiracao, this.lista);
        },
        verifica(token) {
            return verificaTokenOpaco(token, this.nome, this.lista);
        },
        invalida(token) {
            return invalidaTokenOpaco(token, this.lista);
        }
    }
}

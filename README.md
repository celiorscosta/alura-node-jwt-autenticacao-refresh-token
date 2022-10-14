# Node.js: Refresh Tokens e confirmação de cadastro

| :placard: API em NodeJS |     |
| -------------  | --- |
| :sparkles: Nome        | **Node.js: Refresh Tokens e confirmação de cadastro**
| :label: Tecnologias | NodeJS, Redis

Continuação do curso anterior [Node.js e JWT: autenticação com tokens](https://github.com/celiorscosta/alura-node-jwt-autenticacao-token), onde implementaremos as rotinas para realizar o refresh do token gerado no login.

> Blog do código, um blog simples em Node.js

## Tópicos abordados.

- Construa uma allowlist para guardar tokens opacos
- Implemente refresh tokens que atualizam JSON Web tokens
- Desenhe uma interface para o uso padronizado de tokens
- Aprenda a enviar e-mails através de Node.js
- Construa um sistema de verificação de e-mails usando tokens

## Project setup

> Instale os pacotes usando o comando abaixo:
```
npm install
```

> Antes de rodar o sistema para testar, é necessario criar na raiz do projeto um arquivo chamado `.env`.
> Dentro deste arquivo você devera adicionar a `CHAVE_JWT` e o endereço da URL padrão conformer descrito abaixo:

```
CHAVE_JWT="coloque-sua-chave-secreta-aqui"
BASE_URL="localhost:3000"
```

> Para gerar a chave rode no seu terminal o comando:

```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'))"
```

> Copie a string gerada após a conclusão do comando e cole no lugar de "coloque-sua-chave-secreta-aqui".

### Redis

> Para criar a blacklist de tokens, foi utilizado o Redis para persistir essa informação, neste ponto deixo a seu critério se irá instalar ou rodar em uma imagem do docker.
> No meu caso usei o Docker e rodei tudo dentro do WSL2.

Pronto, feito isso, agora é só rodar!
```
npm start
```

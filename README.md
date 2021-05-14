# Server_GitHub_GraphQL_Insights
Server que acessa a API do GitHub Graph QL, realiza leitura dos Commits histórios do Projeto Linux, armazena os dados e informar insights dos maiores contribuidores

Configuração das Ferramentas
------------------------
- Node.JS V14.16.1
- NPM V6.14.12
- MySQL Server 8.0.24.0
- MYSQL WorkBench 8.0




Passo-a-passo
------------------

1 - Executar o comando NPM Install no repositório

2 - Por Default o Server Roda na Porta 3001, pode ser trocado index.JS Linha 23 no primeiro Parâmetro de "app.listen" 

3 - Por Default o MySQL na Porta 3307, pode ser trocado em conexao.js Linha 6

4 - Criar Conexão no MySQL, com as informações:     host:'localhost', port: 'Default ou que você optou usar', user: 'root' e password: 'admin'

5 - Criar database: 'sigalei_db'

6 - Substituir o accessToken com o seu Token Personalizado em models/dados_abertos.js linha. Você pode obter acessando o Link abaixo:

=> https://github.com/settings/tokens
=> Site de suporte: https://medium.com/vlgunarathne/introduction-to-github-graphql-api-423ebbab75f9

OBS: Assim que gerar copie e guarde, ele desaparece depois

7. Opcional: Você pode alterar a data de início da leitura da Leitura dos Commits da API GitHub GraphQL em './models/dados_abertos.js' Linha 10, mas não recomendo. Demora para carregar se for uma data distante.

8. Executar o comando npm start

9. Executar um GET na Rota http://localhost:3001/insight

10.Retorno será um Json com três objetos, sendo o login e quantidade de quem mais realizou Commits, o login e quantidade de quem mais adicionou linhas e o login e quantidade de quem mais removeu linhas
desde do período de início de leitura (Por esse motivo é interessante ter uma data próxima, tem muito commits nesse projeto e pode demorar para carregar).


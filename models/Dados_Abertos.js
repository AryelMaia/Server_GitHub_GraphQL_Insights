const conexao = require('../infraestrutura/conexao')
const moment = require('moment')
const { json } = require('body-parser')
const fetch = require('node-fetch');

// Coloque o seu AcessToken Personalizado
const accessToken = '***********';

// Inserir a data de inicio OBS: Manter Formato e recomendo manter até Maio/2021 devido o tempo de consulta ao API GitHub GraphQL 
const dataInicio = '2021-05-01T00:00:00Z'

class Dados_Abertos {

    init(){
        const sql = 'SELECT * FROM Historico_commits WHERE id=1'

        this.dadosTabelados = []
        this.chamada = 1
        this.limite = 0

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                console.log(erro);
            }
            else {
                if (resultados.length == 0) {
                    this.preencherTabela();
                }else{
                    console.log("Tabela Existente e Populada")
                }
            }

        });

    }

    preencherTabela(){

    
        // Query do Comeco de Maio para Hoje
        const query = `
        query { 
            repository(name:"linux" owner:"torvalds"){
              name
              object(expression: "master") {
                  ... on Commit {
                      history(first: 100, since: "${dataInicio}" ) {
                          totalCount
                          pageInfo{
                              hasNextPage, 
                              endCursor   
                    }
                    nodes {
                        author {
                            user {
                                login               
                        }
                    }
                    additions
                    deletions
                    committedDate
                }
                  }
                }
            }
            }
        }`;
        
        // Primeira Query com base na data
        
        fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            }).then(res => res.json())
            .then(body => {
                if(body.data.repository != null){
                
                
                this.limite = parseInt(body.data.repository.object.history.totalCount / 100)
                
                console.log(this.limite)

                this.adicionarResultados(body.data.repository.object.history.nodes)
                const endCursor = body.data.repository.object.history.pageInfo.endCursor
                const hasNextPage = body.data.repository.object.history.pageInfo.hasNextPage

                console.log(this.chamada)
                console.log(endCursor)
                console.log(hasNextPage)

                if(this.limite>this.chamada){
                    //recursividade proxima pagina com condicao de termino o hasNext Page = falso
                    this.chamarProximaPagina(endCursor)
                }
            }else{
                console.log("Repositorio Nulo - Erro do API GitHub GraphQL")
            }
               
            })
            .catch(error => console.error(error));
        

    }

    chamarProximaPagina(endCursor){

    
        const query = `
        query { 
            repository(name:"linux" owner:"torvalds"){
              name
              object(expression: "master") {
                  ... on Commit {
                      history(first: 100, after: "${endCursor}" ) {
                          totalCount
                          pageInfo{
                              hasNextPage, 
                              endCursor   
                    }
                    nodes {
                        author {
                            user {
                                login               
                        }
                    }
                    additions
                    deletions
                    committedDate
                }
                  }
                }
            }
            }
        }`;
        
        
        
       fetch('https://api.github.com/graphql', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            }).then(res => res.json())
            .then(body => {

                if(body.data.repository != null){
                this.adicionarResultados(body.data.repository.object.history.nodes)
                const endCursor = body.data.repository.object.history.pageInfo.endCursor
                const hasNextPage = body.data.repository.object.history.pageInfo.hasNextPage

                this.chamada = this.chamada + 1

                console.log(this.chamada)
                console.log(endCursor)
                console.log(hasNextPage)

                if(this.limite>this.chamada){
                    //recursividade proxima pagina com condicao de termino o hasNext Page = falso
                    this.chamarProximaPagina(endCursor)
                }else{
                    //console.log(this.dadosTabelados)
                    this.inserirRegistro()
                }
            }else{
                console.log("Repositorio Nulo - Erro do API GitHub GraphQL")
            }
                
            })
            .catch(error => console.error(error));

    }

    adicionarResultados(nodes){
    
    var local

    for (let node of nodes) {
        
        if(node.author.user != null){
            
            local = this.dadosTabelados.map(function(e) { return e.login; }).indexOf(node.author.user.login)
            
            if(local == -1){
               
                this.dadosTabelados.push({
                    login: node.author.user.login,
                    num_commits: 1,
                    num_addlinhas: node.additions,
                    num_remlinhas: node.deletions
                })

            }else{
                this.dadosTabelados[local] ={
                    login: node.author.user.login,
                    num_commits: this.dadosTabelados[local].num_commits + 1,
                    num_addlinhas: node.additions + this.dadosTabelados[local].num_addlinhas,
                    num_remlinhas: node.deletions + this.dadosTabelados[local].num_remlinhas
                }
            }

        }

    }

    }

    inserirRegistro(){

        const sql = 'INSERT INTO Historico_commits SET ?'

        for (let linha of this.dadosTabelados) {
            
            conexao.query(sql, linha, (erro,resultados) => {
                    if(erro){
                        console.log(erro)
                    }
                    else{
                        console.log("Insercao na Tabela Concluido com Sucesso")
                    }
            })
          }
    }

    insight(res){
        const sql = 'SELECT * FROM historico_commits'

        var retorno = []

        conexao.query(sql, (erro,resultados) =>{

            if(erro){
                res.status(400).json(erro)
            }
            else{
                const tabelaResultados = resultados

                tabelaResultados.sort(function(a, b){return b.num_commits - a.num_commits});

                retorno.push({
                    login: tabelaResultados[0].login,
                    valor: tabelaResultados[0].num_commits,
                    mensagem: "A Maior quantidade Commits"
                })

                tabelaResultados.sort(function(a, b){return b.num_addlinhas - a.num_addlinhas});

                retorno.push({
                    login: tabelaResultados[0].login,
                    valor: tabelaResultados[0].num_addlinhas,
                    mensagem: "A Maior quantidade de Linhas Adicionadas"
                })

                tabelaResultados.sort(function(a, b){return b.num_remlinhas - a.num_remlinhas});

                retorno.push({
                    login: tabelaResultados[0].login,
                    valor: tabelaResultados[0].num_remlinhas,
                    mensagem: "A Maior quantidade de Linhas Removidas"
                })
                
                res.status(200).json(retorno)

            }

        })
    }

}




module.exports = new Dados_Abertos
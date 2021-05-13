class Tabelas{

    init(conexao){
        this.conexao = conexao
        this.criarTabelas()
    }

    criarTabelas(){
        
       // Variaveis que quero guardar: id / login / num_commits / num_addlinhas / num_remlinhas

        const sql = 'CREATE TABLE IF NOT EXISTS Historico_commits (id int NOT NULL AUTO_INCREMENT, login varchar(50) NOT NULL, num_commits int NOT NULL, num_addlinhas int NOT NULL, num_remlinhas int NOT NULL, PRIMARY KEY(id))'

        


        this.conexao.query(sql, (erro,resultados) =>{
            if(erro){
                console.log(erro)
            }
            else{
                console.log('Tabela Histórico foi Criada/conectada com Sucesso')
                }

        })


    }
    
}


module.exports = new Tabelas
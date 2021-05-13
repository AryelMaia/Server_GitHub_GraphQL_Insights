const customExpress = require('./config/customExpress')
const conexao = require('./infraestrutura/conexao')
const Tabelas = require('./infraestrutura/tabelas')
const Dados_Abertos = require('./models/Dados_Abertos')


conexao.connect(erro => {

    if(erro) {

        console.log(erro)
    }
    else{

        console.log('Conectado com sucesso')
        
        Tabelas.init(conexao)
        
        Dados_Abertos.init()

        const app = customExpress()

        app.listen(3000, () => console.log('servidor rodando na porta 3000'))
    }

})



// Funcao para Responder uma requisicao de Get e dar respota


//app.get('/',(req,res) => res.send('Bem vindo ao servidor do Aryel Maia'))






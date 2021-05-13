const Dados_Abertos = require('../models/Dados_Abertos')

// Exportando para App a funcao abaixo

module.exports = app => {
    
    app.get('/insight',(req,res) => {

        Dados_Abertos.insight(res)
       
    })

    app.get('/',(req,res) => {

        //Dados_Abertos.insight(res)
        res.status(200).send("Hello World")
    })


}

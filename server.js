//configurando o servidor
const express = require('express');
const server = express();

//configurando o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com o banco de dados;

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//configurando template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
    express: server,
    noCache: true
})

//configurando apresentação da pagina
server.get('/', (req, res) => {

    const query = `SELECT * FROM donors`
    db.query(query, (err, result) => {
        if (err) return res.send('Falha ao realizar pesquisa');

        const donors = result.rows;
        return res.render('index.html', { donors });
    })


    
})

server.post('/', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == ''  || email == '' || blood == '') {
        return res.send("Todos os campos são obrigatórios");
    } 

    //coloco valores dentro do banco de dados
    const query = `
        INSERT INTO donors (name, email, blood) 
        values ($1, $2, $3)`;

    const values = [name, email, blood]
    db.query(query, values, (err, result) => {
        if (err) return res.send('erro no banco de dados')

        return res.redirect('/');  
    })   
})

//ligar o servidor e permitir acesso na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
})
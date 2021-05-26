const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

const rotaUsuarios = require('./routes/usuarios')
const rotaPedidos = require('./routes/pedidos')
const rotaDoacoes = require('./routes/doacoes')
const rotaEspecies = require('./routes/especies')
const rotaCategorias = require('./routes/categorias')





app.use(morgan('dev'));
//********* */
app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
app.use(bodyParser.json()); //json de entrada no parser

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

//    if (require.method ==='OPTIONS'){
//        return res.status(200).send({})
//    }

    next();
})

app.use('/usuarios', rotaUsuarios)
app.use('/pedidos', rotaPedidos)
app.use('/doacoes', rotaDoacoes)
app.use('/especies', rotaEspecies)
app.use('/categorias', rotaCategorias)


app.use((req,res,next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app;

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import rotaUsuarios from './routes/usuarios.js';
import rotaPedidos from './routes/pedidos.js';
import rotaDoacoes from './routes/doacoes.js';
import rotaEspecies from './routes/especies.js';
import rotaCategorias from './routes/categorias.js';
//----------------------
import http from "http";
import logger from "morgan";
import cors from "cors";
import socketio from "socket.io";

// mongo connection
import "./server/config/mongo.js";
// socket configuration
import WebSockets from "./server/utils/WebSockets.js";
// routes
import indexRouter from "./routes/chatRoutes/index.js";
import userRouter from "./routes/chatRoutes/user.js";
import chatRoomRouter from "./routes/chatRoutes/chatRoom.js";
// middlewares
import { decode } from './server/middlewares/jwt.js'

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(morgan('dev'));
//********* */
// app.use(bodyParser.urlencoded({ extended: false })); //apenas dados simples
// app.use(bodyParser.json()); //json de entrada no parser

app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header(
    //     'Access-Control-Allow-Headers',
    //     'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Max-Age'
    // );
    // res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    // if (require.method ==='OPTIONS'){
    //     return res.status(200).send({})
    // }
    res.header('Access-Control-Allow-Origin', 'request initiator or '*'');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK');
    res.header('Access-Control-Allow-Methods', 'request initiator or '*'');
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Expose-Headers', 'request initiator or '*'');

    next();
})


app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);

/** catch 404 and forward to error handler */
// app.use('*', (req, res) => {
//     return res.status(404).json({
//       success: false,
//       message: 'API endpoint doesnt exist'
//     })
//   });

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

const server = http.createServer(app);
/** Create socket connection */
global.io = socketio.listen(server);

global.io.on('connection', WebSockets.connection)

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

export default app;

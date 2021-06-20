import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import http from "http";
import logger from "morgan";
import cors from "cors";
import socketio from "socket.io";
import { decode } from './server/middlewares/jwt.js'
import WebSockets from "./server/utils/WebSockets.js";
import "./server/config/mongo.js";
import dotenv from 'dotenv'

// routes
import rotaUsuarios from './routes/usuarios.js';
import rotaPedidos from './routes/pedidos.js';
import rotaDoacoes from './routes/doacoes.js';
import rotaEspecies from './routes/especies.js';
import rotaCategorias from './routes/categorias.js';
import rotaCurtidas from './routes/curtidas.js';
import indexRouter from "./routes/chatRoutes/index.js";
import chatRoomRouter from "./routes/chatRoutes/chatRoom.js";
import { Console } from 'console';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const __dirname = path.resolve();

const app = express();

dotenv.config()

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(morgan('dev'));

//rotas
app.use("/", indexRouter);
app.use("/room", decode, chatRoomRouter);
app.use('/usuarios', rotaUsuarios)
app.use('/pedidos', rotaPedidos)
app.use('/doacoes', rotaDoacoes)
app.use('/especies', rotaEspecies)
app.use('/categorias', rotaCategorias)
app.use('/curtidas', rotaCurtidas)

app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

const server = http.createServer(app);

// Create socket connection 
global.io = socketio.listen(server);

global.io.on('connection', WebSockets.connection)

//handle errors
app.use((req, res, next) => {
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

export default app;
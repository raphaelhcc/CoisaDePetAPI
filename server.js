import http from 'http';
import app from './app.js';
const port = 3030;
const server = http.createServer(app);
//process.env.PORT || 
server.listen(port);
import { Router } from 'express';
import express from 'express';
import pool from '../database.js';
const router = express.Router();
import usuarios from '../server/controllers/usuarios.js';



router
  .get('/', usuarios.onGetAllUsers)
  .post('/', usuarios.onCreateUser)
  .get('/:uuid', usuarios.onGetUserByID)
  .patch('/', usuarios.onEditUserByID)
  .delete('/', usuarios.onDeleteUserByID)

export default router;

// // RETORNA OS USUÁRIOS
// router.get('/', (req, res, next) => {

//     pool.connect((err, client, done) => {
//         if(err) { 
//            return res.status(500).send({ error: err})
//         }
//         client.query(
//             'SELECT * FROM tb_usuario',
//             (err, result) => {
//                 done()
//                 if(err) { return result.status(500).send({ error: err}) }
//                 res.status(200).send({response: result})
//             }
//         )
//     }) 
// });

// // // INSERE USUÁRIO
// router.post('/', (req, res, next) => {

//     pool.connect((err, client, done) => {
//         if(err) { return res.status(500).send({ error: err}) }
//         client.query(
//             'INSERT INTO public.tb_usuario (uuid,cod_cpf, nom_nome, dt_nascimento, url_foto, nom_email) VALUES ($1, $2, $3, $4, $5, $6)',
//             [
//                 req.body.uuid,
//                 req.body.cod_cpf, 
//                 req.body.nom_nome,
//                 req.body.dt_nascimento, 
//                 req.body.url_foto,
//                 req.body.nom_email
//             ]
//             ,
//             (err, result) => {
//                 done();
//                 if(err) {return res.status(500).send({ error: err})}
//                 res.status(201).send({
//                     mensagem: 'Produto inserido com sucesso',
//                 });
//             }
//         )
//     })
// }); 

// // RETORNA UM USUARIO ESPECÍFICO
// router.get('/:uuid', (req, res, next) => {

//     pool.connect((err, client, done) => {
//         if(err) { return res.status(500).send({ error: err}) }
//         client.query(
//             'SELECT * FROM tb_usuario WHERE uuid = $1;',
//             [req.params.uuid],
//             (err, result) => {
//                 if(err) { return res.status(500).send({ error: err}) }
//                 return res.status(200).send({response: result})
//             }
//         )
//     })
// }); 

// // RETORNA OS DADOS DE UM PPRODUTO
// router.patch('/', (req, res, next) => {

//     pool.connect((err, client, done) => {
//         if(err) { return res.status(500).send({ error: err}) }
//         client.query(
//             `UPDATE tb_usuario
//                 SET nom_nome = $1, 
//                     dt_nascimento = $2,
//                     url_foto = $3,
//                     nom_email = $4
//                 WHERE uuid = $5`,
//             [
//                 req.body.nom_nome,
//                 req.body.dt_nascimento, 
//                 req.body.url_foto,
//                 req.body.nom_email,
//                 req.body.uuid
//             ],
//             (err, result) => {
//                 done();

//                 if(err) { return res.status(500).send({ error: err}) }

//                 res.status(202).send({
//                     mensagem: 'Produto alterado com sucesso'
//                 });
//             }
//         )
//     })
// }); 

// // DELETA UM PRODUTO
// router.delete('/', (req, res, next) => {

//     pool.connect((err, client, done) => {
//         if(err) { return res.status(500).send({ error: err}) }
//         client.query(
//             'DELETE FROM tb_usuario WHERE uuid = $1', [req.body.uuid],
//             (err, result) => {
//                 done();

//                 if(err) { return res.status(500).send({ error: err}) }

//                 res.status(202).send({
//                     mensagem: 'Produto excluido com sucesso'
//                 });
//             }
//         )
//     })
// }); 


// export default router;
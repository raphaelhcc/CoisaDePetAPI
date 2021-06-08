import { Router } from 'express';
import express from 'express';
import pool from'../database.js';
const router = express.Router();


// RETORNA AS 10 DOAÇÕES com mais curtidas
router.get('/doacao', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { 
           return res.status(500).send({ error: err})
        }
        client.query(
            'SELECT id_doacao, val_curtida FROM tb_doacao order by 2 DESC LIMIT 10',
            (err, result) => {
                done()
                if(err) { return result.status(500).send({ error: err}) }
                res.status(200).send({response: result})
            }
        )
    }) 
});

// // INSERE CURTIDA NA DOAÇÃO
router.put('/doacao', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            `UPDATE tb_doacao
                SET val_curtida = $1
            WHERE id_doacao = $2`,
            [
                req.body.val_curtida,
                req.body.id_doacao
            ]
            ,
            (err, result) => {
                done();
                if(err) { 
                    return res.status(500).send({ error: err}) }
                res.status(201).send({
                    mensagem: 'curtida inserida com sucesso',
                });
            }
        )
    })
}); 

// RETORNA AS 10 DOAÇÕES com mais curtidas
router.get('/pedido', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { 
           return res.status(500).send({ error: err})
        }
        client.query(
            'SELECT id_pedido, val_curtida FROM tb_pedido order by 2 DESC LIMIT 10',
            (err, result) => {
                done()
                if(err) { return result.status(500).send({ error: err}) }
                res.status(200).send({response: result})
            }
        )
    }) 
});

// // INSERE CURTIDA NO PEDIDO
router.put('/pedido', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            `UPDATE tb_pedido
                SET val_curtida = $1
            WHERE id_pedido = $2`,
            [
                req.body.val_curtida,
                req.body.id_pedido
            ]
            ,
            (err, result) => {
                done();
                if(err) { 
                    return res.status(500).send({ error: err}) }
                res.status(201).send({
                    mensagem: 'curtida inserida com sucesso',
                });
            }
        )
    })
}); 



export default router;
import { Router } from 'express';
import express from 'express';
import pool from'../database.js';
const router = express.Router();


// RETORNA AS DOAÇÕES
router.get('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { 
           return res.status(500).send({ error: err})
        }
        client.query(
            'SELECT * FROM tb_doacao',
            (err, result) => {
                done()
                if(err) { return result.status(500).send({ error: err}) }
                res.status(200).send({response: result})
            }
        )
    }) 
});

// // INSERE DOAÇÃO
router.post('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            `INSERT INTO tb_doacao (
                id_especie,
                id_categoria, 
                uuid, 
                id_subcategoria, 
                dsc_doacao,  
                dsc_cidade,
                dt_iniciodoacao,
                dt_fimdoacao,
                url_fotoproduto,
                flg_statusdoacao,
                val_curtida
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
                req.body.id_especie,
                req.body.id_categoria, 
                req.body.uuid,
                req.body.id_subcategoria, 
                req.body.dsc_doacao,
                req.body.dsc_cidade,
                req.body.dt_iniciodoacao,
                req.body.dt_fimdoacao,
                req.body.url_fotoproduto,
                req.body.flg_statusdoacao,
                req.body.val_curtida

            ]
            ,
            (err, result) => {
                done();
                if(err) { 
                    return res.status(500).send({ error: err}) }
                res.status(201).send({
                    mensagem: 'Doação inserida com sucesso',
                    id_pedido: result.insertId
                });
            }
        )
    })
}); 

// RETORNA UMA DOAÇAO ESPECÍFICA
router.get('/:id_doacao', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT * FROM tb_doacao WHERE id_doacao = $1;',
            [req.params.id_doacao],
            (err, result) => {
                done()
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 

// RETORNA TODAS AS DOAÇÕES DE UM USUÁRIO ESPECÍFICO
router.get('/uuid/:uuid', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT * FROM tb_doacao WHERE uuid = $1;',
            [req.params.uuid],
            (err, result) => {
                done()
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 

// RETORNA TODAS AS DOAÇÕES DE UMA CATEGORIA ESPECÍFICA
router.get('/categoria/:id_categoria', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT * FROM tb_doacao WHERE id_categoria = $1;',
            [req.params.id_categoria],
            (err, result) => {
                done()
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 

// ALTERA OS DADOS DE UM DOAÇÃO
router.patch('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            `UPDATE tb_doacao
                SET 
                id_especie = $1,
                id_categoria = $2 , 
                id_subcategoria = $3, 
                dsc_doacao = $4,  
                dsc_cidade = $5,
                dt_iniciodoacao = $6,
                dt_fimdoacao = $7,
                url_fotoproduto = $8,
                flg_statusdoacao = $9
                WHERE id_doacao = $10`,
            [
                req.body.id_especie,
                req.body.id_categoria, 
                req.body.id_subcategoria, 
                req.body.dsc_doacao,
                req.body.dsc_cidade,
                req.body.dt_iniciodoacao,
                req.body.dt_fimdoacao,
                req.body.url_fotoproduto,
                req.body.flg_statusdoacao,
                req.body.id_doacao
            ],
            (err, result) => {
                done();

                if(err) { return res.status(500).send({ error: err}) }

                res.status(202).send({
                    mensagem: 'Doação alterada com sucesso'
                });
            }
        )
    })
}); 

// DELETA UMA DOAÇÃO
router.delete('/', (req, res, next) => {
    
    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'DELETE FROM tb_doacao WHERE id_doacao = $1', [req.body.id_doacao],
            (err, result) => {
                done();

                if(err) { return res.status(500).send({ error: err}) }

                res.status(202).send({
                    mensagem: 'Doação excluida com sucesso'
                });
            }
        )
    })
}); 


export default router;
const { Router } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../database').pool;


// RETORNA OS PEDIDOS
router.get('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { 
           return res.status(500).send({ error: err})
        }
        client.query(
            'SELECT * FROM tb_especie',
            (err, result) => {
                done()
                if(err) { return result.status(500).send({ error: err}) }
                res.status(200).send({response: result})
            }
        )
    }) 
});


// RETORNA UMA ESPÉCIE ESPECÍFICA
router.get('/:id_especie', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT * FROM tb_especie WHERE id_especie = $1;',
            [req.params.id_especie],
            (err, result) => {
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 

module.exports = router;
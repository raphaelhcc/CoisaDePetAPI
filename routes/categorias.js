const { Router } = require('express');
const express = require('express');
const router = express.Router();
const pool = require('../database').pool;


// RETORNA AS CATEGORIAS
router.get('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { 
           return res.status(500).send({ error: err})
        }
        client.query(
            'SELECT * FROM tb_categoria',
            (err, result) => {
                done()
                if(err) { return result.status(500).send({ error: err}) }
                res.status(200).send({response: result})
            }
        )
    }) 
});


// RETORNA UMA CATEGORIA ESPECÍFICA
router.get('/:id_categoria', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT * FROM tb_categoria WHERE id_categoria = $1;',
            [req.params.id_categoria],
            (err, result) => {
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 


// RETORNA TODAS AS SUBCATEGORIAS DE UMA CATEGORIA
router.get('/escat/:id_categoria', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT id_subcategoria, nom_subcategoria FROM tb_doacao WHERE id_categoria = $1;',
            [req.params.id_categoria],
            (err, result) => {
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 

// RETORNA UMA SUBCATEGORIA ESPECÍFICA
router.get('/subcategorias/:id_subcategoria', (req, res, next) => {

    pool.connect((err, client, done) => {
        if(err) { return res.status(500).send({ error: err}) }
        client.query(
            'SELECT id_subcategoria, nom_subcategoria FROM tb_categoria WHERE id_subcategoria = $1;',
            [req.params.id_subcategoria],
            (err, result) => {
                if(err) { return res.status(500).send({ error: err}) }
                return res.status(200).send({response: result})
            }
        )
    })    
}); 




module.exports = router;
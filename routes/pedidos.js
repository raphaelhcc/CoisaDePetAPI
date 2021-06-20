import express from 'express';
import pool from '../database.js';
import multer from 'multer';
import multerConfig from './../server/config/multer.js';
import Post from './../server/models/Post.js'
const router = express.Router();


// RETORNA OS PEDIDOS
router.get('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).send({
                error: err
            })
        }
        client.query(
            'SELECT * FROM tb_pedido',
            (err, result) => {
                done()
                if (err) {
                    return result.status(500).send({
                        error: err
                    })
                }
                res.status(200).send({
                    response: result
                })
            }
        )
    })
});

//INSERE UM PEDIDO
router.post('/', multer(multerConfig).single("file"), async (req, res) => {
    const {
        originalname: name,
        size,
        key,
        location: url = ""
    } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url
    });

    pool.connect((err, client, done) => {
        if (err) {
            console.log(err)
        } else {
            console.log(post.url)

            client.query(
                `insert into tb_pedido
            (
              id_especie,
              id_categoria,
              uuid,
              id_subcategoria,
              dsc_pedido,
              dsc_cidade,
              dt_iniciopedido,
              dt_fimpedido,
              flg_statuspedido,
              dsc_idade,
              val_curtida,
              url_fotoproduto
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                    req.body.id_especie,
                    req.body.id_categoria,
                    req.body.uuid,
                    req.body.id_subcategoria,
                    req.body.dsc_pedido,
                    req.body.dsc_cidade,
                    req.body.dt_iniciopedido,
                    req.body.dt_fimpedido,
                    req.body.flg_statuspedido,
                    req.body.dsc_idade,
                    req.body.val_curtida,
                    post.url
                ], (err, result) => {
                    done();
                    if (err) {
                        return console.log(err)
                    } else {}
                }
            )
        }
    })
    return res.status(201).send(post);
});

// RETORNA UM PEDIDO ESPECÍFICO
router.get('/:id_pedido', (req, res, next) => {

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).send({
                error: err
            })
        }
        client.query(
            'SELECT * FROM tb_pedido WHERE id_pedido = $1;',
            [req.params.id_pedido],
            (err, result) => {
                done()
                if (err) {
                    return res.status(500).send({
                        error: err
                    })
                }
                return res.status(200).send({
                    response: result
                })
            }
        )
    })
});

// RETORNA TODOS OS PEDIDOS DE UM USUÁRIO ESPECÍFICO
router.get('/uuid/:uuid', (req, res, next) => {

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).send({
                error: err
            })
        }
        client.query(
            'SELECT * FROM tb_pedido WHERE uuid = $1;',
            [req.params.uuid],
            (err, result) => {
                done()
                if (err) {
                    return res.status(500).send({
                        error: err
                    })
                }
                return res.status(200).send({
                    response: result
                })
            }
        )
    })
});

// RETORNA TODOS OS PEDIDOS DE UMA CATEGORIA ESPECÍFICA
router.get('/categoria/:id_categoria', (req, res, next) => {

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).send({
                error: err
            })
        }
        client.query(
            'SELECT * FROM tb_pedido WHERE id_categoria = $1;',
            [req.params.id_categoria],
            (err, result) => {
                done()
                if (err) {
                    return res.status(500).send({
                        error: err
                    })
                }
                return res.status(200).send({
                    response: result
                })
            }
        )
    })
});

// ALTERA OS DADOS DE UM PEDIDO
router.patch('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).send({
                error: err
            })
        }
        client.query(
            `UPDATE tb_pedido
                SET 
                id_especie = $1,
                id_categoria = $2 , 
                id_subcategoria = $3, 
                dsc_pedido = $4,  
                dsc_cidade = $5,
                dt_iniciopedido = $6,
                dt_fimpedido = $7,
                url_fotoproduto = $8,
                flg_statuspedido = $9
                WHERE id_pedido = $10`,
            [
                req.body.id_especie,
                req.body.id_categoria,
                req.body.id_subcategoria,
                req.body.dsc_pedido,
                req.body.dsc_cidade,
                req.body.dt_iniciopedido,
                req.body.dt_fimpedido,
                req.body.url_fotoproduto,
                req.body.flg_statuspedido,
                req.body.id_pedido
            ],
            (err, result) => {
                done();

                if (err) {
                    return res.status(500).send({
                        error: err
                    })
                }

                res.status(202).send({
                    mensagem: 'Produto alterado com sucesso'
                });
            }
        )
    })
});

// DELETA UM PEDIDO
router.delete('/', (req, res, next) => {

    pool.connect((err, client, done) => {
        if (err) {
            return res.status(500).send({
                error: err
            })
        }
        client.query(
            'DELETE FROM tb_pedido WHERE id_pedido = $1', [req.body.id_pedido],
            (err, result) => {
                done();

                if (err) {
                    return res.status(500).send({
                        error: err
                    })
                }

                res.status(202).send({
                    mensagem: 'Produto excluido com sucesso'
                });
            }
        )
    })
});


export default router;
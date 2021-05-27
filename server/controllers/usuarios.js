import pool from '../../database.js';


export default {
    onGetAllUsers: async (req, res) => {
    
        pool.connect((err, client, done) => {
            if(err) { 
               return res.status(500).send({ error: err}) 
            }
            client.query(
                'SELECT * FROM tb_usuario',
                (err, result) => {
                    done()
                    if(err) { return result.status(500).send({ error: err}) }
                    res.status(200).send({response: result})
                }
            )
        }) 
    },
    
    // // INSERE USUÁRIO
    onCreateUser: async (req, res) => {
    
        pool.connect((err, client, done) => {
            if(err) { return res.status(500).send({ error: err}) }
            client.query(
                'INSERT INTO public.tb_usuario (uuid,cod_cpf, nom_nome, dt_nascimento, url_foto, nom_email) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    req.body.uuid,
                    req.body.cod_cpf, 
                    req.body.nom_nome,
                    req.body.dt_nascimento, 
                    req.body.url_foto,
                    req.body.nom_email
                ]
                ,
                (err, result) => {
                    done();
                    if(err) {return res.status(500).send({ error: err})}
                    res.status(201).send({
                        mensagem: 'Produto inserido com sucesso',
                    });
                }
            )
        })
    },

    // RETORNA UM USUARIO ESPECÍFICO
    onGetUserByID: async (req, res) => {
    
        pool.connect((err, client, done) => {
            if(err) { return res.status(500).send({ error: err}) }
            client.query(
                'SELECT * FROM tb_usuario WHERE uuid = $1;',
                [req.params.uuid],
                (err, result) => {
                    done()
                    if(err) { return res.status(500).send({ error: err}) }
                    return res.status(200).send({response: result})
                }
            )
        })
    },

    // RETORNA UM USUARIO ESPECÍFICO
    onGetUsersByIDs: async (ArrayIDs) => {
    
        pool.connect((err, client, done) => {
            client.query(
                'SELECT * FROM tb_usuario WHERE uuid = $1 OR $2;',
                [ArrayIDs[0], ArrayIDs[1]],
                (err, result) => {
                    done()
                    return result
                }
            )
        })
    },

    onLogUserByID: async (props) => {
            pool.connect((err, client, done) => {
                //if(err) { return res.status(500).send({ error: err}) }
                client.query(
                    'SELECT * FROM tb_usuario WHERE uuid = $1;',
                    [props],
                    (err, result) => {
                        done()
                        // if(err) { return res.status(500).send({ error: err}) }
                        return result
                    }
                )
            })
    },
    
    // RETORNA OS DADOS DE UM PPRODUTO
    onEditUserByID: async (req, res) => {    
        pool.connect((err, client, done) => {
            if(err) { return res.status(500).send({ error: err}) }
            client.query(
                `UPDATE tb_usuario
                    SET nom_nome = $1, 
                        dt_nascimento = $2,
                        url_foto = $3,
                        nom_email = $4
                    WHERE uuid = $5`,
                [
                    req.body.nom_nome,
                    req.body.dt_nascimento, 
                    req.body.url_foto,
                    req.body.nom_email,
                    req.body.uuid
                ],
                (err, result) => {
                    done();
    
                    if(err) { return res.status(500).send({ error: err}) }
    
                    res.status(202).send({
                        mensagem: 'Produto alterado com sucesso'
                    });
                }
            )
        })
    },

    
    // DELETA UM PRODUTO
onDeleteUserByID: async (req, res) => {    
        pool.connect((err, client, done) => {
            if(err) { return res.status(500).send({ error: err}) }
            client.query(
                'DELETE FROM tb_usuario WHERE uuid = $1', [req.body.uuid],
                (err, result) => {
                    done();
    
                    if(err) { return res.status(500).send({ error: err}) }
    
                    res.status(202).send({
                        mensagem: 'Produto excluido com sucesso'
                    });
                }
            )
        })
    } 
}

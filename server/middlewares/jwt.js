import jwt from 'jsonwebtoken';
import pool from '../../database.js';

// models

const SECRET_KEY = 'some-secret-key';

export const encode = async (req, res, next) => {
  try {
    const { uuid } = req.params;

    pool.connect((err, client, done) => {
      client.query(
        'SELECT * FROM tb_usuario WHERE uuid = $1;',
        [uuid],
        (err, result) => {
          const usuario = result;
          console.log(usuario)
          const payload = {
            userId: usuario.uuid,
          };
          const authToken = jwt.sign(payload, SECRET_KEY);
          req.authToken = authToken;
          next();
          return result
        }
      )
    })


  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.error
    });
  }
}

export const decode = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({
      success: false,
      message: 'No access token provided'
    });
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    req.userType = decoded.type;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
}
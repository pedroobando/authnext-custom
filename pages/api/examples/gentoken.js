// This is an example of how to read a JSON Web Token from an API route
import jwt from 'next-auth/jwt';
import JWT from 'jsonwebtoken';

const secret = process.env.SECRET_KEY;
const secretJWT = process.env.SECRET_JWT;
const expiresIn = process.env.EXPIRES_IN;
const algorithm = process.env.ALGORITHM;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  if (token) {
    const digitalToken = await createToken(token);
    res.status(200).send({ token: digitalToken });
  } else {
    res.status(401).send({ token: null });
  }
};

const createToken = (usuario) => {
  const { sub, name, email } = usuario;
  return JWT.sign({ name, email, sub }, secretJWT, {
    expiresIn,
    algorithm,
  });
};

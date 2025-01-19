const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(403).send({ message: 'Token missing or unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN); 
    req.user = decoded;
    next(); 
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).send({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;

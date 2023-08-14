const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

const authenticateAdmin = (req, res, next) => {
 const admintoken = req.body.jwtToken
 console.log('adminmiddleware token is',admintoken)
};

module.exports = authenticateAdmin;
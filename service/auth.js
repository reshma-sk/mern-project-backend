const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(user) {
  //console.log("JWT secret:", process.env.JWT_SECRET);
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullName:user.fullName,
      role: user.role, // include role in token
    },
    process.env.JWT_SECRET,  
    { expiresIn: "5m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { _id: user._id, fullName:user.fullName,},
    process.env.REFRESH_SECRET, // New env var
    { expiresIn: "10m" }
  );
}


function verifyAccessToken(token) {
  if (!token) return null;
  try {
    const decode =  jwt.verify(token, process.env.JWT_SECRET);
    return decode;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}


function verifyRefreshToken(token) {
  if (!token) return null;
  try {
    const decode =  jwt.verify(token, process.env.REFRESH_SECRET);
    return decode;
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
}
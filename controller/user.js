const User = require("../models/user");
//const jwt = require("jsonwebtoken");
const { generateAccessToken ,generateRefreshToken,verifyRefreshToken} = require("../service/auth");
const bcrypt = require("bcrypt");
const { body,validationResult } = require('express-validator');

//get all users
async function handleGetAllUsers(req, res) {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
}


//create new user
async function handleCreateNewUser(req, res) {
  const errors = validationResult(req);
  // Check for validation errors first
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password} = req.body;
  //hasinh password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await User.create({
      fullName: fullName,
      email: email,
      
      password: hashedPassword,
    });
    return res.status(201).json({ msg: "Success", id: result._id });
    
  } catch (error) {
    
    res.status(500).json({ error: "Please give unique values.", message:error.message })  
  }
  
}

//login
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // ✅ Await the DB call
    console.log(user);
    
    if (!user) {
      return res.status(400).json({ error: "Invalid Email or Password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }
    
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Send refreshToken in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 10* 60 * 1000, // 10mnts
    });
    //
    return res.status(200).json({ 
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      }
    });//client stores this
  } catch (error) {
    //console.error("Login error:", error);
    res.status(500).json({ error: "Something went wrong on the server", message:error.message });
  }
}
async function  handleProtected(req, res) {
  console.log(req.user);
  
  
  return res.json({ user:req.user});
};

async function handleRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload._id);
    if (!user) return res.sendStatus(401);

    const newAccessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
}

// controller/user.js
async function handlePromoteToAdmin(req, res) {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User promoted to admin successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}




/* function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split('')[1]
  if(token == null) return res.status(401).json({error:'invalid token'})

  jwt.verify(token,process.env.JWT_SECRET)
} */
module.exports = {
  handleCreateNewUser,
  handleGetAllUsers,
  handleUserLogin,
  handleProtected,
  handleRefreshToken,
  handlePromoteToAdmin,
  
};

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const admintoken = require('../middlewares/adminToken')
const jwt_decode = require('jwt-decode')
require('dotenv').config()
// import jwt_decode from 'jwt-decode';
const secretkey = process.env.JWT_SECRET

router.get('/',(req,res)=>{
    res.send('auth function')
})


router.get('/gettoken',(req,res)=>{
    const token = req.headers['Authorization'];
    if (token){
        res.send(token)
    }
    else{
        res.send('error')
    }
})

router.post('/register' , async (req, res) => {
    console.log('saving user to database');
    console.log(req.formData);
    const getpass = req.body.password
    hashedpassword = await bcrypt.hash(getpass,10)
    
    const newRegUser = {
        email: req.body.email,
        username: req.body.username,
        firstName: req.body.firstName,
        middleName: "",
        lastName: req.body.lastName,
        password: hashedpassword,
        panNumber: req.body.panNumber,
        phoneNumber: req.body.mobilenumber,
        money: 1000,
        createdAt: new Date(),
        coursesCompleted: 3,
    };

    const newUser = new User(newRegUser);

    try {
        const savedUser = await newUser.save();
        console.log('New user saved:', savedUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
});

router.post('/login', async(req,res)=>{
    
    console.log("This is the login page");
    
    const  name = req.body.name
    const password = req.body.pass
    const user = await User.findOne({ username : name});

    if (user && await bcrypt.compareSync(password, user.password)) {
        console.log(user.username)
        const admin = (user.username === 'ADMIN'); // Check if user is admin
        console.log('admin is', admin);

        const payload = {
            id: user.id,
            username: user.username,
            password: user.password,
            admin: admin, // Set admin flag based on the check
        };
        const token = jwt.sign(payload, secretkey, { expiresIn: '1h' });
        res.header('Authorization', `Bearer ${token}`);    //token saved in header
       

       
        
        res.json({ message: 'Login successful', jwttoken : token, admin : admin});
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


router.post('/adminverify' ,  async(req,res)=>{
   console.log('admin verify route')
   const admintoken = req.body.jwtToken
   const decodedToken = jwt_decode(admintoken);
   console.log(decodedToken)
   const isAdmin = decodedToken.admin;
   if(isAdmin){
    res.send({adminroute : true})
   }
   else{
    res.send({adminroute : false})
   }
})

// Deposit money
router.post("/deposit", async (req, res) => {
    const { username, amount } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("dep1")
      user.money += amount;
      await user.save();
      console.log("dep2")
      return res.status(200).json({ message: "Deposit successful" });
    } catch (error) {
      console.error("Deposit error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Withdraw money
  router.post("/withdraw", async (req, res) => {
    const { username, amount } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.money < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      user.money -= amount;
      await user.save();
  
      return res.status(200).json({ message: "Withdrawal successful" });
    } catch (error) {
      console.error("Withdraw error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
 
  router.post("/updatesubscription", async (req, res) => {
    const { username, subscriptionType } = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { username },
        {
          subscriptionType,
          subscriptionAt: new Date(), // Set the subscription date to the current date
        },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Subscription updated successfully", user });
    } catch (error) {
      console.error("Subscription update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router
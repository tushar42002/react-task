const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Tusharisgood@boy";

//Route1 =  validation using express-validator 
router.post('/Createuser', [
   body('name').isLength({ min: 3 }),
   body('email').isEmail(),
   body('mobile').isLength(10),
   body('password').isLength({ min: 8 })
], async (req, res) => {

   let success = false;

   const errors = validationResult(req);
   // sending error if occured in validation
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() })
   }
   try {
      // cheack if user with this email exist or  not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({success, error: "sorry user with email alredy exists" })
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)
      //create new users
      user = await User.create({
         name: req.body.name,
         email: req.body.email,
         mobile: req.body.mobile,
         password: secPass
      })

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      // res.json({user});
      res.json({ success, authtoken });

   } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal error occurd");
   }
})


// route2  = Authenticate a user  using : post "/api/auth/login"
router.post('/login', [
   body('email', "enter valid email").isEmail(),
   body('password', "password cannot be blank").exists()
], async (req, res) => {
   let success = false;
   const errors = validationResult(req);
   // sending error if occured in validation
   if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() })
   }

   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({success, error: "invalid detail" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
         return res.status(400).json({ error: "invalid detail" });
      }

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken });

   } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal error occurd");
   }
})





//route3 : get logged in user data using  : post "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res)=>{
   try {
      let userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      res.send(user)
   } catch (error) {    
      console.error(error.message);
      res.status(500).send("some internal error occurd");
   }
})


router.put('/updateuser/:id', fetchuser, async (req, res) => {
   const { name, email, mobile} = req.body;

   try {
        // creating a newUser object
        const newUser = {name: name, email: email, mobile: mobile};
    
        // Find the USER to be updated and updete it
        let USER = await User.findById(req.params.id);
        if (!USER) { return res.status(400).send("not found") }

        USER = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
        res.json({ USER });
   } catch (error) {
        console.error(error);
        res.status(500).send("some internal error occurd");
   }
})


module.exports = router

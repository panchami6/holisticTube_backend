const express = require("express");
const router = express.Router();
const { TubeUser } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {registerValidation, loginValidation} = require("./validation");

router.get('/', async (req, res) => {
    const user = await TubeUser.find();
    res.json({ success: "true", user });
  })

router.post('/register', async(req,res) => {
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const emailExists = await TubeUser.findOne({email: req.body.email});
  if(emailExists) return res.status(400).send("Email already Exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new TubeUser({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    watchLater: [],
    playlist: []
  });
   try{
    const savedUser = await user.save();
    res.json({success: true, user: savedUser})
   }
  catch(err){
    res.status(400).send(err);
  }
});

router.post("/login", async (req,res) => {
  const { error } = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const user = await TubeUser.findOne({ email: req.body.email })
  if(!user) return res.status(400).send("Email or Password is wrong");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send("Email or Password is wrong")

  const TOKEN_SECRET = process.env['TOKEN_SECRET'];

  const token = jwt.sign({_id: user._id}, TOKEN_SECRET);
  console.log("logged in")
  res.json({user, token})
})


module.exports = router;
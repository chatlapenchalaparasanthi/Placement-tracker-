const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://test:test@cluster0.mongodb.net/placementDB')
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.log(err));

// Models
const userSchema = new mongoose.Schema({
  name:String, email:{type:String,unique:true}, password:String, role:{type:String,default:'student'}, cgpa:String, branch:String
});
const companySchema = new mongoose.Schema({
  name:String, role:String, ctc:String, eligibility:String, deadline:String, description:String, createdAt:{type:Date,default:Date.now}
});
const applicationSchema = new mongoose.Schema({
  userId:String, companyId:String, companyName:String, status:{type:String,default:'Applied'}, appliedAt:{type:Date,default:Date.now}
});

const User = mongoose.model('User', userSchema);
const Company = mongoose.model('Company', companySchema);
const Application = mongoose.model('Application', applicationSchema);

// Routes
app.get('/', (req,res)=> res.send('Placement Tracker 333 API Running - https://placement-tracker333.onrender.com'));

// Get Companies
app.get('/api/companies', async(req,res)=>{
  const companies = await Company.find().sort({createdAt:-1});
  res.json(companies);
});

// Add Company (Admin)
app.post('/api/companies', async(req,res)=>{
  const company = new Company(req.body);
  await company.save();
  res.json(company);
});

// Signup
app.post('/api/signup', async(req,res)=>{
  const {name,email,password,branch,cgpa} = req.body;
  const hashed = await bcrypt.hash(password,10);
  try{
    const user = await User.create({name,email,password:hashed,branch,cgpa});
    res.json({message:'User Created', user});
  }catch(e){ res.status(400).json({error:'Email exists'}); }
});

// Login
app.post('/api/login', async(req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:'User not found'});
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) return res.status(400).json({error:'Invalid password'});
  const token = jwt.sign({id:user._id}, 'secret123');
  res.json({token, user});
});

// Apply
app.post('/api/apply', async(req,res)=>{
  const {userId, companyId, companyName} = req.body;
  const existing = await Application.findOne({userId, companyId});
  if(existing) return res.status(400).json({error:'Already Applied'});
  const app = await Application.create({userId, companyId, companyName});
  res.json(app);
});

// My Applications
app.get('/api/my-applications/:userId', async(req,res)=>{
  const apps = await Application.find({userId:req.params.userId});
  res.json(apps);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));

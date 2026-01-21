const server_js = 
const express = require('express');
const fs = require('fs');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static('.'));

let users = {};
if(fs.existsSync('users.json')) users = JSON.parse(fs.readFileSync('users.json'));

const razorpay = new Razorpay({key_id:'<YOUR_LIVE_KEY>',key_secret:'<YOUR_KEY_SECRET>'});

app.post('/signup',(req,res)=>{
    const {email,password} = req.body;
    if(users[email]) return res.json({success:false,message:'User already exists'});
    users[email]={password,purchases:[]};
    fs.writeFileSync('users.json',JSON.stringify(users,null,2));
    res.json({success:true,message:'Signup successful'});
});

app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    if(users[email] && users[email].password===password) res.json({success:true,message:'Login successful'});
    else res.json({success:false,message:'Invalid email or password'});
});

app.post('/createOrder',async(req,res)=>{
    const {subject} = req.body;
    try{
        const options = {amount:2000,currency:'INR',receipt:subject+'_'+Date.now()};
        const order = await razorpay.orders.create(options);
        res.json(order);
    }catch(e){res.json({error:'Failed to create order'})}
});

app.post('/verifyPayment',(req,res)=>{
    const {response,subject} = req.body;
    // In real app, verify signature
    users[response.email].purchases.push(subject);
    fs.writeFileSync('users.json',JSON.stringify(users,null,2));
    res.json({success:true});
});

app.listen(3000,()=>console.log('Server running on port 3000'));
;}
//import dataservice file
const dataService=require('./service/dataservice')


//import cors
const cors=require("cors")


//import express
const express=require("express")


//import json web token
const jwt=require('jsonwebtoken')


//create app using express
const app=express()

//connection string to frontend integration
app.use(cors({origin:'http://localhost:4200'}))

//to parse json data from req body
app.use(express.json())               //convert the incoming data to js


//middleware
const jwtMiddleware=(req,res,next)=>{

  try{
    const token=req.headers['access_token']
  //verify token
 const data=jwt.verify(token,"secretkey123")
 console.log(data);
 console.log("-----middleware---");
 next()
}
catch{
  res.status(422).json({
    statusCode:422,
    status:false,
    message:'please login first'
  })
}
}


// register
app.post('/register',(req,res)=>{

  dataService.register(req.body.uname,req.body.acno,req.body.psw).then(result=>{ 
    res.status(result.statusCode).json(result)})
   //convert object to json and send as response
 
})


// login
app.post('/login',(req,res)=>{

 dataService.login(req.body.acno,req.body.psw).then(result=>{res.status(result.statusCode).json(result)})
  //convert object to json and send as response
 
})


//deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{

  dataService.deposit(req.body.acnum,req.body.password,req.body.amount).then(result=>{res.status(result.statusCode).json(result)})
  //convert object to json and send as response
 


})
app.post('/withdraw',jwtMiddleware,(req,res)=>{

  dataService.withdraw(req.body.acnum,req.body.password,req.body.amount).then(result=>{res.status(result.statusCode).json(result)})
  //convert object to json and send as response
 
})
app.post('/transaction',jwtMiddleware,(req,res)=>{

dataService.getTransaction(req.body.acno).then(result=>{res.status(result.statusCode).json(result)})
  //convert object to json and send as response

})






//request
// app.get('/',(req,res)=>{res.send('get method 23')})

// app.put('/',(req,res)=>{res.send('put method')})

// app.patch('/',(req,res)=>{res.send('patch method')})

// app.delete('/',(req,res)=>{res.send('delete method')})

//delete
app.delete('/delete/:acno',jwtMiddleware,(req,res)=>{
  dataService.deleteAcc(req.params.acno).then(result=>{
    res.status(result.statusCode).json(result)
  })
})

//create port 
app.listen(3000,()=>{console.log("server started at port number 3000");})


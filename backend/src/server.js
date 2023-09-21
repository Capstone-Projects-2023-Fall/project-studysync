import express from 'express'

//Temporary database for testing api endpoints 
let testArray = [
    {
        name:"Harris",
        major:"Computer Science"
    },
    {
        name:"Bob",
        major:"Business"
    },
    {
        name:"John",
        major:"Art"
    },        
]


const app =  express();
app.use(express.json());



app.get('/test',(req,res)=>{
   
    res.send(`Hello, get request successfully tested.`);
})

app.get('/test/:name',(req,res)=>{
   const {name} = req.params;
   const _name = testArray.find(a => a.name === name);
   if(_name){
        res.send(`${_name.name}'s major is ${_name.major}.`);
   }else{
        res.send(`Error! ${name} not found in database.`);
   }
})


app.listen(8000,()=>{
    console.log('Server is lisenting on port 8000');
})
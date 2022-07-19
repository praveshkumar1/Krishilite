const express=require('express');
const app=express();
const bcrypt= require('bcrypt');
app.use(express.urlencoded({extended:false}))
const mongoose = require('mongoose');
const { render, redirect, type } = require('express/lib/response');
const fs=require('fs');
const res = require('express/lib/response');
const { stringify } = require('querystring');
const { publicDecrypt } = require('crypto');
const http=require('http');

const req = require('express/lib/request');
const { url } = require('inspector');
app.use(express.static('public'));


//mongoose connection
mongoose.connect("mongodb://localhost:27017/pbl").then(()=>{
    console.log("connection established");
    
}).catch((err)=>{
console.log(err);
});
app.all("/profile_*", async(req, res) => {
   var urls=req.url
    console.log(urls);
    allurls=await Farmer.find({})
    if(urls[8]=='_'){
       
    for (let i = 0; i < allurls.length; i++) {
       if(urls==`/profile_${allurls[i]._id}`){
       Farmer.find({_id:allurls[i]._id},function(err,abc){
        res.render('profiledirect.ejs',{details:abc})
       })
       }
        
    }      
    }
    console.log(urls[8]); 
    // next();
});
// '/api/*'
//defining mongoose schema
const schemaUse=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        dname:String,
        email:String,
        password:String,
        location:String,
        crop:String,
        number:String,
        quantity:String,
        price:{
            
            default:'-',
            type:String
           
    
},
        Date:{
            type:Number,
            default:Date.now()
        },
        Likes:{
            default:0,
            type:Number
        },
        Connections:{
            default:0,
            type:Number
        },
        Connectionsname:{
     default:'-',
     type:String
        }
        
       
    }
)
const Farmer=new mongoose.model("records",schemaUse);

const schemaUse2=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        dname:String,
        email:String,
        password:String,
        number:String,
       crop:{
        default:'-',
        type:String
       },
        location:{
            
                default:'-',
                type:String
               
        },
        quantity:{
            
                default:'-',
                type:String
               
        },
        price:{
            
                default:'-',
                type:String
               
        
    },
    Likes:{
        default:0,
        type:Number
    },
    Connections:{
    default:0,
    type:Number

},
Connectionsname:{
    default:'-',
    type:String
       }
}
)
const indus=new mongoose.model("record",schemaUse2)
//post and redirecting to pages

app.post('/register',async (req,res)=>{
    
    
    // try{
        

    //     const hashedPassword= await bcrypt.hash(req.body.password,10)
    //      users.push({
    //          id:Date.now().toString(),
    //          name:req.body.name,
    //          email:req.body.email,
    //          password:hashedPassword,
    //          location:req.body.location,
            
    //      })
    //      res.redirect('/login')
    // } catch{
    //   res.redirect('/register');
   
    // }

    try{  
        var farmername=`f_${req.body.name}`;
        const Farmerdetails=new Farmer({
       
        name :req.body.name,
        dname:farmername,
        email :req.body.email,
       password :req.body.password,
       location:req.body.location,
       crop:req.body.crop,
       number:req.body.contact,
       quantity:req.body.quantity
       })

       const farresult= await Farmer.find({});
       
    //    for (let i = 0; i < farresult.length; i++) {
    //        app.get(`profile${farresult[i]._id}`,(req,res)=>{
    //         res.render('profiletest.ejs')
    //        })
           
    //    }
        // console.log(farresult[0]);
  for (let i = 0; i < farresult.length; i++) {
    var flag=0;
    if (farresult[i].email==req.body.email) {
        flag=+1;
        break;
    }
    
    
  }
  if(flag>=1){
    res.render('alreadyregistered.ejs')
  }else{
res.redirect('/login')
  const result=await Farmer.create(Farmerdetails);
  console.log(result);
  }
 



      
       
    }catch(error){
console.log(error);
       }

})

//posting the industrialist data :
app.post('/regind',async(req,res)=>{
  try {
    indusname=`b_${req.body.name}`;
    const industrialistdetails=new indus({
        name:req.body.name,
        dname:indusname,
        email:req.body.email,
        number:req.body.number,
        password:req.body.password
    })
const indresult = await indus.find({});

    for(let i=0;i<indresult.length;i++){
        var flag=0;
        if(req.body.email==indresult[i].email){
            flag=flag+1;
            break;
        }
    }

    if(flag>=1){
       return res.render('alreadyregistered.ejs')
    }
    else{
        res.render('login.ejs')
        const indusdata= await indus.create(industrialistdetails);
        console.log(indusdata);
       
    }

  
    

  } catch (error) {
    console.log(error);
  }


})

//setting the view engine
app.set('view-engine','ejs')



//get requests
app.get('/login',(req,res)=>{
                    
   res.render('login.ejs');

    }) 
 app.get('/',(req,res)=>{
        res.render('index.ejs');
    })
app.get('/regind',(req,res)=>{
    res.render('regind.ejs');
})  


  


app.get('/register',(req,res)=>{
    res.render('register.ejs')
    console.log(req.body.name);
})
app.get('/users',(req,res)=>{
    
    Farmer.find({dname:{$in:[/^f_/]}},function(err,xyz){
        res.render('user.ejs',{
            farmername:xyz
        })
    }).sort({_id:-1})
  
})

// app.get('/industrialist-reg',(req,res)=>{
//     res.render('regind.ejs')
// })



app.post('/users',async(req,res)=>{

    var enteredcrop=req.body.crop;
    console.log(enteredcrop);
    var enteredlocation=req.body.location;
   console.log(enteredlocation);
  return  Farmer.find({$or:[{'location':enteredlocation},{'crop':enteredcrop}]},function(err,xyz){
        res.render('user.ejs',{
            farmername:xyz
        })
    }).clone()
})

app.post('/likes',async(req,res)=>{

 
   
    const checkboxid=req.body.checkbox;
    try {
        const tempdata=await Farmer.updateOne({_id:checkboxid},{
            $inc:{
                Likes:1
            },
        },{
            upsert:true
        })
        
    } catch (error) {
        console.log(error);
    }
    res.redirect('/users')
})

// $or: [ { status: "A" }, { age: { $lt: 30 } } ]
app.get('/industrialist-reg',async(req,res)=>{
    indus.find({'dname':{$in:[/^b_/]}},function(err,xyz){
        res.render('userind.ejs',{
            indusdetails:xyz
        })
    }).sort({_id:-1})
})
app.post('/industrialist-reg',async(req,res)=>{
    searchedcrop=req.body.search
     searchedlocation=req.body.location
    return indus.find({'dname':{$in:[/^b_/]},'crop':searchedcrop},function(err,xyz){
        res.render('userind.ejs',{
            indusdetails:xyz
        })
    }).clone()
})

// app.get('/profile',(req,res)=>{
//     res.render('profile.ejs')
// })







//post request of login

var username;
var useremail;
app.post('/login',async (req,res)=>{
   username=req.body.name;
   useremail=req.body.email;
 const result=await Farmer.find({}).sort({_id:-1})

   
try{
    for (let i = 0; i < result.length; i++) {
        
        if(req.body.email==result[i].email){
            console.log(result[i].name+','+result[i].email+','+result[i].password);
            console.log(i);
            // console.log(result);
            if(req.body.password==result[i].password){
            
            
             
             console.log('success');
            res.redirect('/index1')
                
    


                
                
            }else{
                return res.render('incorrectpass.ejs')
            }
            
            
        }
    
}
}
catch (error) {
        console.log(error);
    }



})

// for (let i = 0; i < 20 ; i++) {
//   app.get(`profile_${ farresults[i].id}`)
    
// }

// app.get('/profile_id')



app.get('/connections',async(req,res)=>{
    console.log(username);
   Farmer.find({name:username},function(err,abc){
    res.render('connec.ejs',{connecdetails:abc})
   })
})

var connectionstempname;
app.post('/connec',async(req,res)=>{
    const checkbox_connecid=req.body.checkbox_connec
    console.log(checkbox_connecid);
    const connecdetails=await Farmer.find({_id:checkbox_connecid});
    
    connectionstempname=`${connecdetails[0].Connectionsname},${username}`
    console.log(connectionstempname);
    try {
        const tempdata=await Farmer.updateOne({_id:checkbox_connecid},{
            $inc:{
              Connections:1
            },
            $set:{
                Connectionsname:connectionstempname
            }
        },{
            upsert:true
        })
        
    } catch (error) {
        console.log(error);
    }
   res.redirect('/users')
})
// app.get('/connec',(req,res)=>{
    
// })
app.get('/index1',(req,res)=>{
    res.render('index1.ejs',{name:username})
})

app.get('/profile',(req,res)=>{
    indus.find({'name':username},function(err,abc){
        res.render('profile.ejs',{
            details:abc
        })
    
    })
//   return res.render('profile.ejs',{profilename:username})
})
app.get('/extrainfo',(req,res)=>{
    res.render('extrainfo.ejs',{profilename:username,profileemail:useremail})
})

app.post('/extrainfo',async(req,res)=>{
    try {
       
          const tempresult=await indus.updateOne({'name':username},{
              
            $set:{
                crop:req.body.crop,
                quantity:req.body.quantity,
                price:req.body.price,
                location:req.body.location
            }
        }, { upsert: true }  )
       
        console.log(tempresult);
        res.redirect('/profile')
    } catch (error) {
        console.log(error);
    }
    })
    
app.listen(3100,()=>{
    console.log("connection established at port 3100");
})
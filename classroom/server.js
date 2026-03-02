const express = require("express");
const app = express();
const port = 3000;
const users=require("./routes/user.js");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
const path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));

app.use(session({secret:"mysupersecretstring" ,resave:false,saveUninitialized:true}));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

//part of express session

app.get("/reqcount",(req,res)=>{    //this function count the how many times 
                                /////link was refreshed and save this count to re.session.count
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count} times`);
    
});

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;         //stored
    //res.send(name);
    if(name==="anonymous")
    {
        req.flash("error","user not registerd");
    }
    else{
        req.flash("success","user registered successfully");
    }
    
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{                       //access or used information
    //res.render("page.ejs",{name:req.session.name, msg:req.flash("success")});  //contact-flash method
    res.render("page.ejs",{name:req.session.name});     //res.local
});

// app.get("/test",(req,res)=>{               //create session id in the cookies connect.sid
//     res.send("test successfully");
// })


//part of cookies

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("working!!");
// });

// ///to access and read cookies
// app.get("/greet",(req,res)=>{
//     let{name="anonymous"}=req.cookies;
//     res.send(`Hi ${name}`);
// });

// //signed cookies
// app.get("/signedcookies",(req,res)=>{
//     res.cookie("country","USA",{signed:true});
//     res.send("done");
// });
// ///verify cookie
// app.get("/verify",(req,res)=>{
//     console.dir(req.signedCookies);
//     res.send("verfied");
// })


// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("madeIn","India");
//     res.send("we send a cookies");
// });

app.use("/users",users);



app.listen(port,()=>{
    console.log(`listenning your port ${port}`);
});
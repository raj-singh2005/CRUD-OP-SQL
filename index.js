const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require("uuid");
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sql_app',
    password:'Vnet@123'
  });

  
let getRandomUser = ()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),

  ];
};



//home route api 
app.get("/",(req,res)=>{
  let q = "SELECT COUNT(*) FROM user";
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
     let count = result[0]["COUNT(*)"];
      res.render("home.ejs",{count});

    });
  }catch(err){
    console.log(err);
    res.send("some error in db");
  }
 
 
  
});

//show all users route api 
app.get("/user",(req,res)=>{
  let q = "SELECT * FROM user";
  try{
    connection.query(q,(err,result)=>{
    if(err) throw err ;
     res.render("users.ejs",{result});
    });
  }catch(err){
    console.log(err);
    res.send("some errr in db");
  }
})

//edit route api 
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params ;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
    if(err) throw err ;
    let user = (result[0]);
    res.render("edit.ejs",{user});
    });
  }catch(err){
    res.send("some error in DB");
  }
 
});

//update route api 
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params ;
  let {password: formPass , username: newUsername} = req.body ;
  let q = `SELECT * FROM user WHERE id='${id}'`; 
  try{
    connection.query(q,(err,result)=>{
    if(err) throw err ;
    let user = result[0];
    if(formPass != user.password){
      res.send("wrong password");
    }else{
      let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
      connection.query(q2,(err,result)=>{
        if(err) throw err ;
        res.redirect("/user");
      })
    }
    });
  }catch(err){
    res.send("some error in DB");
  };

});

//add new user
app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});

app.post("/user/new",(req,res)=>{
  let {username , email , password} = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err ;
      console.log(result);
      res.redirect("/user")
    })
  }catch(err){
    res.send("some err in DB");
  }
});

//delete user api 
app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err ;
      let user = result[0]
      console.log(user)
      res.render("delete.ejs",{user});
    })
  }catch(err){
    res.send("some err in DB")
  }
});

app.delete("/user/:id/",(req,res)=>{
   let {id} = req.params;
   let {password} = req.body;
   let q = `SELECT * FROM user WHERE id='${id}'`;
   try{
    connection.query(q,(err,result)=>{
      if(err) throw err ;
      let user = result[0];
      if(password != user.password){
        res.send("wrong password entered");
      }else{
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err ;
          res.redirect("/user");
        })
      }
    })
   }catch(err){
    res.send("some error in DB");
   }
});

//creating server
app.listen("8080",()=>{
  console.log("app is listening on port : 8080");
});



//   let q = "INSERT INTO user (id,username,email,password) VALUES ?";
// let data = [];
// for(let i = 1 ; i<=100 ; i++){
//    data.push(getRandomUser());
// }

// try{
//   connection.query(q,[data],(err,result)=>{
//     if(err) throw err ;
//     console.log(result);
//   })
// }catch(err){
//   console.log(err) ;
// }

// connection.end();
 

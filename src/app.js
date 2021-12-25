const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
require("./db/conn");
const Register = require("./models/register");
const async = require("hbs/lib/async");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.get("/", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

//Create a new user in our database
app.post("/register", async (req, res) => {
  
  try {
   

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const demoRegister = new Register({
        username: req.body.username,
        email: req.body.email,
        password: password,
        confirmpassword: cpassword,
      });
      const registered = await demoRegister.save();
      res.status(201).render("login");
    } else {
      res.render(`Password is not matching`);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({email : email  });
    
    if(useremail.password===password){
        res.status(201).render("register")
    }else{
        res.send("Invalid Email or Password");
    }
    
  } catch (error) {
    res.status(400).send("Invalid Username");
  }
});

app.get("/register",async(req,res)=>{
    try{
        const registerData = await Register.find();
        res.send(registerData);
    }catch(e){
        res.send(e);
    }
})

app.get("/register/:id", async(req,res)=>{
    try{
        const _id= req.params.id;
    const registersData = await Register.findById(_id);
    res.send(registersData);
    }catch(e){
        res.send(e)
    }
})

app.listen(port, () => {
  console.log(`Server is running at port no. ${port}`);
});

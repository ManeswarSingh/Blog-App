const {Router} = require('express');
const User = require('../models/user.models');

const router = Router();

router.get('/signin',(req,res)=>{
    res.render('signin')
})

router.get("/signup",(req,res)=>{
    res.render('signup')
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})
router.get('blogs',(req,res)=>{
    res.render('blogs')
})

router.post("/signup", async(req,res)=>{
    const {fullName,email,password} = req.body;
    console.log(fullName,email)
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect("/")
})

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body;
    
     try {
        const token =await User.matchPasswordAndGenerateToken(email,password)
    //    console.log(token)
       res.cookie('token',token).redirect('/');
     } catch (error) {
        res.render('signin',{
            error:"incorrect email or password"
        })
        
     }
})

module.exports = router
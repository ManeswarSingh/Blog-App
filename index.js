const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Blog = require('./models/blog.models')
const cookieParser = require('cookie-parser')

const MONGODB_URI = 'mongodb+srv://singhmaneshwar:singhmaneshwar@cluster0.0yts2b7.mongodb.net'
const DB_NAME = 'blog'
mongoose.connect(`${MONGODB_URI}/${DB_NAME}`)
.then((e)=>{
    console.log('mongodb connected')
})

const userRoutes = require("./routes/user.js")
const blogRoutes = require("./routes/blogroute.js")
const { checkForAuthenticationCookie } = require('./middlewares/auth.js')

const app = express()
PORT = 8000

app.set('view engine',"ejs")
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
// app.use(express.static(path.resolve('./public')))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render('home',{
        user : req.user,
        blogs : allBlogs
    })
})

app.use('/user',userRoutes);
app.use('/blog',blogRoutes)

app.listen(PORT,()=>{console.log(`app listening on port ${PORT}`);})
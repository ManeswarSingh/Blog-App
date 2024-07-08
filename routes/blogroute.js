const {Router} = require('express')
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog.models.js')
const Comment = require('../models/comment.models.js')
const router = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
     const fileName = `${Date.now()}-${file.originalname}`
     cb(null,fileName)
    }
  })
  
  const upload = multer({ storage: storage })

  router.get('/search',async (req,res)=>{
    const query = req.query.query;
    try {
      const blogs = await Blog.find({ title: { $regex: query, $options: 'i' } });
      res.render('searchResults', { user: req.user, blogs, query });
    } catch (error) {
      console.log(error);
      res.render('searchResults', { user: req.user, blogs: [], query });
      
    }
  })

router.get('/add-new',(req,res)=>{
    res.render('blog',{user : req.user})
    
})

router.get('/:id',async (req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId:req.params.id}).populate("createdBy")
  console.log("Comments:", comments);
  res.render("mainblog",{
    user : req.user,
    blog,
    comments
  })
})

router.post("/comment/:blogId",async (req,res)=>{
try {
  await Comment.create({
      content : req.body.content,
      blogId : req.params.blogId,
      createdBy : req.user._id
    })
    res.redirect(`/blog/${req.params.blogId}`)
} catch (error) {
  console.log(error.message)
  
}
})
router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title,body} = req.body
    const blog = await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImage : `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})
module.exports = router
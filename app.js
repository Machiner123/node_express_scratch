const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check connection
db.once('open', ()=>{
  console.log("connected")
})

// Check for database errors
db.on('error', (err)=>{
  console.log(err)})


// Intitialize app.
const app = express()


// Bring in models
let Article = require('./models/article')

// Load view engine.
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Middleware for url encoding
app.use(bodyParser.urlencoded({ extended: false }))

// Parse appliation/json
app.use(bodyParser.json())

// Set public/static
app.use(express.static(path.join(__dirname, 'public')))

// Home route.
app.get('/', (req, res)=>{
  Article.find({}, (err, articles)=>{
    if(err){
      console.log(err)
    }else{
    res.render('index', {
      title:"Articles",
      articles: articles
    })
    }
  })
})

// Get article by id
app.get('/article/:id', (req, res)=>{

  Article.findById(req.params.id, (err, article)=>{
    res.render('article', {
      article:article
    })
  })
})

// Add route.
app.get('/articles/add', (req, res)=>{
  res.render('add_article', {
    title:"add article"
  })
})

// Submit article post request
app.post('/articles/add', (req, res)=>{
  // To have access to req.body at all, body-parser must be used
  let article = new Article()
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  article.save((err)=>{
    if(err){
      console.log(err)
      return
    }else{
      res.redirect('/')
    }
  })
});

// Route for edting articles
app.get('/article/edit/:id', (req, res)=>{
  Article.findById(req.params.id, (err, article)=>{
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    })
  })
})


app.post('/articles/edit/:id', (req, res)=>{
  let article = {}
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  let query = {_id:req.params.id}

  Article.update(query, article, (err)=>{
    if(err){
      console.log(err)
      return
    }else{
      res.redirect('/')
    }
  })
});

// Start server.
app.listen(3000, ()=>{
  console.log('300')
})

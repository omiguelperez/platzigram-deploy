'use strict'

const port = process.env.PORT || 5050

const http = require('http')
const express = require('express')
const multer  = require('multer')
const ext = require('file-extension')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const passport = require('passport')
const auth = require('./auth')
const config = require('./config')
const platzigram = require('platzigram-client')

aws.config.update({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
})

const client = platzigram.createClient(config.client)

const s3 = new aws.S3()

const storage = multerS3({
  s3: s3,
  bucket: 'platzigram-omiguelperez',
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: function (req, file, cb) {
    cb(null, `${+Date.now()}.${ext(file.originalname)}`)
  }
})

const upload = multer({ dest: 'uploads/', storage: storage }).single('picture')

const app = express()
const server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(expressSession({
  secret: config.secret,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(auth.localStrategy)
passport.use(auth.facebookStrategy)
passport.serializeUser(auth.serializeUser)
passport.deserializeUser(auth.deserializeUser)

app.set('view engine', 'pug')
app.use(express.static('public'))

function ensureAuth (req, res, next) {
  if (req.isAuthenticated()) return next()

  res.status(401).send({ error: 'not authenticated' })
}

function isNotLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()

  res.redirect('/signin')
}

function isLoggedIn (req, res, next) {
  if (!req.isAuthenticated()) return next()

  res.redirect('/')
}

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/signin' }), 
  (req, res) => res.redirect('/'))

app.get('/logout', (req, res) => {
  req.logout()
  
  res.redirect('/')
})

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope : ['email'] }))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  (req, res) => res.redirect('/'))

app.get('/', function (req, res) {
  res.render('index')
})

app.get('/signup', isLoggedIn, function (req, res) {
  res.render('index')
})

app.post('/signup', function (req, res) {
  let user = req.body

  client.saveUser(user, (err, usr) => {
    if (err) return res.status(500).send(err)
    
    res.redirect('/signin')
  })
})

app.get('/signin', isLoggedIn, function (req, res) {
  res.render('index')
})

app.get('/whoami', function (req, res) {
  if (req.isAuthenticated()) return res.json(req.user)

  res.json({ auth: false })
})

app.get('/api/pictures', function (req, res) {
  client.listPictures((err, images) => {
    if (err) return res.send([])

    res.send(images)
  })
})

app.post('/api/pictures', ensureAuth, function (req, res) {
  upload(req, res, function (err) {
    if (err) return res.status(500).send('Error uploading picture')
    
    let name = req.user.name
    let username = req.user.username
    let token = req.user.token
    let avatar = req.user.avatar
    
    let picture = {
      src: req.file.location,
      userId: username,
      user: {
        username: username,
        name: name,
        avatar: avatar
      }
    }

    client.savePicture(picture, token, (err, img) => {
      if (err) return res.status(500).send({ error: err.message })

      res.send(`File uploaded: ${img.src}`)
    })
  })
})

app.get('/api/user/:username', function (req, res) {
  let username = req.params.username

  client.getUser(username, (err, user) => {
    if (err) return res.status(402).send({ error: 'user not found' })

    res.send(user)
  })
})

app.get('/:username', isNotLoggedIn, function (err, res) {
  res.render('index')
})

app.get('/:username/:id', isNotLoggedIn, function (req, res) {
  res.render('index')
})

server.on('listening', function (err) {
  if (err) console.log('err', err), process.exit(1)
  console.log(`Platzigram running at http://localhost:${port}\n`)
})

server.listen(port)

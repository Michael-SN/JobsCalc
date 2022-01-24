// init my server with nodejs
const express = require('express')
const server = express()
const routes = require('./routes')
const path = require('path')

//enable ejs engine template
server.set('view engine', 'ejs')

// mudar localização da pasta views
server.set('views', path.join(__dirname, 'views'))

// using middleware - enable static files
server.use(express.static('public'))

// enable req.body
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes)

// enable server
server.listen(3000, () => console.log('started...'))

// init my server with nodejs
const express = require('express')
const server = express()
const routes = require('./routes')

//enable ejs engine template
server.set('view engine', 'ejs')

// using middleware - enable static files
server.use(express.static('public'))

// enable req.body
server.use(express.urlencoded({ extended: true }))

// routes
server.use(routes)

// enable server
server.listen(5000, () => console.log('started...'))

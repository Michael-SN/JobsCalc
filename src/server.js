// init my server with nodejs
const express = require('express')
const server = express()
const routes = require('./routes')

//enable ejs engine template
server.set('view engine', 'ejs')

// using middleware - enable static files
server.use(express.static('public'))

// routes
server.use(routes)

// enable server
server.listen(3000, () => console.log('started...'))

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const boolParser = require('express-query-boolean')
const helmet =require("helmet")
const contactsRouter = require('./routes/api/contacts/contacts')
const usersRouter=require("./routes/api/users")
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(helmet())
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({limit: 15000}))
app.use(boolParser())
app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not found',
    data:"Not found",
  })
})

app.use((err, _req, res, _next) => {
  const code = err.status || 500;
  const status = err.status ? 'error' : 'fail';
  res.status(code).json({
    status,
    code,
    message: err.message,
  })
})

module.exports = app

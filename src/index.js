const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const cors = require('cors')
const jwt = require('express-jwt')

require('path')
require('../config/mongoose')
require('./graphql/models/models')
const schema = require('./createSchema')
const { port, env, jwtSecret } = require('../config/config')

const app = express()

app.use(cors())

const auth = jwt({
  secret: jwtSecret,
  credentialsRequired: false
})

app.use(
  '/graphql',
  bodyParser.json(),
  auth,
  graphqlExpress(req => ({
    schema,
    context: {
      req,
      user: req.user
    }
  }))
)

if (env === 'development') {
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
}

app.get('/', (req, res) => {
  res.send('Authentication API')
  // res.sendFile(path.join(__dirname, '/index.html'))
})

app.listen(port, () => {
  console.log(`server started on port ${port} environment ${env}`)
})

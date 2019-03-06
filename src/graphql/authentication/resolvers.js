const AuthCtrl = require('./../../controllers/authentication')

const resolvers = {
  Query: {
    testQuery: async () => 'Hello'
  },
  Mutation: {
    signUp: async (_, args) => AuthCtrl.SignUp(args),
    signIn: async (_, args) => AuthCtrl.SignIn(args),
    getToken: async (_, args) => AuthCtrl.GetToken(args)
  }
}

module.exports = resolvers

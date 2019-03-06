const path = require('path');

require('dotenv-safe').load({
  path: path.join(__dirname, '../.env'),
  allowEmptyValues: true
});

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongo: {
    uri: process.env.MONGO_URI
  },
  refreshTokenExpiresIn: "1d",
  accessTokenExpiresIn: "10m",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES
}
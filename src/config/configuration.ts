export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/store'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: '24h'
  }
}); 
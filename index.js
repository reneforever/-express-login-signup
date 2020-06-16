const express = require('express')
const app = express()

// 解析req.body
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// 引入users路由
const users = require('./routes/users')
app.use("/api/users",users)

// 引入auth/login路由
const auth = require('./routes/auth')
app.use('/api/auth',auth)

app.listen(3100,()=>{
  console.log('server running at 3100 port')
})
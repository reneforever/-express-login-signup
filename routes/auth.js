const express = require('express')
const router = express.Router()

// 引入数据库操作
const sqlFn = require('../mysql/index')

// 引入jwt加密
const jwt = require('jsonwebtoken')
const config = require('../config')

router.post('/',(req,res)=>{
  const {username,password} = req.body
  var sql = 'select * from user where `username`=? AND `password`=?'
  var arr = [username,password]
  sqlFn(sql,arr,function(data){
    if(data.length>0){
      const token = jwt.sign({
        id:data[0].id,
        username:data[0].username
      },config.jwtSecret)
      res.send(token)
    }else{
      res.status(401).json({errors:{form:'用户名或密码错误'}})
    }
  })
})

module.exports = router
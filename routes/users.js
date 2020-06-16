const express = require('express')
const router = express.Router()
// 验证 /非空/自定义规则
const isEmpty = require('lodash/isEmpty')
const validator = require('validator')

// 引入数据库操作
const sqlFn = require('../mysql/index')
// 注册接口验证
const validatorInput = (data) => {
  let errors = {}
  if(validator.isEmpty(data.username)){
    errors.username = '请填写用户名'
  }
  if(validator.isEmpty(data.email)){
    errors.email = '请填写邮箱'
  }
  if(validator.isEmpty(data.password)){
    errors.password = '请填写密码'
  }
  if(validator.isEmpty(data.passwordConfirmation)){
    errors.passwordConfirmation = '请确认密码'
  }
  if(!validator.equals(data.password,data.passwordConfirmation)){
    errors.passwordConfirmation = '两次密码输入不一致'
  }

  return{
    errors,
    // 通过isValid判断是否有errors返回
    isValid:isEmpty(errors)
  }
}

// 注册接口及数据库操作
router.post('/',(req,res)=>{
  const {errors,isValid} = validatorInput(req.body)
  // 接受数据库语句
  var sql = 'insert into user value(null,?,?,?,?)'
  var arr = [req.body.email,req.body.username,req.body.password,req.body.passwordConfirmation]
  if(isValid){
    sqlFn(sql,arr,function(data){
      // 判断 是否触发影响行数
      if(data.affectedRows){
        res.send({success:true})
      }else{
        res.status(400).json({error:'注册失败'})
      }
    })
  }else{
    res.status(400).json(errors)
  }
})
// username验证接口
router.get("/:username",(req,res)=>{
  var sql = 'select * from user where `username`=?'
  var arr = [req.params.username]
  sqlFn(sql,arr,function(data){
    if(data){
      res.send(data)
    }else{
      res.send({})
    }
  })
})

module.exports = router
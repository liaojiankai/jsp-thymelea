var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var relativePath = '../project/templates/';

// thymeleaf
var thymeleaf  = require('thymeleaf');
var thymeleafTemplate = thymeleaf.TemplateEngine;
var StandardDialect = thymeleaf.StandardDialect;

var templateEngine = new thymeleafTemplate({
  dialects: [
    new StandardDialect('th')
  ]
});
function getThymeleaf(filePath, params, handle) {
  var html = fs.readFileSync(path.join(__dirname, relativePath,filePath), {
    encoding: 'utf-8'
  });
  html = handle(html);
  return new Promise((resolve,reject) => {
    templateEngine.process(html, params)
    .then(result => {
      resolve(result)
    });
  })
}


//jsp
const JSPJs = require('jsp-js').Renderer;
const jsp = new JSPJs({
  root: [path.join(__dirname, relativePath)]
})
function getJsp(filePath, params, handle) {
  return new Promise((resolve,reject) => {
    var html = jsp.render(filePath, params);
      html = handle(html);
      resolve(html);
  })
}

router.get('/thymeleaf', function(req, res, next) {
  getThymeleaf('home/index.html', {
    rate: 90,
    haderClass: 'mp-header level--low', // 'level--low' 'level--medium' 'level--high'
    generateTime: '2018-09-30',
    rows: [
      {
        title: '公司名称含有行业关键字',
        pass: false,
        suggest: '您所在公司为借款敏感行业'
      },
      {
        title: '基本信息填写存在欺诈行为',
        pass: true,
        suggest: '您所在公司为借款敏感行业'
      },
      {
        title: '同一借款人名下设备数超限',
        pass: false,
        suggest: '尽量避免借款时使用多个设备'
      },
      {
        title: '通讯录联系人中本月内逾期用户数超限',
        pass: true,
        suggest: '尽量避免借款时使用多个设备'
      },
      {
        title: '通讯录联系人中本月内逾期用户数超限',
        pass: false,
        suggest: '请真实填写您的紧急联系人、避免欺骗隐瞒'
      },
      {
        title: '高频联系人命中黑名单数量超限',
        pass: false,
        suggest: '尽量避免与逾期用户/黑名单客户通话联系、或减少联系频率'
      },
    ]
 }, function(html){
   html = html.replace("${type}!='manage'", "true")
   return html
  })
  .then(result => {
    res.send(result)
  });
});
router.get('/jsp', function(req, res, next) {
  getJsp('home/index.jsp', {
    name: 'jsp',
    img: '/img/default.jpg'
 }, function(html){
   html = html.replace("${type}!='manage'", "true")
   return html
  })
  .then(result => {
    res.send(result)
  });
});
module.exports = router;

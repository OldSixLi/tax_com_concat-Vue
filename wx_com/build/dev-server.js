/*
 * 生成Mock数据API 在./webpack.dev.conf.js文件中注册
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2018年9月12日13:17:18
 * @Last Modified by: 马少博
 * @Last Modified time:2018年9月12日13:17:18
 */
/* jshint esversion: 6 */
"use strict"
const express = require('express');
const path = require('path');
const fs = require('fs');

const tableData = require('./../mock/table.json');
const option = require('./../mock/option.json');
const routes = express.Router();
const readFileLines = filename => fs.readFileSync(filename).toString('UTF8');

const nodegrass = require('nodegrass');

const TOKEN = `0g5_24FDqaNOXquYiot6l3A4NMy6iCxHJ7Dr3L-_cU_B-6l3r0vYz8_tbZ38_411CwPG3EAhi1GD8N51JLOnUU6A9YJTW87X10yXz_L0rBZT5CCYmVr9b4SuosKgHzdCf3a3fNlwG5K2NMVSMoI9wUeuewl5RG4UXVWvlrvocKlcrzB28_kGqxAAGb6BFdFmgengsQcIEC4O3oP_IIz7uw`;


/**
 * 请求URL
 *
 * @param {*} url
 */
async function getUrl(url) {
  return new Promise(function (resolve, reject) {
    nodegrass.get(url, (data) => {
      if (!data) {
        reject(error);
      } else {
        resolve(data)
      }
    })
  })
}

routes.get('/api/table',
  (req, res) => {
    res.json(tableData)
  });
routes.get('/api/users',
  (req, res) => {
    res.json(option)
  });

routes.get('/api/userlist/:id', (req, res) => {
  let departmentId = req.params.id;
  getUrl(`https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${TOKEN}&department_id=${departmentId}&fetch_child=0`).then(
    data => {
      res.json(data);
    }
  )
});



routes.get('/api/mock/:path', (req, res) => {
  let param = req.params.path;
  let filePath = path.resolve(__dirname, `./../mock/${param}.json`);
  res.json(readFileLines(filePath));
});




module.exports = routes;

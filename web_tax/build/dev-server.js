const express = require('express');
const tableData = require('./../mock/table.json');
const option = require('./../mock/option.json');
const routes = express.Router();


routes.get('/api/table',
  (req, res) => {
    res.json(tableData)
  })
routes.get('/api/users',
  (req, res) => {
    res.json(option)
  })

module.exports = routes;
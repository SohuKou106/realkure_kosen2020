// サーバー起動
const express = require('express')
//const fs = require('fs')
//const https = require('https')
const app = express()
const bodyParser = require('body-parser');
const { response, Router } = require('express');

/*
const options = {
  key: fs.readFileSync('./private/real-kure.key'),
  cert: fs.readFileSync('./private/real-kure.crt')
}
*/

//https.createServer(options, app).listen(443)

/*app.options('/posts', function(req, res){  
  console.log("writing headers only");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.end('');
});*/

app.listen(3005, () => console.log('demo server open'))

const knex = require('knex')({
  dialect: 'sqlite3',
  connection: {
    filename: 'realkure2_kosen.sqlite3'
  },
  useNullAsDefault: true
})

var Bookshelf = require('bookshelf')(knex)

var PlaceList = Bookshelf.Model.extend({
  tableName: 'place_list'
})

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/api/find', (req, res) => {
  //console.log(req.query)
  new PlaceList().where('id', '=', req.query.sid).fetch()
  .then((collection)=> {
    res.json({status: true, content: collection})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

app.get('/api/shop', (req, res) => {
  new PlaceList().where('genre', '=', '模擬店').fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

app.get('/api/exhibition', (req, res) => {
  new PlaceList().where('genre', '=', '展示').fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

app.get('/api/data', (req, res) => {
  new PlaceList().fetchAll()
  .then((collection) => {
    res.json({status: true, content: collection.toArray()})
  })
  .catch((err) => {
    res.json({status: false})
  })
})

// 静的ファイルを自動的に返すようルーティングする
app.use('/public', express.static('./public'))
app.use('/camera', express.static('./public'))
app.use('/', express.static('./public'))

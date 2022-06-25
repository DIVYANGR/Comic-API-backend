const express = require('express')
const path = require('path')
const cors = require("cors")
const axios = require('axios')
const jsoning = require('jsoning');


let db = new jsoning("database.json");


const app = express()
var port = process.env.PORT || 8080



app.use(express.static('public'))
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cors())


app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://xkcd.com/info.0.json`);
    let num = response['data']['num']
    let data = { 'views': 0 }
    if (await db.has(`${num}`)) {
      var val = await db.get(`${num}`)
      await db.set(`${num}`, val + 1)
      data = { ...response.data, views: val }
      res.send(data);
    }
    else {
      db.set(`${num}`, 1)
      data = { ...response.data, ...data }
      res.send(data);
    }


  }
  catch (err) {
    console.log(err)
    res.status(404).send(err)
  }

})


app.get('/:id', async (req, res, next) => {

  let id = req.params.id;
  try {
    const response = await axios.get(`https://xkcd.com/${id}/info.0.json`);
    let num = response['data']['num']
    let data = { 'views': 0 }

    if (await db.has(`${num}`)) {
      var val = await db.get(`${num}`)
      data = { ...response.data, "views": val }
      await db.set(`${num}`, val + 1)
      res.send(data);
    }
    else {
      db.set(`${num}`, 1)
      data = { ...response.data, ...data }
      res.send(data);
    }

  }
  catch (err) {
    console.log(err)
    res.status(404).send(err)
  }

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
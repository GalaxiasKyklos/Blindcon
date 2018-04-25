const express = require('express')
const request = require('request')

const app = express()

app.use(express.static(__dirname, {
  dotfiles: 'allow'
}))

app.listen(80, () => {
  console.log('HTTP server running on port 80')
})

app.use('/', (req, res) => {
  const port = req.url.includes('api') ? 3001 : 3000
  const url = `http://localhost:${port}${req.url}`
  let r = null
  if (req.method === 'POST') {
    r = request.post({
      uri: url,
      json: req.body
    })
  } else {
    r = request(url)
  }
  req.pipe(r).pipe(res)
})

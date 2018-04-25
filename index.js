const express = require('express')
const proxy = require('http-proxy-middleware')

const app = express()

const apiProxy = proxy('/api', {
  target: 'http://localhost:3001',
})

const frontProxy = proxy('/', {
  target: 'http://localhost:3000',
})

app.use(express.static(__dirname, {
  dotfiles: 'allow',
}))

app.use(apiProxy)
app.use(frontProxy)


app.listen(80, () => {
  console.log('HTTP server running on port 80')
})

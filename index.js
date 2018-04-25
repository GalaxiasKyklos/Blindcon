const express = require('express')
const proxy = require('http-proxy-middleware')
const https = require('https')
const http = require('http')
const fs = require('fs');

const app = express()

const key = fs.readFileSync('/etc/letsencrypt/live/blindcon.galaxiaskyklos.com/privkey.pem', 'utf8')
const cert = fs.readFileSync('/etc/letsencrypt/live/blindcon.galaxiaskyklos.com/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/blindcon.galaxiaskyklos.com/chain.pem', 'utf8')

const credentials = {
	key,
	cert,
	ca,
}

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

const httpsServer = https.createServer(credentials, app)
const httpServer = http.createServer(app)

httpServer.listen(80, () => {
	console.log('HTTPS Server running on port 80');
})

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
})

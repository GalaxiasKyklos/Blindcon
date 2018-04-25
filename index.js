const http = require('http');
const https = require('https');

function handler(req, res) {
  res.status(200).send('Hello World!');
}

const PROD = false;
const lex = require('greenlock-express').create({
  version: 'v01',
  server: PROD ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
 
  approveDomains: (opts, certs, cb) => {
    if (certs) {
      // change domain list here
      opts.domains = ['blindcon.galaxiaskyklos.com']
    } else { 
      // change default email to accept agreement
      opts.email = 'saul_enrique-7285-96@hotmail.com'; 
      opts.agreeTos = true;
    }
    cb(null, { options: opts, certs: certs });
  }
});

const middlewareWrapper = lex.middleware;

https.createServer(
  lex.httpsOptions, 
  middlewareWrapper(handler)
).listen(433);

const redirectHttps = require('redirect-https');
http.createServer(lex.middleware(redirectHttps())).listen(80);

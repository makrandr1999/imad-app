var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser=require('body-parser');

var config={
    
    user:'makrandr',
    database:'makrandr',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return hashed.toString('hex');
}
app.get('/hash/:input', function(req,res){
   var hashedString=hash(req.params.input,'This-is-a-random-string');
   res.send(hashedString);
});
app.get('/articles/:articleName', function(req,res){
  // var articleName=;
   //var articleData=
   pool.query("SELECT * FROM article WHERE title =$1",[req.params.articleName], function(err,result){
      if(err){
          res.status(500).send(err.toString());
      } 
      else {
          if(result.rows.length === 0){
            res.status(404).send('Article Not Found.');
          }
          else
             {
                var articleData=result.rows[0];
                res.send(articleData);
             }
      
              
          }
   });
   
});
app.get('/create-user',function(req,res){
   var username=req.body.username;
   var password=req.body.password;
   var salt= crypto.randomBytes(128).toString('hex');
   var dBString = hash(password,salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dBString],function(err,res){
            if(err){
          return res.status(500).send(err.toString());
            }
      else {
         return res.send('User successfully created '+username);
      }
  });
  // });
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var pool= new Pool(config);
app.get('/test-db', function(req,res){
  pool.query("SELECT * FROM test", function(err,result){
      if(err)
         return res.status(500).send(err.toString());
      else
         return res.send(JSON.stringify(result.rows));
  });
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

console.log('Loaded!');
var submit = document.getElementById('submit-btn');
submit.onclick = function (){
    var request = new XMLHttprequest();
    
    request.onreadystatechange= function (){
          if(request.readystate=== XMLhttprequest.DONE){
              if(request.status === 200){
                  console.log('user logged in');
                  alert('Logged in successfully');
              }
          }
    };
};
var username=document.getElementById('username').value;
var password=document.getElementById('password').value;
console.log(username);
console.log(password);
request.open('POST','http://makrandr.imad.hasura-app.io/login',true);
request.send(JSON.stringify({username:username , password:password}));
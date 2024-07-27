var express=require("express");
let app= express();
let mysql2=require("mysql2");

let config={
    host:"127.0.0.1",
    user:"root",
    password:"Admin123",
    database:"project"
}

var mysql=mysql2.createConnection(config);
mysql.connect(function(err){ 
    if(err==null)
    {
        console.log("connected to database successfully");
    }
    else
     console.log(err.message);
})

app.listen(2024,function(req,resp){
    console.log("Your server started 😊");
})

app.get("/",function(req,resp){
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
})

app.get("/signup-process",function(req,resp)
{
    console.log(req.query);

    let email=req.query.txtEmail;
    let pwd=req.query.pwd;
    let utype=req.query.combo;
    
    mysql.query("insert into users values(?,?,?,1)",[email,pwd,utype],function(err)
    {
        if(err==null)
        {
            resp.send("SignedUp Successfullyy")
        }
        else
            resp.send(err.message);
    })
})

app.get("/login-process",function(req,resp)
{
    //console.log("login-process");
    let emaill=req.query.txtEmaill;
    let txtPwd=req.query.txtPwd;

    mysql.query("select * from users where email=? and pwd=?",[emaill,txtPwd],function(err,result)
    {
        if(err!=null)
        {
            resp.send(err.message); return;
        }
        if(result.length==0)
        {
            resp.send("Invalid Id or Password");return;''
        }
        if(result[0].status==1)
        {
            resp.send(result[0].utype); return;
        }
        else{
            resp.send("U R Blocked!!!"); return;
        }

    })

})
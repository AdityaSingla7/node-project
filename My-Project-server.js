var express = require("express");
let app = express();
let mysql2 = require("mysql2");
let fileuploader = require("express-fileupload");



app.use(express.urlencoded("true"));// converts binary form data to JSON Object
app.use(fileuploader());

// let config = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "Adityasingla007",
//     database: "project1",
//     dateStrings:true

// }

let config = {
    host: "bnn9fllem8uk3w4fl2ba-mysql.services.clever-cloud.com",
    user: "uz633z6n1zxvzbwz",
    password: "CqIRYc2fStDRTfJW1nSc",
    database: "bnn9fllem8uk3w4fl2ba",
    dateStrings:true,
     keepAliveInitialDelay : 10000,
      enableKeepAlive : true,

}


var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null) {
        console.log("connected to database successfully");
    }
    else
        console.log(err.message);
})
app.use(express.static("Public"));

app.listen(2007, function () {
    console.log("Server Started by Aditya Singla ");
})

app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);

})

app.get("/dash-infu", function (req, resp) {
    let path = __dirname + "/public/Dash-infu.html";
    resp.sendFile(path);
})

app.get("/Admin-dash", function (req, resp) {
    let path = __dirname + "/public/Admin-dash.html";
    resp.sendFile(path);
})

app.get("/Infu-Finder", function (req, resp) {
    let path = __dirname + "/public/Infu-Finder.html";
    resp.sendFile(path);
})

app.get("/Client-Dash", function (req, resp) {
    let path = __dirname + "/public/Client-Dash.html";
    resp.sendFile(path);
})


app.post("/profile-send-to-server", function (req, resp) {
    console.log(req.body);
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else
        fileName = "nopic.jpg";

    mysql.query("insert into cprofile values(?,?,?,?,?,?,?,?,?)", [req.body.txtemail,
    req.body.txtname, req.body.txtOrg, req.body.txtgender, req.body.txtstate, req.body.txtcity,
    req.body.txtcont, req.body.txtother, fileName], function (err) {
        if (err == null)
            resp.send("Profile Send to Server");
        else
            resp.send(err.message);
    })

})


app.get("/signup-process", function (req, resp) {
    //console.log(req.query);

    let email = req.query.txtEmail;
    let pwd = req.query.pwd;
    let utype = req.query.combo;

    mysql.query("insert into user values(?,?,?,1)", [email, pwd, utype], function (err) {
        if (err == null) {
            resp.send("SignedUp Successfullyy")
        }
        else
            resp.send(err.message);
    })
})

app.get("/login-process", function (req, resp) {
    //console.log("login-process");
    let emaill = req.query.txtEmaill;
    let txtPwd = req.query.txtPwd;

    mysql.query("select * from user where emailid=? and password=?", [emaill, txtPwd], function (err, result) {
        if (err != null) {
            resp.send(err.message); return;
        }
        if (result.length == 0) {
            resp.send("Invalid Id or Password"); return; ''
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype); return;
        }
        else {
            resp.send("U R Blocked!!!"); return;
        }

    })

})

app.post("/profile-save", function (req, resp) {
    //console.log(req.body);
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else
        fileName = "nopic.jpg";

    mysql.query("insert into profile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.txtemail,
    req.body.txtname, req.body.combo, req.body.txtdob, req.body.txtadd, req.body.txtcity,
    req.body.txtcont, req.body.combo2, req.body.txtinsta, req.body.txtface, req.body.txtyoutube, req.body.txtother, fileName], function (err) {
        if (err == null)
            resp.send("Profile Save");
        else
            resp.send(err.message);
    })

})



app.get("/post-event-save", function (req, resp) {
    //console.log(req.query);

    let email = req.query.txtemail;
    let Event = req.query.txtEvent;
    let dob = req.query.txtdate;
    let start = req.query.txtstart;
    let city = req.query.txtcity;
    let venue = req.query.txtvenue;

    mysql.query("insert into booking values(?,?,?,?,?,?)", [email, Event, dob, start, city, venue], function (err) {

        if (err == null) {
            resp.send(" Booking successfully")
        }
        else
            resp.send(err.message);

    })

})

app.get("/update-password", function (req, resp) {
    //console.log(req.query);

    let Email = req.query.txtemail;
    let OldPwd = req.query.txtold;
    let NewPwd = req.query.txtnew;
    let ConfirmPwd = req.query.txtconfirm;

    mysql.query("select * from user where emailid=? and password=?", [Email, OldPwd], function (err, result) {
        // console.log(result);
        if (result) {



            mysql.query("update user set password=? where emailid=?", [NewPwd, Email], function (err) {

                if (err == null) {
                    resp.send(" Update successfully");
                }
                else {
                    resp.send(err.message);
                    // console.log(err.message);
                }
            })

        }
        else {
            resp.send("Wrong Password ")
        }

    })
})

app.get("/fetch-all-emails", function (req, resp) {
    mysql.query("select distinct emailid from profile", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

app.get("/fetch-all-infu", function (req, resp) {
    mysql.query("select * from profile", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

app.get("/fetch-some-infu", function (req, resp) {
    mysql.query("select * from profile where emailid=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

// ================================================
app.get("/fetch-all-user", function (req, resp) {
    mysql.query("select * from user", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

app.get("/fetch-some-user", function (req, resp) {
    mysql.query("select * from user where emailid=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})


app.get("/Block-one", function (req, resp) {
    mysql.query("update user set status=0 where emailid=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("Block");

    })

})

app.get("/Resume-one", function (req, resp) {
    mysql.query("update user set status=1 where emailid=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("UnBlock");

    })

})



app.get("/Delete-one", function (req, resp) {
    console.log(req.query);
    mysql.query("delete from user where emailid=?", [req.query.email], function (err, resultJsonAry) {
        if (err == null) {
            console.log(resultJsonAry);
            resp.send(resultJsonAry);

            return;

        }
        //resp.send("Deleted");
        else
            console.log(err);
    })

})

app.get("/profile-search", function (req, resp) {
    let email = req.query.txtEmail;

    mysql.query("select * from profile where emailid=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of json object 0-1
    })
})

app.get("/Clinet-profile-search", function (req, resp) {
    let email = req.query.txtEmail;

    mysql.query("select * from cprofile where emailid=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of json object 0-1
    })
})

app.post("/profile-update",function(req,resp){
    console.log(req.body);
    let fileName="";

    let name=req.body.txtname;
    let gender=req.body.txtgender;
    let dob=req.body.txtdob;
    let address=req.body.txtadd;
    let city=req.body.txtcity;
    let contact=req.body.txtcont;
    let field=req.body.txtfield;
    let instagram=req.body.txtinsta;
    let facebook=req.body.txtface;
    let youtube=req.body.txtyoutube;
    let otherinfo=req.body.txtother;
    let email=req.body.txtemail;

    if(req.files!=null)
        {
             fileName=req.files.ppic.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.ppic.mv(path);
        }
        else
        {
            fileName=req.body.hdn;
        }
    mysql.query("update profile set sname=?, gender=?, dob=?, address=?, city=?, contact=?, field=?, insta=?, fb=?, youtube=?, otherinfo=?, ppic=? where emailid=?",[name,gender,dob,address,city,contact,field,instagram,facebook,youtube,otherinfo,fileName,email],function(err,result)
    {
        if(err==null)//no error
        {
               if(result.affectedRows>=1) 
                   resp.send("Update  Successfulllyyyy....");
                else
                    resp.send("Invalid Email ID");
        }
    else
        resp.send(err.message);
    })
})

app.post("/profile-modify",function(req,resp){
    console.log(req.body);
    let fileName="";

    let name=req.body.txtname;
    let Individual_Organization=req.body.txtOrg;
    let gender=req.body.txtgender;
    let state=req.body.txtstate;
    let city=req.body.txtcity;
    let contact=req.body.txtcont;
    let otherinfo=req.body.txtother;
    let email=req.body.txtemail;

    if(req.files!=null)
        {
             fileName=req.files.ppic.name;
            let path=__dirname+"/public/uploads/"+fileName;
            req.files.ppic.mv(path);
        }
        else
        {
            fileName=req.body.hdn;
        }
    mysql.query("update cprofile set sname=?, individual_organization=?, gender=?, state=?, city=?, contact=?, otherinfo=?, ppic=? where emailid=?"
        ,[name,Individual_Organization,gender,state,city,contact,otherinfo,fileName,email],function(err,result)
    {
        if(err==null)//no error
        {
               if(result.affectedRows>=1) 
                   resp.send("Modify  Successfulllyyyy....");
                else
                    resp.send("Invalid Email ID");
        }
    else
        resp.send(err.message);
    })
})


app.get("/do-find",function(req,resp)
{

    console.log(req.query);
    //console.log(req.query.fields);

    mysql.query("select * from profile where field= ? && city = ? ",[req.query.field,req.query.city],function(err,resultJsonAry){
        if(err!=null)
            {
                console.log(err);
                resp.send(err.message);
                return;

            }
       else{
        console.log(resultJsonAry);
           resp.send(resultJsonAry);
       }
    })

})


app.get("/find-influ",function(req,resp)
{

    console.log(req.query);
    //console.log(req.query.fields);


    mysql.query("select * from profile where field like ?",["%"+req.query.field+"%"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })

})

app.get("/do-findbysname",function(req,resp)
{

    //console.log("wmk");
    console.log(req.query);

    mysql.query("select * from profile where sname like ?",["%"+req.query.sname+"%"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);
    })

})



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path')
var http = require('http');
var fs = require('fs');
var flash = require('connect-flash');
var session = require('express-session');
const { body,validationResult } = require('express-validator');
const { Console } = require('console');


//DB Config
const port = 3000;




const config = {

  host: 'localhost',
  user: 'root',
  password: 'Shamik@1234',
  database: "cyber_crime",
  multipleStatements: true

};

//App Config
const app =express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(flash());

app.use( express.static('public'));
//set EJS as templating engine
app.set("view engine","ejs");

let con = mysql.createConnection(config);

app.get('/', (req, res) => {
  res.render("index")
})
app.get('/login', (req, res) => {
  res.render("login")
})

app.get('/cylog', (req, res) => {
  res.render("login2")
})

app.get('/polog', (req, res) => {
  res.render("login3")
})

app.get('/register', (req, res) => {
  res.render("register")
})



app.get('/custdash', (req, res) => {
  res.render("custdashboard")
})




//API Endpoints

app.get('/solvecaseweb', (req, res) => {
  var sql = "SELECT w_id,vic_name FROM web_hacking";
  con.query(sql, function (err,result) {
    console.log(result);
    res.render("solvecase",{ result: result , type: "Web Hacking" });
  })
  
})
app.get('/solvecaseacc', (req, res) => {
  var sql = "SELECT acc_id,vic_name FROM account_hacking";
  con.query(sql, function (err,result) {
    console.log(result);
    res.render("solvecase",{ result: result, type: "Account Hacking"});
  })
  
})
app.get('/solvecasearp', (req, res) => {
  var sql = "SELECT arp_id,vic_name FROM arp_poisioning";
  con.query(sql, function (err,result) {
    console.log(result);
    res.render("solvecase",{ result: result, type: "ARP Poisioning" });
  })
  
})

app.get('/solvedform', (req,res) => {
  res.render("solvecase");
})



app.get('/issue', (req, res) => {
  res.render("issuecase",{ username: req.body.username })
})

app.post('/custlogin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  var res1 = []
  var res2 = []
  var res3 = []
  var sql = "SELECT * FROM customer WHERE username= "+mysql.escape(username)+" AND password="+mysql.escape(password);
  con.query(sql,function (err, result) {
      if (err) throw err;
      var sql2 = "SELECT * FROM web_hacking WHERE vic_name= "+mysql.escape(username);
      con.query(sql2, function(err, result1) {
        if(err) throw err;
        res1 = result1;
        var sql3 = "SELECT * FROM account_hacking WHERE vic_name= "+mysql.escape(username);
        con.query(sql3, function(err, result2) {
          if(err) throw err;
          res2 = result2;
          var sql4 = "SELECT * FROM arp_poisioning WHERE vic_name= "+mysql.escape(username);
          con.query(sql4, function(err, result3) {
            if(err) throw err;
            res3 = result3;
            console.log(res1,res2,res3);
            res.render("custdashboard",{ username : username, result1 : res1, result2 : res2, result3 : res3, success: ""});


          })
        })
      });    
  });

})

app.post('/registercustomer', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const phoneno1=  req.body.phoneno1;
  const phoneno2 = req.body.phoneno2;
  const address = req.body.address;



  var sql = "INSERT INTO customer (username, phoneno1, phoneno2, email, address ,password) VALUES ?";
  var values = [
    [username, phoneno1, phoneno2, email, address, password]
  ];

  con.query(sql,[values], function (err, result ) {
    if(err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    var sql2 = "SELECT * FROM web_hacking WHERE vic_name= "+mysql.escape(username);
    con.query(sql2, function(err, result1) {
      if(err) throw err;
      res1 = result1;
      var sql3 = "SELECT * FROM account_hacking WHERE vic_name= "+mysql.escape(username);
      con.query(sql3, function(err, result2) {
        if(err) throw err;
        res2 = result2;
        var sql4 = "SELECT * FROM arp_poisioning WHERE vic_name= "+mysql.escape(username);
        con.query(sql4, function(err, result3) {
          if(err) throw err;
          res3 = result3;
          console.log(res1,res2,res3);
          res.render("custdashboard",{ username : username, result1 : res1, result2 : res2, result3 : res3, success: ""});


        })
      })
    });    
    


  })


})

app.post('/policelogin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  var res1 = []
  var res2 = []
  var res3 = []
  var sql = "SELECT * FROM police WHERE username= "+mysql.escape(username)+" AND password="+mysql.escape(password);
  con.query(sql,function (err, result) {
      if (err) throw err;
      var sql2 = "SELECT * FROM web_hacking";
      con.query(sql2, function(err, result1) {
        if(err) throw err;
        res1 = result1;
        console.log(result1[1].type_of_attack);
        var sql3 = "SELECT * FROM account_hacking";
        con.query(sql3, function(err, result2) {
          if(err) throw err;
          res2 = result2;
          var sql4 = "SELECT * FROM arp_poisioning";
          con.query(sql4, function(err, result3) {
            if(err) throw err;
            res3 = result3;
            console.log(res1,res2,res3);
            res.render("poldashboard",{ username : username, result1 : res1, result2 : res2, result3 : res3, success: ""});


          })
        })
      });    
  });

})

app.post('/cyberlogin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  var sql = "SELECT * FROM cyber_expert WHERE username= "+mysql.escape(username)+" AND password="+mysql.escape(password);
  con.query(sql,function (err, result) {
      if (err) throw err;
      const role = result[0].role;
      console.log(role);

      if(role === "Web Hack Expert") {

        var sql2 = "SELECT * FROM web_hacking";
        con.query(sql2, function(err, result1) {
          res.render("webdashboard",{ username : username, result : result1, success: ""});
        });
        
      }
      else if(role === "Account Hack Expert") {

        var sql2 = "SELECT * FROM account_hacking";
        con.query(sql2, function(err, result1) {
          res.render("accdashboard",{ username : username, result : result1, success: ""});
        });

      }
      else {

        var sql2 = "SELECT * FROM arp_poisioning";
        con.query(sql2, function(err, result1) {
          res.render("arpdashboard",{ username : username, result : result1, success: ""});
        });

      }

      

      
  });
  


})

app.get('/polsolvedcases',(req,res) => {


  var sql = "SELECT * FROM solved";
  con.query(sql,(err,result) => {
    res.render("polsolvedcaseshow",{ result: result });
  })

})

app.get('/polreportform',(req,res) => {

  res.render("polreport");

})

app.post('/polreportsent',(req,res) => {

  const  vic_name = req.body.vic_name;
  const case_name = req.body.case_name;
  const police_name = req.body.police_name;
  const report = req.body.report;



  var sql = "INSERT INTO fir_report (police_name, vic_name, report, case_name) VALUES ?";
  var values = [
    [police_name, vic_name, report, case_name]
  ];

  con.query(sql, [values], function(err,result) {
    if(err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    var sql2 = "SELECT * FROM web_hacking";
    con.query(sql2, function(err, result1) {
      if(err) throw err;
      res1 = result1;
      console.log(result1[1].type_of_attack);
      var sql3 = "SELECT * FROM account_hacking";
      con.query(sql3, function(err, result2) {
        if(err) throw err;
        res2 = result2;
        var sql4 = "SELECT * FROM arp_poisioning";
        con.query(sql4, function(err, result3) {
          if(err) throw err;
          res3 = result3;
          console.log(res1,res2,res3);
          res.render("poldashboard",{ username : police_name, result1 : res1, result2 : res2, result3 : res3, success: "Succesfully added"});
        })
      })
    })
  })
})

app.get('/seepolicereport',(req,res) => {
  res.render("custpolreportform");
})
app.post('/custpolreportshow',(req,res) => {

  const vic_name = req.body.vic_name;
  const case_name = req.body.case_name;
  
  var sql = "SELECT * FROM fir_report WHERE vic_name="+mysql.escape(vic_name)+" AND case_name="+mysql.escape(case_name);
  con.query(sql, (err,result) => {

    if(err) {
      res.send("No Police report for this case yet");
    }
    

    res.render("custpolicereport",{ result: result });


  })



})


app.post('/issuecase', (req, res) => {
  const vicname =req.body.vicname;
  const type = req.body.type;
  const status = "Pending";
  console.log(vicname,type,status);
  console.log(req.body.username)

  var sql = "INSERT INTO crimes (vic_name, type, status) VALUES ?";
  var values = [
    [vicname, type, status]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    if(type === "Web Hack") {
      res.render("fillform1");
    }
    else if(type === "Account Hack") {
      res.render("fillform3");
    }
    else {
      res.render("fillform2");
    }
  });

})

app.get('/issuewebpage', (req, res) => {
  res.render("fillform1");
})

app.get('/issueaccpage', (req, res) => {
  res.render("fillform3");
})
app.get('/issuearppage', (req, res) => {
  res.render("fillform2");
})
app.get('/solvedcasesform', (req, res) => {
  res.render("solvedcases");
})

app.post('/issueweb', (req, res) => {
  const vicname =req.body.vicname;
  const type = req.body.type;
  const type1 = "Web Hacking";
  const url = req.body.url;
  const phoneno = req.body.phoneno;
  const status = "Pending";
  console.log(vicname,type,status);
  var res1 = []
  var res2 = []
  var res3 = []

  var sql = "INSERT INTO web_hacking (type_of_attack, web_url, status, vic_name, phone_no) VALUES ?";
  var values = [
    [type, url, status,vicname, phoneno]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    var sql2 = "INSERT INTO crimes (vic_name, type, status) VALUES ?";
    var values1 = [
      [vicname, type1, status]
    ];
    con.query(sql2 , [values1], function (err, result1) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
      console.log(result1)
      var sql2 = "SELECT * fROM crimes WHERE vic_name= "+mysql.escape(vicname);
      con.query(sql2, function(err, result_2) {
        var sql2 = "SELECT * FROM web_hacking WHERE vic_name= "+mysql.escape(vicname);
        con.query(sql2, function(err, result3) {
          if(err) throw err;
          res1 = result3;
          var sql3 = "SELECT * FROM account_hacking WHERE vic_name= "+mysql.escape(vicname);
          con.query(sql3, function(err, result4) {
            if(err) throw err;
            res2 = result4;
            var sql4 = "SELECT * FROM arp_poisioning WHERE vic_name= "+mysql.escape(vicname);
            con.query(sql4, function(err, result5) {
              if(err) throw err;
              res3 = result5;
              console.log(res1,res2,res3);
              res.render("custdashboard",{ username : vicname, result1 : res1, result2 : res2, result3 : res3, success: " Succesfully Inserted! "});
  
            })
          })
        })  
      })
    })
  });

})

app.post('/issueacc', (req, res) => {
  const vicname =req.body.vicname;
  const type = req.body.type;
  const type1 = "Account Hacking";
  const url = req.body.url;
  const phoneno = req.body.phoneno;
  const status = "Pending";
  var res1 = []
  var res2 = []
  var res3 = []

  console.log(vicname,type,status);

  var sql = "INSERT INTO account_hacking (type_of_attack, acc_link, status, vic_name, phone_no) VALUES ?";
  var values = [
    [type, url, status,vicname, phoneno]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    var sql2 = "INSERT INTO crimes (vic_name, type, status) VALUES ?";
    var values1 = [
      [vicname, type1, status]
    ];
    con.query(sql2 , [values1], function (err, result1) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
      console.log(result1)
      var sql2 = "SELECT * fROM crimes WHERE vic_name= "+mysql.escape(vicname);
      con.query(sql2, function(err, result_2) {
        var sql2 = "SELECT * FROM web_hacking WHERE vic_name= "+mysql.escape(vicname);
        con.query(sql2, function(err, result3) {
          if(err) throw err;
          res1 = result3;
          var sql3 = "SELECT * FROM account_hacking WHERE vic_name= "+mysql.escape(vicname);
          con.query(sql3, function(err, result4) {
            if(err) throw err;
            res2 = result4;
            var sql4 = "SELECT * FROM arp_poisioning WHERE vic_name= "+mysql.escape(vicname);
            con.query(sql4, function(err, result5) {
               if(err) throw err;
              res3 = result5;
              console.log(res1,res2,res3);
              res.render("custdashboard",{ username : vicname, result1 : res1, result2 : res2, result3 : res3, success: " Succesfully Inserted! "});  
            })
          })
        })  
      })
    })
  });

})

app.post('/issuearp', (req, res) => {
  const vicname =req.body.vicname;
  const pcos = req.body.pcos;
  const pcuname =req.body.pcuname;
  const type1 = "ARP Poisioning";
  const type = req.body.type;
  const pcpassword = req.body.pcpassword;
  const phoneno = req.body.phoneno;
  const status = "Pending";
  var res1 = []
  var res2 = []
  var res3 = []

  console.log(vicname,type1,status);

  var sql = "INSERT INTO arp_poisioning (vic_name, vic_pc_os, vic_pc_user, vic_user_password, status, type_of_attack, phone_no) VALUES ?";
  var values = [
    [vicname , pcos, pcuname, pcpassword, status, type, phoneno]
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    var sql2 = "INSERT INTO crimes (vic_name, type, status) VALUES ?";
    var values1 = [
      [vicname, type1, status]
    ];
    con.query(sql2 , [values1], function (err, result1) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
      console.log(result1)
      var sql2 = "SELECT * fROM crimes WHERE vic_name= "+mysql.escape(vicname);
      con.query(sql2, function(err, result2) {
        var sql2 = "SELECT * FROM web_hacking WHERE vic_name= "+mysql.escape(vicname);
        con.query(sql2, function(err, result3) {
          if(err) throw err;
          res1 = result3;
          var sql3 = "SELECT * FROM account_hacking WHERE vic_name= "+mysql.escape(vicname);
          con.query(sql3, function(err, result4) {
            if(err) throw err;
            res2 = result4;
            var sql4 = "SELECT * FROM arp_poisioning WHERE vic_name= "+mysql.escape(vicname);
            con.query(sql4, function(err, result5) {
              if(err) throw err;
              res3 = result5;
              console.log(res1,res2,res3);
              res.render("custdashboard",{ username : vicname, result1 : res1, result2 : res2, result3 : res3, success: " Succesfully Inserted! "});
  
            })
          })
        })  
      })
    })
  });

})

app.post('/solved', (req, res) => {

  const type = req.body.type;
  const typegen = req.body.typegen;
  const report = req.body.report;
  console.log(typegen,type,report);
  

  if(typegen === "Web Hacking") {
    var sql = "SELECT * FROM web_hacking where type_of_attack="+mysql.escape(type);
  }
  else if(typegen ==="Account Hacking") {
    var sql = "SELECT * FROM account_hacking where type_of_attack="+mysql.escape(type);

  }
  else {
    var sql = "SELECT * FROM arp_poisioning where type_of_attack="+mysql.escape(type);
  }
  var res1 =[];
  var res2 =[];
  var res3 =[];
  con.query(sql, function(err, result) {
    if(err) throw err;
    res1 = result;
    var name = result[0].vic_name;
    console.log(name);
    var sql2 = "SELECT * from customer where username="+mysql.escape(name);
    con.query(sql2, function(err,result2) {
      if(err) throw err;
      var phoneno = result2[0].phoneno1;
      var phonenofinal = phoneno.toString();
      console.log(name,result2[0].phoneno1);
      var sql3 = "INSERT INTO solved (vic_name, report, type_of_attack, vic_phoneno) VALUES ?";
      var values3 = [
        [name, report, type, phonenofinal]
      ];
      con.query(sql3,[values3], function(err,result3) {
        if(err) throw err;
        console.log(result3);
        const status = "Resolved";

        if(typegen === "Web Hacking") {

          var sql4 = "UPDATE web_hacking SET status="+mysql.escape(status)+" WHERE type_of_attack="+mysql.escape(type)+";SELECT * FROM web_hacking";
        }
        else if(typegen ==="Account Hacking") {
 
          var sql4 = "UPDATE account_hacking SET status="+mysql.escape(status)+" WHERE type_of_attack="+mysql.escape(type)+";SELECT * FROM account_hacking";
      
        }
        else {

          var sql4 = "UPDATE arp_poisioning SET status="+mysql.escape(status)+" WHERE type_of_attack="+mysql.escape(type)+";SELECT * FROM arp_poisioning";
        }




        con.query(sql4, function(err,result4) {
          console.log(result4);
          res3 = result4;
          var role = " ";
          if(typegen === "Web Hacking") {
             role = "Web Hack Expert";
          }
          else if(typegen ==="Account Hacking") {
             role = "Account Hack Expert";
          }
          else {
             role = "ARP Poisioning Expert";
          }
          console.log(role);

  
          var sql6 = "SELECT username FROM cyber_expert where role="+mysql.escape(role);
          con.query(sql6, function(err,result5) {
            if(err) throw err;
            console.log(result5);
            console.log(res3);
            if(typegen === "Web Hacking") {
              res.render("webdashboard",{ username : result5[0].username, result : res3[1], success: "Succesfully Inserted! "});
            }
            else if(typegen ==="Account Hacking") {
              res.render("accdashboard",{ username :  result5[0].username, result : res3[1], success: "Succesfully Inserted! "});
          
            }
            else {
              res.render("arpdashboard",{ username :  result5[0].username, result : res3[1], success: "Succesfully Inserted! "});
            }

          })


          
        })
      })
    })
  })
})
 
app.post('/solvedcaseshow', (req, res) => {

  const casename = req.body.casename;
  console.log(casename);
  var sql = "SELECT * FROM solved where type_of_attack="+mysql.escape(casename);
  con.query(sql, function(err,result) {

    console.log(result);
    res.render("solvedcaseshow",{ result: result });

  })


});





app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});
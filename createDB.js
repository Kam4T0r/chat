const mysql = require('mysql');

var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
    })
con.connect((err)=>
    {
        if (err) throw err;
        con.query("CREATE DATABASE horkk",(err)=>
        {
            if (err) throw err;
            console.log('created DB');
        });
    });
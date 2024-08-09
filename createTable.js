const mysql = require('mysql');

var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "horkk"
    });
con.connect((err)=>
    {
        if (err) throw err;
        con.query("CREATE TABLE messages (msg VARCHAR(255), user VARCHAR(255), IPaddr VARCHAR(255))",(err)=>
            {
                if (err) throw err;
                console.log('created table');
            });
    });
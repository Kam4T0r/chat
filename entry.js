const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({extended: true}));
app.set('trust proxy', true);
app.listen(2208,()=>
    {
        console.log('listening on port 2208');
    });

var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "horkk",
    });
con.connect((err)=>
    {
        if (err) throw err;
        console.log('connected to DB')
    })
async function main()
{
    app.get('/messages',(req,res)=>
        {
            con.query('SELECT msg, user FROM messages',(err,results)=>
                {
                    if (err) throw err;
                    let dataToSend = results.map(result=>`USER: ${result.user} MESSAGE: ${result.msg}`).join('<br>');
                    res.send(dataToSend);
                });
        });
    await app.get('/',async (req,res)=>
        {
            let dataToSend = await new Promise((resolve,reject)=>
                {
                    con.query("SELECT msg, user FROM messages",(err,results,fields)=>
                        {
                            if (err) return reject(err);
                            let dataToSend = [];
                            let i = 0;
                            while (true)
                                {
                                    if (results[i] != undefined)
                                        {
                                            dataToSend.push(`USER: ${results[i].user} MESSAGE: ${results[i].msg}`);
                                            i++;
                                        }else
                                        {
                                            break;
                                        }
                                }
                            resolve(dataToSend);
                        });
                });
            res.send(`
<!DOCTYPE html>
<html>
    <head>
        <title>Titties</title>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    </head>
    <body>
        <script>
            $(document).ready(function()
            {
                $('input[type=submit]').hide();
                function valCheck()
                {
                    if ($('#txtA').val().length < 1|| $('#usrName').val().length < 1)
                    {
                        $('input[type=submit]').hide();
                    }else
                    {
                        $('input[type=submit]').show();
                    }
                }
                $('#usrName, #txtA').on('input',valCheck);
                setInterval( function()
                {
                    $.ajax(
                        {
                            url: "/messages",
                            method: "GET",
                            success: function(data)
                            {
                                $('#msgs').html(data);
                            }
                        });
                },3000);
            });
        </script>
        <p id="msgs">${dataToSend.join('<br>')}</p>
        <form action="/" method="POST">
            <input type="text" name="usrName" id="usrName" placeholder="name">
            <br><br><br>
            <textarea name="txtA" id="txtA" placeholder="message"></textarea>
            <br>
            <input type="submit">
        </form>
    </body>
    <style>
        body
        {
            font-family: sans-serif;
            background-color: azure;
        }
        #txtA
        {
            resize: none;
        }
        form
        {
            position: fixed;
            bottom: 10px;
            left: 50%;
            translate: calc(-50%);
            height: max-content;
            width: max-content;
            text-align: center;
            padding: 10px;
            font-family: 'Lucida Sans',sans-serif;
        }
        form>*
        {
            font-family: inherit;
            border: none;
            border-radius: 5px;
        }
        input[type="submit"]
        {
            background-color: darkgrey;
            padding: 5px;
            position: relative;
        }
        #msgs
        {
            text-align: center;
            font-size: 1.5rem;
        }
    </style>
</html>
    `);
        });
    await app.post('/',(req,res)=>
        {
            let usrName = req.body.usrName;
            let msg = req.body.txtA;
            let internetProtocol = req.ip;
            console.log(`USER: ${usrName}\nIP: ${internetProtocol}\nMESSAGE: ${msg}`);
            con.query(`INSERT INTO messages (user, msg, IPaddr) VALUES ("${usrName}", "${msg}", "${internetProtocol}")`);
            res.redirect('/');
        });
}
main();
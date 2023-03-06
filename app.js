const express = require("express");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const app = express();

const pathList = __dirname + "/view/list.ejs";
const pathAbout = __dirname + "/view/about.ejs";
const itemArray = ["example task"];

app.use(express.static(__dirname + '/public/'));

app.use(express.urlencoded({extended: true}));


app.get("/", function(req, res){
    
    let todayDate = date.getDate();
    ejs.renderFile(pathList, {currentDate: todayDate, newItems: itemArray}, function(err, data){
        res.send(data);
    
    });
})

app.get("/about", function(req, res){
    ejs.renderFile(pathAbout,function(err, data){
        res.send(data);
    })
})

app.post("/", function(req, res){

    itemArray.push(req.body.newItem);
    res.redirect("/");

})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})
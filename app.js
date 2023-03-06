const express = require("express");
const ejs = require("ejs");
const app = express();
const path = __dirname + "/list.ejs";
let itemArray = ["example task"];

app.use(express.static(__dirname + '/public/'));

app.use(express.urlencoded({extended: true}));


app.get("/", function(req, res){
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let todayDate = today.toLocaleDateString("en-US", options)
    ejs.renderFile(path, {kindOfDay: todayDate, newItems: itemArray}, function(err, data){
        res.send(data);
    
    });
})

app.post("/", function(req, res){

    itemArray.push(req.body.newItem);
    res.redirect("/");

})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})
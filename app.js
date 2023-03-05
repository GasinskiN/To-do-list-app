const express = require("express");
const ejs = require("ejs");
const app = express();
const path = __dirname + "/list.ejs"


app.get("/", function(req, res){
    var today = new Date();
    
    if (today.getDay() === 6 || today.getDay() === 0){
        var typeOfDay = "Weekend";
    } else {
        var typeOfDay = "Weekday";
    }
    let html = ejs.renderFile(path, {kindOfDay: typeOfDay}, function(err, data){
        res.send(data);
    
    });
})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})
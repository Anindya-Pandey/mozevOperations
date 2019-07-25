let express = require("express");
let bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.json());

app.get("/", function(req, res, next){
	res.send("Helooo");
	res.end();
});

app.listen("3000", function(){
	console.log("Listening on 3000");
});
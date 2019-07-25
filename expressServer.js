let express = require("express");
let bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.json());

app.listen("3000", function(){
	console.log("Listening on 3000");
});
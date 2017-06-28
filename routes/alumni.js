var express = require('express');
var router = express.Router();
var path = require('path');

/* API alumni ECA */
router.get('/', function(req, res, next) {
	console.log("Teste alumni");
  	res.send("Endpoint para API alumni");
});

module.exports = router;

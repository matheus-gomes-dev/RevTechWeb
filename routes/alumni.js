const express = require('express');
const router = express.Router();
const path = require('path');
const database_alumni = require('../modules/database_alumni');

/* API alumni ECA */
router.get('/', function(req, res, next) {
	console.log("Teste alumni");
  	res.send("Endpoint para API alumni");
});

//admin login authentication
/*router.post('/admin', function(req, res, next){
	database_alumni.authentication(req.body, function(response){
		res.send(response);
	});
});
*/

router.get('/admin', function(req, res, next){
	database_alumni.novoAdmin(function(response){
		res.send(response);
	});
});

//check admin user and returns all register requests
router.post('/admin/solicitacao', function(req, res, next){
	database_alumni.consultaSolicitacoes(req.body, function(response){
		res.send(response);
	});
});

router.get('/oportunidades', function(req, res, next){
	database_alumni.consultaOportunidades(function(response){
		res.send(response);
	});
});

router.post('/oportunidades', function(req, res, next){
	database_alumni.novaOportunidade(req.body, function(response){
		res.send(response);
	});
});

//insert new register request
router.post('/solicitacao', function(req, res, next){
	database_alumni.novaSolicitacao(req.body, function(response){
		res.send(response);
	});
});

//delete register request
router.post('/solicitacao/excluir', function(req, res, next){
	database_alumni.excluiSolicitacao(req.body, function(response){
		res.send(response);
	});
});

//accept register request
router.post('/solicitacao/aceitar', function(req, res, next){
	database_alumni.aceitaSolicitacao(req.body, function(response){
		res.send(response);
	});
});

//alumni login
router.post('/login', function(req, res, next){
	database_alumni.alumniLogin(req.body, function(response){
		res.send(response);
	});
});

//update alumni infos
router.put('/alumni', function(req, res, next){
	database_alumni.alumniUpdate(req.body, function(response){
		res.send(response);
	});
});


module.exports = router;

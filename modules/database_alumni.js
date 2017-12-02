const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const path = require('path');
const cfg = require('./conexao');
var passwordHash = require('password-hash');

const mongo_access = cfg.alumni.atlas;

function checkAdmin(user, key, cb){
	mongo.connect(mongo_access.db, function(err, db) {
		let Admin = db.collection('admin');
		Admin.findOne({
            "username": user
        }, function(error, result){
            if (error){ 
                console.log("Database error!!");
                db.close();
                cb(false)
            }
            if (result){
            	//encontrou admin
            	if(passwordHash.verify(key, result.key)){
            		console.log("Senha correta!");
            		db.close();
            		cb(true);	
            	}
            	else{
            		console.log("Senha incorreta!");
            		db.close();
            		cb(false);
            	}
                
            }
            else{
            	console.log("Administrador inválido!");
            	db.close();
                cb(false)
            }
        });
	});
}

function checkAlumni(user_email, key, cb){
	mongo.connect(mongo_access.db, function(err, db) {
		let Alumni = db.collection('alumnis');
		Alumni.findOne({
            "email": user_email
        }, function(error, result){
            if (error){ 
                console.log("Database error!!");
                db.close();
                cb(false)
            }
            if (result){
            	//encontrou alumni
            	if(passwordHash.verify(key, result.key)){
            		console.log("Senha correta!");
            		db.close();
            		cb(true);	
            	}
            	else{
            		console.log("Senha incorreta!");
            		db.close();
            		cb(false);
            	}
                
            }
            else{
            	console.log("Email inválido!");
            	db.close();
                cb(false)
            }
        });
	});
}

function deleteRequest(db, req, cb){
	let Solicitacoes = db.collection('solicitacoes');
	Solicitacoes.remove({
        "_id": ObjectId(req._id)
    }, function(error, result){
        if (error){ 
            console.log("Database error!!");
            db.close();
            cb(false)
        }
        if (result){
        	console.log(result);
        	db.close();
        	cb(result);
        }
    });
}


let database_alumni = {

	authentication: function(req, cb){
		console.log(req);
		//checkAdmin("alumni_admin", 'alumniECA_fem010', function(response){
		checkAdmin(req.userName, req.userKey, function(response){
			console.log(response);
			cb(response);
		})
	},


	//criação do admin
	novoAdmin: function(req, cb){
		mongo.connect(mongo_access.db, function(err, db) {
			if(err){
				console.log("Erro de acesso ao database!");
			}
			else{
				var Admin = db.collection('admin');
				console.log("Conectado ao db com sucesso!");
				var hashedPassword = passwordHash.generate('alumniECA_fem010');
				var newAdmin = {
		            username: 'alumni_admin',
		            key: hashedPassword
		        }
		        Admin.insert(newAdmin, function(error,docsInserted){
		            if(docsInserted){

		            	console.log(docsInserted);
		                cb("Database updated!");
		            }
		        });
				db.close();
			}
		});
	},
	

	novaOportunidade: function(req, cb){
		checkAlumni(req.email, req.key, function(response){
			if(!response){
				let data={message:"Usuário inválido!"};
				cb(data);
			}
			else{
				mongo.connect(mongo_access.db, function(err, db) {
					if(err){
						console.log("Erro de acesso ao database!");
						db.close();
						let data={message:"Erro na operação!"};
						cb(data);
					}
					else{
						let Oportunidades = db.collection('oportunidades');
						console.log("Conectado ao db com sucesso!");
						let doc={
							title: req.title,
							description: req.description,
							author: req.name,
							created_at: new Date()
						}
				        Oportunidades.insert(doc, function(error,docsInserted){
				            if(docsInserted){
				            	console.log(docsInserted);
				            	db.close();
				            	let successMessage={
				            		message: "Database updated!"
				            	}
				                cb(successMessage);
				            }
				            else if(error){
				            	db.close();
				            	let data={message:"Erro na operação!"};
				            	cb(data);
				            }
				        });
					}
				});
			}
		});
	},

	consultaOportunidades: function(cb){
		mongo.connect(mongo_access.db, function(err, db) {
			if(err){
				console.log("Erro de acesso ao database!");
				db.close();
				let data={message:"Erro na operação!"};
				cb(data);
			}
			else{
				let cursor = db.collection('oportunidades').find().sort({"created_at": -1});
				let Oportunidades = []
				// Execute the each command, triggers for each document
		        cursor.each(function(err, item) {
		            // If the item is null then the cursor is exhausted/empty and closed
		            if(item == null) {
		                db.close();
		                cb(Oportunidades);
		                return;
		            }
		            else{
		            	if(item.created_at != undefined){
		            		let formatedDate = '';
		            		formatedDate += item.created_at.getDate() + '/';
		            		formatedDate += (item.created_at.getMonth()+1) + '/';
		            		formatedDate += item.created_at.getFullYear();
		            		item.created_at = formatedDate;
		            	}
		                Oportunidades.push(item);
		            }
		        });
			}
		});
	},

	novaSolicitacao: function(req, cb){
		mongo.connect(mongo_access.db, function(err, db){
			if(err){
				console.log("Erro de acesso ao database!");
				db.close();
				let data={message:"Erro na operação!"};
				cb(data);
			}
			else{
				let Solicitacoes = db.collection('solicitacoes');
				console.log("Conectado ao db com sucesso!");
		        Solicitacoes.insert(req, function(error,docsInserted){
		            if(docsInserted){
		            	console.log(docsInserted);
		            	db.close();
		            	let successMessage={
		            		message: "Database updated!"
		            	}
		                cb(successMessage);
		            }
		            else if(error){
		            	let data={message:"Erro na operação!"};
		            	cb(data);
		            }
		        });
			}
		})
	},

	excluiSolicitacao: function(req, cb){
		console.log(req);
		checkAdmin(req.userName, req.userKey, function(response){
			if(!response){
				console.log("Tentativa de acesso com admin inválido!");
				let data={message:"Administrador inválido!"}
				cb(data)
			}
			else{
				mongo.connect(mongo_access.db, function(err, db) {
					deleteRequest(db, req, function(response){
						cb(response);
					});
				});
			}
		});
	},

	aceitaSolicitacao: function(req, cb){
		console.log(req);
		checkAdmin(req.userName, req.userKey, function(response){
			if(!response){
				console.log("Tentativa de acesso com admin inválido!");
				let data={message:"Administrador inválido!"}
				cb(data)
			}
			else{
				mongo.connect(mongo_access.db, function(err, db) {
					let Alumnis = db.collection('alumnis');
					let hashedPassword = passwordHash.generate(req.key);
					let newAlumni = {
			            name: req.name,
			            key: hashedPassword,
			            firstYear: req.firstYear,
			            lastYear: req.lastYear,
			            email: req.email,
			            about: "",
			            knowledge: "",
			            experience: ""
			        }
					Alumnis.insert(newAlumni, function(error,docsInserted){
			            if (error){ 
			                console.log("Database error!!");
			                let data={message:"Erro na operação!"} 
	            			db.close();
							cb(data);
			            }
			            else if (docsInserted){
			            	console.log(docsInserted);
			            	deleteRequest(db, req, function(res){
			            		if(!res){
			            			let data={message:"Erro na operação!"} 
			            			db.close();
									cb(data);
			            		}
			            		else{
			            			console.log(res);
						        	db.close();
						        	cb(res);
			            		}
							});
			            }
			        });
				});
			}
		});
	},

	consultaSolicitacoes: function(req, cb){
		console.log(req);
		checkAdmin(req.userName, req.userKey, function(response){
			console.log(req);
			console.log(response);
			if(!response){
				console.log("Tentativa de acesso com admin inválido!");
				let data={message:"Administrador inválido!"}
				cb(data)
			}
			else{
				mongo.connect(mongo_access.db, function(err, db) {
					if(err){
						console.log("Erro de acesso ao database!");
						db.close();
						let data={message:"Erro na operação!"};
						cb(data)
					}
					else{
						let cursor = db.collection('solicitacoes').find();
						let Solicitacoes = []
						// Execute the each command, triggers for each document
				        cursor.each(function(err, item) {
				            // If the item is null then the cursor is exhausted/empty and closed
				            if(item == null) {
				                db.close();
				                cb(Solicitacoes);
				                return;
				            }
				            else{
				                Solicitacoes.push(item);
				            }
				        });
					}
				});
			}
		});
	},

	alumniLogin: function(req, cb){
		console.log(req);
		checkAlumni(req.userName, req.userKey, function(response){
			if(!response){
				let data={message:"Usuário inválido!"};
				cb(data);
			}
			else{
				mongo.connect(mongo_access.db, function(err, db) {
					if(err){
						console.log("Erro de acesso ao database!");
						db.close();
						let data={message:"Erro na operação!"};
						cb(data);
					}
					else{
						let cursor = db.collection('alumnis').find();
						let Alumnis = []
						// Execute the each command, triggers for each document
				        cursor.each(function(err, item) {
				            // If the item is null then the cursor is exhausted/empty and closed
				            if(item == null) {
				                db.close();
				                cb(Alumnis);
				                return;
				            }
				            else{
				                Alumnis.push(item);
				            }
				        });
				    }
				});
			}
		});
	},

	alumniUpdate: function(req, cb){
		checkAlumni(req.email, req.key, function(response){
			if(!response){
				let data={message:"Usuário inválido!"};
				cb(data);
			}
			else{
				mongo.connect(mongo_access.db, function(err, db) {
					if(err){
						console.log("Erro de acesso ao database!");
						db.close();
						let data={message:"Usuário inválido!"};
						cb(data);
					}
					else{
						let Alumnis = db.collection('alumnis');
						let query = {"email": req.email}
						Alumnis.update(
							query, 
							{$set: {"experience": req.experience, "knowledge": req.knowledge}},
							function(error,doc){
								if(error){
									console.log("Erro de acesso ao database!");
									db.close();
									let data={message:"Usuário inválido!"};
									cb(data);
								}
								else{
									db.close();
									cb(doc);
								}
							}
						)
					}
				});
			}
		});
	}
}


module.exports = database_alumni;
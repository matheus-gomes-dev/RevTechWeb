"use strict";
const config = {
	alumni:{
		localhost: {
			db: "mongodb://localhost:27017/alumni",
			username: "",
			pass: ""
		},
		atlas: {
			db: 'mongodb://Matheus:kirkhetfield_92@cluster0-shard-00-00-qrgyy.mongodb.net:27017,cluster0-shard-00-01-qrgyy.mongodb.net:27017,cluster0-shard-00-02-qrgyy.mongodb.net:27017/alumni?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
			username: "",
			pass: ""
		}
	}
}

module.exports = config;
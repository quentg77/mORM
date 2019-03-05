import {isEmpty} from 'lodash';
import {existsSync} from 'fs';
import Path from 'path';
import PostgreSQL from './engine/postgresql';

export default class mOrm {
	configPathName = "./mOrm.config.json";

	async createConnection(dbConfig = {}) {
		console.log("ON CREATE");

		if (isEmpty(dbConfig)) {
			if (!existsSync(Path.join(__dirname, this.configPathName))) {
				throw new Error("config file is required")
			}

			this.dbconfig = require(Path.join(__dirname, this.configPathName));

			console.log("loaded config from file");
		}
		else {
			if (dbConfig.uri) {
				const regexp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/g;

				const [, type, username, password, host, port, database] = regexp.exec(dbConfig.uri);

				console.log(type)

				this.dbConfig = {
					type,
					username,
					password,
					host,
					port,
					database
				}

				console.log(this.dbConfig.type)

				console.log("loaded config from param");
			}
			else {
				this.dbConfig = dbConfig
			}
		}

		console.log("connect ok");

		switch (this.dbConfig.type) {
			case 'postgres':
				this.dbInstance = new PostgreSQL(this.dbConfig)
				break;
			
			// case 'postgres':
			// 	this.dbInstance = new MySql(this.config)
			// 	break;

			default:
				throw new Error("engine .. not supported")
		}
		await this.dbInstance.initialize()
	}
}
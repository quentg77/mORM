import { Client } from 'pg';
import Core from './core';

export default class PostgreSQL extends Core {

	constructor(option) {
		super(option)
	}

	async initialize() {
		const { host, port, username, password, database } = this;

		console.log(
			`user : ${username}\n` +
			`host : ${host}\n` +
			`port : ${port}\n` +
			`database : ${database}\n` +
			`password : ${password}\n`
		);

		this.client = new Client({
			user: username,
			host,
			port,
			database,
			password
		});

		try {
			this.client.connect()
			console.log("client connected")

			this.client.query(`SELECT NOW()`, (err, res) => {
				console.log("query ok");
				this.client.end();
			})
		}
		catch (err) {
			console.log(`database ${database} doesn't exist`);
			console.log(err);
		}
	}
}
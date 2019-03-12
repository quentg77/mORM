import { Client } from 'pg';
import Core from './core';
import { isEmpty } from "lodash";

export default class PostgreSQL extends Core {

	// constructor(option) {
	// 	super(option)
	// }

	async initialize() {
		const { host, port, username, password, database, synchronize, entities } = this;

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

			const arEntities = Object.values(entities)

			if (synchronize) {
				for (const entity of arEntities) {
					const { name: tableName } = entity.meta();
					this.client.query(`DELETE FROM ${tableName}`, (err, res) => {
						if (err) {
							throw new Error(err.stack);
						} else {
							console.log(`Table ${tableName} has been erased`);
						}
					});
				}
			}

			for (const entity of arEntities) {
				const { name: tableName, columns } = entity.meta();

				let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

				for (const [key, item] of Object.entries(columns)) {
					let type;

					if (item.primary && item.generated) {
						type = "SERIAL"
					}
					else {
						switch (item.type) {
							case "string":
								type = "varchar(255)";
								break;
							case "number":
								type = "integer";
								break;

							default:
								type = "";
						}
					}

					query += `${key} ${type}`;

					if (item.primary) {
						// if (item.generated) {
						// 	query += ` SERIAL`;
						// }
						query += ` PRIMARY KEY`;
					} else {
						query += ` ${item.optional === true ? "NULL" : "NOT NULL"}`;
					}

					query += ", ";
				}

				query = query.slice(0, -2) + ")"

				this.client.query(query, (err, res) => {
					if (err) {
						console.log(query);
						throw new Error(err.stack);
					} else {
						console.log(`Table ${tableName} has been created`);
					}
				})
			}

			//this.client.end()
		}
		catch (err) {
			console.log(`database ${database} doesn't exist`);
			console.log(err);
			this.client.end()
		}
	}

	async count(tableName) {
		return new Promise((resolve, reject) => {
			this.client.query(`SELECT COUNT(*) FROM ${tableName}`, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result.rows[0].count);
				}
			});
		})
	}

	async save(tableName, data) {
		let query = `INSERT INTO ${tableName}`;
		let keystring = "(";
		let valuestring = " VALUES (";

		for (const [key, value] of Object.entries(data)) {
			keystring += `${key} ,`;
			switch (typeof (value)) {
				case "string":
					valuestring += `'${value}' ,`;
					break;
				case "number":
					valuestring += `${value} ,`;
					break;
				default:
					break;
			}
		}

		keystring = keystring.slice(0, -1) + ")";
		valuestring = valuestring.slice(0, -1) + ")";

		query += keystring + valuestring;

		return new Promise((resolve, reject) => {
			this.client.query(query, (err, result) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(result.rows);
				}
			});
		});
	}

	async findByPK(tableName, id, { attributes }) {
		return new Promise((resolve, reject) => {
			let query = `SELECT ${isEmpty(attributes) ? "*" : attributes.join(",")} FROM ${tableName} WHERE id = ${id}`;

			this.client.query(query, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result.rows);
				}
			});
		});
	}

	async findAll(tableName, { attributes }) {
		return new Promise((resolve, reject) => {
			let query = `SELECT ${isEmpty(attributes) ? "*" : attributes.join(",")} FROM ${tableName}`;

			this.client.query(query, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result.rows);
				}
			});
		});
	}

	async update(tableName, data) {
		let query = `UPDATE ${tableName} SET `;
		let whereString = "";
		let attributesString = "";
		console.log(data);
		const { where, attributes } = data;
		console.log("test");

		for (const [key, value] of Object.entries(where)) {
			switch (typeof (value)) {
				case "string":
					whereString += `${key} = '${value}' AND`;
					break;
				case "number":
					whereString += `${key} = ${value} AND`;
					break;
				default:
					break;
			}
		}

		whereString = whereString.slice(0, -3);

		for (const [key, value] of Object.entries(attributes)) {
			switch (typeof (value)) {
				case "string":
					attributesString += `${key} = '${value}',`;
					break;
				case "number":
					attributesString += `${key} = ${value},`;
					break;
				default:
					break;
			}
		}

		attributesString = attributesString.slice(0, -1);

		query += attributesString + " WHERE " + whereString;

		console.log(query);

		return new Promise((resolve, reject) => {
			this.client.query(query, (err, result) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(result.rows);
				}
			});
		});
	}
}
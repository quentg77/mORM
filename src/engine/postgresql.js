import { Client } from 'pg';
import Core from './core';

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
}
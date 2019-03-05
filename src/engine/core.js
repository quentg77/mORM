export default class Core {
	constructor({ host, port, username, password, database }) {
		this.host = host
		this.port = port
		this.username = username
		this.password = password
		this.database = database
	}
	dump() {
		console.log(`Database infos: 
	  host: ${this.host} 
	  port: ${this.port} 
	  username: ${this.username} 
	  password: ${this.password} 
	  database: ${this.database} 
	  `)
	}
}
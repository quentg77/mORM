import mOrm from './mOrm';

(async () => {
	const orm = new mOrm();
	
	try {
		await orm.createConnection(
			{
				uri: "postgres://qguic:test@localhost:5432/iLovePragmatic"
			}
		)
	}
	catch (err) {
		console.log(err);
		process.exit(-1);
	}
})()
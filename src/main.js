import mOrm from './mOrm';
import Student from '../entities/student';

(async () => {
	const orm = new mOrm();

	try {
		await orm.createConnection(
			{
				uri: "postgres://qguic:test@localhost:5432/iLovePragmatic",
				synchronize: false
			},
			{
				entities: [Student]
			}
		)

		const studentEntity = orm.getEntity("Student");
		// const count = await studentEntity.count();
		// const user1 = await studentEntity.findByPK(1);
		// const allRow = await studentEntity.findAll();
		// console.log(`number of row in Student: ${count}`);
		// console.log(allRow);
		// console.log(user1);
		const update = studentEntity.update({where: {id: 1}, attributes: {age: 24}});
		console.log(update);
		//const insert = await studentEntity.save({firstname: "chloe", lastname: "guichaoua", age: 18});
	}
	catch (err) {
		console.log(err);
		process.exit(-1);
	}
})()
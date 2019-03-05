export default class Student {
	static meta() {
		return {
			name: "Student",
			columns: {
				id: {
					primary: true,
					type: "number",
					generated: true
				},
				firstname: {
					type: "string"
				},
				lastname: {
					type: "string"
				},
				age: {
					type: "number"
				}
			}
		};
	}
}
import { google } from "googleapis";

export default class Docs {
	tasksArray = [];
	createData(tasks) {
		let arr = Array.from(tasks);

		let tableLength = 5 * arr.length + 7;
		this.tasksArray.push({
			insertTable: {
				rows: arr.length + 1,
				columns: 2,
				location: {
					index: 1, // Modified
				},
			},
		});
		for (let i = arr.length - 1; i >= 0; i--) {
			this.tasksArray.push({
				insertText: {
					text: arr[i][1],
					location: {
						index: tableLength,
					},
				},
			});
			tableLength -= 2;
			this.tasksArray.push({
				insertText: {
					text: arr[i][0],
					location: {
						index: tableLength,
					},
				},
			});
			tableLength -= 3;
		}

		this.tasksArray.push({
			insertText: {
				text: "Aufgabe",
				location: {
					index: 7,
				},
			},
		});
		this.tasksArray.push({
			insertText: {
				text: "Datum",
				location: {
					index: 5,
				},
			},
		});
	}
	async driveAccess(tokens) {
		const service = google.drive({
			version: "v2",
			// this header will be present for every request
			headers: {
				Authorization: `Bearer ${tokens}`,
			},
		});
		return service;
	}
	async createFile(tokens) {
		const docs = await google.docs({
			version: "v1",
			headers: {
				Authorization: `Bearer ${tokens}`,
			},
		});
		return docs;
	}
}

import http from "http";
import clockifyData from "./clockify.js";
import Docs from "./google.js";
let data = null;
let fileId = null;
let clockifyObject = new clockifyData();
let tasks = null;
await clockifyObject.setApiKey(
	"YWEyMDRlODAtZmJkYS00N2YxLWJmMTctZTM0NGJhMzE2ZmFl"
);
await clockifyObject.getEntries();
await clockifyObject.chooseTasks(9);
tasks = clockifyObject.getTasks();
http
	.createServer(async (request, response) => {
		data = request.url.substring(request.url.indexOf("?") + 7);
		let docData = new Docs();
		let service = docData.driveAccess(data);
		docData.createData(tasks);
		let doc = null;
		await docData
			.createFile(data)
			.then((res) => {
				doc = res;
				let docu = res.documents.create({
					requestBody: {
						documentId: `${clockifyObject.id}`,
						title: `${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
						body: {},
					},
				});

				return docu;
			})
			.then((dok) => {
				fileId = dok.data.documentId;
			});

		doc.documents.batchUpdate({
			documentId: `${fileId}`,
			resource: {
				requests: docData.tasksArray,
			},
		});
		await docData.driveAccess(data).then((res) => {
			res.files.update({
				fileId: fileId,
				addParents: "1dYuvRyH6sPEt29vvC5zUXT9vbAcUaB67",
				fields: "id, parents",
			});
		});
		response.statusCode = 200;
		response.end("hallo welt !!!");
	})
	.listen(8083);

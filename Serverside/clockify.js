export default class ClockifyData {
	projects = null;
	tasksMap = null;
	tasksSet = null;
	id = null;
	key = null;
	url = `https://api.clockify.me/api/v1`;
	async setApiKey(key) {
		this.key = key;
	}
	async getEntries() {
		if (!this.key) {
			console.log(
				`API key must be provided through 'CLOCKIFY_API_KEY' env variable. Get one at https://clockify.me/user/settings`
			);

			process.exit(1);
		}
		const fetchResponse = await fetch(`${this.url}/user`, {
			headers: {
				"X-Api-Key": this.key,
			},
		}).then((r) => r.json());
		this.projects = await fetch(
			`${this.url}/workspaces/${fetchResponse.activeWorkspace}/user/${fetchResponse.id}/time-entries?page-size=200`,
			{
				headers: {
					"X-Api-Key": this.key,
				},
			}
		).then((r) => {
			return r.json();
		});
		this.id = this.projects[0].id;
	}
	async chooseTasks() {
		let month = new Date().getMonth() + 1;
		this.tasksMap = new Map();
		for (let task of this.projects) {
			if (
				new Date(task.timeInterval.start).getMonth() + 1 === month &&
				task.description.toLowerCase() !== "pause" &&
				task.description.toLowerCase() !== "daily"
			) {
				let taskDate = `${new Date(task.timeInterval.start).getDate()}.${
					new Date(task.timeInterval.start).getMonth() + 1
				}.${new Date(task.timeInterval.start).getFullYear()}`;
				this.tasksMap.set(`${taskDate}`, task.description);
			}
		}
		this.tasksSet = new Set(this.tasksMap);
	}
	getTasks() {
		return this.tasksSet;
	}
}

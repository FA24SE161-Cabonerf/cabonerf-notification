import { NotificationServer } from '@notification/server';
import express, { Express } from 'express';

class Application {
	init() {
		const app: Express = express();
		const notificationServer: NotificationServer = new NotificationServer();
		notificationServer.start(app);
	}
}

const application: Application = new Application();
application.init();

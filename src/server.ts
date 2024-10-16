import config from '@notification/config';
import { BASE_URL } from '@notification/constants/baseurl';
import elasticSearch from '@notification/elasticsearch';
import { infoMessage } from '@notification/log/message.log';
import { createConnection } from '@notification/queues/connection';
import { consumerJavaServices } from '@notification/queues/consumer';
import healthRoute from '@notification/routes/health.routes';
import { winstonLogger } from '@notification/winston';
import { Channel } from 'amqplib';
import { Application } from 'express';
import http from 'http';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Notification', 'debug');

export class NotificationServer {
	public start(app: Application) {
		this.initServer(app);
		this.initElasticsearch();
		this.initQueues();
		this.initRoutes(app);
	}

	private initRoutes(_app: Application) {
		_app.use(BASE_URL, healthRoute.routes());
	}

	private async initQueues() {
		const channel = await createConnection();
		consumerJavaServices(channel as Channel);
	}

	private async initElasticsearch() {
		await elasticSearch.checkConnection();
	}

	private async initServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			await this.startServer(httpServer);
		} catch (error) {
			log.error(infoMessage({ service: 'Server', content: error as string }));
		}
	}

	private async startServer(httpServer: http.Server): Promise<void> {
		try {
			log.info(infoMessage({ service: 'Server', content: `has work on pid ${process.pid}` }));
			httpServer.listen(config.SERVER_PORT, () => {
				log.info(infoMessage({ service: 'Server', content: `running on port ${config.SERVER_PORT}` }));
			});
		} catch (error) {
			log.error(infoMessage({ service: 'Server', content: error as string }));
		}
	}
}

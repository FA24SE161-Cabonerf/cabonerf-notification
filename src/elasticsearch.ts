import { Client } from '@elastic/elasticsearch';
import config from '@notification/config';
import { infoMessage } from '@notification/log/message.log';
import { winstonLogger } from '@notification/winston';

import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Notification', 'debug');

class Elasticsearch {
	private client: Client;

	constructor() {
		this.client = new Client({
			node: `${config.ELASTIC_SEARCH_URL}`
		});
	}

	async checkConnection() {
		let isConnected = false;
		while (isConnected === false) {
			log.info(infoMessage({ service: 'Elasticsearch', content: 'try to connecting...' }));
			try {
				const health = await this.client.cluster.health({});
				log.info(infoMessage({ service: 'Elasticsearch', content: `status::${health.status}` }));

				isConnected = true;
			} catch (error) {
				log.error(infoMessage({ service: 'Elasticsearch', content: `status::${error}` }));
			}
		}
	}
}

const elasticSearch = new Elasticsearch();
export default elasticSearch;

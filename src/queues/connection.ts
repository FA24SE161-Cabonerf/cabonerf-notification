import config from '@notification/config';
import { infoMessage } from '@notification/log/message.log';
import { winstonLogger } from '@notification/winston';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
	try {
		const connection: Connection = await client.connect(`${config.RABBIT_MQ_URI}`);
		const channel: Channel = await connection.createChannel();
		log.info(infoMessage({ service: 'RabbitMQ', content: 'Connecting success' }));

		closeConnection(channel, connection);
		return channel;
	} catch (error) {
		log.error(infoMessage({ service: 'RabbitMQ', content: error as string }));
		return undefined;
	}
}

function closeConnection(channel: Channel, connection: Connection): void {
	process.once('SIGINT', async () => {
		await channel.close();
		await connection.close();
	});
}

export { createConnection };

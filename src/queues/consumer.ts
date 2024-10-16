import { sendVerifyEmail } from '@notification/aws/ses.aws';
import config from '@notification/config';
import { infoMessage } from '@notification/log/message.log';
import { createConnection } from '@notification/queues/connection';
import { winstonLogger } from '@notification/winston';
import { Channel } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Notification', 'debug');

export const consumerJavaServices = async (channel: Channel) => {
	try {
		if (!channel) {
			channel = (await createConnection()) as Channel;
		}

		const exchangeName = config.JAVA_EXCHANGE_NAME as string;
		const routingKey = config.JAVA_ROUTING_KEY as string;
		const queue = config.JAVA_QUEUE as string;

		const _exchangeName = await channel.assertExchange(exchangeName, 'direct');

		const _queue = await channel.assertQueue(queue, {
			durable: true,
			autoDelete: false
		});

		await channel.bindQueue(_queue.queue, _exchangeName.exchange, routingKey);

		await channel.consume(_queue.queue, async (msg) => {
			if (msg) {
				const { email, content } = JSON.parse(msg.content.toString());
				console.log('123');
				await sendVerifyEmail(email, 'RabbitMQ', content);
				channel.ack(msg);
			}
		});
	} catch (error) {
		log.error(infoMessage({ service: 'RabbitMQ', content: error as string }));
	}
};

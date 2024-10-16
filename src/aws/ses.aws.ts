import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import config from '@notification/config';
import { infoMessage } from '@notification/log/message.log';
import { winstonLogger } from '@notification/winston';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Notification', 'debug');

// Define interface for the function parameters
interface SendEmailCommandInput {
	fromAddress: string;
	toAddresses: string | string[];
	ccAddresses?: string | string[];
	body: string;
	subject: string;
	replyToAddresses?: string | string[];
}

// Create SES service object with type support for configuration
const sesClient = new SESClient({
	region: config.AWS_REGION,
	credentials: {
		secretAccessKey: config.AWS_SECRET_ACCESS_KEY || '',
		accessKeyId: config.AWS_ACCESS_KEY_ID || ''
	}
});

// Create a function to return the SendEmailCommand
const createSendEmailCommand = ({
	fromAddress,
	toAddresses,
	ccAddresses = [],
	body,
	subject,
	replyToAddresses = []
}: SendEmailCommandInput): SendEmailCommand => {
	return new SendEmailCommand({
		Destination: {
			CcAddresses: Array.isArray(ccAddresses) ? ccAddresses : [ccAddresses],
			ToAddresses: Array.isArray(toAddresses) ? toAddresses : [toAddresses]
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: body
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject
			}
		},
		Source: fromAddress,
		ReplyToAddresses: Array.isArray(replyToAddresses) ? replyToAddresses : [replyToAddresses]
	});
};

// Function to send a verification email
export const sendVerifyEmail = async (toAddress: string, subject: string, body: string): Promise<void> => {
	const sendEmailCommand = createSendEmailCommand({
		fromAddress: config.SES_FROM_ADDRESS || '',
		toAddresses: toAddress,
		body,
		subject
	});

	try {
		await sesClient.send(sendEmailCommand);
		log.info(infoMessage({ service: 'AWS SES', content: 'Send Success Email' }));
	} catch (e) {
		console.error('Failed to send email.', e);
	}
};

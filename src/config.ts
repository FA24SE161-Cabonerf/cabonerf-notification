import 'dotenv/config';

class Config {
	public SERVER_PORT: string | undefined;
	public ELASTIC_SEARCH_URL: string | undefined;
	public RABBIT_MQ_URI: string | undefined;
	public JAVA_ROUTING_KEY: string | undefined;
	public JAVA_EXCHANGE_NAME: string | undefined;
	public JAVA_QUEUE: string | undefined;
	public AWS_ACCESS_KEY_ID: string | undefined;
	public AWS_SECRET_ACCESS_KEY: string | undefined;
	public AWS_REGION: string | undefined;
	public SES_FROM_ADDRESS: string | undefined;

	constructor() {
		this.SERVER_PORT = process.env.SERVER_PORT || '';
		this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
		this.RABBIT_MQ_URI = process.env.RABBIT_MQ_URI;
		this.JAVA_ROUTING_KEY = process.env.JAVA_ROUTING_KEY;
		this.JAVA_EXCHANGE_NAME = process.env.JAVA_EXCHANGE_NAME;
		this.JAVA_QUEUE = process.env.JAVA_QUEUE;
		this.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
		this.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
		this.AWS_REGION = process.env.AWS_REGION;
		this.SES_FROM_ADDRESS = process.env.SES_FROM_ADDRESS;
	}
}

const config = new Config();
export default config;

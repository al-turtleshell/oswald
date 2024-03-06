import type { Connection, Channel } from 'amqplib';
import amqp from 'amqplib';
import { config } from './config';

class RabbitMQClient {
    private static instance: RabbitMQClient;
    private conn: Connection | null = null;
    private channel: Channel | null = null;

    public static getInstance(): RabbitMQClient {
        if (!RabbitMQClient.instance) {
            RabbitMQClient.instance = new RabbitMQClient();
        }
        return RabbitMQClient.instance;
      }

    public async connect(): Promise<void> {
        this.conn = await amqp.connect(config.rabbitmq.url);
        this.channel = await this.conn.createChannel();
    }

    
    public async getChannel(): Promise<Channel> {
        if (!this.channel) {
            await this.connect();
        }
        return this.channel!;
    }

    public async sendMessage(exchange: string, routingKey: string, message: string): Promise<Boolean> {
        const channel = await this.getChannel();
        const result = channel.publish(exchange, routingKey, Buffer.from(message));
        return result;
    }

    public async closeConnection(): Promise<void> {
        if (this.conn) {
            await this.conn.close();
            this.conn = null;
        }
    }


}

export { RabbitMQClient };
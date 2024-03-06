import { InboxState, type PrismaClient } from "@prisma/client";
import type { RabbitMQClient } from "../rabbit-mq-client";

class EventDock {
    private pgClient: PrismaClient;
    private rabbitMQClient: RabbitMQClient;

    constructor(pgClient: PrismaClient, rabbitMQClient: RabbitMQClient) {
        this.pgClient = pgClient;
        this.rabbitMQClient = rabbitMQClient;
    }


    async publishPendingEvents() {
        try {
            for(let i = 0; i < 2; i++) {
                await this.pgClient.$transaction(async tx => {
                    const lockQuery = `SELECT * from "Outbox" where state = 'Pending' ORDER BY timestamp ASC LIMIT 1 FOR UPDATE`;
                    const data = await tx.$queryRawUnsafe(lockQuery) as {payload: Record<string,any>, id: string}[];
                    
                    if (data.length > 0) {
                        const {payload} = data[0];
    
                        const published = await this.rabbitMQClient.sendMessage('first_exchange','', JSON.stringify(payload));
    
                        if (published) {
                            await tx.outbox.update({
                                where: {id: data[0].id},
                                data: {state: 'Published', publishedAt: new Date()}
                            });
                        } else {
                            throw new Error('Failed to publish message');
                        }
                    } 
                })
            }
        } catch(error) {
            console.log(error)
        }

    }

    async receiveEvent() {
        try {
            const channel = await this.rabbitMQClient.getChannel();
            channel.consume('order_servcie', async (msg) => {
                if(msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    await this.pgClient.inbox.create({
                        data: {
                            id: data.eventId,
                            type: data.__oswald__event_name,
                            state: InboxState.Pending,
                            payload: data
                        }
                    })
                    channel.ack(msg);
                }
            });
        } catch (e) {
            console.log(e);
            throw e;
        }

    }
}

export { EventDock };
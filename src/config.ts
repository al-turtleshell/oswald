import dotenv from "dotenv";
dotenv.config();

const config = {
    event_snapshot_interval: 2,
    rabbitmq: {
        url: process.env.AMQP_URL || "amqp://localhost:5672",
    }
};

export {config}
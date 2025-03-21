#!/usr/bin/env python3

"""
A standalone script to create exchanges and queues on RabbitMQ.
"""

import pika

# amqp_host = "localhost"
amqp_host = "rabbitmq"  # Use "rabbitmq" if running inside Docker
amqp_port = 5672
exchange_name = "main"
exchange_type = "topic"

#Creates the big ass exchange
def create_exchange(hostname, port, exchange_name, exchange_type):
    print(f"Connecting to AMQP broker {hostname}:{port}...")
    # connect to the broker
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=hostname,
            port=port,
            heartbeat=300,
            blocked_connection_timeout=300,
        )
    )
    print("Connected")

    print("Open channel")
    channel = connection.channel()

    # Set up the exchange if the exchange doesn't exist
    print(f"Declare exchange: {exchange_name}")
    channel.exchange_declare(
        exchange=exchange_name, exchange_type=exchange_type, durable=True
    )
    # 'durable' makes the exchange survive broker restarts ie if rabbitmq dies still exsists

    return channel

#Create the individual queues attahced the exchange 
def create_queue(channel, exchange_name, queue_name, routing_key):
    print(f"Bind to queue: {queue_name}")
    channel.queue_declare(queue=queue_name, durable=True)
    # 'durable' makes the queue survive broker restarts ie if rabbitmq dies still exsists

    # bind the queue to the exchange via the routing_key
    channel.queue_bind(
        exchange=exchange_name, queue=queue_name, routing_key=routing_key
    )


channel = create_exchange(
    hostname=amqp_host,
    port=amqp_port,
    exchange_name=exchange_name,
    exchange_type=exchange_type,
)

#Creates one queue for notification
create_queue(
    channel=channel,
    exchange_name=exchange_name,
    queue_name="notifications",
    routing_key="#.notifications",
)

# #Creates one queue for queue
# create_queue(
#     channel=channel,
#     exchange_name=exchange_name,
#     queue_name="queue",
#     routing_key="#.queue",
# )
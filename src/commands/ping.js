exports.run = (client, msg, args) => {
    msg.channel.send("Pong!");
    msg.delete();
}

exports.help = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot to check if it is working',
    category: 'default'
}
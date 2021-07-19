exports.run = (client, msg, args) => {
    client.generateInvite({ permissions: [
        'SEND_MESSAGES',
        'MANAGE_MESSAGES',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
    ]}).then(invite => {
        msg.channel.send(invite);
    });
    msg.delete();
}

exports.help = {
    name: 'invite',
    usage: 'invite',
    description: 'generates bot invite',
    category: 'default'
}
const fs = require('fs');
const path = require('path');
const config = require('../config/main.js');
const { Client, Intents } = require('discord.js');

// validate token from config
if(!config.token) {
    console.error('Token Invalid');
    process.exit(1);
}
if (!/^[a-zA-Z0-9_.-]{59}$/.test(config.token)) {
    console.error('Token Invalid');
    process.exit(1);
}

// create map for commands
const commands = new Map()

// define intents
const intents = new Intents([
    Intents.NON_PRIVILEGED,
    "GUILD_MEMBERS"
]);

// create client
const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'], ws: { intents }, fetchAllMembers: true, disableEveryone: true });

// store config and commands in client var to make them accessible everywhere
client.config = config;
client.commands = commands;

// Command Initializer
fs.readdirSync(path.resolve(__dirname, 'commands'))
    .filter(f => f.endsWith('.js'))
    .forEach(f => {
        // attempt to load command file
        console.log(`Initializing command ${f}`);
        try {
            // require the file
            let command = require(`./commands/${f}`);

            // validate command
            if(typeof command.run !== 'function') throw 'Command missing run function';
            else if(!command.help || !command.help.name) throw 'Command missing help info';

            // store the command in the map
            commands.set(command.help.name, command);
        } catch (error) {
            console.error(`Failed Initializing command ${f}: ${error}`);
        }
    });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
    if(msg.author.bot || !msg.guild) return;

    let { content } = msg;

    if(!content.startsWith(config.prefix)) return;

    let split = content.substr(config.prefix.length).split(' ');
    let name = split[0];
    let args = split.slice(1);

    if(commands.get(name)) {
        commands.get(name).run(client, msg, args);
    }
})

config.token && client.login(config.token)
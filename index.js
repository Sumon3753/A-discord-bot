const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios'); // You need to install axios for API calls
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });
const TOKEN = 'TOKEN'; // Replace with your actual bot token
const PREFIX = '!'; // Set your desired prefix here (empty for no prefix)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set bot status to "Do Not Disturb" and custom status
    client.user.setPresence({
        status: 'idle', // 'dnd' sets "Do Not Disturb" status
        activities: [{
            name: 'being coded by imanoobguy', // Activity name
            type: 'PLAYING' // Activity type: 'PLAYING'
        }],
        afk: false,
    });

    // Set custom status with Bangladesh flag
    client.user.setPresence({
        activities: [{
            name: ' Bangladesh',
            type: 'CUSTOM'
        }]
    });
});

client.on('messageCreate', async (message) => {
    const content = message.content.trim().toLowerCase().replace(/\s+/g, ' '); // Normalizing input

    // Updated hello command
    if (content === `${PREFIX}hello` || content === `${PREFIX}helo`) {
        message.channel.send(`Hello ${message.author}! How can I assist you today?`);
    }

    // Command: ping
    if (content === `${PREFIX}ping`) {
        message.channel.send('Pong!');
    }

    // Command: quote (get a random quote from API)
    if (content.startsWith(`${PREFIX}quote`)) {
        try {
            const response = await axios.get('https://zenquotes.io/api/random');
            const quote = response.data[0].q;
            const author = response.data[0].a;
            message.channel.send(`"${quote}" - ${author}`);
        } catch (error) {
            message.channel.send('Failed to fetch a quote. Try again later.');
        }
    }

    // Command: joke (get a random joke from API)
    if (content.startsWith(`${PREFIX}joke`)) {
        try {
            const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
            const joke = response.data.joke || `${response.data.setup} - ${response.data.delivery}`;
            message.channel.send(joke);
        } catch (error) {
            message.channel.send('Failed to fetch a joke. Try again later.');
        }
    }

    // Command: fact (get a random fact from an API)
    if (content === `${PREFIX}fact`) {
        try {
            const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            const fact = response.data.text;
            message.channel.send(`Here's a random fact: ${fact}`);
        } catch (error) {
            message.channel.send('Failed to fetch a fact. Try again later.');
        }
    }

    // Command: search [query] (search the web with DuckDuckGo)
    if (content.startsWith(`${PREFIX}search `)) {
        const query = message.content.split(' ').slice(1).join(' ');
        try {
            const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
            const firstResult = response.data.RelatedTopics[0].Text;
            const firstURL = response.data.RelatedTopics[0].FirstURL;
            message.channel.send(`Result: ${firstResult}\nLink: ${firstURL}`);
        } catch (error) {
            message.channel.send('Failed to search the web. Try again later.');
        }
    }

    // Command: say [message]
    if (content === `${PREFIX}say` || content.startsWith(`${PREFIX}say `)) {
        // Ensure the command is exactly "say" and not "sayembedchannel" or "sayembed"
        if (!content.startsWith(`${PREFIX}sayembedchannel`) && !content.startsWith(`${PREFIX}sayembed`)) {
            const response = message.content.split(' ').slice(1).join(' ');
            if (response) {
                message.channel.send(response);
            } else {
                message.channel.send('Please provide a message.');
            }
        }
    }

    // Command: sayembed [embed colour] [title] [description]
    if (content.startsWith(`${PREFIX}sayembed`)) {
        // Ensure it's exactly "sayembed" and not "sayembedchannel"
        if (!content.startsWith(`${PREFIX}sayembedchannel`)) {
            const args = message.content.split(' ').slice(1);
            const embedColor = args[0];
            const title = args[1];
            const description = args.slice(2).join(' ');

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(title)
                .setDescription(description);

            message.channel.send({ embeds: [embed] });
        }
    }

    // Command: saychannel [channel id] [message]
if (content.startsWith(`${PREFIX}saychannel`)) {
    const args = message.content.split(' ').slice(1);
    const channelId = args[0];
    const text = args.slice(1).join(' ') || null;

    const channel = client.channels.cache.get(channelId);
    if (channel) {
        channel.send({ content: text });
    } else {
        message.channel.send('Please provide a valid channel ID and message.');
    }
}

    // Command: sayembedchannel [channel id] [embed colour] [title] [description]
    if (content.startsWith(`${PREFIX}sayembedchannel`)) {
        const args = message.content.split(' ').slice(1);
        const channelId = args[1];
        const embedColor = args[0];
        const title = args[2];
        const description = args.slice(3).join(' ');

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(title)
            .setDescription(description);

        const channel = client.channels.cache.get(channelId);
        if (channel) {
            channel.send({ embeds: [embed] });
        } else {
            message.channel.send('Please provide a valid channel ID.');
        }
    }

    // Command: dmembed [userid] [embed colour] [title] [description]
    if (content.startsWith(`${PREFIX}dmembed`)) {
        const args = message.content.split(' ').slice(1);
        const userId = args[0];
        const embedColor = args[1];
        const title = args[2];
        const description = args.slice(3).join(' ');

        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(title)
            .setDescription(description);

        client.users.fetch(userId)
            .then(user => {
                user.send({ embeds: [embed] });
            })
            .catch(console.error);
    }

    // Command: dm [userid or mention] [text]
    if (content.startsWith(`${PREFIX}dm `) && !content.startsWith(`${PREFIX}dmembed`)) {
        const args = message.content.split(' ').slice(1);
        const userId = args[0].replace(/[<@!>]/g, ''); // Clean up user mention
        const text = args.slice(1).join(' ');

        client.users.fetch(userId)
            .then(user => {
                user.send(text);
            })
            .catch(console.error);
    }

    // Command: randomcat (fetches a random cat image)
    if (content.startsWith(`${PREFIX}randomcat`)) {
        const randomCat = `https://cataas.com/cat?random=${Math.random()}`; // Add random parameter to get a new image each time
        message.channel.send(randomCat);
    }

    // Command: coinflip (flips a coin)
    if (content === `${PREFIX}coinflip`) {
        const flip = Math.random() < 0.5 ? 'Heads' : 'Tails';
        message.channel.send(`Coin flip result: ${flip}`);
    }

    // Command: rps [rock/paper/scissors]
    if (content.startsWith(`${PREFIX}rps `)) {
        const userChoice = message.content.split(' ')[1].toLowerCase();
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        if (!choices.includes(userChoice)) {
            message.channel.send("Please choose 'rock', 'paper', or 'scissors'.");
        } else {
            message.channel.send(`You chose ${userChoice}, I chose ${botChoice}.`);

            if (userChoice === botChoice) {
                message.channel.send("It's a tie!");
            } else if (
                (userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')
            ) {
                message.channel.send("You win!");
            } else {
                message.channel.send("I win!");
            }
        }
    }

    // Command: 8ball [question]
    if (content.startsWith(`${PREFIX}8ball `)) {
        const responses = [
            "It is certain.",
            "Reply hazy, try again.",
            "Don't count on it.",
            "Yes, definitely.",
            "Ask again later.",
            "My reply is no."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        message.channel.send(`🎱 ${randomResponse}`);
    }

    // Command: help
    if (content === `${PREFIX}help`) {
        const helpMessage = `
        **Commands:**
        ${PREFIX}ping - Ping the bot.
        ${PREFIX}hello / helo - Greet the bot.
        ${PREFIX}roll [sides] - Roll a dice with [sides] (default 6).
        ${PREFIX}serverinfo - Get server info.
        ${PREFIX}userinfo - Get your user info.
        ${PREFIX}say [message] - The bot says your message.
        ${PREFIX}sayembed [embed colour] [title] [description] - Send an embedded message.
        ${PREFIX}saychannel [channel id] [message or empty] - Send a message and/or file to a specific channel.
        ${PREFIX}sayembedchannel [embed colour] [channel id] [title] [description] - Send an embedded message to a specific channel.
        ${PREFIX}dmembed [userid] [embed colour] [title] [description] - Send an embedded DM.
        ${PREFIX}dm [userid or mention] [message] - Send a DM to a user.
        ${PREFIX}randomcat - Sends a random cat image.
        ${PREFIX}quote - Sends a random inspirational quote.
        ${PREFIX}joke - Get a random joke.
        ${PREFIX}coinflip - Flips a coin (heads or tails).
        ${PREFIX}8ball [question] - Ask the magic 8 ball.
        ${PREFIX}rps [rock/paper/scissors] - Play rock-paper-scissors with the bot.
        ${PREFIX}search [query] - Search the web using DuckDuckGo.
        ${PREFIX}fact - Get a random fact.
        `;
        message.channel.send(helpMessage);
    }
});

// Print message every 5 seconds,
//you can remove this if you don't need this,
setInterval(() => {
    console.log("This message is printed every 5 seconds.");
}, 5000);

client.login(process.env.TOKEN); // Log in to Discord with your bot token

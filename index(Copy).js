const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios'); // You need to install axios for API calls
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });
const TOKEN = 'bot token'; // Replace with your actual bot token
const PREFIX= '!'; // Set your desired prefix here (empty for no prefix)
const roleId = '[roleid]'; // Replace with the role ID
const userId = '[userid]'; // Replace with the user ID


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
        
        // Check if the user has the specified role or is the specified user
        if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
            const response = message.content.split(' ').slice(1).join(' ');
            if (response) {
                message.channel.send(response);
            } else {
                message.channel.send('Please provide a message.');
            }
        } else {
            // Send an embedded message if the user is not allowed
            const embed = {
                color: 0xFF0000, // Red color
                description: "Bhai ye tere liye nahi hai",
            };
            message.channel.send({ embeds: [embed] });
        }
    }
}

    // Command: sayembed [embed colour] [title] [description]
if (content.startsWith(`${PREFIX}sayembed`)) {
    // Ensure it's exactly "sayembed" and not "sayembedchannel"
    if (!content.startsWith(`${PREFIX}sayembedchannel`)) {

        // Check if the user has the specified role or is the specified user
        if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
            const args = message.content.split(' ').slice(1);
            const embedColor = args[0];
            const title = args[1];
            const description = args.slice(2).join(' ');

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(title)
                .setDescription(description);

            message.channel.send({ embeds: [embed] });
        } else {
            // Send an embedded message if the user is not allowed
            const embed = {
                color: 0xFF0000, // Red color
                description: "This is not for you",
            };
            message.channel.send({ embeds: [embed] });
        }
    }
}

    // Command: saychannel [channel id] [message]
if (content.startsWith(`${PREFIX}saychannel`)) {
    // Check if the user has the specified role or is the specified user
    if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
        const args = message.content.split(' ').slice(1);
        const channelId = args[0];
        const text = args.slice(1).join(' ') || null;

        const channel = client.channels.cache.get(channelId);
        if (channel && text) {
            channel.send({ content: text });
        } else {
            message.channel.send('Please provide a valid channel ID and message.');
        }
    } else {
        // Send an embedded message if the user is not allowed
        const embed = {
            color: 0xFF0000, // Red color
            description: "Bhai ye tere liye Nahi hai",
        };
        message.channel.send({ embeds: [embed] });
    }
}

    // Command: sayembedchannel [embed colour] [channel id] [title] [description]
if (content.startsWith(`${PREFIX}sayembedchannel`)) {
    // Check if the user has the specified role or is the specified user
    if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
        const args = message.content.split(' ').slice(1);
        const embedColor = args[0];
        const channelId = args[1];
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
    } else {
        // Send an embedded message if the user is not allowed
        const embed = {
            color: 0xFF0000, // Red color
            description: "Bhai ye tere liye Nahi hai",
        };
        message.channel.send({ embeds: [embed] });
    }
}

    // Command: dmembed [userId] [embed colour] [title] [description]
if (content.startsWith(`${PREFIX}dmembed`)) {
    // Check if the user has the specified role or is the specified user
    if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
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
    } else {
        // Send an embedded message if the user is not allowed
        const embed = {
            color: 0xFF0000, // Red color
            description: "Bhai ye tere liye Nahi hai",
        };
        message.channel.send({ embeds: [embed] });
    }
}

// Command: dm [userId or mention] [text]
if (content.startsWith(`${PREFIX}dm `) && !content.startsWith(`${PREFIX}dmembed`)) {
    // Check if the user has the specified role or is the specified user
    if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
        const args = message.content.split(' ').slice(1);
        const userId = args[0].replace(/[<@!>]/g, ''); // Clean up user mention
        const text = args.slice(1).join(' ');

        client.users.fetch(userId)
            .then(user => {
                user.send(text);
            })
            .catch(console.error);
    } else {
        // Send an embedded message if the user is not allowed
        const embed = {
            color: 0xFF0000, // Red color
            description: "Bhai ye tere liye Nahi hai",
        };
        message.channel.send({ embeds: [embed] });
    }
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

// Define commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'hello') {
        await interaction.reply(`Hello ${interaction.user}! How can I assist you today?`);
    } else if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'quote') {
        try {
            const response = await axios.get('https://zenquotes.io/api/random');
            const { q: quote, a: author } = response.data[0];
            await interaction.reply(`"${quote}" - ${author}`);
        } catch {
            await interaction.reply('Failed to fetch a quote. Try again later.');
        }
    } else if (commandName === 'joke') {
        try {
            const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
            const joke = response.data.joke || `${response.data.setup} - ${response.data.delivery}`;
            await interaction.reply(joke);
        } catch {
            await interaction.reply('Failed to fetch a joke. Try again later.');
        }
    } else if (commandName === 'fact') {
        try {
            const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
            const fact = response.data.text;
            await interaction.reply(`Here's a random fact: ${fact}`);
        } catch {
            await interaction.reply('Failed to fetch a fact. Try again later.');
        }
    } else if (commandName === 'search') {
        const query = options.getString('query');
        try {
            const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
            const { Text: firstResult, FirstURL: firstURL } = response.data.RelatedTopics[0];
            await interaction.reply(`Result: ${firstResult}\nLink: ${firstURL}`);
        } catch {
            await interaction.reply('Failed to search the web. Try again later.');
        }
    // Check if the user has the specified role or is the specified user
if (message.member.roles.cache.has(roleId) || message.author.id === userId) {
    // Commands requiring role/user check
    else if (interaction.member.roles.cache.has(roleId) || interaction.user.id === userId) {
        if (commandName === 'say') {
            const message = options.getString('message');
            if (message) await interaction.reply(message);
            else await interaction.reply('Please provide a message.');
        } else if (commandName === 'sayembed') {
            const embedColor = options.getString('color');
            const title = options.getString('title');
            const description = options.getString('description');
            const embed = new EmbedBuilder().setColor(embedColor).setTitle(title).setDescription(description);
            await interaction.reply({ embeds: [embed] });
        } else if (commandName === 'saychannel') {
            const channel = options.getChannel('channel');
            const message = options.getString('message') || '';
            if (channel) await channel.send(message);
            else await interaction.reply('Please provide a valid channel.');
        } else if (commandName === 'sayembedchannel') {
            const channel = options.getChannel('channel');
            const embedColor = options.getString('color');
            const title = options.getString('title');
            const description = options.getString('description');
            const embed = new EmbedBuilder().setColor(embedColor).setTitle(title).setDescription(description);
            if (channel) await channel.send({ embeds: [embed] });
            else await interaction.reply('Please provide a valid channel.');
        } else if (commandName === 'dmembed') {
            const user = await client.users.fetch(options.getUser('user').id);
            const embedColor = options.getString('color');
            const title = options.getString('title');
            const description = options.getString('description');
            const embed = new EmbedBuilder().setColor(embedColor).setTitle(title).setDescription(description);
            await user.send({ embeds: [embed] });
            await interaction.reply('Embed sent successfully.');
        } else if (commandName === 'dm') {
            const user = await client.users.fetch(options.getUser('user').id);
            const message = options.getString('message');
            await user.send(message);
            await interaction.reply('Message sent successfully.');
        }
    } else {
        // Send an embedded message if the user is not allowed
        const embed = {
            color: 0xFF0000, // Red color
            description: "Bhai ye tere liye Nahi hai",
        };
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});
    } else if (commandName === 'randomcat') {
        await interaction.reply(`https://cataas.com/cat?random=${Math.random()}`);
    } else if (commandName === 'coinflip') {
        const flip = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await interaction.reply(`Coin flip result: ${flip}`);
    } else if (commandName === 'rps') {
        const userChoice = options.getString('choice').toLowerCase();
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        await interaction.reply(`You chose ${userChoice}, I chose ${botChoice}.`);
        if (userChoice === botChoice) {
            await interaction.followUp("It's a tie!");
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            await interaction.followUp("You win!");
        } else {
            await interaction.followUp("I win!");
        }
    } else if (commandName === '8ball') {
        const responses = [
            "It is certain.", "Reply hazy, try again.", "Don't count on it.",
            "Yes, definitely.", "Ask again later.", "My reply is no."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply(`🎱 ${randomResponse}`);
    } else if (commandName === 'help') {
        const helpMessage = `
            **Commands:**
            /ping - Ping the bot.
            /hello - Greet the bot.
            /quote - Get a random quote.
            /joke - Get a random joke.
            /fact - Get a random fact.
            /search - Search the web using DuckDuckGo.
            /say - The bot says your message.
            /sayembed - Send an embedded message.
            /saychannel - Send a message to a specific channel.
            /sayembedchannel - Send an embedded message to a specific channel.
            /dm - Send a DM to a user.
            /dmembed - Send an embedded DM.
            /randomcat - Get a random cat image.
            /coinflip - Flip a coin.
            /rps - Play rock-paper-scissors with the bot.
            /8ball - Ask the magic 8 ball.
        `;
        await interaction.reply(helpMessage);
    }
});

// Print message every 5 seconds,
//you can remove this if you don't need this,
setInterval(() => {
    console.log("This message is printed every 5 seconds.");
}, 5000);

client.login(`YOUR_BOT_TOKEN`); // Log in to Discord with your bot token

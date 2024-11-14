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
    } else if (commandName === 'say') {
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

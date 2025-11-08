import 'dotenv/config';
.setName("game15")
.setDescription("Pick 2 numbers vs bot's 5 numbers (1-15)")
.addIntegerOption(o=>o.setName("amount").setDescription("Amount to bet").setRequired(true))
.addIntegerOption(o=>o.setName("num1").setDescription("Pick number").setRequired(true))
.addIntegerOption(o=>o.setName("num2").setDescription("Pick number").setRequired(true)),
new SlashCommandBuilder()
.setName("game20")
.setDescription("Pick 3 numbers vs bot's 5 numbers (1-20)")
.addIntegerOption(o=>o.setName("amount").setDescription("Amount to bet").setRequired(true))
.addIntegerOption(o=>o.setName("n1").setDescription("Pick number").setRequired(true))
.addIntegerOption(o=>o.setName("n2").setDescription("Pick number").setRequired(true))
.addIntegerOption(o=>o.setName("n3").setDescription("Pick number").setRequired(true)),
new SlashCommandBuilder().setName("leaderboard").setDescription("Top Balances")
].map(c => c.toJSON());


const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });


// Bot Events
client.on("interactionCreate", async i => {
if (!i.isChatInputCommand()) return;
const cmd = i.commandName;
const user = getUser(i.user.id);


if (cmd === "balance") return i.reply(`Your balance is **$${user.balance}**`);
if (cmd === "start") return i.reply(`You already have a balance: **$${user.balance}**`);


if (cmd === "coinflip") {
const amt = i.options.getInteger("amount");
const guess = i.options.getString("guess").toLowerCase();
if (user.balance < amt) return i.reply("You don't have enough money!");
const outcome = randChoice(["heads","tails"]);
setBalance(user.id, outcome === guess ? user.balance + amt : user.balance - amt);
return i.reply(`Coin landed on **${outcome}**. New balance: **$${getUser(user.id).balance}**`);
}


if (cmd === "game15") {
const amt = i.options.getInteger("amount");
const picks = [i.options.getInteger("num1"), i.options.getInteger("num2")];
if (user.balance < amt) return i.reply("Not enough funds.");
const botNums = new Set(); while (botNums.size < 5) botNums.add(Math.floor(Math.random()*15)+1);
const matches = picks.filter(n => botNums.has(n)).length;
setBalance(user.id, user.balance + matches * amt);
return i.reply(`Bot numbers: ${[...botNums].join(", ")}\nYou matched **${matches}** → **+$${matches*amt}**\nNew Balance: **$${getUser(user.id).balance}**`);
}


if (cmd === "game20") {
const amt = i.options.getInteger("amount");
const picks = [i.options.getInteger("n1"), i.options.getInteger("n2"), i.options.getInteger("n3")];
if (user.balance < amt) return i.reply("Not enough funds.");
const botNums = new Set(); while (botNums.size < 5) botNums.add(Math.floor(Math.random()*20)+1);
const matches = picks.filter(n => botNums.has(n)).length;
setBalance(user.id, user.balance + matches * amt);
return i.reply(`Bot numbers: ${[...botNums].join(", ")}\nYou matched **${matches}** → **+$${matches*amt}**\nNew Balance: **$${getUser(user.id).balance}**`);
}


if (cmd === "leaderboard") {
const rows = db.prepare(`SELECT * FROM users ORDER BY balance DESC LIMIT 10`).all();
const embed = new EmbedBuilder()
.setTitle("🏆 Gamvoz Leaderboard")
.setDescription(rows.map((u,i)=>`**${i+1}.** <@${u.id}> — $${u.balance}`).join("\n"));
return i.reply({ embeds:[embed] });
}
});


client.login(process.env.BOT_TOKEN);
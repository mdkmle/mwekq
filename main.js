const mineflayer = require("mineflayer");
const readline = require("readline");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const prefix = "!"; // You can change this to any prefix you want
var isDigging = false;

const bot = mineflayer.createBot({
    host: 'play.xetapixel.net', // Server IP
    username: 'Setho_GP', // Bot Name
    port: 25565, // Server Port
    version: '1.16.5',
});

// Create an interface for reading input from the console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

bot.on('spawn', () => {
    bot.chat('/login plpl123d1');
    bot.chat('/acidisland');
});

// Function to start digging
async function dig() {
    if (!isDigging) return;
    const block = bot.blockAtCursor(4);

    if (!block) {
        await sleep(100);
    } else {
        await bot.dig(block, "ignore", "raycast");
    }
    
    dig();
}

// Function to equip an item
function equip(itemName) {
    const item = bot.inventory.items().filter((item) => item.name.includes(itemName))[0];
    if (item) {
        bot.equip(item, "hand");
        console.log(`Equipped a ${itemName}!`);
    } else {
        console.log(`I don't have a ${itemName}!`);
    }
}

// Listen for console input
rl.on('line', (input) => {
    const [command, ...args] = input.trim().split(/ +/g);

    if (command === "start") {
        console.log("Started digging!");
        isDigging = true;
        dig();
    } else if (command === "stop") {
        console.log("Stopped digging!");
        isDigging = false;
    } else if (command === "equip") {
        if (args.length < 1) {
            console.log("You must specify an item name!");
            return;
        }
        equip(args[0]);
    } else {
        console.log("Unknown command. Available commands: start, stop, equip <itemName>");
    }
});

bot.on("messagestr", (message) => console.log(message));
bot.on("kicked", console.log);
bot.on("error", console.log);

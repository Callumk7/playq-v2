import {
	Client,
	GatewayIntentBits,
	type Interaction,
	type CommandInteraction,
	EmbedBuilder,
	type ColorResolvable,
} from "discord.js";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import type { Game } from "~/db/queries/games";
import { account } from "~/db/schema/auth";
import { usersToGames } from "~/db/schema/collection";

// Load environment variables
config();

// Initialize Discord client
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Bot ready event
client.once("ready", () => {
	console.log(`Logged in as ${client.user?.tag}`);
});

// Handle interactions (slash commands)
client.on("interactionCreate", async (interaction: Interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === "collection") {
		await handleCollectionCommand(interaction);
	}
});

// Function to handle the collection command
async function handleCollectionCommand(interaction: CommandInteraction): Promise<void> {
	// Defer reply to give us time to fetch data
	await interaction.deferReply({ ephemeral: false });

	try {
		const discordId = interaction.user.id;

		// Fetch user's collection from database
		const userId = await db
			.select({ userId: account.userId })
			.from(account)
			.where(eq(account.accountId, discordId))
			.then((result) => result.map((row) => row.userId).pop());

		if (!userId) {
			console.error("userId does not exist in our database");
			throw new Error("Crash: user not found");
		}

		const userCollection = await db.query.usersToGames
			.findMany({
				where: eq(usersToGames.userId, userId),
				with: {
					game: true,
				},
			})
			.then((result) => result.map((row) => row.game));

		if (!userCollection || userCollection.length === 0) {
			await interaction.editReply({
				content:
					"You don't have any games in your collection yet! Visit our website to add some games.",
			});
			return;
		}

		// Create embed for the collection
		const embed = createCollectionEmbed(interaction.user.username, userCollection);

		// Send the response
		await interaction.editReply({
			embeds: [embed],
		});
	} catch (error) {
		console.error("Error handling collection command:", error);
		await interaction.editReply({
			content:
				"Sorry, there was an error fetching your collection. Please try again later.",
		});
	}
}

// Function to create collection embed
function createCollectionEmbed(username: string, games: Game[]): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle(`${username}'s Game Collection`)
		.setColor("#0099ff" as ColorResolvable)
		.setTimestamp()
		.setDescription(`Your collection has ${games.length} games.`);

	if (games.length === 0) {
		embed.setDescription("No games found in your collection.");
		return embed;
	}

	// Limit the number of games to display to avoid hitting Discord's limits
	const displayGames = games.slice(0, 25);

	// Add game entries to the embed
	displayGames.forEach((game, index) => {
		const ratingText = game.rating ? `${game.rating}/10` : "Not rated";

		embed.addFields({
			name: `${index + 1}. ${game.name}`,
			value: `**Summary:** ${game.summary}\n**Rating:** ${ratingText}\n`,
			inline: true,
		});
	});

	// If we had to truncate the list, add a note
	if (games.length > 25) {
		embed.setFooter({
			text: `Showing 25 of ${games.length} games. Visit our website to see your full collection.`,
		});
	}

	// Add a thumbnail if the first game has a cover image
	// if (displayGames[0]?.coverUrl) {
	// 	embed.setThumbnail(displayGames[0].coverUrl);
	// }

	return embed;
}

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);

import {
	type CategoryChannel,
	ChannelType,
	Client,
	GatewayIntentBits,
	type Guild,
	PermissionFlagsBits,
	type TextChannel,
	type VoiceChannel,
	type GuildChannelCreateOptions,
} from "discord.js";
import { env } from "~/lib/env";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const GUILD_ID = "1325416102947459072";

client.login(env.DISCORD_BOT_TOKEN);
console.log("discord client logged in.");

// Function to get all channels in a server
export async function getChannels() {
	const guild = await client.guilds.fetch(GUILD_ID);
	const channels = await guild.channels.fetch();
	return channels;
}

export async function getGuild() {
	const guild = await client.guilds.fetch(GUILD_ID);

	return guild;
}

/**
 * Options for channel creation
 */
interface ChannelCreationOptions {
	categoryId?: string;
	topic?: string;
	isPrivate?: boolean;
	permissionOverwrites?: any[];
	reason?: string;
}

/**
 * Creates a new channel in a Discord guild
 * @param channelName - The name for the new channel
 * @param channelType - The type of channel to create
 * @param options - Additional options for channel creation
 * @returns The newly created channel
 */
export async function createChannel(
	channelName: string,
	channelType:
		| ChannelType.GuildText
		| ChannelType.GuildVoice
		| ChannelType.GuildCategory,
	options: ChannelCreationOptions = {},
): Promise<TextChannel | VoiceChannel | CategoryChannel> {
	try {
		// Fetch the guild
		const guild: Guild = await client.guilds.fetch(GUILD_ID);

		// Prepare channel options
		const channelOptions: GuildChannelCreateOptions = {
			name: channelName,
			type: channelType,
			reason: options.reason || "Channel created via bot",
		};

		// Add optional parameters if provided
		if (options.categoryId) {
			channelOptions.parent = options.categoryId;
		}

		if (options.topic && channelType === ChannelType.GuildText) {
			channelOptions.topic = options.topic;
		}

		// Handle permission overwrites for private channels
		if (options.isPrivate) {
			channelOptions.permissionOverwrites = [
				{
					id: guild.roles.everyone.id,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: client.user!.id,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.ManageChannels,
					],
				},
				// Add custom permission overwrites if provided
				...(options.permissionOverwrites || []),
			];
		} else if (options.permissionOverwrites) {
			channelOptions.permissionOverwrites = options.permissionOverwrites;
		}

		// Create the channel
		const newChannel = await guild.channels.create(channelOptions);

		console.log(`Created new channel: ${newChannel.name} (${newChannel.id})`);

		// Type assertion based on the channel type
		if (channelType === ChannelType.GuildText) {
			return newChannel as TextChannel;
		}
		if (channelType === ChannelType.GuildVoice) {
			return newChannel as unknown as VoiceChannel;
		}
		return newChannel as unknown as CategoryChannel;
	} catch (error) {
		console.error(
			`Failed to create channel: ${error instanceof Error ? error.message : String(error)}`,
		);
		throw error;
	}
}

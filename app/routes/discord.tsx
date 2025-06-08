import { createChannel, getChannels, getGuild } from "~/services/discord/get-channels";
import type { Route } from "./+types/discord";
import { ChannelType, type NonThreadGuildBasedChannel } from "discord.js";
import { useFetcher } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const loader = async () => {
	const channels = await getChannels();
	const guild = await getGuild();
	const channelArray: NonThreadGuildBasedChannel[] = [];

	// biome-ignore lint/complexity/noForEach: Collection type, not a simple array.
	channels.forEach((c) => {
		if (c !== null) channelArray.push(c);
	});

	return { channelArray, guild };
};

export const action = async ({ request }: Route.ActionArgs) => {
	const form = await request.formData();
	const channelName = form.get("channel-name")!.toString();

	const result = await createChannel(channelName, ChannelType.GuildText);
	console.log(result);
	return result;
};

export default function DiscordPage({ loaderData }: Route.ComponentProps) {
	const fetcher = useFetcher();
	return (
		<div className="p-4">
			<div className="p-4">
				<h2 className="font-bold text-2xl">{loaderData.guild.name}</h2>
			</div>
			<div className="p-4 border rounded-md mb-4">
				{loaderData.channelArray.map((c) => (
					<p key={c.id}>{c.name}</p>
				))}
			</div>
			<fetcher.Form method="POST">
				<Input name="channel-name" />
				<Button type="submit">Create</Button>
			</fetcher.Form>
		</div>
	);
}

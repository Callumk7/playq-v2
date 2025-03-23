import { Form } from "react-router";
import { InputWithLabel } from "~/components/forms/inputs";
import { Button } from "~/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { useSession } from "~/lib/auth/auth-client";

export function CreatePlaylistSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Create</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Create Playlist</SheetTitle>
				</SheetHeader>
				<CreatePlaylistForm />
				<SheetFooter>
					<SheetClose asChild>
						<Button>Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

function CreatePlaylistForm() {
	const session = useSession();
	return (
		<Form method="post">
			<div className="space-y-2 p-2">
				<InputWithLabel label="Name" id="name" name="name" />
        <input type="hidden" name="userId" value={session.user.id} />
				<Button type="submit">Create</Button>
			</div>
		</Form>
	);
}

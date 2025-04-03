import { Form } from "react-router";
import { useAuth } from "~/components/context/auth";
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
	const { user } = useAuth();

	return (
		<Form method="post">
			<div className="space-y-2 p-2">
				<InputWithLabel label="Name" id="name" name="name" />
        <input type="hidden" name="userId" value={user.id} />
				<Button type="submit">Create</Button>
			</div>
		</Form>
	);
}

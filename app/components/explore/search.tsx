import { Form } from "react-router";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function ExploreGameSearch() {
  return (
		<div className="flex gap-3">
			<Form className="flex flex-col gap-3">
				<div className="flex gap-3">
					<Input
						name="search"
						type="search"
						placeholder="What are you looking for?"
						className="w-[360px]" // This needs to be responsive
					/>
					<Button variant={"outline"}>Search</Button>
				</div>
			</Form>
		</div>
	)
}

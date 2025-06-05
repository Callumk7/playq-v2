import { CreatePlaylistForm } from "./components/create-playlist-sheet";

export default function NewPlaylistPage() {
  return (
    <div>
      <CreatePlaylistForm />
    </div>
  );
}

export const handle = {
  breadcrumb: "New",
}

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "~/components/ui/menubar";
import type { Game } from "~/db/queries/games"

interface CollectionMenubarProps {
  games: Game[];
}

export function CollectionMenubar({games} :CollectionMenubarProps) {
  return (
    <Menubar className="w-fit">
      <MenubarMenu>
        <MenubarTrigger>Sort By</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Alphabetical</MenubarItem>
          <MenubarItem>Release Date</MenubarItem>
          <MenubarItem>Rating</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

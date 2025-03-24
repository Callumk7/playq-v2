"use client"

import { ChevronRight, GamepadIcon, MusicIcon, type LucideIcon } from "lucide-react"
import { useMemo } from "react"
import { Link } from "react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"
import type { Playlist } from "~/db/queries/playlist"

export function NavCollection({playlists}: {playlists: Playlist[]}) {
  const items = useMemo(() => {
    return [
      {
        title: "Playlists",
        url: "/collection/playlists",
        icon: MusicIcon,
        isActive: true,
        items: playlists.map((playlist) => ({
          title: playlist.name,
          url: `/collection/playlists/${playlist.id}`,
        })),
      },
      {
        title: "Games",
        url: "/collection/games",
        icon: GamepadIcon,
        isActive: false,
        items: [
          {
            title: "My Games",
            url: "/collection/games",
          }
        ],
      }
    ]
  }, [playlists])
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collection</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

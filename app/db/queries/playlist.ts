import { and, eq, inArray } from "drizzle-orm";
import { playlists, gamesToPlaylists } from "../schema/playlists";
import { games } from "../schema/games";
import { db } from "..";

// Types
export type Playlist = typeof playlists.$inferSelect;
export type NewPlaylist = Omit<typeof playlists.$inferInsert, "createdAt" | "updatedAt">;
export type PlaylistWithGames = Playlist & { gameIds: number[] };
export type UpdatePlaylist = Partial<Omit<typeof playlists.$inferInsert, "id" | "creatorId" | "createdAt" | "updatedAt">>;

// Create a new playlist
export async function createPlaylist(data: NewPlaylist, gameIds?: number[]): Promise<Playlist> {
  const now = new Date();
  
  // Insert the playlist
  const [playlist] = await db.insert(playlists)
    .values({
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  
  // If gameIds are provided, associate them with the playlist
  if (gameIds && gameIds.length > 0) {
    await db.insert(gamesToPlaylists)
      .values(
        gameIds.map(gameId => ({
          gameId,
          playlistId: playlist.id,
        }))
      );
  }
  
  return playlist;
}

// Get a playlist by ID
export async function getPlaylistById(id: string): Promise<PlaylistWithGames | null> {
  const playlist = await db.query.playlists.findFirst({
    where: eq(playlists.id, id),
  });
  
  if (!playlist) {
    return null;
  }
  
  // Get associated games
  const gameConnections = await db.select()
    .from(gamesToPlaylists)
    .where(eq(gamesToPlaylists.playlistId, id));
  
  const gameIds = gameConnections.map(gc => gc.gameId);
  
  return {
    ...playlist,
    gameIds,
  };
}

// Get all playlists (with optional filtering by creator)
export async function getPlaylists(creatorId?: string, includePrivate = false): Promise<Playlist[]> {
  let query = db.select().from(playlists).$dynamic();
  
  if (creatorId) {
    query = query.where(eq(playlists.creatorId, creatorId));
  } else if (!includePrivate) {
    // If not filtering by creator and not including private playlists,
    // only return public playlists
    query = query.where(eq(playlists.isPrivate, false));
  }
  
  return await query;
}

// Get playlists with their games
export async function getPlaylistsWithGames(creatorId?: string, includePrivate = false): Promise<PlaylistWithGames[]> {
  const playlistsList = await getPlaylists(creatorId, includePrivate);
  
  if (playlistsList.length === 0) {
    return [];
  }
  
  const playlistIds = playlistsList.map(p => p.id);
  
  const gameConnections = await db.select()
    .from(gamesToPlaylists)
    .where(inArray(gamesToPlaylists.playlistId, playlistIds));
  
  // Group game IDs by playlist ID
  const gameIdsByPlaylist = gameConnections.reduce((acc, gc) => {
    if (!acc[gc.playlistId]) {
      acc[gc.playlistId] = [];
    }
    acc[gc.playlistId].push(gc.gameId);
    return acc;
  }, {} as Record<string, number[]>);
  
  // Combine playlists with their game IDs
  return playlistsList.map(playlist => ({
    ...playlist,
    gameIds: gameIdsByPlaylist[playlist.id] || [],
  }));
}

// Update a playlist
export async function updatePlaylist(
  id: string, 
  data: UpdatePlaylist, 
  gameIds?: number[]
): Promise<Playlist | null> {
  // First check if the playlist exists
  const existingPlaylist = await db.query.playlists.findFirst({
    where: eq(playlists.id, id),
  });
  
  if (!existingPlaylist) {
    return null;
  }
  
  // Update the playlist
  const [updatedPlaylist] = await db.update(playlists)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(playlists.id, id))
    .returning();
  
  // If gameIds are provided, update the game associations
  if (gameIds !== undefined) {
    // Delete existing associations
    await db.delete(gamesToPlaylists)
      .where(eq(gamesToPlaylists.playlistId, id));
    
    // Add new associations if there are any
    if (gameIds.length > 0) {
      await db.insert(gamesToPlaylists)
        .values(
          gameIds.map(gameId => ({
            gameId,
            playlistId: id,
          }))
        );
    }
  }
  
  return updatedPlaylist;
}

// Delete a playlist
export async function deletePlaylist(id: string): Promise<boolean> {
  // First delete all game associations
  await db.delete(gamesToPlaylists)
    .where(eq(gamesToPlaylists.playlistId, id));
  
  // Then delete the playlist
  const result = await db.delete(playlists)
    .where(eq(playlists.id, id));
  
  return result.count > 0;
}

// Add games to a playlist
export async function addGamesToPlaylist(playlistId: string, gameIds: number[]): Promise<boolean> {
  if (gameIds.length === 0) {
    return true;
  }
  
  // Check if playlist exists
  const playlist = await db.query.playlists.findFirst({
    where: eq(playlists.id, playlistId),
  });
  
  if (!playlist) {
    return false;
  }
  
  // Get existing game associations to avoid duplicates
  const existingConnections = await db.select()
    .from(gamesToPlaylists)
    .where(and(
      eq(gamesToPlaylists.playlistId, playlistId),
      inArray(gamesToPlaylists.gameId, gameIds)
    ));
  
  const existingGameIds = new Set(existingConnections.map(ec => ec.gameId));
  const newGameIds = gameIds.filter(id => !existingGameIds.has(id));
  
  if (newGameIds.length === 0) {
    return true;
  }
  
  // Add new game associations
  await db.insert(gamesToPlaylists)
    .values(
      newGameIds.map(gameId => ({
        gameId,
        playlistId,
      }))
    );
  
  // Update the playlist's updatedAt timestamp
  await db.update(playlists)
    .set({ updatedAt: new Date() })
    .where(eq(playlists.id, playlistId));
  
  return true;
}

// Remove games from a playlist
export async function removeGamesFromPlaylist(playlistId: string, gameIds: number[]): Promise<boolean> {
  if (gameIds.length === 0) {
    return true;
  }
  
  // Check if playlist exists
  const playlist = await db.query.playlists.findFirst({
    where: eq(playlists.id, playlistId),
  });
  
  if (!playlist) {
    return false;
  }
  
  // Remove the game associations
  await db.delete(gamesToPlaylists)
    .where(and(
      eq(gamesToPlaylists.playlistId, playlistId),
      inArray(gamesToPlaylists.gameId, gameIds)
    ));
  
  // Update the playlist's updatedAt timestamp
  await db.update(playlists)
    .set({ updatedAt: new Date() })
    .where(eq(playlists.id, playlistId));
  
  return true;
}

// Get games in a playlist
export async function getGamesInPlaylist(playlistId: string) {
  // First check if the playlist exists
  const playlist = await db.query.playlists.findFirst({
    where: eq(playlists.id, playlistId),
  });
  
  if (!playlist) {
    return null;
  }
  
  // Get the game IDs in this playlist
  const gameConnections = await db.select()
    .from(gamesToPlaylists)
    .where(eq(gamesToPlaylists.playlistId, playlistId));
  
  if (gameConnections.length === 0) {
    return [];
  }
  
  const gameIds = gameConnections.map(gc => gc.gameId);
  
  // Get the actual game data
  return await db.select()
    .from(games)
    .where(inArray(games.id, gameIds));
}

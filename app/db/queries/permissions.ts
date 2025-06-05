import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { playlistPermissions, playlists, roleEnum } from "../schema/playlists";
import { db } from "..";
import { user } from "../schema/auth";

// Input validation schemas
const createPermissionSchema = z.object({
	playlistId: z.string().uuid(),
	userId: z.string(),
	grantedBy: z.string(),
	roleType: z.enum(roleEnum.enumValues),
});

const updatePermissionSchema = z.object({
	permissionId: z.string().uuid(),
	roleType: z.enum(roleEnum.enumValues),
	updatedBy: z.string(),
});

/**
 * Create a new permission for a user to access a playlist
 */
export async function createPlaylistPermission({
	playlistId,
	userId,
	grantedBy,
	roleType,
}: z.infer<typeof createPermissionSchema>) {
	try {
		// Validate input
		createPermissionSchema.parse({ playlistId, userId, grantedBy, roleType });

		// Check if playlist exists
		const playlistExists = await db.query.playlists.findFirst({
			where: eq(playlists.id, playlistId),
		});

		if (!playlistExists) {
			throw new Error(`Playlist with ID ${playlistId} not found`);
		}

		// Check if user exists
		const userExists = await db.query.user.findFirst({
			where: eq(user.id, userId),
		});

		if (!userExists) {
			throw new Error(`User with ID ${userId} not found`);
		}

		// Check if permission already exists
		const existingPermission = await db.query.playlistPermissions.findFirst({
			where: and(
				eq(playlistPermissions.playlistId, playlistId),
				eq(playlistPermissions.userId, userId),
			),
		});

		if (existingPermission) {
			throw new Error("Permission already exists for this user and playlist");
		}

		// Check if granter has permission to grant access
		if (playlistExists.creatorId !== grantedBy) {
			const granterPermission = await db.query.playlistPermissions.findFirst({
				where: and(
					eq(playlistPermissions.playlistId, playlistId),
					eq(playlistPermissions.userId, grantedBy),
					eq(playlistPermissions.roleType, "OWNER"),
				),
			});

			if (!granterPermission) {
				throw new Error(
					"You don't have permission to grant access to this playlist",
				);
			}
		}

		// Create the permission
		const now = new Date();
		const [newPermission] = await db
			.insert(playlistPermissions)
			.values({
				playlistId,
				userId,
				createdAt: now,
				updatedAt: now,
				grantedAt: now,
				grantedBy,
				roleType,
			})
			.returning();

		return newPermission;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(`Validation error: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Get a specific permission by ID
 */
export async function getPlaylistPermission(permissionId: string) {
	return db.query.playlistPermissions.findFirst({
		where: eq(playlistPermissions.permissionId, permissionId),
		with: {
			user: true,
			playlist: true,
		},
	});
}

/**
 * List all permissions for a playlist
 */
export async function getPlaylistPermissions(playlistId: string) {
	return db.query.playlistPermissions.findMany({
		where: eq(playlistPermissions.playlistId, playlistId),
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
		orderBy: (permissions) => permissions.createdAt,
	});
}

/**
 * Check if a user has a specific permission for a playlist
 */
export async function checkUserPlaylistPermission({
	playlistId,
	userId,
	requiredRole,
}: {
	playlistId: string;
	userId: string;
	requiredRole:
		| (typeof roleEnum.enumValues)[number]
		| (typeof roleEnum.enumValues)[number][];
}) {
	// Get the playlist to check if user is the creator
	const playlist = await db.query.playlists.findFirst({
		where: eq(playlists.id, playlistId),
	});

	if (!playlist) {
		throw new Error(`Playlist with ID ${playlistId} not found`);
	}

	// If user is the creator, they have full access
	if (playlist.creatorId === userId) {
		return true;
	}

	// Check explicit permissions
	const permission = await db.query.playlistPermissions.findFirst({
		where: and(
			eq(playlistPermissions.playlistId, playlistId),
			eq(playlistPermissions.userId, userId),
		),
	});

	if (!permission) {
		return false;
	}

	// Check if user's role matches required role
	if (Array.isArray(requiredRole)) {
		return requiredRole.includes(permission.roleType);
	}
	return permission.roleType === requiredRole;
}

/**
 * Update an existing permission
 */
export async function updatePlaylistPermission({
	permissionId,
	roleType,
	updatedBy,
}: z.infer<typeof updatePermissionSchema>) {
	try {
		// Validate input
		updatePermissionSchema.parse({ permissionId, roleType, updatedBy });

		// Get the existing permission
		const existingPermission = await getPlaylistPermission(permissionId);

		if (!existingPermission) {
			throw new Error(`Permission with ID ${permissionId} not found`);
		}

		// Check if updater has permission to update
		const playlist = await db.query.playlists.findFirst({
			where: eq(playlists.id, existingPermission.playlistId),
		});

		if (!playlist) {
			throw new Error("Playlist not found");
		}

		// Only playlist creator or OWNER can update permissions
		if (playlist.creatorId !== updatedBy) {
			const updaterPermission = await db.query.playlistPermissions.findFirst({
				where: and(
					eq(playlistPermissions.playlistId, existingPermission.playlistId),
					eq(playlistPermissions.userId, updatedBy),
					eq(playlistPermissions.roleType, "OWNER"),
				),
			});

			if (!updaterPermission) {
				throw new Error("You don't have permission to update this permission");
			}
		}

		// Update the permission
		const [updatedPermission] = await db
			.update(playlistPermissions)
			.set({
				roleType,
				updatedAt: new Date(),
			})
			.where(eq(playlistPermissions.permissionId, permissionId))
			.returning();

		return updatedPermission;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(`Validation error: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Delete a permission
 */
export async function deletePlaylistPermission({
	permissionId,
	deletedBy,
}: {
	permissionId: string;
	deletedBy: string;
}) {
	// Get the existing permission
	const existingPermission = await getPlaylistPermission(permissionId);

	if (!existingPermission) {
		throw new Error(`Permission with ID ${permissionId} not found`);
	}

	// Check if deleter has permission to delete
	const playlist = await db.query.playlists.findFirst({
		where: eq(playlists.id, existingPermission.playlistId),
	});

	if (!playlist) {
		throw new Error("Playlist not found");
	}

	// Only playlist creator or OWNER can delete permissions
	if (playlist.creatorId !== deletedBy) {
		const deleterPermission = await db.query.playlistPermissions.findFirst({
			where: and(
				eq(playlistPermissions.playlistId, existingPermission.playlistId),
				eq(playlistPermissions.userId, deletedBy),
				eq(playlistPermissions.roleType, "OWNER"),
			),
		});

		if (!deleterPermission) {
			throw new Error("You don't have permission to delete this permission");
		}
	}

	// Cannot delete permission for the playlist creator
	if (existingPermission.userId === playlist.creatorId) {
		throw new Error("Cannot delete the creator's permission");
	}

	// Delete the permission
	await db
		.delete(playlistPermissions)
		.where(eq(playlistPermissions.permissionId, permissionId));

	return { success: true };
}

/**
 * Batch create permissions (for inviting multiple users)
 */
export async function batchCreatePlaylistPermissions({
	playlistId,
	userIds,
	roleType,
	grantedBy,
}: {
	playlistId: string;
	userIds: string[];
	roleType: (typeof roleEnum.enumValues)[number];
	grantedBy: string;
}) {
	// Check if playlist exists
	const playlist = await db.query.playlists.findFirst({
		where: eq(playlists.id, playlistId),
	});

	if (!playlist) {
		throw new Error(`Playlist with ID ${playlistId} not found`);
	}

	// Check if granter has permission
	if (playlist.creatorId !== grantedBy) {
		const granterPermission = await db.query.playlistPermissions.findFirst({
			where: and(
				eq(playlistPermissions.playlistId, playlistId),
				eq(playlistPermissions.userId, grantedBy),
				eq(playlistPermissions.roleType, "OWNER"),
			),
		});

		if (!granterPermission) {
			throw new Error("You don't have permission to grant access to this playlist");
		}
	}

	// Get existing permissions to avoid duplicates
	const existingPermissions = await db.query.playlistPermissions.findMany({
		where: eq(playlistPermissions.playlistId, playlistId),
	});

	const existingUserIds = existingPermissions.map((p) => p.userId);
	const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

	if (newUserIds.length === 0) {
		return { message: "No new permissions to create" };
	}

	// Create permissions for new users
	const now = new Date();
	const permissionsToCreate = newUserIds.map((userId) => ({
		playlistId,
		userId,
		createdAt: now,
		updatedAt: now,
		grantedAt: now,
		grantedBy,
		roleType,
	}));

	const createdPermissions = await db
		.insert(playlistPermissions)
		.values(permissionsToCreate)
		.returning();

	return createdPermissions;
}

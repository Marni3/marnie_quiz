import { db } from "./db/client";
import { folders, questionSets, Folder } from "./db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { getMockStore } from "./store";
import { randomUUID } from "crypto";

export interface FolderWithCount extends Folder {
  quizCount: number;
}

export async function getUserFolders(userId: string): Promise<FolderWithCount[]> {
  try {
    const list = await db
      .select({
        folder: folders,
        quizCount: sql<number>`count(${questionSets.id})`,
      })
      .from(folders)
      .leftJoin(questionSets, eq(folders.id, questionSets.folderId))
      .where(eq(folders.userId, userId))
      .groupBy(folders.id)
      .orderBy(desc(folders.createdAt));

    return list.map((item) => ({
      ...item.folder,
      quizCount: Number(item.quizCount || 0),
    }));
  } catch (err) {
    console.warn("DB folders fetch failed, using fallback:", err);
    const store = getMockStore();
    const result: FolderWithCount[] = [];

    for (const f of store.folders.values()) {
      if (f.userId === userId) {
        let count = 0;
        for (const s of store.questionSets.values()) {
          if (s.folderId === f.id) count++;
        }
        result.push({
          ...f,
          quizCount: count,
        });
      }
    }
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function createFolder(
  userId: string,
  name: string,
  parentFolderId?: string | null
): Promise<Folder> {
  const folderId = randomUUID();
  try {
    const [folder] = await db
      .insert(folders)
      .values({
        id: folderId,
        userId,
        name: name.trim(),
        parentFolderId: parentFolderId || null,
      })
      .returning();
    return folder;
  } catch (err) {
    console.warn("DB folder create failed, using fallback:", err);
    const store = getMockStore();
    const mockFolder: Folder = {
      id: folderId,
      userId,
      name: name.trim(),
      parentFolderId: parentFolderId || null,
      createdAt: new Date(),
    };
    store.folders.set(folderId, mockFolder);
    return mockFolder;
  }
}

export async function renameFolder(
  userId: string,
  folderId: string,
  name: string
) {
  try {
    const [updated] = await db
      .update(folders)
      .set({ name: name.trim() })
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
      .returning();
    return updated;
  } catch (err) {
    console.warn("DB folder rename failed, using fallback:", err);
    const store = getMockStore();
    const f = store.folders.get(folderId);
    if (f && f.userId === userId) {
      f.name = name.trim();
      return f;
    }
    return null;
  }
}

export async function deleteFolder(userId: string, folderId: string) {
  try {
    await db
      .delete(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
    return true;
  } catch (err) {
    console.warn("DB folder delete failed, using fallback:", err);
    const store = getMockStore();
    const f = store.folders.get(folderId);
    if (f && f.userId === userId) {
      store.folders.delete(folderId);
      // Unlink question sets
      for (const set of store.questionSets.values()) {
        if (set.folderId === folderId) {
          set.folderId = null;
        }
      }
      return true;
    }
    return false;
  }
}

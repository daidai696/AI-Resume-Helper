import { eq, desc, and } from 'drizzle-orm';
import { db } from '../index';
import { resumeComments } from '../schema';

export const commentRepository = {
  async findByResumeId(resumeId: string) {
    return db.select().from(resumeComments)
      .where(eq(resumeComments.resumeId, resumeId))
      .orderBy(desc(resumeComments.createdAt));
  },

  async create(data: {
    resumeId: string;
    userId: string;
    userName: string;
    content: string;
    sectionType?: string;
    itemIndex?: number;
    parentId?: string;
    suggestion?: { original: string; suggested: string; reason: string } | null;
  }) {
    const id = crypto.randomUUID();
    await db.insert(resumeComments).values({
      id,
      resumeId: data.resumeId,
      userId: data.userId,
      userName: data.userName,
      content: data.content,
      sectionType: data.sectionType,
      itemIndex: data.itemIndex,
      parentId: data.parentId,
      suggestion: data.suggestion,
    });
    const result = await db.select().from(resumeComments).where(eq(resumeComments.id, id)).limit(1);
    return result[0];
  },

  async update(id: string, data: Partial<{
    content: string;
    isResolved: boolean;
  }>) {
    await db.update(resumeComments).set({ ...data, updatedAt: new Date() } as any).where(eq(resumeComments.id, id));
    const result = await db.select().from(resumeComments).where(eq(resumeComments.id, id)).limit(1);
    return result[0];
  },

  async delete(id: string) {
    await db.delete(resumeComments).where(eq(resumeComments.id, id));
  },

  async resolve(id: string, resolved: boolean) {
    await db.update(resumeComments).set({ isResolved: resolved, updatedAt: new Date() }).where(eq(resumeComments.id, id));
  },
};

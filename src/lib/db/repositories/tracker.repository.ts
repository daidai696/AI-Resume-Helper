import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { jobApplications, offers } from '../schema';

export const trackerRepository = {
  // ===== Job Applications =====
  async findAllByUserId(userId: string) {
    return db.select().from(jobApplications).where(eq(jobApplications.userId, userId)).orderBy(desc(jobApplications.updatedAt));
  },

  async findById(id: string) {
    const result = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
    return result[0] || null;
  },

  async create(data: {
    userId: string;
    jobTitle: string;
    company: string;
    location?: string;
    jobUrl?: string;
    jd?: string;
    status?: string;
    appliedAt?: Date;
    salary?: number;
    notes?: string;
    resumeId?: string;
  }) {
    const id = crypto.randomUUID();
    await db.insert(jobApplications).values({
      id,
      userId: data.userId,
      resumeId: data.resumeId,
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location,
      jobUrl: data.jobUrl,
      jd: data.jd,
      status: data.status || 'draft',
      appliedAt: data.appliedAt,
      salary: data.salary,
      notes: data.notes,
    });
    return this.findById(id);
  },

  async update(id: string, data: Partial<{
    jobTitle: string;
    company: string;
    location: string;
    jobUrl: string;
    jd: string;
    status: string;
    stage: string;
    appliedAt: Date;
    salary: number;
    notes: string;
    nextAction: string;
    reminderAt: Date;
    resumeId: string;
  }>) {
    await db.update(jobApplications).set({ ...data, updatedAt: new Date() } as any).where(eq(jobApplications.id, id));
    return this.findById(id);
  },

  async delete(id: string) {
    await db.delete(jobApplications).where(eq(jobApplications.id, id));
  },

  async getStats(userId: string) {
    const all = await db.select().from(jobApplications).where(eq(jobApplications.userId, userId));
    const stats: Record<string, number> = {};
    all.forEach(a => {
      stats[a.status] = (stats[a.status] || 0) + 1;
    });
    return {
      total: all.length,
      byStatus: stats,
      responseRate: all.length > 0 ? Math.round(((stats.screening || 0) + (stats.interview || 0) + (stats.offered || 0) + (stats.accepted || 0)) / all.length * 100) : 0,
      interviewRate: all.length > 0 ? Math.round(((stats.interview || 0) + (stats.offered || 0) + (stats.accepted || 0)) / all.length * 100) : 0,
      offerRate: all.length > 0 ? Math.round(((stats.offered || 0) + (stats.accepted || 0)) / all.length * 100) : 0,
    };
  },

  // ===== Offers =====
  async findAllOffers(userId: string) {
    return db.select().from(offers).where(eq(offers.userId, userId)).orderBy(desc(offers.createdAt));
  },

  async createOffer(data: {
    userId: string;
    applicationId?: string;
    company: string;
    position: string;
    baseSalary: number;
    bonus?: number;
    stock?: number;
    benefits?: string[];
    startDate?: string;
    deadline?: string;
    location?: string;
    notes?: string;
  }) {
    const id = crypto.randomUUID();
    await db.insert(offers).values({
      id,
      userId: data.userId,
      applicationId: data.applicationId,
      company: data.company,
      position: data.position,
      baseSalary: data.baseSalary,
      bonus: data.bonus || 0,
      stock: data.stock || 0,
      benefits: data.benefits || [],
      startDate: data.startDate,
      deadline: data.deadline,
      location: data.location,
      notes: data.notes,
    });
    const result = await db.select().from(offers).where(eq(offers.id, id)).limit(1);
    return result[0];
  },

  async updateOffer(id: string, data: Partial<{
    company: string;
    position: string;
    baseSalary: number;
    bonus: number;
    stock: number;
    benefits: string[];
    startDate: string;
    deadline: string;
    location: string;
    notes: string;
    status: string;
  }>) {
    await db.update(offers).set(data as any).where(eq(offers.id, id));
    const result = await db.select().from(offers).where(eq(offers.id, id)).limit(1);
    return result[0];
  },

  async deleteOffer(id: string) {
    await db.delete(offers).where(eq(offers.id, id));
  },
};

import { NextRequest, NextResponse } from 'next/server';
import { trackerRepository } from '@/lib/db/repositories/tracker.repository';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';

export async function GET(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await trackerRepository.findAllByUserId(user.id);
    return NextResponse.json(applications);
  } catch (error) {
    console.error('GET /api/tracker error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobTitle, company, location, jobUrl, jd, status, appliedAt, salary, notes, resumeId } = body;

    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'jobTitle and company are required' }, { status: 400 });
    }

    const application = await trackerRepository.create({
      userId: user.id,
      jobTitle,
      company,
      location,
      jobUrl,
      jd,
      status,
      appliedAt: appliedAt ? new Date(appliedAt) : undefined,
      salary,
      notes,
      resumeId,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('POST /api/tracker error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

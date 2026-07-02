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

    const stats = await trackerRepository.getStats(user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/tracker/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

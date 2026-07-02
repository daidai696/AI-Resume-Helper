import { NextRequest, NextResponse } from 'next/server';
import { trackerRepository } from '@/lib/db/repositories/tracker.repository';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const fingerprint = getUserIdFromRequest(request);
    const user = await resolveUser(fingerprint);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await trackerRepository.deleteOffer(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tracker/offers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

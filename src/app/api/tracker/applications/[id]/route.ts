import { NextRequest, NextResponse } from 'next/server';
import { trackerRepository } from '@/lib/db/repositories/tracker.repository';
import { resolveUser, getUserIdFromRequest } from '@/lib/auth/helpers';

export async function PUT(
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
    const body = await request.json();
    const updated = await trackerRepository.update(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/tracker error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    await trackerRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/tracker error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

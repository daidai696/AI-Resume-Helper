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

    const offers = await trackerRepository.findAllOffers(user.id);
    
    // 计算年度总包
    const enriched = offers.map(o => ({
      ...o,
      yearlyTotal: o.baseSalary * 12 + (o.bonus || 0) + (o.stock || 0) / 4,
    })).sort((a, b) => b.yearlyTotal - a.yearlyTotal);

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('GET /api/tracker/offers error:', error);
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
    const { company, position, baseSalary, bonus, stock, benefits, startDate, deadline, location, notes, applicationId } = body;

    if (!company || !position || !baseSalary) {
      return NextResponse.json({ error: 'company, position and baseSalary are required' }, { status: 400 });
    }

    const offer = await trackerRepository.createOffer({
      userId: user.id,
      applicationId,
      company,
      position,
      baseSalary,
      bonus,
      stock,
      benefits,
      startDate,
      deadline,
      location,
      notes,
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('POST /api/tracker/offers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { generatePersonalizedResume } from '@/lib/gemini';
import { TrackType } from '@/types/learning';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { track, weakCategories, streakDays, scoreSummary } = body as {
      track: TrackType;
      weakCategories: string[];
      streakDays: number;
      scoreSummary: string;
    };

    const resume = await generatePersonalizedResume(
      track || 'csharp',
      weakCategories || [],
      streakDays || 1,
      scoreSummary || '新規学習開始'
    );

    return NextResponse.json({ success: true, data: resume });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}

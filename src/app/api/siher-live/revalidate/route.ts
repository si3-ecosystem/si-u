import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Revalidate the siherGoLive cache tag
    revalidateTag('siherGoLive');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Cache invalidated successfully'
    });
  } catch (err) {
    console.error('Cache revalidation error:', err);
    return NextResponse.json(
      { message: 'Error revalidating cache', error: err },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiToken = searchParams.get('api_token');

  if (!apiToken) {
    return NextResponse.json({ error: 'API token refersh required' }, { status: 401 });
  }

  try {
    // In a fully authorized app, this hits Pipedrive.
    // For this build, we call the actual pipedrive endpoint.
    const response = await fetch(`https://api.pipedrive.com/v1/deals?api_token=${apiToken}`);
    
    if (!response.ok) {
      if (response.status === 401) {
          return NextResponse.json({ error: 'Invalid API token' }, { status: 401 });
      }
      throw new Error('Failed to fetch from Pipedrive');
    }

    const data = await response.json();
    
    return NextResponse.json({ 
        success: true, 
        deals: data.data || [] 
    });

  } catch (error) {
    console.error('Pipedrive Sync Error:', error);
    return NextResponse.json({ error: 'Internal Server Error during sync' }, { status: 500 });
  }
}

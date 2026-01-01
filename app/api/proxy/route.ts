import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function handleRequest(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const secret = request.headers.get('Authorization');

    if (!targetUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    try {
        const headers: HeadersInit = {};
        if (secret && secret !== 'Bearer ') {
            headers['Authorization'] = secret;
        }

        const options: RequestInit = {
            method: request.method,
            headers: headers,
        };

        if (request.method !== 'GET') {
            const body = await request.text();
            if (body) {
                options.body = body;
                const contentType = request.headers.get('content-type');
                if (contentType) headers['Content-Type'] = contentType;
            }
        }

        const response = await fetch(targetUrl, { ...options });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return NextResponse.json(data, { status: response.status });
        } else {
            const text = await response.text();
            return new NextResponse(text, { status: response.status });
        }
    } catch (error: unknown) {
        console.error('Proxy error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to fetch from target',
            details: errorMessage
        }, { status: 502 });
    }
}

export async function GET(request: NextRequest) {
    return handleRequest(request);
}

export async function PUT(request: NextRequest) {
    return handleRequest(request);
}

export async function POST(request: NextRequest) {
    return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
    return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
    return handleRequest(request);
}
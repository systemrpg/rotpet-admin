import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

interface RouteContext {
    params: Promise<{ filename: string }>;
}

export async function DELETE(request: Request, context: RouteContext) {
    const { filename } = await context.params;
    try {
        await requireAdmin();

        // Prevenir directory traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return NextResponse.json({ success: false, error: 'Invalid filename' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'public', 'uploads', 'gallery', filename);

        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return NextResponse.json({ success: true, message: 'File deleted' });
        } else {
            return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
        }
    } catch (error: any) {
        console.error('Gallery API Error:', error);
        const status = error.message.includes('Unauthorized') || error.message.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

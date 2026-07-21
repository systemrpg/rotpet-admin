import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await requireAdmin();
        const galleryPath = path.join(process.cwd(), 'public', 'uploads', 'gallery');

        if (!fs.existsSync(galleryPath)) {
            return NextResponse.json({ success: true, data: [] });
        }

        const files = await fs.promises.readdir(galleryPath);

        const images = await Promise.all(
            files.map(async (file) => {
                if (file.startsWith('.')) return null;
                const filePath = path.join(galleryPath, file);
                try {
                    const stats = await fs.promises.stat(filePath);
                    if (stats.isDirectory()) return null;
                    return {
                        name: file,
                        url: `/uploads/gallery/${file}`,
                        created_at: stats.birthtime.toISOString(),
                        size: stats.size,
                    };
                } catch {
                    return null;
                }
            })
        );

        const validImages = images
            .filter((img): img is NonNullable<typeof img> => img !== null)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json({ success: true, data: validImages });
    } catch (error: any) {
        console.error('Gallery API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

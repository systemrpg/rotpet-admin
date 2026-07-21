import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await requireAdmin();

        const [ordersResult, productsResult, usersResult, recentOrdersResult, topProductsResult] = await Promise.all([
            supabaseAdmin.from('orders').select('id, total_amount, status, created_at'),
            supabaseAdmin
                .from('products')
                .select('id, name, price, quantity, image_url, status, category_id, category:categories(name)')
                .order('created_at', { ascending: false }),
            supabaseAdmin.from('users').select('id, created_at, status'),
            supabaseAdmin
                .from('orders')
                .select('id, total_amount, status, created_at, users(full_name, email)')
                .order('created_at', { ascending: false })
                .limit(10),
            supabaseAdmin
                .from('order_items')
                .select('product_id, quantity, unit_price, products(name, image_url, price, category_id, category:categories(name))'),
        ]);

        const orders: any[] = ordersResult.data || [];
        const products: any[] = productsResult.data || [];
        const users: any[] = usersResult.data || [];
        const recentOrders: any[] = recentOrdersResult.data || [];
        const orderItems: any[] = topProductsResult.data || [];

        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const processingOrders = orders.filter(o => o.status === 'processing').length;

        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
        const completedRevenue = orders
            .filter(o => o.status === 'completed' || o.status === 'delivered')
            .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const lowStockProducts = products.filter(p => (p.quantity || 0) <= 5 && (p.quantity || 0) > 0).length;
        const outOfStockProducts = products.filter(p => (p.quantity || 0) === 0).length;

        // Top selling products
        const productSales: Record<string, { name: string; image: string; category: string; totalSold: number; totalRevenue: number }> = {};
        for (const item of orderItems) {
            const pid = item.product_id;
            if (!productSales[pid]) {
                const product = (item as any).products;
                productSales[pid] = {
                    name: product?.name || 'Producto',
                    image: product?.image_url || '',
                    category: product?.category?.name || 'General',
                    totalSold: 0,
                    totalRevenue: 0,
                };
            }
            productSales[pid].totalSold += item.quantity || 0;
            productSales[pid].totalRevenue += (item.quantity || 0) * (item.unit_price || 0);
        }

        const topSellingProducts = Object.entries(productSales)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 5);

        // Trends (últimos 30 días vs 30 anteriores)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const recentPeriodOrders = orders.filter(o => new Date(o.created_at) >= thirtyDaysAgo);
        const previousPeriodOrders = orders.filter(
            o => new Date(o.created_at) >= sixtyDaysAgo && new Date(o.created_at) < thirtyDaysAgo
        );

        const recentRevenue = recentPeriodOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        const previousRevenue = previousPeriodOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

        const revenueTrend = previousRevenue > 0
            ? Number((((recentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1))
            : 0;
        const ordersTrend = previousPeriodOrders.length > 0
            ? Number((((recentPeriodOrders.length - previousPeriodOrders.length) / previousPeriodOrders.length) * 100).toFixed(1))
            : 0;

        const orderStatusDistribution = {
            pending: pendingOrders,
            processing: processingOrders,
            completed: completedOrders,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
        };

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalOrders, completedOrders, pendingOrders, processingOrders,
                    totalRevenue, completedRevenue,
                    totalUsers, activeUsers,
                    totalProducts, activeProducts, lowStockProducts, outOfStockProducts,
                },
                trends: { revenue: revenueTrend, orders: ordersTrend },
                topSellingProducts,
                recentOrders: recentOrders.map(o => ({
                    id: o.id,
                    total: Number(o.total_amount) || 0,
                    status: o.status,
                    date: o.created_at,
                    customer: (o as any).users?.full_name || (o as any).users?.email || 'Cliente',
                })),
                orderStatusDistribution,
            },
        });
    } catch (error: any) {
        console.error('Dashboard stats error:', error);
        const status = error.message?.includes('Unauthorized') || error.message?.includes('Forbidden') ? 401 : 500;
        return NextResponse.json({ success: false, error: error.message }, { status });
    }
}

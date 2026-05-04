import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, Tags } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    // 1. Inisialisasi array kosong untuk menampung menu
    const mainNavItems: NavItem[] = [];

    // 2. Logika penentuan menu berdasarkan Role
    if (user?.usertype === 'admin') {
        mainNavItems.push({
            title: 'Dashboard Admin',
            href: admin.dashboard(),
            icon: LayoutGrid,
        });
    }

    if (user?.usertype === 'user') {
        // Menu Dashboard Dasar untuk User
        mainNavItems.push({
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        });

        // Menu Inventory untuk User (Kasir/Tenant)
        mainNavItems.push({
            title: 'Inventory',
            icon: Tags,
            items: [
                {
                    title: 'Produk',
                    href: '/products',
                },
                {
                    title: 'Kategori',
                    href: '/categories',
                },
            ],
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Pastikan NavMain hanya merender jika ada item */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Search
} from "lucide-react";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { supabase } from "../lib/supabase";

const SidebarComponent = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/deteksi', label: 'Deteksi', icon: Search },
        { path: '/history', label: 'Riwayat', icon: Search },
        { path: '/forum', label: 'Forum', icon: MessageSquare },
    ];

    return (
        <SidebarProvider defaultOpen={!isCollapsed}>
            <Sidebar>
                <SidebarHeader className="flex items-center gap-2 p-4">
                    <img src="/logo.png" alt="TomaTech" className="h-8 w-8" />
                    {!isCollapsed && <h2 className="text-lg font-semibold">TomaTech</h2>}
                    <SidebarTrigger className="ml-auto" />
                </SidebarHeader>

                {/* User Profile */}
                {!isCollapsed && user && (
                    <div className="px-4 py-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-lg"
                                />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white">1</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</h3>
                                <p className="text-xs text-muted-foreground">{user?.email || 'user@gmail.com'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SidebarMenuItem key={item.path}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={location.pathname === item.path}
                                            >
                                                <Link to={item.path}>
                                                    <Icon className="h-4 w-4" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}

                                {/* Logout Button */}
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={handleLogout}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};

export default SidebarComponent;
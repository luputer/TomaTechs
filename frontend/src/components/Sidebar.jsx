import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    LogOut,
    MessageSquare,
    PanelLeftClose,
    PanelLeftOpen,
    Search
} from "lucide-react";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { supabase } from "../lib/supabase";

/**
 * @typedef {Object} MenuItem
 * @property {string} path - The route path
 * @property {string} label - The display label
 * @property {React.ComponentType} icon - The icon component
 */

/**
 * @typedef {Object} User
 * @property {Object} user_metadata - User metadata
 * @property {string} user_metadata.avatar_url - User's avatar URL
 * @property {string} user_metadata.full_name - User's full name
 * @property {string} email - User's email
 */

const MENU_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/deteksi', label: 'Deteksi', icon: Search },
    { path: '/history', label: 'Riwayat', icon: Search },
    { path: '/forum', label: 'Forum', icon: MessageSquare },
];

/**
 * User profile component that displays user information
 * @param {Object} props
 * @param {User} props.user - The user object
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 */
const UserProfile = ({ user, isCollapsed }) => {
    if (isCollapsed || !user) return null;

    return (
        <div className="flex flex-col items-center gap-2 mb-8 px-2">
            <div className="relative">
                <img
                    src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    className="h-14 w-14 rounded-full border-2 border-primary/30 object-cover bg-white shadow"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-xs font-bold text-white">1</span>
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-sm font-semibold text-white leading-tight">{user?.user_metadata?.full_name || 'User'}</h3>
                <p className="text-xs text-white break-all">{user?.email || 'user@gmail.com'}</p>
            </div>
        </div>
    );
};

/**
 * Sidebar component that provides navigation and user controls
 * @param {Object} props
 * @param {User} props.user - The user object
 */
const AppSidebar = ({ user }) => {
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

    return (
        <div className="relative">
            {/* Toggle Button: always visible, floating on the left */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "absolute top-6 -right-5 z-50 h-10 w-10 rounded-full bg-[#3B5D3D] border border-white text-white shadow-md transition-colors",
                )}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{ transition: 'right 0.3s' }}
            >
                {isCollapsed ? (
                    <PanelLeftOpen className="h-5 w-5 text-white" />
                ) : (
                    <PanelLeftClose className="h-5 w-5 text-white" />
                )}
            </Button>

            <Sidebar
                className={cn(
                    "h-full min-h-screen bg-[#3B5D3D] border-r flex flex-col text-white transition-[width] duration-700 ease-in-out",
                    isCollapsed ? "w-0 overflow-hidden" : "w-72"
                )}
                style={{ minWidth: isCollapsed ? 0 : '18rem' }}
            >
                <div className={cn(
                    "transition-all duration-700 ease-in-out origin-left h-full",
                    isCollapsed
                        ? "opacity-0 scale-95 pointer-events-none"
                        : "opacity-100 scale-100"
                )}>
                    <SidebarContent>
                        <SidebarGroup>
                            {/* User Profile Section */}
                            <UserProfile user={user} isCollapsed={isCollapsed} />

                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {MENU_ITEMS.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <SidebarMenuItem key={item.path}>
                                                <SidebarMenuButton asChild>
                                                    <Link
                                                        to={item.path}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-base text-white",
                                                            "hover:bg-green-500/50 hover:text-white",
                                                            isActive && "bg-green-500/50 text-white font-semibold"
                                                        )}
                                                    >
                                                        <Icon className="h-5 w-5 text-white group-hover:text-white transition-colors" />
                                                        <span className="text-white group-hover:text-white transition-colors">{item.label}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                            {/* Divider before logout */}
                            <SidebarSeparator className="my-8" />
                            <div className="flex flex-col items-center w-full">
                                <SidebarMenuItem className="w-full">
                                    <SidebarMenuButton
                                        className="text-white hover:text-white hover:bg-red-500 w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-base justify-start transition-colors"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-5 w-5 text-white group-hover:text-white transition-colors" />
                                        <span className="font-semibold text-white group-hover:text-white transition-colors">Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </div>
                        </SidebarGroup>
                    </SidebarContent>
                </div>
            </Sidebar>
        </div>
    );
};

export default AppSidebar;
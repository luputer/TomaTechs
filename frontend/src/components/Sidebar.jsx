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
import { useAuth } from '../context/AuthContext';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    { path: '/chats', label: 'TomaChat', icon: MessageSquare },
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
        <div className="flex flex-col items-center gap-2 mb-6 md:mb-8 px-1 md:px-2">
            <div className="relative">
                <img
                    src={user?.user_metadata?.avatar_url || '/default-avatar.png'}
                    alt="Profile"
                    className="h-10 w-10 md:h-14 md:w-14 rounded-full border-2 border-primary/30 object-cover bg-white shadow"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <div className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    <span className="text-[10px] md:text-xs font-bold text-white">1</span>
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-xs md:text-sm font-semibold text-white leading-tight">{user?.user_metadata?.full_name || 'User'}</h3>
                <p className="text-[10px] md:text-xs text-white break-all">{user?.email || 'user@gmail.com'}</p>
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
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogoutClick = () => {
        setIsLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Toggle for mobile
    const handleMobileToggle = () => setIsMobileOpen(!isMobileOpen);
    const handleMobileClose = () => setIsMobileOpen(false);

    return (
        <>
            {/* Toggle Button: mobile only */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "flex items-center justify-center fixed top-22 z-40 h-10 w-10 rounded-full bg-[#3B5D3D] border border-white text-white shadow-md transition-all duration-300 hover:bg-green-700 md:hidden",
                    isMobileOpen ? "left-[11rem]" : "left-6"
                )}
                onClick={handleMobileToggle}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isMobileOpen ? (
                    <PanelLeftClose className="h-5 w-5 text-white mx-auto" />
                ) : (
                    <PanelLeftOpen className="h-5 w-5 text-white mx-auto" />
                )}
            </Button>

            {/* Mobile Sidebar Overlay */}
            <div className={cn(
                "md:hidden",
                isMobileOpen ? "fixed inset-0 z-30 flex" : "hidden"
            )}>
                {/* Backdrop */}
                <div
                    className={cn(
                        "fixed inset-0 bg-black/40 z-30 transition-opacity duration-300",
                        isMobileOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={handleMobileClose}
                ></div>
                {/* Sidebar */}
                <Sidebar
                    className={cn(
                        "fixed top-16 left-0 h-[calc(100vh-4rem)] w-40 bg-[#3B5D3D] flex flex-col text-white z-30 shadow-xl transition-transform duration-300 ease-in-out",
                        isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    style={{ minWidth: '10rem' }}
                >
                    <div className="h-full overflow-y-auto">
                        <SidebarContent>
                            <SidebarGroup>
                                <UserProfile user={user} isCollapsed={false} />
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
                                                                "flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors font-medium text-xs md:text-base text-white",
                                                                "hover:bg-green-500/50 hover:text-white",
                                                                isActive && "bg-green-500/50 text-white font-semibold"
                                                            )}
                                                            onClick={handleMobileClose}
                                                        >
                                                            <Icon className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:text-white transition-colors" />
                                                            <span className="text-xs md:text-base text-white group-hover:text-white transition-colors">{item.label}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                        <SidebarSeparator className="my-2" />
                                        {/* Logout Button */}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                onClick={handleLogoutClick}
                                                className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors font-medium text-xs md:text-base text-white hover:bg-red-500/50 hover:text-white"
                                            >
                                                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                                                <span className="text-xs md:text-base">Logout</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </div>
                </Sidebar>
            </div>

            {/* Desktop/Tablet Sidebar */}
            <div className="hidden md:block relative">
                {/* Toggle Button: desktop only */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "flex items-center justify-center absolute top-6 -right-15 z-50 h-10 w-10 rounded-full bg-[#3B5D3D] border border-white text-white shadow-md transition-colors hover:bg-green-700 hidden md:block",
                    )}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    style={{ transition: 'right 0.3s' }}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen className="h-5 w-5 text-white mx-auto" />
                    ) : (
                        <PanelLeftClose className="h-5 w-5 text-white mx-auto" />
                    )}
                </Button>
                <Sidebar
                    className={cn(
                        "h-full min-h-screen bg-[#3B5D3D] flex flex-col text-white transition-[width] duration-700 ease-in-out",
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
                                                                "flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors font-medium text-xs md:text-base text-white",
                                                                "hover:bg-green-500/50 hover:text-white",
                                                                isActive && "bg-green-500/50 text-white font-semibold"
                                                            )}
                                                        >
                                                            <Icon className="h-4 w-4 md:h-5 md:w-5 text-white group-hover:text-white transition-colors" />
                                                            <span className="text-xs md:text-base text-white group-hover:text-white transition-colors">{item.label}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}

                                        <SidebarSeparator className="my-2" />

                                        {/* Logout Button */}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                onClick={handleLogoutClick}
                                                className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors font-medium text-xs md:text-base text-white hover:bg-red-500/50 hover:text-white"
                                            >
                                                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                                                <span className="text-xs md:text-base">Logout</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </div>
                </Sidebar>
                <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin keluar dari aplikasi?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogoutConfirm}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};

export default AppSidebar;

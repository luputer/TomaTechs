import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Search,
    MessageSquare,
    Network,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const Sidebar = ({ user }) => {
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
        <div className={cn(
            "relative min-h-screen border-r bg-background transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Collapse Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-2 z-10 h-8 w-8 rounded-full bg-background"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                ) : (
                    <PanelLeftClose className="h-4 w-4" />
                )}
            </Button>

            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 mb-6">
                        <img src="/logo.png" alt="TomaTech" className="h-8 w-8" />
                        {!isCollapsed && <h2 className="text-lg font-semibold">TomaTech</h2>}
                    </div>

                    {/* User Profile */}
                    {!isCollapsed && user && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
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

                    {/* Navigation */}
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={location.pathname === item.path ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-2",
                                            location.pathname === item.path && "bg-muted",
                                            isCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {!isCollapsed && item.label}
                                    </Button>
                                </Link>
                            );
                        })}

                        {/* Logout Button */}
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50",
                                isCollapsed && "justify-center px-2"
                            )}
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            {!isCollapsed && "Logout"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 
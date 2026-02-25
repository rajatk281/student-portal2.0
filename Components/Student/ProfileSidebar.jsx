"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { X, LogOut, User, Settings, Bell, Shield } from "lucide-react";

export default function ProfileSidebar({ isOpen, onClose }) {
    const { data: session } = useSession();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-all duration-500 ease-out ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-[#0e0e0e] border-l border-white/5 z-[70] shadow-2xl transition-all duration-500 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className={`p-6 border-b border-white/5 flex items-center justify-between transition-all duration-500 delay-100 ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                    }`}>
                        <h2 className="text-white font-semibold text-lg">Profile</h2>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white transition-colors duration-200 p-1 hover:rotate-90 transform"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className={`p-8 flex flex-col items-center text-center transition-all duration-500 delay-150 ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/10 mb-4 transition-all duration-300 hover:ring-white/20 hover:scale-105">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <h3 className="text-white font-bold text-xl">{session?.user?.name || "User Name"}</h3>
                        <p className="text-white/40 text-sm mt-1">{session?.user?.email || "user@example.com"}</p>
                        <div className="mt-4 px-3 py-1 bg-white/10 rounded-full transition-all duration-300 hover:bg-white/15">
                            <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">Premium Student</span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className={`flex-1 px-4 py-2 space-y-1 transition-all duration-500 delay-200 ${
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}>
                        <ProfileMenuItem icon={<User size={18} />} label="My Account" delay="delay-[250ms]" />
                        <ProfileMenuItem icon={<Settings size={18} />} label="Settings" delay="delay-[300ms]" />
                        <ProfileMenuItem icon={<Bell size={18} />} label="Notifications" delay="delay-[350ms]" />
                        <ProfileMenuItem icon={<Shield size={18} />} label="Privacy & Security" delay="delay-[400ms]" />
                    </div>

                    {/* Footer / Logout */}
                    <div className={`p-6 border-t border-white/5 transition-all duration-500 delay-300 ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-semibold hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function ProfileMenuItem({ icon, label, onClick, delay }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] ${delay}`}
        >
            <span className="text-white/40 group-hover:text-white transition-all duration-300 group-hover:scale-110">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
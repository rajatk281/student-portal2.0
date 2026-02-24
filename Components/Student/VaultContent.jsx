"use client"

import React, { useState, useRef, useCallback } from "react";

// ─── File type config ─────────────────────────────────────────────────────────
const FILE_TYPES = {
    pdf: { bg: "bg-red-500/20", icon: "📄", color: "text-red-400", label: "PDF" },
    doc: { bg: "bg-blue-500/20", icon: "📝", color: "text-blue-400", label: "DOC" },
    docx: { bg: "bg-blue-500/20", icon: "📝", color: "text-blue-400", label: "DOCX" },
    ppt: { bg: "bg-orange-500/20", icon: "📊", color: "text-orange-400", label: "PPT" },
    pptx: { bg: "bg-orange-500/20", icon: "📊", color: "text-orange-400", label: "PPTX" },
    xls: { bg: "bg-green-500/20", icon: "📈", color: "text-green-400", label: "XLS" },
    xlsx: { bg: "bg-green-500/20", icon: "📈", color: "text-green-400", label: "XLSX" },
    jpg: { bg: "bg-pink-500/20", icon: "🖼️", color: "text-pink-400", label: "JPG" },
    jpeg: { bg: "bg-pink-500/20", icon: "🖼️", color: "text-pink-400", label: "JPEG" },
    png: { bg: "bg-pink-500/20", icon: "🖼️", color: "text-pink-400", label: "PNG" },
    mp4: { bg: "bg-purple-500/20", icon: "🎬", color: "text-purple-400", label: "MP4" },
    mp3: { bg: "bg-yellow-500/20", icon: "🎵", color: "text-yellow-400", label: "MP3" },
    zip: { bg: "bg-gray-500/20", icon: "🗜️", color: "text-gray-400", label: "ZIP" },
    txt: { bg: "bg-slate-500/20", icon: "📃", color: "text-slate-400", label: "TXT" },
    default: { bg: "bg-indigo-500/20", icon: "📁", color: "text-indigo-400", label: "FILE" },
};

const CATEGORIES = [
    {
        id: "lecture",
        name: "Lecture Notes",
        icon: "📂",
        bg: "bg-blue-900/60",
        accent: "#3b6ef8",
        filter: (f) => ["pdf", "doc", "docx", "txt"].includes(f.ext),
    },
    {
        id: "research",
        name: "Research Papers",
        icon: "📑",
        bg: "bg-purple-900/60",
        accent: "#9b5de5",
        filter: (f) => f.tag === "TEACHER",
    },
    {
        id: "assignment",
        name: "Assignment Briefs",
        icon: "✅",
        bg: "bg-teal-900/60",
        accent: "#0fb58a",
        filter: (f) => f.tag === "STUDENT",
    },
    {
        id: "reference",
        name: "Reference Books",
        icon: "📚",
        bg: "bg-yellow-900/60",
        accent: "#f4a100",
        filter: (f) => ["xls", "xlsx", "ppt", "pptx"].includes(f.ext),
    },
];

const INITIAL_FILES = [
    {
        id: 1, name: "Advanced_Physics_Notes.pdf", ext: "pdf",
        tag: "TEACHER", date: "OCT 24, 2023", size: "12.4 MB",
        avatars: ["RK", "PK", "DR"], extra: 3,
    },
    {
        id: 2, name: "Lab_Report_Final.docx", ext: "docx",
        tag: "STUDENT", date: "OCT 22, 2023", size: "2.1 MB",
        avatars: ["PK"], extra: 0,
    },
    {
        id: 3, name: "Circuit_Diagram_01.png", ext: "png",
        tag: "TEACHER", date: "OCT 20, 2023", size: "5.8 MB",
        avatars: ["DR"], extra: 0,
    },
];

const TABS = ["ALL FILES", "MY UPLOADS", "TEACHER RESOURCES", "RECENT"];
const SORT_OPTIONS = ["NAME", "DATE", "SIZE", "TYPE"];

const AVATAR_COLORS = [
    "bg-indigo-500", "bg-pink-500", "bg-teal-500",
    "bg-orange-500", "bg-purple-500", "bg-yellow-500",
];

function getAvatarColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getExt(name) {
    return name.split(".").pop().toLowerCase();
}

function FileIcon({ ext, size = "md" }) {
    const cfg = FILE_TYPES[ext] || FILE_TYPES.default;
    const s = size === "sm" ? "w-8 h-8 text-lg" : "w-12 h-12 text-2xl";
    return (
        <div className={`${s} ${cfg.bg} rounded-xl flex items-center justify-center`}>
            <span>{cfg.icon}</span>
        </div>
    );
}

function TagBadge({ tag }) {
    const colors = {
        TEACHER: "bg-blue-500/20 text-blue-300",
        STUDENT: "bg-green-500/20 text-green-300",
    };
    return (
        <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-md ${colors[tag] || "bg-white/10 text-white/50"}`}>
            {tag}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function VaultPage() {
    const [files, setFiles] = useState(INITIAL_FILES);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("ALL FILES");
    const [sortBy, setSortBy] = useState("DATE");
    const [showSort, setShowSort] = useState(false);
    const [viewGrid, setViewGrid] = useState(true);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef();

    // ── Upload handler ──
    const handleUpload = useCallback((uploadedFiles) => {
        const newFiles = Array.from(uploadedFiles).map((f, i) => ({
            id: Date.now() + i,
            name: f.name,
            ext: getExt(f.name),
            tag: "MY UPLOADS",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase(),
            size: formatSize(f.size),
            avatars: ["ME"],
            extra: 0,
        }));
        setFiles((prev) => [...newFiles, ...prev]);
        setActiveTab("MY UPLOADS");
    }, []);

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
    };

    // ── Filter + sort ──
    const filtered = files
        .filter((f) => {
            const q = search.toLowerCase();
            const matchSearch = f.name.toLowerCase().includes(q) || f.ext.includes(q) || f.tag?.toLowerCase().includes(q);
            const matchTab =
                activeTab === "ALL FILES" ? true :
                    activeTab === "MY UPLOADS" ? f.tag === "MY UPLOADS" :
                        activeTab === "TEACHER RESOURCES" ? f.tag === "TEACHER" :
                            activeTab === "RECENT" ? true : true;
            return matchSearch && matchTab;
        })
        .sort((a, b) => {
            if (sortBy === "NAME") return a.name.localeCompare(b.name);
            if (sortBy === "TYPE") return a.ext.localeCompare(b.ext);
            if (sortBy === "SIZE") return parseFloat(b.size) - parseFloat(a.size);
            return b.id - a.id; // DATE
        });

    // ── Category counts ──
    const categoryFiles = CATEGORIES.map((cat) => {
        const matches = files.filter(cat.filter);
        const totalMB = matches.reduce((acc, f) => acc + parseFloat(f.size || 0), 0);
        return { ...cat, count: matches.length, size: totalMB.toFixed(1) + " MB" };
    });

    return (
        <div
            className="flex-1 flex flex-col text-white p-6 px-8 font-sans pt-24 h-screen overflow-hidden"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
        >
            {/* Drag overlay */}
            {dragging && (
                <div className="fixed inset-0 z-50 bg-blue-500/10 border-2 border-blue-400 border-dashed rounded-2xl flex items-center justify-center pointer-events-none">
                    <p className="text-blue-300 text-2xl font-bold">Drop files to upload</p>
                </div>
            )}

            <div className=" mx-auto flex flex-col gap-4 flex-1 min-h-0 w-full">

                {/* ── Search bar ── */}
                <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for files, folders, or keywords..."
                        className="w-full bg-[#141414] border border-white/[0.07] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* ── Tabs + Sort + Upload ── */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Tabs */}
                    <div className="flex gap-1 bg-[#141414] border border-white/[0.07] rounded-xl p-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-widest transition-all ${activeTab === tab
                                    ? "bg-white text-black"
                                    : "text-white/35 hover:text-white/60"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1" />

                    {/* Sort */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSort((s) => !s)}
                            className="flex items-center gap-2 bg-[#141414] border border-white/[0.07] rounded-xl px-4 py-2.5 text-[11px] font-bold tracking-widest text-white/50 hover:text-white/80 transition-colors"
                        >
                            SORT BY
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        {showSort && (
                            <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl min-w-[120px]">
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => { setSortBy(opt); setShowSort(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-[11px] tracking-widest font-bold transition-colors ${sortBy === opt ? "text-white bg-white/10" : "text-white/40 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upload */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-[#3b6ef8] hover:bg-[#2d5ce0] rounded-xl px-4 py-2.5 text-[11px] font-bold tracking-widest text-white transition-colors"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        UPLOAD NEW
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files?.length && handleUpload(e.target.files)}
                    />
                </div>

                {/* ── Resource Categories ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold">RESOURCE CATEGORIES</h2>
                        <button className="text-[11px] tracking-widest text-white/35 hover:text-white/70 transition-colors font-bold">
                            VIEW ALL
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {categoryFiles.map((cat) => (
                            <div
                                key={cat.id}
                                className="bg-[#111111] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4 hover:border-white/15 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                                        style={{ backgroundColor: cat.accent + "25" }}
                                    >
                                        <span>{cat.icon}</span>
                                    </div>
                                    <button className="text-white/20 hover:text-white/60 opacity-0 group-hover:opacity-100 transition-all">
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="5" r="1.2" fill="currentColor" />
                                            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                                            <circle cx="12" cy="19" r="1.2" fill="currentColor" />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{cat.name}</p>
                                    <p className="text-white/30 text-xs mt-0.5">
                                        {cat.count} files • {cat.size}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Recent Files ── */}
                <section className="flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold">
                            RECENT FILES
                            {search && (
                                <span className="ml-2 text-white/20 normal-case tracking-normal">
                                    — {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
                                </span>
                            )}
                        </h2>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setViewGrid(true)}
                                className={`p-1.5 rounded-lg transition-colors ${viewGrid ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                            >
                                <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewGrid(false)}
                                className={`p-1.5 rounded-lg transition-colors ${!viewGrid ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
                            >
                                <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-white/20">
                                <span className="text-5xl mb-4">🔍</span>
                                <p className="text-sm">No files found for "{search}"</p>
                            </div>
                        ) : viewGrid ? (
                            /* Grid view */
                            <div className="grid grid-cols-3 gap-4">
                                {filtered.map((file) => {
                                    const cfg = FILE_TYPES[file.ext] || FILE_TYPES.default;
                                    return (
                                        <div
                                            key={file.id}
                                            className="bg-[#111111] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-4 hover:border-white/15 transition-colors group"
                                        >
                                            {/* Header */}
                                            <div className="flex items-center gap-3">
                                                <FileIcon ext={file.ext} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-semibold truncate">{file.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {file.tag && <TagBadge tag={file.tag} />}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-white/25 text-[11px] tracking-wider">
                                                ADDED {file.date} • {file.size}
                                            </p>
                                            {/* Footer */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {file.avatars.slice(0, 3).map((av, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-7 h-7 rounded-full ${getAvatarColor(av)} flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#111]`}
                                                        >
                                                            {av}
                                                        </div>
                                                    ))}
                                                    {file.extra > 0 && (
                                                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 border-2 border-[#111]">
                                                            +{file.extra}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button className="text-white/30 hover:text-white transition-colors">
                                                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                            <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        </svg>
                                                    </button>
                                                    <button className="text-white/30 hover:text-white transition-colors">
                                                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                                            <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
                                                            <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                                                            <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
                                                            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* List view */
                            <div className="flex flex-col gap-2">
                                {filtered.map((file) => {
                                    const cfg = FILE_TYPES[file.ext] || FILE_TYPES.default;
                                    return (
                                        <div
                                            key={file.id}
                                            className="bg-[#111111] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-4 hover:border-white/15 transition-colors group"
                                        >
                                            <FileIcon ext={file.ext} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">{file.name}</p>
                                                <p className="text-white/25 text-[11px] tracking-wider mt-0.5">
                                                    ADDED {file.date} • {file.size}
                                                </p>
                                            </div>
                                            {file.tag && <TagBadge tag={file.tag} />}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="text-white/30 hover:text-white transition-colors">
                                                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                                <button className="text-white/30 hover:text-white transition-colors">
                                                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                                                        <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
                                                        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                                                        <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
                                                        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
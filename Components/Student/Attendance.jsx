"use client"

import React, { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const SUBJECTS = [
    {
        id: 1,
        name: "Quantum Physics (PH101)",
        total: 42,
        attended: 37,
        absent: 5,
        threshold: 75,
    },
    {
        id: 2,
        name: "Advanced Mathematics",
        total: 38,
        attended: 27,
        absent: 11,
        threshold: 75,
    },
    {
        id: 3,
        name: "Organic Chemistry",
        total: 40,
        attended: 31,
        absent: 9,
        threshold: 75,
    },
];

// Days with attendance markers: 'present' | 'absent' | 'holiday' | null
const MARKED = {
    2: "present", 3: "present", 4: "absent",
    6: "present", 9: "present", 10: "today",
    11: "present", 12: "present", 16: "present",
    17: "present", 18: "absent",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPct(attended, total) {
    return Math.round((attended / total) * 100);
}

function getStatus(pct, threshold) {
    if (pct >= threshold + 5) return { label: "SAFE STATUS", color: "text-green-400", bar: "bg-blue-500" };
    if (pct >= threshold) return { label: "WARNING", color: "text-yellow-400", bar: "bg-yellow-400" };
    return { label: "CRITICAL", color: "text-red-400", bar: "bg-red-500" };
}

function getBunkInfo(attended, total, threshold) {
    const required = Math.ceil((threshold / 100) * total);
    const canBunk = Math.floor((attended - (threshold / 100) * total) / (1 - threshold / 100));
    const needMore = required - attended;
    if (canBunk > 0) return { type: "safe", msg: `Can bunk ${canBunk} more classes to maintain ${threshold}%` };
    if (needMore > 0) return { type: "critical", msg: `Need ${needMore} more classes to reach ${threshold}%` };
    return { type: "warning", msg: `Can bunk 1 more class to maintain ${threshold}%` };
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
    return new Date(year, month, 1).getDay();
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function Calendar() {
    const [offset, setOffset] = useState(0);
    const now = new Date(2023, 9 + offset); // Oct 2023
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month); // 0=Sun
    // Shift so Mon=0
    const startOffset = (firstDay + 6) % 7;
    const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

    const cells = [];
    // Prev month tail
    const prevDays = getDaysInMonth(year, month - 1);
    for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
    // Current month
    for (let d = 1; d <= days; d++) cells.push({ day: d, cur: true });
    // Next month head
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) cells.push({ day: d, cur: false });

    function dayStyle(cell) {
        if (!cell.cur) return "text-white/15";
        const mark = MARKED[cell.day];
        if (mark === "today") return "bg-white text-black font-bold rounded-md";
        if (mark === "present") return "bg-green-500/30 text-green-400 rounded-md";
        if (mark === "absent") return "bg-red-500/20 text-red-400 rounded-md";
        return "text-white/50 hover:text-white/80";
    }

    return (
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 w-56 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-sm">{monthLabel}</span>
                <div className="flex gap-1">
                    <button onClick={() => setOffset((o) => o - 1)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                    <button onClick={() => setOffset((o) => o + 1)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                </div>
            </div>
            {/* DOW */}
            <div className="grid grid-cols-7 mb-2">
                {DOW.map((d) => (
                    <div key={d} className="text-[9px] text-white/25 text-center font-bold tracking-wider">{d}</div>
                ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, i) => (
                    <div key={i} className={`w-5 h-5 flex items-center justify-center text-[11px] mx-auto cursor-pointer transition-all ${dayStyle(cell)}`}>
                        {cell.day}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-500/30" />
                    <span className="text-[10px] text-white/40 font-medium">Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-500/30" />
                    <span className="text-[10px] text-white/40 font-medium">Absent</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-blue-500/30" />
                    <span className="text-[10px] text-white/40 font-medium">Holiday</span>
                </div>
            </div>
        </div>
    );
}

// ─── Subject Row ──────────────────────────────────────────────────────────────
function SubjectRow({ subject }) {
    const pct = getPct(subject.attended, subject.total);
    const status = getStatus(pct, subject.threshold);
    const bunk = getBunkInfo(subject.attended, subject.total, subject.threshold);

    return (
        <div className="bg-[#111111] shadow-2xl backdrop-blur-2xl border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
            {/* Top */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white font-bold text-base">{subject.name}</p>
                    <p className="text-white/30 text-[10px] tracking-widest mt-0.5">
                        TOTAL CLASSES: {subject.total} CONDUCTED
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-white font-bold text-xl">{pct}%</span>
                    <p className={`text-[10px] font-bold tracking-widest ${status.color}`}>{status.label}</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${pct}%` }} />
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div>
                        <p className="text-white text-xs font-semibold">ATTENDED</p>
                        <p className="text-white/50 text-[11px]">{subject.attended} Classes</p>
                    </div>
                    <div>
                        <p className="text-red-400 text-xs font-semibold">ABSENT</p>
                        <p className="text-red-400/60 text-[11px]">{subject.absent} Classes</p>
                    </div>
                </div>
                <div
                    className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg max-w-[200px] text-right ${bunk.type === "safe"
                        ? "bg-green-500/10 text-green-400"
                        : bunk.type === "critical"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                >
                    {bunk.msg}
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AttendancePage() {
    const [subjects, setSubjects] = useState(SUBJECTS);

    const totalClasses = subjects.reduce((a, s) => a + s.total, 0);
    const totalAttended = subjects.reduce((a, s) => a + s.attended, 0);
    const overallPct = getPct(totalAttended, totalClasses);

    function addSubject() {
        const name = prompt("Subject name:");
        if (!name) return;
        const total = parseInt(prompt("Total classes:") || "0");
        const attended = parseInt(prompt("Classes attended:") || "0");
        if (!total) return;
        setSubjects((prev) => [
            ...prev,
            { id: Date.now(), name, total, attended, absent: total - attended, threshold: 75 },
        ]);
    }

    return (
        <div className="flex-1 flex flex-col p-6 px-8 font-sans pt-24 overflow-hidden">
            <div className=" mx-auto flex flex-col gap-4 flex-1 min-h-0 w-full">

                {/* ── Top stat cards ── */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Overall */}
                    <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                        <p className="text-[10px] tracking-[0.18em] text-white/35 font-bold mb-2">OVERALL ATTENDANCE</p>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-white text-4xl font-bold">{overallPct}%</p>
                                <p className="text-green-400 text-xs mt-2 font-semibold">Above 75% Target threshold</p>
                            </div>
                            <span className="text-white/20 text-5xl font-black">{overallPct}%</span>
                        </div>
                        {/* Glow */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
                    </div>

                    {/* Goal status */}
                    <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
                        <p className="text-[10px] tracking-[0.18em] text-white/35 font-bold mb-2">75% GOAL STATUS</p>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-white text-4xl font-bold">Safe</p>
                                <p className="text-white/40 text-xs mt-2">
                                    You can bunk {Math.max(0, Math.floor((totalAttended - 0.75 * totalClasses) / 0.25))} more classes
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mt-1">
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#3b6ef8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="17 6 23 6 23 12" stroke="#3b6ef8" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
                    </div>
                </div>

                {/* ── Bottom section ── */}
                <div className="flex gap-4 flex-1 min-h-0">
                    {/* Calendar */}
                    <Calendar />

                    {/* Subjects */}
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {/* Header */}
                        <div className="flex items-center justify-between shrink-0">
                            <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold">SUBJECTS PRESENCE</h2>
                            <button
                                onClick={addSubject}
                                className="flex items-center gap-1.5 text-[11px] tracking-wider text-white/50 hover:text-white transition-colors font-semibold border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5"
                            >
                                <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                                ADD SUBJECT
                            </button>
                        </div>

                        {/* Subject rows — scrollable */}
                        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {subjects.map((s) => (
                                <SubjectRow key={s.id} subject={s} />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

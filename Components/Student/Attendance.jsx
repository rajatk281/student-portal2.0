"use client"

import React, { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_SUBJECTS = [
    {
        id: 1,
        name: "Quantum Physics (PH101)",
        threshold: 75,
        defaultDays: [1, 3, 5], // Mon, Wed, Fri
    },
    {
        id: 2,
        name: "Advanced Mathematics",
        threshold: 75,
        defaultDays: [1, 4], // Mon, Thu
    },
    {
        id: 3,
        name: "Organic Chemistry",
        threshold: 75,
        defaultDays: [2, 4], // Tue, Thu
    },
];

const INITIAL_RECORDS = {
    // format:  "YYYY-MM-DD": { added: [], removed: [], attendance: { subjectId: "present" | "absent" } }
    "2023-10-02": { added: [], removed: [], attendance: { 1: "present", 2: "present" } }, // Mon (1, 2 default)
    "2023-10-03": { added: [], removed: [], attendance: { 3: "present" } }, // Tue (3 default)
    "2023-10-04": { added: [], removed: [], attendance: { 1: "absent" } }, // Wed (1 default)
    "2023-10-05": { added: [], removed: [], attendance: { 2: "present", 3: "absent" } }, // Thu (2, 3 default)
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPct(attended, total) {
    if (total === 0) return 0;
    return Math.round((attended / total) * 100);
}

function getStatus(pct, threshold) {
    if (pct >= threshold + 15) return { label: "EXCELLENT", color: "text-green-400", bar: "bg-green-400" };
    if (pct >= threshold) return { label: "SAFE STATUS", color: "text-green-500", bar: "bg-green-500" };
    return { label: "CRITICAL", color: "text-red-500", bar: "bg-red-500" };
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
function Calendar({ onDayClick, dayRecords, subjects, year, month, setMonthOffset }) {
    const days = getDaysInMonth(year, month);
    const firstDay = getFirstDay(year, month); // 0=Sun
    // Shift so Mon=0
    const startOffset = (firstDay + 6) % 7;
    const DOW = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const monthLabel = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    const cells = [];
    // Prev month tail
    const prevDays = getDaysInMonth(year, month - 1);
    for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false, isPrev: true });
    // Current month
    for (let d = 1; d <= days; d++) cells.push({ day: d, cur: true });
    // Next month head
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) cells.push({ day: d, cur: false, isNext: true });

    function getFullDateString(cell) {
        let m = month;
        let y = year;
        if (cell.isPrev) { m -= 1; if (m < 0) { m = 11; y -= 1; } }
        else if (cell.isNext) { m += 1; if (m > 11) { m = 0; y += 1; } }

        const mm = String(m + 1).padStart(2, "0");
        const dd = String(cell.day).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
    }

    function getDayOfWeek(cell) {
        let m = month;
        let y = year;
        if (cell.isPrev) { m -= 1; if (m < 0) { m = 11; y -= 1; } }
        else if (cell.isNext) { m += 1; if (m > 11) { m = 0; y += 1; } }
        return new Date(y, m, cell.day).getDay();
    }

    function dayStyle(cell) {
        if (!cell.cur) return "text-white/15";
        
        const dateStr = getFullDateString(cell);
        const dayOfWeek = getDayOfWeek(cell);
        const record = dayRecords[dateStr];
        
        const activeSubjects = getActiveSubjectsForDate(dateStr, dayOfWeek, subjects, record);
        
        if (activeSubjects.length === 0) {
            return "text-white/50 hover:text-white/80"; // No subjects scheduled today
        }

        const stats = activeSubjects.reduce((acc, sub) => {
            const status = record?.attendance?.[sub.id];
            if (status === 'present') acc.present++;
            else if (status === 'absent') acc.absent++;
            else acc.unmarked++;
            return acc;
        }, { present: 0, absent: 0, unmarked: 0 });

        if (stats.unmarked === activeSubjects.length && stats.unmarked > 0) {
            return "bg-white/10 text-white hover:bg-white/20 rounded-md"; // Pending
        }
        
        if (stats.absent > 0 && stats.present === 0) {
             return "bg-red-500/30 text-red-500 rounded-md"; // Fully absent
        }
        
        if (stats.present === activeSubjects.length) {
             return "bg-green-500/30 text-green-500 rounded-md"; // Fully present
        }

        if (stats.present > 0 && stats.absent > 0) {
            return "bg-yellow-500/30 text-yellow-500 rounded-md"; // Mixed
        }

        return "bg-white/10 text-white hover:bg-white/20 rounded-md"; // Mostly pending/unmarked
    }

    return (
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 w-56 shrink-0 h-fit">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-sm">{monthLabel}</span>
                <div className="flex gap-1">
                    <button onClick={() => setMonthOffset((o) => o - 1)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                    <button onClick={() => setMonthOffset((o) => o + 1)} className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors">
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
                    <div
                        key={i}
                        onClick={() => {
                           if(cell.cur) onDayClick(getFullDateString(cell), getDayOfWeek(cell));
                        }}
                        className={`w-5 h-5 flex items-center justify-center text-[11px] mx-auto cursor-pointer transition-all ${dayStyle(cell)}`}
                    >
                        {cell.day}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500/30" />
                    <span className="text-[10px] text-white/40 font-medium tracking-wide">All Present</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500/30" />
                    <span className="text-[10px] text-white/40 font-medium tracking-wide">Mixed Attendance</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500/30" />
                    <span className="text-[10px] text-white/40 font-medium tracking-wide">All Absent</span>
                </div>
            </div>
        </div>
    );
}

// ─── Modal System ─────────────────────────────────────────────────────────────
// (This handles popups for adding subjects globally, or managing specific days)

// ─── Subject Row ──────────────────────────────────────────────────────────────
function SubjectRow({ subject, stats, onDelete }) {
    const { total, attended, absent } = stats || { total: 0, attended: 0, absent: 0 };
    const pct = getPct(attended, total);
    const status = getStatus(pct, subject.threshold);
    const bunk = getBunkInfo(attended, total, subject.threshold);

    return (
        <div className="bg-[#111111] shadow-2xl backdrop-blur-2xl border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3 group relative">
            {/* Top */}
            <div className="flex items-start justify-between pr-8">
                <div>
                    <p className="text-white font-bold text-base">{subject.name}</p>
                    <p className="text-white/30 text-[10px] tracking-widest mt-0.5">
                        TOTAL CLASSES: {total} CONDUCTED
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-white font-bold text-xl">{pct}%</span>
                    <p className={`text-[10px] font-bold tracking-widest ${status.color}`}>{status.label}</p>
                </div>
            </div>

            {/* Delete Button - Appears on hover */}
            <button 
                onClick={() => onDelete(subject.id)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                title="Delete Subject"
            >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${pct}%` }} />
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div>
                        <p className="text-white text-xs font-semibold">ATTENDED</p>
                        <p className="text-white/50 text-[11px]">{attended} Classes</p>
                    </div>
                    <div>
                        <p className="text-red-400 text-xs font-semibold">ABSENT</p>
                        <p className="text-red-400/60 text-[11px]">{absent} Classes</p>
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

// ─── Core Logic ───────────────────────────────────────────────────────────────
function getActiveSubjectsForDate(dateStr, dayOfWeek, subjects, record) {
    const added = record?.added || [];
    const removed = record?.removed || [];

    return subjects.filter((sub) => {
        // If it was explicitly removed for this date, hide it
        if (removed.includes(sub.id)) return false;
        // If it's explicitly added, show it
        if (added.includes(sub.id)) return true;
        // Otherwise, check if today is a default day for this subject
        return sub.defaultDays.includes(dayOfWeek);
    });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AttendancePage() {
    const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
    const [dayRecords, setDayRecords] = useState(INITIAL_RECORDS);

    // Calendar state
    const [monthOffset, setMonthOffset] = useState(0);
    const now = new Date(2023, 9 + monthOffset); // Start at Oct 2023 for demo
    const year = now.getFullYear();
    const month = now.getMonth();

    // Modal state
    const [activeDateInfo, setActiveDateInfo] = useState(null); // { dateStr, dayOfWeek }
    const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);

    // Form states for modals
    const [newSubName, setNewSubName] = useState("");
    const [newSubDays, setNewSubDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri default

    // Calculate subject-wise stats based purely on dayRecords marked attendance
    const subjectStats = {};
    subjects.forEach(s => subjectStats[s.id] = { total: 0, attended: 0, absent: 0 });

    let totalAttended = 0;
    let totalWorkingDays = 0;

    Object.values(dayRecords).forEach(record => {
        if (!record.attendance) return;
        Object.entries(record.attendance).forEach(([subId, status]) => {
            const id = parseInt(subId);
            
            // Ensure this subject hasn't been deleted
            const subjectExists = subjects.some(s => s.id === id);
            if (!subjectExists) return;

            if (!subjectStats[id]) subjectStats[id] = { total: 0, attended: 0, absent: 0 };
            
            if (status === "present" || status === "absent") {
                subjectStats[id].total += 1;
                totalWorkingDays += 1;
                if (status === "present") {
                    subjectStats[id].attended += 1;
                    totalAttended += 1;
                } else if (status === "absent") {
                    subjectStats[id].absent += 1;
                }
            }
        });
    });

    const overallPct = getPct(totalAttended, totalWorkingDays);
    const overallStatus = getStatus(overallPct, 75);
    const overallBunk = getBunkInfo(totalAttended, totalWorkingDays, 75);

    // ─── Modifiers ────────────────────────────────────────────────────────
    const updateDayRecord = (dateStr, payloadFn) => {
        setDayRecords(prev => {
            const current = prev[dateStr] || { added: [], removed: [], attendance: {} };
            const next = payloadFn({ ...current, attendance: { ...current.attendance } });
            return { ...prev, [dateStr]: next };
        });
    };

    const handleMarkSubject = (dateStr, subId, status) => {
        updateDayRecord(dateStr, (rec) => {
            if (status === null) delete rec.attendance[subId];
            else rec.attendance[subId] = status;
            return rec;
        });
    };

    const handleAddSubjectToDay = (dateStr, subId) => {
        updateDayRecord(dateStr, (rec) => {
            if (!rec.added.includes(subId)) rec.added.push(subId);
            // remove from `removed` if it was there
            rec.removed = rec.removed.filter(id => id !== subId);
            return rec;
        });
    };

    const handleRemoveSubjectFromDay = (dateStr, subId) => {
        updateDayRecord(dateStr, (rec) => {
            if (!rec.removed.includes(subId)) rec.removed.push(subId);
            rec.added = rec.added.filter(id => id !== subId);
            delete rec.attendance[subId]; // Clear history for it today
            return rec;
        });
    };

    const handleAddGlobalSubject = () => {
        if (!newSubName.trim()) return;
        setSubjects(prev => [
            ...prev,
            { id: Date.now(), name: newSubName, threshold: 75, defaultDays: newSubDays }
        ]);
        setIsAddSubjectModalOpen(false);
        setNewSubName("");
        setNewSubDays([1,2,3,4,5]);
    };

    const confirmDeleteSubject = (subId) => {
        setSubjectToDelete(subjects.find(s => s.id === subId));
    };

    const handleDeleteSubject = () => {
        if (subjectToDelete) {
            setSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
            setSubjectToDelete(null);
        }
    };

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
                                <p className={`text-xs mt-2 font-semibold ${overallStatus.color}`}>
                                    {overallPct >= 75 ? "Above" : "Below"} 75% Target threshold
                                </p>
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
                                <p className="text-white text-4xl font-bold">
                                    {overallBunk.type === "safe" ? "Safe" : overallBunk.type === "critical" ? "Critical" : "Warning"}
                                </p>
                                <p className="text-white/40 text-xs mt-2">
                                    {overallBunk.msg}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-1 ${overallBunk.type === "safe" ? "bg-green-500/20 text-green-500" : overallBunk.type === "critical" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"}`}>
                                {overallBunk.type === "safe" ? (
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
                    </div>
                </div>

                {/* ── Bottom section ── */}
                <div className="flex gap-4 flex-1 min-h-0 relative">
                    {/* Calendar */}
                    <Calendar 
                        onDayClick={(dateStr, dow) => setActiveDateInfo({ dateStr, dayOfWeek: dow })}
                        dayRecords={dayRecords}
                        subjects={subjects}
                        year={year}
                        month={month}
                        setMonthOffset={setMonthOffset}
                    />

                    {/* Modals & Overlays */}
                    {activeDateInfo && (
                        <div className="absolute inset-0 z-20 flex bg-black/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 transition-all">
                            <div className="w-full h-full p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">
                                        Managing <span className="text-blue-400">{activeDateInfo.dateStr}</span>
                                    </h3>
                                    <button 
                                        onClick={() => setActiveDateInfo(null)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-red-500/20 transition-all"
                                    >
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                
                                <div className="flex gap-6 flex-1 min-h-0">
                                    {/* Active Subjects Left Panel */}
                                    <div className="flex-1 flex flex-col bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-y-auto">
                                        <p className="text-xs text-white/40 tracking-wider font-bold mb-4">SCHEDULED TODAY</p>
                                        <div className="flex flex-col gap-2">
                                            {getActiveSubjectsForDate(activeDateInfo.dateStr, activeDateInfo.dayOfWeek, subjects, dayRecords[activeDateInfo.dateStr]).map(sub => {
                                                const record = dayRecords[activeDateInfo.dateStr];
                                                const status = record?.attendance?.[sub.id];
                                                
                                                return (
                                                    <div key={sub.id} className="bg-black/40 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-white/90">{sub.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => handleMarkSubject(activeDateInfo.dateStr, sub.id, status === 'present' ? null : 'present')}
                                                                className={`px-3 py-1 text-xs rounded-md transition-all font-semibold ${status === 'present' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                                            >
                                                                Present
                                                            </button>
                                                            <button 
                                                                onClick={() => handleMarkSubject(activeDateInfo.dateStr, sub.id, status === 'absent' ? null : 'absent')}
                                                                className={`px-3 py-1 text-xs rounded-md transition-all font-semibold ${status === 'absent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                                            >
                                                                Absent
                                                            </button>
                                                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                                                            <button 
                                                                onClick={() => handleRemoveSubjectFromDay(activeDateInfo.dateStr, sub.id)}
                                                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20 text-white/20 hover:text-red-400"
                                                                title="Remove / Cancel class for today"
                                                            >
                                                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {getActiveSubjectsForDate(activeDateInfo.dateStr, activeDateInfo.dayOfWeek, subjects, dayRecords[activeDateInfo.dateStr]).length === 0 && (
                                                <p className="text-white/20 text-sm italic py-4">No subjects scheduled for this day.</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Edit Schedule Right Panel */}
                                    <div className="w-64 flex flex-col bg-white/5 rounded-xl border border-white/5 p-4">
                                        <p className="text-xs text-white/40 tracking-wider font-bold mb-4">EXTRA CLASSES</p>
                                        <div className="flex flex-col gap-2">
                                            {subjects.filter(sub => !getActiveSubjectsForDate(activeDateInfo.dateStr, activeDateInfo.dayOfWeek, subjects, dayRecords[activeDateInfo.dateStr]).find(s => s.id === sub.id)).map(sub => (
                                                <button 
                                                    key={sub.id}
                                                    onClick={() => handleAddSubjectToDay(activeDateInfo.dateStr, sub.id)}
                                                    className="w-full text-left bg-black/40 hover:bg-white/10 border border-white/5 rounded-lg p-2.5 flex items-center justify-between group transition-all"
                                                >
                                                    <span className="text-xs text-white/60 group-hover:text-white truncate pr-2">{sub.name}</span>
                                                    <svg className="shrink-0 text-white/20 group-hover:text-white/60" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                </button>
                                            ))}
                                            {subjects.every(sub => getActiveSubjectsForDate(activeDateInfo.dateStr, activeDateInfo.dayOfWeek, subjects, dayRecords[activeDateInfo.dateStr]).find(s => s.id === sub.id)) && (
                                                <p className="text-white/20 text-xs italic">All existing subjects are already scheduled.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Global Add Subject Modal Overlay */}
                    {isAddSubjectModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                            <div className="bg-[#111] border border-white/10 rounded-2xl w-[400px] p-6 shadow-2xl flex flex-col gap-6">
                                <h3 className="text-xl font-bold text-white">Add New Subject</h3>
                                
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs text-white/50 font-semibold tracking-wider">SUBJECT NAME</label>
                                    <input 
                                        type="text" 
                                        value={newSubName} 
                                        onChange={(e) => setNewSubName(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                                        placeholder="e.g. Machine Learning"
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-xs text-white/50 font-semibold tracking-wider">RECURRING DAYS</label>
                                    <div className="flex gap-2 justify-between">
                                        {[1,2,3,4,5,6,0].map(dayNum => {
                                            const daysStr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                            const isSelected = newSubDays.includes(dayNum);
                                            return (
                                                <button
                                                    key={dayNum}
                                                    onClick={() => {
                                                        if (isSelected) setNewSubDays(prev => prev.filter(d => d !== dayNum));
                                                        else setNewSubDays(prev => [...prev, dayNum]);
                                                    }}
                                                    className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                                >
                                                    {daysStr[dayNum][0]}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-2">
                                    <button 
                                        onClick={() => setIsAddSubjectModalOpen(false)}
                                        className="px-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleAddGlobalSubject}
                                        disabled={!newSubName.trim() || newSubDays.length === 0}
                                        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
                                    >
                                        Save Subject
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Subjects */}
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {/* Header */}
                        <div className="flex items-center justify-between shrink-0">
                            <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold">SUBJECTS PRESENCE</h2>
                            <button
                                onClick={() => setIsAddSubjectModalOpen(true)}
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
                                <SubjectRow 
                                    key={s.id} 
                                    subject={s} 
                                    stats={subjectStats[s.id]} 
                                    onDelete={confirmDeleteSubject} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Delete Subject Confirmation Modal */}
            {subjectToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl w-[400px] shadow-2xl relative">
                        <button 
                            onClick={() => setSubjectToDelete(null)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">Delete Subject</h3>
                        <p className="text-white/60 mb-6 text-sm">
                            Are you sure you want to delete <strong className="text-white">{subjectToDelete.name}</strong>? This will remove all its attendance history and recalculate your overall attendance metrics. This action cannot be undone.
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setSubjectToDelete(null)}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteSubject}
                                className="px-5 py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/30 hover:border-red-500"
                            >
                                Delete Subject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

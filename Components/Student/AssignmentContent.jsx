"use client"

import { useState } from "react";

const INITIAL_ASSIGNMENTS = [
  {
    id: 1,
    subject: "QUANTUM PHYSICS",
    title: "Schrödinger Equation Application",
    deadline: "Oct 15, 2023",
    timeRemaining: "2 days 4 hours left",
    urgent: true,
    status: "PENDING",
    type: "Group Project",
    avatars: ["RK", "PK", "DR"],
    extra: 3,
    submitted: false,
  },
  {
    id: 2,
    subject: "ADVANCED MATHEMATICS",
    title: "Fourier Series & Laplace Transforms",
    deadline: "Oct 22, 2023",
    timeRemaining: "9 days left",
    urgent: false,
    status: "PENDING",
    type: "Self-study project",
    avatars: [],
    extra: 0,
    submitted: false,
  },
  {
    id: 3,
    subject: "ORGANIC CHEMISTRY",
    title: "Molecular Orbital Theory Analysis",
    deadline: "Oct 28, 2023",
    timeRemaining: "15 days left",
    urgent: false,
    status: "PENDING",
    type: "Group Lab Report",
    avatars: [],
    extra: 0,
    submitted: false,
  },
];

const INITIAL_HISTORY = [
  { id: 1, title: "Fluid Dynamics Lab", score: 92, grade: "A", date: "Oct 5, 2023", status: "GRADED" },
  { id: 2, title: "Thermodynamics Q...", score: 85, grade: "A-", date: "Sep 28, 2023", status: "GRADED" },
  { id: 3, title: "Statistical Mech", score: null, grade: null, date: "Sep 22, 2023", status: "GRADING..." },
];

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-teal-500", "bg-orange-500", "bg-purple-500",
];

function getAvatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function SubmitModal({ assignment, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-2">Submit Assignment</h3>
        <p className="text-white/50 text-sm mb-6">
          Are you sure you want to submit <span className="text-white/80 font-semibold">"{assignment.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-[#3b6ef8] text-white text-sm font-bold hover:bg-[#2d5ce0] transition-colors"
          >
            Confirm Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function ArchiveModal({ history, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Full Assignment Archive</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
          {history.map((item) => (
            <div key={item.id} className="bg-[#111111] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                <p className="text-white/30 text-[11px] mt-0.5">Submitted {item.date}</p>
              </div>
              <div className="text-right">
                {item.score ? (
                  <>
                    <p className="text-white font-bold text-sm">{item.score}/100</p>
                    <p className="text-green-400 text-[11px] font-bold">GRADE: {item.grade}</p>
                  </>
                ) : (
                  <p className="text-yellow-400 text-[11px] font-bold">{item.status}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (assignment) => setSubmitTarget(assignment);

  const confirmSubmit = () => {
    const a = submitTarget;
    setAssignments((prev) =>
      prev.map((x) => x.id === a.id ? { ...x, submitted: true, status: "SUBMITTED" } : x)
    );
    setHistory((prev) => [
      { id: Date.now(), title: a.title, score: null, grade: null, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), status: "GRADING..." },
      ...prev,
    ]);
    setSubmitTarget(null);
    showToast(`"${a.title}" submitted successfully!`);
  };

  const pending = assignments.filter((a) => !a.submitted);
  const submitted = assignments.filter((a) => a.submitted);
  const completed = history.filter((h) => h.score !== null).length;

  return (
    <div className="flex-1 flex text-white p-6 px-8 font-sans pt-24 h-screen overflow-hidden gap-6 bg-[#0d0d0d]">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-500/20 border border-green-500/40 text-green-300 text-sm font-semibold px-5 py-3 rounded-xl shadow-xl backdrop-blur-sm">
          ✓ {toast}
        </div>
      )}

      {/* Modals */}
      {submitTarget && (
        <SubmitModal assignment={submitTarget} onClose={() => setSubmitTarget(null)} onConfirm={confirmSubmit} />
      )}
      {showArchive && (
        <ArchiveModal history={history} onClose={() => setShowArchive(false)} />
      )}

      {/* ── Left: Active Assignments ── */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold">ACTIVE ASSIGNMENTS</h2>
          <span className="bg-white/10 text-white/60 text-[11px] font-bold tracking-widest px-3 py-1 rounded-lg">
            Total: {pending.length}
          </span>
        </div>

        <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1">
          {assignments.map((a) => (
            <div
              key={a.id}
              className={`bg-[#111111] border rounded-2xl p-5 flex flex-col gap-4 transition-colors ${
                a.submitted ? "border-green-500/20 opacity-60" : "border-white/[0.06] hover:border-white/15"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#3b6ef8] mb-1">{a.subject}</p>
                  <h3 className="text-white font-bold text-base leading-snug">{a.title}</h3>
                </div>
                {a.submitted ? (
                  <span className="bg-green-500/20 text-green-400 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg shrink-0">
                    SUBMITTED
                  </span>
                ) : a.urgent ? (
                  <span className="bg-red-500/20 text-red-400 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg shrink-0">
                    URGENT
                  </span>
                ) : (
                  <span className="bg-white/5 text-white/40 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg shrink-0">
                    PENDING
                  </span>
                )}
              </div>

              {/* Deadline row */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/25 text-[9px] tracking-widest font-bold">DEADLINE</p>
                    <p className="text-white text-xs font-semibold mt-0.5">{a.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/25 text-[9px] tracking-widest font-bold">TIME REMAINING</p>
                    <p className={`text-xs font-semibold mt-0.5 ${a.urgent ? "text-red-400" : "text-white"}`}>
                      {a.timeRemaining}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {a.avatars.length > 0 && (
                    <div className="flex -space-x-2">
                      {a.avatars.slice(0, 3).map((av, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-full ${getAvatarColor(av)} flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#111]`}
                        >
                          {av}
                        </div>
                      ))}
                      {a.extra > 0 && (
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 border-2 border-[#111]">
                          +{a.extra}
                        </div>
                      )}
                    </div>
                  )}
                  {a.type && (
                    <span className="text-white/25 text-[11px]">{a.type}</span>
                  )}
                </div>
                <button
                  onClick={() => !a.submitted && handleSubmit(a)}
                  disabled={a.submitted}
                  className={`px-5 py-2 rounded-xl text-[11px] font-bold tracking-widest transition-all ${
                    a.submitted
                      ? "bg-white/5 text-white/25 cursor-default"
                      : "bg-[#3b6ef8] hover:bg-[#2d5ce0] text-white"
                  }`}
                >
                  {a.submitted ? "SUBMITTED" : "SUBMIT ASSIGNMENT"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Summary + History ── */}
      <div className="w-64 flex flex-col gap-2 shrink-0">

        {/* Course Summary */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold mb-5">COURSE SUMMARY</h2>
          <div className="flex justify-between mb-5">
            <div>
              <p className="text-5xl font-black text-white leading-none">{completed + submitted.length}</p>
              <p className="text-[10px] tracking-widest text-white/30 font-bold mt-1">COMPLETED</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black text-white leading-none">{pending.length.toString().padStart(2, "0")}</p>
              <p className="text-[10px] tracking-widest text-red-400 font-bold mt-1">PENDING</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.round(((completed + submitted.length) / (completed + submitted.length + pending.length)) * 100)}%` }}
            />
          </div>
          <p className="text-white/25 text-[11px]">
            {Math.round(((completed + submitted.length) / (completed + submitted.length + pending.length)) * 100)}% overall submission rate this semester
          </p>
        </div>

        {/* Assignment History */}
        <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-1 flex-1">
          <h2 className="text-[11px] tracking-[0.2em] text-white/35 font-bold">ASSIGNMENT HISTORY</h2>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {history.map((item) => (
              <div key={item.id} className="bg-[#0d0d0d] border border-white/[0.04] rounded-xl px-3 py-2 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[12px] font-semibold truncate">{item.title}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">Submitted {item.date}</p>
                </div>
                <div className="text-right shrink-0">
                  {item.score ? (
                    <>
                      <p className="text-white font-bold text-xs">{item.score}/100</p>
                      <p className="text-[10px] font-bold text-white/30">GRADE: <span className="text-green-400">{item.grade}</span></p>
                    </>
                  ) : (
                    <p className="text-yellow-400 text-[10px] font-bold">{item.status}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowArchive(true)}
            className="w-full py-2 mt-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/35 text-[11px] font-bold tracking-widest hover:bg-white/[0.08] hover:text-white/60 transition-all"
          >
            VIEW FULL ARCHIVE
          </button>
        </div>
      </div>
    </div>
  );
}
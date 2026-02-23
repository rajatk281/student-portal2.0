"use client"

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const progressionData = [
  { month: "JAN", value: 55 },
  { month: "FEB", value: 72 },
  { month: "MAR", value: 60 },
  { month: "APR", value: 90 },
  { month: "MAY", value: 75 },
  { month: "JUN", value: 68 },
];

function StatCard({ label, value, sub, icon, barColor, barWidth, dots }) {
  return (
    <div className="flex-1 bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs tracking-widest uppercase">{label}</span>
        <span className="text-white/40">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-white text-4xl font-bold tracking-tight">{value}</span>
        {sub && <span className="text-white/30 text-sm mb-1">{sub}</span>}
      </div>
      {/* Progress bar */}
      {barColor && (
        <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: barWidth || "70%", backgroundColor: barColor }}
          />
        </div>
      )}
      {/* Dots indicator */}
      {dots && (
        <div className="flex gap-1.5 items-center">
          {dots.map((d, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: d.size || 8,
                height: d.size || 8,
                backgroundColor: d.color,
                opacity: d.opacity || 1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#4f8ef7"
      stroke="#4f8ef7"
      strokeWidth={2}
    />
  );
};

const ActiveDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill="white"
      stroke="#4f8ef7"
      strokeWidth={2}
    />
  );
};

export default function MainContent() {
  return (
    <main className="flex-1 flex flex-col gap-5 px-8 pb-8 overflow-auto pt-24">
      {/* Stat Cards */}
      <div className="flex gap-4 mt-2">
        <StatCard
          label="GPA Score"
          value="3.88"
          sub="/ 4.0"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          barColor="#3b6ef8"
          barWidth="97%"
        />
        <StatCard
          label="Attendance"
          value="92"
          sub="%"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          barColor="#ffffff"
          barWidth="92%"
        />
        <StatCard
          label="Assignments"
          value="04"
          sub="Pending"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          dots={[
            { color: "#555", size: 28, opacity: 1 },
            { color: "#555", size: 28, opacity: 1 },
            { color: "#555", size: 28, opacity: 1 },
          ]}
        />
        <StatCard
          label="Credits"
          value="124"
          sub="Earned"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          dots={[
            { color: "#3b6ef8", size: 10 },
            { color: "#3b6ef8", size: 10 },
            { color: "#3b6ef8", size: 10 },
            { color: "#444", size: 8 },
            { color: "#444", size: 8 },
          ]}
        />
      </div>

      {/* Bottom row */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Chart */}
        <div className="flex-1 bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-white font-bold text-lg">Progression Analysis</h2>
              <p className="text-white/30 text-xs tracking-widest mt-0.5">STANDARDIZED GROWTH METRICS</p>
            </div>
            <button className="flex items-center gap-1.5 text-white/50 text-xs border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors">
              LAST 6 MONTHS
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 mt-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={progressionData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid
                  vertical={true}
                  horizontal={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                  }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ stroke: "rgba(255,255,255,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f8ef7"
                  strokeWidth={1.5}
                  dot={<CustomDot />}
                  activeDot={<ActiveDot />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 w-64">
          {/* Recent Activity */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">Recent Activity</h3>
              <button className="text-white/30 text-xs hover:text-white/60 transition-colors tracking-widest">
                HISTORY
              </button>
            </div>
            {/* Items */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    <polyline points="17 8 12 3 7 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="12" y1="3" x2="12" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium leading-tight">Thesis Draft Submitted</p>
                  <p className="text-white/30 text-xs mt-0.5">2 HOURS AGO</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                    <path d="M9 12l2 2 4-4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium leading-tight">Lab Results Verified</p>
                  <p className="text-white/30 text-xs mt-0.5">YESTERDAY</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard card */}
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-black/40 text-[10px] tracking-widest font-semibold">LEADERBOARD</span>
              <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M8 21H5a2 2 0 01-2-2v-1a5 5 0 015-5h8a5 5 0 015 5v1a2 2 0 01-2 2h-3" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 3l1.5 3h3l-2.5 2 1 3L12 9.5 9 11l1-3L7.5 6h3L12 3z" stroke="#333" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="text-black text-4xl font-bold tracking-tight">Rank #04</div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-black/40 text-xs">PERCENTILE</span>
                <span className="text-black text-xs font-semibold">TOP 2%</span>
              </div>
              <div className="h-1 w-full bg-black/10 rounded-full overflow-hidden">
                <div className="h-full w-[98%] bg-black rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
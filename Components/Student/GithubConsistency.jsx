import React, { useState } from 'react';

const ContributionGraph = ({ studyRecords = [] }) => {
    // Map hours to levels (0-4)
    const getLevelFromHours = (hours) => {
        if (hours === 0) return 0;
        if (hours <= 2) return 1;
        if (hours <= 4) return 2;
        if (hours <= 6) return 3;
        return 4;
    };

    // Generate data for the past year (52 weeks)
    const generateContributionData = () => {
        const weeks = [];
        const today = new Date();

        // Start from 52 weeks ago
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (52 * 7));

        // Create a map of study records for easy lookup
        const recordsMap = new Map();
        studyRecords.forEach(record => {
            recordsMap.set(record.date, record.hours);
        });

        for (let week = 0; week < 52; week++) {
            const weekData = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);
                const dateStr = currentDate.toISOString().split('T')[0];

                const hours = recordsMap.get(dateStr) || 0;
                const level = getLevelFromHours(hours);

                weekData.push({
                    date: dateStr,
                    level: level,
                    count: hours, // Study hours
                });
            }
            weeks.push(weekData);
        }

        return weeks;
    };

    const [hoveredCell, setHoveredCell] = useState(null);
    const contributionData = generateContributionData();

    // Calculate total study hours
    const totalHours = contributionData.flat().reduce((sum, day) => sum + day.count, 0);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const displayMonths = [];
    for (let i = 0; i < 12; i++) {
        displayMonths.push(months[(currentMonth - 11 + i + 12) % 12]);
    }

    // Get color based on contribution level
    const getColor = (level) => {
        switch (level) {
            case 0: return 'bg-white/5';
            case 1: return 'bg-emerald-500/30';
            case 2: return 'bg-emerald-500/50';
            case 3: return 'bg-emerald-500/70';
            case 4: return 'bg-emerald-500';
            default: return 'bg-white/5';
        }
    };

    return (
        <div className="flex-1 bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-white font-bold text-lg">Study Consistency</h2>
                    <p className="text-white/30 text-xs tracking-widest mt-0.5">
                        {totalHours} STUDY HOURS IN THE LAST YEAR
                    </p>
                </div>
                <button className="flex items-center gap-1.5 text-white/50 text-xs border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/5 transition-colors">
                    LAST 12 MONTHS
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Contribution Graph */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Month labels */}
                <div className="flex gap-[3px] mb-2 ml-[30px]">
                    {displayMonths.map((month, idx) => (
                        <div
                            key={idx}
                            className="text-white/30 text-[10px] font-medium"
                            style={{ width: `${100 / 12}%` }}
                        >
                            {month}
                        </div>
                    ))}
                </div>

                {/* Graph container */}
                <div className="flex gap-[3px]">
                    {/* Day labels */}
                    <div className="flex flex-col justify-around pr-2">
                        <span className="text-white/30 text-[10px]">Mon</span>
                        <span className="text-white/30 text-[10px]">Wed</span>
                        <span className="text-white/30 text-[10px]">Fri</span>
                    </div>

                    {/* Contribution grid */}
                    <div className="flex gap-[3px] flex-1">
                        {contributionData.map((week, weekIdx) => (
                            <div key={weekIdx} className="flex flex-col gap-[3px] flex-1">
                                {week.map((day, dayIdx) => (
                                    <div
                                        key={dayIdx}
                                        className={`aspect-square rounded-sm ${getColor(day.level)} border border-white/5 hover:border-white/20 transition-all cursor-pointer relative group`}
                                        onMouseEnter={() => setHoveredCell(day)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        {/* Tooltip */}
                                        {hoveredCell === day && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs text-white whitespace-nowrap z-50 shadow-xl">
                                                <div className="font-semibold">{day.count} hours</div>
                                                <div className="text-white/50 text-[10px] mt-0.5">
                                                    {new Date(day.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-[1px]">
                                                    <div className="border-4 border-transparent border-t-[#1a1a1a]"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4">
                    <span className="text-white/30 text-[10px]">Less</span>
                    <div className="flex gap-[3px]">
                        <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/5"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-white/5"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/50 border border-white/5"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/70 border border-white/5"></div>
                        <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-white/5"></div>
                    </div>
                    <span className="text-white/30 text-[10px]">More</span>
                </div>
            </div>
        </div>
    );
};

export default ContributionGraph;
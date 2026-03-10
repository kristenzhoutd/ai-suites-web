import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CampaignConfig } from '../../types/campaignConfig';

interface PersonalizationCalendarViewProps {
  campaigns: CampaignConfig[];
}

interface CalendarEvent {
  id: string;
  name: string;
  goalType: string;
  status: string;
  startDate: Date;
  endDate: Date;
  dateLabel: string;
}

interface EventPlacement {
  event: CalendarEvent;
  startCol: number;
  endCol: number;
  lane: number;
}

const MAX_VISIBLE_LANES = 3;

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / msPerDay);
}

function formatDateLabel(start: Date, end: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (start.getMonth() === end.getMonth()) {
    return `${months[start.getMonth()]} ${start.getDate()} - ${end.getDate()}`;
  }
  return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}`;
}

const getTypeColors = (goalType: string) => {
  switch (goalType) {
    case 'conversion':
    case 'engagement':
      return { bg: 'bg-green-100', border: 'border-l-green-500' };
    case 'awareness':
      return { bg: 'bg-yellow-100', border: 'border-l-yellow-500' };
    case 'retention':
    case 'revenue':
      return { bg: 'bg-indigo-100', border: 'border-l-indigo-600' };
    default:
      return { bg: 'bg-green-100', border: 'border-l-green-500' };
  }
};

const getStatusDotColor = (status: string) => {
  switch (status) {
    case 'launched': return 'bg-green-400';
    case 'ready': return 'bg-blue-500';
    case 'draft': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'launched': return 'Launched';
    case 'ready': return 'Ready';
    case 'draft': return 'Draft';
    default: return status;
  }
};

const getGoalLabel = (goalType: string) => {
  return goalType.charAt(0).toUpperCase() + goalType.slice(1);
};

function assignLanes(placements: EventPlacement[]): void {
  placements.sort((a, b) => {
    if (a.startCol !== b.startCol) return a.startCol - b.startCol;
    return (b.endCol - b.startCol) - (a.endCol - a.startCol);
  });

  const laneEnds: number[] = [];
  for (const p of placements) {
    let assigned = false;
    for (let lane = 0; lane < laneEnds.length; lane++) {
      if (p.startCol >= laneEnds[lane]) {
        laneEnds[lane] = p.endCol;
        p.lane = lane;
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      p.lane = laneEnds.length;
      laneEnds.push(p.endCol);
    }
  }
}

function getMoreCounts(placements: EventPlacement[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const p of placements) {
    if (p.lane >= MAX_VISIBLE_LANES) {
      for (let col = p.startCol; col < p.endCol; col++) {
        if (col >= 1 && col <= 7) {
          counts[col - 1]++;
        }
      }
    }
  }
  return counts;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

const GoalIcon: React.FC<{ goalType: string }> = ({ goalType }) => {
  switch (goalType) {
    case 'conversion':
    case 'engagement':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
          <path d="M10 2L12.09 7.26L18 8.27L14 12.14L14.94 18.02L10 15.27L5.06 18.02L6 12.14L2 8.27L7.91 7.26L10 2Z" stroke="#64b77e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'awareness':
      return (
        <svg width="20" height="17" viewBox="0 0 20 17" fill="none" className="flex-shrink-0">
          <path d="M1 16L10 1L19 16H1Z" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'retention':
    case 'revenue':
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
          <path d="M4 16L16 4M16 4H8M16 4V12" stroke="#3948bb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
  }
};

const ChevronLeftIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12 15L7 10L12 5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M8 5L13 10L8 15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PersonalizationCalendarView: React.FC<PersonalizationCalendarViewProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const weekDayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const calendarDays = useMemo(() => {
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const d = prevMonthLastDay - startingDayOfWeek + i + 1;
      days.push({ day: d, isCurrentMonth: false, date: new Date(year, month - 1, d) });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true, date: new Date(year, month, day) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    return days;
  }, [year, month, startingDayOfWeek, daysInMonth]);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    if (campaigns.length > 0) {
      const parsed = campaigns
        .map((c) => {
          const start = parseDate(c.setup.startDate);
          const end = parseDate(c.setup.endDate);
          if (!start || !end) return null;
          return {
            id: c.id,
            name: c.setup.name || 'Untitled Campaign',
            goalType: c.setup.goalType || 'conversion',
            status: c.status,
            startDate: start,
            endDate: end,
            dateLabel: formatDateLabel(start, end),
          };
        })
        .filter(Boolean) as CalendarEvent[];

      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      const hasVisible = parsed.some(
        (e) => e.startDate <= monthEnd && e.endDate >= monthStart
      );
      if (hasVisible) return parsed;
    }

    // Sample events for the viewed month when no real campaigns have dates in this month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDayNum = new Date(year, month + 1, 0).getDate();

    const computeStatus = (start: Date, end: Date): string => {
      if (end < today) return 'launched';
      if (start > today) return 'ready';
      return 'launched';
    };

    const sampleDefs = [
      { id: 'cal-1', name: 'Homepage Hero A/B Test', goalType: 'conversion', startDay: 1, endDay: 10 },
      { id: 'cal-2', name: 'Blog Engagement Banner', goalType: 'engagement', startDay: 3, endDay: 20 },
      { id: 'cal-3', name: 'Pricing Page Optimization', goalType: 'revenue', startDay: 5, endDay: 14 },
      { id: 'cal-4', name: 'Brand Awareness Pop-up', goalType: 'awareness', startDay: 8, endDay: 18 },
      { id: 'cal-5', name: 'Newsletter Signup CTA', goalType: 'conversion', startDay: 10, endDay: 16 },
      { id: 'cal-6', name: 'Return Visitor Welcome', goalType: 'retention', startDay: 15, endDay: 24 },
      { id: 'cal-7', name: 'Product Page Personalization', goalType: 'conversion', startDay: 19, endDay: Math.min(lastDayNum, 28) },
      { id: 'cal-8', name: 'Cart Recovery Nudge', goalType: 'revenue', startDay: 22, endDay: lastDayNum },
    ];

    return sampleDefs.map((def) => {
      const startDate = new Date(year, month, def.startDay);
      const endDate = new Date(year, month, def.endDay);
      return {
        id: def.id,
        name: def.name,
        goalType: def.goalType,
        status: computeStatus(startDate, endDate),
        startDate,
        endDate,
        dateLabel: formatDateLabel(startDate, endDate),
      };
    });
  }, [campaigns, year, month]);

  const weeks = useMemo(() => {
    const w: typeof calendarDays[] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      w.push(calendarDays.slice(i, i + 7));
    }
    return w.slice(0, 5);
  }, [calendarDays]);

  const getWeekPlacements = (weekDays: typeof calendarDays): EventPlacement[] => {
    const weekStart = weekDays[0].date;
    const weekEnd = weekDays[6].date;

    const activeEvents = calendarEvents.filter(
      (e) => e.startDate <= weekEnd && e.endDate >= weekStart
    );

    const placements: EventPlacement[] = activeEvents
      .map((event) => {
        const startOffset = daysBetween(weekStart, event.startDate);
        const endOffset = daysBetween(weekStart, event.endDate);
        const startCol = Math.max(1, startOffset + 1);
        const endCol = Math.min(8, endOffset + 2);
        return { event, startCol, endCol, lane: 0 };
      })
      .filter((p) => p.startCol < p.endCol);

    assignLanes(placements);
    return placements;
  };

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleCampaignClick = (event: CalendarEvent) => {
    // Only navigate for real campaigns (not sample data)
    if (!event.id.startsWith('cal-')) {
      navigate(`/campaigns/${event.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={goToPrevMonth}
          className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:bg-gray-50"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="font-semibold text-xl text-gray-900">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:bg-gray-50"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Week Day Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDayNames.map((day, i) => (
            <div
              key={day}
              className={`p-4 font-semibold text-sm text-gray-400 uppercase tracking-wider ${
                i < 6 ? 'border-r border-gray-200' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Weeks */}
        {weeks.map((week, weekIndex) => {
          const placements = getWeekPlacements(week);
          const visiblePlacements = placements.filter((p) => p.lane < MAX_VISIBLE_LANES);
          const moreCounts = getMoreCounts(placements);
          const hasMore = moreCounts.some((c) => c > 0);

          const maxLane =
            visiblePlacements.length > 0
              ? Math.max(...visiblePlacements.map((p) => p.lane))
              : -1;
          const eventRows = maxLane + 1;
          const moreRow = 2 + eventRows;

          return (
            <div
              key={weekIndex}
              className={`grid grid-cols-7 ${
                weekIndex < weeks.length - 1 ? 'border-b border-gray-200' : ''
              }`}
              style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
            >
              {/* Day numbers row */}
              {week.map((dayInfo, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`p-3 font-semibold text-base ${
                    dayInfo.isCurrentMonth ? 'text-gray-600 bg-white' : 'text-gray-300 bg-blue-50/30'
                  } ${dayIndex < 6 ? 'border-r border-gray-200' : ''} ${
                    eventRows > 0 || hasMore ? 'border-b border-gray-100' : ''
                  }`}
                  style={{
                    gridColumn: dayIndex + 1,
                    gridRow: 1,
                    minHeight: eventRows === 0 && !hasMore ? '80px' : 'auto',
                  }}
                >
                  {dayInfo.day}
                </div>
              ))}

              {/* Event bars */}
              {visiblePlacements.map((placement, i) => {
                const colors = getTypeColors(placement.event.goalType);
                return (
                  <div
                    key={`${placement.event.id}-${weekIndex}-${i}`}
                    onClick={() => handleCampaignClick(placement.event)}
                    className={`${colors.bg} border-l-4 ${colors.border} rounded mx-1 my-0.5 px-3 py-1.5 flex items-center gap-2 cursor-pointer min-h-[40px] overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-md`}
                    style={{
                      gridColumn: `${placement.startCol} / ${placement.endCol}`,
                      gridRow: placement.lane + 2,
                    }}
                  >
                    <GoalIcon goalType={placement.event.goalType} />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[13px] text-gray-900 truncate tracking-tight">
                        {placement.event.name}
                      </div>
                      <div className="text-[11px] text-gray-600 whitespace-nowrap tracking-tight">
                        {getGoalLabel(placement.event.goalType)} &middot; {placement.event.dateLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                      <div className={`w-2 h-2 rounded-full ${getStatusDotColor(placement.event.status)}`} />
                      <span className="font-medium text-xs text-gray-500 whitespace-nowrap">
                        {getStatusLabel(placement.event.status)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* "MORE" indicators */}
              {hasMore &&
                moreCounts.map((count, colIndex) =>
                  count > 0 ? (
                    <div
                      key={`more-${colIndex}`}
                      className="px-4 py-1.5 pb-2.5 font-semibold text-sm text-gray-400 uppercase tracking-wider"
                      style={{
                        gridColumn: colIndex + 1,
                        gridRow: moreRow,
                      }}
                    >
                      {count} MORE
                    </div>
                  ) : null
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalizationCalendarView;

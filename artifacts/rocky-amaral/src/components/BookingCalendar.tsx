import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  isSunday,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface BookingCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
}

export function BookingCalendar({ selected, onSelect }: BookingCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => {
    const today = new Date();
    return startOfMonth(today);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isDisabled(date: Date) {
    return isBefore(date, today) || isSunday(date);
  }

  function prevMonth() {
    setViewMonth((m) => subMonths(m, 1));
  }

  function nextMonth() {
    setViewMonth((m) => addMonths(m, 1));
  }

  // Build grid of weeks
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const weeks: Date[][] = [];
  let current = gridStart;
  while (!isAfter(current, gridEnd)) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(current);
      current = addDays(current, 1);
    }
    weeks.push(week);
  }

  const isPrevDisabled = isBefore(subMonths(viewMonth, 1), startOfMonth(today));

  return (
    <div className="w-full select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          data-testid="calendar-prev-month"
          className={cn(
            "w-8 h-8 flex items-center justify-center border transition-all",
            isPrevDisabled
              ? "border-white/10 text-white/20 cursor-not-allowed"
              : "border-white/20 text-white hover:border-white hover:bg-white/10"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold uppercase tracking-widest text-white">
          {format(viewMonth, "MMMM yyyy", { locale: ptBR })}
        </h3>

        <button
          onClick={nextMonth}
          data-testid="calendar-next-month"
          className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-white hover:bg-white/10 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className={cn(
              "text-center text-[10px] uppercase tracking-widest font-bold pb-2",
              d === "Dom" ? "text-white/20" : "text-white/40"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              const inMonth = isSameMonth(day, viewMonth);
              const disabled = isDisabled(day);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const isToday = isSameDay(day, today);
              const isSun = isSunday(day);

              return (
                <button
                  key={di}
                  disabled={disabled || !inMonth}
                  onClick={() => !disabled && inMonth && onSelect(day)}
                  data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                  className={cn(
                    "aspect-square w-full flex items-center justify-center text-sm transition-all duration-150 font-medium relative",
                    // Not in month
                    !inMonth && "invisible pointer-events-none",
                    // In month but disabled (Sunday or past)
                    inMonth && disabled && "text-white/15 cursor-not-allowed",
                    // Sunday label color when in month but not disabled (shouldn't happen, but fallback)
                    inMonth && isSun && "text-white/20",
                    // Available days
                    inMonth && !disabled && !isSelected && "text-white hover:bg-white hover:text-black cursor-pointer",
                    // Today indicator
                    inMonth && isToday && !isSelected && "border border-white/30 text-white",
                    // Selected day
                    isSelected && "bg-white text-black font-bold",
                  )}
                >
                  {format(day, "d")}
                  {inMonth && isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

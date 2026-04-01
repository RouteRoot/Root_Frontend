"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronRight, Clock3 } from "lucide-react";

export type StudyItemStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type StudyItem = {
  id: number;
  subject: string;
  weekDay: string;
  studyDate: string;
  hours: string;
  status: StudyItemStatus;
  description?: string;
};

type WeeklyStudyTrackerProps = {
  title?: string;
  items?: StudyItem[];
  focusedItemId?: number | null;
  onToggleStatus?: (id: number) => void;
};

const defaultItems: StudyItem[] = [
  {
    id: 1,
    subject: "소프트웨어 공학",
    weekDay: "1주차 · 1DAY",
    studyDate: "03-31",
    hours: "2시간",
    status: "IN_PROGRESS",
    description: "소프트웨어 공학의 기본 개념을 학습합니다.",
  },
];

export default function WeeklyStudyTracker({
  title = "Weekly Study Tracker",
  items = defaultItems,
  focusedItemId = null,
  onToggleStatus,
}: WeeklyStudyTrackerProps) {
  const todayMMDD = getTodayMMDD();

  const [openedIds, setOpenedIds] = useState<number[]>([]);
  const [closedIds, setClosedIds] = useState<number[]>([]);

  const groupedItems = useMemo(() => {
    const groupedMap = new Map<number, StudyItem[]>();

    items.forEach((item) => {
      const weekNumber = extractWeekNumber(item.weekDay);
      const currentItems = groupedMap.get(weekNumber) ?? [];
      currentItems.push(item);
      groupedMap.set(weekNumber, currentItems);
    });

    return Array.from(groupedMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([weekNumber, weekItems]) => ({
        weekNumber,
        items: [...weekItems].sort(
          (a, b) => extractDayNumber(a.weekDay) - extractDayNumber(b.weekDay)
        ),
      }));
  }, [items]);

  const isRowOpen = (id: number) => {
    if (closedIds.includes(id)) return false;
    if (openedIds.includes(id)) return true;
    return focusedItemId === id;
  };

  const toggleOpen = (id: number) => {
    const currentlyOpen = isRowOpen(id);

    if (currentlyOpen) {
      setOpenedIds((prev) => prev.filter((itemId) => itemId !== id));
      setClosedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }

    setClosedIds((prev) => prev.filter((itemId) => itemId !== id));
    setOpenedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className="ml-auto w-full max-w-[800px]">
      <div className="mb-2 flex items-center gap-2 px-2 py-1">
        <Check className="h-4 w-4 text-[#000000]" />
        <h2 className="text-[14px] font-semibold text-[#2f2c28]">{title}</h2>
      </div>

      {groupedItems.map((group) => (
        <div key={group.weekNumber} className="mb-9">
          <div className="mb-2 px-2 pb-1">
            <div className="text-[15px] font-semibold text-[#2f2c28]">
              {group.weekNumber}주차
            </div>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ebe6df] text-[12px] text-[#8a8176]">
                <th className="px-2 py-2 align-middle font-medium">학습항목</th>
                <th className="px-2 py-2 align-middle font-medium">주차 / Day</th>
                <th className="px-2 py-2 align-middle font-medium">학습일</th>
                <th className="px-2 py-2 align-middle font-medium">학습시간</th>
                <th className="px-2 py-2 align-middle text-center font-medium">
                  액션
                </th>
              </tr>
            </thead>

            <tbody>
              {group.items.map((item) => {
                const isCompleted = item.status === "COMPLETED";
                const isOpen = isRowOpen(item.id);
                const isToday = item.studyDate === todayMMDD;

                return (
                  <StudyRow
                    key={item.id}
                    item={item}
                    isCompleted={isCompleted}
                    isOpen={isOpen}
                    isToday={isToday}
                    isFocused={focusedItemId === item.id}
                    onRowClick={() => toggleOpen(item.id)}
                    onToggleStatus={onToggleStatus}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function StudyRow({
  item,
  isCompleted,
  isOpen,
  isToday,
  isFocused,
  onRowClick,
  onToggleStatus,
}: {
  item: StudyItem;
  isCompleted: boolean;
  isOpen: boolean;
  isToday: boolean;
  isFocused: boolean;
  onRowClick: () => void;
  onToggleStatus?: (id: number) => void;
}) {
  const statusText =
    item.status === "COMPLETED"
      ? "완료"
      : item.status === "IN_PROGRESS"
      ? "진행"
      : "예정";

  const statusChipClassName =
    item.status === "COMPLETED"
      ? "bg-[#e8f7ee] text-[#1f7a4d] border border-[#cfe6d7]"
      : item.status === "IN_PROGRESS"
      ? "bg-[#fff6db] text-[#a06b00] border border-[#ecd9a2]"
      : "bg-[#f3eee6] text-[#6f685d] border border-[#ddd3c4]";

  const badgeText = isToday ? "TODAY" : isFocused ? "FOCUS" : null;

  return (
    <>
      <tr
        className={`border-b border-[#ebe6df] text-[13px] text-[#2f2c28] transition-colors duration-200 ${
          isFocused ? "bg-[#f7f7fa]" : "hover:bg-[#fbfaf8]"
        }`}
      >
        <td
          className={`px-2 py-2 ${
            isFocused ? " border-[#8a6246] pl-[6px]" : ""
          }`}
        >
          <button
            type="button"
            onClick={onRowClick}
            className="flex w-full items-center gap-2 text-left"
          >
            <span className="shrink-0">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 text-[#9a9288]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[#9a9288]" />
              )}
            </span>

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <span
                className={`min-w-0 truncate ${
                  isCompleted
                    ? "text-[#a0998f] line-through"
                    : "font-medium text-[#2f2c28]"
                }`}
              >
                {item.subject}
              </span>

              {badgeText && (
                <span className="shrink-0 rounded-full border border-[#ddd3c4] bg-[#eff4f6] px-2 py-[2px] text-[10px] leading-none text-[#6f685d]">
                  {badgeText}
                </span>
              )}
            </div>
          </button>
        </td>

        <td className="px-2 py-2 text-[#7a7268]">{item.weekDay}</td>
        <td className="px-2 py-2 text-[#7a7268]">{item.studyDate}</td>

        <td className="px-2 py-2">
          <div className="flex items-center gap-1 text-[#7a7268]">
            <Clock3 className="h-3 w-3 shrink-0 text-[#8a8176]" />
            <span>{item.hours}</span>
          </div>
        </td>

        <td className="px-2 py-2 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus?.(item.id);
            }}
            className={`inline-flex items-center rounded-full px-3 py-[4px] text-[10px] font-medium transition-opacity duration-200 hover:opacity-80 ${statusChipClassName}`}
          >
            {statusText}
          </button>
        </td>
      </tr>

      {isOpen && (
        <tr className="border-b border-[#ebe6df] bg-[#f1f5f9]">
          <td colSpan={5} className="px-8 py-3">
            <div className="text-[12px] leading-[1.75] text-[#5b564f]">
              {item.description || "세부 설명이 없습니다."}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function extractWeekNumber(weekDay: string) {
  const match = weekDay.match(/(\d+)\s*주차/);
  return match ? Number(match[1]) : 9999;
}

function extractDayNumber(weekDay: string) {
  const match = weekDay.match(/(\d+)\s*DAY/i);
  return match ? Number(match[1]) : 9999;
}

function getTodayMMDD() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}
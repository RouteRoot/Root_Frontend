import {
  Archive,
  CalendarCheck,
  Home,
  Map,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

export type MobileNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  match: string[];
};

export const mobileNavItems: MobileNavItem[] = [
  {
    label: "홈",
    href: "/dashboard",
    icon: Home,
    match: ["/dashboard"],
  },
  {
    label: "플랜",
    href: "/plan",
    icon: CalendarCheck,
    match: ["/plan"],
  },
  {
    label: "로드맵",
    href: "/roadmap",
    icon: Map,
    match: ["/roadmap"],
  },
  {
    label: "커뮤니티",
    href: "/community",
    icon: MessageSquareText,
    match: ["/community"],
  },
  {
    label: "아카이브",
    href: "/certificate/archive",
    icon: Archive,
    match: ["/certificate/archive"],
  },
];

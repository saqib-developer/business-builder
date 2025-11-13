// constant.ts
import {
  GiRunningNinja,
  GiTreasureMap,
  GiPistolGun,
  GiWorld,
  GiChessKnight,
  GiConsoleController,
  GiSwordman,
  GiMagicSwirl,
  GiRaceCar,
  GiAmericanFootballBall,
  GiPuzzle,
  GiCardPlay,
  GiDiceFire,
  GiVirtualMarker,
} from "react-icons/gi";
import {
  MdWidgets,
  MdOutlineWeb,
  MdDesignServices,
  MdDashboard,
  MdAnalytics,
  MdSettings,
  MdCastForEducation,
} from "react-icons/md";
import {
  FaLaptop,
  FaMobileAlt,
  FaUsers,
  FaServer,
  FaGamepad,
  FaShoppingCart,
  FaHome,
  FaUser,
  FaApple,
  FaAndroid,
  FaLinux,
  FaPennyArcade,
} from "react-icons/fa";
import {
  IoLogoWindows,
  IoIosInformation,
  IoIosMail,
  IoIosCall,
  IoIosDocument,
} from "react-icons/io";
import {
  SiAdobephotoshop,
  SiUnity,
  SiUnrealengine,
  SiBlender,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFirebase,
} from "react-icons/si";
import { BiGame, BiCodeAlt, BiPaint } from "react-icons/bi";
import { BsController, BsHeadset, BsDisplay } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import { RiGamepadLine, RiTrophyLine } from "react-icons/ri";

import {
  FiUser,
  FiShoppingBag,
  FiDownload,
  FiCreditCard,
  FiMessageCircle,
  FiSettings,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiCode,
} from "react-icons/fi";
import { BsFillPaletteFill } from "react-icons/bs";
import {
  FiUsers,
  FiTarget,
  FiHeart,
  FiGlobe,
  FiShield,
  FiClock,
  FiPlay,
} from "react-icons/fi";

// ============= CONSTANTS =============
export const APP_CONFIG = {
  name: "Business Builder",
  description:
    "A Next Js website that helps new buisnesses to build their online presence.",
  version: "2.0.0",
  author: "Talha",
  contact: {
    email: "talhamazhar1711@gmail.com",
    support: "talhamazhar1711@gmail.com",
  },
  social: {},
};

export const STATUS_OPTIONS = [
  { value: "planning", label: "Planning", color: "#F59E0B" },
  { value: "active", label: "Active", color: "#10B981" },
  { value: "completed", label: "Completed", color: "#3B82F6" },
  { value: "on-hold", label: "On Hold", color: "#F97316" },
  { value: "cancelled", label: "Cancelled", color: "#EF4444" },
];

export function slugify(str: string): string {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-") // spaces & non‑word chars → hyphens
    .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDatetime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

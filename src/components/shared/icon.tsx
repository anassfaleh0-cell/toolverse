import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Globe, Search, Lock, Shield, ShieldCheck, Zap, FileText, Palette,
  BarChart3, Monitor, Code2, Bot, Smartphone, Mail, Wrench, Sparkles,
  Key, ClipboardList, Link, Fingerprint, Scissors, Package, Hash,
  Ruler, Clock, Plug, Building, DollarSign, Phone, Earth, TreePine,
  Landmark, MapPin, Satellite, Building2, Music, RefreshCw, Calculator,
  TrendingUp, Megaphone, PenTool, Keyboard, Database, Activity, Cloud,
  ShoppingCart, LineChart, Target, Film, Headphones, CheckSquare,
  CreditCard, HeartPulse, BookOpen, Gamepad2, Heart, Waves, Settings,
  Triangle, Flame, Compass, Terminal, HelpCircle, Info, AlertTriangle,
  XCircle, CheckCircle2, CornerDownRight, Smile, FileArchive, File,
  Pen, ArrowRight, ArrowRightCircle, Copy, Tag, Send, Paperclip,
  ExternalLink, Image, Crop, Sliders, Sun, Moon, Star, Network,
  Server, Cpu, HardDrive, ShieldAlert, LockKeyhole, FileSearch,
  AlertCircle, Download, Upload, Trash2, RefreshCcw, Plus, Minus,
  Check, Menu, Home, Layers, LayoutDashboard, List, Grid3x3,
  Brush, Droplets, ZoomIn, ZoomOut, Maximize, Minimize,
  QrCode, Camera, Video, Play, Pause, Square, Volume2, VolumeX, Mic,
  Timer, Circle, ZapOff, Text as TextIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Globe, Search, Lock, Shield, ShieldCheck, Zap, FileText, Palette,
  BarChart3, Monitor, Code2, Bot, Smartphone, Mail, Wrench, Sparkles,
  Key, ClipboardList, Link, Fingerprint, Scissors, Package, Hash,
  Ruler, Clock, Plug, Building, DollarSign, Phone, Earth, TreePine,
  Landmark, MapPin, Satellite, Building2, Music, RefreshCw, Calculator,
  TrendingUp, Megaphone, PenTool, Keyboard, Database, Activity, Cloud,
  ShoppingCart, LineChart, Target, Film, Headphones, CheckSquare,
  CreditCard, HeartPulse, BookOpen, Gamepad2, Heart, Waves, Settings,
  Triangle, Flame, Compass, Terminal, HelpCircle, Info, AlertTriangle,
  XCircle, CheckCircle2, CornerDownRight, Smile, FileArchive, File,
  Pen, ArrowRight, ArrowRightCircle, Copy, Tag, Send, Paperclip,
  ExternalLink, Image, Crop, Sliders, Sun, Moon, Star, Network,
  Server, Cpu, HardDrive, ShieldAlert, LockKeyhole, FileSearch,
  AlertCircle, Download, Upload, Trash2, RefreshCcw, Plus, Minus,
  Check, Menu, Home, Layers, LayoutDashboard, List, Grid3x3,
  Brush, Droplets, ZoomIn, ZoomOut, Maximize, Minimize,
  QrCode, Camera, Video, Play, Pause, Square, Volume2, VolumeX, Mic,
  Timer, Circle, ZapOff, TextIcon,
  // Semantic aliases
  Warning: AlertTriangle,
  Success: CheckCircle2,
  Error: XCircle,
  Unknown: HelpCircle,
  InfoIcon: Info,
  MailPlus: Send,
  MailCheck: ShieldCheck,
  FileCheck: ShieldCheck,
  FileX: XCircle,
  FileWarning: AlertTriangle,
  AlarmCheck: Clock,
  AlarmPlus: Clock,
  AlarmMinus: Clock,
  Watch: Clock,
  Hourglass: Timer,
  Power: Zap,
  PowerOff: ZapOff,
  Pulse: Activity,
  Gauge: Activity,
  Wand: Sparkles,
  Sparkle: Sparkles,
  Paintbrush: Brush,
  PaintBucket: Droplets,
  Eraser: Scissors,
  Stamp: File,
  Type: TextIcon,
  CaseSensitive: TextIcon,
  SearchCheck: CheckCircle2,
  SearchX: XCircle,
  StopCircle: XCircle,
  Eye: Monitor,
  EyeOff: Monitor,
  Laptop: Monitor,
  Tablet: Smartphone,
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <span className={cn("inline-flex items-center justify-center", className)} aria-hidden="true">{name}</span>;
  }
  return <IconComponent className={cn("shrink-0", className)} aria-hidden="true" />;
}

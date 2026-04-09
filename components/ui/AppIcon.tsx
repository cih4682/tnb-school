import {
  IconCalendar, IconSlides, IconFileText, IconCircleHelp,
  IconBarChart, IconCheckCircle, IconChair, IconSearch,
  IconPalette, IconPen,
} from "./Icons";

const map: Record<string, React.FC<{ className?: string }>> = {
  calendar: IconCalendar,
  slides: IconSlides,
  fileText: IconFileText,
  circleHelp: IconCircleHelp,
  barChart: IconBarChart,
  checkCircle: IconCheckCircle,
  chair: IconChair,
  search: IconSearch,
  palette: IconPalette,
  pen: IconPen,
};

export function AppIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = map[name];
  if (!Icon) return <span className={className}>?</span>;
  return <Icon className={className} />;
}

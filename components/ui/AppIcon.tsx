import {
  IconCalendar, IconPresentation, IconFileEdit, IconMessageQuestion,
  IconChartBar, IconClipboardCheck, IconLayoutGrid, IconEye,
  IconBrush, IconNotebookPen,
} from "./Icons";

const map: Record<string, React.FC<{ className?: string }>> = {
  calendar: IconCalendar,
  slides: IconPresentation,
  fileText: IconFileEdit,
  circleHelp: IconMessageQuestion,
  barChart: IconChartBar,
  checkCircle: IconClipboardCheck,
  chair: IconLayoutGrid,
  search: IconEye,
  palette: IconBrush,
  pen: IconNotebookPen,
};

export function AppIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const Icon = map[name];
  if (!Icon) return <span className={className}>?</span>;
  return <Icon className={className} />;
}

import { AreaChart, Layers, AppWindow } from "lucide-react";
type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};
export const links: NavLink[] = [
  {
    href: "/add-jobs",
    label: "Add Jobs",
    icon: <Layers />,
  },
  {
    href: "/stats",
    label: "Stats",
    icon: <AreaChart />,
  },
  {
    href: "/jobs",
    label: "Jobs",
    icon: <AppWindow />,
  },
];

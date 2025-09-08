import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  PieChart,
  BarChart4,
  Star,
  HelpCircle,
  BookOpen // 1. Import the BookOpen icon
} from "lucide-react";

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ 
  icon: Icon, 
  label, 
  active = false, 
  collapsed = false,
  onClick 
}: SidebarLinkProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md w-full transition-all duration-200",
        active 
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center"
      )}
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </button>
  );
};

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState(
    window.location.pathname.startsWith("/payouts") ? "Payouts" :
    window.location.pathname.startsWith("/account-stats") ? "Account Stats" :
    window.location.pathname.startsWith("/trading") ? "Trading" :
    window.location.pathname.startsWith("/watchlist") ? "Watch list" :
    window.location.pathname.startsWith("/journey") ? "Trade Journey" :
    window.location.pathname.startsWith("/faq") ? "FAQ" :
    window.location.pathname.startsWith("/settings") ? "Settings" :
    "Dashboard"
  );

  const handleLinkClick = (label: string, route: string) => {
    setActiveLink(label);
    navigate(route);
  };

  return (
    <div
      className={cn(
        "relative h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-56",
        className
      )}
    >
      <div className="p-4">
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-md bg-primary/90 flex items-center justify-center">
            <BarChart4 size={18} className="text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-xl text-sidebar-foreground">Peak<span className="text-primary">Profit</span></h1>
              {/* Demo Badge - inline after logo */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[8px] font-bold rounded border border-purple-400/40 tracking-wide uppercase shadow-sm">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                Demo
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 -right-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-6 w-6 rounded-full bg-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="px-2 mt-6 space-y-6">
        <div className="space-y-1">
          <SidebarLink 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeLink === "Dashboard"}
            collapsed={collapsed}
            onClick={() => handleLinkClick("Dashboard", "/")}
          />
          <SidebarLink 
            icon={DollarSign} 
            label="Payouts" 
            active={activeLink === "Payouts"}
            collapsed={collapsed}
            onClick={() => handleLinkClick("Payouts", "/payouts")}
          />
          <SidebarLink 
            icon={TrendingUp} 
            label="Account Stats" 
            active={activeLink === "Account Stats"}
            collapsed={collapsed}
            onClick={() => handleLinkClick("Account Stats", "/account-stats")}
          />
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className={cn(
            "text-xs uppercase text-sidebar-foreground/60 mb-2 px-3",
            collapsed && "text-center"
          )}>
            {collapsed ? "More" : "Analytics"}
          </p>
          <div className="space-y-1">
            <SidebarLink 
              icon={BarChart3} 
              label="Trading" 
              active={activeLink === "Trading"}
              collapsed={collapsed}
              onClick={() => handleLinkClick("Trading", "/trading")}
            />
            <SidebarLink 
              icon={Star} 
              label="Watch list" 
              active={activeLink === "Watch list"}
              collapsed={collapsed}
              onClick={() => handleLinkClick("Watch list", "/watchlist")}
            />
            {/* 2. Add the new Trade Journey link */}
            <SidebarLink 
              icon={BookOpen} 
              label="Trade Journal" 
              active={activeLink === "Trade Journal"}
              collapsed={collapsed}
              onClick={() => handleLinkClick("Trade Journal", "/tradejournal")}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <div className="space-y-1">
            <SidebarLink 
              icon={HelpCircle} 
              label="FAQ" 
              active={activeLink === "FAQ"}
              collapsed={collapsed}
              onClick={() => handleLinkClick("FAQ", "/faq")}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-2">
        <SidebarLink 
          icon={Settings} 
          label="Settings" 
          active={activeLink === "Settings"}
          collapsed={collapsed}
          onClick={() => handleLinkClick("Settings", "/settings")}
        />
      </div>
    </div>
  );
}
// src/components/ChartSettingsModal.tsx
import { useState } from "react";
import { X, BarChart, Activity, Palette, TrendingUp, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ChartSettings {
  colorBarsOnPreviousClose: boolean;
  bodyColor: { up: string; down: string };
  borderColor: { up: string; down: string };
  wickColor: { up: string; down: string };
  adjustDataForDividends: boolean;
  session: string;
  precision: string;
  timezone: string;
}

interface ChartSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

// Define a specific type for the keys that hold color objects
type ColorCategory = 'bodyColor' | 'borderColor' | 'wickColor';

export default function ChartSettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}: ChartSettingsModalProps) {
  const [activeSection, setActiveSection] = useState("Symbol");

  const sidebarItems = [
    { id: "Symbol", icon: <BarChart size={16} />, label: "Symbol" },
    { id: "StatusLine", icon: <Activity size={16} />, label: "Status line" },
    { id: "ScalesAndLines", icon: <TrendingUp size={16} />, label: "Scales and lines" },
    { id: "Canvas", icon: <Palette size={16} />, label: "Canvas" },
    { id: "Trading", icon: <BarChart size={16} />, label: "Trading" },
    { id: "Alerts", icon: <Bell size={16} />, label: "Alerts" },
    { id: "Events", icon: <Calendar size={16} />, label: "Events" },
  ];

  const updateSetting = <K extends keyof ChartSettings>(key: K, value: ChartSettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };
  
  // This function is now type-safe
  const updateColorSetting = (category: ColorCategory, type: 'up' | 'down', color: string) => {
    onSettingsChange({
      ...settings,
      [category]: {
        ...settings[category],
        [type]: color,
      },
    });
  };

  const ColorPicker = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => (
    <input
      type="color"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
      style={{ backgroundColor: color }}
    />
  );

  const renderContent = () => {
    switch (activeSection) {
      case "Symbol":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">CANDLES</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="colorBars" className="text-sm">Color bars based on previous close</Label>
                  <Checkbox 
                    id="colorBars"
                    checked={settings.colorBarsOnPreviousClose}
                    onCheckedChange={(checked) => updateSetting('colorBarsOnPreviousClose', !!checked)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm flex items-center gap-2"><Checkbox defaultChecked disabled /> Body</Label>
                    <div className="flex gap-2">
                       <ColorPicker color={settings.bodyColor.up} onChange={(color) => updateColorSetting('bodyColor', 'up', color)} />
                       <ColorPicker color={settings.bodyColor.down} onChange={(color) => updateColorSetting('bodyColor', 'down', color)} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm flex items-center gap-2"><Checkbox defaultChecked disabled /> Borders</Label>
                    <div className="flex gap-2">
                      <ColorPicker color={settings.borderColor.up} onChange={(color) => updateColorSetting('borderColor', 'up', color)} />
                      <ColorPicker color={settings.borderColor.down} onChange={(color) => updateColorSetting('borderColor', 'down', color)} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm flex items-center gap-2"><Checkbox defaultChecked disabled /> Wick</Label>
                    <div className="flex gap-2">
                      <ColorPicker color={settings.wickColor.up} onChange={(color) => updateColorSetting('wickColor', 'up', color)} />
                      <ColorPicker color={settings.wickColor.down} onChange={(color) => updateColorSetting('wickColor', 'down', color)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">DATA MODIFICATION</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                  <Label htmlFor="adjustDividends" className="text-sm">Adjust data for dividends</Label>
                  <Checkbox 
                    id="adjustDividends"
                    checked={settings.adjustDataForDividends}
                    onCheckedChange={(checked) => updateSetting('adjustDataForDividends', !!checked)}
                  />
                </div>
                 <div className="space-y-2">
                  <Label className="text-sm">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-muted-foreground">Settings for {activeSection}</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden flex flex-col bg-card border-border">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            Chart settings
            <Button variant="ghost" size="icon" onClick={onClose} className="-mr-2">
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 min-h-0">
          <div className="w-56 border-r bg-muted/30">
            <div className="p-2 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left ${
                    activeSection === item.id 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
        
        <div className="flex justify-between items-center px-6 py-4 border-t bg-muted/30">
           <Button variant="link" className="p-0 h-auto">Template: Default</Button>
           <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Ok
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
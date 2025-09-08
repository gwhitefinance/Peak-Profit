import { Search, PlusCircle, CandlestickChart, BellPlus, Undo, Redo, Grid3X3, Clock } from 'lucide-react';

interface ToolbarProps {
  ticker: string;
  timeframe: string;
}

export function Toolbar({ ticker, timeframe }: ToolbarProps) {
  const buttonBaseStyles = "flex items-center justify-center p-1.5 rounded hover:bg-gray-100 cursor-pointer";
  const textButtonStyles = `${buttonBaseStyles} gap-1.5 px-2`;
  const separatorStyles = "w-px h-6 bg-gray-200";

  return (
    <div className="flex items-center gap-3 p-2 bg-white border-b border-gray-200">
      
      {/* Ticker Display */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
        <Search className="text-gray-600" size={16} />
        <span className="font-bold text-gray-900">{ticker}</span>
      </div>

      {/* Add Button */}
      <button className={buttonBaseStyles}><PlusCircle size={18} /></button>
      
      <div className={separatorStyles} />

      {/* Timeframe */}
      <button className={textButtonStyles}>{timeframe}</button>

      <div className={separatorStyles} />

      {/* Chart Style Button */}
      <button className={buttonBaseStyles}><CandlestickChart size={18} /></button>
      
      {/* Indicators Button */}
      <button className={textButtonStyles}>Indicators</button>
      
      {/* Grid Button */}
      <button className={buttonBaseStyles}><Grid3X3 size={16} /></button>
      
      {/* Clock Button */}
      <button className={buttonBaseStyles}><Clock size={16} /></button>
      
      {/* Alert Button */}
      <button className={textButtonStyles}>
        <BellPlus size={16} />
        Alert
      </button>
      
      {/* Replay Button */}
      <button className={textButtonStyles}>Replay</button>

      <div className={separatorStyles} />

      {/* Undo/Redo */}
      <button className={buttonBaseStyles}><Undo size={16} /></button>
      <button className={buttonBaseStyles}><Redo size={16} /></button>
    </div>
  );
}

export default Toolbar;


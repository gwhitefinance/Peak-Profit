import { useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Button } from "@/components/ui/button";
import { Undo, Trash2 } from "lucide-react";

export default function Whiteboard() {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [color, setColor] = useState("#FFFFFF");
  const colors = ["#FFFFFF", "#ff4444", "#00ff88", "#4A9DFF", "#FACC15"];

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Whiteboard</h3>
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{ backgroundColor: c, borderColor: color === c ? c : 'transparent' }}
            />
          ))}
          <Button variant="ghost" size="icon" onClick={() => canvasRef.current?.undo()}>
            <Undo size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => canvasRef.current?.clearCanvas()}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden border" style={{ height: '400px' }}>
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={4}
          strokeColor={color}
          canvasColor="#1a1a1a"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
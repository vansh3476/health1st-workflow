import { Button } from "@/components/ui/button";
import { Play, Save } from "lucide-react";

interface TopBarProps {
  onExecute?: () => void;
  onSave?: () => void;
  isExecuting?: boolean;
}

export function TopBar({ onExecute, onSave, isExecuting }: TopBarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-gray-900">
          Health1st Workflow Builder
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onSave}
        >
          <Save size={18} />
          Save
        </Button>
        <Button
          className="flex items-center gap-2 bg-health-agent hover:bg-health-agent/90"
          onClick={onExecute}
          disabled={isExecuting}
        >
          <Play size={18} />
          {isExecuting ? "Executing..." : "Execute"}
        </Button>
      </div>
    </div>
  );
}

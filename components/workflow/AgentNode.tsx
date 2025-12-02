import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";

export interface AgentNodeData {
  label: string;
  icon?: string;
  description?: string;
  type: "start" | "agent" | "completed";
  agentId?: string;
  config?: Record<string, unknown>;
}

interface AgentNodeProps {
  data: AgentNodeData;
  isConnecting?: boolean;
  isSelected?: boolean;
}

const typeStyles = {
  start: "bg-health-start text-white",
  completed: "bg-health-completed text-white",
  agent: "bg-white border-2 border-health-agent shadow-md",
};

const iconMap: Record<string, string> = {
  SAGE: "📝",
  VERA: "💼",
  DASH: "📅",
  GUARDIAN: "🛡️",
};

export function AgentNode({ data, isSelected }: AgentNodeProps) {
  const style = typeStyles[data.type];
  const icon = data.icon || iconMap[data.agentId || ""] || "⚙️";

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg min-w-[160px] text-center transition-all",
        style,
        isSelected && "ring-2 ring-offset-2 ring-health-agent"
      )}
    >
      {data.type !== "start" && data.type !== "completed" && (
        <Handle type="target" position={Position.Left} />
      )}

      <div className="flex items-center justify-center gap-2">
        <span className="text-lg">{icon}</span>
        <div className="text-left">
          <div className="font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs opacity-75">{data.description}</div>
          )}
        </div>
      </div>

      {data.type !== "completed" && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
}

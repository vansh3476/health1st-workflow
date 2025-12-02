import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepNode {
  id: string;
  agentId: string;
  label: string;
  description: string;
  icon: string;
}

interface StepProps {
  stepNumber: number;
  nodes: StepNode[];
  onDeleteNode?: (nodeId: string) => void;
  onNodeClick?: (node: StepNode) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDraggingOver?: boolean;
  deleteStep: () => void;
  isDeletable?: boolean;
}

const iconMap: Record<string, string> = {
  SAGE: "📝",
  VERA: "💼",
  DASH: "📅",
  GUARDIAN: "🛡️",
};

export function Step({
  stepNumber,
  nodes,
  onDeleteNode,
  onNodeClick,
  onDragOver,
  onDrop,
  isDraggingOver,
  deleteStep,
  isDeletable,
}: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          "relative w-56 min-h-40 rounded-lg border-2 border-gray-300 bg-white",
          "flex flex-col items-center justify-center p-4 gap-3 transition-all",
          isDraggingOver && "border-health-agent bg-blue-50 border-health-agent"
        )}
      >
        <div className="flex w-full text-center mb-2">
          <div className="w-full flex justify-center">
            <h3 className="text-sm text-center font-semibold text-gray-700">
              Step {stepNumber}
            </h3>
          </div>
          {isDeletable && (
            <button
              onClick={() => deleteStep()}
              className="text-base text-gray-400 hover:text-red-600 transition-colors"
              title="Delete step"
            >
              ✕
            </button>
          )}
        </div>

        <div className="w-full space-y-2 flex-1 flex flex-col">
          {nodes.length > 0 ? (
            nodes.map((node) => (
              <div
                key={node.id}
                onClick={() => onNodeClick?.(node)}
                className={cn(
                  "relative group p-3 bg-gradient-to-r from-blue-50 to-blue-100",
                  "rounded border border-health-agent cursor-pointer hover:shadow-md transition-all"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {iconMap[node.agentId] || "⚙️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900">
                      {node.label}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {node.description}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode?.(node.id);
                    }}
                    className={cn(
                      "p-1 rounded opacity-0 group-hover:opacity-100",
                      "hover:bg-red-100 transition-all text-red-600"
                    )}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <p className="text-xs text-gray-400">Drag agents here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

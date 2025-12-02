import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Handle, Position } from "reactflow";
import { StepNode } from "./Step";

const iconMap: Record<string, string> = {
  SAGE: "📝",
  VERA: "💼",
  DASH: "📅",
  GUARDIAN: "🛡️",
};

export function StepNodeComponent({ data }: { data: any }) {
  const {
    stepNumber,
    nodes,
    onDeleteNode,
    onNodeClick,
    isDeletable,
    onDeleteStep,
    onAgentDrop,
    id,
  } = data;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const agentData = e.dataTransfer.getData("application/reactflow");
    if (agentData) {
      onAgentDrop?.(id, agentData);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          "relative w-56 min-h-40 rounded-lg border-2 border-gray-300 bg-white",
          "flex flex-col items-center justify-center p-4 gap-3 transition-all shadow-md"
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
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStep?.(id);
              }}
              className="text-base text-gray-400 hover:text-red-600 transition-colors"
              title="Delete step"
            >
              ✕
            </button>
          )}
        </div>

        <div className="w-full space-y-2 flex-1 flex flex-col">
          {nodes && nodes.length > 0 ? (
            nodes.map((node: StepNode) => (
              <div
                key={node.id}
                onClick={() => onNodeClick?.(id, node)}
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
                      onDeleteNode?.(id, node.id);
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

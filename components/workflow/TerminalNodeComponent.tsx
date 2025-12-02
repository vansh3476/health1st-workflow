import { Handle, Position } from "reactflow";

export function TerminalNodeComponent({ data }: { data: any }) {
  const isStart = data.type === "start";
  const isEnd = data.type === "end";

  const bgColorClass = isStart
    ? "bg-health-start"
    : isEnd
    ? "bg-health-completed"
    : "bg-gray-500";

  return (
    <div className="relative">
      {isStart && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-gray-400"
        />
      )}
      {isEnd && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-gray-400"
        />
      )}

      <div
        className={`${bgColorClass} text-white rounded-lg shadow-lg px-6 py-4 min-w-[128px]`}
      >
        <div className="text-center">
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs opacity-75 mt-1">{data.description}</div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const AGENTS: Agent[] = [
  {
    id: "SAGE",
    name: "SAGE",
    icon: "📝",
    description: "Clinical Notes & Summaries",
  },
  {
    id: "VERA",
    name: "VERA",
    icon: "💼",
    description: "Medical Coding AI",
  },
  {
    id: "DASH",
    name: "DASH",
    icon: "📅",
    description: "Appointment Scheduler",
  },
  {
    id: "GUARDIAN",
    name: "GUARDIAN",
    icon: "🛡️",
    description: "Compliance & Safety Checker",
  },
  {
    id:'ADMIN',
    name:'ADMIN',
    icon:"⚙️",
    description:"admin panel"
  }
];

interface AgentsLibraryProps {
  onDragStart?: (agent: Agent) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AgentsLibrary({
  onDragStart,
  isOpen = true,
  onToggle,
}: AgentsLibraryProps) {
  const [search, setSearch] = useState("");

  const filteredAgents = AGENTS.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    agent: Agent
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/reactflow", JSON.stringify(agent));
    onDragStart?.(agent);
  };

  return (
    <div
      className={cn(
        "bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
        {isOpen && (
          <h2 className="text-sm font-semibold text-gray-700">AGENTS</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-1 h-8 w-8 flex-shrink-0"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      {isOpen && (
        <>
          <div className="px-4 pt-2 pb-4">
            <Input
              placeholder="Search agents..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              className="h-8 text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, agent)}
                  className={cn(
                    "p-3 bg-white rounded-lg border border-gray-200 cursor-move",
                    "hover:shadow-md hover:border-health-agent transition-all",
                    "flex items-center gap-3"
                  )}
                >
                  <span className="text-lg">{agent.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900">
                      {agent.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {agent.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 py-8">
                No agents found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

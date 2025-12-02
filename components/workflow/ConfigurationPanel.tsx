import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Node } from "reactflow";
import { AgentNodeData } from "./AgentNode";

interface ConfigurationPanelProps {
  node: Node<AgentNodeData> | null;
  onClose: () => void;
  onSave?: (config: Record<string, unknown>) => void;
}

const agentConfigs: Record<
  string,
  { fields: Array<{ name: string; label: string; type: string }> }
> = {
  SAGE: {
    fields: [
      { name: "summaryStyle", label: "Summary Style", type: "text" },
      { name: "includeCharts", label: "Include Charts", type: "checkbox" },
      { name: "notes", label: "Additional Notes", type: "textarea" },
    ],
  },
  VERA: {
    fields: [
      { name: "standard", label: "Coding Standard", type: "text" },
      { name: "version", label: "Version", type: "text" },
      { name: "notes", label: "Configuration Notes", type: "textarea" },
    ],
  },
  DASH: {
    fields: [
      { name: "duration", label: "Appointment Duration (min)", type: "number" },
      { name: "timezone", label: "Timezone", type: "text" },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
  GUARDIAN: {
    fields: [
      {
        name: "complianceLevel",
        label: "Compliance Level",
        type: "text",
      },
      { name: "checkFrequency", label: "Check Frequency", type: "text" },
      { name: "notes", label: "Safety Notes", type: "textarea" },
    ],
  },
};

export function ConfigurationPanel({
  node,
  onClose,
  onSave,
}: ConfigurationPanelProps) {
  if (!node) return null;

  const agentId = node.data.agentId;
  const config = agentConfigs[agentId || ""] || { fields: [] };
  const isSpecialNode =
    node.data.type === "start" || node.data.type === "completed";

  const handleSave = () => {
    const formData = new FormData(
      document.getElementById("config-form") as HTMLFormElement
    );
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    onSave?.(data);
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-40",
        "transform transition-all duration-300 ease-out",
        !node && "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
        <h3 className="font-semibold text-gray-900">Configuration</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <div
        className="overflow-y-auto flex-1 p-4"
        style={{ height: "calc(100% - 120px)" }}
      >
        {isSpecialNode ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Node Type
              </label>
              <p className="text-sm text-gray-600 mt-1">
                {node.data.type === "start"
                  ? "This is the workflow start node"
                  : "This is the workflow end node"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">label</label>
              <p className="text-sm text-gray-600 mt-1">{node.data.label}</p>
            </div>
          </div>
        ) : (
          <form id="config-form" className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Agent</label>
              <p className="text-sm text-gray-600 mt-1">{node.data.label}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <p className="text-sm text-gray-600 mt-1">
                {node.data.description || "AI Agent Node"}
              </p>
            </div>

            {config.fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="mt-1 text-sm"
                    rows={3}
                  />
                ) : field.type === "number" ? (
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="mt-1 text-sm"
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    id={field.name}
                    name={field.name}
                    type="checkbox"
                    className="mt-1 ml-2"
                  />
                ) : (
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="mt-1 text-sm"
                  />
                )}
              </div>
            ))}
          </form>
        )}
      </div>

      <div className="flex gap-2 p-4 border-t border-gray-200 bg-white">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
        {!isSpecialNode && (
          <Button
            className="flex-1 bg-health-agent hover:bg-health-agent/90"
            onClick={handleSave}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

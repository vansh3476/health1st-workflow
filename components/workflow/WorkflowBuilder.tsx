import { useState } from "react";
import { TopBar } from "@/components/workflow/TopBar";
import { AgentsLibrary } from "@/components/workflow/AgentsLibrary";
import { StepContainer } from "@/components/workflow/StepContainer";
import { ConfigurationPanel } from "@/components/workflow/ConfigurationPanel";
import { ToastContainer, toast } from "react-toastify";
import { StepNode } from "@/components/workflow/Step";
import "react-toastify/dist/ReactToastify.css";

interface SelectedNode extends StepNode {
  id: string;
}

export default function WorkflowBuilder() {
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("The workflow has been successfully executed.");
    } catch (error) {
      toast.error("An error occurred while executing the workflow.");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    toast.success("workflow has been saved successfully.");
  };

  const handleConfigSave = (config: Record<string, unknown>) => {
    toast.success("Node configuration has been updated.");
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen flex flex-col bg-white">
        <TopBar
          onExecute={handleExecute}
          onSave={handleSave}
          isExecuting={isExecuting}
        />

        <div className="flex-1 flex overflow-hidden">
          <AgentsLibrary
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <StepContainer onNodeSelect={setSelectedNode} />

        </div>
      </div>
    </>
  );
}

import { useState, useCallback, useMemo } from "react";
import { StepNode } from "./Step";
import { Agent } from "./AgentsLibrary";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  NodeTypes,
  ReactFlowProvider,
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { StepNodeComponent } from "./StepNodeComponent";
import { TerminalNodeComponent } from "./TerminalNodeComponent";
import { Plus } from "lucide-react";

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  nodes: StepNode[];
}

interface StepContainerProps {
  onNodeSelect?: (node: StepNode) => void;
}

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <g transform={`translate(${labelX}, ${labelY})`}>
        <foreignObject
          width={32}
          height={32}
          x={-16}
          y={-16}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                data?.onAddStep?.(id);
              }}
              className="w-8 h-8 bg-health-agent hover:bg-health-agent/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              title="Add step here"
            >
              <Plus size={16} />
            </button>
          </div>
        </foreignObject>
      </g>
    </>
  );
}

function StepContainerInner({ onNodeSelect }: StepContainerProps) {
  const [stepCounter, setStepCounter] = useState(4);

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      stepNode: StepNodeComponent,
      terminalNode: TerminalNodeComponent,
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  );

  const initialNodes: Node[] = [
    {
      id: "start",
      type: "terminalNode",
      position: { x: 50, y: 200 },
      data: { label: "Start", description: "Workflow begins", type: "start" },
      draggable: true,
    },
    {
      id: "step-1",
      type: "stepNode",
      position: { x: 300, y: 150 },
      data: {
        id: "step-1",
        stepNumber: 1,
        nodes: [
          {
            id: "sage",
            agentId: "SAGE",
            label: "SAGE",
            description: "Clinical Notes & Summaries",
            icon: "📝",
          },
        ],
        isDeletable: true,
      },
    },
    {
      id: "step-2",
      type: "stepNode",
      position: { x: 600, y: 150 },
      data: {
        id: "step-2",
        stepNumber: 2,
        nodes: [
          {
            id: "vera",
            agentId: "VERA",
            label: "VERA",
            description: "Medical Coding AI",
            icon: "💼",
          },
          {
            id: "guardian",
            agentId: "GUARDIAN",
            label: "GUARDIAN",
            description: "Compliance & Safety Checker",
            icon: "🛡️",
          },
        ],
        isDeletable: true,
      },
    },

    {
      id: "end",
      type: "terminalNode",
      position: { x: 950, y: 200 },
      data: {
        label: "Completed",
        description: "Workflow completed",
        type: "end",
      },
      draggable: true,
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "e-start-step1",
      source: "start",
      target: "step-1",
      type: "custom",
      animated: false,
      style: { stroke: "#9ca3af", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
    },
    {
      id: "e-step1-step2",
      source: "step-1",
      target: "step-2",
      type: "custom",
      animated: false,
      style: { stroke: "#9ca3af", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
    },
    {
      id: "e-step2-step3",
      source: "step-2",
      target: "end",
      type: "custom",
      animated: false,
      style: { stroke: "#9ca3af", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "custom",
            animated: false,
            style: { stroke: "#9ca3af", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const handleDeleteNode = useCallback(
    (stepId: string, nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === stepId && node.data.nodes) {
            return {
              ...node,
              data: {
                ...node.data,
                nodes: node.data.nodes.filter((n: StepNode) => n.id !== nodeId),
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleDeleteStep = useCallback(
    (stepId: string) => {
      const stepNode = nodes.find((n) => n.id === stepId);
      if (!stepNode) return;

      const incomingEdge = edges.find((e) => e.target === stepId);
      const outgoingEdge = edges.find((e) => e.source === stepId);

      setNodes((nds) => {
        const filteredNodes = nds.filter((n) => n.id !== stepId);

        return filteredNodes.map((node) => {
          if (node.type === "stepNode") {
            const stepNodes = filteredNodes.filter(
              (n) => n.type === "stepNode"
            );
            const index = stepNodes.findIndex((n) => n.id === node.id);
            return {
              ...node,
              data: {
                ...node.data,
                stepNumber: index + 1,
                isDeletable: stepNodes.length > 1,
              },
            };
          }
          return node;
        });
      });

      setEdges((eds) => {
        const filteredEdges = eds.filter(
          (e) => e.source !== stepId && e.target !== stepId
        );

        if (incomingEdge && outgoingEdge) {
          filteredEdges.push({
            id: `e-${incomingEdge.source}-${outgoingEdge.target}`,
            source: incomingEdge.source,
            target: outgoingEdge.target,
            type: "custom",
            animated: false,
            style: { stroke: "#9ca3af", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
          });
        }

        return filteredEdges;
      });
    },
    [nodes, edges, setNodes, setEdges]
  );

  const handleAgentDrop = useCallback(
    (stepId: string, agentData: string) => {
      try {
        const agent: Agent = JSON.parse(agentData);
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === stepId) {
              const nodeExists = node.data.nodes?.some(
                (n: StepNode) => n.agentId === agent.id
              );
              if (nodeExists) return node;

              return {
                ...node,
                data: {
                  ...node.data,
                  nodes: [
                    ...(node.data.nodes || []),
                    {
                      id: `${agent.id}-${Date.now()}`,
                      agentId: agent.id,
                      label: agent.name,
                      description: agent.description,
                      icon: agent.icon,
                    },
                  ],
                },
              };
            }
            return node;
          })
        );
      } catch (error) {
        console.error("Error parsing agent data:", error);
      }
    },
    [setNodes]
  );

  const handleNodeClick = useCallback(
    (stepId: string, node: StepNode) => {
      onNodeSelect?.({
        ...node,
        id: `${stepId}-${node.id}`,
      });
    },
    [onNodeSelect]
  );

  const handleAddStepBetween = useCallback(
    (edgeId: string) => {
      const edge = edges.find((e) => e.id === edgeId);
      if (!edge) return;

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return;

      const stepNodes = nodes.filter((n) => n.type === "stepNode");
      const newStepId = `step-${stepCounter}`;

      const newX = (sourceNode.position.x + targetNode.position.x) / 2;
      const newY = (sourceNode.position.y + targetNode.position.y) / 2;

      const newNode: Node = {
        id: newStepId,
        type: "stepNode",
        position: { x: newX + 150, y: newY },
        data: {
          id: newStepId,
          stepNumber: stepNodes.length + 1,
          nodes: [],
          isDeletable: true,
          onDeleteNode: handleDeleteNode,
          onNodeClick: handleNodeClick,
          onDeleteStep: handleDeleteStep,
          onAgentDrop: handleAgentDrop,
        },
      };

      setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
          if (node.position.x > newX && node.id !== edge.source) {
            return {
              ...node,
              position: {
                ...node.position,
                x: node.position.x + 300,
              },
            };
          }
          return node;
        });

        const allNodes = [...updatedNodes, newNode];
        return allNodes.map((node) => {
          if (node.type === "stepNode") {
            const stepNodesInOrder = allNodes
              .filter((n) => n.type === "stepNode")
              .sort((a, b) => a.position.x - b.position.x);
            const index = stepNodesInOrder.findIndex((n) => n.id === node.id);
            return {
              ...node,
              data: {
                ...node.data,
                stepNumber: index + 1,
                isDeletable: stepNodesInOrder.length > 1,
              },
            };
          }
          return node;
        });
      });

      setStepCounter((c) => c + 1);

      setEdges((eds) => {
        const filteredEdges = eds.filter((e) => e.id !== edgeId);
        return [
          ...filteredEdges,
          {
            id: `e-${edge.source}-${newStepId}`,
            source: edge.source,
            target: newStepId,
            type: "custom",
            animated: false,
            style: { stroke: "#9ca3af", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
          },
          {
            id: `e-${newStepId}-${edge.target}`,
            source: newStepId,
            target: edge.target,
            type: "custom",
            animated: false,
            style: { stroke: "#9ca3af", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#9ca3af" },
          },
        ];
      });
    },
    [
      edges,
      nodes,
      stepCounter,
      setNodes,
      setEdges,
      handleDeleteNode,
      handleDeleteStep,
      handleAgentDrop,
      handleNodeClick,
    ]
  );

  const nodesWithCallbacks = useMemo(() => {
    return nodes.map((node) => {
      if (node.type === "stepNode") {
        return {
          ...node,
          data: {
            ...node.data,
            onDeleteNode: handleDeleteNode,
            onDeleteStep: handleDeleteStep,
            onAgentDrop: handleAgentDrop,
            onNodeClick: handleNodeClick,
            isDeletable: nodes.filter((n) => n.type === "stepNode").length > 1,
          },
        };
      }
      return node;
    });
  }, [
    nodes,
    handleDeleteNode,
    handleDeleteStep,
    handleAgentDrop,
    handleNodeClick,
  ]);

  const edgesWithCallbacks = useMemo(() => {
    return edges.map((edge) => ({
      ...edge,
      data: { ...edge.data, onAddStep: handleAddStepBetween },
    }));
  }, [edges, handleAddStepBetween]);

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edgesWithCallbacks}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export function StepContainer({ onNodeSelect }: StepContainerProps) {
  return (
    <ReactFlowProvider>
      <StepContainerInner onNodeSelect={onNodeSelect} />
    </ReactFlowProvider>
  );
}

// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { BaseNode } from "./nodes/baseNode";
import { CustomEdge } from "./edges/customEdge";
import "./ui.css";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Node configurations for different types
const nodeConfigs = {
  customInput: {
    title: "Input",
    inputs: [], // No inputs
    outputs: [{ id: "value" }], // One output
    fields: [
      { key: "inputName", label: "Name", type: "text", defaultValue: "input_" },
      {
        key: "inputType",
        label: "Type",
        type: "select",
        options: ["Text", "File"],
        defaultValue: "Text",
      },
    ],
  },
  llm: {
    title: "LLM",
    inputs: [{ id: "system" }, { id: "prompt" }],
    outputs: [{ id: "response" }],
    fields: [],
    description: "This is a LLM.",
  },
  customOutput: {
    title: "Output",
    inputs: [{ id: "value" }],
    outputs: [],
    fields: [
      {
        key: "outputName",
        label: "Name",
        type: "text",
        defaultValue: "output_",
      },
      {
        key: "outputType",
        label: "Type",
        type: "select",
        options: ["Text", "Image"],
        defaultValue: "Text",
      },
    ],
  },
  text: {
    title: "Text",
    inputs: [],
    outputs: [{ id: "output" }],
    fields: [
      { key: "text", label: "Text", type: "textarea", defaultValue: "input" },
    ],
  },
};

// Create node types using BaseNode with configurations
const nodeTypes = Object.keys(nodeConfigs).reduce((acc, nodeType) => {
  acc[nodeType] = (props) => (
    <BaseNode {...props} nodeConfig={nodeConfigs[nodeType]} />
  );
  return acc;
}, {});

// Define custom edge types
const edgeTypes = {
  default: CustomEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    const config = nodeConfigs[type];
    let nodeData = { id: nodeID, nodeType: `${type}` };

    // Initialize field values based on configuration
    if (config && config.fields) {
      config.fields.forEach((field) => {
        if (field.type === "text") {
          nodeData[field.key] = field.defaultValue || "";
        } else if (field.type === "select") {
          nodeData[field.key] = field.defaultValue || field.options[0];
        }
      });
    }

    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleRunPipeline = () => {
    console.log("Running pipeline with nodes:", nodes);
    console.log("And edges:", edges);
  };

  const handleExportPipeline = () => {
    const pipelineData = { nodes, edges };
    const dataStr = JSON.stringify(pipelineData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pipeline.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearCanvas = () => {
    // This would need to be implemented in the store
    console.log("Clearing canvas");
  };

  return (
    <div className="pipeline-container">
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <h2 className="canvas-title">
            <span>🚀</span>
            Pipeline Canvas
          </h2>
          
        </div>

        <div
          ref={reactFlowWrapper}
          style={{
            width: "100%",
            height: "calc(100% - 60px)", // Adjusted to account for header height
            minHeight: 0, // Allow ReactFlow to shrink properly
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType="simplebezier"
            connectionLineStyle={{
              strokeWidth: 2,
              strokeDasharray: "5 5",
            }}
          >
            <Background color="#f0f0f0" gap={gridSize} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

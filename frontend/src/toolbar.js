// toolbar.js

import { useState } from "react";
import { DraggableNode } from "./draggableNode";
import "./toolbar.css";

// SVG Icons for different node types
const NodeIcons = {
  customInput: () => (
    <svg
      className="node-icon-svg"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="InputIcon"
    >
      <path d="m17 17 5-5-5-5-1.41 1.41L18.17 11H9v2h9.17l-2.58 2.59z"></path>

      <path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2M11 16l4-4-4-4v3H1v2h10z"></path>
    </svg>
  ),
  llm: () => (
    <svg className="node-icon-svg" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  customOutput: () => (
    <svg
      className="node-icon-svg"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="OutputIcon"
    >
      <path d="m17 17 5-5-5-5-1.41 1.41L18.17 11H9v2h9.17l-2.58 2.59z"></path>
      <path d="M19 19H5V5h14v2h2V5c0-1.1-.89-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.11 0 2-.9 2-2v-2h-2z"></path>
    </svg>
  ),
  text: () => (
    <svg className="node-icon-svg" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z" />
    </svg>
  ),
};

export const PipelineToolbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Start");

  const categories = [
    { id: "Start", label: "Start", icon: "🚀" },
    // { id: "Objects", label: "Objects", icon: "📦" },
    // { id: "Knowledge", label: "Knowledge", icon: "🧠" },
    // { id: "AI", label: "AI", icon: "🤖" },
    // { id: "Integrations", label: "Integrations", icon: "🔗" },
    // { id: "Logic", label: "Logic", icon: "⚡" },
    // { id: "Data", label: "Data", icon: "📊" },
    // { id: "Chat", label: "Chat", icon: "💬" },
  ];

  const nodeTypes = [
    {
      type: "customInput",
      label: "Input",
      category: "Start",
      icon: NodeIcons.customInput,
    },
    {
      type: "customOutput",
      label: "Output",
      category: "Start",
      icon: NodeIcons.customOutput,
    },{ type: "llm", label: "LLM", category: "Start", icon: NodeIcons.llm },
    
    { type: "text", label: "Text", category: "Start", icon: NodeIcons.text },
  ];

  const filteredNodes = nodeTypes.filter(
    (node) =>
      node.category === activeCategory &&
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pipeline-toolbar">
      <div className="toolbar-header">
        <h1 className="toolbar-title">Pipeline Builder</h1>
        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="node-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span style={{ marginRight: "6px" }}>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="nodes-grid">
        {filteredNodes.map((node) => (
          <DraggableNode
            key={node.type}
            type={node.type}
            label={node.label}
            icon={node.icon}
            category={node.category}
          />
        ))}
      </div>
    </div>
  );
};

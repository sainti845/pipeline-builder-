// baseNode.js
// Common base component for all node types using DRY principle

import React, { useState, useMemo } from "react";
import { Handle, Position } from "reactflow";
import "./baseNode.css";

// Function to extract variables from text (e.g., "{{ variableName }}" -> ["variableName"])
const extractVariables = (text) => {
  if (!text) return [];
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variables = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const variableName = match[1].trim();
    if (variableName && !variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
};

// Simple icon components for each node type
const NodeIcons = {
  customInput: () => (
    <svg
      className="node-title-icon"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="InputIcon"
    >
      <path d="M21 3.01H3c-1.1 0-2 .9-2 2V9h2V4.99h18v14.03H3V15H1v4.01c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98v-14c0-1.11-.9-2-2M11 16l4-4-4-4v3H1v2h10z"></path>
    </svg>
  ),
  llm: () => (
    <svg viewBox="0 0 16 16" fill="currentColor" className="node-title-icon">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  customOutput: () => (
    <svg
      className="node-title-icon"
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
    <svg viewBox="0 0 16 16" fill="currentColor" className="node-title-icon">
      <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11z" />
    </svg>
  ),
};

export const BaseNode = ({
  id,
  data,
  nodeConfig,
  selected,
  updateNodeField,
}) => {
  const {
    title,
    inputs = [],
    outputs = [],
    fields = [],
    description = "",
  } = nodeConfig;

  // Initialize field values with default values
  const [fieldValues, setFieldValues] = useState(() => {
    const initialValues = {};
    fields.forEach((field) => {
      if (field.type === "text" || field.type === "textarea") {
        initialValues[field.key] =
          data?.[field.key] || field.defaultValue || "";
      } else if (field.type === "select") {
        initialValues[field.key] =
          data?.[field.key] || field.defaultValue || field.options[0];
      }
    });
    return initialValues;
  });

  // Extract variables from text fields for dynamic input handles
  const dynamicInputs = useMemo(() => {
    const variables = [];
    fields.forEach((field) => {
      if (field.type === "text" || field.type === "textarea") {
        const textValue = fieldValues[field.key] || "";
        const extractedVars = extractVariables(textValue);
        extractedVars.forEach((varName) => {
          if (!variables.find((v) => v.id === varName)) {
            variables.push({ id: varName, label: varName });
          }
        });
      }
    });

    // Debug logging
    if (variables.length > 0) {
      console.log("Dynamic inputs created:", variables);
    }

    return variables;
  }, [fields, fieldValues]);

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Update the store so the node data persists
    if (updateNodeField) {
      updateNodeField(id, fieldKey, value);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.key} className="field-group">
            <label className="field-label">{field.label}</label>
            <input
              type="text"
              className="field-input"
              value={fieldValues[field.key]}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || ""}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.key} className="field-group">
            <label className="field-label">{field.label}</label>
            <textarea
              className="field-textarea"
              value={fieldValues[field.key]}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder || ""}
              rows={4}
              style={{ resize: "vertical" }}
            />
          </div>
        );
      case "select":
        return (
          <div key={field.key} className="field-group">
            <label className="field-label">{field.label}</label>
            <select
              className="field-select"
              value={fieldValues[field.key]}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  // Get the icon for this node type
  const NodeIcon = NodeIcons[data?.nodeType] || NodeIcons.customInput;

  return (
    <div
      className={`base-node node-type-${
        data?.nodeType || title.toLowerCase()
      } ${selected ? "selected" : ""}`}
    >
      {/* Dynamic Input Handles for Template Variables */}
{dynamicInputs.map((input, index) => (
  <React.Fragment key={`dynamic-input-${input.id}`}>
    {/* Variable Label with connection line effect */}
    <div
      className="variable-label-container"
      style={{
        position: "absolute",
        right: "calc(100% + 6px)", // Position outside the node
        top: `${20 + index * 30}px`,
        display: "flex",
        alignItems: "center",
        height: "12px",
      }}
    >
      {/* Dotted line connector (optional) */}
      <div
        style={{
          position: "absolute",
          right: "-6px",
          width: "6px",
          height: "1px",
          borderTop: "1px dotted #444",
        }}
      />
      
      {/* Label text */}
      <span
        style={{
          fontSize: "11px",
          color: "#888",
          paddingRight: "8px",
          fontFamily: "monospace",
        }}
      >
        {input.label}
      </span>
    </div>
    
    {/* Handle */}
    <Handle
      type="target"
      position={Position.Left}
      id={input.id}
      className="node-handle input dynamic-handle"
      style={{
        top: `${20 + index * 30}px`,
        left: "-6px",
      }}
    />
  </React.Fragment>
))}

      {/* Static Input Handles */}
      {inputs.map((input, index) => {
        // Calculate position based on node type
        let topPosition;
        if (data?.nodeType === "llm") {
          // LLM: Top and bottom positioning
          topPosition = index === 0 ? "20px" : "calc(100% - 20px)";
        } else if (data?.nodeType === "customOutput") {
          // Output: Middle positioning
          topPosition = "50%";
        } else {
          // Default: Stacked positioning
          topPosition = `${20 + (dynamicInputs.length + index) * 30}px`;
        }

        return (
          <Handle
            key={`static-input-${input.id}`}
            type="target"
            position={Position.Left}
            id={input.id}
            className="node-handle input"
            style={{
              top: topPosition,
              left: "-6px",
              transform:
                data?.nodeType === "customOutput" ? "translateY(-50%)" : "none",
            }}
          />
        );
      })}

      {/* Node Header */}
      <div className="node-header">
        <h3 className="node-title">
          <NodeIcon />
          {title}
        </h3>

        {/* Variable count indicator for text nodes */}
        {data?.nodeType === "text" && dynamicInputs.length > 0 && (
          <div className="variable-count">
            <span className="variable-count-badge">
              {dynamicInputs.length}{" "}
              {dynamicInputs.length === 1 ? "variable" : "variables"}
            </span>
          </div>
        )}
      </div>

      {/* Node Description */}
      {description && <div className="node-description">{description}</div>}

      {/* Node Fields */}
      <div className="node-fields">{fields.map(renderField)}</div>

      {/* Output Handles */}
      {outputs.map((output, index) => {
        // Calculate position based on node type
        let topPosition;
        if (data?.nodeType === "customOutput") {
          // Output: Middle positioning
          topPosition = "50%";
        } else {
          // Default: Percentage-based positioning
          topPosition = `${((index + 1) * 100) / (outputs.length + 1)}%`;
        }

        return (
          <Handle
            key={`output-${output.id}`}
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            className="node-handle output"
            style={{
              top: topPosition,
              transform:
                data?.nodeType === "customOutput" ? "translateY(-50%)" : "none",
            }}
          />
        );
      })}
    </div>
  );
};

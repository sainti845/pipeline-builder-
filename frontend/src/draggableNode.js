// draggableNode.js

export const DraggableNode = ({ type, label, icon, category }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`draggable-node ${category.toLowerCase()}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      draggable
    >
      <div className="node-icon">
        {typeof icon === "function" ? icon() : icon}
      </div>
      <p className="node-label">{label}</p>
    </div>
  );
};

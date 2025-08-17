// submit.js

import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import "./submit.css";

export const SubmitButton = () => {
  const { nodes, edges } = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
    }),
    shallow
  );

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      const result = await response.json();

      toast.success(
        <div className="toast-content">
          <div className="toast-row">
            <span className="toast-label">Nodes:</span>
            <span className="toast-value">{result.num_nodes}</span>
          </div>
          <div className="toast-row">
            <span className="toast-label">Edges:</span>
            <span className="toast-value">{result.num_edges}</span>
          </div>
          <div className="toast-row">
            <span className="toast-label">DAG:</span>
            <span className="toast-value">{result.is_dag ? "Yes" : "No"}</span>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        }
      );
    } catch (error) {
      console.error("Error submitting the pipeline:", error);
      toast.error("Submission failed! Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="submit-button-container">
      <button onClick={handleSubmit} className="submit-button" type="submit">
        Submit
      </button>
    </div>
  );
};

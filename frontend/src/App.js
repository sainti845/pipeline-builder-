import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { ToastContainer, Bounce } from "react-toastify";  // ADD THIS
import "react-toastify/dist/ReactToastify.css";           // ADD THIS
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span className="app-title-icon">🔧</span>
          Pipeline Builder
        </h1>
        <p className="app-subtitle">
          Create and manage your data processing workflows with drag-and-drop
          ease
        </p>
      </header>

      <main className="app-content">
        <PipelineToolbar />
        <PipelineUI />
        <SubmitButton />
      </main>

      {/* ADD TOASTCONTAINER HERE - Outside of main */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
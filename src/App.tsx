import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Home";
import Auth from "./routes/Auth";
import Trollerino from "./routes/Trollerino";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/trollerino",
    element: <Trollerino />,
  },
]);

function App() {
  return (
    <div className="w-full h-screen flex overflow-hidden">
      <RecoilRoot>
        <ToastContainer />
        <RouterProvider router={router} />
      </RecoilRoot>
    </div>
  );
}

export default App;

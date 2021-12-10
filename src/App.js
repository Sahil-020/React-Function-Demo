import logo from "./logo.svg";
import "./App.css";
import QRContainer from "./Component/QRContainer";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* <QRContainer /> */}
          <Route path="/" element={<QRContainer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

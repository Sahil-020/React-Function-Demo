import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";
import QRContainer from "./Component/QRContainer";
import { BrowserRouter, Switch, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import LoadingOverlay from "react-loading-overlay";

function App() {
  const [showLoader, setShowLoader] = useState(false);
  return (
    // <LoadingOverlay active={showLoader} spinner text="Loading...">

    <BrowserRouter>
      <div className="App">
        <Switch>
          {/* <QRContainer /> */}
          <Route
            path="/"
            component={() => <QRContainer setShowLoader={setShowLoader} />}
          />
          {/* <Route exact path="/:id" component={QRContainer} /> */}
        </Switch>
        <ToastContainer hideProgressBar={true} />
      </div>
    </BrowserRouter>

    // </LoadingOverlay>
  );
}

export default App;

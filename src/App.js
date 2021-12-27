import logo from "./logo.svg";
import { useState } from "react";
import "./App.css";
import QRContainer from "./Component/QRContainer";
import { BrowserRouter, Switch, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import LoadingOverlay from "react-loading-overlay";

function App() {
  const [showLoader, setShowLoader] = useState(false);
  return (
    // <LoadingOverlay active={showLoader} spinner text="Loading...">
    <>
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
        </div>
      </BrowserRouter>
      <ToastContainer hideProgressBar={true} />
    </>
    // </LoadingOverlay>
  );
}

export default App;

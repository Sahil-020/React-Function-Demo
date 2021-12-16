import logo from "./logo.svg";
import "./App.css";
import QRContainer from "./Component/QRContainer";
import { BrowserRouter, Switch, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          {/* <QRContainer /> */}
          <Route path="/" component={QRContainer} />
          {/* <Route exact path="/:id" component={QRContainer} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

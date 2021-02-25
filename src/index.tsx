import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import "./index.sass";
import * as serviceWorker from "./serviceWorker";
import CreateStore from "./store";
import Routes from "./config/Routes";

declare global {
  interface Window {
    attempts: any;
    campoUsuario: any;
    TEMPLATE_HELP: any;
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#109e2f",
    },
  },
});

const store = CreateStore();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import PresaleContextProvider from "./provider/PresaleContextProvider";

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans", sans-serif',
    // fontWeightMedium: 600
  },
  palette: {
    primary: {
      main: "#00bb89",
    },
    secondary: {
      main: "#0d7e06",
    },
    error: {
      main: red.A400,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MoralisProvider
        appId={process.env.REACT_APP_MORALIS_APP_ID ?? ""}
        serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL ?? ""}
      >
        <SnackbarProvider maxSnack={3}>
          <PresaleContextProvider>
            <App />
          </PresaleContextProvider>
        </SnackbarProvider>
      </MoralisProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

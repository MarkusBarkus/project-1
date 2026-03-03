import { useState } from "react";

import {
  Snackbar
} from "@mui/material";

import "./App.css";

import Header from "./components/Header.jsx";

 import Home from "./components/Home.jsx";

function App() {

  // Snackbar State & Functions
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const closeSnackbar = () => setSnackbarVisible(false);
  const openSnackbar = (text) => {
    setSnackbarMessage(text);
    setSnackbarVisible(true);
  }

  return (<>
    <Header appTitle="P1 (M_Alsaidi)" log={openSnackbar} />
    <Home log={openSnackbar}/>
    <Snackbar
      open={snackbarVisible}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      message={snackbarMessage}
    />
  </>);
};

export default App;
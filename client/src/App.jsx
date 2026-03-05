import { useState } from "react";

import {
  Snackbar,
  createTheme,
    ThemeProvider,
    Fab
} from "@mui/material";

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Border - Unbookmarked status (default)
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Filled - Bookmarked stauts

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


  const theme = createTheme({
  palette: {
    primary: {
      main: '#10a56e',
    },
  }
});

  return (<ThemeProvider theme={theme}>
    <Header appTitle="P1 (M_Alsaidi)" log={openSnackbar} />
    <Home log={openSnackbar}/>
    <Snackbar
    sx={{ zIndex: 99 }}
      open={snackbarVisible}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      message={snackbarMessage}
    />
    <Fab color="primary" sx={{ zIndex: 100, border: "2px solid #e1e1e1", position: "absolute", bottom: "1em", right: "1em" }}><BookmarkBorderIcon/></Fab>
  </ThemeProvider>);
};

export default App;
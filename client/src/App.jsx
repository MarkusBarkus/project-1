import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button, 
  Snackbar
} from "@mui/material";

import "./App.css";

function App() {

  // Snackbar State & Functions
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const closeSnackbar = () => setSnackbarVisible(false);
  const openSnackbar = (text) => {
    setSnackbarMessage(text);
    setSnackbarVisible(true);
  }

  let refreshDatabase = async () => {
    try {
      let result = await fetch("http://localhost:9000/db/refresh", { method: 'POST' });
      if (result.ok) {
        setLog('Database refreshed');
        result = await fetch("http://localhost:9000/alerts");
        let alerts = await result.json();
        setLog(`${alerts.length} alerts loaded`);
      }
    }
    catch (e) {
      console.error(e.message);
      setLog(e.message);
    }
  }

  return (<>
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          INFO-3139 P1 ( M_ALSAIDI )
        </Typography>
      </Toolbar >
    </AppBar >
    <Paper elevation={4} sx={{ marginTop: "0.5em", padding: "1em" }}>
      <Button variant="contained" onClick={refreshDatabase} >Refresh Database</Button>
    </Paper>
    <Snackbar
      open={snackbarVisible}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      message={snackbarMessage}
    />
  </>);
};

export default App;
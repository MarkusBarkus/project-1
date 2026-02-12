import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Button
} from "@mui/material";

import "./App.css";

function App() {
  return (<>
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          INFO-3139 P1 ( M_Alsaidi )
        </Typography>
      </Toolbar >
    </AppBar >
    <Paper elevation={4} sx={{ marginTop: "0.5em", padding: "1em" }}>
      <Button variant="contained">Refresh Database</Button>
    </Paper>
  </>);
};

export default App;
import {
    Paper,
    CardHeader,
    CardContent,
    Fab
} from '@mui/material';

import logo from "../assets/planeFromGoogle.png";

import { useState, useEffect } from "react";

import * as api from "../util/api"

import Search from "./Search"

import Alert from "./Alert"

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; // Border - Unbookmarked status (default)
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Filled - Bookmarked stauts

const Home = (props) => {
const [alerts, setAlerts] = useState([]);


  useEffect(() => {
    const loadAlerts = async () => {
      let result = await api.alerts.getSearchData();
      setAlerts(result);
      props.log(`${result.length} alerts loaded`);
    }
    loadAlerts();
  }, []);

  const loadAlert = async (_alert) => {
      let result = await api.alert.getSearchData(_alert);
      setSelectedAlert(result);
      props.log(`${_alert} alerts loaded`);
    }

    const [selectedAlert, setSelectedAlert] = useState();
    
     return (<>
        <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
            <img src={logo} style={{ width: "40%", maxWidth: "200px", margin: "1em" }} />
            <CardHeader title="Travel Alerts" />
            <CardContent>
                <Search alerts={alerts} onSelection={selection => loadAlert(selection.country_code)} />
            </CardContent>
        </Paper>

        {selectedAlert && <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
        <CardContent>
        <Alert alert={selectedAlert} />
        </CardContent>
         </Paper> }


{selectedAlert && <Fab onClick={() => api.save.setSave(selectedAlert.country_code)} color="primary" sx={{ zIndex: 100, border: "2px solid #e1e1e1", position: "absolute", bottom: "1em", right: "1em" }}>
    
    <BookmarkBorderIcon/>

</Fab> }


    </>);
};

export default Home;
import {
    Paper,
    CardHeader,
    CardContent,
} from '@mui/material';

import logo from "../assets/planeFromGoogle.png";

import { useState, useEffect } from "react";

import * as api from "../util/api"

import Search from "./Search"



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


     return (<>
        <Paper elevation={4} sx={{ marginTop: "0.5em" }}>
            <img src={logo} style={{ width: "40%", maxWidth: "200px", margin: "1em" }} />
            <CardHeader title="Travel Alerts" />
            <CardContent>
                <Search alerts={alerts} onSelection={selection => console.log(selection)} />
            </CardContent>
        </Paper>
    </>);
};

export default Home;
const Alert = ({alert}) => {

  if (!alert) return (<></>); // Render an empty fragment

  return (<>
    <b>{`(${alert.country_code}) ${alert.country_name}`}</b>
    {alert.sub_region && <><br />{alert.sub_region}</>}
    {alert.advisory && <><hr />{alert.advisory}</>}
    {alert.date && <><hr />{alert.date}</>}
  </>);
};

export default Alert; 
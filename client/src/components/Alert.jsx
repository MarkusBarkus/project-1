const Alert = ({alert}) => {

  if (!alert) return (<></>); // Render an empty fragment

  return (<>
    {`(${alert.country_code}) ${alert.country_name}`}
  </>);
};

export default Alert; 
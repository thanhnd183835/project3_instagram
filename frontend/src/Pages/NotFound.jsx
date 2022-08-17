import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
const NotFound = () => {
  const useStyles = makeStyles((theme) => {
    return {
      container: {
        margin: 'auto',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        verticalAlign: 'middle',
      },
      mainTitle: {
        fontSize: '16rem',
        marginBottom: '0px',
      },
      subTitle: {
        fontSize: '24px',
        margin: '0px',
      },
      button: {
        background: '#262626 !important',
        margin: '10px 20px',
        padding: '10px 20px',
      },
      link: {
        textDecoration: 'none',
        color: '#fff',
      },
    };
  });

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h1 className={classes.mainTitle}>404</h1>
      <p className={classes.subTitle}>Not Found</p>
      <Button className={classes.button}>
        <Link className={classes.link} to="/">
          Go Back Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;

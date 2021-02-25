import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./index.sass";
import LoginForm from "../../components/LoginForm";
import { login } from "../../actions/loginActions";
import BackgroundLogin from "../../styles/images/background-login.jpeg";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    background: `url(${BackgroundLogin}) no-repeat`,
    height: "100vh",
    backgroundSize: "100%",
    backdropFilter: "brightness(150%)",
    [theme.breakpoints.down("sm")]: {
      backgroundSize: "cover",
    },
  },
}));

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading } = useSelector((state: any) => state.loginReducer);

  const handleForm = async (form: object) => {
    try {
      await dispatch(login(form));
      history.push("/dashboard");
    } catch (error) {
      return error;
    }
  };
  console.log("process.env.NODE_ENV ", process.env.NODE_ENV);
  return (
    <div className={`login-container ${classes.loginContainer}`}>
      <div className="login-container__form">
        <LoginForm loading={loading} handleForm={handleForm} />
        {/* <div><a href="http://portal.dev.com/#/dashboard/status-account?socio=A-1713&token=LUCA123456">LINK Estado cuenta</a></div>
        <div><a href="http://portal.dev.com/#/dashboard/actualizacion-datos?socio=A-1713&token=LUCA123456">LINK Actualizacion datos</a></div> */}
      </div>
    </div>
  );
}

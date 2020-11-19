import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import CustomTextField from "../../components/FormElements/CustomTextField";
import snackBarUpdate from "../../actions/snackBarActions";
import { setForgotPassword } from "../../actions/personActions";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: "center",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -9,
  },
  submit: {
    width: "80%",
  },
}));

type FormData = {
  doc_id: string;
  group_id: string;
  email: string;
  password: string;
  password2: string;
};

export default function ForgotPasswword(): JSX.Element {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();
  const loading = useSelector((state: any) => state.personReducer.loading);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleForm = (form: any) => {
    if (form.password !== form.password2) {
      dispatch(
        snackBarUpdate({
          payload: {
            message: "Claves tienen que se iguales",
            status: true,
            type: "error",
          },
        })
      );
    } else {
      dispatch(setForgotPassword(form));
    }
  };

  const handleBack = () => {
    history.push("/");
  };

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12} style={{ textAlign: "center", marginTop: 30, fontWeight: 'bold' }}>
        Proporcione los detalles para registrar su contraseña a continuacion
      </Grid>
      <Grid item xs={3} style={{ textAlign: "center" }}>
        <Grid container spacing={3} justify="center">
          <form
            className={classes.form}
            onSubmit={handleSubmit(handleForm)}
            noValidate
          >
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Cedula"
                field="doc_id"
                required
                register={register}
                errorsField={errors.doc_id}
                errorsMessageField={errors.doc_id && errors.doc_id.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Acción"
                field="group_id"
                required
                register={register}
                errorsField={errors.group_id}
                errorsMessageField={errors.group_id && errors.group_id.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Correo"
                field="email"
                required
                register={register}
                errorsField={errors.email}
                errorsMessageField={errors.email && errors.email.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Nueva Clave"
                field="password"
                required
                register={register}
                errorsField={errors.password}
                errorsMessageField={errors.password && errors.password.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Confirmar Clave"
                field="password2"
                required
                register={register}
                errorsField={errors.password2}
                errorsMessageField={
                  errors.password2 && errors.password2.message
                }
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: 20 }} >
              <div className={classes.wrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  className={classes.submit}
                >
                  Registrar contraseña
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                className={classes.submit}
                onClick={handleBack}
              >
                Regresar
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}

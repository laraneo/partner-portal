import React, { useEffect, FunctionComponent } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import CustomTextField from "../FormElements/CustomTextField";
import { update, create, get } from "../../actions/applicantsActions";
import { Grid } from "@material-ui/core";
import Upload from "../FormElements/Upload";

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
    paddingLeft: 80,
    paddingRight: 80,
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -9,
    marginLeft: -9,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  select: {
    padding: "10px 0px 10px 0px",
    width: " 100%",
    backgroundColor: "transparent",
    border: 0,
    borderBottom: "1px solid grey",
    fontSize: "16px",
  },
}));

type FormData = {
  sCI: string;
  sNombres: string;
  sApellidos: string;
  file: string;
  pictureFile: string;
  sArchivo: string;
  nStatus: string;
  dCreated: string;
};

type Iprops = {
  id?: number;
};

export default function ApplicantForm(props: Iprops): JSX.Element {
  const { id } = props;
  const classes = useStyles();
  const { handleSubmit, register, errors, reset, setValue } = useForm<
    FormData
  >();
  const loading = useSelector((state: any) => state.applicantsReducer.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleForm = async (form: object) => {
      const body = {
          ...form,
          sArchivo: '',
      }
    await dispatch(create(body));
    reset();
  };

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Aspirante
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Nombres"
                field="sNombres"
                required
                register={register}
                errorsField={errors.sNombres}
                errorsMessageField={errors.sNombres && errors.sNombres.message}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                placeholder="Apellidos"
                field="sApellidos"
                required
                register={register}
                errorsField={errors.sApellidos}
                errorsMessageField={
                  errors.sApellidos && errors.sApellidos.message
                }
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="CI"
                field="sCI"
                required
                register={register}
                errorsField={errors.sCI}
                errorsMessageField={errors.sCI && errors.sCI.message}
              />
            </Grid>
            <Grid item sm={12} xs={12} md={12} style={{ paddingTop: 15 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  Foto
                </Grid>
                <Grid item xs={12}>
                  <Upload
                    field="pictureFile"
                    required
                    onlyImage
                    label="Archivo"
                    register={register}
                    setValue={setValue}
                    requiredErrorMessage={errors.pictureFile && errors.pictureFile.message}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item sm={12} xs={12} md={12} style={{ paddingTop: 15 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  Planilla
                </Grid>
                <Grid item xs={12}>
                  <Upload
                    field="file"
                    label="Archivo"
                    required
                    onlyImage
                    register={register}
                    setValue={setValue}
                    requiredErrorMessage={errors.pictureFile && errors.pictureFile.message}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }} >
            <div className={classes.wrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
              Registrar
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
            </Grid>
          </Grid>

         
        </form>
      </div>
    </Container>
  );
}

import { Grid } from "@material-ui/core";
import React from "react";
import ApplicantForm from "../../components/ApplicantForm";

export default function LoadApplicant() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        Carga de Aspirante
      </Grid>
      <Grid item xs={6}>
        <ApplicantForm />
      </Grid>
    </Grid>
  );
}

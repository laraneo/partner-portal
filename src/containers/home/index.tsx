import React, { useEffect } from "react";
import {
  makeStyles,
  createStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PaymentIcon from "@material-ui/icons/Payment";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CreditCardRoundedIcon from "@material-ui/icons/CreditCardRounded";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import DeckIcon from "@material-ui/icons/Deck";
import {
  FaGolfBall,
  FaHorseHead,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaFileImport,
} from "react-icons/fa";
import { BiTennisBall } from "react-icons/bi";

import MailRoundedIcon from "@material-ui/icons/MailRounded";

import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import Widgtet from "../../components/Widget";
import Widgtet1 from "../../components/Widget1";
import Widgtet3 from "../../components/Widget3";
import { Paper, useMediaQuery } from "@material-ui/core";
import Helper from "../../helpers/utilities";
import Loader from "../../components/common/Loader";
import { getBalance } from "../../actions/webServiceActions";

class Question extends React.Component {
  render() {
    return (
      <h3>
        Lets go for a <FaGolfBall color="#109e2f" size={50} />?{" "}
      </h3>
    );
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    widgetContainer: {
      marginBottom: "100px",
    },
    hideMobileWidget: {
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    showMobileWidget: {
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
    },
  })
);

export default function Home() {
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();
  const {
    webServiceReducer: { clientBalance, setBalanceLoading },
    menuReducer: { widgetList },
    loginReducer: { userRoles, user },
    parameterReducer: { listData: parameterList },
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();

  const wsAttemps = Helper.getParameter(parameterList, "WS_INTENTOS");
  const taxParameter = Helper.getParameter(parameterList, "IMPUESTO_IGTF");
  const validateWidget = (value: string) => {
    console.log(widgetList);
    const isValid = widgetList.find((e: any) => e.slug === value);
    if (isValid) {
      return true;
    }
    return false;
  };

  const getOrder = (value: string) => {
    const widget = widgetList.find((e: any) => e.slug === value);
    return widget.order;
  };

  const hiddeMobileWidget = (value: string) => {
    const isValid = widgetList.find((e: any) => e.slug === value);
    if (isValid && isValid.show_mobile !== null && isValid.show_mobile == 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (parameterList.length > 0 && validateWidget("PARTNERPORTAL_saldo")) {
      const valSaldo = Helper.getParameter(parameterList, "VALIDAR_SALDO");
      if (!_.isEmpty(valSaldo)) {
        if (valSaldo.value == 1) {
          dispatch(getBalance(wsAttemps.value));
        }
      }
    }
  }, [dispatch, widgetList, parameterList, wsAttemps.value]);

  let reservacionesLink: any = null;
  if (validateWidget("PARTNERPORTAL_reservaciones")) {
    const parameter = Helper.getParameter(parameterList, "LINK_RESERVACIONES");
    reservacionesLink = `${parameter.value}?doc_id=${user.doc_id}&token=${user.token}`;
  }

  let torneosLink: any = null;
  if (validateWidget("PARTNERPORTAL_torneos")) {
    const parameter = Helper.getParameter(parameterList, "LINK_TORNEOS");
    torneosLink = `${parameter.value}?doc_id=${user.doc_id}&token=${user.token}`;
  }

  let reportePagosLink = null;
  if (validateWidget("PARTNERPORTAL_reporte-pagos")) {
    const parameter = Helper.getParameter(parameterList, "LINK_REPORTE_PAGOS");
    reportePagosLink = parameter.value;
  }

  let estadoCuentaLink = null;
  if (validateWidget("PARTNERPORTAL_estado-cuenta")) {
    const parameter = Helper.getParameter(parameterList, "LINK_ESTADO_CUENTA");
    estadoCuentaLink = parameter.value;
  }

  let actualizacionDatosLink = null;
  if (validateWidget("PARTNERPORTAL_actualizacion-datos")) {
    const parameter = Helper.getParameter(
      parameterList,
      "LINK_ACTUALIZACION_DATOS"
    );
    actualizacionDatosLink = parameter.value;
    if (!hiddeMobileWidget("PARTNERPORTAL_actualizacion-datos")) {
      if (match) {
        actualizacionDatosLink = "/dashboard/actualizacion-datos-mobile";
      } else {
        actualizacionDatosLink = "/dashboard/actualizacion-datos-mobile";
      }
    }
  }

  let miAccesoLink = null;
  if (validateWidget("PARTNERPORTAL_mi-acceso")) {
    const parameter = Helper.getParameter(parameterList, "LINK_MI_ACCESO");
    miAccesoLink = parameter.value;
  }

  let tennisLink: any = null;
  if (validateWidget("PARTNERPORTAL_tennis")) {
    const parameter = Helper.getParameter(parameterList, "LINK_TENNIS");
    tennisLink = `${parameter.value}?doc_id=${user.doc_id}&token=${user.token}`;
  }

  let textInfo = null;
  if (validateWidget("PARTNERPORTAL_info")) {
    const parameter = Helper.getParameter(parameterList, "INFO");
    textInfo = parameter.value;
  }

  const renderWidgetGolf = () => {
    const validarSaldo = Helper.getParameter(parameterList, "VALIDAR_SALDO");
    if (!_.isEmpty(validarSaldo)) {
      if (validarSaldo.value == 0) {
        return (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_reservaciones"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={FaGolfBall}
                title="Golf"
                link={reservacionesLink}
              />
            </Paper>
          </Grid>
        );
      }

      if (validarSaldo.value == 1) {
        if (setBalanceLoading) {
          return (
            <Grid
              item
              sm={12}
              xs={12}
              md={3}
              style={{
                order: getOrder("PARTNERPORTAL_reservaciones"),
              }}
            >
              <Loader />
            </Grid>
          );
        }
        if (!_.isEmpty(clientBalance)) {
          return (
            <Grid
              item
              sm={12}
              xs={12}
              md={3}
              style={{
                order: getOrder("PARTNERPORTAL_reservaciones"),
              }}
            >
              <Paper>
                <Widgtet1
                  Icon={FaGolfBall}
                  title="Golf"
                  type="Saldo"
                  amount={clientBalance.saldo_vigencia}
                  statusSaldo={clientBalance.status}
                  link={reservacionesLink}
                  paramText="SHOW_GOLF"
                />
              </Paper>
            </Grid>
          );
        }
      }
    }
  };

  const renderWidgetTennis = () => {
    const validarSaldo = Helper.getParameter(parameterList, "VALIDAR_SALDO");
    if (!_.isEmpty(validarSaldo)) {
      if (validarSaldo.value == 0) {
        return (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_tennis"),
            }}
          >
            <Paper>
              <Widgtet Icon={BiTennisBall} title="Tenis" link={tennisLink} />
            </Paper>
          </Grid>
        );
      }

      if (validarSaldo.value == 1) {
        if (setBalanceLoading) {
          return (
            <Grid
              item
              sm={12}
              xs={12}
              md={3}
              style={{
                order: getOrder("PARTNERPORTAL_tennis"),
              }}
            >
              <Loader />
            </Grid>
          );
        }
        if (!_.isEmpty(clientBalance)) {
          return (
            <Grid
              item
              sm={12}
              xs={12}
              md={3}
              style={{
                order: getOrder("PARTNERPORTAL_tennis"),
              }}
            >
              <Paper>
                <Widgtet1
                  Icon={BiTennisBall}
                  title="Tenis"
                  type="Saldo"
                  amount={clientBalance.saldo_vigencia}
                  statusSaldo={clientBalance.status}
                  link={tennisLink}
                  paramText="SHOW_TENIS"
                />
              </Paper>
            </Grid>
          );
        }
      }
    }
  };

  return (
    <div className="home-container">
      <Grid container spacing={3} className={classes.widgetContainer}>
        {validateWidget("PARTNERPORTAL_info") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={12}
            style={{
              order: getOrder("PARTNERPORTAL_info"),
            }}
          >
            <Paper>
              <Widgtet title={textInfo} />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_saldo") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_saldo"),
            }}
          >
            {setBalanceLoading ? (
              <Loader />
            ) : (
              <Paper>
                <Widgtet
                  Icon={AccountBalanceIcon}
                  title={`Saldo ${
                    parseFloat(clientBalance.saldo) <= 0
                      ? "a Favor "
                      : "Deudor "
                  } ${
                    taxParameter && parseInt(taxParameter.value) > 0
                      ? "+ IGTF "
                      : ""
                  }`}
                  amount={
                    taxParameter && parseInt(taxParameter.value) > 0
                      ? (
                          parseFloat(
                            `${clientBalance.saldo} `.replace(",", "")
                          ) +
                          (parseFloat(
                            `${clientBalance.saldo} `.replace(",", "")
                          ) *
                            parseInt(taxParameter.value)) /
                            100
                        ).toFixed(2)
                      : parseFloat(
                          `${clientBalance.saldo} `.replace(",", "")
                        ).toFixed(2)
                  }
                  statusSaldo={clientBalance.status}
                  type="Saldo"
                />
              </Paper>
            )}
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_actualizacion-datos") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            className={`${
              hiddeMobileWidget("PARTNERPORTAL_actualizacion-datos")
                ? classes.hideMobileWidget
                : ""
            }`}
            style={{
              order: getOrder("PARTNERPORTAL_actualizacion-datos"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={AccountBoxIcon}
                title="Actualizacion de Datos"
                link={actualizacionDatosLink}
                internal
              />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_facturas") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_facturas"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={FaFileInvoiceDollar}
                title="Facturas"
                link="/dashboard/unpaid-invoices"
                internal
              />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_reporte-pagos") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_reporte-pagos"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={FaFileImport}
                title="Notifica tu Pago"
                link={reportePagosLink}
                internal
              />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_pagos-reportados") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_pagos-reportados"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={FaFileAlt}
                title="Pagos Reportados"
                link="/dashboard/reported-payments"
                internal
              />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_reservaciones") && renderWidgetGolf()}

        {validateWidget("PARTNERPORTAL_tennis") && renderWidgetTennis()}

        {validateWidget("PARTNERPORTAL_torneos") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_torneos"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={ScheduleIcon}
                title="Eventos"
                link={torneosLink}
                paramText="SHOW_TOURNAMENT"
              />
            </Paper>
          </Grid>
        )}

        {/* {validateWidget('PARTNERPORTAL_estado-cuenta') &&
          <Grid item sm={12} xs={12} md={3}>
            <Paper>
              <Widgtet
                Icon={AccountBalanceIcon}
                title="Estado de Cuenta"
                link={estadoCuentaLink}
                internal
              />
            </Paper>
          </Grid>
        } */}

        {validateWidget("PARTNERPORTAL_mi-acceso") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_mi-acceso"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={AccessTimeIcon}
                title="Mi QR"
                link={miAccesoLink}
                internal
              />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_applicants") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_applicants"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={AccountBoxIcon}
                title="Aspirantes"
                link="/dashboard/active-applicant"
                internal
              />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_horse") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_horse"),
            }}
          >
            <Paper>
              <Widgtet3 Icon={FaHorseHead} title="Caballeriza" />
            </Paper>
          </Grid>
        )}

        {validateWidget("PARTNERPORTAL_contacto") && (
          <Grid
            item
            sm={12}
            xs={12}
            md={3}
            style={{
              order: getOrder("PARTNERPORTAL_contacto"),
            }}
          >
            <Paper>
              <Widgtet
                Icon={MailRoundedIcon}
                title="Contactenos"
                link="/dashboard/contact"
                internal
              />
            </Paper>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

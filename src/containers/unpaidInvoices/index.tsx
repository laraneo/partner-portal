import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import _ from "lodash";

import {
  getInvoiceDetail,
  getUnpaidInvoices,
} from "../../actions/webServiceActions";
import { updateModal } from "../../actions/modalActions";
import DataTable4 from "../../components/DataTable4";
import UnpaidInvoicesColumns from "../../interfaces/UnpaidInvoicesColumns";
import moment from "moment";
import Paypal from "../../components/Paypal";
import GlobalConnection from "../../components/GlobalConnection";
import Helper from "../../helpers/utilities";
import logo from "../../styles/images/paypal-small-logo.jpeg";
import globalConnectLogo from "../../styles/images/global-connect.jpeg";
import mercantilLogo from "../../styles/images/mercantil-small-logo.jpeg";
import { TableCell, TableRow, Chip, Grid } from "@material-ui/core";

interface InvoiceDetailColumns {
  id: "" | "status" | "fact_num" | "art_des" | "prec_vta" | "prec_vta2";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
  isHandleSubRow?: boolean;
}

function formatNumber(num: any) {
  num = "" + Math.floor(num * 100.0 + 0.5) / 100.0;

  var i = num.indexOf(".");

  if (i < 0) num += ",00";
  else {
    num = num.substring(0, i) + "," + num.substring(i + 1);
    var nDec = num.length - i - 1;
    if (nDec == 0) num += "00";
    else if (nDec == 1) num += "0";
    else if (nDec > 2) num = num.substring(0, i + 3);
  }

  return num;
}

const useStyles = makeStyles(() => ({
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: "18px",
  },
  searchContainer: {
    paddingBottom: "2%",
  },
  tableContainer: {
    marginTop: 20,
  },
  subtitleRow: {
    textAlign: "center",
  },
}));

export default function UnpaidInvoices(props : any) {
  const [isCache, setIsCache] = useState<boolean>(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    parameterReducer: { listData: parameterList },
    loginReducer: { user },
    webServiceReducer: {
      unpaidInvoices,
      setUnpaidInvoicestLoading,
      cache,
      tasa,
      invoiceDetails,
      setInvoiceDetailLoading,
    },
  } = useSelector((state: any) => state);

  const moneda = Helper.getParameter(parameterList, "MONEDA_DEFAULT");

  const paypalParameter = Helper.getParameter(
    parameterList,
    "PAYPAL_CLIENT_ID"
  );
  const habilitarPagoParameter = Helper.getParameter(
    parameterList,
    "HABILITAR_PAGO"
  );
  const linkMercantil = Helper.getParameter(
    parameterList,
    "LINK_PORTAL_MERCANTIL"
  );
  const wsAttemps = Helper.getParameter(parameterList, "WS_INTENTOS");
  const enablePaymentsCache = Helper.checkParameter(
    parameterList,
    "ENABLE_PAYMENTS_CACHE"
  );

  const globalClientId = Helper.getParameter(
    parameterList,
    "GLOBALCONNECT_CLIENT_ID"
  );
  
  const paypalClientId =
    !_.isEmpty(paypalParameter) &&
    parseInt(habilitarPagoParameter.value) === 1 &&
    !_.isEmpty(paypalParameter) &&
    paypalParameter.value !== ""
      ? paypalParameter.value
      : null;

  const handlePayment = (row: any , context: string) => {
    const monto = Number(row.saldo);
    console.log('selected row',row)

    dispatch(
      updateModal({
        payload: {
          status: true,
          element: (
            <>
              {
                context === 'PAYPAL'
                  ? (
                      <Paypal
                        description={row.descrip}
                        invoiceId={row.fact_num}
                        customId={user.username}
                        amountDetail={monto.toFixed(2)}
                        amount={monto.toFixed(2)}
                        client={paypalClientId}
                        attemps={wsAttemps.value}
                      />
                    )
                  : (
                      context === 'GLOBALCONNECTION'
                        ? (
                            <GlobalConnection
                              description={row.descrip}
                              invoiceId={row.fact_num}
                              customId={user.username}
                              amountDetail={monto.toFixed(2)}
                              amount={monto.toFixed(2)}
                              client={paypalClientId}
                              attemps={wsAttemps.value} 
                            />
                          )
                        : null
                    )
                   
              }
            </>
          ),
        },
      })
    );
  };

  const renderPaypalButton = (row: any) => {
    const current = unpaidInvoices.data.find((e: any) => e.fact_num == row);
    if (current && current.originalAmount !== "0") {
      return (
        <div onClick={() => handlePayment(current,'PAYPAL')}>
          <img src={logo} alt="example" style={{ cursor: "pointer" }} />
        </div>
      );
    }
  };

  const renderGlobalConnectButton = (row: any) => {
    const current = unpaidInvoices.data.find((e: any) => e.fact_num == row);
    if (current && current.originalAmount !== "0") {
      return (
        <div onClick={() => handlePayment(current,'GLOBALCONNECTION')} >
          <img
            src={globalConnectLogo}
            alt="example"
            style={{ cursor: "pointer" }}
            width={72}
          />
        </div>
      );
    }
  };

  const renderMercantilButton = () => {
    if (!_.isEmpty(linkMercantil) && linkMercantil.value !== null) {
      return (
        <div
          onClick={() => window.open(linkMercantil.value, "_blank")}
          style={{ marginLeft: 10 }}
        >
          <img
            src={mercantilLogo}
            alt="mercantil"
            style={{ cursor: "pointer" }}
          />
        </div>
      );
    }
    return <div />;
  };

  const getSelectRow = (row: any) => {
    console.log("selectedrow ", row);
    dispatch(getInvoiceDetail(row.fact_num));
    return row.fact_num;
  };

  const columns: UnpaidInvoicesColumns[] = [
    {
      id: "fact_num",
      label: "Nro",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
      isHandleSubRow: true,
    },
    /*{
      id: "fec_emis",
      label: "Emision",
      minWidth: 10,
      component: (value: any) => (
        <span>{moment(value.value).format("DD-MM-YYYY")}</span>
      ),
      isHandleSubRow: true,
    },*/
    {
      id: "fec_venc",
      label: "Vencimiento",
      minWidth: 10,
      component: (value: any) => (
        <span>{moment(value.value).format("DD-MM-YYYY")}</span>
      ),
      isHandleSubRow: true,
    },
    {
      id: "descrip",
      label: "Descripcion",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
      isHandleSubRow: true,
    },
    {
      id: "descrip",
      label: "Moneda",
      minWidth: 10,
      component: (value: any) => <span>{moneda.value}</span>,
      isHandleSubRow: true,
    },
    {
      id: "saldo",
      label: "Saldo",
      minWidth: 10,
      align: "right",
      component: (value: any) => <span>{value.value}</span>,
      isHandleSubRow: true,
    }, //<span>{value.value * tasa.dTasa}</span>,
    {
      id: "saldo",
      label: "Monto Sugerido Bs",
      minWidth: 10,
      align: "right",
      component: (value: any) => {
        if (tasa.dTasa === -1) {
          return <span>N/A</span>;
        }
        if (value.value && tasa.dTasa) {
          const currentTasa = parseFloat(value.value) * tasa.dTasa;
          return (
            <NumberFormat
              thousandSeparator={"."}
              decimalSeparator={","}
              isNumericString
              disabled
              inputMode="none"
              displayType="text"
              value={currentTasa.toFixed(2)}
            />
          );
        }
      },
      isHandleSubRow: true,
    },
    {
      id: "fact_num",
      label: "",
      minWidth: 10,
      align: "right",
      component: (value: any) => {
        if (cache && !enablePaymentsCache) {
          return <div />;
        }
        return (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {paypalClientId && renderPaypalButton(value.value)}
            {renderMercantilButton()}
            {globalClientId &&
              globalClientId.value &&
              renderGlobalConnectButton(value.value)}
          </div>
        );
      },
      isHandleSubRow: true,
    },
  ];

  const getTotalInvoiceDetail = (): any => {
    const list = [...invoiceDetails];
    let total = 0;
    list.forEach((element) => {
      if (element.prec_vta2) {
        console.log(
          "parseFloat(element.prec_vta2); ",
          parseFloat(element.prec_vta2)
        );
        total = total + parseFloat(element.prec_vta2);
      }
    });
    return total;
  };

  const renderSubRows = (row: any, selected: any) => {
    const invoiceDetailColumns: InvoiceDetailColumns[] = [
      {
        id: "",
        label: "Check",
        minWidth: 10,
        align: "left",
        component: () => <span>check</span>,
      },
      {
        id: "art_des",
        label: "Descripción",
        minWidth: 10,
        align: "left",
        component: (value: any) => <span>{value.value}</span>,
      },
      {
        id: "",
        label: "",
        minWidth: 40,
        align: "right",
        component: (value: any) => <span></span>,
      },
      {
        id: "",
        label: "Moneda",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{moneda.value}</span>,
      },
      {
        id: "prec_vta2",
        label: "Total",
        minWidth: 10,
        align: "right",
        component: (value: any) => <span>{value.value}</span>,
      },
    ];
    if (row.fact_num == selected) {
      const totalInvoices = getTotalInvoiceDetail();
      const total = totalInvoices * tasa.dTasa;
      return (
        <TableRow>
          <TableCell colSpan={13}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.subtitleRow}>
                <Chip label="Detalle" color="primary" />
              </Grid>
              <Grid item xs={12}>
                <DataTable4
                  rows={invoiceDetails}
                  columns={invoiceDetailColumns}
                  loading={setInvoiceDetailLoading}
                  fontSize="10px"
                  colorColumn="#109e2f"
                  aditionalColumn={totalInvoices.toFixed(2)}
                  aditionalColumnLabel={
                    invoiceDetails.length > 0 ? "Total " + moneda.value : null
                  }
                  aditionalColumn1={
                    invoiceDetails.length > 0 ? total.toFixed(2) : null
                  }
                  aditionalColumnLabel1={
                    invoiceDetails.length > 0 ? "Total Bs " : null
                  }
                  /*aditionalColumn2={tasa.dTasa ? tasa.dTasa.toFixed(2) : null}
                  aditionalColumnLabel2={"Tasa BCV "}
                  aditionalColumnAlign2={"left"}
                  aditionalColumn3={tasa.dFecha ? moment(tasa.dFecha).format("DD-MM-YYYY") : null}
                  aditionalColumnLabel3={"Fecha"}
                  aditionalColumnAlign3={"left"}*/
                />
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
      );
    }
  };

  useEffect(() => {
    if (cache) {
      setIsCache(true);
    }
  }, [cache, setIsCache]);

  useEffect(() => {
    const globalConnectTransactionToken = new URLSearchParams(props.location.search).get('tk')
    if (globalConnectTransactionToken) {
      const { GBC_PaymentGatewayResult } = $.fn as any
      if (GBC_PaymentGatewayResult) {
        GBC_PaymentGatewayResult.setup.Token = globalConnectTransactionToken
        GBC_PaymentGatewayResult(function (Result : any) {
          let ReferenceCode = Result[0].ReferenceCode;
          let ResultCode = Result[0].ResultCode;
          let TotalAmount = Result[0].TotalAmount;
          let error = Result[0].Error;
          console.log('global result',{
            ReferenceCode,
            ResultCode,
            TotalAmount,
            error
          })
        });
      }
    }
  },[props])

  useEffect(() => {
    if (parameterList.length > 0) {
      dispatch(getUnpaidInvoices(wsAttemps.value));
    }
  }, [dispatch, parameterList, wsAttemps]);
  const totalTasa = unpaidInvoices.total * tasa.dTasa;
  return (
    <div>
      <div className={classes.headerContainer}>
        <div className={classes.headerTitle}>Facturas</div>
      </div>
      <div className={classes.tableContainer}>
        <DataTable4
          rows={unpaidInvoices.data}
          columns={columns}
          loading={setUnpaidInvoicestLoading}
          aditionalColumn={
            unpaidInvoices.total && unpaidInvoices.total > 0
              ? unpaidInvoices.total
              : null
          }
          aditionalColumnLabel={
            unpaidInvoices.total && unpaidInvoices.total > 0
              ? "Saldo Total " + moneda.value
              : null
          }
          aditionalColumn1={
            unpaidInvoices.total && unpaidInvoices.total > 0
              ? totalTasa.toFixed(2)
              : null
          }
          aditionalColumnLabel1={
            unpaidInvoices.total && unpaidInvoices.total > 0
              ? "Saldo Total Bs "
              : null
          }
          aditionalColumn2={tasa.dTasa ? tasa.dTasa.toFixed(2) : null}
          aditionalColumnLabel2={"Tasa BCV "}
          aditionalColumnAlign2={"left"}
          aditionalColumnLabel3={"Fecha "}
          aditionalColumn3={
            tasa.dFecha ? moment(tasa.dFecha).format("DD-MM-YYYY") : null
          }
          aditionalColumnAlign3={"left"}
          renderSubRows={renderSubRows}
          getSelectRow={getSelectRow}
        />
      </div>
    </div>
  );
}

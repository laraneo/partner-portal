import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Button,
  Chip,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import _ from "lodash";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import CustomTextField from "../../components/FormElements/CustomTextField";
import DataTable4 from "../../components/DataTable4";
import moment from "moment";

import {
  getUnpaidInvoicesbyShare,
  getInvoiceDetail,
} from "../../actions/webServiceActions";
import Helper from "../../helpers/utilities";
import snackBarUpdate from "../../actions/snackBarActions";
import CustomSelect from "../../components/FormElements/CustomSelect";
import { search } from "./filter";
import NumberFormat from "react-number-format";

interface Columns {
  id:
    | ""
    | "status"
    | "co_cli"
    | "fact_num"
    | "fec_emis"
    | "fec_venc"
    | "descrip"
    | "total_fac"
    | "tipo"
    | "fec_emis_fact"
    | "co_cli2"
    | "idPago"
    | "acumulado"
    | "saldo"
    | "portal_id"
    | "iStatusDisabled";
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  component?: any;
  isHandleSubRow?: boolean;
}

interface InvoiceDetailColumns {
  id: "" | "status" | "fact_num" | "art_des" | "prec_vta" | "prec_vta2";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
  isHandleSubRow?: boolean;
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  printButtonContainer: {
    textAlign: "left",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  rangleTitle: {
    lineHeight: 3,
    fontWeight: "bold",
  },
  filtersContainer: {
    marginBottom: 10,
  },
  subtitleRow: {
    textAlign: "center",
  },
  personSearchTitle: {
    lineHeight: 4,
  },
}));

type FormData = {
  share: string;
  status: string;
  fact_num: string;
  descrip: string;
};

type queryObject = {
  status?: string;
  fact_num?: string;
  descrip?: string;
};

export default function PendingInvoices() {
  const [filter, setFilter] = useState<Array<string | number>>([]);
  const [total, setTotal] = useState<number>(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    parameterReducer: { listData: parameterList },
    webServiceReducer: {
      unpaidInvoices: list,
      setUnpaidInvoicestLoading: loading,
      tasa,
      invoiceDetails,
      setInvoiceDetailLoading,
    },
  } = useSelector((state: any) => state);

  const moneda = Helper.getParameter(parameterList, "MONEDA_DEFAULT");

  const {
    handleSubmit,
    register,
    errors,
    reset,
    getValues,
    watch,
  } = useForm<FormData>();

  const columns: Columns[] = [
    {
      id: "fec_emis",
      label: "Emision",
      minWidth: 10,
      align: "left",
      component: (value: any) => (
        <span>{moment(value.value).format("DD-MM-YYYY")}</span>
      ),
      isHandleSubRow: true,
    },
    {
      id: "fec_venc",
      label: "Vencimiento",
      minWidth: 10,
      align: "left",
      component: (value: any) => (
        <span>{moment(value.value).format("DD-MM-YYYY")}</span>
      ),
      isHandleSubRow: true,
    },
    {
      id: "fact_num",
      label: "Nro",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value}</span>,
      isHandleSubRow: true,
    },
    {
      id: "descrip",
      label: "Descripcion",
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value}</span>,
      isHandleSubRow: true,
    },
    {
      id: "total_fac",
      label: `Monto (${moneda.value})`,
      minWidth: 10,
      align: "left",
      component: (value: any) => <span>{value.value}</span>,
      isHandleSubRow: true,
    },
    {
      id: "saldo",
      label: "Monto (Bs)",
      minWidth: 10,
      align: "left",
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
      id: "status",
      label: "",
      minWidth: 20,
      align: "left",
      component: (value: any) => {
        let status = "";
        let backgroundColor = "";
        if (value.value == "0") {
          status = "Aprobado";
          backgroundColor = "#2ecc71";
        }
        if (value.value == "1") {
          status = "Pendiente";
          backgroundColor = "#e74c3c";
        }
        return (
          <Chip
            label={status}
            style={{
              backgroundColor,
              color: "white",
              fontWeight: "bold",
              fontSize: "10px",
            }}
            size="small"
          />
        );
      },
      isHandleSubRow: true,
    },
  ];

  const getQuery = (form: FormData) => {
    const query: queryObject = {};

    if (form.status !== "") query.status = form.status;
    if (form.fact_num !== "") query.fact_num = form.fact_num;
    if (form.descrip !== "") query.descrip = form.descrip;

    return query;
  };

  const handleForm = async (form: FormData) => {
    if (form.share !== "") {
      const res: any = await dispatch(getUnpaidInvoicesbyShare(form.share));
      let data = res.data;

      const query = getQuery(form);

      if (!_.isEmpty(query)) {
        data = data.filter(search, query);
      }
      setFilter(data);
      setTotal(res.total);
    } else {
      dispatch(
        snackBarUpdate({
          payload: {
            message: "Introducir N° de accion",
            status: true,
            type: "error",
          },
        })
      );
    }
  };

  const getSelectRow = (row: any) => {
    dispatch(getInvoiceDetail(row.fact_num));
    return row.fact_num;
  };

  const getTotalInvoiceDetail = (): any => {
    const list = [...invoiceDetails];
    let total = {
      amount: 0,
      iva: 0,
    };
    list.forEach((element) => {
      if (element.prec_vta2) {
        total.amount = total.amount + parseFloat(element.prec_vta2);
        total.iva = total.iva + parseFloat(element.IVA);
      }
    });
    return total;
  };

  const renderSubRows = (row: any, selected: any) => {
    const invoiceDetailColumns: InvoiceDetailColumns[] = [
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
      const total = totalInvoices.amount + totalInvoices.iva;
      const totalBs = total * tasa.dTasa;
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
                  aditionalColumn={
                    invoiceDetails.length > 0
                      ? totalInvoices.amount.toFixed(2)
                      : null
                  }
                  aditionalColumnLabel={
                    invoiceDetails.length > 0
                      ? "SubTotal " + moneda.value
                      : null
                  }
                  aditionalColumn1={
                    invoiceDetails.length > 0
                      ? totalInvoices.iva.toFixed(2)
                      : null
                  }
                  aditionalColumnLabel1={
                    invoiceDetails.length > 0 ? "IVA " + moneda.value : null
                  }
                  aditionalColumn2={
                    invoiceDetails.length > 0 ? total.toFixed(2) : null
                  }
                  aditionalColumnLabel2={
                    invoiceDetails.length > 0 ? "Total " + moneda.value : null
                  }
                  aditionalColumn3={
                    invoiceDetails.length > 0 ? (
                      <NumberFormat
                        thousandSeparator={"."}
                        decimalSeparator={","}
                        isNumericString
                        disabled
                        inputMode="none"
                        displayType="text"
                        value={totalBs.toFixed(2)}
                      />
                    ) : null
                  }
                  aditionalColumnLabel3={
                    invoiceDetails.length > 0 ? "Total Bs " : null
                  }
                />
              </Grid>
            </Grid>
          </TableCell>
        </TableRow>
      );
    }
  };

  const share = watch("share");
  const accountStatus = () => {
    window.open(`/#/dashboard/status-account?socio=${share}`, "_blank");
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        Facturas por Socio
      </Grid>

      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <CustomTextField
                placeholder="Accion"
                field="share"
                register={register}
                errorsField={errors.share}
                errorsMessageField={errors.share && errors.share.message}
                Icon={SearchIcon}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelect
                label="Status"
                selectionMessage="Seleccione"
                field="status"
                register={register}
                errorsMessageField={errors.status && errors.status.message}
              >
                <option value={1}> Pendiente </option>
                <option value={0}> Aprobado </option>
              </CustomSelect>
            </Grid>
            <Grid item xs={2}>
              <CustomTextField
                placeholder="Factura"
                field="fact_num"
                register={register}
                errorsField={errors.fact_num}
                errorsMessageField={errors.fact_num && errors.fact_num.message}
                Icon={SearchIcon}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomTextField
                placeholder="Descripcion"
                field="descrip"
                register={register}
                errorsField={errors.descrip}
                errorsMessageField={errors.descrip && errors.descrip.message}
                Icon={SearchIcon}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{ marginTop: 15 }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginTop: 15, marginLeft: 15 }}
                onClick={accountStatus}
                disabled={!share}
              >
                Estado de Cuenta
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item xs={12}>
        <DataTable4
          rows={filter}
          columns={columns}
          loading={loading}
          aditionalColumn={total && total > 0 ? total.toString() : ""}
          aditionalColumnLabel={
            total && total > 0 ? "Saldo Total " + moneda.value : null
          }
          aditionalColumn1={
            total && total > 0 ? (total * tasa.dTasa).toFixed(2) : null
          }
          aditionalColumnLabel1={total && total > 0 ? "Saldo Total Bs " : null}
          aditionalColumn2={tasa.dTasa ? tasa.dTasa.toFixed(2) : null}
          aditionalColumnLabel2={`Tasa BCV (BS)`}
          aditionalColumnAlign2={"left"}
          aditionalColumnLabel3={"Fecha "}
          aditionalColumn3={
            tasa.dFecha ? moment(tasa.dFecha).format("DD-MM-YYYY") : null
          }
          aditionalColumnAlign3={"left"}
          renderSubRows={renderSubRows}
          getSelectRow={getSelectRow}
        />
      </Grid>
    </Grid>
  );
}

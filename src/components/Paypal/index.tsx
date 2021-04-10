import React, { FunctionComponent } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { Grid, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrder,
  getUnpaidInvoices,
  getReportedPayments,
} from "../../actions/webServiceActions";
import { updateModal } from "../../actions/modalActions";
import snackBarUpdate from "../../actions/snackBarActions";
import logo from "../../styles/images/paypal-hires.png";

interface ComponentProps {
  invoiceId: any;
  description: any;
  customId: any;
  amount: any;
  amountDetail: any;
  client: string;
  attemps: number;
}

const Paypal: FunctionComponent<ComponentProps> = ({
  invoiceId,
  description,
  customId,
  amount,
  amountDetail,
  client,
  attemps,
}) => {
  const dispatch = useDispatch();
  const { webServiceReducer: { tasa } } = useSelector((state: any) => state);
  const reference = (+new Date).toString(36);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" width="100%">
          <img src={logo} alt="example" style={{ cursor: "pointer" }} height={50} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <strong>Descripcion:</strong> {description}
          </Grid>
          <Grid item xs={12}>
            <strong>Nro Nota:</strong> {invoiceId}
          </Grid>
          <Grid item xs={12}>
            <strong>Monto:</strong> {amountDetail} USD
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <PayPalButton
          createOrder={(data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description,
                  custom_id: invoiceId,
                  invoice_id: reference,
                  amount: {
                    currency_code: "USD",
                    value: amount,
                  },
                },
              ],
            });
          }}
          onApprove={(data: any, actions: any) => {
            // Capture the funds from the transaction
            dispatch(
              updateModal({
                payload: {
                  isLoader: true,
                },
              })
            );
            return actions.order.capture().then(async (details: any) => {
              const body = {
                order: data.orderID,
                invoices: invoiceId,
                amount,
                channel: 'PAYPAL',
                dTasa: tasa && tasa.dTasa ? tasa.dTasa : -1,
                reference: 'PORTAL-' + reference,
              };
              await dispatch(setOrder(body));
              dispatch(getUnpaidInvoices(attemps));
              dispatch(getReportedPayments());
              dispatch(
                updateModal({
                  payload: {
                    isLoader: false,
                  },
                })
              );
            });
          }}
          options={{
            clientId: client,
          }}
          catchError={(data: any, other: any) => {
            dispatch(
              updateModal({
                payload: {
                  isLoader: false,
                },
              })
            );
            dispatch(
              snackBarUpdate({
                payload: {
                  message: `Su Pago no pudo ser procesado <br> Mensaje de Error de Paypal: ${data}`,
                  status: true,
                  type: "error",
                },
              })
            );
          }}
          onError={(data: any, other: any) => {
            dispatch(
              updateModal({
                payload: {
                  isLoader: false,
                },
              })
            );
            dispatch(
              snackBarUpdate({
                payload: {
                  message: `Su Pago no pudo ser procesado <br> Mensaje de Error de Paypal: ${data}`,
                  status: true,
                  type: "error",
                },
              })
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Paypal;

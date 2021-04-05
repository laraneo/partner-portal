import React, { FunctionComponent } from "react";
import { Grid, Box, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import snackBarUpdate from "../../actions/snackBarActions";
import logo from "../../styles/images/globalconnect-hires.png";

interface ComponentProps {
  invoiceId: any;
  description: any;
  customId: any;
  amount: any;
  amountDetail: any;
  client: string;
  attemps: number;
}

const GlobalConnection: FunctionComponent<ComponentProps> = ({
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

  const handleClick = () => {
    const { GBC_PaymentGateway } = $.fn as any

    if(GBC_PaymentGateway){
      GBC_PaymentGateway.setup.Apikey = client;
      GBC_PaymentGateway.setup.Currency = 'USD';
      GBC_PaymentGateway.setup.Totalamount = `${amountDetail}`;
      GBC_PaymentGateway.setup.Reference = invoiceId;
      GBC_PaymentGateway.setup.Reference2 = '';
      GBC_PaymentGateway.setup.JsonData = JSON.stringify({  });
      GBC_PaymentGateway(function (Result : any) {
        var error = Result[0].Error;
        if(error) { 
          dispatch(
            snackBarUpdate({
              payload: {
                message: `Su Pago no pudo ser procesado <br> Mensaje de Error de Global Connection: ${error}`,
                status: true,
                type: "error",
              },
            })
          );
        }
        else {
          var Url : string = Result[0].Url;
          window.location.replace(Url);
        }
      });
    }

  }

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
        <Button 
          fullWidth
          onClick={handleClick} 
          variant="contained"
          color="primary"
        >
          Pagar
        </Button>
      </Grid>
    </Grid>
  );
};

export default GlobalConnection;

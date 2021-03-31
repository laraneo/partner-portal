import React, { FunctionComponent } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  Button
} from '@material-ui/core'

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
      GBC_PaymentGateway.setup.Apikey = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRpZCI6IjIwOCIsImNsaWVudG5hbWUiOiJqb25hdGhhbi5yYW1pcmV6QG1ha2l0Z3JvdXAuY29tIn0.NoWqzKFwbY-enYv4yLx81u1tMxNtoJ6R3ht2hgG-8SA';
      GBC_PaymentGateway.setup.Currency = 'USD';
      GBC_PaymentGateway.setup.Totalamount = `${amountDetail}`;
      GBC_PaymentGateway.setup.Reference = '123';
      GBC_PaymentGateway.setup.Reference2 = '123';
      GBC_PaymentGateway.setup.JsonData = JSON.stringify({  });
      GBC_PaymentGateway(function (Result : any) {
        var error = Result[0].Error;
  
        var Url : string = Result[0].Url;
        var Token = Result[0].Token;
        console.log('all is ready here',Result);
        window.location.replace(Url);
      });
    }

  }

  return (
    <Grid container spacing={2}>
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

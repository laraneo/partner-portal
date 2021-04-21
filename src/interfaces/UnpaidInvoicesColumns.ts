export default interface Columns {
  id:
    | ""
    | "status"
    | "co_cli"
    | "fact_num"
    | "fec_emis"
    | "fec_venc"
    | "descrip"
    | "coin"
    | "total_fac"
    | "tipo"
    | "fec_emis_fact"
    | "co_cli2"
    | "idPago"
    | "acumulado"
    | "saldo"
    | "saldo_bs"
    | "portal_id"
    | "iStatusDisabled"
    | "payment";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  key?: string;
  component?: any;
  isHandleSubRow?: boolean;
}

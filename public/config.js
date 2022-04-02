// local http://localhost:8000

// dev http://portal.api.com

// QA http://192.168.0.252:9001

// Prod: http://190.216.224.53:9001

var BASE_URL = "https://portal.caracascountryclub.org/portal-api";

var TEMPLATE_INFO = `
<b>Texto de demo a mostrar </b>
<br>
mas informacion<br>
mas informacion<br>
mas informacion<br>
mas informacion<br></br>
`;

// Numero de intentos para la excepcion del enpoint.
var attempts = 5;

// Parametro en el formulario de login
var campoUsuario = "Ejemplo campo usuario";

document.write(
  '<script type="text/javascript" src="https://gatewaypty.gbcpay.net/cdn/test/v1.1/GBCPaymentGateway.min.js"></script>'
);

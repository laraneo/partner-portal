import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import SecureStorage from "../../config/SecureStorage";
import { checkLogin, setupInterceptors } from "../../actions/loginActions";
import MainLoader from "../../components/MainLoading";
// import { setForcedLogin } from "../../actions/loginActions";
// import { getAll as getStatusPersonAll } from "../../actions/statusPersonActions";
// import { getAll as getMaritalStatusAll } from "../../actions/maritalStatusActions";
// import { getAll as getGenderAll } from "../../actions/genderActions";
// import { getAll as getCountries } from "../../actions/countryActions";
// import { getAll as getRelationTypes } from "../../actions/relationTypeActions";
// import { getAll as getPaymentMethods } from "../../actions/paymentMethodActions";
// import { getList as getTransactionTypes } from "../../actions/transactionTypeActions";
// import { getList as getCurrencies } from "../../actions/currencyActions";
// import { getAll as getSports } from "../../actions/sportActions";
// import { getList as getLockerLocationList } from "../../actions/lockerLocationsActions";
// import { getList as getMenuList } from "../../actions/menuActions";
// import { getClient } from "../../actions/personActions";

export default function MainLayout(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    async function run() {
      await dispatch(checkLogin());
      if(location.pathname !== '/') {
        dispatch(setupInterceptors());
      }
    }
    run();
  }, [dispatch]);
  return <div> {props.children} </div>;
}

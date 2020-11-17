import React, { FunctionComponent } from "react";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import "./index.sass";
import Parse from "react-html-parser";
import Helper from "../../helpers/utilities";
import { useSelector, useDispatch } from "react-redux";
import snackBarUpdate from "../../actions/snackBarActions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    avatarContainer: {
      backgroundColor: "#fff",
      width: theme.spacing(7),
      height: theme.spacing(7),
      padding: "0px",
    },
    blue: {
      color: "#2980b9",
    },
    red: {
      color: "#c0392b",
    },
    icon: {
      fontSize: "50px",
    },
  })
);

type FormComponentProps = {
  title?: any;
  subTitle?: string;
  amount?: any;
  statusSaldo?: any;
  Icon?: any;
  type?: string;
  link?: any;
  internal?: boolean;
  paramText?: string;
};

const Widgtet: FunctionComponent<FormComponentProps> = ({
  title,
  subTitle,
  amount,
  Icon,
  type = "",
  link,
  internal,
  paramText,
  statusSaldo,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    parameterReducer: { listData: parameterList },
  } = useSelector((state: any) => state);

  let statusAmount = false;
  if (type === "Saldo" && amount && parseFloat(amount) > 0) statusAmount = true;
  if (type === "Saldo" && amount && parseFloat(amount) <= 0) statusAmount = false;

  const renderTitle = () => {
    if (title === "Golf" || title === "Tenis") {
      return statusAmount ? false : true;
    }
  };

  const handleLink = () => {
    const parameter = Helper.getParameter(parameterList, paramText);
    const appParameter = Helper.getParameter(parameterList, "APP_NA_TEXT");
    if (paramText && appParameter && parameter && parameter.value === "0") {
      dispatch(
        snackBarUpdate({
          payload: {
            message: appParameter.value,
            type: "error",
            status: true,
          },
        })
      );
    } else {
      if (internal) {
        history.push(link);
      } else {
        if (renderTitle()) {
          window.open(link, "_blank");
        } else {
          statusAmount = true;
        }
      }
    }
  };
  return (
    <Card
      className="widget-container__card"
      onClick={() => (link ? handleLink() : {})}
      style={{ cursor: link ? "pointer" : "" }}
    >
      <div
        className={`widget-container__widget ${
          statusAmount ? "widget-container__widget--red" : ""
        }`}
      >
        {Icon && (
          <div className="widget-container__avatar">
            <Avatar
              className={`${classes.avatarContainer} ${
                statusAmount ? classes.red : classes.blue
              }`}
            >
              <Icon className={classes.icon} />
            </Avatar>
          </div>
        )}
        <div className="widget-container__detail">
          <div className="widget-container__detail-title">{Parse(title)}</div>
          {subTitle && (
            <div className="widget-container__detail-title">{subTitle}</div>
          )}
          {!link && (
            <div className="widget-container__detail-amount">{type === 'Saldo' && amount ? amount : ( type === 'Saldo' && !amount ? 'N/A' : '')}</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Widgtet;

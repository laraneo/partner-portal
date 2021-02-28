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
      color: "#109e2f",
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
  Icon?: any;
};

const Widgtet3: FunctionComponent<FormComponentProps> = ({
  title,
  subTitle,
  Icon,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const handleLink = () => {
    dispatch(
      snackBarUpdate({
        payload: {
          message: "Este modulo se encuentra actualmente en construcción.",
          type: "error",
          status: true,
        },
      })
    );
  };
  return (
    <Card
      className="widget-container__card"
      onClick={() => handleLink()}
      style={{ cursor: "pointer" }}
    >
      <div className=" widget-container__widget widget-container__widget--red">
        {Icon && (
          <div className="widget-container__avatar">
            <Avatar className={`${classes.avatarContainer} ${classes.red} `}>
              <Icon className={classes.icon} />
            </Avatar>
          </div>
        )}
        <div className="widget-container__detail">
          <div className="widget-container__detail-title">{Parse(title)}</div>
        </div>
      </div>
    </Card>
  );
};

export default Widgtet3;

import React, { useEffect } from "react";

import moment from "moment";
import { Card, Grid, IconButton } from "@material-ui/core";
import AddAlertIcon from "@material-ui/icons/AddAlert";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { makeStyles, withStyles, Theme, createStyles } from "@material-ui/core/styles";

import { AnyIfEmpty, useDispatch, useSelector } from "react-redux";
import { getActiveApplicants } from "../../actions/applicantsActions";
import { getList as getDepartmentList } from "../../actions/departmentActions";
import { updateModal } from "../../actions/modalActions";
import Helper from "../../helpers/utilities";
import ContactForm from "../../components/ContactForm";
import snackBarUpdate from "../../actions/snackBarActions";

interface IImageViewerProps {
  image: string;
}

function ImageViewer(props: IImageViewerProps) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <LazyLoadImage
          alt="example"
          effect="blur"
          src={props.image} // use normal <img> attributes as props
        />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme: Theme) => createStyles(
  {
    root: {
      overflowX: "auto",
      [theme.breakpoints.up('sm')]: {
        width: "100%",
      },
      [theme.breakpoints.down('sm')]: {
        maxWidth: window.innerWidth - 20,
        width: window.innerWidth - 20,
      },
    },
    container: {
      maxHeight: 440
    },
    progress: {
      display: "flex",
      justifyContent: "left",
      padding: 10
    },
    tableCellHeader: {
      padding: 4,
      '&:first-child': {
        paddingLeft: 5
      },
      '&:last-child': {
        paddingRight: '0px !important'
      }
    },
  }
));

interface ItemProps {
  user: any;
  handleImage: (image: string) => void;
  handleDetail: (user: any) => void;
}

function Item(props: ItemProps): JSX.Element {
  const { user, handleImage, handleDetail } = props;
  return (
    <Grid
      container
      spacing={4}
      style={{
        color: "rgba(0, 0, 0, 0.87)",
        transition: "box-shadow  300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        backgroundColor: "#fff",
        boxShadow:
          "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
        paddingRight: 13,
      }}
    >
      <Grid
        item
        sm={9}
        xs={9}
        md={9}
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <LazyLoadImage
          alt="example"
          effect="blur"
          width={110}
          height={110}
          src={user.picture}
        />
      </Grid>

      <Grid item sm={3} xs={3} md={3}>
        <Grid container spacing={5} justify="center" direction="column">
          <Grid item sm={12} xs={12} md={12}>
            <IconButton
              aria-label="file"
              size="medium"
              color="primary"
              onClick={() => handleImage(user.sArchivo)}
            >
              <AssignmentIcon fontSize="inherit" style={{ fontSize: 20 }} />
            </IconButton>
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            <IconButton
              aria-label="file"
              size="medium"
              color="primary"
              onClick={() => handleDetail(user)}
            >
              <AddAlertIcon fontSize="inherit" style={{ fontSize: 20 }} />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        sm={12}
        xs={12}
        md={12}
        style={{ textAlign: "center", marginTop: -20, fontWeight: "bold" }}
      >
        <Grid container style={{ fontSize: 11 }}>
          <Grid item sm={12} xs={12} md={12}>
            {user.sNombres} {user.sApellidos}
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            CI: {user.sCI}
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            {moment(user.dCreated).format("DD-MM-YYYY")}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default function ActiveApplicants(): JSX.Element {
  const {
    applicantsReducer: { applicantsActiveList },
    departmentReducer: { listData: departmentList },
    parameterReducer: { listData: parameterList },
  } = useSelector((state: any) => state);
  const dispatch = useDispatch();
  const contactIdApplicant = Helper.getParameter(
    parameterList,
    "CONTACTID_APPLICANT"
  );
  console.log("parameterList ", parameterList);
  console.log("departmentList ", departmentList);
  console.log("contactIdApplicant ", contactIdApplicant);
  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(getActiveApplicants());
  }, [dispatch]);

  const handleImage = (image: string) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          headerTitle: "Planilla",
          element: <ImageViewer image={image} />,
        },
      })
    );
  };

  const getDepartment = () =>
    departmentList.find(
      (element: any) => element.id == contactIdApplicant.value
    );

  const renderDetail = (user: any) => {
    const department = getDepartment();
    console.log("department ", department);
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          Subject: Aspirante: {user.sCI} - {user.sNombres} {user.sApellidos}
        </Grid>
        <Grid item xs={12}>
          Departamento: {department.description}{" "}
        </Grid>
      </Grid>
    );
  };

  const handleDetail = (user: any) => {
    if (departmentList.length > 0 && parameterList.length > 0) {
      dispatch(
        updateModal({
          payload: {
            status: true,
            headerTitle: "Contacto",
            element: (
              <ContactForm
                subject={`Aspirante ${user.sCI} - ${user.sNombres} ${user.sApellidos}`}
              />
            ),
          },
        })
      );
    } else {
      dispatch(
        snackBarUpdate({
          payload: {
            message: "Se esta cargando información del sistema espere...",
            status: true,
            type: "info",
          },
        })
      );
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} style={{ fontWeight: "bold" }}>
        Aspirantes Activos
      </Grid>
      <Grid item sm={12} xs={12} md={12}>
        <Grid container spacing={5}>
          {applicantsActiveList.map((element: any, i: number) => (
            <Grid item sm={6} xs={6} md={2} lg={2} >
              <Item
                key={i}
                user={element}
                handleImage={handleImage}
                handleDetail={handleDetail}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

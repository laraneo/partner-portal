import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { green } from "@material-ui/core/colors";
import Switch from "@material-ui/core/Switch";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Button from "@material-ui/core/Button";
import { LazyLoadImage } from "react-lazy-load-image-component";

import {
  getAll,
  remove,
  search,
  update,
} from "../../actions/applicantsActions";
import { updateModal } from "../../actions/modalActions";
import LocationForm from "../../components/LocationForm";
import DataTable4 from "../../components/DataTable4";
import CustomSearch from "../../components/FormElements/CustomSearch";
import {
  CardMedia,
  Chip,
  Grid,
  IconButton,
  withStyles,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import CustomTextField from "../../components/FormElements/CustomTextField";
import CustomSelect from "../../components/FormElements/CustomSelect";
import RangePicker from "../../components/FormElements/RangePicker";
import { useHistory } from "react-router-dom";

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

const GreenSwitch = withStyles({
  switchBase: {
    color: "#e74c3c",
    "&$checked": {
      color: "#27ae60",
    },
    "&$checked + $track": {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

interface Columns {
  id:
    | "id"
    | "sCI"
    | "sNombres"
    | "sApellidos"
    | "sArchivo"
    | "nStatus"
    | "picture"
    | "dCreated";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
}

type FormData = {
  term: string;
  nStatus: string;
  createdStart: string;
  createdEnd: string;
};

export default function Applicants() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector(
    (state: any) => state.applicantsReducer
  );
  const { handleSubmit, register, errors, getValues, watch, reset } = useForm<
    FormData
  >();
  const history = useHistory();

  const handleImage = (image: string) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          headerTitle: 'Planilla',
          element: <ImageViewer image={image} />,
        },
      })
    );
  };

  const handleConditionSwitch = (status: any) => {
    if (status == "0") return false;
    if (status == "1") return true;
  };

  const handleSubRowSwitch = (id: number, status: any) => {
    const nStatus = status === "1" ? 0 : 1;
    console.log("nStatus ", nStatus);
    const data = {
      id,
      nStatus,
    };
    dispatch(update(data));
  };

  const getRow = (id: number) => list.find((element: any) => element.id === id);

  const columns: Columns[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "sCI",
      label: "CI",
      minWidth: 30,
      align: "left",
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "id",
      label: "Nombres y Apellidos",
      minWidth: 30,
      align: "left",
      component: (value: any) => {
        const row = getRow(value.value);
        return (
          <span>
            {row.sNombres} {row.sApellidos}{" "}
          </span>
        );
      },
    },
    {
      id: "sArchivo",
      label: "Planilla",
      minWidth: 30,
      align: "left",
      component: (value: any) => {
        if (value.value) {
          return (
            <IconButton
              aria-label="file"
              size="small"
              color="primary"
              onClick={() => handleImage(value.value)}
            >
              <AssignmentIcon fontSize="inherit" />
            </IconButton>
          );
        }
        return <div />;
      },
    },
    {
      id: "dCreated",
      label: "Fecha Carga",
      minWidth: 30,
      align: "left",
      component: (value: any) => (
        <span>{value.value && moment(value.value).format("YYYY-MM-DD")}</span>
      ),
    },
    {
      id: "id",
      label: "Status",
      minWidth: 10,
      align: "left",
      component: (value: any) => {
        const selected = getRow(value.value);
        let status = "";
        let backgroundColor = "";
        if (selected.nStatus === "1") {
          status = "Activa";
          backgroundColor = "#27ae60";
        } else if (selected.nStatus === "0") {
          status = "Inactiva";
          backgroundColor = "#c0392b";
        } else {
          status = "Inactiva";
          backgroundColor = "#c0392b";
        }
        return (
          <div>
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
            <GreenSwitch
              checked={handleConditionSwitch(selected.nStatus)}
              onChange={() => handleSubRowSwitch(selected.id, selected.nStatus)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    async function fetchData() {
      dispatch(getAll());
    }
    fetchData();
  }, [dispatch]);

  const handleEdit = (id: number) => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <LocationForm id={id} />,
        },
      })
    );
  };

  const handleSearch = async (form: FormData) => {
    dispatch(getAll(form, pagination.currentPage, pagination.perPage));
  };

  const handleDelete = (id: number) => {
    dispatch(remove(id));
  };

  const handleChangePage = (newPage: number) => {
    const form = getValues();
    const page = pagination.currentPage === 1 ? 2 : newPage;
    dispatch(getAll(form, page, pagination.perPage));
  };

  const handlePerPage = (page: number, perPage: number) => {
    const form = getValues();
    dispatch(getAll(form, page, perPage));
  };

  const handleNewApplicant = () => {
    history.push('/dashboard/load-applicant')
  }

  return (
    <Grid container spacing={2}>
      <form
        onSubmit={handleSubmit(handleSearch)}
        noValidate
        style={{
          width: "100%",
        }}
      >
        <Grid item xs={12} style={{ fontWeight: 'bold' }}>
          Listado de Aspirantes
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <CustomTextField
                placeholder="Nombre, Apellido ó Cédula"
                field="term"
                register={register}
                errorsField={errors.term}
                errorsMessageField={errors.term && errors.term.message}
                Icon={SearchIcon}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSelect
                label="Status"
                selectionMessage="Seleccione"
                field="nStatus"
                register={register}
                errorsMessageField={errors.nStatus && errors.nStatus.message}
              >
                <option value={1}> Activo </option>
                <option value={0}> Inactivo </option>
              </CustomSelect>
            </Grid>
            <Grid item xs={4}>
              <RangePicker
                label="Fecha de Carga"
                startField="createdStart"
                endField="createdEnd"
                register={register}
                watch={watch}
                startMsgErr={errors.createdStart && errors.createdStart.message}
                endMsgErr={errors.createdEnd && errors.createdEnd.message}
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                style={{ marginTop: 20 }}
                color="primary"
                type="submit"
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'right', marginBottom: 20 }} >
        <Fab size="small" color="primary" aria-label="add" onClick={handleNewApplicant} >
            <AddIcon />
          </Fab>
        </Grid>
        <Grid item xs={12}>
          <DataTable4
            rows={list}
            pagination={pagination}
            columns={columns}
            isDelete
            handleDelete={handleDelete}
            loading={loading}
            onChangePage={handleChangePage}
            onChangePerPage={handlePerPage}
          />
        </Grid>
      </form>
    </Grid>
  );
}

import React, { useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";

import "./index.sass";
import { getAll, remove, search } from "../../actions/userActions";
import { updateModal } from "../../actions/modalActions";
import UserForm from "../../components/UserForm";
import DataTable4 from "../../components/DataTable4";
import UserColumns from "../../interfaces/UserColumns";
import CustomSearch from "../../components/FormElements/CustomSearch";

export default function User() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state: any) => state.userReducer);

  const getCurrentRow = (id: number) =>  list.find((element: any) => element.id === id);

  const columns: UserColumns[] = [
    {
      id: "id",
      label: "Id",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "username",
      label: "Usuario",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "username_legacy",
      label: "Uusario Alterno",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "name",
      label: "Nombre",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "last_name",
      label: "Apellido",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "email",
      label: "Correo",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "roles",
      label: "Roles",
      minWidth: 10,
      component: (value: any) =>
        value.value.map((element: any) => (
          <Chip label={element.name} color="primary" size="small" />
        )),
    },
    {
      id: "group_id",
      label: "Accion",
      minWidth: 10,
      component: (value: any) => <span>{value.value}</span>,
    },
    {
      id: "is_active",
      label: "Status",
      minWidth: 10,
      component: (value: any) => {
        let status = "";
        let backgroundColor = "";
        if (value.value == "1") {
          status = "SI";
          backgroundColor = "#2980b9";
        } else {
          status = "NO";
          backgroundColor = "#e74c3c";
        }
  
        return (
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
        );
      },
    },
    {
      id: "isPartner",
      label: "Rol",
      minWidth: 10,
      component: (value: any) => {
        let status = "";
        if (value.value == "1") {
          status = "Socio";
        } else if (value.value == "2") {
          status = "Familiar";
        } else {
          status = "Otros";
        }
  
        return (
          <Chip
            label={status}
            style={{
              backgroundColor: "#2980b9",
              color: "white",
              fontWeight: "bold",
              fontSize: "10px",
            }}
            size="small"
          />
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
          element: <UserForm id={id} />,
          customSize: "medium",
        },
      })
    );
  };

  const handleCreate = () => {
    dispatch(
      updateModal({
        payload: {
          status: true,
          element: <UserForm />,
          customSize: "medium",
        },
      })
    );
  };

  const handleDelete = (id: number) => {
    dispatch(remove(id));
  };

  const handleSearch = (event: any) => {
    if (event.value.trim() === "") {
      dispatch(getAll());
    } else {
      dispatch(search(event.value));
    }
  };

  return (
    <div className="gender-container">
      <div className="gender-container__header">
        <div className="gender-container__title">Usuarios</div>
        <div
          className="gender-container__button"
          onClick={() => handleCreate()}
        >
          <Fab size="small" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div className="gender-container__search">
        <CustomSearch handleSearch={handleSearch} />
      </div>
      <div>
        <DataTable4
          rows={list}
          columns={columns}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
          fontSize="11px"
        />
      </div>
    </div>
  );
}

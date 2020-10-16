import API from "../api/Applicants";
import snackBarUpdate from "../actions/snackBarActions";
import { updateModal } from "../actions/modalActions";

export const ACTIONS = {
  GET_ALL: "applicants/get_all",
  GET: "applicants/get",
  GET_LIST: "applicants/get_list",
  GET_APPLICANTS_ACTIVE_LIST: "applicants/get_applicants_active_list",
  SET_LOADING: "applicants/set_loading",
  SET_PAGINATION: "applicants/set_pagination",
};

interface Get {
  type: typeof ACTIONS.GET;
  payload: Array<string | number>;
}

interface GetAll {
  type: typeof ACTIONS.GET_ALL;
  payload: Array<string | number>;
}

interface GetList {
  type: typeof ACTIONS.GET_LIST;
  payload: Array<string | number>;
}

interface SetLoading {
  type: typeof ACTIONS.SET_LOADING;
  payload: boolean;
}

interface SetPagination {
  type: typeof ACTIONS.SET_PAGINATION;
  payload: Array<string | number>;
}

export type ActionTypes = Get | GetAll | SetLoading | SetPagination | GetList;

export const getAll = (
  body: object = {},
  page: number = 1,
  perPage: number = 8
) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true,
  });
  try {
    const {
      data: { data },
      status,
    } = await API.getAll(body, page, perPage);
    let response = [];
    if (status === 200) {
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
        from: data.from,
        to: data.to,
      };
      response = data.data;
      dispatch({
        type: ACTIONS.GET_ALL,
        payload: response,
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination,
      });
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false,
      });
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error",
      },
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
    return error;
  }
};

export const getList = () => async (dispatch: Function) => {
  dispatch(
    updateModal({
      payload: {
        isLoader: true,
      },
    })
  );
  try {
    const {
      data: { data },
      status,
    } = await API.getList();
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_LIST,
        payload: response,
      });
      dispatch(
        updateModal({
          payload: {
            isLoader: false,
          },
        })
      );
    }
    return response;
  } catch (error) {
    dispatch(
      updateModal({
        payload: {
          isLoader: false,
        },
      })
    );
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error",
      },
    })(dispatch);
    return error;
  }
};

export const getActiveApplicants = () => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true,
  });
  try {
    const {
      data: { data },
      status,
    } = await API.getActiveApplicants();
    let response = [];
    if (status === 200) {
      response = data;
      dispatch({
        type: ACTIONS.GET_APPLICANTS_ACTIVE_LIST,
        payload: response,
      });
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false,
      });
      dispatch(
        updateModal({
          payload: {
            isLoader: false,
          },
        })
      );
    }
    return response;
  } catch (error) {
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error",
      },
    })(dispatch);
    return error;
  }
};

export const search = (term: string, perPage: number = 8) => async (
  dispatch: Function
) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true,
  });
  try {
    const {
      data: { data },
      status,
    } = await API.search(term, perPage);
    let response = [];
    if (status === 200) {
      response = data;
      const pagination = {
        total: data.total,
        perPage: data.per_page,
        prevPageUrl: data.prev_page_url,
        currentPage: data.current_page,
        from: data.from,
        to: data.to,
      };
      response = data.data;
      dispatch({
        type: ACTIONS.GET_ALL,
        payload: response,
      });
      dispatch({
        type: ACTIONS.SET_PAGINATION,
        payload: pagination,
      });
    }
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        status: true,
        type: "error",
      },
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
    return error;
  }
};

export const create = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true,
  });
  try {
    const response = await API.create(body);
    const { status } = response;
    let createresponse: any = [];
    if (status === 200 || status === 201) {
      createresponse = response;
      snackBarUpdate({
        payload: {
          message: "Transaction ha sido Registrado!",
          type: "success",
          status: true,
        },
      })(dispatch);
      dispatch(getAll());
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null,
          },
        })
      );
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false,
      });
    }
    return createresponse;
  } catch (error) {
    let message = "General Error";
    if (error && error.response) {
      const {
        data: { message: msg },
      } = error.response;
      message = msg;
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true,
      },
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
    return error;
  }
};

export const get = (id: number) => async (dispatch: Function) => {
  try {
    const {
      data: { data },
      status,
    } = await API.get(id);
    let response = [];
    if (status === 200) {
      response = data;
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        type: "error",
        status: true,
      },
    })(dispatch);
    return error;
  }
};

export const update = (body: object) => async (dispatch: Function) => {
  dispatch({
    type: ACTIONS.SET_LOADING,
    payload: true,
  });
  try {
    const { data, status } = await API.update(body);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status,
      };
      snackBarUpdate({
        payload: {
          message: "Aspirante ha sido Actualizado!",
          type: "success",
          status: true,
        },
      })(dispatch);
      dispatch(
        updateModal({
          payload: {
            status: false,
            element: null,
          },
        })
      );
      dispatch(getAll());
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: false,
      });
    }
    return response;
  } catch (error) {
    let message = "General Error";
    if (error && error.response) {
      const {
        data: { message: msg },
      } = error.response;
      message = msg;
    }
    snackBarUpdate({
      payload: {
        message,
        type: "error",
        status: true,
      },
    })(dispatch);
    dispatch({
      type: ACTIONS.SET_LOADING,
      payload: false,
    });
    return error;
  }
};

export const remove = (id: number) => async (dispatch: Function) => {
  try {
    const { data, status } = await API.remove(id);
    let response: any = [];
    if (status === 200) {
      response = {
        data,
        status,
      };
      snackBarUpdate({
        payload: {
          message: "Aspirante ha sido Elmiminado!",
          type: "success",
          status: true,
        },
      })(dispatch);
      dispatch(getAll());
    }
    return response;
  } catch (error) {
    snackBarUpdate({
      payload: {
        message: error.message,
        type: "error",
        status: true,
      },
    })(dispatch);
    return error;
  }
};

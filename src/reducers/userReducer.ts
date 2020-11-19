import { ACTIONS, ActionTypes } from "../interfaces/actionTypes/userTypes";

type InitialState = {
  list: Array<string | number>;
  pagination: any;
  loading: boolean;
};

const initialState: InitialState = {
  list: [],
  pagination: {
    total: 0,
    perPage: 0,
    prevPageUrl: null,
    currentPage: 0,
  },
  loading: false,
};

const userReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case ACTIONS.GET_ALL:
      return {
        ...state,
        list: action.payload,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;

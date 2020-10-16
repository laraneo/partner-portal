import { ACTIONS, ActionTypes } from "../actions/applicantsActions";

type InitStates = {
  list: Array<string | number>;
  loading: boolean;
  pagination: any;
  listData: any;
  applicantsActiveList: any;
};

const initialState: InitStates = {
  list: [],
  loading: false,
  pagination: {
    total: 0,
    perPage: 0,
    prevPageUrl: null,
    currentPage: 0,
  },
  listData: [],
  applicantsActiveList: [],
};

const applicantsReducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case ACTIONS.GET_ALL:
      return {
        ...state,
        list: action.payload,
      };
    case ACTIONS.GET_LIST:
      return {
        ...state,
        listData: action.payload,
      };
    case ACTIONS.GET_APPLICANTS_ACTIVE_LIST:
      return {
        ...state,
        applicantsActiveList: action.payload,
      };
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default applicantsReducer;

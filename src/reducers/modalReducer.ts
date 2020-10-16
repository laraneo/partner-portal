import { ACTIONS } from '../actions/modalActions';

type ModalInitialState = {
  status: boolean;
  element: any;
  isLoader: boolean;
  customSize: string;
  title: String;
  headerTitle: string;
}


const initialState: ModalInitialState = {
  status: false,
  element: null,
  isLoader: false,
  customSize: '',
  title: '',
  headerTitle: ''
};

const modalReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.STATUS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default modalReducer;
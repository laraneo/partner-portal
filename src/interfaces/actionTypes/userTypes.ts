export const ACTIONS = {
    GET_ALL: 'user/get_all',
    GET: 'user/get',
    SET_LOADING: 'user/set_loading',
    SET_PAGINATION: 'user/set_pagination',
};
  
  interface Get {
    type: typeof ACTIONS.GET
    payload: Array<string|number>
  }
  
  interface GetAll {
    type: typeof ACTIONS.GET_ALL
    payload: Array<string|number>
  }
  
  interface SetLoading {
    type: typeof ACTIONS.SET_LOADING
    payload: boolean
  }

  interface SetPagination {
    type: typeof ACTIONS.SET_PAGINATION
    payload: boolean
  }
  
  
  export type ActionTypes = Get | GetAll | SetLoading | SetPagination
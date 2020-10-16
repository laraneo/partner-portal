import AXIOS from "../config/Axios";
import headers from "../helpers/headers";
import Prefix from "../config/ApiPrefix";

const API = {
  getAll(body: object, data: number, perPage: number) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/applicants`, {
      params: {
        ...body,
        page,
        perPage,
      },
      headers: headers(),
    });
  },
  getList() {
    return AXIOS.get(`${Prefix.api}/applicants-list`, { headers: headers() });
  },
  create(data: any) {
    return AXIOS.post(
      `${Prefix.api}/applicants`,
      {
        ...data,
      },
      { headers: headers() }
    );
  },
  get(id: number) {
    return AXIOS.get(`${Prefix.api}/applicants/${id}`, { headers: headers() });
  },
  update(data: any) {
    return AXIOS.put(
      `${Prefix.api}/applicants/${data.id}`,
      {
        ...data,
      },
      { headers: headers() }
    );
  },
  remove(id: number) {
    return AXIOS.delete(`${Prefix.api}/applicants/${id}`, {
      headers: headers(),
    });
  },
  search(term: string, perPage: number) {
    return AXIOS.get(`${Prefix.api}/applicants-search`, {
      params: {
        term,
        perPage,
      },
      headers: headers(),
    });
  },
  getActiveApplicants() {
    return AXIOS.get(`${Prefix.api}/applicants-active`, { headers: headers() });
  },
};

export default API;

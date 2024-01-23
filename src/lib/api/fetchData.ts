import { API_BASE_URL } from "~/lib/api/urls";

export const fetchData = (path: string) => {
  return fetch(`${API_BASE_URL}${path}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

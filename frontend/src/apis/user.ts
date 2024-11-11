import axios from "axios";

export const loginAction = (id: string, pw: string) => {
  return axios.post<{ msg: string; token: string }>(
    `${import.meta.env.VITE_API_URL}/user/login`,
    {
      id: id,
      pw: pw,
    }
  );
};

export const registerAction = (id: string, pw: string) => {
  return axios.post<{ msg: string }>(`${import.meta.env.VITE_API_URL}/user`, {
    id: id,
    pw: pw,
  });
};

export const deleteAction = (id: string, token: string) => {
  return axios.delete<{ msg: string }>(
    `${import.meta.env.VITE_API_URL}/user/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const checkIdAction = (id: string) => {
  return axios.get<{ msg: string }>(
    `${import.meta.env.VITE_API_URL}/user/id/${id}`
  );
};

export const verifyAction = (token: string) => {
  return axios.get<{ msg: string; id: string }>(
    `${import.meta.env.VITE_API_URL}/user/verify`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

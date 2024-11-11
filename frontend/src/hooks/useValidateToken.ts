import { verifyAction } from "@apis/user";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useValidateToken = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const validate = async () => {
      try {
        const token = getLocalStorage("jwt");
        if (token) {
          const id = await verifyAction(token).then((res) => res.data.id);
          setId(id);
        }
      } catch (err) {
        if (isAxiosError<{ id: ""; msg: string }>(err) && err.response) {
          console.log(err.response.data.msg);
        }
      } finally {
        setIsLoading(false);
      }
    };
    validate();
  }, []);

  return { id, isLoading };
};

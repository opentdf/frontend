import { useEffect } from "react";
import { useFetch } from "./useFetch";
import { entityClient } from "../service";
import { Authorities } from "../types/attributes";
import { Method } from "../types/enums";
import { AttributesFiltersStore } from "../store";

// @ts-ignore
const serverData = window.SERVER_DATA;

export const useAuthorities = () => {
  const [data] = useFetch<Authorities>(entityClient, { method: Method.GET, path: serverData.attributes + `/authorities` });

  useEffect(() => {
    AttributesFiltersStore.update(s => {
      if (data !== undefined) {
        s.possibleAuthorities = data;
        s.authority = { authority: data[0] ? String(data[0]) : '' };
      }
    })
  }, [data]);
};

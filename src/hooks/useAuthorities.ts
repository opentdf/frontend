import { useEffect } from "react";
import { useFetch } from "./useFetch";
import { attributesClient } from "../service";
import { Authorities } from "../types/attributes";
import { Method } from "../types/enums";
import { AttributesFiltersStore } from "../store";

export const useAuthorities = () => {
  const [data] = useFetch<Authorities>(attributesClient, {
    method: Method.GET,
    path: `/authorities`
  });

  useEffect(() => {
    AttributesFiltersStore.update(store => {
      if (data && store) {
        store.possibleAuthorities = data;
        store.authority = store.authority || data[0] || '';
      }
    })
  }, [data]);
};

import { useEffect, useMemo, useState } from "react";
import { useLazyFetch } from "./useFetch";
import { attributesClient } from "../service";
import { Authorities } from "../types/attributes";
import { Method } from "../types/enums";
import { AttributesFiltersStore } from '../store';
import { useKeycloak } from "@react-keycloak/web";

export const useAuthorities = () => {
  const [authorities, setAuthorities] = useState<Authorities>([]);
  const [getAuthorites, { data, loading }] = useLazyFetch<Authorities>(attributesClient);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (data) {
      setAuthorities(data);

      AttributesFiltersStore.update(store => {
        if (data && store) {
          store.possibleAuthorities = data;
          store.authority = store.authority || data[0] || '';
        }
      })
    }
  }, [data]);

  const config = useMemo(() => ({
    method: Method.GET,
    path: '/authorities'
  }), []);

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      getAuthorites(config);
    }
  }, [config, getAuthorites, keycloak, initialized]);

  return {
    authorities,
    getAuthorities: () => getAuthorites(config),
    loading
  };
};

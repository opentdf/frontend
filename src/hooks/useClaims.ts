import {useFetch} from "./useFetch";
import {claimsClient} from "../service";
import {EntitlementsObject} from "../types/claims";
import {Method} from "../types/enums";
import {useEffect, useState} from "react";

export const useClaims = () => {
  const [eo, setEo] = useState<EntitlementsObject>({
    Groups: undefined,
    client_public_signing_key: "",
    entitlements: [],
    entity_id: "",
    tdf_spec_version: ""
  });
  const [data] = useFetch<EntitlementsObject>(claimsClient, {
    method: Method.GET,
    path: `/definitions/groups`
  });
  useEffect(() => {
    if (data) {
      setEo(data);
    }
  }, [data, eo]);
  return eo;
};

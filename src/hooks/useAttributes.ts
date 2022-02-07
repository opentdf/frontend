import { useCallback, useEffect, useState } from 'react';
import { attributesClient } from "../service";
import { Attribute } from "../types/attributes";
import { Method } from "../types/enums";
import { useLazyFetch } from './useFetch';


export const useDefinitionAttributes = (authority: string) => {
  const [attrs, setAttrs] = useState<Attribute[]>([]);
  const [getAttrs, { data, loading }] = useLazyFetch<Attribute[]>(attributesClient);

  const buildConfig = useCallback((authority) => ({
    method: Method.GET,
    path: authority ? `/definitions/attributes?authority=${authority}` : '/definitions/attributes'
  }), []);

  useEffect(() => {
    if (data) {
      setAttrs(data);
    }
  }, [data]);

  useEffect(() => {
    getAttrs(buildConfig(authority));
  }, [authority, buildConfig, getAttrs]);

  return { attrs, getAttrs: (authority: string) => getAttrs(buildConfig(authority)), loading };
};

type AttrFilters = {
  name: string
  order: string
  rule: string
}

export const useAttributesFilters = (authority: string, filters: AttrFilters, sort: string) => {
  const [getAttrs, { data, loading, headers }] = useLazyFetch<Attribute[]>(attributesClient);
  console.log(`Headers: ${headers}`);

  useEffect(() => {
    if (authority) {
      const config = { method: Method.GET, path: `/definitions/attributes`, params: {} };
      config.params = { authority, ...filters, sort }
      getAttrs(config);
    }
    console.log('response: ', data)
  }, [authority, filters, sort, getAttrs]);

  return { attrs: data || [], loading };
};

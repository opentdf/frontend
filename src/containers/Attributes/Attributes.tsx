import { List, Spin } from "antd";
import { useAttributesFilters, useAuthorities } from "../../hooks";
import { AttributesFiltersStore } from "../../store";
import { AttributeListItem } from "../AttributeListItem";
import CreateAttribute from "./CreateAttribute";
import { AttributesHeader } from "./components";
import { useEffect, useCallback } from "react";
import { useKeycloak } from "@react-keycloak/web";

import "./Attributes.css";

const Attributes = () => {
  const { authorities, loading: isLoadingAuthorities, getAuthorities } = useAuthorities();
  const authority = AttributesFiltersStore.useState(s => s.authority);
  const attrsQueryParams = AttributesFiltersStore.useState(s => s.query);
  const collapseValue = AttributesFiltersStore.useState(s => s.collapseValue);
  const { attrs, loading, xTotalCount, fetchAttrs } = useAttributesFilters(authority, attrsQueryParams);
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      fetchAttrs();
    }
  }, [fetchAttrs, keycloak, initialized]);

  const onNamespaceUpdate = useCallback((authority: string): void => {
    AttributesFiltersStore.update(store => {
      if (authority && store) {
        store.possibleAuthorities = [ ...store.possibleAuthorities, authority ];
        store.authority = authority || store.authority || '';
      }
    })
  }, []);

  const onCollapseChange = useCallback((): void => {
    AttributesFiltersStore.update(store => {
      if (store) {
        store.collapseValue = Number(store.collapseValue) ? '0' : '1';
      }
    })
  }, [])

  return (
    <>
      <AttributesHeader total={xTotalCount} />
      { (loading || isLoadingAuthorities)
        ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            height: '300px',
          }}>
            <h1 style={{
              marginBottom: '0',
              marginRight: '15px',
              fontSize: '30px'
            }}>
              loading...
            </h1>
            <Spin size="large" />
          </div>
        )
        : (
          <>
            <List grid={{ gutter: 3, xs: 2, column: 2 }}>
              {attrs.map((attr) => (
                <AttributeListItem
                  activeAuthority={authority}
                  onChange={fetchAttrs}
                  attr={attr}
                  key={attr.name}
                />
              ))}
            </List>
            <CreateAttribute
              authority={authority}
              collapseValue={collapseValue}
              onAddAttr={fetchAttrs}
              onAddNamespace={onNamespaceUpdate}
              onCollapseChange={onCollapseChange}
            />
          </>
        )
      }
    </>
  );
};

Attributes.displayName = 'Attributes';

export default Attributes;

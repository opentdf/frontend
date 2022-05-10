import { memo, useCallback, useMemo } from "react";
import { PageHeader } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import UserStatus from "../UserStatus";

import { ATTRIBUTES, HOME, ENTITLEMENTS } from "../../routes";

import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();

  const routes = useMemo(
    () => [
      {
        breadcrumbName: "Abacus",
        path: HOME,
      },
      {
        breadcrumbName: "Attributes",
        path: ATTRIBUTES,
      },
      {
        breadcrumbName: "Entitlements",
        path: ENTITLEMENTS,
      },
    ],
    [],
  );

  const itemRender = useCallback(
    (route: Route) => (
      <NavLink
        className="nav-link"
        activeClassName="nav-link--active"
        to={route.path}
      >
        {route.breadcrumbName}
      </NavLink>
    ),
    [],
  );

  const pageDescription = useMemo(() => {
    const descriptionMap = new Map([
      [
        "entitlements",
        <p>
          <strong>Entity</strong> — A person, organization, device, or process
          who will access data based on their attributes.
        </p>,
      ],
      [
        "attributes",
        <p>
          <strong>Attribute</strong> — Information attached to data and entities
          that controls which entities can access which data.
        </p>,
      ],
    ]);

    return descriptionMap.get(pathname);
  }, [pathname]);

  const pageTitle = useMemo(() => {
    const titleMap = new Map([
      ["entitlements", "Entitlements"],
      ["attributes", "Attributes"],
    ]);

    return titleMap.get(pathname) || "Abacus";
  }, [pathname]);

  const extra = useMemo(() => [<UserStatus />], []);

  const breadcrumb = useMemo(
    () => ({
      routes,
      itemRender,
    }),
    [itemRender, routes],
  );

  return (
    <PageHeader
      title={pageTitle}
      extra={extra}
      breadcrumb={breadcrumb}
    >
      {pageDescription}
    </PageHeader>
  );
};

Header.displayName = 'Header';

export default memo(Header);

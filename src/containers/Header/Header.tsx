import { memo, useCallback, useMemo } from "react";
import { PageHeader } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import UserStatus from "../UserStatus";
import { ATTRIBUTES, HOME, ENTITLEMENTS, AUTHORITIES } from "../../routes";

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
        breadcrumbName: "Authorities",
        path: AUTHORITIES,
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
        isActive={(match, location): boolean => {
          if (match && match.url) {
            if (match.url === '/' && match.isExact) {
              return true;
            }
            return location.pathname.includes(match.url);
          }
          return false;
        }}
      >
        {route.breadcrumbName}
      </NavLink>
    ),
    [],
  );

  const pageDescription = useMemo(() => {
    const descriptionMap = new Map([
      [
        "/entitlements",
        <p>
          <strong>Entity</strong> — A person, organization, device, or process
          who will access data based on their attributes.
        </p>,
      ],
      [
        "/attributes",
        <p>
          <strong>Attribute</strong> — Information attached to data and entities
          that controls which entities can access which data.
        </p>,
      ],
      [
        "/authorities",
        <p>
          The <strong>Attribute Authority</strong> — is a database that lists all known attributes
          along with people and devices.
          It has no user interface and simply feeds ABACUS with the necessary data it needs to manage access.
        </p>,
      ],
    ]);

    return descriptionMap.get(pathname);
  }, [pathname]);



  const pageTitle = useMemo(() => {
    const titleMap = new Map([
      ["/entitlements", "Entitlements"],
      ["/attributes", "Attributes"],
      ["/authorities", "Authorities"],
    ]);

    return titleMap.get(pathname) || "Abacus";
  }, [pathname]);

  const extra = useMemo(() => (<UserStatus />), []);

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

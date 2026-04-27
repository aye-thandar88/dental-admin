import { Breadcrumb } from 'antd';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const AppBreadcrumb = () => {
   const location = useLocation();

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = [
    {
      title: <Link to="/">Home</Link>,
    },
    ...pathSnippets.map((segment, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

      const title =
        segment.charAt(0).toUpperCase() +
        segment.slice(1).replace("-", " ");

      return {
        key: url,
        title: index === pathSnippets.length - 1 ? (
          title
        ) : (
          <Link to={url}>{title}</Link>
        ),
      };
    }),
  ];

  return <Breadcrumb items={breadcrumbItems} />;
}

export default AppBreadcrumb
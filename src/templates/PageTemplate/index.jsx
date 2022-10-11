import PageHeader from "commons/components/PageHeader";
import PageSidebar from "commons/components/PageSidebar";
import React from "react";
import Style from "./style.module.css";
import { Route } from "react-router-dom";

function PageTemplate(props) {
  const { Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(propsRoute) => {
        return (
          <div>
            <PageHeader />
            <div className={Style.content}>
              <PageSidebar />
              <Component {...propsRoute} />
            </div>
          </div>
        );
      }}
    />
  );
}

export default PageTemplate;

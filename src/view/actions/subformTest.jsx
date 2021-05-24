import React, { Fragment } from "react";
import ExtensionView from "../components/spectrum3ExtensionView";
import render from "../spectrum3Render";
import Subform1 from "../components/subform1";
import SubformDialog from "../components/subformDialog";
import { Heading } from "@adobe/react-spectrum";

const SubformTest = () => {
  return (
    <ExtensionView
      render={() => {
        return (
          <Fragment>
            <Heading>From</Heading>
            <Subform1 name="from" />
            <Heading>To</Heading>
            <Subform1 name="to" />
            <Heading>Dialog</Heading>
            <SubformDialog name="dialog1" />
          </Fragment>
        )
      }}
    />
  )
};

render(SubformTest);

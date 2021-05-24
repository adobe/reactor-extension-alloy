import React, { Fragment } from "react";
import ExtensionView from "../components/spectrum3ExtensionView";
import render from "../spectrum3Render";
import Subform1 from "../components/subform1";
import SubformDialog from "../components/subformDialog";
import { Heading } from "@adobe/react-spectrum";
import {Item, TabList, TabPanels, Tabs} from '@react-spectrum/tabs'


const SubformTest = () => {
  return (
    <ExtensionView
      render={() => {
        return (
          <Fragment>
            <Tabs>
              <TabList>
                <Item key="tabA">Tab A</Item>
                <Item key="tabB">Tab B</Item>
                <Item key="tabC">Tab C</Item>
              </TabList>
              <TabPanels>
                <Item key="tabA">
                  <Subform1 name="tabA" />
                </Item>
                <Item key="tabB">
                  <Subform1 name="tabB" />
                </Item>
                <Item key="tabC">
                  <Subform1 name="tabC" />
                </Item>
              </TabPanels>
            </Tabs>
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

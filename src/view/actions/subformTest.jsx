import React, { Fragment, useRef } from "react";
import { Heading } from "@adobe/react-spectrum";
import { Item, TabList, TabPanels, Tabs } from "@react-spectrum/tabs";
import ExtensionView from "../components/spectrum3ExtensionView";
import render from "../spectrum3Render";
import Subform1 from "../components/subform1";
import SubformDialog from "../components/subformDialog";
import TransientForm from "../components/transientForm";

const SubformTest = () => {
  const tabAMemento = useRef();
  const tabBMemento = useRef();
  const tabCMemento = useRef();

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
                  <TransientForm memento={tabAMemento}>
                    <Subform1 name="tabA" />
                  </TransientForm>
                </Item>
                <Item key="tabB">
                  <TransientForm memento={tabBMemento}>
                    <Subform1 name="tabB" memento={tabBMemento} />
                  </TransientForm>
                </Item>
                <Item key="tabC">
                  <TransientForm memento={tabCMemento}>
                    <Subform1 name="tabC" memento={tabCMemento} />
                  </TransientForm>
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
        );
      }}
    />
  );
};

render(SubformTest);

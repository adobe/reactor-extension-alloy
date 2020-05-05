/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "regenerator-runtime"; // needed for some of react-spectrum
import React from "react";
import Alert from "@react/react-spectrum/Alert";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import { v4 as uuid } from "uuid";
import render from "../render";
import ExtensionView from "../components/extensionView";
import "./eventMergeId.styl";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";

const getInitialValues = ({ initInfo }) => {
  const { cacheId = uuid() } = initInfo.settings || {};

  return {
    cacheId
  };
};

const getSettings = ({ values }) => {
  return values;
};

const EventMergeId = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={() => {
        return (
          <FillParentAndCenterChildren className="u-flexColumn">
            <Alert variant="info" header="Event Merge ID Caching">
              This data element will provide an event merge ID. Regardless of
              what you choose for the data element storage duration in Launch,
              the value of this data element will remain the same until either
              the visitor to your website leaves the current page or the event
              merge ID is reset using the Reset Event Merge ID action.
            </Alert>
            <div className="EventMergeId-description u-gapTop2x">
              No configuration necessary.
            </div>
          </FillParentAndCenterChildren>
        );
      }}
    />
  );
};

render(EventMergeId);

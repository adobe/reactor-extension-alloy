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

import React from "react";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import Alert from "../components/alert";
import render from "../render";
import ExtensionView from "../components/extensionView";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
import Body from "../components/typography/body";
import RequiredComponent from "../components/requiredComponent";

const getInitialValues = ({ initInfo }) => {
  const { cacheId = uuid() } = initInfo.settings || {};

  return {
    cacheId,
  };
};

const getSettings = ({ values }) => {
  return values;
};

const EventMergeId = ({ initInfo }) => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={() => (
        <FillParentAndCenterChildren>
          <RequiredComponent
            initInfo={initInfo}
            requiredComponent="eventMerge"
            title="the event merge ID data element"
          >
            <Alert
              variant="informative"
              title="Event merge ID caching"
              width="size-6000"
            >
              This data element will provide an event merge ID. Regardless of
              what you choose for the data element storage duration in Launch,
              the value of this data element will remain the same until either
              the visitor to your website leaves the current page or the event
              merge ID is reset using the <b>Reset event merge ID</b> action.
            </Alert>
            <Body size="L" marginTop="size-200">
              No configuration necessary.
            </Body>
          </RequiredComponent>
        </FillParentAndCenterChildren>
      )}
    />
  );
};

EventMergeId.propTypes = {
  initInfo: PropTypes.object.isRequired,
};

render(EventMergeId);

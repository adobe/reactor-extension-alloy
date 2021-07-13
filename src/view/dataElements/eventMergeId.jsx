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

import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import Alert from "../components/alert";
import render from "../render";
import ExtensionView from "../components/extensionView";
import ExtensionViewForm from "../components/extensionViewForm";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
import "./eventMergeId.styl";

const getInitialValues = ({ initInfo }) => {
  const { cacheId = uuid() } = initInfo.settings || {};

  return {
    cacheId
  };
};

const getSettings = ({ values }) => {
  return values;
};

const EventMergeId = ({ initInfo, formikProps, registerImperativeFormApi }) => {
  useEffect(() => {
    registerImperativeFormApi({ getSettings });
    formikProps.resetForm({ values: getInitialValues({ initInfo }) });
  }, []);

  // Formik state won't have values on the first render.
  if (!formikProps.values) {
    return null;
  }

  return (
    <FillParentAndCenterChildren>
      <Alert
        variant="informative"
        title="Event Merge ID Caching"
        width="size-6000"
      >
        This data element will provide an event merge ID. Regardless of what you
        choose for the data element storage duration in Launch, the value of
        this data element will remain the same until either the visitor to your
        website leaves the current page or the event merge ID is reset using the
        Reset Event Merge ID action.
      </Alert>
      <div className="EventMergeId-description u-gapTop2x">
        No configuration necessary.
      </div>
    </FillParentAndCenterChildren>
  );
};

EventMergeId.propTypes = {
  initInfo: PropTypes.object,
  formikProps: PropTypes.object,
  registerImperativeFormApi: PropTypes.func
};

const EventMergeIdView = () => {
  return (
    <ExtensionView
      render={() => {
        return (
          <ExtensionViewForm
            render={props => {
              return <EventMergeId {...props} />;
            }}
          />
        );
      }}
    />
  );
};

render(EventMergeIdView);

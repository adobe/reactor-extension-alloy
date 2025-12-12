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

import PropTypes from "prop-types";
import { InlineAlert, Heading, Content } from "@adobe/react-spectrum";
import render from "../render";
import ExtensionView from "../components/extensionView";
import FillParentAndCenterChildren from "../components/fillParentAndCenterChildren";
import Body from "../components/typography/body";
import RequiredComponent from "../components/requiredComponent";

const getInitialValues = ({ initInfo }) => {
  const { cacheId = crypto.randomUUID() } = initInfo.settings || {};

  return {
    cacheId,
  };
};

const getSettings = ({ values }) => {
  return values;
};

const EventMergeId = ({ initInfo }) => {
  const isPreinstalled =
    initInfo?.extensionSettings?.libraryCode?.type === "preinstalled";

  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={() => (
        <FillParentAndCenterChildren>
          {isPreinstalled ? (
            <InlineAlert variant="negative" width="size-6000">
              <Heading>Not available in preinstalled mode</Heading>
              <Content>
                The event merge ID data element is not available when using the
                preinstalled library type. To use this data element, change the
                extension configuration to use the &quot;Managed by Launch&quot;
                library type instead.
              </Content>
            </InlineAlert>
          ) : (
            <RequiredComponent
              initInfo={initInfo}
              requiredComponent="eventMerge"
              title="the event merge ID data element"
            >
              <InlineAlert variant="info" width="size-6000">
                <Heading size="XXS">Event merge ID caching</Heading>
                <Content>
                  This data element will provide an event merge ID. Regardless
                  of what you choose for the data element storage duration in
                  Launch, the value of this data element will remain the same
                  until either the visitor to your website leaves the current
                  page or the event merge ID is reset using the{" "}
                  <b>Reset event merge ID</b> action.
                </Content>
              </InlineAlert>
              <Body size="L" marginTop="size-200">
                No configuration necessary.
              </Body>
            </RequiredComponent>
          )}
        </FillParentAndCenterChildren>
      )}
    />
  );
};

EventMergeId.propTypes = {
  initInfo: PropTypes.object.isRequired,
};

render(EventMergeId);

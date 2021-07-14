/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import { Item } from "@adobe/react-spectrum";
import getInstanceOptions from "../utils/getInstanceOptions";
import { Picker } from "./formikReactSpectrum3";

const InstanceNamePicker = ({ "data-test-id": dataTestId, name, initInfo }) => {
  return (
    <Picker
      data-test-id={dataTestId}
      name={name}
      label="Instance"
      items={getInstanceOptions(initInfo)}
      width="size-5000"
    >
      {item => <Item key={item.value}>{item.label}</Item>}
    </Picker>
  );
};

InstanceNamePicker.propTypes = {
  "data-test-id": PropTypes.string,
  name: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired
};

export default InstanceNamePicker;

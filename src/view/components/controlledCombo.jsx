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
import ComboBox from "@react/react-spectrum/ComboBox";

// Use this component instead of a regular ComboBox to avoid the bug where you have to click
// twice to select an option
export default class ControlledCombo extends React.Component {
  state = {
    showMenu: false
  };

  render() {
    const {
      props,
      state: { showMenu }
    } = this;
    return (
      <ComboBox
        showMenu={showMenu}
        onMenuToggle={menuState => this.setState({ showMenu: menuState })}
        {...props}
      />
    );
  }
}

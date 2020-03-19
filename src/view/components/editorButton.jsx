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
import Button from "@react/react-spectrum/Button";
import Code from "@react/react-spectrum/Icon/Code";
import PropTypes from "prop-types";

/**
 * A button that, when clicked, opens the Launch code editor
 * which allows the user to edit code. When the user
 * closes the editor, this call onChange with the updated
 * code.
 */
class EditorButton extends React.Component {
  onClick = () => {
    const { onChange, value, language } = this.props;

    const options = {
      code: value
    };

    if (language) {
      options.language = language;
    }

    window.extensionBridge.openCodeEditor(options).then(onChange);
  };

  render() {
    const { className, invalid, ...otherProps } = this.props;

    return (
      <Button
        {...otherProps}
        icon={<Code />}
        className={className}
        onClick={this.onClick}
        variant={invalid ? "warning" : "primary"}
      >
        Open Editor
      </Button>
    );
  }
}

EditorButton.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  language: PropTypes.oneOf(["javascript", "html", "css", "json", "plaintext"])
};

export default EditorButton;

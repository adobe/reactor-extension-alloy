/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { TextField } from "@adobe/react-spectrum";
import { string } from "prop-types";
import useSignal from "./useSignal";
import { simpleModel } from "./propTypes";

const Textfield = ({ model, label, description, ...otherProps }) => {
  const [value, setValue] = useSignal(model.signals.value);
  const [, setDirty] = useSignal(model.signals.dirty);
  const [error] = useSignal(model.signals.error);

  return (
    <TextField
      label={label}
      description={description}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      onBlur={() => {
        setDirty(true);
      }}
      validationState={error ? "invalid" : undefined}
      errorMessage={error}
      {...otherProps}
    />
  );
};

Textfield.propTypes = {
  model: simpleModel.isRequired,
  label: string,
  description: string,
};

export default Textfield;

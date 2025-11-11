/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { useField } from "formik";
import { ActionButton } from "@adobe/react-spectrum";


export default function fillButton({ destName, sourceName, label, fieldHasLabel = true }) {
  return {
    Component: ({ namePrefix = "" }) => {
      const [{ value: sourceValue }] = useField(`${namePrefix}${sourceName}`);
      const [, , { setValue: setDestValue }] = useField(`${namePrefix}${destName}`);
      return <ActionButton
        data-test-id={`${namePrefix}${sourceName}-fillButton`}
        onPress={() => {
          setDestValue(sourceValue);
        }}
        marginTop={fieldHasLabel ? "size-300" : undefined}
      >
        {label}
      </ActionButton>
    }
  }
}

/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";

/**
 * A react hook which the callback after a user attempts to
 * submit a formik form (rather than just changes a field value)
 * and validation completes.
 *
 * @param {Function} callback A function to call whenever the user
 * attempts to submit a formik form and validation completes.
 * @param {Object} formikProps Formik props, provided by Formik.
 */
export default callback => {
  const { isValidating, submitCount } = useFormikContext();
  const previousProcessedSubmitCountRef = useRef(0);
  useEffect(() => {
    if (
      submitCount !== previousProcessedSubmitCountRef.current &&
      !isValidating
    ) {
      previousProcessedSubmitCountRef.current = submitCount;
      callback();
    }
  }, [isValidating, submitCount]);
};

/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { string } from "yup";
import renderForm from "../forms/renderForm";
import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import fieldArray from "../forms/fieldArray";
import { validateSurface } from "../utils/surfaceUtils";
import notice from "../forms/notice";

const subscribeContentCardsForm = form({}, [
  notice({
    title: "Subscribe content cards",
    description:
      "This event will trigger the rule whenever there are content cards that have matched. This is a good place to add an action to render the content cards. You can use the data element `%event.items%` to access the content cards. Or within a custom code action it is available as `event.items`.  Convenience methods `rendered`, 'clicked' and 'dismissed' are also available.",
    beta: true
  }),
  instancePicker({ name: "instanceName" }),
  fieldArray({
    name: "surfaces",
    label: "Surfaces",
    singularLabel: "Surface",
    description: "Create an array of surfaces to filter the content cards.",
    dataElementDescription:
      "This data element should resolve to an array of surfaces.",
    validationSchema: string().test(
      "is-surface",
      () => "Please provide a valid surface",
      (value, testContext) => {
        const message = validateSurface(value);
        if (message) {
          return testContext.createError({ message });
        }
        return true;
      }
    )
  })
]);

renderForm(subscribeContentCardsForm);

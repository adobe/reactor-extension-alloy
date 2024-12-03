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

import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { createTestIdSelector, createTestIdSelectorString } from '../dom/selectors';

const user = userEvent.setup();

export default {
  breadcrumb: {
    item(label) {
      const nodeEdit = screen.getByTestId('nodeEdit');
      const breadcrumb = within(nodeEdit).getByTestId('breadcrumb');
      const links = within(breadcrumb).getAllByRole('link');
      const link = links.find(l => l.textContent === label);

      return {
        async click() {
          if (link) {
            await user.click(link);
          }
        }
      };
    }
  },

  heading: {
    async expectText(text) {
      const heading = screen.getByTestId('heading');
      expect(heading).toHaveTextContent(text);
    }
  }
}; 
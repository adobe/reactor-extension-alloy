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

const user = userEvent.setup();

const create = (node) => {
  const populationIndicator = within(node).queryByTestId('populationAmountIndicator');
  const expansionToggle = node.closest('.ant-tree-treenode')?.querySelector('.ant-tree-switcher');

  return {
    async click() {
      await user.click(node);
    },

    async toggleExpansion() {
      if (expansionToggle) {
        await user.click(expansionToggle);
        // wait for animation to finish
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    },

    async expectInViewport() {
      const observer = new IntersectionObserver(
        (entries) => {
          expect(entries[0].isIntersecting).toBe(true);
          observer.disconnect();
        },
        { threshold: 1.0 }
      );
      observer.observe(node);
    },

    populationIndicator: {
      async expectFull() {
        expect(populationIndicator).toHaveClass('is-full');
      },

      async expectPartial() {
        expect(populationIndicator).toHaveClass('is-partial');
      },

      async expectEmpty() {
        expect(populationIndicator).toHaveClass('is-empty');
      },

      async expectBlank() {
        expect(populationIndicator).toBeNull();
      }
    },

    async expectIsValid() {
      expect(node).not.toHaveClass('is-invalid');
    },

    async expectIsNotValid() {
      expect(node).toHaveClass('is-invalid');
    },

    async expectExists() {
      expect(node).toBeTruthy();
    },

    async expectNotExists() {
      expect(node).toBeFalsy();
    },

    async expectTitleEquals(title) {
      const titleElement = within(node).getByTestId('xdmTreeNodeTitleDisplayName');
      expect(titleElement).toHaveTextContent(title);
    },

    next() {
      const nextNode = node
        .closest('.ant-tree-treenode')
        ?.nextElementSibling
        ?.querySelector('[data-test-id="xdmTreeNodeTitle"]');
      return nextNode ? create(nextNode) : null;
    }
  };
};

export default {
  node(title) {
    const titleElements = screen.queryAllByTestId('xdmTreeNodeTitleDisplayName');
    const titleElement = titleElements.find(el => el.textContent.includes(title));
    if (!titleElement) return null;
    
    const node = titleElement.closest('[data-test-id="xdmTreeNodeTitle"]');
    return create(node);
  }
}; 
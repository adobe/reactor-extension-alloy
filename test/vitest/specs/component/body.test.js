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

import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Body from '../../../../src/view/components/typography/body';

const scenarios = [
  {
    props: {
      size: 'XXXL',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeXXXL'],
    },
  },
  {
    props: {
      size: 'XXL',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeXXL'],
    },
  },
  {
    props: {
      size: 'XL',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeXL'],
    },
  },
  {
    props: {
      size: 'L',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeL'],
    },
  },
  {
    props: {
      size: 'M',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeM'],
    },
  },
  {
    props: {
      size: 'S',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeS'],
    },
  },
  {
    props: {
      size: 'XS',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeXS'],
    },
  },
  {
    props: {
      size: 'XXS',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeXXS'],
    },
  },
  {
    props: {
      isSerif: true,
    },
    assertions: {
      classNames: ['spectrum-Body--sizeS', 'spectrum-Body--serif'],
    },
  },
  {
    props: {
      marginTop: 'size-300',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeS'],
      style: 'margin-top: var(--spectrum-global-dimension-size-300, var(--spectrum-alias-size-300);',
    },
  },
  {
    props: {
      marginBottom: 'size-300',
    },
    assertions: {
      classNames: ['spectrum-Body--sizeS'],
      style: 'margin-bottom: var(--spectrum-global-dimension-size-300, var(--spectrum-alias-size-300);',
    },
  },
  {
    props: {},
    assertions: {
      classNames: ['spectrum-Body--sizeS'],
    },
  },
];

describe('Body Component', () => {
  scenarios.forEach(({ props, assertions }) => {
    test(`renders with props: ${JSON.stringify(props)}`, () => {
      render(<Body {...props}>Test Body</Body>);

      const body = screen.getByText('Test Body');
      expect(body.tagName.toLowerCase()).toBe('p');
      
      // Check classes
      const expectedClasses = ['spectrum-Body', ...assertions.classNames];
      expectedClasses.forEach(className => {
        expect(body).toHaveClass(className);
      });

      // Check style if specified
      if (assertions.style) {
        expect(body).toHaveStyle(assertions.style);
      } else {
        expect(body).not.toHaveAttribute('style');
      }
    });
  });
}); 
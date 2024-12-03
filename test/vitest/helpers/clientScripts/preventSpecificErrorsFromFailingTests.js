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

import { beforeAll, afterAll } from 'vitest';

/**
 * Error handler configuration for specific error types that should not fail tests
 */
const errorHandlers = {
  UserReportableError: (error) => {
    console.error(error);
    return true; // prevent test failure
  },

  ResizeObserverError: (message) => {
    return message === 'ResizeObserver loop limit exceeded' ||
           message === 'ResizeObserver loop completed with undelivered notifications.';
  },

  SafariScriptError: (message) => {
    // Safari specific handling for ResizeObserver errors
    return message === 'Script error.';
  }
};

/**
 * Sets up error handling for specific error types that should not fail tests.
 * This is particularly useful for:
 * 1. UserReportableErrors that are displayed in error boundaries
 * 2. ResizeObserver errors from React-Spectrum
 * 3. Safari-specific script errors
 */
export const setupErrorHandling = () => {
  const errorListener = (event) => {
    const { error, message } = event;

    // Handle UserReportableError
    if (error?.name === 'UserReportableError' && errorHandlers.UserReportableError(error)) {
      event.preventDefault();
      return;
    }

    // Handle ResizeObserver errors
    if (errorHandlers.ResizeObserverError(message)) {
      event.preventDefault();
      return;
    }

    // Handle Safari script errors
    if (errorHandlers.SafariScriptError(message)) {
      event.stopImmediatePropagation();
      return;
    }
  };

  beforeAll(() => {
    window.addEventListener('error', errorListener);
  });

  afterAll(() => {
    window.removeEventListener('error', errorListener);
  });
};

/**
 * Creates a UserReportableError for testing error boundaries
 * @param {string} message - The error message
 * @returns {Error} A UserReportableError
 */
export const createUserReportableError = (message) => {
  const error = new Error(message);
  error.name = 'UserReportableError';
  return error;
};

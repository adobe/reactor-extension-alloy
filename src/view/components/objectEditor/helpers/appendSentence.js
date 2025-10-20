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

/**
 * Appends a sentence to the end of a string so that the result is grammatically correct.
 * @param {string} text - The original string.
 * @param {string} sentence - The sentence to append.
 * @returns {string} The full string.
 */

const appendSentence = (text, sentence) => {
  let newText = text ? text.trim() : "";
  if (newText !== "") {
    if (!/[.!?]$/.test(newText)) {
      newText += ".";
    }
    newText += " ";
  }
  newText += sentence;
  return newText;
};

export default appendSentence;

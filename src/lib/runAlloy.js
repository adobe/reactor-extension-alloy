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

module.exports = instanceNames => {
  /////////////////////////////
  // BASE CODE
  /////////////////////////////
  !(function(n, o) {
    o.forEach(function(o) {
      n[o] ||
        ((n.__alloyNS = n.__alloyNS || []).push(o),
        (n[o] = function() {
          var u = arguments;
          return new Promise(function(i, l) {
            n[o].q.push([i, l, u]);
          });
        }),
        (n[o].q = []));
    });
  })(window, instanceNames);

  /////////////////////////////
  // LIBRARY CODE
  /////////////////////////////
  /**
   * Copyright 2019 Adobe. All rights reserved.
   * This file is licensed to you under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License. You may obtain a copy
   * of the License at http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
   * OF ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   */

  /**
   * Copyright 2019 Adobe. All rights reserved.
   * This file is licensed to you under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License. You may obtain a copy
   * of the License at http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under
   * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
   * OF ANY KIND, either express or implied. See the License for the specific language
   * governing permissions and limitations under the License.
   */

  ("use strict");

  if (document.documentMode && document.documentMode < 11) {
    console.warn(
      "The Adobe Experience Cloud Web SDK does not support IE 10 and below."
    );
  } else {
    (function() {
      function _interopDefault(ex) {
        return ex && typeof ex === "object" && "default" in ex
          ? ex["default"]
          : ex;
      }

      var assign = _interopDefault(require("@adobe/reactor-object-assign"));
      var cookie = _interopDefault(require("@adobe/reactor-cookie"));
      var queryString = _interopDefault(require("@adobe/reactor-query-string"));
      var loadScript = _interopDefault(require("@adobe/reactor-load-script"));

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

      /**
       * Clones a value by serializing then deserializing the value.
       * @param {*} value
       * @returns {any}
       */
      var clone = function(value) {
        return JSON.parse(JSON.stringify(value));
      };

      var convertBufferToHex = function(buffer) {
        return Array.prototype.map
          .call(new Uint8Array(buffer), function(item) {
            return ("00" + item.toString(16)).slice(-2);
          })
          .join("");
      };

      var encodeText = function encodeText(str) {
        if (window.TextEncoder) {
          return new TextEncoder("utf-8").encode(str);
        } // IE 11, which doesn't have TextEncoder

        var cleanString = unescape(encodeURIComponent(str));
        return new Uint8Array(
          cleanString.split("").map(function(char) {
            return char.charCodeAt(0);
          })
        );
      };

      var convertStringToSha256Buffer = function(message) {
        var data = encodeText(message);
        var crypto = window.msCrypto || window.crypto;
        var result = crypto.subtle.digest("SHA-256", data);

        if (result.then) {
          return result;
        } // IE 11, whose result is a CryptoOperation object instead of a promise

        return new Promise(function(resolve, reject) {
          result.addEventListener("complete", function() {
            resolve(result.result);
          });
          result.addEventListener("error", function() {
            reject();
          });
        });
      };

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
      var MILLISECOND = 1;
      var SECOND = MILLISECOND * 1000;
      var MINUTE = SECOND * 60;
      var HOUR = MINUTE * 60;
      var DAY = HOUR * 24;
      var convertTimes = function(fromUnit, toUnit, amount) {
        return (fromUnit * amount) / toUnit;
      };

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

      /**
       * Returns true whether the value is null or undefined.
       * @param {*} value
       * @returns {boolean}
       */
      var isNil = function(value) {
        return value == null;
      };

      function _typeof(obj) {
        if (
          typeof Symbol === "function" &&
          typeof Symbol.iterator === "symbol"
        ) {
          _typeof = function(obj) {
            return typeof obj;
          };
        } else {
          _typeof = function(obj) {
            return obj &&
              typeof Symbol === "function" &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          };
        }

        return _typeof(obj);
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);

          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(
              Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              })
            );
          }

          ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        }

        return target;
      }

      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;

        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }

        return target;
      }

      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = _objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
              continue;
            target[key] = source[key];
          }
        }

        return target;
      }

      function _slicedToArray(arr, i) {
        return (
          _arrayWithHoles(arr) ||
          _iterableToArrayLimit(arr, i) ||
          _nonIterableRest()
        );
      }

      function _toConsumableArray(arr) {
        return (
          _arrayWithoutHoles(arr) ||
          _iterableToArray(arr) ||
          _nonIterableSpread()
        );
      }

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];

          return arr2;
        }
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }

      function _iterableToArray(iter) {
        if (
          Symbol.iterator in Object(iter) ||
          Object.prototype.toString.call(iter) === "[object Arguments]"
        )
          return Array.from(iter);
      }

      function _iterableToArrayLimit(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (
            var _i = arr[Symbol.iterator](), _s;
            !(_n = (_s = _i.next()).done);
            _n = true
          ) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
      }

      function _nonIterableRest() {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance"
        );
      }

      /**
       * Returns whether the value is an object.
       * @param {*} value
       * @returns {boolean}
       */

      var isObject = function(value) {
        return (
          !isNil(value) && !Array.isArray(value) && _typeof(value) === "object"
        );
      };

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

      var deepAssignObject = function deepAssignObject(target, source) {
        Object.keys(source).forEach(function(key) {
          if (isObject(target[key]) && isObject(source[key])) {
            deepAssignObject(target[key], source[key]);
            return;
          }

          target[key] = source[key];
        });
      };
      /**
       * Recursively copy the values of all enumerable own properties from a source item to a target item if the both items are objects
       * @param {Object} target - a target object
       * @param {...Object} source - an array of source objects
       * @example
       * deepAssign({ a: 'a', b: 'b' }, { b: 'B', c: 'c' });
       * // { a: 'a', b: 'B', c: 'c' }
       */

      var deepAssign = function(target) {
        if (isNil(target)) {
          throw new TypeError(
            'deepAssign "target" cannot be null or undefined'
          );
        }

        var result = Object(target);

        for (
          var _len = arguments.length,
            sources = new Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          sources[_key - 1] = arguments[_key];
        }

        sources.forEach(function(source) {
          return deepAssignObject(result, Object(source));
        });
        return result;
      };

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
      /**
       * Creates a function that, when passed an object of updates, will merge
       * the updates onto the current value of a payload property.
       * @param content
       * @param key
       * @returns {Function}
       */

      var createMerger = function(content, key) {
        return function(updates) {
          // eslint-disable-next-line no-param-reassign
          content[key] = content[key] || {};
          deepAssign(content[key], updates);
        };
      };

      /* eslint-disable */

      /*
crc32 · JavaScript Function to Calculate CRC32 of a String
Description
  Below is a JavaScript function to calculate CRC32 of a string.
  The string can be either ASCII or Unicode.
  Unicode strings will be encoded in UTF-8.
  The polynomial used in calculation is 0xedb88320.
  This polynomial is used in Ethernet, Gzip, PNG, SATA and many other technologies.
*/
      var crc32 = (function() {
        var table = [];

        for (var i = 0; i < 256; i++) {
          var c = i;

          for (var j = 0; j < 8; j++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
          }

          table.push(c);
        }

        return function(str, crc) {
          str = unescape(encodeURIComponent(str));
          if (!crc) crc = 0;
          crc = crc ^ -1;

          for (var _i = 0; _i < str.length; _i++) {
            var y = (crc ^ str.charCodeAt(_i)) & 0xff;
            crc = (crc >>> 8) ^ table[y];
          }

          crc = crc ^ -1;
          return crc >>> 0;
        };
      })();

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

      /**
       * A simple utility for managing a promise's state outside of
       * the promise's "executor" (the function passed into the constructor).
       */
      var defer = function() {
        var deferred = {};
        deferred.promise = new Promise(function(resolve, reject) {
          deferred.resolve = resolve;
          deferred.reject = reject;
        });
        return deferred;
      };

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

      /**
       * Executes a function that returns promise. If the promise is rejected, the
       * function will executed again. This will process continue until a promise
       * returned from the function successfully resolves or the maximum number
       * of retries has been reached.
       * @param {Function} fn A function which returns a promise.
       * @param {number} [maxRetries=3] The max number of retries.
       */
      var executeWithRetry = function(fn) {
        var maxRetries =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
        var retryCount = 0;

        var execute = function execute() {
          return fn().catch(function(e) {
            if (retryCount < maxRetries) {
              retryCount += 1;
              return execute();
            }

            throw e;
          });
        };

        return execute();
      };

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

      /**
       * Returns the first item in the array that satisfies the provided testing funciton.
       * @param {Array} arr The array to search.
       * @param {Function} predicate Function that will be called for each item. Arguments
       * will be the item, the item index, then the array itself.
       * @returns {*}
       */
      var find = function(arr, predicate) {
        for (var i = 0; i < arr.length; i += 1) {
          var item = arr[i];

          if (predicate(item, i, arr)) {
            return item;
          }
        }

        return undefined;
      };

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
      var appendNode = function(parent, node) {
        return parent.appendChild(node);
      };

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
      var createNode = function(tag) {
        var attrs =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};
        var props =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};
        var children =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : [];
        var doc =
          arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : document;
        var result = doc.createElement(tag);
        Object.keys(attrs).forEach(function(key) {
          result.setAttribute(key, attrs[key]);
        });
        Object.keys(props).forEach(function(key) {
          result[key] = props[key];
        });
        children.forEach(function(child) {
          return appendNode(result, child);
        });
        return result;
      };

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
      var BODY = "BODY";
      var IFRAME = "IFRAME";
      var IMG = "IMG";
      var DIV = "DIV";
      var STYLE = "STYLE";
      var SCRIPT = "SCRIPT";
      var SRC = "src";

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
      /**
       * Fires an image pixel from the current document's window.
       * @param {object} currentDocument
       * @param {string} src
       * @returns {Promise}
       */

      var fireImage = function(_ref) {
        var src = _ref.src,
          _ref$currentDocument = _ref.currentDocument,
          currentDocument =
            _ref$currentDocument === void 0 ? document : _ref$currentDocument;
        return new Promise(function(resolve, reject) {
          var attrs = {
            src: src
          };
          var props = {
            onload: resolve,
            onerror: reject,
            onabort: reject
          };
          createNode(IMG, attrs, props, [], currentDocument);
        });
      };

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
      var toArray = function(value) {
        return value == null ? [] : [].slice.call(value);
      };

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
      /**
       * Returns an array of matched DOM nodes.
       * @param {String} selector
       * @param {Node} [context=document] defaults to document
       * @returns {Array} an array of DOM nodes
       */

      var selectNodes = function(selector) {
        var context =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : document;
        return toArray(context.querySelectorAll(selector));
      };

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

      /**
       * Returns whether the value is a function.
       * @param {*} value
       * @returns {boolean}
       */
      var isFunction = function(value) {
        return typeof value === "function";
      };

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

      /**
       * Returns whether the value is a non-empty array.
       * @param {*} value
       * @returns {boolean}
       */
      var isNonEmptyArray = function(value) {
        return Array.isArray(value) && value.length > 0;
      };

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
      var MUTATION_OBSERVER = "MutationObserver";
      var RAF = "requestAnimationFrame";
      var MUTATION_OBSERVER_CONFIG = {
        childList: true,
        subtree: true
      };
      var VISIBILITY_STATE = "visibilityState";
      var VISIBLE = "visible";
      var DELAY = 100;
      var MAX_POLLING_TIMEOUT = 5000;

      var createError = function createError(selector) {
        return new Error("Could not find: " + selector);
      };

      var createPromise = function createPromise(executor) {
        return new Promise(executor);
      };

      var canUseMutationObserver = function canUseMutationObserver(win) {
        return isFunction(win[MUTATION_OBSERVER]);
      };
      var awaitUsingMutationObserver = function awaitUsingMutationObserver(
        win,
        doc,
        selector,
        timeout,
        selectFunc
      ) {
        return createPromise(function(resolve, reject) {
          var mutationObserver = new win[MUTATION_OBSERVER](function() {
            var nodes = selectFunc(selector);

            if (isNonEmptyArray(nodes)) {
              mutationObserver.disconnect();
              resolve(nodes);
            }
          });
          setTimeout(function() {
            mutationObserver.disconnect();
            reject(createError(selector));
          }, timeout);
          mutationObserver.observe(doc, MUTATION_OBSERVER_CONFIG);
        });
      };
      var canUseRequestAnimationFrame = function canUseRequestAnimationFrame(
        doc
      ) {
        return doc[VISIBILITY_STATE] === VISIBLE;
      };
      var awaitUsingRequestAnimation = function awaitUsingRequestAnimation(
        win,
        selector,
        timeout,
        selectFunc
      ) {
        return createPromise(function(resolve, reject) {
          var execute = function execute() {
            var nodes = selectFunc(selector);

            if (isNonEmptyArray(nodes)) {
              resolve(nodes);
              return;
            }

            win[RAF](execute);
          };

          execute();
          setTimeout(function() {
            reject(createError(selector));
          }, timeout);
        });
      };
      var awaitUsingTimer = function awaitUsingTimer(
        selector,
        timeout,
        selectFunc
      ) {
        return createPromise(function(resolve, reject) {
          var execute = function execute() {
            var nodes = selectFunc(selector);

            if (isNonEmptyArray(nodes)) {
              resolve(nodes);
              return;
            }

            setTimeout(execute, DELAY);
          };

          execute();
          setTimeout(function() {
            reject(createError(selector));
          }, timeout);
        });
      };
      var awaitSelector = function(selector) {
        var selectFunc =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : selectNodes;
        var timeout =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : MAX_POLLING_TIMEOUT;
        var win =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : window;
        var doc =
          arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : document;
        var nodes = selectFunc(selector);

        if (isNonEmptyArray(nodes)) {
          return Promise.resolve(nodes);
        }

        if (canUseMutationObserver(win)) {
          return awaitUsingMutationObserver(
            win,
            doc,
            selector,
            timeout,
            selectFunc
          );
        }

        if (canUseRequestAnimationFrame(doc)) {
          return awaitUsingRequestAnimation(win, selector, timeout, selectFunc);
        }

        return awaitUsingTimer(selector, timeout, selectFunc);
      };

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
      var removeNode = function(node) {
        var parent = node.parentNode;

        if (parent) {
          return parent.removeChild(node);
        }

        return null;
      };

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

      var fireOnPage = fireImage;
      var IFRAME_ATTRS = {
        name: "Adobe Destinationing iFrame",
        class: "adobe-iframe",
        style: "display: none; width: 0; height: 0;"
      };

      var createFilterResultBySucceeded = function createFilterResultBySucceeded(
        succeeded
      ) {
        return function(result) {
          return result.succeeded === succeeded;
        };
      };

      var mapResultToDest = function mapResultToDest(result) {
        return result.dest;
      };

      var fireDestinations = function(_ref) {
        var logger = _ref.logger,
          destinations = _ref.destinations;
        var iframePromise;

        var createIframe = function createIframe() {
          if (!iframePromise) {
            iframePromise = awaitSelector(BODY).then(function(_ref2) {
              var _ref3 = _slicedToArray(_ref2, 1),
                body = _ref3[0];

              var iframe = createNode(IFRAME, IFRAME_ATTRS);
              return appendNode(body, iframe);
            });
          }

          return iframePromise;
        };

        var fireInIframe = function fireInIframe(_ref4) {
          var src = _ref4.src;
          return createIframe().then(function(iframe) {
            var currentDocument = iframe.contentWindow.document;
            return fireImage({
              src: src,
              currentDocument: currentDocument
            });
          });
        };

        return Promise.all(
          destinations.map(function(dest) {
            var imagePromise = dest.hideReferrer
              ? fireInIframe({
                  src: dest.url
                })
              : fireOnPage({
                  src: dest.url
                });
            return imagePromise
              .then(function() {
                logger.log("Destination succeeded:", dest.url);
                return {
                  succeeded: true,
                  dest: dest
                };
              })
              .catch(function() {
                logger.log("Destination failed:", dest.url);
                return {
                  succeeded: false,
                  dest: dest
                };
              });
          })
        ).then(function(results) {
          if (iframePromise) {
            iframePromise.then(function(iframe) {
              return removeNode(iframe);
            });
          }

          return {
            succeeded: results
              .filter(createFilterResultBySucceeded(true))
              .map(mapResultToDest),
            failed: results
              .filter(createFilterResultBySucceeded(false))
              .map(mapResultToDest)
          };
        });
      };

      var flatMap = function(array, mapFunction) {
        return Array.prototype.concat.apply([], array.map(mapFunction));
      };

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

      /**
       * Returns the last N number of items from an array.
       * @param {Array} arr
       * @param {number} itemCount
       * @returns {Array}
       */
      var getLastArrayItems = function(arr, itemCount) {
        return arr.slice(-itemCount);
      };

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

      /**
       * Returns whether the value is a string.
       * @param {*} value
       * @returns {boolean}
       */
      var isString = function(value) {
        return typeof value === "string";
      };

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
      /**
       * Returns the object specified by the nested object location.
       * @param {Object} obj The object containing the nested object.
       * @param {String} location Dot notation of the nested object location.
       * @param {Object} defaultObj object to return if no object is found at
       * the nested location.
       * @returns {Object}
       */

      var getNestedObject = function(obj, location, defaultObj) {
        var keys = [location];
        var o = obj;

        if (isString(location)) {
          keys = location.split(".");
        }

        for (var i = 0; i < keys.length; i += 1) {
          if (!o || !Object.prototype.hasOwnProperty.call(o, keys[i])) {
            return defaultObj;
          }

          o = o[keys[i]];
        }

        return o;
      };

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
      var namespace = "com.adobe.alloy.";

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
      var cookieName = namespace + "getTld";
      /**
       * Retrieves the top-most domain that is able to accept cookies. This will
       * be the top-most domain that is not a "public suffix" as outlined
       * in https://publicsuffix.org/
       * @param {Object} window
       * @param {Object} cookieJar
       * @returns {string}
       */

      var getTopLevelCookieDomain = function(window, cookieJar) {
        var topLevelCookieDomain = ""; // If hostParts.length === 1, we may be on localhost.

        var hostParts = window.location.hostname.toLowerCase().split(".");
        var i = 1;

        while (i < hostParts.length && !cookieJar.get(cookieName)) {
          i += 1;
          topLevelCookieDomain = getLastArrayItems(hostParts, i).join(".");
          cookieJar.set(cookieName, cookieName, {
            domain: topLevelCookieDomain
          });
        }

        cookieJar.remove(cookieName, {
          domain: topLevelCookieDomain
        });
        return topLevelCookieDomain;
      };

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

      /**
       * Determines whether an array includes a certain value.
       * @param {Array} arr Array to search.
       * @param {*} item The item for which to search.
       * @returns {boolean}
       */
      var includes = function(arr, item) {
        return arr.indexOf(item) !== -1;
      };

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
      /**
       * Returns items that are found within both arrays.
       * @param {Array} a
       * @param {Array} b
       * @returns {Array}
       */

      var intersection = function(a, b) {
        return a.filter(function(x) {
          return includes(b, x);
        });
      };

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

      /**
       * Returns whether the value is a boolean.
       * @param {*} value
       * @returns {boolean}
       */
      var isBoolean = function(value) {
        return typeof value === "boolean";
      };

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

      /**
       * Returns whether the value is a number.
       * @param {*} value
       * @returns {boolean}
       */
      // eslint-disable-next-line no-restricted-globals
      var isNumber = function(value) {
        return typeof value === "number" && !isNaN(value);
      };

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
      /**
       * Returns whether the value is an integer.
       * @param {*} value
       * @returns {boolean}
       */

      var isInteger = function(value) {
        var parsed = parseInt(value, 10);
        return isNumber(parsed) && value === parsed;
      };

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
      /**
       * Returns whether the value is a populated string.
       * @param {*} value
       * @returns {boolean}
       */

      var isNonEmptyString = function(value) {
        return isString(value) && value.length > 0;
      };

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

      /**
       * Creates a function that memoizes the result of `fn`. If `keyResolver` is
       * provided, it determines the cache key for storing the result based on the
       * arguments provided to the memoized function. By default, the first argument
       * provided to the memoized function is used as the map cache key.
       *
       * @param {Function} fn The function to have its output memoized.
       * @param {Function} [keyResolver] The function to resolve the cache key.
       * @returns {Function} The new memoized function.
       */
      var memoize = function(fn, keyResolver) {
        var map = new Map();
        return function() {
          var key = keyResolver
            ? keyResolver.apply(void 0, arguments)
            : arguments.length <= 0
            ? undefined
            : arguments[0];

          if (map.has(key)) {
            return map.get(key);
          }

          var result = fn.apply(void 0, arguments);
          map.set(key, result);
          return result;
        };
      };

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
      // adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
      var padStart = function(string, targetLength, padString) {
        var originalString = String(string);
        var repeatedPadString = String(padString);

        if (
          originalString.length >= targetLength ||
          repeatedPadString.length === 0
        ) {
          return originalString;
        }

        var lengthToAdd = targetLength - originalString.length;

        while (lengthToAdd > repeatedPadString.length) {
          repeatedPadString += repeatedPadString;
        }

        return repeatedPadString.slice(0, lengthToAdd) + originalString;
      };

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
      /**
       * Sets a nested object specified by the nested object location.
       * @param {Object} obj The object to set the nested object on.
       * @param {String} location Dot notation of the nested object location.
       * @returns {Object} Previous object at the location if already set.
       */

      var setNestedObject = function(obj, location, nestedObj) {
        var keys = [location];
        var o = obj;

        if (isString(location)) {
          keys = location.split(".");
        }

        var existingObj;

        for (var i = 0; i < keys.length; i += 1) {
          if (i === keys.length - 1) {
            existingObj = o[keys[i]];
            o[keys[i]] = nestedObj;
          } else if (!o[keys[i]]) {
            o[keys[i]] = {};
          }

          o = o[keys[i]];
        }

        return existingObj;
      };

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

      /**
       * Creates and returns a new error using the provided value as a message.
       * If the provided value is already an Error, it will be returned unmodified.
       * @param {*} value
       * @returns {Error}
       */
      var toError = function(value) {
        return value instanceof Error ? value : new Error(value);
      };

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
      /**
       * Augments an error's message with additional context as it bubbles up the call stack.
       * @param {String} message The message to be added to the error.
       * @param {*} error Optimally, this is an instance of Error. If it is not,
       * this is used as the basis for the message of a newly created Error instance.
       * @returns {*}
       */

      var stackError = function(message, error) {
        var stackedError = toError(error);
        stackedError.message = message + "\nCaused by: " + stackedError.message;
        return stackedError;
      };

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

      var getStorageByType = function getStorageByType(
        context,
        storageType,
        namespace$$1
      ) {
        // When storage is disabled on Safari, the mere act of referencing
        // window.localStorage or window.sessionStorage throws an error.
        // For this reason, we wrap in a try-catch.
        return {
          /**
           * Reads a value from storage.
           * @param {string} name The name of the item to be read.
           * @returns {string}
           */
          getItem: function getItem(name) {
            try {
              return context[storageType].getItem(namespace$$1 + name);
            } catch (e) {
              return null;
            }
          },

          /**
           * Saves a value to storage.
           * @param {string} name The name of the item to be saved.
           * @param {string} value The value of the item to be saved.
           * @returns {boolean} Whether the item was successfully saved to storage.
           */
          setItem: function setItem(name, value) {
            try {
              context[storageType].setItem(namespace$$1 + name, value);
              return true;
            } catch (e) {
              return false;
            }
          }
        };
      };

      var storageFactory = function(context) {
        return function(additionalNamespace) {
          var finalNamespace = namespace + (additionalNamespace || "");
          return {
            session: getStorageByType(
              context,
              "sessionStorage",
              finalNamespace
            ),
            persistent: getStorageByType(
              context,
              "localStorage",
              finalNamespace
            )
          };
        };
      };

      var stringToBoolean = function(str) {
        return isString(str) && (str.toLowerCase() === "true" || str === "1");
      };

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
      /**
       * Formats the date into an ISO date-time string in the local timezone
       * @param {Date} date
       * @returns {string}
       */

      var toISOStringLocal = function(date) {
        var YYYY = date.getFullYear();
        var MM = padStart(date.getMonth() + 1, 2, "0");
        var DD = padStart(date.getDate(), 2, "0");
        var hh = padStart(date.getHours(), 2, "0");
        var mm = padStart(date.getMinutes(), 2, "0");
        var ss = padStart(date.getSeconds(), 2, "0");
        var mmm = padStart(date.getMilliseconds(), 3, "0"); // The time-zone offset is the difference, in minutes, from local time to UTC. Note that this
        // means that the offset is positive if the local timezone is behind UTC and negative if it is
        // ahead. For example, for time zone UTC+10:00, -600 will be returned.

        var timezoneOffset = date.getTimezoneOffset();
        var ts = timezoneOffset > 0 ? "-" : "+";
        var th = padStart(Math.floor(Math.abs(timezoneOffset) / 60), 2, "0");
        var tm = padStart(Math.abs(timezoneOffset) % 60, 2, "0");
        return (
          YYYY +
          "-" +
          MM +
          "-" +
          DD +
          "T" +
          hh +
          ":" +
          mm +
          ":" +
          ss +
          "." +
          mmm +
          ts +
          th +
          ":" +
          tm
        );
      };

      var commonjsGlobal =
        typeof globalThis !== "undefined"
          ? globalThis
          : typeof window !== "undefined"
          ? window
          : typeof global !== "undefined"
          ? global
          : typeof self !== "undefined"
          ? self
          : {};

      function createCommonjsModule(fn, module) {
        return (
          (module = { exports: {} }), fn(module, module.exports), module.exports
        );
      }

      var rngBrowser = createCommonjsModule(function(module) {
        // Unique ID creation requires a high quality random # generator.  In the
        // browser this is a little complicated due to unknown quality of Math.random()
        // and inconsistent support for the `crypto` API.  We do the best we can via
        // feature-detection
        // getRandomValues needs to be invoked in a context where "this" is a Crypto
        // implementation. Also, find the complete implementation of crypto on IE11.
        var getRandomValues =
          (typeof crypto != "undefined" &&
            crypto.getRandomValues &&
            crypto.getRandomValues.bind(crypto)) ||
          (typeof msCrypto != "undefined" &&
            typeof window.msCrypto.getRandomValues == "function" &&
            msCrypto.getRandomValues.bind(msCrypto));

        if (getRandomValues) {
          // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
          var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

          module.exports = function whatwgRNG() {
            getRandomValues(rnds8);
            return rnds8;
          };
        } else {
          // Math.random()-based (RNG)
          //
          // If all else fails, use Math.random().  It's fast, but is of unspecified
          // quality.
          var rnds = new Array(16);

          module.exports = function mathRNG() {
            for (var i = 0, r; i < 16; i++) {
              if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
              rnds[i] = (r >>> ((i & 0x03) << 3)) & 0xff;
            }

            return rnds;
          };
        }
      });

      /**
       * Convert array of 16 byte values to UUID string format of the form:
       * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
       */
      var byteToHex = [];

      for (var i = 0; i < 256; ++i) {
        byteToHex[i] = (i + 0x100).toString(16).substr(1);
      }

      function bytesToUuid(buf, offset) {
        var i = offset || 0;
        var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

        return [
          bth[buf[i++]],
          bth[buf[i++]],
          bth[buf[i++]],
          bth[buf[i++]],
          "-",
          bth[buf[i++]],
          bth[buf[i++]],
          "-",
          bth[buf[i++]],
          bth[buf[i++]],
          "-",
          bth[buf[i++]],
          bth[buf[i++]],
          "-",
          bth[buf[i++]],
          bth[buf[i++]],
          bth[buf[i++]],
          bth[buf[i++]],
          bth[buf[i++]],
          bth[buf[i++]]
        ].join("");
      }

      var bytesToUuid_1 = bytesToUuid;

      function v4(options, buf, offset) {
        var i = (buf && offset) || 0;

        if (typeof options == "string") {
          buf = options === "binary" ? new Array(16) : null;
          options = null;
        }

        options = options || {};
        var rnds = options.random || (options.rng || rngBrowser)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80; // Copy bytes to buffer, if provided

        if (buf) {
          for (var ii = 0; ii < 16; ++ii) {
            buf[i + ii] = rnds[ii];
          }
        }

        return buf || bytesToUuid_1(rnds);
      }

      var v4_1 = v4;

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

      /**
       * Returns an array whose items are the provided object's own enumerable
       * property values.
       * @param {Object} obj
       * @returns {Array}
       */
      var values = function(obj) {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      };

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
      var CONFIG_DOC_URI =
        "https://launch.gitbook.io/adobe-experience-platform-web-sdk/fundamentals/configuring-the-sdk";

      var createConfig = function createConfig(config) {
        var cfg = {
          /**
           * Assign a value to a key
           * @param {Object} Key.
           * @param {Object} Value.
           */
          set: function set(key, value) {
            return setNestedObject(cfg, key, value);
          },

          /**
           * Assigns all key-value mappings in an existing config to this config
           * @param {Object} New configurations.
           */
          setAll: function setAll(cfgAdd) {
            assign(cfg, cfgAdd);
          },

          /**
           * Returns value assigned to key.
           * @param {Object} Key.
           * @param {Object} Default value if no value is found.
           */
          get: function get(key, defaultValue) {
            return getNestedObject(cfg, key, defaultValue);
          },

          /**
           * Returns a set of the top level keys in this config.
           */
          keySet: function keySet() {
            var keys = Object.keys(cfg);
            cfg.forbiddenKeys.forEach(function(key) {
              keys.splice(keys.indexOf(key), 1);
            });
            return keys;
          },

          /**
           * Adds more validators to any existing validators.
           */
          addValidators: function addValidators(validators) {
            assign(cfg.validators, validators);
            return cfg.validators;
          },

          /**
           * Validates the configuration against the defined validators.
           */
          validate: function validate() {
            var keys = Object.keys(cfg.validators);
            var errors = keys.reduce(function(ac, key) {
              var currentValue = cfg.get(key);
              var validator = cfg.validators[key];

              if (
                currentValue == null &&
                Object.prototype.hasOwnProperty.call(validator, "defaultValue")
              ) {
                cfg.set(key, validator.defaultValue);
              } else if (validator.validate) {
                var errorMessage = validator.validate(
                  key,
                  currentValue,
                  validator.defaultValue
                );

                if (errorMessage) {
                  ac.push(errorMessage);
                }
              }

              return ac;
            }, []);

            if (errors.length) {
              throw new Error(
                "Resolve these configuration problems:\n\t - " +
                  errors.join("\n\t - ") +
                  "\nFor configuration documentation see: " +
                  CONFIG_DOC_URI
              );
            }
          },
          toJSON: function toJSON() {
            var cfgCopy = {};
            assign(cfgCopy, cfg);
            cfg.forbiddenKeys.forEach(function(key) {
              delete cfgCopy[key];
            });
            return cfgCopy;
          },
          validators: {},
          forbiddenKeys: []
        };
        cfg.forbiddenKeys = Object.keys(cfg);

        if (config) {
          cfg.setAll(config);
        }

        return cfg;
      };

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
      var logQueryParam = "alloy_log";

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
      var createInstance = function(
        namespace,
        initializeComponents,
        logController,
        logger,
        window
      ) {
        var errorsEnabled;
        var configurePromise;

        var logCommand = function logCommand(_ref) {
          var enabled = _ref.enabled;
          // eslint-disable-next-line no-param-reassign
          logController.logEnabled = enabled;
        };

        var configureCommand = function configureCommand(options) {
          // We wrap this code in a promise, so that if there are any errors
          // in any of it, the promise returned from this function
          // will be properly rejected.
          return new Promise(function(resolve, reject) {
            var _options$errorsEnable = options.errorsEnabled;
            errorsEnabled =
              _options$errorsEnable === void 0 ? true : _options$errorsEnable;

            if (options.logEnabled !== undefined) {
              logCommand({
                enabled: options.logEnabled
              });
            }

            var parsedQueryString = queryString.parse(window.location.search);

            if (parsedQueryString[logQueryParam] !== undefined) {
              logCommand({
                enabled: stringToBoolean(parsedQueryString[logQueryParam])
              });
            }

            var config = createConfig(options);
            initializeComponents(config).then(resolve, reject);
          });
        };

        var executeCommand = function executeCommand(commandName, options) {
          var execute;

          if (commandName === "configure") {
            if (configurePromise) {
              throw new Error(
                "The library has already been configured and may only be configured once."
              );
            }

            execute = function execute() {
              configurePromise = configureCommand(options);
              return configurePromise;
            };
          } else {
            if (!configurePromise) {
              throw new Error(
                "The library must be configured first. Please do so by calling " +
                  namespace +
                  '("configure", {...}).'
              );
            }

            if (commandName === "log") {
              execute = function execute() {
                return logCommand(options);
              };
            } else {
              execute = function execute() {
                return configurePromise.then(
                  function(componentRegistry) {
                    var command = componentRegistry.getCommand(commandName);

                    if (!isFunction(command)) {
                      throw new Error(
                        "The " + commandName + " command does not exist."
                      );
                    }

                    return command(options);
                  },
                  function() {
                    logger.warn(
                      "An error during configuration is preventing the " +
                        commandName +
                        " command from executing."
                    ); // If configuration failed, we prevent the configuration
                    // error from bubbling here because we don't want the
                    // configuration error to be reported in the console every
                    // time any command is executed. Only having it bubble
                    // once when the configure command runs is sufficient.
                    // Instead, for this command, we'll just return a promise
                    // that never gets resolved.

                    return new Promise(function() {});
                  }
                );
              };
            }
          }

          logger.log(
            "Executing " + commandName + " command.",
            "Options:",
            options
          );
          return execute();
        };

        return function(args) {
          // Would use destructuring, but destructuring doesn't work on IE
          // without polyfilling Symbol.
          // https://github.com/babel/babel/issues/7597
          var resolve = args[0];
          var reject = args[1];
          var userProvidedArgs = args[2];
          var commandName = userProvidedArgs[0];
          var options = userProvidedArgs[1] || {}; // We have to wrap the function call in "new Promise()" instead of just
          // doing "Promise.resolve(executeCommand(commandName, options))" so that
          // the promise can capture any errors that occur synchronously during the
          // underlying function call.
          // Also note that executeCommand may or may not return a promise.

          new Promise(function(_resolve) {
            _resolve(executeCommand(commandName, options));
          })
            .then(resolve)
            .catch(function(error) {
              var err = toError(error); // eslint-disable-next-line no-param-reassign

              err.message = "[" + namespace + "] " + err.message; // If errors are enabled, we reject the promise we return
              // to the customer. If the customer catches the error
              // (using .catch()), the error won't hit the console.
              // If the customer doesn't catch the error, the error
              // will hit the console. This is due to how native
              // browser functionality handles unhandled errors.
              // If errors are NOT enabled, we instead pump the error
              // through our logger, in which case the error will
              // hit the console only if logging is enabled.

              if (errorsEnabled) {
                reject(err);
              } else {
                logger.error(err);
              }
            });
        };
      };

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
      var cookieDetails = {
        ALLOY_COOKIE_NAME: "adobe_alloy",
        // TODO: Rename this cookie
        ALLOY_COOKIE_TTL_IN_DAYS: 180
      };

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
      var ALLOY_COOKIE_NAME = cookieDetails.ALLOY_COOKIE_NAME,
        ALLOY_COOKIE_TTL_IN_DAYS = cookieDetails.ALLOY_COOKIE_TTL_IN_DAYS;
      var memoizedGetTopLevelDomain = memoize(getTopLevelCookieDomain);
      var initializeComponentsFactory = function(
        componentCreators,
        logger,
        createNamespacedStorage,
        createCookieProxy,
        createComponentNamespacedCookieJar,
        createLifecycle,
        createComponentRegistry,
        createNetwork,
        createOptIn
      ) {
        return function(config) {
          var componentRegistry = createComponentRegistry();
          var imsOrgId = config.imsOrgId,
            propertyId = config.propertyId,
            cookieDomain = config.cookieDomain;
          var cookieName = ALLOY_COOKIE_NAME + "_" + propertyId;
          var cookieProxy = createCookieProxy(
            cookieName,
            ALLOY_COOKIE_TTL_IN_DAYS,
            cookieDomain || memoizedGetTopLevelDomain(window, cookie)
          ); // TODO: Should this storage be namespaced by property ID or org ID?

          var storage = createNamespacedStorage(imsOrgId);
          var optIn = createOptIn();
          componentCreators.forEach(function(createComponent) {
            var configValidators = createComponent.configValidators;
            config.addValidators(configValidators);
          });
          config.validate();
          componentCreators.forEach(function(createComponent) {
            var namespace = createComponent.namespace,
              abbreviation = createComponent.abbreviation; // TO-DOCUMENT: Helpers that we inject into factories.

            var component;

            try {
              component = createComponent({
                logger: logger.spawn("[" + namespace + "]"),
                cookieJar: createComponentNamespacedCookieJar(
                  cookieProxy,
                  abbreviation
                ),
                config: config,
                storage: storage,
                enableOptIn: optIn.enable
              });
            } catch (error) {
              throw stackError(
                "[" +
                  namespace +
                  "] An error occurred during component creation.",
                error
              );
            }

            componentRegistry.register(namespace, component);
          }); // toJson is expensive so we short circuit if logging is disabled

          if (logger.enabled)
            logger.log("Computed configuration:", config.toJSON());
          var lifecycle = createLifecycle(componentRegistry);
          var network = createNetwork(config, logger, lifecycle);
          return lifecycle
            .onComponentsRegistered({
              componentRegistry: componentRegistry,
              lifecycle: lifecycle,
              network: network,
              optIn: optIn
            })
            .then(function() {
              return componentRegistry;
            });
        };
      };

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
      var createLogger = function createLogger(console, logController, prefix) {
        var process = function process(level) {
          if (logController.logEnabled) {
            for (
              var _len = arguments.length,
                rest = new Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              rest[_key - 1] = arguments[_key];
            }

            console[level].apply(console, [prefix].concat(rest));
          }
        };

        return {
          get enabled() {
            return logController.logEnabled;
          },

          /**
           * Outputs a message to the web console.
           * @param {...*} arg Any argument to be logged.
           */
          log: process.bind(null, "log"),

          /**
           * Outputs informational message to the web console. In some
           * browsers a small "i" icon is displayed next to these items
           * in the web console's log.
           * @param {...*} arg Any argument to be logged.
           */
          info: process.bind(null, "info"),

          /**
           * Outputs a warning message to the web console.
           * @param {...*} arg Any argument to be logged.
           */
          warn: process.bind(null, "warn"),

          /**
           * Outputs an error message to the web console.
           * @param {...*} arg Any argument to be logged.
           */
          error: process.bind(null, "error"),

          /**
           * Creates a new logger with an additional prefix.
           * @param {String} additionalPrefix
           */
          spawn: function spawn(additionalPrefix) {
            return createLogger(
              console,
              logController,
              prefix + " " + additionalPrefix
            );
          }
        };
      };

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

      var safeJSONParse = function safeJSONParse(object, cookieName) {
        try {
          return JSON.parse(object);
        } catch (error) {
          throw new Error("Invalid cookie format in " + cookieName + " cookie");
        }
      };
      /**
       * The purpose of this proxy is to cache the cookie so we don't have to
       * read and deserialize it every time a piece of it is accessed. It assumes
       * nothing outside of Alloy will be modifying the cookie.
       */

      var createCookieProxy = function(name, expires, domain) {
        var deserializedCookie;
        var cookieHasBeenRead = false;
        return {
          get: function get() {
            // We don't read the cookie right when the cookie proxy is created
            // because we don't know if the user has opted in. If the user
            // hasn't opted in, we're legally obligated to not read the cookie.
            // If a component tries to read something off the cookie though,
            // we assume that the component has received word that the user
            // has opted-in. The responsibility is on the component.
            if (cookieHasBeenRead) {
              return deserializedCookie;
            }

            var serializedCookie = cookie.get(name);
            deserializedCookie =
              serializedCookie && safeJSONParse(serializedCookie, name);
            cookieHasBeenRead = true;
            return deserializedCookie;
          },
          set: function set(updatedCookie) {
            deserializedCookie = updatedCookie;
            cookie.set(name, updatedCookie, {
              expires: expires,
              domain: domain
            });
          }
        };
      };

      var createComponentNamespacedCookieJar = function(
        cookieProxy,
        componentNamespace
      ) {
        if (!isNonEmptyString(componentNamespace)) {
          throw Error(
            "No cookie namespace.  Please define 'abbreviation' on the component."
          );
        }

        return {
          /**
           * Returns a value from the Alloy cookie for a given key.
           * @param {string} key
           */
          get: function get(key) {
            var currentCookie = cookieProxy.get();
            return (
              currentCookie &&
              currentCookie[componentNamespace] &&
              currentCookie[componentNamespace][key]
            );
          },

          /**
           * Sets a value in the Alloy cookie for a given key.
           * @param {string} key
           * @param {string} value
           */
          set: function set(key, value) {
            var currentCookie = cookieProxy.get() || {};

            var updatedCookie = _objectSpread(
              {},
              currentCookie,
              _defineProperty(
                {},
                componentNamespace,
                _objectSpread(
                  {},
                  currentCookie[componentNamespace],
                  _defineProperty({}, key, value)
                )
              )
            );

            cookieProxy.set(updatedCookie);
          },

          /**
           * Removes a value from the Alloy cookie for a given key.
           * @param {string} key
           */
          remove: function remove(key) {
            var currentCookie = cookieProxy.get();

            if (currentCookie && currentCookie[componentNamespace]) {
              var updatedCookie = _objectSpread(
                {},
                currentCookie,
                _defineProperty(
                  {},
                  componentNamespace,
                  _objectSpread({}, currentCookie[componentNamespace])
                )
              );

              delete updatedCookie[componentNamespace][key];
              cookieProxy.set(updatedCookie);
            }
          }
        };
      };

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
      var createLogController = function(
        instanceNamespace,
        createNamespacedStorage
      ) {
        // Segregate whether logging is enabled by the SDK instance name.
        // This way consumers can log one instance at a time.
        // TODO: Figure out how this plays out with segregating Web Storage
        // in the rest of the SDK. Is it segregated by Org ID or Property ID
        // in the rest of the SDK?
        var storage = createNamespacedStorage(
          "instance." + instanceNamespace + "."
        );
        var logEnabled = storage.persistent.getItem("log") === "true";
        return {
          get logEnabled() {
            return logEnabled;
          },

          set logEnabled(value) {
            storage.persistent.setItem("log", value);
            logEnabled = value;
          }
        };
      };

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
      // - It implements all lifecycle hooks.
      // Let's start the first version with an explicit Hook interface,
      // and not a random pub/sub model. Meaning each Component will have
      // to implement the hook it's interested in as a method on its prototype.
      // We will have a Plop helper that generates Components and populate all the
      // hooks as Template methods.
      // TODO: Hooks might have to publish events so the outside world can hooks in as well.
      // TO-DOCUMENT: Lifecycle hooks and their params.
      var hookNames = [
        "onComponentsRegistered",
        "onBeforeEvent",
        "onResponse",
        "onResponseError",
        "onBeforeDataCollection"
      ];

      var createHook = function createHook(componentRegistry, hookName) {
        return function() {
          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key];
          }

          return Promise.all(
            componentRegistry
              .getLifecycleCallbacks(hookName)
              .map(function(callback) {
                return new Promise(function(resolve) {
                  resolve(callback.apply(void 0, args));
                });
              })
          );
        };
      };
      /**
       * This ensures that if a component's lifecycle method X
       * attempts to execute lifecycle method Y, that all X methods on all components
       * will have been called before any of their Y methods are called. It does
       * this by kicking the call to the Y method to the next JavaScript tick.
       * @returns {function}
       */

      var guardHook = function guardHook(fn) {
        return function() {
          for (
            var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
            _key2 < _len2;
            _key2++
          ) {
            args[_key2] = arguments[_key2];
          }

          return Promise.resolve().then(function() {
            return fn.apply(void 0, args);
          });
        };
      };

      var createLifecycle = function(componentRegistry) {
        return hookNames.reduce(function(memo, hookName) {
          memo[hookName] = guardHook(createHook(componentRegistry, hookName));
          return memo;
        }, {});
      };

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

      var wrapForErrorHandling = function wrapForErrorHandling(
        fn,
        stackMessage
      ) {
        return function() {
          var result;

          try {
            result = fn.apply(void 0, arguments);
          } catch (error) {
            throw stackError(stackMessage, error);
          }

          if (result instanceof Promise) {
            result = result.catch(function(error) {
              throw stackError(stackMessage, error);
            });
          }

          return result;
        };
      }; // TO-DOCUMENT: All public commands and their signatures.

      var createComponentRegistry = function() {
        var componentsByNamespace = {};
        var commandsByName = {};
        var lifecycleCallbacksByName = {};

        var registerComponentCommands = function registerComponentCommands(
          namespace
        ) {
          var componentCommandsByName =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          var conflictingCommandNames = intersection(
            Object.keys(commandsByName),
            Object.keys(componentCommandsByName)
          );

          if (conflictingCommandNames.length) {
            throw new Error(
              "[ComponentRegistry] Could not register " +
                namespace +
                " " +
                ("because it has existing command(s): " +
                  conflictingCommandNames.join(","))
            );
          }

          Object.keys(componentCommandsByName).forEach(function(commandName) {
            var command = componentCommandsByName[commandName];
            commandsByName[commandName] = wrapForErrorHandling(
              command,
              "[" +
                namespace +
                "] An error occurred while executing the " +
                commandName +
                " command."
            );
          });
        };

        var registerLifecycleCallbacks = function registerLifecycleCallbacks(
          namespace
        ) {
          var componentLifecycleCallbacksByName =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : {};
          Object.keys(componentLifecycleCallbacksByName).forEach(function(
            hookName
          ) {
            lifecycleCallbacksByName[hookName] =
              lifecycleCallbacksByName[hookName] || [];
            lifecycleCallbacksByName[hookName].push(
              wrapForErrorHandling(
                componentLifecycleCallbacksByName[hookName],
                "[" +
                  namespace +
                  "] An error occurred while executing the " +
                  hookName +
                  " lifecycle hook."
              )
            );
          });
        };

        return {
          register: function register(namespace, component) {
            var commands = component.commands,
              lifecycle = component.lifecycle;
            registerComponentCommands(namespace, commands);
            registerLifecycleCallbacks(namespace, lifecycle);
            componentsByNamespace[namespace] = component;
          },
          getNamespaceByComponent: function getNamespaceByComponent(component) {
            return find(Object.keys(componentsByNamespace), function(
              namespace
            ) {
              return componentsByNamespace[namespace] === component;
            });
          },
          getCommand: function getCommand(commandName) {
            return commandsByName[commandName];
          },
          getLifecycleCallbacks: function getLifecycleCallbacks(hookName) {
            return lifecycleCallbacksByName[hookName] || [];
          }
        };
      };

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
      var createPayload = function() {
        var content = {};
        var expectsResponse = false;
        return {
          addIdentity: function addIdentity(namespaceCode, identity) {
            content.identityMap = content.identityMap || {};
            content.identityMap[namespaceCode] =
              content.identityMap[namespaceCode] || [];
            content.identityMap[namespaceCode].push(identity);
          },
          addEvent: function addEvent(event) {
            content.events = content.events || [];
            content.events.push(event);
          },
          mergeMeta: createMerger(content, "meta"),
          expectResponse: function expectResponse() {
            expectsResponse = true;
          },

          get expectsResponse() {
            return (
              expectsResponse ||
              (Array.isArray(content.events) &&
                content.events.some(function(event) {
                  return event.expectsResponse;
                }))
            );
          },

          toJSON: function toJSON() {
            return content;
          }
        };
      };

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
      /**
       * Represents a gateway response with the addition to helper methods.
       *
       * @param {Object} respDto The raw JSON response from the edge gateway
       *  - Current schema:
       * {
       *      requestId: {String},
       *      handle: [
       *          { type, payload }
       *      ]
       * }
       *
       * @returns {Object<Response>} A Response object containing:
       *  - `getPayloadsByType`: returns matching fragments of the response by type
       *      - @param {String} type: A string with the current format: <namespace:action>
       *          example: "identity:persist"
       */

      var createResponse = function() {
        var content =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : {
                requestId: "",
                handle: []
              };
        // TODO: Should we freeze the response to prevent change by Components?
        // Object.freeze(response.handle.map(h => Object.freeze(h)));
        return {
          getPayloadsByType: function getPayloadsByType(type) {
            var _content$handle = content.handle,
              handle = _content$handle === void 0 ? [] : _content$handle;
            return flatMap(
              handle.filter(function(fragment) {
                return fragment.type === type;
              }),
              function(fragment) {
                return fragment.payload;
              }
            );
          },
          toJSON: function toJSON() {
            return content;
          } // TODO: Maybe consider the following API as well?
          // - getPayloadsByAction
        };
      };

      var apiVersion = "v1";

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
      var createNetwork = function(config, logger, lifecycle, networkStrategy) {
        var handleResponse = function handleResponse(requestId, responseBody) {
          var parsedBody;

          try {
            parsedBody = JSON.parse(responseBody);
          } catch (e) {
            throw new Error(
              "Error parsing server response.\n" +
                e +
                "\nResponse body: " +
                responseBody
            );
          }

          logger.log(
            "Request " + requestId + ": Received response.",
            parsedBody
          );
          var response = createResponse(parsedBody);
          return lifecycle.onResponse(response).then(function() {
            return response;
          });
        };

        var edgeDomain = config.edgeDomain,
          propertyId = config.propertyId;
        return {
          /**
           * Create a new payload.  Once you have added data to the payload, send it with
           * the sendRequest method.
           */
          createPayload: createPayload,

          /**
           * Send the request to either interact or collect based on expectsResponse.
           * When the response is returned it will call the lifecycle method "onResponse"
           * with the returned response object.
           *
           * @param {Object} payload This will be JSON stringified and sent as the post body.
           * @param {boolean} [expectsResponse=true] The endpoint and request mechanism
           * will be determined by whether a response is expected.
           * @param {boolean} [documentUnloading=false] This determines the network transport method.
           * When the document is unloading, sendBeacon is used, otherwise fetch is used.
           * @returns {Promise} a promise resolved with the response object once the response is
           * completely processed.  If expectsResponse==false, the promise will be resolved
           * with undefined.
           */
          sendRequest: function sendRequest(payload) {
            var expectsResponse =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;
            var documentUnloading =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : false;
            var requestId = v4_1();

            if (documentUnloading) {
              logger.log("No response requested due to document unloading.");
            }

            var reallyExpectsResponse = documentUnloading
              ? false
              : expectsResponse;
            return Promise.resolve()
              .then(function() {
                var action = reallyExpectsResponse ? "interact" : "collect";
                var baseUrl = "https://" + edgeDomain;
                var url =
                  baseUrl +
                  "/" +
                  apiVersion +
                  "/" +
                  action +
                  "?propertyId=" +
                  propertyId;
                var responseHandlingMessage = reallyExpectsResponse
                  ? ""
                  : " (no response is expected)";
                var stringifiedPayload = JSON.stringify(payload); // We want to log raw payload and event data rather than
                // our fancy wrapper objects. Calling payload.toJSON() is
                // insufficient to get all the nested raw data, because it's
                // not recursive (it doesn't call toJSON() on the event objects).
                // Parsing the result of JSON.stringify(), however, gives the
                // fully recursive raw data.
                // JSON.parse is expensive so we short circuit if logging is disabled.

                if (logger.enabled) {
                  logger.log(
                    "Request " +
                      requestId +
                      ": Sending request" +
                      responseHandlingMessage +
                      ".",
                    JSON.parse(stringifiedPayload)
                  );
                }

                return executeWithRetry(function() {
                  return networkStrategy(
                    url,
                    stringifiedPayload,
                    documentUnloading
                  );
                }, 3);
              })
              .catch(function(error) {
                throw stackError("Network request failed.", error);
              })
              .then(function(responseBody) {
                var handleResponsePromise;

                if (reallyExpectsResponse) {
                  handleResponsePromise = handleResponse(
                    requestId,
                    responseBody
                  );
                }

                return handleResponsePromise;
              })
              .catch(function(error) {
                // The network error that just occurred is more important than
                // any error that may occur in lifecycle.onResponseError(). For
                // that reason, we make sure the network error is the one that
                // bubbles up. We also wait until lifecycle.onResponseError is
                // complete before returning, so that any error that may occur
                // in lifecycle.onResponseError is properly suppressed if the
                // user has errorsEnabled: false in the configuration.
                // We could use finally() here, but just to be safe, we don't,
                // because finally() is only recently supported natively and may
                // not exist in customer-provided promise polyfills.
                var throwError = function throwError() {
                  throw error;
                };

                return lifecycle
                  .onResponseError(error)
                  .then(throwError, throwError);
              });
          }
        };
      };

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
      var xhrRequestFactory = function(XMLHttpRequest) {
        return function(url, body) {
          return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
              if (request.readyState === 4) {
                if (request.status === 204) {
                  resolve();
                } else if (request.status >= 200 && request.status < 300) {
                  resolve(request.responseText);
                } else {
                  reject(
                    new Error(
                      "Invalid response code " +
                        request.status +
                        ". Response was " +
                        request.responseText +
                        "."
                    )
                  );
                }
              }
            };

            request.onloadstart = function() {
              request.responseType = "text";
            };

            request.open("POST", url, true);
            request.setRequestHeader(
              "Content-Type",
              "text/plain; charset=UTF-8"
            );
            request.withCredentials = false;
            request.onerror = reject;
            request.onabort = reject;
            request.send(body);
          });
        };
      };

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
      var fetchFactory = function(fetch) {
        return function(url, body) {
          return fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
              "Content-Type": "text/plain; charset=UTF-8"
            },
            referrer: "client",
            body: body
          }).then(function(response) {
            if (response.ok) {
              if (response.status === 204) {
                return undefined;
              }

              return response.text();
            }

            throw new Error("Bad response code: " + response.status);
          });
        };
      };

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
      var sendBeaconFactory = function(navigator, fetch, logger) {
        return function(url, body) {
          var blob = new Blob([body], {
            type: "text/plain; charset=UTF-8"
          });

          if (!navigator.sendBeacon(url, blob)) {
            logger.log("The `beacon` call has failed; falling back to `fetch`");
            return fetch(url, body);
          }

          return Promise.resolve();
        };
      };

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
      var createNetworkStrategy = function(window, logger) {
        var fetch = isFunction(window.fetch)
          ? fetchFactory(window.fetch)
          : xhrRequestFactory(window.XMLHttpRequest);
        var sendBeacon =
          window.navigator && isFunction(window.navigator.sendBeacon)
            ? sendBeaconFactory(window.navigator, fetch, logger)
            : fetch;
        return function(url, body, documentUnloading) {
          var method = documentUnloading ? sendBeacon : fetch;
          return method(url, body);
        };
      };

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
      var createNetwork$1 = function(config, logger, lifecycle) {
        return createNetwork(
          config,
          logger,
          lifecycle,
          createNetworkStrategy(window, logger)
        );
      };

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
      var COOKIE_NAMESPACE = "optIn"; // The user has opted into all purposes.

      var ALL = "all"; // The user has opted into no purposes.

      var NONE = "none"; // The user has yet to provide opt-in purposes.

      var PENDING = "pending";
      var createOptIn = function() {
        var deferredsAwaitingResolution = [];
        var cookieJar;
        var purposes = ALL;

        var processDeferreds = function processDeferreds() {
          if (purposes === ALL || purposes === NONE) {
            var optedIn = purposes === ALL;

            while (deferredsAwaitingResolution.length) {
              var deferred = deferredsAwaitingResolution.shift();

              if (optedIn) {
                deferred.resolve();
              } else {
                deferred.reject(new Error("User opted into no purposes."));
              }
            }
          }
        };

        return {
          /**
           * Only to be called by the Privacy component during startup. If opt-in
           * isn't enabled, this method will not be called.
           * @param {Object} logger A logger object.
           * @param {Object} _cookieJar A cookie management object.
           * to the Privacy component.
           */
          enable: function enable(logger, _cookieJar) {
            cookieJar = _cookieJar;
            purposes = cookieJar.get(COOKIE_NAMESPACE) || PENDING;

            if (purposes === PENDING) {
              logger.warn(
                "Some commands may be delayed until the user opts in."
              );
            }
          },

          /**
           * Update the purposes the user has opted into. Only to be called by the
           * Privacy component.
           * @param {string} newPurposes Can be "all" or "none".
           */
          setPurposes: function setPurposes(newPurposes) {
            purposes = newPurposes;
            cookieJar.set(COOKIE_NAMESPACE, newPurposes);
            processDeferreds();
          },

          /**
           * Whether the user has opted into all purposes.
           * @returns {boolean}
           */
          // TODO Once we support opting into specific purposes, this
          // method will accept an array of purpose names as an argument and
          // return whether the user has opted into the specified purposes.
          isOptedIn: function isOptedIn() {
            return purposes === ALL;
          },

          /**
           * Returns a promise that is resolved once the user opts into all purposes.
           * If the user has already opted in, the promise will already be resolved.
           * The user user opts into no purposes, the promise will be rejected.
           */
          // TODO Once we support opting into specific purposes, this
          // method will accept an array of purpose names as an argument and
          // will return a promise that will be resolved once the user has opted
          // into the specified purposes.
          whenOptedIn: function whenOptedIn() {
            var deferred = defer();
            deferredsAwaitingResolution.push(deferred);
            processDeferreds();
            return deferred.promise;
          },
          ALL: ALL,
          NONE: NONE
        };
      };

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
      var createEvent = function() {
        var content = {};
        var expectsResponse = false;
        return {
          set eventMergeId(eventMergeId) {
            content.eventMergeId = eventMergeId;
          },

          mergeData: createMerger(content, "data"),
          mergeMeta: createMerger(content, "meta"),
          mergeQuery: createMerger(content, "query"),
          mergeWeb: createMerger(content, "web"),
          mergeDevice: createMerger(content, "device"),
          mergeEnvironment: createMerger(content, "environment"),
          mergePlaceContext: createMerger(content, "placeContext"),

          set timestamp(timestamp) {
            content.timestamp = timestamp;
          },

          expectResponse: function expectResponse() {
            expectsResponse = true;
          },

          get expectsResponse() {
            return expectsResponse;
          },

          toJSON: function toJSON() {
            return content;
          }
        };
      };

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
      var urlStartsWithScheme = function urlStartsWithScheme(url) {
        return url && /^[a-z0-9]+:\/\//i.test(url);
      };

      var getAbsoluteUrlFromAnchorElement = function getAbsoluteUrlFromAnchorElement(
        window,
        element
      ) {
        var loc = window.location;
        var url = element.href ? element.href : "";
        var protocol = element.protocol,
          host = element.host;

        if (!urlStartsWithScheme(url)) {
          if (!protocol) {
            protocol = loc.protocol ? loc.protocol : "";
          }

          protocol = protocol ? protocol + "//" : "";

          if (!host) {
            host = loc.host ? loc.host : "";
          }

          var path = "";

          if (url.substring(0, 1) !== "/") {
            var indx = loc.pathname.lastIndexOf("/");
            indx = indx < 0 ? 0 : indx;
            path = loc.pathname.substring(0, indx);
          }

          url = "" + protocol + host + path + "/" + url;
        }

        return url;
      };

      var isSupportedAnchorElement = function isSupportedAnchorElement(
        element
      ) {
        if (
          element.href &&
          (element.tagName === "A" || element.tagName === "AREA") &&
          (!element.onclick ||
            !element.protocol ||
            element.protocol.toLowerCase().indexOf("javascript") < 0)
        ) {
          return true;
        }

        return false;
      };

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

      var createClickHandler = function createClickHandler(
        window,
        logger,
        collect
      ) {
        return function(event) {
          // TODO: Consider safeguarding from the same object being clicked multiple times in rapid succession?
          var clickedObj = event.target;
          var linkUrl = getAbsoluteUrlFromAnchorElement(window, clickedObj); // Search parent elements for an anchor element
          // TODO: Replace with generic DOM tool that can fetch configured properties

          while (clickedObj && clickedObj !== document.body && !linkUrl) {
            clickedObj = clickedObj.parentElement || clickedObj.parentNode;

            if (clickedObj) {
              linkUrl = getAbsoluteUrlFromAnchorElement(window, clickedObj);
            }
          }

          if (linkUrl && isSupportedAnchorElement(clickedObj)) {
            // TODO: Update name (link name) and support exit, other, and download link types
            collect({
              data: {
                eventType: "web.webinteraction.linkClicks",
                web: {
                  webinteraction: {
                    name: "Link Click",
                    type: "other",
                    URL: linkUrl,
                    linkClicks: {
                      value: 1
                    }
                  }
                }
              }
            });
          }
        };
      };

      var createClickActivityCollector = function(config, logger, collect) {
        var enabled = config.get("clickCollectionEnabled");

        if (!enabled) {
          return;
        }

        var clickHandler = createClickHandler(window, logger, collect);
        document.addEventListener("click", clickHandler, true);
      };

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
      var boolean = function(key, currentValue) {
        return currentValue === undefined || isBoolean(currentValue)
          ? ""
          : "Value for " + key + " is not a boolean: " + currentValue;
      };

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
      var eitherNilOrNonEmpty = function(key, currentValue) {
        if (isNil(currentValue)) {
          return "";
        }

        if (isNonEmptyString(currentValue)) {
          return "";
        }

        return "Invalid value for " + key + ": " + currentValue;
      };

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
      var nonNegativeInteger = function(key, currentValue) {
        return currentValue === undefined ||
          (isInteger(currentValue) && currentValue >= 0)
          ? ""
          : "Value for " +
              key +
              " is not a nonnegative integer: " +
              currentValue;
      };

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
      var required = function(key, currentValue) {
        var err = "";

        if (currentValue == null) {
          err = key + " is a required configuration parameter";
        }

        return err;
      };

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
      var validDomain = function(key, currentValue) {
        var validUrl = /^[a-z0-9-.]{1,}$/gi.test(currentValue);
        var err = "";

        if (!validUrl) {
          err = "Invalid domain for " + key + ": " + currentValue;
        }

        return err;
      };

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

      var createDataCollector = function createDataCollector(_ref) {
        var config = _ref.config,
          logger = _ref.logger;
        var imsOrgId = config.imsOrgId;
        var lifecycle;
        var network;
        var optIn;

        var makeServerCall = function makeServerCall(event, documentUnloading) {
          var payload = network.createPayload();
          payload.addEvent(event);
          payload.mergeMeta({
            gateway: {
              imsOrgId: imsOrgId
            }
          });
          return lifecycle
            .onBeforeDataCollection(payload)
            .then(function() {
              return network.sendRequest(
                payload,
                payload.expectsResponse,
                documentUnloading
              );
            })
            .then(function(response) {
              var data = {
                requestBody: clone(payload)
              };

              if (response) {
                data.responseBody = clone(response);
              }

              return data;
            });
        };

        var createEventHandler = function createEventHandler(options) {
          var event = createEvent();
          var _options$viewStart = options.viewStart,
            viewStart =
              _options$viewStart === void 0 ? false : _options$viewStart,
            _options$documentUnlo = options.documentUnloading,
            documentUnloading =
              _options$documentUnlo === void 0 ? false : _options$documentUnlo,
            data = options.data,
            meta = options.meta;
          event.mergeData(data);
          event.mergeMeta(meta);
          return lifecycle
            .onBeforeEvent(event, options, viewStart, documentUnloading)
            .then(function() {
              return optIn.whenOptedIn();
            })
            .then(function() {
              return makeServerCall(event, documentUnloading);
            });
        };

        createClickActivityCollector(config, logger, createEventHandler);
        return {
          lifecycle: {
            onComponentsRegistered: function onComponentsRegistered(tools) {
              lifecycle = tools.lifecycle;
              network = tools.network;
              optIn = tools.optIn;
            }
          },
          commands: {
            event: createEventHandler
          }
        };
      };

      createDataCollector.namespace = "DataCollector";
      createDataCollector.abbreviation = "DC";
      createDataCollector.configValidators = {
        propertyId: {
          validate: required
        },
        edgeDomain: {
          validate: validDomain,
          defaultValue: "alpha.konductor.adobedc.net"
        },
        imsOrgId: {
          validate: required
        },
        clickCollectionEnabled: {
          defaultValue: true
        }
      };

      var AUTH_STATES = {
        UNKNOWN: 0,
        AUTHENTICATED: 1,
        LOGGED_OUT: 2
      };
      var COOKIE_NAMES = {
        CUSTOMER_ID_HASH: "CIDH",
        EXPERIENCE_CLOUD_ID: "ECID",
        ID_SYNC_TIMESTAMP: "idSyncTimestamp",
        ID_SYNC_CONTROL: "idSyncControl"
      };
      var DEFAULT_ID_SYNC_TTL_MINUTES = 10080; // 7 days

      var ID_SYNC_TIMESTAMP = COOKIE_NAMES.ID_SYNC_TIMESTAMP,
        ID_SYNC_CONTROL = COOKIE_NAMES.ID_SYNC_CONTROL;

      var getControlObject = function getControlObject(cookieJar) {
        var val = cookieJar.get(ID_SYNC_CONTROL) || "";
        var arr = val ? val.split("_") : [];
        return arr.reduce(function(controlObject, idTimestampPair) {
          var _idTimestampPair$spli = idTimestampPair.split("-"),
            _idTimestampPair$spli2 = _slicedToArray(_idTimestampPair$spli, 2),
            id = _idTimestampPair$spli2[0],
            timestamp = _idTimestampPair$spli2[1];

          controlObject[id] = parseInt(timestamp, 36);
          return controlObject;
        }, {});
      };

      var setControlObject = function setControlObject(
        controlObject,
        cookieJar
      ) {
        var arr = Object.keys(controlObject).map(function(id) {
          return id + "-" + controlObject[id].toString(36);
        });
        cookieJar.set(ID_SYNC_CONTROL, arr.join("_"));
      };

      var createProcessor = function createProcessor(
        config,
        logger,
        cookieJar
      ) {
        return function(destinations) {
          if (!config.idSyncsEnabled) {
            return Promise.resolve();
          }

          var controlObject = getControlObject(cookieJar);
          var now = convertTimes(MILLISECOND, HOUR, new Date().getTime()); // hours

          Object.keys(controlObject).forEach(function(key) {
            if (controlObject[key] < now) {
              delete controlObject[key];
            }
          });
          var idSyncs = destinations
            .filter(function(dest) {
              return (
                dest.type === "url" && controlObject[dest.id] === undefined
              );
            })
            .map(function(dest) {
              return assign(
                {
                  id: dest.id
                },
                dest.spec
              );
            });

          if (idSyncs.length) {
            return fireDestinations({
              logger: logger,
              destinations: idSyncs
            }).then(function(result) {
              var nowInHours = Math.round(
                convertTimes(MILLISECOND, HOUR, new Date().getTime())
              );
              result.succeeded.forEach(function(idSync) {
                var ttlInHours = Math.round(
                  convertTimes(
                    MINUTE,
                    HOUR,
                    idSync.ttlMinutes || DEFAULT_ID_SYNC_TTL_MINUTES
                  )
                );
                controlObject[idSync.id] = nowInHours + ttlInHours;
              });
              setControlObject(controlObject, cookieJar);
              cookieJar.set(
                ID_SYNC_TIMESTAMP,
                (
                  Math.round(
                    convertTimes(MILLISECOND, HOUR, new Date().getTime())
                  ) + convertTimes(DAY, HOUR, 7)
                ).toString(36)
              );
            });
          }

          return Promise.resolve();
        };
      };

      var createExpiryChecker = function createExpiryChecker(cookieJar) {
        return function() {
          var nowInHours = Math.round(
            convertTimes(MILLISECOND, HOUR, new Date().getTime())
          );
          var timestamp = parseInt(cookieJar.get(ID_SYNC_TIMESTAMP) || 0, 36);
          return nowInHours > timestamp;
        };
      };

      var createIdSyncs = function(config, logger, cookieJar) {
        return {
          process: createProcessor(config, logger, cookieJar),
          hasExpired: createExpiryChecker(cookieJar)
        };
      };

      var ERROR_MESSAGE = "Invalid customer ID format.";
      var NOT_AN_OBJECT_ERROR = "Each namespace should be an object.";
      var NO_ID_ERROR = "Each namespace object should have an ID.";

      var validateCustomerIds = function validateCustomerIds(customerIds) {
        if (!isObject(customerIds)) {
          throw new Error(ERROR_MESSAGE + " " + NOT_AN_OBJECT_ERROR);
        }

        Object.keys(customerIds).forEach(function(customerId) {
          if (!isObject(customerIds[customerId])) {
            throw new Error(ERROR_MESSAGE + " " + NOT_AN_OBJECT_ERROR);
          }

          if (!customerIds[customerId].id) {
            throw new Error(ERROR_MESSAGE + " " + NO_ID_ERROR);
          }
        });
      };

      var sortObjectKeyNames = function sortObjectKeyNames(object) {
        return Object.keys(object)
          .sort()
          .reduce(function(newObject, key) {
            newObject[key] = object[key];
            return newObject;
          }, {});
      };

      var normalizeCustomerIds = function normalizeCustomerIds(customerIds) {
        var sortedCustomerIds = sortObjectKeyNames(customerIds);
        return Object.keys(sortedCustomerIds).reduce(function(
          normalizedIds,
          customerId
        ) {
          var _sortedCustomerIds$cu = sortedCustomerIds[customerId],
            id = _sortedCustomerIds$cu.id,
            authState = _sortedCustomerIds$cu.authState;
          var authStates = values(AUTH_STATES);
          normalizedIds[customerId] = {
            id: id,
            authState: includes(authStates, authState)
              ? authState
              : AUTH_STATES.UNKNOWN
          };
          return normalizedIds;
        },
        {});
      };

      var CUSTOMER_ID_HASH = COOKIE_NAMES.CUSTOMER_ID_HASH;
      var processCustomerIds = function(customerIds) {
        var normalizedCustomerIds = normalizeCustomerIds(customerIds);
        var checksum = crc32(JSON.stringify(normalizedCustomerIds)).toString(
          36
        );
        return {
          detectCustomerIdChange: function detectCustomerIdChange(cookieJar) {
            return checksum !== cookieJar.get(CUSTOMER_ID_HASH);
          },
          updateChecksum: function updateChecksum(cookieJar) {
            return cookieJar.set(CUSTOMER_ID_HASH, checksum);
          },
          getNormalizedAndHashedIds: function getNormalizedAndHashedIds() {
            var idNames = Object.keys(normalizedCustomerIds);
            var idsToHash = idNames.filter(function(idName) {
              return customerIds[idName].hash;
            });
            var idHashPromises = idsToHash.map(function(id) {
              return convertStringToSha256Buffer(normalizedCustomerIds[id].id);
            });
            return Promise.all(idHashPromises).then(function(hashedIds) {
              return hashedIds.reduce(function(normalizedIds, hashedId, index) {
                normalizedIds[idsToHash[index]].id = convertBufferToHex(
                  hashedId
                );
                return normalizedIds;
              }, normalizedCustomerIds);
            });
          }
        };
      };

      var makeServerCall = function makeServerCall(
        payload,
        lifecycle,
        network
      ) {
        return lifecycle.onBeforeDataCollection(payload).then(function() {
          return network.sendRequest(payload, payload.expectsResponse);
        });
      };

      var _setCustomerIds = function(
        ids,
        cookieJar,
        lifecycle,
        network,
        optIn
      ) {
        validateCustomerIds(ids);
        var event = createEvent(); // FIXME: We shouldn't need an event.

        event.mergeData({}); // FIXME: We shouldn't need an event.

        var payload = network.createPayload();
        payload.addEvent(event); // FIXME: We shouldn't need an event.

        var customerIds = assign({}, ids);
        var customerIdsProcess = processCustomerIds(customerIds);
        var customerIdChanged = customerIdsProcess.detectCustomerIdChange(
          cookieJar
        );
        customerIdsProcess
          .getNormalizedAndHashedIds()
          .then(function(normalizedAndHashedIds) {
            var idNames = Object.keys(normalizedAndHashedIds);
            idNames.forEach(function(idName) {
              payload.addIdentity(idName, normalizedAndHashedIds[idName]);
            });
            payload.mergeMeta({
              identity: {
                customerIdChanged: customerIdChanged
              }
            });

            if (customerIdChanged) {
              customerIdsProcess.updateChecksum(cookieJar);
            }

            return lifecycle
              .onBeforeEvent(event, {}, false) // FIXME: We shouldn't need an event.
              .then(function() {
                return optIn.whenOptedIn();
              })
              .then(function() {
                return makeServerCall(payload, lifecycle, network);
              });
          });
      };

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
      var EXPERIENCE_CLOUD_ID = COOKIE_NAMES.EXPERIENCE_CLOUD_ID;

      var addIdsContext = function addIdsContext(payload, ecid) {
        // TODO: Add customer ids.
        payload.addIdentity(EXPERIENCE_CLOUD_ID, {
          id: ecid
        });
      };

      var createIdentity = function createIdentity(_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          cookieJar = _ref.cookieJar;

        // We avoid reading the ECID from the cookie right away, because we
        // need to wait for the user to opt in first.
        var _getEcid = function getEcid() {
          return cookieJar.get(EXPERIENCE_CLOUD_ID);
        };

        var optIn;
        var deferredForEcid;
        var network;
        var lifecycle;
        var idSyncs = createIdSyncs(config, logger, cookieJar);
        var alreadyQueriedForIdSyncs = false;
        return {
          lifecycle: {
            onComponentsRegistered: function onComponentsRegistered(tools) {
              lifecycle = tools.lifecycle;
              network = tools.network;
              optIn = tools.optIn;
              // This is a way for the ECID data element in the Reactor extension
              // to get the ECID synchronously since data elements are required
              // to be synchronous.
              config.reactorRegisterGetEcid(function() {
                return optIn.isOptedIn() ? _getEcid() : undefined;
              });
            },
            // Waiting for opt-in because we'll be reading the ECID from a cookie
            onBeforeEvent: function onBeforeEvent(event) {
              return optIn.whenOptedIn().then(function() {
                if (
                  !alreadyQueriedForIdSyncs &&
                  config.idSyncsEnabled &&
                  idSyncs.hasExpired()
                ) {
                  alreadyQueriedForIdSyncs = true;
                  var identityQuery = {
                    identity: {
                      exchange: true
                    }
                  };

                  if (config.idSyncContainerId !== undefined) {
                    identityQuery.identity.containerId =
                      config.idSyncContainerId;
                  }

                  event.mergeQuery(identityQuery);
                }
              });
            },
            // Waiting for opt-in because we'll be reading the ECID from a cookie
            // TO-DOCUMENT: We wait for ECID before trigger any events.
            onBeforeDataCollection: function onBeforeDataCollection(payload) {
              return optIn.whenOptedIn().then(function() {
                var ecid = _getEcid();

                var promise;

                if (ecid) {
                  addIdsContext(payload, ecid);
                } else if (deferredForEcid) {
                  // We don't have an ECID, but the first request has gone out to
                  // fetch it. We must wait for the response to come back with the
                  // ECID before we can apply it to this payload.
                  logger.log(
                    "Delaying request while retrieving ECID from server."
                  );
                  promise = deferredForEcid.promise.then(function() {
                    logger.log("Resuming previously delayed request.");
                    addIdsContext(payload, _getEcid());
                  });
                } else {
                  // We don't have an ECID and no request has gone out to fetch it.
                  // We won't apply the ECID to this request, but we'll set up a
                  // promise so that future requests can know when the ECID has returned.
                  deferredForEcid = defer();
                  payload.expectResponse();
                }

                return promise;
              });
            },
            // Waiting for opt-in because we'll be writing the ECID to a cookie
            onResponse: function onResponse(response) {
              return optIn.whenOptedIn().then(function() {
                var ecidPayloads = response.getPayloadsByType(
                  "identity:persist"
                );

                if (ecidPayloads.length > 0) {
                  cookieJar.set(EXPERIENCE_CLOUD_ID, ecidPayloads[0].id);

                  if (deferredForEcid) {
                    deferredForEcid.resolve();
                  }
                }

                idSyncs.process(
                  response.getPayloadsByType("identity:exchange")
                );
              });
            }
          },
          commands: {
            getEcid: function getEcid() {
              return optIn.whenOptedIn().then(_getEcid);
            },
            // TODO: Discuss renaming of CustomerIds to UserIds
            setCustomerIds: function setCustomerIds(options) {
              return optIn.whenOptedIn().then(function() {
                return _setCustomerIds(
                  options,
                  cookieJar,
                  lifecycle,
                  network,
                  optIn
                );
              });
            }
          }
        };
      };

      createIdentity.namespace = "Identity";
      createIdentity.abbreviation = "ID";
      createIdentity.configValidators = {
        idSyncsEnabled: {
          defaultValue: true
        },
        idSyncContainerId: {
          validate: nonNegativeInteger
        }
      }; // Not much need to validate since we are our own consumer.

      createIdentity.configValidators.reactorRegisterGetEcid = {
        defaultValue: function defaultValue() {}
      };

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
      var processDestinations = function(_ref) {
        var destinations = _ref.destinations,
          config = _ref.config,
          logger = _ref.logger;

        if (!config.destinationsEnabled) {
          return;
        }

        var urlDestinations = destinations
          .filter(function(dest) {
            return dest.type === "url";
          })
          .map(function(dest) {
            return assign(
              {
                id: dest.id
              },
              dest.spec
            );
          });

        if (urlDestinations.length) {
          fireDestinations({
            logger: logger,
            destinations: urlDestinations
          });
        }

        var cookieDestinations = destinations
          .filter(function(dest) {
            return dest.type === "cookie";
          })
          .map(function(dest) {
            return dest.spec;
          });
        cookieDestinations.forEach(function(dest) {
          cookie.set(dest.name, dest.value || "", {
            domain: dest.domain || "",
            expires: dest.ttlDays ? dest.ttlDays : 10 // days
          });
        });
      };

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

      var createAudiences = function createAudiences(_ref) {
        var config = _ref.config,
          logger = _ref.logger;
        return {
          lifecycle: {
            onBeforeEvent: function onBeforeEvent(event, options, isViewStart) {
              if (isViewStart) {
                event.expectResponse();
              }
            },
            onResponse: function onResponse(response) {
              var destinations = response.getPayloadsByType("activation:push");
              processDestinations({
                destinations: destinations,
                config: config,
                logger: logger
              });
            }
          },
          commands: {}
        };
      };

      createAudiences.namespace = "Audiences";
      createAudiences.abbreviation = "AU";
      createAudiences.configValidators = {
        destinationsEnabled: {
          defaultValue: true
        }
      };

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
      var createFragment = function(content) {
        return createNode(
          DIV,
          {},
          {
            innerHTML: content
          }
        );
      };

      var css_escape = createCommonjsModule(function(module, exports) {
        (function(root, factory) {
          // https://github.com/umdjs/umd/blob/master/returnExports.js
          {
            // For Node.js.
            module.exports = factory(root);
          }
        })(
          typeof commonjsGlobal != "undefined"
            ? commonjsGlobal
            : commonjsGlobal,
          function(root) {
            if (root.CSS && root.CSS.escape) {
              return root.CSS.escape;
            } // https://drafts.csswg.org/cssom/#serialize-an-identifier

            var cssEscape = function(value) {
              if (arguments.length == 0) {
                throw new TypeError("`CSS.escape` requires an argument.");
              }

              var string = String(value);
              var length = string.length;
              var index = -1;
              var codeUnit;
              var result = "";
              var firstCodeUnit = string.charCodeAt(0);

              while (++index < length) {
                codeUnit = string.charCodeAt(index); // Note: there’s no need to special-case astral symbols, surrogate
                // pairs, or lone surrogates.
                // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
                // (U+FFFD).

                if (codeUnit == 0x0000) {
                  result += "\uFFFD";
                  continue;
                }

                if (
                  // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
                  // U+007F, […]
                  (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
                  codeUnit == 0x007f || // If the character is the first character and is in the range [0-9]
                  // (U+0030 to U+0039), […]
                  (index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) || // If the character is the second character and is in the range [0-9]
                  // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                  (index == 1 &&
                    codeUnit >= 0x0030 &&
                    codeUnit <= 0x0039 &&
                    firstCodeUnit == 0x002d)
                ) {
                  // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
                  result += "\\" + codeUnit.toString(16) + " ";
                  continue;
                }

                if (
                  // If the character is the first character and is a `-` (U+002D), and
                  // there is no second character, […]
                  index == 0 &&
                  length == 1 &&
                  codeUnit == 0x002d
                ) {
                  result += "\\" + string.charAt(index);
                  continue;
                } // If the character is not handled by one of the above rules and is
                // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
                // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
                // U+005A), or [a-z] (U+0061 to U+007A), […]

                if (
                  codeUnit >= 0x0080 ||
                  codeUnit == 0x002d ||
                  codeUnit == 0x005f ||
                  (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
                  (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
                  (codeUnit >= 0x0061 && codeUnit <= 0x007a)
                ) {
                  // the character itself
                  result += string.charAt(index);
                  continue;
                } // Otherwise, the escaped character.
                // https://drafts.csswg.org/cssom/#escape-a-character

                result += "\\" + string.charAt(index);
              }

              return result;
            };

            if (!root.CSS) {
              root.CSS = {};
            }

            root.CSS.escape = cssEscape;
            return cssEscape;
          }
        );
      });

      var CSS_IDENTIFIER_PATTERN = /(#|\.)(-?\w+)/g; // This is required to remove leading " > " from parsed pieces

      var SIBLING_PATTERN = /^\s*>?\s*/;
      var EQ_START = ":eq(";
      var EQ_PATTERN = /:eq\((\d+)\)/g;

      var cleanUp = function cleanUp(str) {
        return str.replace(SIBLING_PATTERN, "").trim();
      };

      var isNotEqSelector = function isNotEqSelector(str) {
        return str.indexOf(EQ_START) === -1;
      }; // Here we use CSS.escape() to make sure we get
      // correct values for ID and CSS class
      // Please check:  https://www.w3.org/TR/css-syntax-3/#escaping
      // CSS.escape() polyfill can be found here: https://github.com/mathiasbynens/CSS.escape

      var replaceIdentifier = function replaceIdentifier(_, $1, $2) {
        return "" + $1 + css_escape($2);
      };

      var escapeIdentifiersInSelector = function escapeIdentifiersInSelector(
        selector
      ) {
        return selector.replace(CSS_IDENTIFIER_PATTERN, replaceIdentifier);
      };
      var parseSelector = function parseSelector(rawSelector) {
        var result = [];
        var selector = escapeIdentifiersInSelector(rawSelector.trim());
        var parts = selector.split(EQ_PATTERN).filter(isNonEmptyString);
        var length = parts.length;
        var i = 0;

        while (i < length) {
          var sel = cleanUp(parts[i]);
          var eq = parts[i + 1];

          if (eq) {
            result.push({
              sel: sel,
              eq: Number(eq)
            });
          } else {
            result.push({
              sel: sel
            });
          }

          i += 2;
        }

        return result;
      };
      /**
       * Returns an array of matched DOM nodes.
       * @param {String} selector that contains Sizzle "eq(...)" pseudo selector
       * @param {Node} doc, defaults to document
       * @returns {Array} an array of DOM nodes
       */

      var selectNodesWithEq = function selectNodesWithEq(selector) {
        var doc =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : document;

        if (isNotEqSelector(selector)) {
          return selectNodes(selector, doc);
        }

        var parts = parseSelector(selector);
        var length = parts.length;
        var result = [];
        var context = doc;
        var i = 0;

        while (i < length) {
          var _parts$i = parts[i],
            sel = _parts$i.sel,
            eq = _parts$i.eq;
          var nodes = selectNodes(sel, context);
          var nodesCount = nodes.length;

          if (nodesCount === 0) {
            break;
          }

          if (eq != null && eq > nodesCount - 1) {
            break;
          }

          if (i < length - 1) {
            if (eq == null) {
              var _nodes = _slicedToArray(nodes, 1);

              context = _nodes[0];
            } else {
              context = nodes[eq];
            }
          }

          if (i === length - 1) {
            if (eq == null) {
              result = nodes;
            } else {
              result = [nodes[eq]];
            }
          }

          i += 1;
        }

        return result;
      };

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

      /**
       * Returns an array of matched DOM nodes.
       * @param {String} id
       * @param {Node} [context=document] defaults to document
       * @returns {HTMLElement} an element of null
       */
      var getElementById = function(id) {
        var context =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : document;
        return context.getElementById(id);
      };

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
      var setAttribute = function(element, name, value) {
        element.setAttribute(name, value);
      };

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
      var getAttribute = function(element, name) {
        return element.getAttribute(name);
      };

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
      var removeAttribute = function(element, name) {
        element.removeAttribute(name);
      };

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
      var setStyle = function(element, name, value, priority) {
        var css;

        if (priority) {
          css = name + ":" + value + " !" + priority + ";";
        } else {
          css = name + ":" + value + ";";
        }

        element.style.cssText += ";" + css;
      };

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
      var getParent = function(element) {
        return element.parentNode;
      };

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
      var getNextSibling = function(element) {
        return element.nextElementSibling;
      };

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
      var insertAfter = function(container, element) {
        if (!container) {
          return;
        }

        var parent = getParent(container);

        if (parent) {
          parent.insertBefore(element, getNextSibling(container));
        }
      };

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
      var insertBefore = function(container, element) {
        if (!container) {
          return;
        }

        var parent = getParent(container);

        if (parent) {
          parent.insertBefore(element, container);
        }
      };

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
      var getChildren = function(element) {
        var children = element.children;

        if (children) {
          return toArray(children);
        }

        return [];
      };

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
      var getChildNodes = function(element) {
        var childNodes = element.childNodes;

        if (childNodes) {
          return toArray(childNodes);
        }

        return [];
      };

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
      var getFirstChild = function(element) {
        return element.firstElementChild;
      };

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
      var PREHIDING_ID = "alloy-prehiding";
      var HIDING_STYLE_DEFINITION = "{ visibility: hidden }"; // Using global is OK since we have a single DOM
      // so storing nodes even for multiple Alloy instances is fine

      var styleNodes = {};
      var hideElements = function hideElements(prehidingSelector) {
        // if we have different events with the same
        // prehiding selector we don't want to recreate
        // the style tag
        if (styleNodes[prehidingSelector]) {
          return;
        }

        var attrs = {};
        var props = {
          textContent: prehidingSelector + " " + HIDING_STYLE_DEFINITION
        };
        var node = createNode(STYLE, attrs, props);
        appendNode(document.head, node);
        styleNodes[prehidingSelector] = node;
      };
      var showElements = function showElements(prehidingSelector) {
        var node = styleNodes[prehidingSelector];

        if (node) {
          removeNode(node);
          delete styleNodes[prehidingSelector];
        }
      };
      var hideContainers = function hideContainers(prehidingStyle) {
        if (!prehidingStyle) {
          return;
        } // If containers prehiding style has been added
        // by customer's prehiding snippet we don't
        // want to add the same node

        var node = getElementById(PREHIDING_ID);

        if (node) {
          return;
        }

        var attrs = {
          id: PREHIDING_ID
        };
        var props = {
          textContent: prehidingStyle
        };
        var styleNode = createNode(STYLE, attrs, props);
        appendNode(document.head, styleNode);
      };
      var showContainers = function showContainers() {
        // If containers prehiding style exists
        // we will remove it
        var node = getElementById(PREHIDING_ID);

        if (!node) {
          return;
        }

        removeNode(node);
      };

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
      var elementExists = function(settings, trigger) {
        var selector = settings.selector,
          prehidingSelector = settings.prehidingSelector;
        hideElements(prehidingSelector);
        awaitSelector(selector, selectNodesWithEq)
          .then(function(elements) {
            trigger({
              elements: elements,
              prehidingSelector: prehidingSelector
            });
          })
          .catch(function() {
            // in case of awaiting timing out we
            // need to remove the style tag
            // hence showing the nodes
            showElements(prehidingSelector);
          });
      };

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
      var setText = function(container, text) {
        container.textContent = text;
      };

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
      var isImage = function isImage(element) {
        return element.tagName === IMG;
      };
      var loadImage = function loadImage(url) {
        return createNode(IMG, {
          src: url
        });
      };
      var loadImages = function loadImages(fragment) {
        var images = selectNodes(IMG, fragment);
        images.forEach(function(image) {
          var url = getAttribute(image, SRC);

          if (url) {
            loadImage(url);
          }
        });
      };

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

      var is = function is(element, tagName) {
        return element.tagName === tagName;
      };

      var isInlineScript = function isInlineScript(element) {
        return is(element, SCRIPT) && !getAttribute(element, SRC);
      };

      var isRemoteScript = function isRemoteScript(element) {
        return is(element, SCRIPT) && getAttribute(element, SRC);
      };

      var getInlineScripts = function getInlineScripts(fragment) {
        var scripts = selectNodes(SCRIPT, fragment);
        var result = [];
        var length = scripts.length;
        var i = 0;
        /* eslint-disable no-continue */

        for (i = 0; i < length; i += 1) {
          var element = scripts[i];

          if (!isInlineScript(element)) {
            continue;
          }

          var textContent = element.textContent;

          if (!textContent) {
            continue;
          }

          result.push(
            createNode(
              SCRIPT,
              {},
              {
                textContent: textContent
              }
            )
          );
        }
        /* eslint-enable no-continue */

        return result;
      };

      var getRemoteScriptsUrls = function getRemoteScriptsUrls(fragment) {
        var scripts = selectNodes(SCRIPT, fragment);
        var result = [];
        var length = scripts.length;
        var i = 0;
        /* eslint-disable no-continue */

        for (i = 0; i < length; i += 1) {
          var element = scripts[i];

          if (!isRemoteScript(element)) {
            continue;
          }

          var url = getAttribute(element, SRC);

          if (!url) {
            continue;
          }

          result.push(url);
        }
        /* eslint-enable no-continue */

        return result;
      };

      var executeInlineScripts = function executeInlineScripts(
        container,
        fragment,
        func
      ) {
        var scripts = getInlineScripts(fragment);
        scripts.forEach(function(script) {
          return func(container, script);
        });
      };
      var executeRemoteScripts = function executeRemoteScripts(fragment) {
        var urls = getRemoteScriptsUrls(fragment);
        return Promise.all(urls.map(loadScript));
      };

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
      var appendHtml = function(container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        loadImages(fragment);
        elements.forEach(function(element) {
          appendNode(container, element);
        });
        executeInlineScripts(container, fragment, appendNode);
        return executeRemoteScripts(fragment);
      };

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

      var clear = function clear(container) {
        // We want to remove ALL nodes, text, comments etc
        var childNodes = getChildNodes(container);
        childNodes.forEach(removeNode);
      };

      var setHtml = function(container, html) {
        clear(container);
        appendHtml(container, html);
      };

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
      var prependHtml = function(container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        var length = elements.length;
        var i = length - 1; // We have to proactively load images to avoid flicker

        loadImages(fragment); // We are inserting elements in reverse order

        while (i >= 0) {
          var element = elements[i];
          var firstChild = getFirstChild(container);
          insertBefore(firstChild, element);
          i -= 1;
        }

        executeInlineScripts(container, fragment, appendNode);
        return executeRemoteScripts(fragment);
      };

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
      var insertHtmlBefore = function(container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment); // We have to proactively load images to avoid flicker

        loadImages(fragment);
        elements.forEach(function(element) {
          insertBefore(container, element);
        });
        executeInlineScripts(container, fragment, insertBefore);
        return executeRemoteScripts(fragment);
      };

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
      var replaceHtml = function(container, html) {
        insertHtmlBefore(container, html);
        removeNode(container);
      };

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
      var insertHtmlAfter = function(container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        loadImages(fragment);
        elements.forEach(function(element) {
          insertAfter(container, element);
        });
        executeInlineScripts(container, fragment, insertAfter);
        return executeRemoteScripts(fragment);
      };

      var setStyles = function(container, styles) {
        var priority = styles.priority,
          style = _objectWithoutProperties(styles, ["priority"]);

        Object.keys(style).forEach(function(key) {
          setStyle(container, key, style[key], priority);
        });
      };

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
      var setAttributes = function(container, attributes) {
        Object.keys(attributes).forEach(function(key) {
          setAttribute(container, key, attributes[key]);
        });
      };

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
      var swapImage = function(container, url) {
        if (!isImage(container)) {
          return;
        } // Start downloading the image

        loadImage(url); // Remove "src" so there is no flicker

        removeAttribute(container, SRC); // Replace the image "src"

        setAttribute(container, SRC, url);
      };

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
      var rearrangeChildren = function(container, _ref) {
        var from = _ref.from,
          to = _ref.to;
        var children = getChildren(container);
        var elementFrom = children[from];
        var elementTo = children[to];

        if (!elementFrom || !elementTo) {
          // TODO: We will need to add logging
          // to ease troubleshooting
          return;
        }

        if (from < to) {
          insertAfter(elementTo, elementFrom);
        } else {
          insertBefore(elementTo, elementFrom);
        }
      };

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
      var createAction = function createAction(collect, renderFunc) {
        return function(settings, event) {
          var elements = event.elements,
            prehidingSelector = event.prehidingSelector;
          var content = settings.content,
            meta = settings.meta;
          var executions = elements.map(function(element) {
            return Promise.resolve(renderFunc(element, content));
          });
          return Promise.all(executions)
            .then(function() {
              // Success, unhide elements and notify
              showElements(prehidingSelector);
              collect(meta);
            })
            .catch(function() {
              // Something went horribly wrong, unhide elements
              showElements(prehidingSelector);
            });
        };
      };

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
      var initRuleComponentModules = function(collect) {
        return {
          elementExists: elementExists,
          setHtml: createAction(collect, setHtml),
          customCode: createAction(collect, setHtml),
          setText: createAction(collect, setText),
          setAttribute: createAction(collect, setAttributes),
          setImageSource: createAction(collect, swapImage),
          setStyle: createAction(collect, setStyles),
          move: createAction(collect, setStyles),
          resize: createAction(collect, setStyles),
          rearrange: createAction(collect, rearrangeChildren),
          remove: createAction(collect, removeNode),
          insertAfter: createAction(collect, insertHtmlAfter),
          insertBefore: createAction(collect, insertHtmlBefore),
          replaceHtml: createAction(collect, replaceHtml),
          prependHtml: createAction(collect, prependHtml),
          appendHtml: createAction(collect, appendHtml)
        };
      };

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
      var buildRuleExecutionOrder = function buildRuleExecutionOrder(rules) {
        var ruleEventPairs = [];
        rules.forEach(function(rule) {
          if (!rule.events) {
            return;
          }

          rule.events.forEach(function(event) {
            ruleEventPairs.push({
              rule: rule,
              event: event
            });
          });
        });
        return ruleEventPairs;
      };

      var isConditionMet = function isConditionMet(condition, result) {
        return (result && !condition.negate) || (!result && condition.negate);
      };

      var executeRules = function(rules, ruleComponentModules, logger) {
        var eventModulesInitialized = false;
        var triggerCallQueue = [];

        var executeModule = function executeModule(moduleType, args) {
          var ruleComponentModule = ruleComponentModules[moduleType];

          if (!ruleComponentModule) {
            throw new Error(
              'Rule component module "' + moduleType + '" not found'
            );
          }

          return ruleComponentModule.apply(void 0, _toConsumableArray(args));
        };

        var getErrorMessage = function getErrorMessage(
          ruleComponent,
          rule,
          errorMessage,
          errorStack
        ) {
          return (
            "Failed to execute " +
            ruleComponent.moduleType +
            " for " +
            rule.name +
            " rule. " +
            errorMessage +
            " " +
            (errorStack ? "\n " + errorStack : "")
          );
        };

        var logActionError = function logActionError(action, rule, e) {
          logger.error(getErrorMessage(action, rule, e.message, e.stack));
        };

        var logConditionError = function logConditionError(condition, rule, e) {
          logger.error(getErrorMessage(condition, rule, e.message, e.stack));
        };

        var logConditionNotMet = function logConditionNotMet(condition, rule) {
          logger.log(
            "Condition " +
              condition.moduleType +
              " for rule " +
              rule.name +
              " not met."
          );
        };

        var logRuleCompleted = function logRuleCompleted(rule) {
          logger.log("Rule " + rule.name + " fired.");
        };

        var runActions = function runActions(rule, syntheticEvent) {
          if (!rule.actions) {
            return;
          }

          var action;

          for (var i = 0; i < rule.actions.length; i += 1) {
            action = rule.actions[i];

            try {
              executeModule(action.moduleType, [
                action.settings,
                syntheticEvent
              ]);
            } catch (e) {
              logActionError(action, rule, e);
              return;
            }
          }

          logRuleCompleted(rule);
        };

        var checkConditions = function checkConditions(rule, syntheticEvent) {
          if (!rule.conditions) {
            return;
          }

          var condition;

          for (var i = 0; i < rule.conditions.length; i += 1) {
            condition = rule.conditions[i];

            try {
              var result = executeModule(condition.moduleType, [
                condition.settings,
                syntheticEvent
              ]);

              if (!isConditionMet(condition, result)) {
                logConditionNotMet(condition, rule);
                return;
              }
            } catch (e) {
              logConditionError(condition, rule, e);
              return;
            }
          }

          runActions(rule, syntheticEvent);
        };

        var initEventModule = function initEventModule(ruleEventPair) {
          var rule = ruleEventPair.rule,
            event = ruleEventPair.event;

          try {
            var trigger = function trigger(syntheticEvent) {
              if (!eventModulesInitialized) {
                triggerCallQueue.push(trigger.bind(null, syntheticEvent));
                return;
              }

              checkConditions(rule, syntheticEvent);
            };

            executeModule(event.moduleType, [event.settings, trigger]);
          } catch (e) {
            logger.error(getErrorMessage(event, rule, e.message, e.stack));
          }
        };

        buildRuleExecutionOrder(rules).forEach(initEventModule);
        eventModulesInitialized = true;
        triggerCallQueue.forEach(function(triggerCall) {
          return triggerCall();
        });
        triggerCallQueue = null;
      };

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
      var PAGE_HANDLE = "personalization:page";
      var SESSION_ID_COOKIE = "SID";
      var SESSION_ID_TTL_IN_MINUTES = 31 * 60 * 1000;
      var EVENT_COMMAND = "event";

      var isElementExists = function isElementExists(event) {
        return event.moduleType === "elementExists";
      };

      var getOrCreateSessionId = function getOrCreateSessionId(cookieJar) {
        var cookieValue = cookieJar.get(SESSION_ID_COOKIE);
        var now = Date.now();
        var expires = now + SESSION_ID_TTL_IN_MINUTES;

        if (!cookieValue || now > cookieValue.expires) {
          cookieValue = {
            value: v4_1(),
            expires: expires
          };
        } else {
          cookieValue.expires = expires;
        } // We have to extend session ID lifetime

        cookieJar.set(SESSION_ID_COOKIE, cookieValue);
        return cookieValue.value;
      };

      var hideElementsForPage = function hideElementsForPage(fragments) {
        fragments.forEach(function(fragment) {
          var _fragment$rules = fragment.rules,
            rules = _fragment$rules === void 0 ? [] : _fragment$rules;
          rules.forEach(function(rule) {
            var _rule$events = rule.events,
              events = _rule$events === void 0 ? [] : _rule$events;
            var filteredEvents = events.filter(isElementExists);
            filteredEvents.forEach(function(event) {
              var _event$settings = event.settings,
                settings = _event$settings === void 0 ? {} : _event$settings;
              var prehidingSelector = settings.prehidingSelector;

              if (prehidingSelector) {
                hideElements(prehidingSelector);
              }
            });
          });
        });
      };

      var executeFragments = function executeFragments(
        fragments,
        modules,
        logger
      ) {
        fragments.forEach(function(fragment) {
          var _fragment$rules2 = fragment.rules,
            rules = _fragment$rules2 === void 0 ? [] : _fragment$rules2;

          if (isNonEmptyArray(rules)) {
            executeRules(rules, modules, logger);
          }
        });
      };

      var createCollect = function createCollect(collect) {
        return function(payload) {
          var id = v4_1();
          var timestamp = Date.now();
          var notification = Object.assign({}, payload, {
            id: id,
            timestamp: timestamp
          });
          var personalization = {
            notification: notification
          };
          collect({
            meta: {
              personalization: personalization
            }
          });
        };
      };

      var createPersonalization = function createPersonalization(_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          cookieJar = _ref.cookieJar;
        var authoringModeEnabled = config.authoringModeEnabled,
          prehidingStyle = config.prehidingStyle;
        var ruleComponentModules;
        var optIn;
        return {
          lifecycle: {
            onComponentsRegistered: function onComponentsRegistered(tools) {
              var componentRegistry = tools.componentRegistry;
              optIn = tools.optIn;
              var collect = componentRegistry.getCommand(EVENT_COMMAND);
              ruleComponentModules = initRuleComponentModules(
                createCollect(collect)
              );
            },
            onBeforeEvent: function onBeforeEvent(event, options, isViewStart) {
              if (authoringModeEnabled) {
                logger.warn("Rendering is disabled, authoring mode.");
                event.mergeQuery({
                  personalization: {
                    enabled: false
                  }
                });
                return Promise.resolve();
              }

              if (!isViewStart) {
                // If NOT isViewStart disable personalization
                event.mergeQuery({
                  personalization: {
                    enabled: false
                  }
                });
              } else {
                event.expectResponse(); // For viewStart we try to hide the personalization containers

                hideContainers(prehidingStyle);
              }

              return optIn.whenOptedIn().then(function() {
                var sessionId = getOrCreateSessionId(cookieJar); // Session ID is required both for data fetching and
                // data collection call

                event.mergeMeta({
                  personalization: {
                    sessionId: sessionId
                  }
                });
              });
            },
            onResponse: function onResponse(response) {
              if (authoringModeEnabled) {
                return;
              }

              var fragments = response.getPayloadsByType(PAGE_HANDLE); // On response we first hide all the elements for
              // personalization:page handle

              hideElementsForPage(fragments); // Once the all element are hidden
              // we have to show the containers

              showContainers();
              executeFragments(fragments, ruleComponentModules, logger);
            },
            onResponseError: function onResponseError() {
              showContainers();
            }
          }
        };
      };

      createPersonalization.namespace = "Personalization";
      createPersonalization.abbreviation = "PE";
      createPersonalization.configValidators = {
        prehidingStyle: {
          validate: eitherNilOrNonEmpty
        },
        authoringModeEnabled: {
          defaultValue: false,
          validate: boolean
        }
      };

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
      var webFactory = function(window, topFrameSetProvider) {
        var topFrameSet;
        return function(event) {
          topFrameSet = topFrameSet || topFrameSetProvider();
          event.mergeWeb({
            webPageDetails: {
              URL: window.location.href || window.location
            },
            webReferrer: {
              URL: topFrameSet.document.referrer
            }
          });
        };
      };

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
      var getScreenOrientationViaProperty = function getScreenOrientationViaProperty(
        window
      ) {
        var orientation = window.screen.orientation;

        if (orientation == null || orientation.type == null) {
          return null;
        }

        var parts = orientation.type.split("-");

        if (parts.length === 0) {
          return null;
        }

        if (parts[0] !== "portrait" && parts[0] !== "landscape") {
          return null;
        }

        return parts[0];
      };

      var getScreenOrientationViaMediaQuery = function getScreenOrientationViaMediaQuery(
        window
      ) {
        if (window.matchMedia("(orientation: portrait)").matches) {
          return "portrait";
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
          return "landscape";
        }

        return null;
      };

      var deviceFactory = function(window) {
        return function(event) {
          var _window$screen = window.screen,
            width = _window$screen.width,
            height = _window$screen.height;
          var device = {
            screenHeight: height,
            screenWidth: width
          };
          var orientation =
            getScreenOrientationViaProperty(window) ||
            getScreenOrientationViaMediaQuery(window);

          if (orientation) {
            device.screenOrientation = orientation;
          }

          return event.mergeDevice(device);
        };
      };

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
      var environmentFactory = function(window) {
        return function(event) {
          var innerWidth = window.innerWidth,
            innerHeight = window.innerHeight,
            navigator = window.navigator;
          var environment = {
            type: "browser",
            browserDetails: {
              viewportWidth: innerWidth,
              viewportHeight: innerHeight
            }
          }; // not all browsers support navigator.connection.effectiveType

          if (
            navigator &&
            navigator.connection &&
            navigator.connection.effectiveType
          ) {
            environment.connectionType = navigator.connection.effectiveType;
          }

          event.mergeEnvironment(environment);
        };
      };

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
      var placeContextFactory = function(dateProvider) {
        return function(event) {
          var date = dateProvider();
          var placeContext = {
            localTime: toISOStringLocal(date),
            localTimezoneOffset: date.getTimezoneOffset()
          };
          event.mergePlaceContext(placeContext);
        };
      };

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
      var topFrameSetFactory = function(window) {
        return function() {
          var topFrameSet = window;
          var _topFrameSet = topFrameSet,
            location = _topFrameSet.location;

          try {
            var _topFrameSet2 = topFrameSet,
              parent = _topFrameSet2.parent;

            while (
              parent &&
              parent.location &&
              location &&
              String(parent.location) !== String(location) &&
              topFrameSet.location &&
              String(parent.location) !== String(topFrameSet.location) &&
              parent.location.host === location.host
            ) {
              topFrameSet = parent;
              var _topFrameSet3 = topFrameSet;
              parent = _topFrameSet3.parent;
            }
          } catch (e) {
            // default to whatever topFrameSet is set
          }

          return topFrameSet;
        };
      };

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
      var timestampFactory = function(dateProvider) {
        return function(event) {
          var date = dateProvider();
          event.timestamp = date.toISOString();
        };
      };

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
      var createComponent = function(
        config,
        logger,
        availableContexts,
        requiredContexts
      ) {
        var configuredContexts;
        return {
          namespace: "Context",
          lifecycle: {
            onComponentsRegistered: function onComponentsRegistered() {
              var configuredContextNames = [];

              if (Array.isArray(config.context)) {
                configuredContextNames = config.context;
              } else {
                logger.warn(
                  "Invalid configured context. Please specify an array of strings."
                );
              }

              configuredContexts = configuredContextNames
                .filter(function(configuredContextName) {
                  if (!availableContexts[configuredContextName]) {
                    logger.warn(
                      "Configured context " +
                        configuredContextName +
                        " is not available."
                    );
                    return false;
                  }

                  return true;
                })
                .map(function(configuredContextName) {
                  return availableContexts[configuredContextName];
                })
                .concat(requiredContexts);
            },
            onBeforeEvent: function onBeforeEvent(event) {
              configuredContexts.forEach(function(context) {
                return context(event);
              });
            }
          }
        };
      };

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
      var topFrameSetProvider = topFrameSetFactory(window);
      var web = webFactory(window, topFrameSetProvider);
      var device = deviceFactory(window);
      var environment = environmentFactory(window);
      var placeContext = placeContextFactory(function() {
        return new Date();
      });
      var timestamp = timestampFactory(function() {
        return new Date();
      });

      var createContext = function createContext(_ref) {
        var config = _ref.config,
          logger = _ref.logger;
        return createComponent(
          config,
          logger,
          {
            web: web,
            device: device,
            environment: environment,
            placeContext: placeContext
          },
          [timestamp]
        );
      };

      createContext.namespace = "Context";
      createContext.abbreviation = "CO";
      createContext.configValidators = {
        context: {
          defaultValue: ["web", "device", "environment", "placeContext"]
        }
      };

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

      var throwInvalidPurposesError = function throwInvalidPurposesError(
        purposes
      ) {
        throw new Error(
          'Opt-in purposes must be "all" or "none". Received: ' + purposes
        );
      };

      var createPrivacy = function createPrivacy(_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          enableOptIn = _ref.enableOptIn,
          cookieJar = _ref.cookieJar;

        var _optIn;

        if (config.optInEnabled) {
          enableOptIn(logger, cookieJar);
        }

        return {
          lifecycle: {
            onComponentsRegistered: function onComponentsRegistered(tools) {
              _optIn = tools.optIn;
            }
          },
          commands: {
            optIn: function optIn(_ref2) {
              var purposes = _ref2.purposes;

              if (config.optInEnabled) {
                if (isString(purposes)) {
                  var lowerCasePurposes = purposes.toLowerCase();

                  if (
                    lowerCasePurposes === _optIn.ALL ||
                    lowerCasePurposes === _optIn.NONE
                  ) {
                    _optIn.setPurposes(purposes);
                  } else {
                    throwInvalidPurposesError(purposes);
                  }
                } else {
                  throwInvalidPurposesError(purposes);
                }
              } else {
                logger.warn(
                  "optInEnabled must be set to true before using the optIn command."
                );
              }
            }
          }
        };
      };

      createPrivacy.namespace = "Privacy";
      createPrivacy.abbreviation = "PR";
      createPrivacy.configValidators = {
        optInEnabled: {
          defaultValue: false,
          validate: boolean
        }
      };

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

      var createEventMerge = function createEventMerge(_ref) {
        var config = _ref.config;
        // This is a way for the Event Merge ID data element in the Reactor extension
        // to get an event merge ID synchronously since data elements are required
        // to be synchronous.
        config.reactorRegisterCreateEventMergeId(v4_1);
        return {
          lifecycle: {
            onBeforeEvent: function onBeforeEvent(event, options) {
              return Promise.resolve(options.eventMergeId).then(function(
                eventMergeId
              ) {
                if (eventMergeId !== undefined) {
                  event.eventMergeId = eventMergeId;
                }
              });
            }
          },
          commands: {
            createEventMergeId: v4_1
          }
        };
      };

      createEventMerge.namespace = "EventMerge";
      createEventMerge.abbreviation = "EM";
      createEventMerge.configValidators = {}; // Not much need to validate since we are our own consumer.

      createEventMerge.configValidators.reactorRegisterCreateEventMergeId = {
        defaultValue: function defaultValue() {}
      };

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
      var createLibraryInfo = function createLibraryInfo() {
        return {
          commands: {
            getLibraryInfo: function getLibraryInfo() {
              return {
                // The value will be swapped with the proper version
                // at build time.
                version: "0.0.1-alpha.7"
              };
            }
          }
        };
      };

      createLibraryInfo.namespace = "LibraryInfo";
      createLibraryInfo.abbreviation = "LI";

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
      // TODO: Figure out how sub-components will be made available/registered

      var componentCreators = [
        createDataCollector,
        createIdentity,
        createAudiences,
        createPersonalization,
        createContext,
        createPrivacy,
        createEventMerge,
        createLibraryInfo
      ]; // eslint-disable-next-line no-underscore-dangle

      var namespaces = window.__alloyNS;
      var createNamespacedStorage = storageFactory(window);
      var console; // When running within the Reactor extension, we want logging to be
      // toggled when Reactor logging is toggled. The easiest way to do
      // this is to pipe our log messages through the Reactor logger.

      console = turbine.logger;

      if (namespaces) {
        namespaces.forEach(function(namespace) {
          var logController = createLogController(
            namespace,
            createNamespacedStorage
          );
          var logger = createLogger(
            console,
            logController,
            "[" + namespace + "]"
          );
          var initializeComponents = initializeComponentsFactory(
            componentCreators,
            logger,
            createNamespacedStorage,
            createCookieProxy,
            createComponentNamespacedCookieJar,
            createLifecycle,
            createComponentRegistry,
            createNetwork$1,
            createOptIn
          );
          var instance = createInstance(
            namespace,
            initializeComponents,
            logController,
            logger,
            window
          );
          var queue = window[namespace].q;
          queue.push = instance;
          queue.forEach(instance);
        });
      }
    })();
  }
};

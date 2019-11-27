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

  'use strict';

  if (document.documentMode && document.documentMode < 11) {
    console.warn('The Adobe Experience Cloud Web SDK does not support IE 10 and below.');
  } else {
    (function() {

      function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

      var assign = _interopDefault(require('@adobe/reactor-object-assign'));
      var cookie = _interopDefault(require('@adobe/reactor-cookie'));
      var queryString = _interopDefault(require('@adobe/reactor-query-string'));
      var loadScript = _interopDefault(require('@adobe/reactor-load-script'));

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
      var instanceFactory = (function (executeCommand) {
        return function (args) {
          // Would use destructuring, but destructuring doesn't work on IE
          // without polyfilling Symbol.
          // https://github.com/babel/babel/issues/7597
          var resolve = args[0];
          var reject = args[1];
          var userProvidedArgs = args[2];
          var commandName = userProvidedArgs[0];
          var options = userProvidedArgs[1];
          executeCommand(commandName, options).then(resolve, reject);
        };
      });

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
      var assignIf = (function (target, source, predicate) {
        if (predicate()) {
          assign(target, source);
        }

        return target;
      });

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
      var clone = (function (value) {
        return JSON.parse(JSON.stringify(value));
      });

      var convertBufferToHex = (function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (item) {
          return ("00" + item.toString(16)).slice(-2);
        }).join("");
      });

      var encodeText = function encodeText(str) {
        if (window.TextEncoder) {
          return new TextEncoder("utf-8").encode(str);
        } // IE 11, which doesn't have TextEncoder


        var cleanString = unescape(encodeURIComponent(str));
        return new Uint8Array(cleanString.split("").map(function (char) {
          return char.charCodeAt(0);
        }));
      };

      var convertStringToSha256Buffer = (function (message) {
        var data = encodeText(message);
        var crypto = window.msCrypto || window.crypto;
        var result = crypto.subtle.digest("SHA-256", data);

        if (result.then) {
          return result;
        } // IE 11, whose result is a CryptoOperation object instead of a promise


        return new Promise(function (resolve, reject) {
          result.addEventListener("complete", function () {
            resolve(result.result);
          });
          result.addEventListener("error", function () {
            reject();
          });
        });
      });

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
      var convertTimes = (function (fromUnit, toUnit, amount) {
        return fromUnit * amount / toUnit;
      });

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
      var isNil = (function (value) {
        return value == null;
      });

      function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function (obj) {
            return typeof obj;
          };
        } else {
          _typeof = function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly) symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
          keys.push.apply(keys, symbols);
        }

        return keys;
      }

      function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};

          if (i % 2) {
            ownKeys(source, true).forEach(function (key) {
              _defineProperty(target, key, source[key]);
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys(source).forEach(function (key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
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
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }

        return target;
      }

      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
      }

      function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
      }

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

          return arr2;
        }
      }

      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }

      function _iterableToArray(iter) {
        if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
      }

      function _iterableToArrayLimit(arr, i) {
        if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
          return;
        }

        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
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
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }

      /**
       * Returns whether the value is an object.
       * @param {*} value
       * @returns {boolean}
       */

      var isObject = (function (value) {
        return !isNil(value) && !Array.isArray(value) && _typeof(value) === "object";
      });

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
        Object.keys(source).forEach(function (key) {
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


      var deepAssign = (function (target) {
        if (isNil(target)) {
          throw new TypeError('deepAssign "target" cannot be null or undefined');
        }

        var result = Object(target);

        for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          sources[_key - 1] = arguments[_key];
        }

        sources.forEach(function (source) {
          return deepAssignObject(result, Object(source));
        });
        return result;
      });

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

      var createMerger = (function (content, key) {
        return function (updates) {
          // eslint-disable-next-line no-param-reassign
          content[key] = content[key] || {};
          deepAssign(content[key], updates);
        };
      });

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
      var crc32 = function () {
        var table = [];

        for (var i = 0; i < 256; i++) {
          var c = i;

          for (var j = 0; j < 8; j++) {
            c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
          }

          table.push(c);
        }

        return function (str, crc) {
          str = unescape(encodeURIComponent(str));
          if (!crc) crc = 0;
          crc = crc ^ -1;

          for (var _i = 0; _i < str.length; _i++) {
            var y = (crc ^ str.charCodeAt(_i)) & 0xff;
            crc = crc >>> 8 ^ table[y];
          }

          crc = crc ^ -1;
          return crc >>> 0;
        };
      }();

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
      var defer = (function () {
        var deferred = {};
        deferred.promise = new Promise(function (resolve, reject) {
          deferred.resolve = resolve;
          deferred.reject = reject;
        });
        return deferred;
      });

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
      var executeWithRetry = (function (fn) {
        var maxRetries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
        var retryCount = 0;

        var execute = function execute() {
          return fn().catch(function (e) {
            if (retryCount < maxRetries) {
              retryCount += 1;
              return execute();
            }

            throw e;
          });
        };

        return execute();
      });

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
      var appendNode = (function (parent, node) {
        return parent.appendChild(node);
      });

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
      var createNode = (function (tag) {
        var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var children = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        var doc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document;
        var result = doc.createElement(tag);
        Object.keys(attrs).forEach(function (key) {
          result.setAttribute(key, attrs[key]);
        });
        Object.keys(props).forEach(function (key) {
          result[key] = props[key];
        });
        children.forEach(function (child) {
          return appendNode(result, child);
        });
        return result;
      });

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

      var fireImage = (function (_ref) {
        var src = _ref.src,
          _ref$currentDocument = _ref.currentDocument,
          currentDocument = _ref$currentDocument === void 0 ? document : _ref$currentDocument;
        return new Promise(function (resolve, reject) {
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
      });

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
      var isFunction = (function (value) {
        return typeof value === "function";
      });

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
      var isNonEmptyArray = (function (value) {
        return Array.isArray(value) && value.length > 0;
      });

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
      var toArray = (function (value) {
        if (Array.isArray(value)) {
          return value;
        }

        if (value == null) {
          return [];
        }

        return [].slice.call(value);
      });

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

      var selectNodes = (function (selector) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
        return toArray(context.querySelectorAll(selector));
      });

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
      var awaitUsingMutationObserver = function awaitUsingMutationObserver(win, doc, selector, timeout, selectFunc) {
        return createPromise(function (resolve, reject) {
          var mutationObserver = new win[MUTATION_OBSERVER](function () {
            var nodes = selectFunc(selector);

            if (isNonEmptyArray(nodes)) {
              mutationObserver.disconnect();
              resolve(nodes);
            }
          });
          setTimeout(function () {
            mutationObserver.disconnect();
            reject(createError(selector));
          }, timeout);
          mutationObserver.observe(doc, MUTATION_OBSERVER_CONFIG);
        });
      };
      var canUseRequestAnimationFrame = function canUseRequestAnimationFrame(doc) {
        return doc[VISIBILITY_STATE] === VISIBLE;
      };
      var awaitUsingRequestAnimation = function awaitUsingRequestAnimation(win, selector, timeout, selectFunc) {
        return createPromise(function (resolve, reject) {
          var execute = function execute() {
            var nodes = selectFunc(selector);

            if (isNonEmptyArray(nodes)) {
              resolve(nodes);
              return;
            }

            win[RAF](execute);
          };

          execute();
          setTimeout(function () {
            reject(createError(selector));
          }, timeout);
        });
      };
      var awaitUsingTimer = function awaitUsingTimer(selector, timeout, selectFunc) {
        return createPromise(function (resolve, reject) {
          var execute = function execute() {
            var nodes = selectFunc(selector);

            if (isNonEmptyArray(nodes)) {
              resolve(nodes);
              return;
            }

            setTimeout(execute, DELAY);
          };

          execute();
          setTimeout(function () {
            reject(createError(selector));
          }, timeout);
        });
      };
      var awaitSelector = (function (selector) {
        var selectFunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : selectNodes;
        var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_POLLING_TIMEOUT;
        var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
        var doc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : document;
        var nodes = selectFunc(selector);

        if (isNonEmptyArray(nodes)) {
          return Promise.resolve(nodes);
        }

        if (canUseMutationObserver(win)) {
          return awaitUsingMutationObserver(win, doc, selector, timeout, selectFunc);
        }

        if (canUseRequestAnimationFrame(doc)) {
          return awaitUsingRequestAnimation(win, selector, timeout, selectFunc);
        }

        return awaitUsingTimer(selector, timeout, selectFunc);
      });

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
       * Returns true if element matches the selector.
       * @param {String} selector
       * @param {Node} [element]
       * @returns {Boolean}
       */
      var matchesSelector = (function (selector, element) {
        if (element.matches) {
          return element.matches(selector);
        } // Making IE 11 happy


        return element.msMatchesSelector(selector);
      });

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
      var removeNode = (function (node) {
        var parent = node.parentNode;

        if (parent) {
          return parent.removeChild(node);
        }

        return null;
      });

      var fireOnPage = fireImage;
      var IFRAME_ATTRS = {
        name: "Adobe Destinationing iFrame",
        class: "adobe-iframe",
        style: "display: none; width: 0; height: 0;"
      };

      var createFilterResultBySucceeded = function createFilterResultBySucceeded(succeeded) {
        return function (result) {
          return result.succeeded === succeeded;
        };
      };

      var mapResultToDest = function mapResultToDest(result) {
        return result.dest;
      };

      var fireDestinations = (function (_ref) {
        var logger = _ref.logger,
          destinations = _ref.destinations;
        var iframePromise;

        var createIframe = function createIframe() {
          if (!iframePromise) {
            iframePromise = awaitSelector(BODY).then(function (_ref2) {
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
          return createIframe().then(function (iframe) {
            var currentDocument = iframe.contentWindow.document;
            return fireImage({
              src: src,
              currentDocument: currentDocument
            });
          });
        };

        return Promise.all(destinations.map(function (dest) {
          var imagePromise = dest.hideReferrer ? fireInIframe({
            src: dest.url
          }) : fireOnPage({
            src: dest.url
          });
          return imagePromise.then(function () {
            logger.log("Destination succeeded:", dest.url);
            return {
              succeeded: true,
              dest: dest
            };
          }).catch(function () {
            logger.log("Destination failed:", dest.url);
            return {
              succeeded: false,
              dest: dest
            };
          });
        })).then(function (results) {
          if (iframePromise) {
            iframePromise.then(function (iframe) {
              return removeNode(iframe);
            });
          }

          return {
            succeeded: results.filter(createFilterResultBySucceeded(true)).map(mapResultToDest),
            failed: results.filter(createFilterResultBySucceeded(false)).map(mapResultToDest)
          };
        });
      });

      var flatMap = (function (array, mapFunction) {
        return Array.prototype.concat.apply([], array.map(mapFunction));
      });

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
      var getLastArrayItems = (function (arr, itemCount) {
        return arr.slice(-itemCount);
      });

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
      var baseNamespace = "com.adobe.alloy.";

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
      var cookieName = baseNamespace + "getTld";
      /**
       * Retrieves the top-most domain that is able to accept cookies. This will
       * be the top-most domain that is not a "public suffix" as outlined
       * in https://publicsuffix.org/
       * @param {Object} window
       * @param {Object} cookieJar
       * @returns {string}
       */

      var getTopLevelCookieDomain = (function (window, cookieJar) {
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
      });

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
      var includes = (function (arr, item) {
        return arr.indexOf(item) !== -1;
      });

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

      var intersection = (function (a, b) {
        return a.filter(function (x) {
          return includes(b, x);
        });
      });

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
      var isBoolean = (function (value) {
        return typeof value === "boolean";
      });

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
       * Returns whether the value is an empty object.
       * @param {*} value
       * @returns {boolean}
       */

      var isEmptyObject = (function (value) {
        return isObject(value) && Object.keys(value).length === 0;
      });

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
      var isNumber = (function (value) {
        return typeof value === "number" && !isNaN(value);
      });

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

      var isInteger = (function (value) {
        var parsed = parseInt(value, 10);
        return isNumber(parsed) && value === parsed;
      });

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
      var isString = (function (value) {
        return typeof value === "string";
      });

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

      var isNonEmptyString = (function (value) {
        return isString(value) && value.length > 0;
      });

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
      var memoize = (function (fn, keyResolver) {
        var map = new Map();
        return function () {
          var key = keyResolver ? keyResolver.apply(void 0, arguments) : arguments.length <= 0 ? undefined : arguments[0];

          if (map.has(key)) {
            return map.get(key);
          }

          var result = fn.apply(void 0, arguments);
          map.set(key, result);
          return result;
        };
      });

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
       * A function that performs no operations.
       */
      var noop = (function () {});

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
      var padStart = (function (string, targetLength, padString) {
        var originalString = String(string);
        var repeatedPadString = String(padString);

        if (originalString.length >= targetLength || repeatedPadString.length === 0) {
          return originalString;
        }

        var lengthToAdd = targetLength - originalString.length;

        while (lengthToAdd > repeatedPadString.length) {
          repeatedPadString += repeatedPadString;
        }

        return repeatedPadString.slice(0, lengthToAdd) + originalString;
      });

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
       * Creates and returns a new error using the provided value as a message.
       * If the provided value is already an Error, it will be returned unmodified.
       * @param {*} value
       * @returns {Error}
       */
      var toError = (function (value) {
        return value instanceof Error ? value : new Error(value);
      });

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

      var stackError = (function (message, error) {
        var stackedError = toError(error);
        stackedError.message = message + "\nCaused by: " + stackedError.message;
        return stackedError;
      });

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

      var getStorageByType = function getStorageByType(context, storageType, namespace) {
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
              return context[storageType].getItem(namespace + name);
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
              context[storageType].setItem(namespace + name, value);
              return true;
            } catch (e) {
              return false;
            }
          }
        };
      };

      var storageFactory = (function (context) {
        return function (additionalNamespace) {
          var finalNamespace = baseNamespace + additionalNamespace;
          return {
            session: getStorageByType(context, "sessionStorage", finalNamespace),
            persistent: getStorageByType(context, "localStorage", finalNamespace)
          };
        };
      });

      var stringToBoolean = (function (str) {
        return isString(str) && (str.toLowerCase() === "true" || str === "1");
      });

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

      var toISOStringLocal = (function (date) {
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
        return YYYY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + "." + mmm + ts + th + ":" + tm;
      });

      var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

      function createCommonjsModule(fn, module) {
        return module = { exports: {} }, fn(module, module.exports), module.exports;
      }

      var rngBrowser = createCommonjsModule(function (module) {
        // Unique ID creation requires a high quality random # generator.  In the
        // browser this is a little complicated due to unknown quality of Math.random()
        // and inconsistent support for the `crypto` API.  We do the best we can via
        // feature-detection
        // getRandomValues needs to be invoked in a context where "this" is a Crypto
        // implementation. Also, find the complete implementation of crypto on IE11.
        var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);

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
              rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
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

        return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
      }

      var bytesToUuid_1 = bytesToUuid;

      function v4(options, buf, offset) {
        var i = buf && offset || 0;

        if (typeof options == 'string') {
          buf = options === 'binary' ? new Array(16) : null;
          options = null;
        }

        options = options || {};
        var rnds = options.random || (options.rng || rngBrowser)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

        rnds[6] = rnds[6] & 0x0f | 0x40;
        rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

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
      var values = (function (obj) {
        return Object.keys(obj).map(function (key) {
          return obj[key];
        });
      });

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


      var createCookieProxy = (function (name, expires, domain) {
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
            deserializedCookie = serializedCookie && safeJSONParse(serializedCookie, name);
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
      });

      var createComponentNamespacedCookieJar = (function (cookieProxy, componentNamespace) {
        if (!isNonEmptyString(componentNamespace)) {
          throw Error("No cookie namespace.  Please define 'abbreviation' on the component.");
        }

        return {
          /**
           * Returns a value from the Alloy cookie for a given key.
           * @param {string} key
           */
          get: function get(key) {
            var currentCookie = cookieProxy.get();
            return currentCookie && currentCookie[componentNamespace] && currentCookie[componentNamespace][key];
          },

          /**
           * Sets a value in the Alloy cookie for a given key.
           * @param {string} key
           * @param {string} value
           */
          set: function set(key, value) {
            var currentCookie = cookieProxy.get() || {};

            var updatedCookie = _objectSpread2({}, currentCookie, _defineProperty({}, componentNamespace, _objectSpread2({}, currentCookie[componentNamespace], _defineProperty({}, key, value))));

            cookieProxy.set(updatedCookie);
          },

          /**
           * Removes a value from the Alloy cookie for a given key.
           * @param {string} key
           */
          remove: function remove(key) {
            var currentCookie = cookieProxy.get();

            if (currentCookie && currentCookie[componentNamespace]) {
              var updatedCookie = _objectSpread2({}, currentCookie, _defineProperty({}, componentNamespace, _objectSpread2({}, currentCookie[componentNamespace])));

              delete updatedCookie[componentNamespace][key];
              cookieProxy.set(updatedCookie);
            }
          }
        };
      });

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
      var debugQueryParam = "alloy_debug";

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
      var createLogController = (function (_ref) {
        var console = _ref.console,
          locationSearch = _ref.locationSearch,
          createLogger = _ref.createLogger,
          instanceNamespace = _ref.instanceNamespace,
          createNamespacedStorage = _ref.createNamespacedStorage;
        var loggerPrefix = "[" + instanceNamespace + "]";
        var parsedQueryString = queryString.parse(locationSearch);
        var storage = createNamespacedStorage("instance." + instanceNamespace + ".");
        var debugEnabled = storage.session.getItem("debug") === "true";
        var debugEnabledWritableFromConfig = true;

        var getDebugEnabled = function getDebugEnabled() {
          return debugEnabled;
        };

        var setDebugEnabled = function setDebugEnabled(value, _ref2) {
          var fromConfig = _ref2.fromConfig;

          if (!fromConfig || debugEnabledWritableFromConfig) {
            debugEnabled = value;
          }

          if (!fromConfig) {
            // Web storage only allows strings, so we explicitly convert to string.
            storage.session.setItem("debug", value.toString());
            debugEnabledWritableFromConfig = false;
          }
        };

        if (parsedQueryString[debugQueryParam] !== undefined) {
          setDebugEnabled(stringToBoolean(parsedQueryString[debugQueryParam]), {
            fromConfig: false
          });
        }

        return {
          setDebugEnabled: setDebugEnabled,
          logger: createLogger(console, getDebugEnabled, loggerPrefix),
          createComponentLogger: function createComponentLogger(componentNamespace) {
            return createLogger(console, getDebugEnabled, loggerPrefix + " [" + componentNamespace + "]");
          }
        };
      });

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
// TO-DOCUMENT: Lifecycle hooks and their params.
      var hookNames = ["onComponentsRegistered", "onBeforeEvent", "onResponse", "onResponseError", "onBeforeDataCollection", "onClick"];

      var createHook = function createHook(componentRegistry, hookName) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return Promise.all(componentRegistry.getLifecycleCallbacks(hookName).map(function (callback) {
            return new Promise(function (resolve) {
              resolve(callback.apply(void 0, args));
            });
          })).then(function () {// Prevent potential callback return values from being exposed beyond
            // this point. Return values from callbacks shouldn't be relied on.
          });
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
        return function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return Promise.resolve().then(function () {
            return fn.apply(void 0, args);
          });
        };
      };

      var createLifecycle = (function (componentRegistry) {
        return hookNames.reduce(function (memo, hookName) {
          memo[hookName] = guardHook(createHook(componentRegistry, hookName));
          return memo;
        }, {});
      });

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

      var wrapForErrorHandling = function wrapForErrorHandling(fn, stackMessage) {
        return function () {
          var result;

          try {
            result = fn.apply(void 0, arguments);
          } catch (error) {
            throw stackError(stackMessage, error);
          }

          if (result instanceof Promise) {
            result = result.catch(function (error) {
              throw stackError(stackMessage, error);
            });
          }

          return result;
        };
      }; // TO-DOCUMENT: All public commands and their signatures.


      var createComponentRegistry = (function () {
        var commandsByName = {};
        var lifecycleCallbacksByName = {};

        var registerComponentCommands = function registerComponentCommands(namespace) {
          var componentCommandsByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var conflictingCommandNames = intersection(Object.keys(commandsByName), Object.keys(componentCommandsByName));

          if (conflictingCommandNames.length) {
            throw new Error("[ComponentRegistry] Could not register " + namespace + " " + ("because it has existing command(s): " + conflictingCommandNames.join(",")));
          }

          Object.keys(componentCommandsByName).forEach(function (commandName) {
            var command = componentCommandsByName[commandName];
            commandsByName[commandName] = wrapForErrorHandling(command, "[" + namespace + "] An error occurred while executing the " + commandName + " command.");
          });
        };

        var registerLifecycleCallbacks = function registerLifecycleCallbacks(namespace) {
          var componentLifecycleCallbacksByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          Object.keys(componentLifecycleCallbacksByName).forEach(function (hookName) {
            lifecycleCallbacksByName[hookName] = lifecycleCallbacksByName[hookName] || [];
            lifecycleCallbacksByName[hookName].push(wrapForErrorHandling(componentLifecycleCallbacksByName[hookName], "[" + namespace + "] An error occurred while executing the " + hookName + " lifecycle hook."));
          });
        };

        return {
          register: function register(namespace, component) {
            var commands = component.commands,
              lifecycle = component.lifecycle;
            registerComponentCommands(namespace, commands);
            registerLifecycleCallbacks(namespace, lifecycle);
          },
          getCommand: function getCommand(commandName) {
            return commandsByName[commandName];
          },
          getLifecycleCallbacks: function getLifecycleCallbacks(hookName) {
            return lifecycleCallbacksByName[hookName] || [];
          }
        };
      });

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
      var createPayload = (function () {
        var content = {};
        var expectsResponse = false;
        var shouldUseIdThirdPartyDomain = false;
        return {
          addIdentity: function addIdentity(namespaceCode, identity) {
            content.xdm = content.xdm || {};
            content.xdm.identityMap = content.xdm.identityMap || {};
            content.xdm.identityMap[namespaceCode] = content.xdm.identityMap[namespaceCode] || [];
            content.xdm.identityMap[namespaceCode].push(identity);
          },
          addEvent: function addEvent(event) {
            content.events = content.events || [];
            expectsResponse = expectsResponse || event.expectsResponse;
            content.events.push(event.toJSON());
          },
          mergeMeta: createMerger(content, "meta"),
          useIdThirdPartyDomain: function useIdThirdPartyDomain() {
            shouldUseIdThirdPartyDomain = true;
          },

          get shouldUseIdThirdPartyDomain() {
            return shouldUseIdThirdPartyDomain;
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
      });

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

      var createResponse = (function () {
        var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          requestId: "",
          handle: []
        };
        // TODO: Should we freeze the response to prevent change by Components?
        // Object.freeze(response.handle.map(h => Object.freeze(h)));
        return {
          getPayloadsByType: function getPayloadsByType(type) {
            var _content$handle = content.handle,
              handle = _content$handle === void 0 ? [] : _content$handle;
            return flatMap(handle.filter(function (fragment) {
              return fragment.type === type;
            }), function (fragment) {
              return fragment.payload;
            });
          },
          toJSON: function toJSON() {
            return content;
          } // TODO: Maybe consider the following API as well?
          // - getPayloadsByAction

        };
      });

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
      var EDGE_DOMAIN = "beta.adobedc.net";
      var ID_THIRD_PARTY_DOMAIN = "adobedc.demdex.net";

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
      var createNetwork = (function (_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          lifecycle = _ref.lifecycle,
          networkStrategy = _ref.networkStrategy;

        var handleResponse = function handleResponse(requestId, responseBody) {
          var parsedBody;

          try {
            parsedBody = JSON.parse(responseBody);
          } catch (e) {
            throw new Error("Error parsing server response.\n" + e + "\nResponse body: " + responseBody);
          }

          logger.log("Request " + requestId + ": Received response.", parsedBody);
          var response = createResponse(parsedBody);
          return lifecycle.onResponse({
            response: response,
            requestId: requestId
          }).then(function () {
            return response;
          });
        };

        var edgeDomain = config.edgeDomain,
          edgeBasePath = config.edgeBasePath,
          configId = config.configId;
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
           * @param {Object} [options]
           * @param {boolean} [options.expectsResponse=true] The endpoint and request mechanism
           * will be determined by whether a response is expected.
           * @param {boolean} [options.documentUnloading=false] This determines the network transport method.
           * When the document is unloading, sendBeacon is used, otherwise fetch is used.
           * @returns {Promise} a promise resolved with the response object once the response is
           * completely processed.  If expectsResponse==false, the promise will be resolved
           * with undefined.
           */
          sendRequest: function sendRequest(payload) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var _options$expectsRespo = options.expectsResponse,
              expectsResponse = _options$expectsRespo === void 0 ? true : _options$expectsRespo,
              _options$documentUnlo = options.documentUnloading,
              documentUnloading = _options$documentUnlo === void 0 ? false : _options$documentUnlo,
              _options$useIdThirdPa = options.useIdThirdPartyDomain,
              useIdThirdPartyDomain = _options$useIdThirdPa === void 0 ? false : _options$useIdThirdPa;
            var requestId = v4_1();

            if (documentUnloading) {
              logger.log("No response requested due to document unloading.");
            }

            var reallyExpectsResponse = documentUnloading ? false : expectsResponse;
            return Promise.resolve().then(function () {
              var action = reallyExpectsResponse ? "interact" : "collect";
              var domain = useIdThirdPartyDomain ? ID_THIRD_PARTY_DOMAIN : edgeDomain;
              var baseUrl = "https://" + domain;
              var url = baseUrl + "/" + edgeBasePath + "/" + apiVersion + "/" + action + "?configId=" + configId + "&requestId=" + requestId;
              var responseHandlingMessage = reallyExpectsResponse ? "" : " (no response is expected)";
              var stringifiedPayload = JSON.stringify(payload); // We want to log raw payload and event data rather than
              // our fancy wrapper objects. Calling payload.toJSON() is
              // insufficient to get all the nested raw data, because it's
              // not recursive (it doesn't call toJSON() on the event objects).
              // Parsing the result of JSON.stringify(), however, gives the
              // fully recursive raw data.
              // JSON.parse is expensive so we short circuit if logging is disabled.

              if (logger.enabled) {
                logger.log("Request " + requestId + ": Sending request" + responseHandlingMessage + ".", JSON.parse(stringifiedPayload));
              }

              return executeWithRetry(function () {
                return networkStrategy(url, stringifiedPayload, documentUnloading);
              }, 3);
            }).catch(function (error) {
              throw stackError("Network request failed.", error);
            }).then(function (responseBody) {
              var handleResponsePromise;

              if (reallyExpectsResponse) {
                handleResponsePromise = handleResponse(requestId, responseBody);
              }

              return handleResponsePromise;
            }).catch(function (error) {
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

              return lifecycle.onResponseError({
                error: error,
                requestId: requestId
              }).then(throwError, throwError);
            });
          }
        };
      });

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
        ALLOY_OPT_IN_COOKIE_NAME: "adobe_alloy_optIn",
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

      var ALLOY_OPT_IN_COOKIE_NAME = cookieDetails.ALLOY_OPT_IN_COOKIE_NAME; // The user has opted into all purposes.

      var ALL = "all"; // The user has opted into no purposes.

      var NONE = "none"; // The user has yet to provide opt-in purposes.

      var PENDING = "pending";
      var createOptIn = (function (_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          cookieJar = _ref.cookieJar,
          createOrgNamespacedCookieName = _ref.createOrgNamespacedCookieName;
        var deferredsAwaitingResolution = [];
        var purposes = ALL;
        var cookieName = createOrgNamespacedCookieName(ALLOY_OPT_IN_COOKIE_NAME, config.orgId);

        if (config.optInEnabled) {
          purposes = cookieJar.get(cookieName) || PENDING;
        }

        if (purposes === PENDING) {
          logger.warn("Some commands may be delayed until the user opts in.");
        }

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
           * Update the purposes the user has opted into. Only to be called by the
           * Privacy component.
           * @param {string} newPurposes Can be "all" or "none".
           */
          setPurposes: function setPurposes(newPurposes) {
            purposes = newPurposes;
            cookieJar.set(cookieName, newPurposes);
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
           * The user opts into no purposes, the promise will be rejected.
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
      });

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
      var createEvent = (function () {
        var content = {};
        var userXdm;
        var userData;
        var expectsResponse = false;
        var _documentUnloading = false;
        var lastChanceCallback = noop;
        var event = {
          set userXdm(value) {
            userXdm = value;
          },

          set userData(value) {
            userData = value;
          },

          mergeXdm: createMerger(content, "xdm"),
          mergeMeta: createMerger(content, "meta"),
          mergeQuery: createMerger(content, "query"),
          documentUnloading: function documentUnloading() {
            _documentUnloading = true;
          },

          get isDocumentUnloading() {
            return _documentUnloading;
          },

          expectResponse: function expectResponse() {
            expectsResponse = true;
          },

          get expectsResponse() {
            return expectsResponse;
          },

          isEmpty: function isEmpty() {
            return isEmptyObject(content) && (!userXdm || isEmptyObject(userXdm)) && (!userData || isEmptyObject(userData));
          },

          set lastChanceCallback(value) {
            lastChanceCallback = value;
          },

          toJSON: function toJSON() {
            if (userXdm) {
              event.mergeXdm(userXdm);
            }

            if (userData) {
              content.data = userData;
            }

            var xdm = clone(Object(content.xdm));
            var data = clone(Object(content.data));

            try {
              lastChanceCallback({
                xdm: xdm,
                data: data
              }); // If onBeforeEventSend throws an exception,
              // we don't want to apply the changes it made
              // so setting content.xdm and content.data is inside this try
              // We only set content.xdm if content.xdm was already set or
              // if content.xdm was empty and the lastChanceCallback added items to it.

              if (content.xdm || !isEmptyObject(xdm)) {
                content.xdm = xdm;
              }

              if (content.data || !isEmptyObject(data)) {
                content.data = data;
              }
            } catch (e) {// the callback should have already logged the exeception
            }

            return content;
          }
        };
        return event;
      });

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
      var executeCommandFactory = (function (_ref) {
        var logger = _ref.logger,
          configureCommand = _ref.configureCommand,
          debugCommand = _ref.debugCommand,
          handleError = _ref.handleError;
        var configurePromise;

        var getExecutor = function getExecutor(commandName, options) {
          var execute;

          if (commandName === "configure") {
            if (configurePromise) {
              throw new Error("The library has already been configured and may only be configured once.");
            }

            execute = function execute() {
              configurePromise = configureCommand(options);
              return configurePromise;
            };
          } else {
            if (!configurePromise) {
              throw new Error("The library must be configured first. Please do so by executing the configure command.");
            }

            if (commandName === "log") {
              execute = function execute() {
                return debugCommand(options);
              };
            } else {
              execute = function execute() {
                return configurePromise.then(function (componentRegistry) {
                  var command = componentRegistry.getCommand(commandName);

                  if (!isFunction(command)) {
                    throw new Error("The " + commandName + " command does not exist.");
                  }

                  return command(options);
                }, function () {
                  logger.warn("An error during configuration is preventing the " + commandName + " command from executing."); // If configuration failed, we prevent the configuration
                  // error from bubbling here because we don't want the
                  // configuration error to be reported in the console every
                  // time any command is executed. Only having it bubble
                  // once when the configure command runs is sufficient.
                  // Instead, for this command, we'll just return a promise
                  // that never gets resolved.

                  return new Promise(function () {});
                });
              };
            }
          }

          return execute;
        };

        return function (commandName) {
          var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          return new Promise(function (resolve) {
            // We have to wrap the getExecutor() call in the promise so the promise
            // will be rejected if getExecutor() throws errors.
            var execute = getExecutor(commandName, options);
            logger.log("Executing " + commandName + " command.", "Options:", options);
            resolve(execute());
          }).catch(handleError);
        };
      });

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
        var eventManager = _ref.eventManager;
        return {
          commands: {
            event: function event(options) {
              var xdm = options.xdm;
              var data = options.data,
                _options$viewStart = options.viewStart,
                viewStart = _options$viewStart === void 0 ? false : _options$viewStart,
                _options$documentUnlo = options.documentUnloading,
                documentUnloading = _options$documentUnlo === void 0 ? false : _options$documentUnlo,
                type = options.type,
                mergeId = options.mergeId;
              var event = eventManager.createEvent();

              if (documentUnloading) {
                event.documentUnloading();
              }

              if (type || mergeId) {
                xdm = Object(xdm);
              }

              if (type) {
                assign(xdm, {
                  eventType: type
                });
              }

              if (mergeId) {
                assign(xdm, {
                  eventMergeId: mergeId
                });
              }

              event.userXdm = xdm;
              event.userData = data;
              return eventManager.sendEvent(event, {
                isViewStart: viewStart
              });
            }
          }
        };
      };

      createDataCollector.namespace = "DataCollector";
      createDataCollector.abbreviation = "DC";
      createDataCollector.configValidators = {};

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
      var createClickHandler = function createClickHandler(eventManager, lifecycle) {
        return function (clickEvent) {
          // TODO: Consider safeguarding from the same object being clicked multiple times in rapid succession?
          var clickedElement = clickEvent.target;
          var event = eventManager.createEvent();
          lifecycle.onClick({
            event: event,
            clickedElement: clickedElement
          }).then(function () {
            if (event.isEmpty()) {
              return;
            }

            eventManager.sendEvent(event);
          });
        };
      };

      var attachClickActivityCollector = (function (config, eventManager, lifecycle) {
        var enabled = config.clickCollectionEnabled;

        if (!enabled) {
          return;
        }

        var clickHandler = createClickHandler(eventManager, lifecycle);
        document.addEventListener("click", clickHandler, true);
      });

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
      var createExpected = (function (message) {
        return function (isValid, key, value) {
          return isValid ? "" : "'" + key + "': Expected " + message + ", but got '" + value + "'.";
        };
      });

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
      var expected = createExpected("true or false");
      var booleanValidator = (function (key, currentValue) {
        return expected(isBoolean(currentValue), key, currentValue);
      });

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
      var chain = (function (validator, other) {
        var additionalMethods = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        var newValidator = function newValidator() {
          var error = validator.apply(void 0, arguments);
          return error || other.apply(void 0, arguments);
        };

        assign(newValidator, validator, additionalMethods);
        return newValidator;
      });

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
      var arrayExpected = createExpected("an array");
      var elementExpected = createExpected("all elements of the array to be defined");
      var arrayOfValidator = (function (elementValidator) {
        return function (key, currentValue) {
          return arrayExpected(Array.isArray(currentValue), key, currentValue) || currentValue.reduce(function (error, value, i) {
            var arrayKey = key + "[" + i + "]";
            return error || elementExpected(value != null, arrayKey, value) || elementValidator(arrayKey, value);
          }, "");
        };
      });

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
      var createMinimumValidator = (function (minimum) {
        return function (key, currentValue) {
          var expected = createExpected("a value greater than or equal to " + minimum);
          return expected(currentValue >= minimum, key, currentValue);
        };
      });

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
      var expected$1 = createExpected("a unique value across instances");
      var createUniqueValidator = (function () {
        var values = [];
        return function (key, currentValue) {
          if (values.indexOf(currentValue) >= 0) {
            return expected$1(false, key, currentValue);
          }

          values.push(currentValue);
          return "";
        };
      });

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
      var expected$2 = createExpected("a valid domain");
      var domainValidator = (function (key, currentValue) {
        return expected$2(/^[a-z0-9-.]{1,}$/gi.test(currentValue), key, currentValue);
      });

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
      var expected$3 = createExpected("a function");
      var callbackValidator = (function (key, value) {
        return expected$3(isFunction(value), key, value);
      });

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
      var expected$4 = createExpected("an integer");
      var integerValidator = (function (key, currentValue) {
        return expected$4(isInteger(currentValue), key, currentValue);
      });

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
      var expected$5 = createExpected("a non-empty string");
      var nonEmptyValidator = (function (key, value) {
        return expected$5(value.length > 0, key, value);
      });

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
      var expected$6 = createExpected("a number");
      var numberValidator = (function (key, currentValue) {
        return expected$6(isNumber(currentValue), key, currentValue);
      });

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
       * Determines whether the value is a valid regular expression.
       * @param {*} value
       * @returns {boolean}
       */
      var isValidRegExp = (function (value) {
        try {
          return new RegExp(value) !== null;
        } catch (e) {
          return false;
        }
      });

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
      var expected$7 = createExpected("a regular expression");
      var regexpValidator = (function (key, value) {
        return expected$7(isValidRegExp(value), key, value);
      });

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
      var requiredValidator = (function (key, currentValue) {
        var err = "";

        if (currentValue == null) {
          err = "'" + key + "' is a required configuration parameter";
        }

        return err;
      });

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
      var expected$8 = createExpected("a string");
      var stringValidator = (function (key, value) {
        return expected$8(isString(value), key, value);
      });

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
// If the config is optional and not set, the validation doesn't get called and the
// default value is used.  Therefore, we can assume that when the validator is called
// and the value is null, the config is required.

      var baseValidator = function baseValidator() {
        return requiredValidator.apply(void 0, arguments);
      };

      var domain = function domain() {
        return chain(this, domainValidator);
      };

      var regexp = function regexp() {
        return chain(this, regexpValidator);
      };

      var nonEmpty = function nonEmpty() {
        return chain(this, nonEmptyValidator);
      };

      var unique = function createUnique() {
        return chain(this, createUniqueValidator());
      };

      var minimum = function minimum(minValue) {
        return chain(this, createMinimumValidator(minValue));
      };

      var integer = function integer() {
        return chain(this, integerValidator);
      }; // exposed validators


      var boolean = function boolean() {
        return chain(this, booleanValidator);
      };

      var number = function number() {
        return chain(this, numberValidator, {
          minimum: minimum,
          integer: integer,
          unique: unique
        });
      };

      var string = function string() {
        return chain(this, stringValidator, {
          regexp: regexp,
          domain: domain,
          nonEmpty: nonEmpty,
          unique: unique
        });
      };

      var callback = function func() {
        return chain(this, callbackValidator);
      };

      var arrayOf = function arrayOf(elementValidator) {
        return chain(this, arrayOfValidator(elementValidator));
      }; // Use this to change the message that is returned.  This is useful for complex validators
// where you don't want to just tell the user one thing at a time.  For example:
// number().integer().minimum(0)("key", "foo") => "'key': Expected a number, but got 'foo'"
// number().integer().minimum(0).expected("an integer greater than or equal to 0")("key", "foo")
//  => "'key': Expected an integer greater than or equal to 0"


      var expected$9 = function expected(message) {
        var e = createExpected(message);
        var validator = this;

        var newValidator = function newValidator() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return e.apply(void 0, [!validator.apply(void 0, args)].concat(args));
        };

        assign(newValidator, validator);
        return newValidator;
      };

      assign(baseValidator, {
        expected: expected$9
      });
      var boundString = string.bind(baseValidator);
      var boundBoolean = boolean.bind(baseValidator);
      var boundNumber = number.bind(baseValidator);
      var boundCallback = callback.bind(baseValidator);
      var boundArrayOf = arrayOf.bind(baseValidator);

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
      var createConfigValidators = (function () {
        return {
          clickCollectionEnabled: {
            defaultValue: true,
            validate: boundBoolean()
          },
          downloadLinkQualifier: {
            defaultValue: "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$",
            validate: boundString().regexp()
          }
        };
      });

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

      var getAbsoluteUrlFromAnchorElement = function getAbsoluteUrlFromAnchorElement(window, element) {
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

      var isSupportedAnchorElement = function isSupportedAnchorElement(element) {
        if (element.href && (element.tagName === "A" || element.tagName === "AREA") && (!element.onclick || !element.protocol || element.protocol.toLowerCase().indexOf("javascript") < 0)) {
          return true;
        }

        return false;
      };

      var isDownloadLink = function isDownloadLink(downloadLinkQualifier, linkUrl, clickedObj) {
        var re = new RegExp(downloadLinkQualifier);
        return clickedObj.download ? true : re.test(linkUrl.toLowerCase());
      };

      var isExitLink = function isExitLink(window, linkUrl) {
        var currentHostname = window.location.hostname.toLowerCase();

        if (linkUrl.toLowerCase().indexOf(currentHostname) >= 0) {
          return false;
        }

        return true;
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

      var determineLinkType = function determineLinkType(window, config, linkUrl, clickedObj) {
        var linkType = "other";

        if (isDownloadLink(config.downloadLinkQualifier, linkUrl, clickedObj)) {
          linkType = "download";
        } else if (isExitLink(window, linkUrl)) {
          linkType = "exit";
        }

        return linkType;
      };

      var createLinkClick = (function (window, config) {
        return function (event, targetElement) {
          var linkName;
          var linkType;
          var clickedElement = targetElement;
          var linkUrl;
          var isValidLink = false; // Search parent elements for an anchor element
          // TODO: Replace with generic DOM tool that can fetch configured properties

          do {
            linkUrl = getAbsoluteUrlFromAnchorElement(window, clickedElement);

            if (!linkUrl) {
              clickedElement = clickedElement.parentNode;
            }
          } while (!linkUrl && clickedElement);

          if (linkUrl && isSupportedAnchorElement(clickedElement)) {
            isValidLink = true;
            linkType = determineLinkType(window, config, linkUrl, clickedElement); // TODO: Update link name from the clicked element context

            linkName = "Link Click";
          }

          if (isValidLink) {
            if (linkType === "exit") {
              event.documentUnloading();
            }

            event.mergeXdm({
              eventType: "web.webinteraction.linkClicks",
              web: {
                webinteraction: {
                  name: linkName,
                  type: linkType,
                  URL: linkUrl,
                  linkClicks: {
                    value: 1
                  }
                }
              }
            });
          }
        };
      });

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

      var createActivityCollector = function createActivityCollector(_ref) {
        var config = _ref.config,
          eventManager = _ref.eventManager;
        var linkClick = createLinkClick(window, config);
        return {
          lifecycle: {
            onComponentsRegistered: function onComponentsRegistered(tools) {
              var lifecycle = tools.lifecycle;
              attachClickActivityCollector(config, eventManager, lifecycle); // TODO: createScrollActivityCollector ...
            },
            onClick: function onClick(_ref2) {
              var event = _ref2.event,
                clickedElement = _ref2.clickedElement;
              linkClick(event, clickedElement);
            }
          }
        };
      };

      createActivityCollector.namespace = "ActivityCollector";
      createActivityCollector.abbreviation = "AC";
      createActivityCollector.configValidators = createConfigValidators();

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
      var CUSTOMER_ID_HASH = "CIDH";
      var EXPERIENCE_CLOUD_ID = "ECID";
      var ID_SYNC_TIMESTAMP = "idSyncTimestamp";
      var ID_SYNC_CONTROL = "idSyncControl";

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
      var DEFAULT_ID_SYNC_TTL_MINUTES = 10080; // 7 days

      var getControlObject = function getControlObject(cookieJar) {
        var val = cookieJar.get(ID_SYNC_CONTROL) || "";
        var arr = val ? val.split("_") : [];
        return arr.reduce(function (controlObject, idTimestampPair) {
          var _idTimestampPair$spli = idTimestampPair.split("-"),
            _idTimestampPair$spli2 = _slicedToArray(_idTimestampPair$spli, 2),
            id = _idTimestampPair$spli2[0],
            timestamp = _idTimestampPair$spli2[1];

          controlObject[id] = parseInt(timestamp, 36);
          return controlObject;
        }, {});
      };

      var setControlObject = function setControlObject(controlObject, cookieJar) {
        var arr = Object.keys(controlObject).map(function (id) {
          return id + "-" + controlObject[id].toString(36);
        });
        cookieJar.set(ID_SYNC_CONTROL, arr.join("_"));
      };

      var createProcessor = function createProcessor(config, logger, cookieJar) {
        return function (destinations) {
          if (!config.idSyncEnabled) {
            return Promise.reject(new Error("ID synchronization not enabled"));
          }

          var controlObject = getControlObject(cookieJar);
          var now = convertTimes(MILLISECOND, HOUR, new Date().getTime()); // hours

          Object.keys(controlObject).forEach(function (key) {
            if (controlObject[key] < now) {
              delete controlObject[key];
            }
          });
          var idSyncs = destinations.filter(function (dest) {
            return dest.type === "url" && controlObject[dest.id] === undefined;
          }).map(function (dest) {
            return assign({
              id: dest.id
            }, dest.spec);
          });
          return fireDestinations({
            logger: logger,
            destinations: idSyncs
          }).then(function (result) {
            var nowInHours = Math.round(convertTimes(MILLISECOND, HOUR, new Date().getTime()));
            result.succeeded.forEach(function (idSync) {
              var ttlInHours = Math.round(convertTimes(MINUTE, HOUR, idSync.ttlMinutes || DEFAULT_ID_SYNC_TTL_MINUTES));
              controlObject[idSync.id] = nowInHours + ttlInHours;
            });
            setControlObject(controlObject, cookieJar);
            cookieJar.set(ID_SYNC_TIMESTAMP, (Math.round(convertTimes(MILLISECOND, HOUR, new Date().getTime())) + convertTimes(DAY, HOUR, 7)).toString(36));

            if (result.failed.length) {
              var failedIds = result.failed.map(function (idSync) {
                return idSync.id;
              });
              throw new Error("The following ID sync IDs failed: " + failedIds.join(", ") + ".");
            }

            return result;
          });
        };
      };

      var createExpiryChecker = function createExpiryChecker(cookieJar) {
        return function () {
          var nowInHours = Math.round(convertTimes(MILLISECOND, HOUR, new Date().getTime()));
          var timestamp = parseInt(cookieJar.get(ID_SYNC_TIMESTAMP) || 0, 36);
          return nowInHours > timestamp;
        };
      };

      var createIdSyncs = (function (config, logger, cookieJar) {
        return {
          process: createProcessor(config, logger, cookieJar),
          hasExpired: createExpiryChecker(cookieJar)
        };
      });

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
      var AMBIGUOUS = "ambiguous";
      var AUTHENTICATED = "authenticated";
      var LOGGED_OUT = "loggedOut";

      var AUTH_STATES = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AMBIGUOUS: AMBIGUOUS,
        AUTHENTICATED: AUTHENTICATED,
        LOGGED_OUT: LOGGED_OUT
      });

      var ERROR_MESSAGE = "Invalid customer ID format.";
      var NOT_AN_OBJECT_ERROR = "Each namespace should be an object.";
      var NO_ID_ERROR = "Each namespace object should have an ID.";
      var PRIMARY_NOT_BOOLEAN = "The `primary` property should be true or false.";

      var validateCustomerIds = function validateCustomerIds(customerIds) {
        if (!isObject(customerIds)) {
          throw new Error(ERROR_MESSAGE + " " + NOT_AN_OBJECT_ERROR);
        }

        Object.keys(customerIds).forEach(function (customerId) {
          var primary = customerIds[customerId].primary;

          if (!isObject(customerIds[customerId])) {
            throw new Error(ERROR_MESSAGE + " " + NOT_AN_OBJECT_ERROR);
          }

          if (!customerIds[customerId].id) {
            throw new Error(ERROR_MESSAGE + " " + NO_ID_ERROR);
          }

          if (!isNil(primary) && !isBoolean(primary)) {
            throw new Error(ERROR_MESSAGE + " " + PRIMARY_NOT_BOOLEAN);
          }
        });
      };

      var sortObjectKeyNames = function sortObjectKeyNames(object) {
        return Object.keys(object).sort().reduce(function (newObject, key) {
          newObject[key] = object[key];
          return newObject;
        }, {});
      };

      var normalizeCustomerIds = function normalizeCustomerIds(customerIds) {
        var sortedCustomerIds = sortObjectKeyNames(customerIds); // TODO: This requires a change to the docs to list the possible values.
        // Alternatively, maybe we should expose the enum on the instance.

        var authStates = values(AUTH_STATES);
        return Object.keys(sortedCustomerIds).reduce(function (normalizedIds, customerId) {
          var _sortedCustomerIds$cu = sortedCustomerIds[customerId],
            id = _sortedCustomerIds$cu.id,
            authenticatedState = _sortedCustomerIds$cu.authenticatedState,
            primary = _sortedCustomerIds$cu.primary;
          normalizedIds[customerId] = {
            id: id,
            authenticatedState: includes(authStates, authenticatedState) ? authenticatedState // Set the auth state to the string value like `authenticated`.
              : AMBIGUOUS
          };

          if (primary !== undefined) {
            normalizedIds[customerId].primary = primary;
          }

          return normalizedIds;
        }, {});
      };

      var createCustomerIds = (function (cookieJar, eventManager) {
        var updateChecksum = function updateChecksum(checksum) {
          return cookieJar.set(CUSTOMER_ID_HASH, checksum);
        };

        var hash = function hash(originalIds, normalizedIds) {
          var idNames = Object.keys(normalizedIds);
          var idsToHash = idNames.filter(function (idName) {
            return originalIds[idName].hash;
          });
          var idHashPromises = idsToHash.map(function (id) {
            return convertStringToSha256Buffer(normalizedIds[id].id);
          });
          return Promise.all(idHashPromises).then(function (hashedIds) {
            return hashedIds.reduce(function (finalIds, hashedId, index) {
              finalIds[idsToHash[index]].id = convertBufferToHex(hashedId);
              return finalIds;
            }, normalizedIds);
          });
        };

        var state = {
          haveChanged: false,
          ids: {},
          hasIds: false
        };

        var setState = function setState(customerIdChanged, normalizedIds) {
          state.haveChanged = customerIdChanged;
          state.ids = _objectSpread2({}, state.ids, {}, normalizedIds);
          state.hasIds = !!Object.keys(state.ids).length;
        };

        var customerIds = {
          addToPayload: function addToPayload(payload) {
            var currentState = clone(state);

            if (currentState.hasIds) {
              Object.keys(currentState.ids).forEach(function (name) {
                payload.addIdentity(name, currentState.ids[name]);
              });
              payload.mergeMeta({
                identity: {
                  customerIdChanged: currentState.haveChanged
                }
              });
              state.haveChanged = false;
            }
          },
          sync: function sync(originalIds) {
            validateCustomerIds(originalIds);
            var normalizedIds = normalizeCustomerIds(originalIds);
            var checksum = crc32(JSON.stringify(normalizedIds)).toString(36);
            var customerIdChanged = checksum !== cookieJar.get(CUSTOMER_ID_HASH);

            if (customerIdChanged) {
              updateChecksum(checksum);
            }

            return hash(originalIds, normalizedIds).then(function (hashedIds) {
              setState(customerIdChanged, hashedIds); // FIXME: Konductor shouldn't require an event.

              var event = eventManager.createEvent();
              return eventManager.sendEvent(event);
            });
          }
        };
        return customerIds;
      });

      var createMigration = (function (orgId, idMigrationEnabled) {
        return {
          getEcidFromAmcvCookie: function getEcidFromAmcvCookie(identityCookieJar) {
            var ecid = null;

            if (idMigrationEnabled) {
              var amcvCookieValue = cookie.get("AMCV_" + orgId);

              if (amcvCookieValue) {
                var reg = /(^|\|)MCMID\|(\d+)($|\|)/;
                var matches = amcvCookieValue.match(reg); // Destructuring arrays breaks in IE
                // eslint-disable-next-line prefer-destructuring

                ecid = matches[2];
                identityCookieJar.set(EXPERIENCE_CLOUD_ID, ecid);
              }
            }

            return ecid;
          },
          createAmcvCookie: function createAmcvCookie(ecid) {
            if (idMigrationEnabled) {
              var amcvCookieValue = cookie.get("AMCV_" + orgId);

              if (!amcvCookieValue) {
                cookie.set("AMCV_" + orgId, "MCMID|" + ecid);
              }
            }
          }
        };
      });

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
      var CHROME = "Chrome";
      var EDGE = "Edge";
      var EDGE_CHROMIUM = "EdgeChromium";
      var FIREFOX = "Firefox";
      var IE = "IE";
      var SAFARI = "Safari";
      var UNKNOWN = "Unknown";

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
// we don't know. We also assume "unknown" browsers support third-party cookies,
// though we don't really know that either. We're making best guesses.

      var browsersSupportingThirdPartyCookie = [CHROME, EDGE, EDGE_CHROMIUM, IE, UNKNOWN];
      var areThirdPartyCookiesSupported = (function (browser) {
        return includes(browsersSupportingThirdPartyCookie, browser);
      });

      var matchUserAgent = function matchUserAgent(regexs) {
        return function (userAgent) {
          var keys = Object.keys(regexs);

          for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i];
            var regex = regexs[key];

            if (regex.test(userAgent)) {
              return key;
            }
          }

          return UNKNOWN;
        };
      };

      var getBrowser = memoize(function (window) {
        var _matchUserAgent;

        return matchUserAgent((_matchUserAgent = {}, _defineProperty(_matchUserAgent, EDGE, /Edge\/([0-9\._]+)/), _defineProperty(_matchUserAgent, EDGE_CHROMIUM, /Edg\/([0-9\.]+)/), _defineProperty(_matchUserAgent, CHROME, /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/), _defineProperty(_matchUserAgent, FIREFOX, /Firefox\/([0-9\.]+)(?:\s|$)/), _defineProperty(_matchUserAgent, IE, /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/), _defineProperty(_matchUserAgent, SAFARI, /Version\/([0-9\._]+).*Safari/), _matchUserAgent))(window.navigator.userAgent);
      });

      var addIdsContext = function addIdsContext(payload, ecid) {
        payload.addIdentity(EXPERIENCE_CLOUD_ID, {
          id: ecid
        });
      };

      var createComponent = (function (idSyncs, config, logger, cookieJar, optIn, eventManager) {
        var deferredForEcid;
        var alreadyQueriedForIdSyncs = false;
        var idMigrationEnabled = config.idMigrationEnabled,
          orgId = config.orgId;
        var migration = createMigration(orgId, idMigrationEnabled); // TODO: Fetch from server if ECID is not available.

        var _getEcid = function getEcid() {
          var ecid = cookieJar.get(EXPERIENCE_CLOUD_ID) || migration.getEcidFromAmcvCookie(cookieJar);
          return ecid;
        }; // This is a way for the ECID data element in the Reactor extension
        // to get the ECID synchronously since data elements are required
        // to be synchronous.


        config.reactorRegisterGetEcid(function () {
          return optIn.isOptedIn() ? _getEcid() : undefined;
        });
        var customerIds = createCustomerIds(cookieJar, eventManager);
        return {
          lifecycle: {
            // Waiting for opt-in because we'll be reading the ECID from a cookie
            onBeforeEvent: function onBeforeEvent(_ref) {
              var event = _ref.event;
              return optIn.whenOptedIn().then(function () {
                var identityQuery = {
                  identity: {}
                };
                var sendIdentityQuery = false;

                if (!alreadyQueriedForIdSyncs && config.idSyncEnabled && idSyncs.hasExpired()) {
                  alreadyQueriedForIdSyncs = true;
                  identityQuery.identity.exchange = true;
                  sendIdentityQuery = true;

                  if (config.idSyncContainerId !== undefined) {
                    identityQuery.identity.containerId = config.idSyncContainerId;
                  }
                }

                if (!config.thirdPartyCookiesEnabled) {
                  identityQuery.identity.thirdPartyCookiesEnabled = false;
                  sendIdentityQuery = true;
                }

                if (sendIdentityQuery) {
                  event.mergeQuery(identityQuery);
                }
              });
            },
            // Waiting for opt-in because we'll be reading the ECID from a cookie
            // TO-DOCUMENT: We wait for ECID before trigger any events.
            onBeforeDataCollection: function onBeforeDataCollection(_ref2) {
              var payload = _ref2.payload;
              return optIn.whenOptedIn().then(function () {
                var ecid = _getEcid();

                var promise;

                if (ecid) {
                  addIdsContext(payload, ecid);
                } else if (deferredForEcid) {
                  // We don't have an ECID, but the first request has gone out to
                  // fetch it. We must wait for the response to come back with the
                  // ECID before we can apply it to this payload.
                  logger.log("Delaying request while retrieving ECID from server.");
                  promise = deferredForEcid.promise.then(function () {
                    logger.log("Resuming previously delayed request.");
                    addIdsContext(payload, _getEcid());
                  });
                } else {
                  // We don't have an ECID and no request has gone out to fetch it.
                  // We won't apply the ECID to this request, but we'll set up a
                  // promise so that future requests can know when the ECID has returned.
                  deferredForEcid = defer();
                  payload.expectResponse();

                  if (config.thirdPartyCookiesEnabled && areThirdPartyCookiesSupported(getBrowser(window))) {
                    payload.useIdThirdPartyDomain();
                  }
                }

                customerIds.addToPayload(payload);
                return promise;
              });
            },
            // Waiting for opt-in because we'll be writing the ECID to a cookie
            onResponse: function onResponse(_ref3) {
              var response = _ref3.response;
              return optIn.whenOptedIn().then(function () {
                var ecidPayloads = response.getPayloadsByType("identity:persist");

                if (ecidPayloads.length > 0) {
                  var ecid = ecidPayloads[0].id;
                  cookieJar.set(EXPERIENCE_CLOUD_ID, ecid);
                  migration.createAmcvCookie(ecid);

                  if (deferredForEcid) {
                    deferredForEcid.resolve();
                  }
                }

                idSyncs.process(response.getPayloadsByType("identity:exchange"));
              });
            }
          },
          commands: {
            getEcid: function getEcid() {
              return optIn.whenOptedIn().then(_getEcid);
            },
            setCustomerIds: function setCustomerIds(options) {
              return optIn.whenOptedIn().then(function () {
                return customerIds.sync(options);
              });
            }
          }
        };
      });

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

      var createIdentity = function createIdentity(_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          cookieJar = _ref.cookieJar,
          optIn = _ref.optIn,
          eventManager = _ref.eventManager;
        // We avoid reading the ECID from the cookie right away, because we
        // need to wait for the user to opt in first.
        var idSyncs = createIdSyncs(config, logger, cookieJar);
        return createComponent(idSyncs, config, logger, cookieJar, optIn, eventManager);
      };

      createIdentity.namespace = "Identity";
      createIdentity.abbreviation = "ID";
      createIdentity.configValidators = {
        idSyncEnabled: {
          defaultValue: true,
          validate: boundBoolean()
        },
        idSyncContainerId: {
          validate: boundNumber().integer().minimum(0).expected("an integer greater than or equal to 0")
        },
        thirdPartyCookiesEnabled: {
          defaultValue: true,
          validate: boundBoolean()
        },
        idMigrationEnabled: {
          defaultValue: true,
          validate: boundBoolean()
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

      var processUrls = function processUrls(destinations, logger) {
        var urlDestinations = destinations.filter(function (dest) {
          return dest.type === "url";
        }).map(function (dest) {
          return assign({
            id: dest.id
          }, dest.spec);
        });

        if (urlDestinations.length) {
          fireDestinations({
            logger: logger,
            destinations: urlDestinations
          });
        }
      };

      var processCookies = function processCookies(destinations) {
        var cookieDestinations = destinations.filter(function (dest) {
          return dest.type === "cookie";
        }).map(function (dest) {
          return dest.spec;
        }); // TODO: Konductor might have to set those if CNAME provided?

        cookieDestinations.forEach(function (dest) {
          cookie.set(dest.name, dest.value || "", {
            domain: dest.domain || "",
            expires: dest.ttlDays ? dest.ttlDays : 10 // days

          });
        });
      };

      var processDestinations = (function (_ref) {
        var destinations = _ref.destinations,
          logger = _ref.logger;
        processUrls(destinations, logger);
        processCookies(destinations);
      });

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
            onBeforeEvent: function onBeforeEvent(_ref2) {
              var event = _ref2.event,
                isViewStart = _ref2.isViewStart;

              if (isViewStart) {
                event.mergeQuery({
                  activation: {
                    urlsEnabled: config.urlDestinationsEnabled,
                    cookiesEnabled: config.cookieDestinationsEnabled
                  }
                });
                event.expectResponse();
              }
            },
            onResponse: function onResponse(_ref3) {
              var response = _ref3.response;
              var destinations = response.getPayloadsByType("activation:push");
              processDestinations({
                destinations: destinations,
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
        cookieDestinationsEnabled: {
          defaultValue: true,
          validate: boundBoolean()
        },
        urlDestinationsEnabled: {
          defaultValue: true,
          validate: boundBoolean()
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
      var libraryLoaded = (function (settings, trigger) {
        trigger();
      });

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
      var createFragment = (function (content) {
        return createNode(DIV, {}, {
          innerHTML: content
        });
      });

      var css_escape = createCommonjsModule(function (module, exports) {

        (function (root, factory) {
          // https://github.com/umdjs/umd/blob/master/returnExports.js
          {
            // For Node.js.
            module.exports = factory(root);
          }
        })(typeof commonjsGlobal != 'undefined' ? commonjsGlobal : commonjsGlobal, function (root) {
          if (root.CSS && root.CSS.escape) {
            return root.CSS.escape;
          } // https://drafts.csswg.org/cssom/#serialize-an-identifier


          var cssEscape = function (value) {
            if (arguments.length == 0) {
              throw new TypeError('`CSS.escape` requires an argument.');
            }

            var string = String(value);
            var length = string.length;
            var index = -1;
            var codeUnit;
            var result = '';
            var firstCodeUnit = string.charCodeAt(0);

            while (++index < length) {
              codeUnit = string.charCodeAt(index); // Note: there’s no need to special-case astral symbols, surrogate
              // pairs, or lone surrogates.
              // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
              // (U+FFFD).

              if (codeUnit == 0x0000) {
                result += '\uFFFD';
                continue;
              }

              if ( // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
              // U+007F, […]
                codeUnit >= 0x0001 && codeUnit <= 0x001F || codeUnit == 0x007F || // If the character is the first character and is in the range [0-9]
                // (U+0030 to U+0039), […]
                index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039 || // If the character is the second character and is in the range [0-9]
                // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
                index == 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit == 0x002D) {
                // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
                result += '\\' + codeUnit.toString(16) + ' ';
                continue;
              }

              if ( // If the character is the first character and is a `-` (U+002D), and
              // there is no second character, […]
                index == 0 && length == 1 && codeUnit == 0x002D) {
                result += '\\' + string.charAt(index);
                continue;
              } // If the character is not handled by one of the above rules and is
              // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
              // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
              // U+005A), or [a-z] (U+0061 to U+007A), […]


              if (codeUnit >= 0x0080 || codeUnit == 0x002D || codeUnit == 0x005F || codeUnit >= 0x0030 && codeUnit <= 0x0039 || codeUnit >= 0x0041 && codeUnit <= 0x005A || codeUnit >= 0x0061 && codeUnit <= 0x007A) {
                // the character itself
                result += string.charAt(index);
                continue;
              } // Otherwise, the escaped character.
              // https://drafts.csswg.org/cssom/#escape-a-character


              result += '\\' + string.charAt(index);
            }

            return result;
          };

          if (!root.CSS) {
            root.CSS = {};
          }

          root.CSS.escape = cssEscape;
          return cssEscape;
        });
      });

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
      var EQ_START = ":eq(";
      var EQ_PATTERN = /:eq\((\d+)\)/g;
      var isNotEqSelector = function isNotEqSelector(str) {
        return str.indexOf(EQ_START) === -1;
      };
      var splitWithEq = function splitWithEq(selector) {
        return selector.split(EQ_PATTERN).filter(isNonEmptyString);
      };

      var CSS_IDENTIFIER_PATTERN = /(#|\.)(-?\w+)/g; // This is required to remove leading " > " from parsed pieces

      var SIBLING_PATTERN = /^\s*>?\s*/;

      var cleanUp = function cleanUp(str) {
        return str.replace(SIBLING_PATTERN, "").trim();
      }; // Here we use CSS.escape() to make sure we get
// correct values for ID and CSS class
// Please check:  https://www.w3.org/TR/css-syntax-3/#escaping
// CSS.escape() polyfill can be found here: https://github.com/mathiasbynens/CSS.escape


      var replaceIdentifier = function replaceIdentifier(_, $1, $2) {
        return "" + $1 + css_escape($2);
      };

      var escapeIdentifiersInSelector = function escapeIdentifiersInSelector(selector) {
        return selector.replace(CSS_IDENTIFIER_PATTERN, replaceIdentifier);
      };
      var parseSelector = function parseSelector(rawSelector) {
        var result = [];
        var selector = escapeIdentifiersInSelector(rawSelector.trim());
        var parts = splitWithEq(selector);
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
       * @returns {Array} an array of DOM nodes
       */

      var selectNodesWithEq = function selectNodesWithEq(selector) {
        var doc = document;

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
      var getElementById = (function (id) {
        var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
        return context.getElementById(id);
      });

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
      var setAttribute = (function (element, name, value) {
        element.setAttribute(name, value);
      });

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
      var getAttribute = (function (element, name) {
        return element.getAttribute(name);
      });

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
      var removeAttribute = (function (element, name) {
        element.removeAttribute(name);
      });

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
      var setStyle = (function (element, name, value, priority) {
        var css;

        if (priority) {
          css = name + ":" + value + " !" + priority + ";";
        } else {
          css = name + ":" + value + ";";
        }

        element.style.cssText += ";" + css;
      });

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
      var getParent = (function (element) {
        return element.parentNode;
      });

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
      var getNextSibling = (function (element) {
        return element.nextElementSibling;
      });

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
      var insertAfter = (function (container, element) {
        if (!container) {
          return;
        }

        var parent = getParent(container);

        if (parent) {
          parent.insertBefore(element, getNextSibling(container));
        }
      });

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
      var insertBefore = (function (container, element) {
        if (!container) {
          return;
        }

        var parent = getParent(container);

        if (parent) {
          parent.insertBefore(element, container);
        }
      });

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
      var getChildren = (function (element) {
        var children = element.children;

        if (children) {
          return toArray(children);
        }

        return [];
      });

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
      var getChildNodes = (function (element) {
        var childNodes = element.childNodes;

        if (childNodes) {
          return toArray(childNodes);
        }

        return [];
      });

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
      var getFirstChild = (function (element) {
        return element.firstElementChild;
      });

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
      var setText = (function (container, text) {
        container.textContent = text;
      });

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
        images.forEach(function (image) {
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
        /* eslint-disable no-continue */

        for (var i = 0; i < length; i += 1) {
          var element = scripts[i];

          if (!isInlineScript(element)) {
            continue;
          }

          var textContent = element.textContent;

          if (!textContent) {
            continue;
          }

          result.push(createNode(SCRIPT, {}, {
            textContent: textContent
          }));
        }
        /* eslint-enable no-continue */


        return result;
      };
      var getRemoteScriptsUrls = function getRemoteScriptsUrls(fragment) {
        var scripts = selectNodes(SCRIPT, fragment);
        var result = [];
        var length = scripts.length;
        /* eslint-disable no-continue */

        for (var i = 0; i < length; i += 1) {
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
      var executeInlineScripts = function executeInlineScripts(container, scripts, func) {
        scripts.forEach(function (script) {
          return func(container, script);
        });
      };
      var executeRemoteScripts = function executeRemoteScripts(urls) {
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
      var appendHtml = (function (container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        var scripts = getInlineScripts(fragment);
        var scriptsUrls = getRemoteScriptsUrls(fragment);
        loadImages(fragment);
        elements.forEach(function (element) {
          appendNode(container, element);
        });
        executeInlineScripts(container, scripts, appendNode);
        return executeRemoteScripts(scriptsUrls);
      });

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

      var setHtml = (function (container, html) {
        clear(container);
        appendHtml(container, html);
      });

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
      var prependHtml = (function (container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        var scripts = getInlineScripts(fragment);
        var scriptsUrls = getRemoteScriptsUrls(fragment);
        var length = elements.length;
        var i = length - 1; // We have to proactively load images to avoid flicker

        loadImages(fragment); // We are inserting elements in reverse order

        while (i >= 0) {
          var element = elements[i];
          var firstChild = getFirstChild(container);
          insertBefore(firstChild, element);
          i -= 1;
        }

        executeInlineScripts(container, scripts, appendNode);
        return executeRemoteScripts(scriptsUrls);
      });

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
      var insertHtmlBefore = (function (container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        var scripts = getInlineScripts(fragment);
        var scriptsUrls = getRemoteScriptsUrls(fragment);
        loadImages(fragment);
        elements.forEach(function (element) {
          insertBefore(container, element);
        });
        executeInlineScripts(container, scripts, insertBefore);
        return executeRemoteScripts(scriptsUrls);
      });

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
      var replaceHtml = (function (container, html) {
        insertHtmlBefore(container, html);
        removeNode(container);
      });

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
      var insertHtmlAfter = (function (container, html) {
        var fragment = createFragment(html);
        var elements = getChildNodes(fragment);
        var scripts = getInlineScripts(fragment);
        var scriptsUrls = getRemoteScriptsUrls(fragment);
        loadImages(fragment);
        elements.forEach(function (element) {
          insertAfter(container, element);
        });
        executeInlineScripts(container, scripts, insertAfter);
        return executeRemoteScripts(scriptsUrls);
      });

      var setStyles = (function (container, styles) {
        var priority = styles.priority,
          style = _objectWithoutProperties(styles, ["priority"]);

        Object.keys(style).forEach(function (key) {
          setStyle(container, key, style[key], priority);
        });
      });

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
      var setAttributes = (function (container, attributes) {
        Object.keys(attributes).forEach(function (key) {
          setAttribute(container, key, attributes[key]);
        });
      });

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
      var swapImage = (function (container, url) {
        if (!isImage(container)) {
          return;
        } // Start downloading the image


        loadImage(url); // Remove "src" so there is no flicker

        removeAttribute(container, SRC); // Replace the image "src"

        setAttribute(container, SRC, url);
      });

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
      var rearrangeChildren = (function (container, _ref) {
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
      });

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
      var _click = (function (settings, store) {
        var selector = settings.selector,
          meta = settings.meta;
        store({
          selector: selector,
          meta: meta
        });
      });

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

      var renderContent = function renderContent(elements, content, renderFunc) {
        var executions = elements.map(function (element) {
          return renderFunc(element, content);
        });
        return Promise.all(executions);
      };

      var createAction = function createAction(collect, renderFunc) {
        return function (settings) {
          var selector = settings.selector,
            prehidingSelector = settings.prehidingSelector,
            content = settings.content,
            meta = settings.meta;
          hideElements(prehidingSelector);
          return awaitSelector(selector, selectNodesWithEq).then(function (elements) {
            return renderContent(elements, content, renderFunc);
          }).then(function () {
            // if everything is OK, notify and show elements
            collect(meta);
            showElements(prehidingSelector);
          }, function () {
            // in case of awaiting timing or error, we need to remove the style tag
            // hence showing the pre-hidden elements and notify
            collect(meta);
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
      var initRuleComponentModules = (function (collect, store) {
        return {
          libraryLoaded: libraryLoaded,
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
          appendHtml: createAction(collect, appendHtml),
          click: function click(settings) {
            return _click(settings, store);
          }
        };
      });

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
        rules.forEach(function (rule) {
          var events = rule.events;
          events.forEach(function (event) {
            ruleEventPairs.push({
              rule: rule,
              event: event
            });
          });
        });
        return ruleEventPairs;
      };

      var executeRules = (function (rules, ruleComponentModules, logger) {
        var eventModulesInitialized = false;
        var triggerCallQueue = [];

        var executeModule = function executeModule(moduleType, args) {
          var ruleComponentModule = ruleComponentModules[moduleType];

          if (!ruleComponentModule) {
            throw new Error("Rule component module \"" + moduleType + "\" not found");
          }

          return ruleComponentModule.apply(void 0, _toConsumableArray(args));
        };

        var getErrorMessage = function getErrorMessage(ruleComponent, rule, errorMessage, errorStack) {
          return "Failed to execute " + ruleComponent.moduleType + " for " + rule.name + " rule. " + errorMessage + " " + (errorStack ? "\n " + errorStack : "");
        };

        var logActionError = function logActionError(action, rule, e) {
          logger.error(getErrorMessage(action, rule, e.message, e.stack));
        };

        var logRuleCompleted = function logRuleCompleted(rule) {
          logger.log("Rule " + rule.name + " fired.");
        };

        var runActions = function runActions(rule, syntheticEvent) {
          if (!rule.actions) {
            return;
          }

          for (var i = 0; i < rule.actions.length; i += 1) {
            var action = rule.actions[i];

            try {
              executeModule(action.moduleType, [action.settings, syntheticEvent]);
            } catch (e) {
              logActionError(action, rule, e);
              return;
            }
          }

          logRuleCompleted(rule);
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

              runActions(rule, syntheticEvent);
            };

            executeModule(event.moduleType, [event.settings, trigger]);
          } catch (e) {
            logger.error(getErrorMessage(event, rule, e.message, e.stack));
          }
        };

        buildRuleExecutionOrder(rules).forEach(initEventModule);
        eventModulesInitialized = true;
        triggerCallQueue.forEach(function (triggerCall) {
          return triggerCall();
        });
        triggerCallQueue = null;
      });

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
      var matchesSelectorWithEq = (function (selector, element) {
        if (isNotEqSelector(selector)) {
          return matchesSelector(selector, element);
        } // Using node selection vs matches selector, because of :eq()
        // Find all nodes using document as context


        var nodes = selectNodesWithEq(selector);
        var result = false; // Iterate through all the identified elements
        // and reference compare with element

        for (var i = 0; i < nodes.length; i += 1) {
          if (nodes[i] === element) {
            result = true;
            break;
          }
        }

        return result;
      });

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

      var collectIfMatches = function collectIfMatches(collect, clickedElement, value) {
        var _document = document,
          documentElement = _document.documentElement;
        var selector = value.selector,
          meta = value.meta;
        var element = clickedElement;

        while (element && element !== documentElement) {
          if (matchesSelectorWithEq(selector, element)) {
            collect(meta);
            break;
          }

          element = element.parentNode;
        }
      };

      var collectClicks = (function (collect, clickedElement, values) {
        if (values.length === 0) {
          return;
        }

        for (var i = 0; i < values.length; i += 1) {
          collectIfMatches(collect, clickedElement, values[i]);
        }
      });

      var DECISIONS_HANDLE = "personalization:decisions"; // This is used for Target VEC integration

      var isAuthoringMode = function isAuthoringMode() {
        return document.location.href.indexOf("mboxEdit") !== -1;
      };

      var mergeMeta = function mergeMeta(event, meta) {
        event.mergeMeta({
          personalization: _objectSpread2({}, meta)
        });
      };

      var executeFragments = function executeFragments(fragments, modules, logger) {
        fragments.forEach(function (fragment) {
          var _fragment$rules = fragment.rules,
            rules = _fragment$rules === void 0 ? [] : _fragment$rules;

          if (isNonEmptyArray(rules)) {
            executeRules(rules, modules, logger);
          }
        });
      };

      var createCollect = function createCollect(eventManager) {
        return function (meta) {
          var event = eventManager.createEvent();
          mergeMeta(event, meta);
          eventManager.sendEvent(event);
        };
      };

      var createPersonalization = function createPersonalization(_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          eventManager = _ref.eventManager;
        var prehidingStyle = config.prehidingStyle;
        var authoringModeEnabled = isAuthoringMode();
        var collect = createCollect(eventManager);
        var storage = [];

        var store = function store(value) {
          return storage.push(value);
        };

        var ruleComponentModules = initRuleComponentModules(collect, store);
        return {
          lifecycle: {
            onBeforeEvent: function onBeforeEvent(_ref2) {
              var event = _ref2.event,
                isViewStart = _ref2.isViewStart;

              if (authoringModeEnabled) {
                logger.warn("Rendering is disabled, authoring mode.");
                event.mergeQuery({
                  personalization: {
                    enabled: false
                  }
                });
                return;
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
            },
            onResponse: function onResponse(_ref3) {
              var response = _ref3.response;

              if (authoringModeEnabled) {
                return;
              }

              var fragments = response.getPayloadsByType(DECISIONS_HANDLE);
              executeFragments(fragments, ruleComponentModules, logger);
              showContainers();
            },
            onResponseError: function onResponseError() {
              showContainers();
            },
            onClick: function onClick(_ref4) {
              var event = _ref4.event,
                clickedElement = _ref4.clickedElement;

              var merger = function merger(meta) {
                return mergeMeta(event, meta);
              };

              collectClicks(merger, clickedElement, storage);
            }
          }
        };
      };

      createPersonalization.namespace = "Personalization";
      createPersonalization.abbreviation = "PE";
      createPersonalization.configValidators = {
        prehidingStyle: {
          validate: boundString().nonEmpty()
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
      var webFactory = (function (window, topFrameSetProvider) {
        var topFrameSet;
        return function (xdm) {
          topFrameSet = topFrameSet || topFrameSetProvider();
          var web = {
            webPageDetails: {
              URL: window.location.href || window.location
            },
            webReferrer: {
              URL: topFrameSet.document.referrer
            }
          };
          deepAssign(xdm, {
            web: web
          });
        };
      });

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

      var getScreenOrientationViaProperty = function getScreenOrientationViaProperty(window) {
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

      var getScreenOrientationViaMediaQuery = function getScreenOrientationViaMediaQuery(window) {
        if (window.matchMedia("(orientation: portrait)").matches) {
          return "portrait";
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
          return "landscape";
        }

        return null;
      };

      var deviceFactory = (function (window) {
        return function (xdm) {
          var _window$screen = window.screen,
            width = _window$screen.width,
            height = _window$screen.height;
          var device = {
            screenHeight: height,
            screenWidth: width
          };
          var orientation = getScreenOrientationViaProperty(window) || getScreenOrientationViaMediaQuery(window);

          if (orientation) {
            device.screenOrientation = orientation;
          }

          deepAssign(xdm, {
            device: device
          });
        };
      });

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
      var environmentFactory = (function (window) {
        return function (xdm) {
          var innerWidth = window.innerWidth,
            innerHeight = window.innerHeight;
          var environment = {
            type: "browser",
            browserDetails: {
              viewportWidth: innerWidth,
              viewportHeight: innerHeight
            }
          };
          deepAssign(xdm, {
            environment: environment
          });
        };
      });

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
      var placeContextFactory = (function (dateProvider) {
        return function (xdm) {
          var date = dateProvider();
          var placeContext = {
            localTime: toISOStringLocal(date),
            localTimezoneOffset: date.getTimezoneOffset()
          };
          deepAssign(xdm, {
            placeContext: placeContext
          });
        };
      });

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
      var topFrameSetFactory = (function (window) {
        return function () {
          var topFrameSet = window;
          var _topFrameSet = topFrameSet,
            location = _topFrameSet.location;

          try {
            var _topFrameSet2 = topFrameSet,
              parent = _topFrameSet2.parent;

            while (parent && parent.location && location && String(parent.location) !== String(location) && topFrameSet.location && String(parent.location) !== String(topFrameSet.location) && parent.location.host === location.host) {
              topFrameSet = parent;
              var _topFrameSet3 = topFrameSet;
              parent = _topFrameSet3.parent;
            }
          } catch (e) {// default to whatever topFrameSet is set
          }

          return topFrameSet;
        };
      });

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
      var timestampFactory = (function (dateProvider) {
        return function (xdm) {
          var timestamp = dateProvider().toISOString();
          deepAssign(xdm, {
            timestamp: timestamp
          });
        };
      });

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
      var implementationDetailsFactory = (function (version) {
        return function (xdm) {
          var implementationDetails = {
            name: "https://ns.adobe.com/experience/alloy",
            version: version
          };
          deepAssign(xdm, {
            implementationDetails: implementationDetails
          });
        };
      });

// The value will be swapped with the proper version at build time
// see rollupPluginReplaceVersion.js
      var libraryVersion = "0.0.1-alpha.8";

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
      var createComponent$1 = (function (config, logger, availableContexts, requiredContexts) {
        var configuredContexts = config.context;
        var contexts = flatMap(configuredContexts, function (context, i) {
          if (availableContexts[context]) {
            return [availableContexts[context]];
          }

          logger.warn("Invalid context[" + i + "]: '" + context + "' is not available.");
          return [];
        }).concat(requiredContexts);
        return {
          namespace: "Context",
          lifecycle: {
            onBeforeEvent: function onBeforeEvent(_ref) {
              var event = _ref.event;
              var xdm = {};
              contexts.forEach(function (context) {
                return context(xdm);
              });
              event.mergeXdm(xdm);
            }
          }
        };
      });

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
      var placeContext = placeContextFactory(function () {
        return new Date();
      });
      var timestamp = timestampFactory(function () {
        return new Date();
      });
      var implementationDetails = implementationDetailsFactory(libraryVersion);
      var optionalContexts = {
        web: web,
        device: device,
        environment: environment,
        placeContext: placeContext
      };
      var requiredContexts = [timestamp, implementationDetails];

      var createContext = function createContext(_ref) {
        var config = _ref.config,
          logger = _ref.logger;
        return createComponent$1(config, logger, optionalContexts, requiredContexts);
      };

      createContext.namespace = "Context";
      createContext.abbreviation = "CO";
      createContext.configValidators = {
        context: {
          defaultValue: Object.keys(optionalContexts),
          validate: boundArrayOf(boundString())
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

      var throwInvalidPurposesError = function throwInvalidPurposesError(purposes) {
        throw new Error("Opt-in purposes must be \"all\" or \"none\". Received: " + purposes);
      };

      var createPrivacy = function createPrivacy(_ref) {
        var config = _ref.config,
          logger = _ref.logger,
          _optIn = _ref.optIn;
        return {
          commands: {
            optIn: function optIn(_ref2) {
              var purposes = _ref2.purposes;

              if (config.optInEnabled) {
                if (isString(purposes)) {
                  var lowerCasePurposes = purposes.toLowerCase();

                  if (lowerCasePurposes === _optIn.ALL || lowerCasePurposes === _optIn.NONE) {
                    _optIn.setPurposes(purposes);
                  } else {
                    throwInvalidPurposesError(purposes);
                  }
                } else {
                  throwInvalidPurposesError(purposes);
                }
              } else {
                logger.warn("optInEnabled must be set to true before using the optIn command.");
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
          validate: boundBoolean()
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
                version: libraryVersion
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

      var componentCreators = [createDataCollector, createActivityCollector, createIdentity, createAudiences, createPersonalization, createContext, createPrivacy, createEventMerge, createLibraryInfo];

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
      var buildAndValidateConfig = (function (_ref) {
        var options = _ref.options,
          componentCreators = _ref.componentCreators,
          createConfig = _ref.createConfig,
          createConfigValidator = _ref.createConfigValidator,
          coreConfigValidators = _ref.coreConfigValidators,
          logger = _ref.logger,
          setDebugEnabled = _ref.setDebugEnabled,
          setErrorsEnabled = _ref.setErrorsEnabled;
        var config = createConfig(options);
        var configValidator = createConfigValidator(config);
        configValidator.addValidators(coreConfigValidators);
        componentCreators.forEach(function (createComponent) {
          var configValidators = createComponent.configValidators;
          configValidator.addValidators(configValidators);
        });
        configValidator.validate();
        setErrorsEnabled(config.errorsEnabled);
        setDebugEnabled(config.debugEnabled, {
          fromConfig: true
        }); // toJson is expensive so we short circuit if logging is disabled

        if (logger.enabled) {
          logger.log("Computed configuration:", config);
        }

        return config;
      });

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
      var initializeComponents = (function (_ref) {
        var componentCreators = _ref.componentCreators,
          lifecycle = _ref.lifecycle,
          componentRegistry = _ref.componentRegistry,
          getImmediatelyAvailableTools = _ref.getImmediatelyAvailableTools;
        componentCreators.forEach(function (createComponent) {
          var namespace = createComponent.namespace,
            abbreviation = createComponent.abbreviation; // TO-DOCUMENT: Helpers that we inject into factories.

          var tools = getImmediatelyAvailableTools(abbreviation);
          var component;

          try {
            component = createComponent(tools);
          } catch (error) {
            throw stackError("[" + namespace + "] An error occurred during component creation.", error);
          }

          componentRegistry.register(namespace, component);
        });
        return lifecycle.onComponentsRegistered({
          lifecycle: lifecycle
        }).then(function () {
          return componentRegistry;
        });
      });

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

      var createConfig = function createConfig(options) {
        return assign(Object.create(null), options);
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
      var CONFIG_DOC_URI = "https://launch.gitbook.io/adobe-experience-platform-web-sdk/fundamentals/configuring-the-sdk";

      var createConfigValidator = function createConfigValidator(config) {
        var validators = Object.create(null);
        var validator = {
          addValidators: function addValidators(newValidators) {
            return assign(validators, newValidators);
          },
          validate: function validate() {
            var errors = Object.keys(validators).reduce(function (ac, key) {
              var configValue = config[key];
              var isConfigValueProvided = configValue != null;
              var configValidator = validators[key];
              var hasDefault = configValidator.defaultValue !== undefined;

              if (!isConfigValueProvided && hasDefault) {
                // no need to validate the defaultValue
                config[key] = configValidator.defaultValue;
              } else if ((isConfigValueProvided || configValidator.isRequired) && configValidator.validate) {
                // We need to validate if the value was provided by the user,
                // but also if there was no value provided and this config is required,
                // the validator will give an error message.
                var errorMessage = configValidator.validate(key, configValue, configValidator.defaultValue);

                if (errorMessage) {
                  ac.push(errorMessage);
                }
              }

              return ac;
            }, []);

            if (errors.length) {
              throw new Error("Resolve these configuration problems:\n\t - " + errors.join("\n\t - ") + "\nFor configuration documentation see: " + CONFIG_DOC_URI);
            }
          }
        };
        return validator;
      };

      var EDGE_BASE_PATH = "ee";

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
      var createCoreConfigs = (function () {
        return {
          errorsEnabled: {
            validate: boundBoolean(),
            defaultValue: true
          },
          debugEnabled: {
            validate: boundBoolean(),
            defaultValue: false
          },
          configId: {
            isRequired: true,
            validate: boundString().unique()
          },
          edgeDomain: {
            defaultValue: EDGE_DOMAIN,
            validate: boundString().domain()
          },
          edgeBasePath: {
            defaultValue: EDGE_BASE_PATH,
            validate: boundString().nonEmpty()
          },
          orgId: {
            isRequired: true,
            validate: boundString().unique()
          },
          onBeforeEventSend: {
            defaultValue: function defaultValue() {
              return undefined;
            },
            validate: boundCallback()
          },
          datasetId: {
            validate: boundString().nonEmpty()
          },
          schemaId: {
            validate: boundString().nonEmpty()
          }
        };
      });

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
      var suppressionNote = "Note: Errors can be suppressed by setting the errorsEnabled configuration option to false.";
      var handleErrorFactory = (function (_ref) {
        var instanceNamespace = _ref.instanceNamespace,
          getErrorsEnabled = _ref.getErrorsEnabled,
          logger = _ref.logger;
        return function (error) {
          var err = toError(error);
          err.message = "[" + instanceNamespace + "] " + err.message;

          if (getErrorsEnabled()) {
            err.message += "\n" + suppressionNote;
            throw err;
          } else {
            logger.error(err);
          }
        };
      });

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
      /**
       * Tool-specific dependencies => componentCreator => result
       */

      var cookieJarToolFactory = (function (_ref) {
        var config = _ref.config,
          createCookieProxy = _ref.createCookieProxy,
          createComponentNamespacedCookieJar = _ref.createComponentNamespacedCookieJar,
          getTopLevelDomain = _ref.getTopLevelDomain,
          createOrgNamespacedCookieName = _ref.createOrgNamespacedCookieName;
        var cookieName = createOrgNamespacedCookieName(ALLOY_COOKIE_NAME, config.orgId);
        var cookieProxy = createCookieProxy(cookieName, ALLOY_COOKIE_TTL_IN_DAYS, config.cookieDomain || getTopLevelDomain());
        return function (componentAbbreviation) {
          return createComponentNamespacedCookieJar(cookieProxy, componentAbbreviation);
        };
      });

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
      var xhrRequestFactory = (function (XMLHttpRequest) {
        return function (url, body) {
          return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();

            request.onreadystatechange = function () {
              if (request.readyState === 4) {
                if (request.status === 204) {
                  resolve();
                } else if (request.status >= 200 && request.status < 300) {
                  resolve(request.responseText);
                } else {
                  reject(new Error("Invalid response code " + request.status + ". Response was \"" + request.responseText + "\"."));
                }
              }
            };

            request.onloadstart = function () {
              request.responseType = "text";
            };

            request.open("POST", url, true);
            request.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
            request.withCredentials = false;
            request.onerror = reject;
            request.onabort = reject;
            request.send(body);
          });
        };
      });

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
      var fetchFactory = (function (fetch) {
        return function (url, body) {
          return fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
              "Content-Type": "text/plain; charset=UTF-8"
            },
            referrer: "client",
            body: body
          }).then(function (response) {
            if (response.ok) {
              if (response.status === 204) {
                return undefined;
              }

              return response.text();
            }

            throw new Error("Bad response code: " + response.status);
          });
        };
      });

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
      var sendBeaconFactory = (function (navigator, fetch, logger) {
        return function (url, body) {
          var blob = new Blob([body], {
            type: "text/plain; charset=UTF-8"
          });

          if (!navigator.sendBeacon(url, blob)) {
            logger.log("The `beacon` call has failed; falling back to `fetch`");
            return fetch(url, body);
          }

          return Promise.resolve();
        };
      });

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
      var createNetworkStrategy = (function (window, logger) {
        var fetch = isFunction(window.fetch) ? fetchFactory(window.fetch) : xhrRequestFactory(window.XMLHttpRequest);
        var sendBeacon = window.navigator && isFunction(window.navigator.sendBeacon) ? sendBeaconFactory(window.navigator, fetch, logger) : fetch;
        return function (url, body, documentUnloading) {
          var method = documentUnloading ? sendBeacon : fetch;
          return method(url, body);
        };
      });

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
      var createLogger = (function (console, getDebugEnabled, prefix) {
        var process = function process(level) {
          if (getDebugEnabled()) {
            for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              rest[_key - 1] = arguments[_key];
            }

            console[level].apply(console, [prefix].concat(rest));
          }
        };

        return {
          get enabled() {
            return getDebugEnabled();
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
          error: process.bind(null, "error")
        };
      });

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
      var createEventManager = (function (_ref) {
        var createEvent = _ref.createEvent,
          optIn = _ref.optIn,
          lifecycle = _ref.lifecycle,
          network = _ref.network,
          config = _ref.config,
          logger = _ref.logger;
        var orgId = config.orgId,
          onBeforeEventSend = config.onBeforeEventSend,
          debugEnabled = config.debugEnabled,
          datasetId = config.datasetId,
          schemaId = config.schemaId;

        var onBeforeEventSendWithLoggedExceptions = function onBeforeEventSendWithLoggedExceptions() {
          try {
            onBeforeEventSend.apply(void 0, arguments);
          } catch (e) {
            logger.error(e);
            throw e;
          }
        };

        var addMetaTo = function addMetaTo(payload) {
          var meta = {
            gateway: {
              orgId: orgId
            }
          };
          var collect = Object.create(null);
          assignIf(collect, {
            synchronousValidation: true
          }, function () {
            return debugEnabled;
          });
          assignIf(collect, {
            datasetId: config.datasetId
          }, function () {
            return datasetId;
          });
          assignIf(collect, {
            schemaId: config.schemaId
          }, function () {
            return schemaId;
          });

          if (!isEmptyObject(collect)) {
            meta.collect = collect;
          }

          payload.mergeMeta(meta);
        };

        return {
          createEvent: createEvent,

          /**
           * Sends an event. This includes running the event and payload through
           * the appropriate lifecycle hooks, sending the request to the server,
           * and handling the response.
           * @param {Object} event This will be JSON stringified and used inside
           * the request payload.
           * @param {Object} [options]
           * @param {boolean} [options.isViewStart=false] Whether the event is a
           * result of the start of a view. This will be passed to components
           * so they can take appropriate action.
           * @returns {*}
           */
          sendEvent: function sendEvent(event) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            event.lastChanceCallback = onBeforeEventSendWithLoggedExceptions;
            var _options$isViewStart = options.isViewStart,
              isViewStart = _options$isViewStart === void 0 ? false : _options$isViewStart;
            var payload = network.createPayload();
            addMetaTo(payload);
            return lifecycle.onBeforeEvent({
              event: event,
              isViewStart: isViewStart
            }).then(function () {
              // it's important to add the event here because the payload object will call toJSON
              // which applies the userData, userXdm, and lastChanceCallback
              payload.addEvent(event);
              return optIn.whenOptedIn();
            }).then(function () {
              return lifecycle.onBeforeDataCollection({
                payload: payload
              });
            }).then(function () {
              return network.sendRequest(payload, {
                expectsResponse: payload.expectsResponse,
                documentUnloading: event.isDocumentUnloading,
                useIdThirdPartyDomain: payload.shouldUseIdThirdPartyDomain
              });
            }).then(function (response) {
              var returnData = {
                requestBody: clone(payload)
              };

              if (response) {
                returnData.responseBody = clone(response);
              }

              return returnData;
            });
          }
        };
      });

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
// Due to security software flagging the `@` sign in the ORG ID
// as a security vulnerability, we are replacing it with an `_`.
      var createOrgNamespacedCookieName = (function (cookieNamePrefix, orgId) {
        return cookieNamePrefix + "_" + orgId.replace("@", "_");
      });

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

      var instanceNamespaces = window.__alloyNS;
      var createNamespacedStorage = storageFactory(window);
      var memoizedGetTopLevelDomain = memoize(getTopLevelCookieDomain);
      var console; // When running within the Reactor extension, we want logging to be
// toggled when Reactor logging is toggled. The easiest way to do
// this is to pipe our log messages through the Reactor logger.

      console = turbine.logger;
      var coreConfigValidators = createCoreConfigs();

      if (instanceNamespaces) {
        instanceNamespaces.forEach(function (instanceNamespace) {
          var logController = createLogController({
            console: console,
            locationSearch: window.location.search,
            createLogger: createLogger,
            instanceNamespace: instanceNamespace,
            createNamespacedStorage: createNamespacedStorage
          });
          var setDebugEnabled = logController.setDebugEnabled,
            logger = logController.logger;
          var componentRegistry = createComponentRegistry();
          var lifecycle = createLifecycle(componentRegistry);
          var networkStrategy = createNetworkStrategy(window, logger);

          var getTopLevelDomain = function getTopLevelDomain() {
            return memoizedGetTopLevelDomain(window, cookie);
          };

          var errorsEnabled = true;

          var getErrorsEnabled = function getErrorsEnabled() {
            return errorsEnabled;
          };

          var setErrorsEnabled = function setErrorsEnabled(value) {
            errorsEnabled = value;
          };

          var debugCommand = function debugCommand(options) {
            setDebugEnabled(options.enabled, {
              fromConfig: false
            });
          };

          var configureCommand = function configureCommand(options) {
            var config = buildAndValidateConfig({
              options: options,
              componentCreators: componentCreators,
              createConfig: createConfig,
              createConfigValidator: createConfigValidator,
              coreConfigValidators: coreConfigValidators,
              logger: logger,
              setDebugEnabled: setDebugEnabled,
              setErrorsEnabled: setErrorsEnabled
            });
            var optIn = createOptIn({
              config: config,
              logger: logger,
              cookieJar: cookie,
              createOrgNamespacedCookieName: createOrgNamespacedCookieName
            });
            var network = createNetwork({
              config: config,
              logger: logger,
              lifecycle: lifecycle,
              networkStrategy: networkStrategy
            });
            var eventManager = createEventManager({
              createEvent: createEvent,
              optIn: optIn,
              lifecycle: lifecycle,
              network: network,
              config: config,
              logger: logger
            });
            var createCookieJarTool = cookieJarToolFactory({
              config: config,
              createCookieProxy: createCookieProxy,
              createComponentNamespacedCookieJar: createComponentNamespacedCookieJar,
              getTopLevelDomain: getTopLevelDomain,
              createOrgNamespacedCookieName: createOrgNamespacedCookieName
            });
            return initializeComponents({
              componentCreators: componentCreators,
              lifecycle: lifecycle,
              componentRegistry: componentRegistry,
              getImmediatelyAvailableTools: function getImmediatelyAvailableTools(componentAbbreviation) {
                return {
                  config: config,
                  optIn: optIn,
                  network: network,
                  eventManager: eventManager,
                  cookieJar: createCookieJarTool(componentAbbreviation),
                  logger: logController.createComponentLogger(componentAbbreviation)
                };
              }
            });
          };

          var handleError = handleErrorFactory({
            instanceNamespace: instanceNamespace,
            getErrorsEnabled: getErrorsEnabled,
            logger: logger
          });
          var executeCommand = executeCommandFactory({
            logger: logger,
            configureCommand: configureCommand,
            debugCommand: debugCommand,
            handleError: handleError
          });
          var instance = instanceFactory(executeCommand);
          var queue = window[instanceNamespace].q;
          queue.push = instance;
          queue.forEach(instance);
        });
      }

    })();
  }

/////////////////////////////
// END OF LIBRARY CODE
/////////////////////////////

};

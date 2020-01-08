/*
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

/////////////////////////////////
// LIBRARY CODE
/////////////////////////////////
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
// we don't know. We also assume "unknown" browsers support third-party cookies,
// though we don't really know that either. We're making best guesses.

var browsersSupportingThirdPartyCookie = [CHROME, EDGE, EDGE_CHROMIUM, IE, UNKNOWN];
var areThirdPartyCookiesSupportedByDefault = (function (browser) {
  return includes(browsersSupportingThirdPartyCookie, browser);
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

  if (!crypto.subtle) {
    return false;
  }

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
 * @param {Object} content The base object to modify
 * @param {String } key The property to merge updates into. This
 * can be a dot-notation property path.
 * @returns {Function}
 */

var createMerger = (function (content, key) {
  return function (updates) {
    var propertyPath = key.split(".");
    var hostObjectForUpdates = propertyPath.reduce(function (obj, propertyName) {
      obj[propertyName] = obj[propertyName] || {};
      return obj[propertyName];
    }, content);
    deepAssign(hostObjectForUpdates, updates);
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
 * Whether a string ends with the characters of a specified string
 * @param {String} str The string to search within.
 * @param {String} suffix The string to search for.
 * @returns {boolean}
 */
var endsWith = (function (str, suffix) {
  return str.substr(-suffix.length) === suffix;
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
 * Returns the first item in the array that satisfies the provided testing function.
 * @param {Array} arr The array to search.
 * @param {Function} predicate Function that will be called for each item. Arguments
 * will be the item, the item index, then the array itself.
 * @returns {*}
 */
var find = (function (arr, predicate) {
  for (var i = 0; i < arr.length; i += 1) {
    var item = arr[i];

    if (predicate(item, i, arr)) {
      return item;
    }
  }

  return undefined;
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
  name: "Adobe Alloy",
  style: "display: none; width: 0; height: 0;"
};
var fireReferrerHideableImage = (function (request) {
  var createIframe = function createIframe() {
    return awaitSelector(BODY).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          body = _ref2[0];

      var iframe = createNode(IFRAME, IFRAME_ATTRS);
      return appendNode(body, iframe);
    });
  };

  var fireInIframe = function fireInIframe(_ref3) {
    var src = _ref3.src;
    return createIframe().then(function (iframe) {
      var currentDocument = iframe.contentWindow.document;
      return fireImage({
        src: src,
        currentDocument: currentDocument
      }).then(function () {
        removeNode(iframe);
      });
    });
  };

  var hideReferrer = request.hideReferrer,
      url = request.url;
  return hideReferrer ? fireInIframe({
    src: url
  }) : fireOnPage({
    src: url
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
var cookieName = baseNamespace + "getTld";
/**
 * Of the current web page's hostname, this is the top-most domain that is
 * not a "public suffix" as outlined in https://publicsuffix.org/. In other
 * words, this is top-most domain that is able to accept cookies.
 * @param {Object} window
 * @param {Object} cookieJar
 * @returns {string}
 */

var getApexDomain = (function (window, cookieJar) {
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
// Remember to also incorporate the org ID wherever cookies are read or written.
var COOKIE_NAME_PREFIX = "kndctr";
var IDENTITY_COOKIE_KEY = "identity";
var OPTIN_COOKIE_KEY = "optin";
var OPTOUT_COOKIE_KEY = "optout";

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
var sanitizeOrgIdForCookieName = (function (orgId) {
  return orgId.replace("@", "_");
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
var getNamespacedCookieName = (function (orgId, key) {
  return COOKIE_NAME_PREFIX + "_" + sanitizeOrgIdForCookieName(orgId) + "_" + key;
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
 * Determines whether a cookie name is namespaced according to the contract
 * defined by the server.
 * @param {String} orgId The org ID configured for the Alloy instance.
 * @param {String} name The cookie name.
 * @returns {boolean}
 */

var isNamespacedCookieName = (function (orgId, name) {
  return name.indexOf(COOKIE_NAME_PREFIX + "_" + sanitizeOrgIdForCookieName(orgId) + "_") === 0;
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
  return isString(str) && str.toLowerCase() === "true";
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
  var debugSessionValue = storage.session.getItem("debug");
  var debugEnabled = debugSessionValue === "true";
  var debugEnabledWritableFromConfig = debugSessionValue === null;

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
var hookNames = ["onComponentsRegistered", "onBeforeEvent", "onBeforeDataCollectionRequest", "onBeforeConsentRequest", "onResponse", "onRequestFailure", "onClick"];

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

/**
 * Request was successful.
 */
var SUCCESS = "success";
/**
 * Request failed and should not be retried.
 */

var FATAL_ERROR = "fatalError";
/**
 * Request failed and can be retried.
 */

var RETRYABLE_ERROR = "retryableError";

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
var STATUS_OK = 200;
var STATUS_NO_CONTENT = 204;
var STATUS_TOO_MANY_REQUESTS = 429;
var getResponseStatusType = (function (statusCode) {
  // Although other 200 status codes are in the "successful" 2xx range,
  // they're unexpected and we might not have code in place to successfully
  // handle them (e.g., what do we do with a 205 Reset Content?)
  if (statusCode === STATUS_OK || statusCode === STATUS_NO_CONTENT) {
    return SUCCESS;
  }

  if (statusCode === STATUS_TOO_MANY_REQUESTS || statusCode >= 500 && statusCode < 600) {
    return RETRYABLE_ERROR;
  }

  return FATAL_ERROR;
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
var sendNetworkRequestFactory = (function (_ref) {
  var logger = _ref.logger,
      networkStrategy = _ref.networkStrategy;

  /**
   * Send the request to either interact or collect based on expectsResponse.
   * When the response is returned it will call the lifecycle method "onResponse"
   * with the returned response object.
   *
   * @param {Object} payload This will be JSON stringified and sent as the post body.
   * @param {String} endpointDomain The domain of the endpoint to which the
   * request should be sent.
   * @param {String} action The server action which should be triggered (passed
   * as part of the URL).
   */
  return function (_ref2) {
    var payload = _ref2.payload,
        url = _ref2.url,
        requestId = _ref2.requestId;
    var stringifiedPayload = JSON.stringify(payload); // We want to log raw payload and event data rather than
    // our fancy wrapper objects. Calling payload.toJSON() is
    // insufficient to get all the nested raw data, because it's
    // not recursive (it doesn't call toJSON() on the event objects).
    // Parsing the result of JSON.stringify(), however, gives the
    // fully recursive raw data.
    // JSON.parse is expensive so we short circuit if logging is disabled.

    if (logger.enabled) {
      logger.log("Request " + requestId + ": Sending request.", JSON.parse(stringifiedPayload));
    }

    var executeRequest = function executeRequest() {
      var retriesAttempted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return networkStrategy(url, stringifiedPayload).then(function (response) {
        var statusType = getResponseStatusType(response.status);

        if (statusType === RETRYABLE_ERROR && retriesAttempted < 3) {
          return executeRequest(retriesAttempted + 1);
        }

        var parsedBody;

        try {
          parsedBody = JSON.parse(response.body);
        } catch (e) {// Non-JSON. Something went wrong.
        }

        var messagesSuffix = parsedBody || response.body ? "response body:" : "no response body.";
        logger.log("Request " + requestId + ": Received response with status code " + response.status + " and " + messagesSuffix, parsedBody || response.body);
        return {
          // Every response with a successful status code that has a body
          // must be a parsable body. If it isn't, it's an unexpected
          // body and we should consider it a failure.
          success: Boolean(statusType === SUCCESS && (!response.body || parsedBody)),
          statusCode: response.status,
          body: response.body,
          parsedBody: parsedBody
        };
      });
    };

    return executeRequest().catch(function (error) {
      throw stackError("Network request failed.", error);
    });
  };
});

/**
 * Parses a consent cookie.
 * @param {string} cookieValue Must be in the format a=b;c=d
 * @returns {Object} An object where the keys are purpose names and the values
 * are whether the user consented to those purposes.
 */

var parseConsentCookie = (function (cookieValue) {
  var categoryPairs = cookieValue.split(";");
  return categoryPairs.reduce(function (preferencesByPurpose, categoryPair) {
    var _categoryPair$split = categoryPair.split("="),
        _categoryPair$split2 = _slicedToArray(_categoryPair$split, 2),
        name = _categoryPair$split2[0],
        value = _categoryPair$split2[1];

    if (!name || value !== "true" && value !== "false") {
      throw new Error("Invalid consent cookie value: " + cookieValue);
    }

    preferencesByPurpose[name] = stringToBoolean(value);
    return preferencesByPurpose;
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

var getPersistedConsent = function getPersistedConsent(cookieName) {
  var cookieValue = cookie.get(cookieName);

  if (cookieValue) {
    return parseConsentCookie(cookieValue);
  }

  return undefined;
};

var areAllPurposesTrue = function areAllPurposesTrue(preferencesByPurpose) {
  return preferencesByPurpose && values(preferencesByPurpose).every(function (value) {
    return value;
  });
};

var areAnyPurposesTrue = function areAnyPurposesTrue(preferencesByPurpose) {
  return values(preferencesByPurpose).some(function (value) {
    return value;
  });
};

var OPTED_OUT_OF_ALL_PURPOSES = "The user opted out of all purposes.";
var OPTED_INTO_NO_PURPOSES = "The user opted into no purposes.";

var createConsentState = function createConsentState(_ref) {
  var optInEnabled = _ref.optInEnabled,
      optInCookieName = _ref.optInCookieName,
      optOutCookieName = _ref.optOutCookieName,
      onChange = _ref.onChange;
  var optInPreferencesByPurpose;
  var optOutPreferencesByPurpose;
  /**
   * That user's current consent status.
   * @typedef {Object} ConsentStatus
   * @property {boolean} consented Whether the user has consented. This will be
   * undefined if opt-in is enabled and the user hasn't provided their
   * preferences.
   * @property {String} deniedConsentReason If consented is false, this will
   * contain the reason consent was denied.
   */

  /**
   * @returns ConsentStatus
   */

  var getStatus = function getStatus() {
    // We look for any purpose being true rather than just looking for the
    // "general" purpose being true because it gives us some flexibility in the
    // future. If the edge decides to split the "general" purpose into
    // individual purposes, like "tracking" and "personalization", this code
    // would conservatively consider the user opted out of everything if either
    // "tracking" or "personalization" were set to true. This buys us time
    // to release a new version of Alloy that appropriately behaves according
    // to the more granular purposes and for customers to upgrade. In the
    // case of opt-in, this is also why we look for all purposes being true
    // rather than just the "general" purpose being true.
    if (optOutPreferencesByPurpose && areAnyPurposesTrue(optOutPreferencesByPurpose)) {
      return {
        consented: false,
        deniedConsentReason: OPTED_OUT_OF_ALL_PURPOSES
      };
    }

    if (!optInEnabled) {
      return {
        consented: true
      };
    }

    if (optInPreferencesByPurpose) {
      if (areAllPurposesTrue(optInPreferencesByPurpose)) {
        return {
          consented: true
        };
      }

      return {
        consented: false,
        deniedConsentReason: OPTED_INTO_NO_PURPOSES
      };
    }

    return {
      consented: undefined
    };
  };

  var _refreshFromCookies = function refreshFromCookies() {
    optInPreferencesByPurpose = getPersistedConsent(optInCookieName);
    optOutPreferencesByPurpose = getPersistedConsent(optOutCookieName);
  };

  _refreshFromCookies();

  return {
    setOptInPreferences: function setOptInPreferences(_optInPreferencesByPurpose) {
      optInPreferencesByPurpose = _optInPreferencesByPurpose;
      onChange(getStatus());
    },
    setOptOutPreferences: function setOptOutPreferences(_optOutPreferencesByPurpose) {
      optOutPreferencesByPurpose = _optOutPreferencesByPurpose;
      onChange(getStatus());
    },
    refreshFromCookies: function refreshFromCookies() {
      _refreshFromCookies();

      onChange(getStatus());
    },
    getStatus: getStatus
  };
};

var createConsent = (function (_ref2) {
  var config = _ref2.config,
      logger = _ref2.logger,
      lifecycle = _ref2.lifecycle,
      createConsentRequestPayload = _ref2.createConsentRequestPayload,
      sendEdgeNetworkRequest = _ref2.sendEdgeNetworkRequest;
  var orgId = config.orgId,
      optInEnabled = config.optInEnabled;
  var deferredsAwaitingConsent = [];

  var processConsentStatus = function processConsentStatus(consentStatus) {
    if (consentStatus.consented === undefined) {
      return;
    }

    while (deferredsAwaitingConsent.length) {
      var deferred = deferredsAwaitingConsent.shift();

      if (consentStatus.consented) {
        deferred.resolve();
      } else {
        deferred.reject(new Error(consentStatus.deniedConsentReason));
      }
    }
  };

  var consentState = createConsentState({
    optInEnabled: optInEnabled,
    optInCookieName: getNamespacedCookieName(orgId, OPTIN_COOKIE_KEY),
    optOutCookieName: getNamespacedCookieName(orgId, OPTOUT_COOKIE_KEY),
    onChange: processConsentStatus
  });
  var initialConsentStatus = consentState.getStatus();

  if (initialConsentStatus.consented === undefined) {
    logger.warn("Some commands may be delayed until the user opts in.");
  } else if (!initialConsentStatus.consented) {
    logger.warn("Some commands may fail. " + initialConsentStatus.deniedConsentReason);
  }

  return {
    /**
     * Update the purposes the user has opted into. Only to be called by the
     * Privacy component.
     * @param {Object} preferencesByPurpose An object where the key is
     * the purposes name and the value is a boolean indicating whether the user
     * has opted into the purpose.
     */
    setOptInPurposes: function setOptInPurposes(preferencesByPurpose) {
      var status = consentState.getStatus(); // The edge restricts modifying opt-in preferences if the user is opted
      // out, so we'll prevent the attempt.

      if (!status.consented && status.deniedConsentReason === OPTED_OUT_OF_ALL_PURPOSES) {
        return Promise.reject(new Error(OPTED_OUT_OF_ALL_PURPOSES));
      }

      consentState.setOptInPreferences(preferencesByPurpose);
      var payload = createConsentRequestPayload();
      return lifecycle.onBeforeConsentRequest({
        payload: payload
      }).then(function () {
        payload.setPurposes(preferencesByPurpose);
        return sendEdgeNetworkRequest({
          payload: payload,
          action: "opt-in"
        });
      }).then(function () {
        // We optimistically use the preferences the user provided right away,
        // but if the server doesn't agree and sends back a cookie value that
        // conflicts, we adopt whatever the server said since that ultimately
        // is what will be used if the user refreshes the page.
        consentState.refreshFromCookies();
      }).catch(function (error) {
        consentState.refreshFromCookies();
        throw error;
      });
    },

    /**
     * Update the purposes the user has opted out of. Only to be called by the
     * Privacy component.
     * @param {Object} preferencesByPurpose An object where the key is
     * the purposes name and the value is a boolean indicating whether the user
     * has opted out of the purpose.
     */
    setOptOutPurposes: function setOptOutPurposes(preferencesByPurpose) {
      consentState.setOptOutPreferences(preferencesByPurpose);
      var payload = createConsentRequestPayload();
      return lifecycle.onBeforeConsentRequest({
        payload: payload
      }).then(function () {
        payload.setPurposes(preferencesByPurpose);
        return sendEdgeNetworkRequest({
          payload: payload,
          action: "opt-out"
        });
      }).then(function () {
        // We optimistically use the preferences the user provided right away,
        // but if the server doesn't agree and sends back a cookie value that
        // conflicts, we adopt whatever the server said since that ultimately
        // is what will be used if the user refreshes the page.
        consentState.refreshFromCookies();
      }).catch(function (error) {
        consentState.refreshFromCookies();
        throw error;
      });
    },

    /**
     * Returns a promise that is resolved once the user consents to all
     * purposes. If the user has already consented to all purposes, the
     * promise will already be resolved. If the user consents to no purposes,
     * the promise will be rejected.
     */
    // TODO Once we support consenting to specific purposes, this
    // method will accept an array of purpose names as an argument and
    // will return a promise that will be resolved once the user has consented
    // to the specified purposes.
    whenConsented: function whenConsented() {
      var deferred = defer();
      deferredsAwaitingConsent.push(deferred);
      processConsentStatus(consentState.getStatus());
      return deferred.promise;
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
var createEvent = (function () {
  var content = {};
  var userXdm;
  var userData;
  var _expectResponse = false;
  var _documentMayUnload = false;
  var lastChanceCallback = noop;
  var event = {
    setUserXdm: function setUserXdm(value) {
      userXdm = value;
    },
    setUserData: function setUserData(value) {
      userData = value;
    },
    mergeXdm: createMerger(content, "xdm"),
    mergeMeta: createMerger(content, "meta"),
    mergeQuery: createMerger(content, "query"),
    documentMayUnload: function documentMayUnload() {
      _documentMayUnload = true;
    },
    getDocumentMayUnload: function getDocumentMayUnload() {
      return _documentMayUnload;
    },
    expectResponse: function expectResponse() {
      _expectResponse = true;
    },
    getExpectResponse: function getExpectResponse() {
      return _expectResponse;
    },
    isEmpty: function isEmpty() {
      return isEmptyObject(content) && (!userXdm || isEmptyObject(userXdm)) && (!userData || isEmptyObject(userData));
    },
    setLastChanceCallback: function setLastChanceCallback(value) {
      lastChanceCallback = value;
    },
    validate: function validate() {
      var warnings = [];

      if (event.isEmpty()) {
        warnings.push("No event xdm or event data specified.");
      }

      if (content.xdm && !content.xdm.eventType || userXdm && !userXdm.eventType) {
        warnings.push("No type or xdm.eventType specified.");
      }

      return warnings;
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
      } catch (e) {// the callback should have already logged the exception
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
/**
 * Creates a representation of a gateway response with the addition of
 * helper methods.
 * @returns Response
 */

var createResponse = (function () {
  var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _content$handle = content.handle,
      handle = _content$handle === void 0 ? [] : _content$handle,
      _content$errors = content.errors,
      errors = _content$errors === void 0 ? [] : _content$errors,
      _content$warnings = content.warnings,
      warnings = _content$warnings === void 0 ? [] : _content$warnings;
  /**
   * Response object.
   * @typedef {Object} Response
   */

  return {
    /**
     * Returns matching fragments of the response by type.
     * @param {String} type A string with the current format: <namespace:action>
     *
     * @example
     * getPayloadsByType("identity:persist")
     */
    getPayloadsByType: function getPayloadsByType(type) {
      return flatMap(handle.filter(function (fragment) {
        return fragment.type === type;
      }), function (fragment) {
        return fragment.payload;
      });
    },

    /**
     * Returns all errors.
     */
    getErrors: function getErrors() {
      return errors;
    },

    /**
     * Returns all warnings.
     */
    getWarnings: function getWarnings() {
      return warnings;
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

      if (commandName === "debug") {
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

var CONFIG_DOC_URI = "https://adobe.ly/2r0uUjh";

var createDataCollector = function createDataCollector(_ref) {
  var eventManager = _ref.eventManager,
      logger = _ref.logger;
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
          event.documentMayUnload();
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

        event.setUserXdm(xdm);
        event.setUserData(data);
        var warnings = event.validate();

        if (warnings.length) {
          logger.warn("Invalid event command options:\n\t - " + warnings.join("\n\t - ") + "\nFor documentation covering the event command see: " + CONFIG_DOC_URI);
        }

        return eventManager.sendEvent(event, {
          isViewStart: viewStart
        });
      }
    }
  };
};

createDataCollector.namespace = "DataCollector";
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
    return lifecycle.onClick({
      event: event,
      clickedElement: clickedElement
    }).then(function () {
      if (event.isEmpty()) {
        return Promise.resolve();
      }

      return eventManager.sendEvent(event);
    }).catch(function (error) {
      throw stackError("Failed to track click", error);
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
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
/**
 * Chains two validators together.
 *
 * Validators are functions of two parameters (value and path) that return the computed value if
 * the input is valid, or throw an exception if the input is invalid. In most cases the returned
 * value is the same as the input value; however, reference createDefaultValidator.js
 * to see an example where the computed value is different from the input. Additionally, if we ever
 * wanted to coerce types (i.e. parse string values into integers) as part of the validation process
 * we could use the computed value to accomplish that.
 *
 * The path parameter is used to generate informative error messages. It is created by the objectOf, and
 * arrayOf validators so that any error message can describe which key within the object or array is
 * invalid.
 *
 * The validators also have methods to chain additional validation logic. For example, when you call
 * `string()` to start a validator chain, it returns a validator function but it also has methods
 * like `required` and `nonEmpty`. In index.js you can see that these methods are actually calling `chain`.
 * Specifically in this function, the leftValidator is called first and then the return value of that is
 * sent to the rightValidator. For example, when calling `string().nonEmpty().required()` the following
 * chain is built up:
 * ```
 *              *
 *            /   \
 *          *     required
 *        /   \
 *      *     nonEmpty
 *    /   \
 * base   string
 * ```
 * Where every * is a call to chain where the two are combined. The individual validators are called from
 * left to right in the above tree. The base validator is simply the identity function `value => value`,
 * representing an optional value.
 *
 * After combining the validators, the new validator function is then augmented with the methods from the
 * leftValidator and from the additionalMethods parameter. For example, when the string() function is called
 * it chains to the base validator, but also adds additional methods like (`regexp`, `domain`, `nonEmpty`,
 * and `unique`). When `nonEmpty` is called, which calls chain again, the additional methods are carried
 * forward because they are already defined on the leftValidator.
 *
 * The base validator also contains the two methods `required` and `default`, so these can be used anywhere
 * after any of the exposed validator functions are called.
 */

var chain = (function (leftValidator, rightValidator) {
  var additionalMethods = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // combine the two validators, calling left first and then right.
  // pass the return value from left into right.
  var combinedValidator = function combinedValidator(value, path) {
    return rightValidator(leftValidator(value, path), path);
  }; // add the methods already defined on the left validator, and the additionalMethods
  // to the new combined validator function.


  assign(combinedValidator, leftValidator, additionalMethods);
  return combinedValidator;
});

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
/**
 * This augments `chain` with a null check done before running the rightValidator.
 * See chain for more info.
 *
 * For most validators, we want the validation to be optional (i.e. allow null or
 * undefined values). To accomplish this, the validator needs to have a check
 * at the begining of the function, short circuiting the validation logic and
 * returning value if value is null or undefined. `default` and `required` do not
 * want this null check though. Indeed, `default` should return the default value
 * if value is null, and `required` should throw an error if value is null.
 *
 * So to keep from having to have a null check in front of most validators, this
 * function allows you to chain a rightValidator that needs to have a null check.
 */

var nullSafeChain = (function (leftValidator, rightValidator, additionalMethods) {
  var rightValidatorWithNullCheck = function rightValidatorWithNullCheck(value, path) {
    return value == null ? value : rightValidator(value, path);
  };

  return chain(leftValidator, rightValidatorWithNullCheck, additionalMethods);
});

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
var assertValid = (function (isValid, value, path, message) {
  if (!isValid) {
    throw new Error("'" + path + "': Expected " + message + ", but got '" + value + "'.");
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
var booleanValidator = (function (value, path) {
  assertValid(isBoolean(value), value, path, "true or false");
  return value;
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
var callbackValidator = (function (value, path) {
  assertValid(isFunction(value), value, path, "a function");
  return value;
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
var createArrayOfValidator = (function (elementValidator) {
  return function (value, path) {
    assertValid(Array.isArray(value), value, path, "an array");
    var errors = [];
    var validatedArray = value.map(function (subValue, i) {
      try {
        return elementValidator(subValue, path + "[" + i + "]");
      } catch (e) {
        errors.push(e.message);
        return undefined;
      }
    });

    if (errors.length) {
      throw new Error(errors.join("\n"));
    }

    return validatedArray;
  };
});

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
var createDefaultValidator = (function (defaultValue) {
  return function (value) {
    if (value == null) {
      return defaultValue;
    }

    return value;
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
var createMinimumValidator = (function (typeName, minimum) {
  return function (value, path) {
    assertValid(value >= minimum, value, path, typeName + " greater than or equal to " + minimum);
    return value;
  };
});

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
var createObjectOfValidator = (function (schema) {
  return function (value, path) {
    assertValid(isObject(value), value, path, "an object");
    var errors = [];
    var validatedObject = {};
    Object.keys(schema).forEach(function (subKey) {
      var subValue = value[subKey];
      var subSchema = schema[subKey];
      var subPath = path ? path + "." + subKey : subKey;

      try {
        var validatedValue = subSchema(subValue, subPath);

        if (validatedValue !== undefined) {
          validatedObject[subKey] = validatedValue;
        }
      } catch (e) {
        errors.push(e.message);
      }
    });

    if (errors.length) {
      throw new Error(errors.join("\n"));
    }

    return validatedObject;
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
var createUniqueValidator = (function () {
  var values = [];
  return function (value, path) {
    assertValid(values.indexOf(value) === -1, value, path, "a unique value across instances");
    values.push(value);
    return value;
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
var DOMAIN_REGEX = /^[a-z0-9.]{1,}$/i;
var domainValidator = (function (value, path) {
  assertValid(DOMAIN_REGEX.test(value), value, path, "a valid domain");
  return value;
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
var integerValidator = (function (value, path) {
  assertValid(isInteger(value), value, path, "an integer");
  return value;
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
var nonEmptyValidator = (function (value, path) {
  assertValid(value.length > 0, value, path, "a non-empty string");
  return value;
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
var numberValidator = (function (value, path) {
  assertValid(isNumber(value), value, path, "a number");
  return value;
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
var regexpValidator = (function (value, path) {
  assertValid(isValidRegExp(value), value, path, "a regular expression");
  return value;
});

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
var requiredValidator = (function (value, path) {
  if (value == null) {
    throw new Error("'" + path + "' is a required option");
  }

  return value;
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
var stringValidator = (function (value, path) {
  assertValid(isString(value), value, path, "a string");
  return value;
});

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

var base = function base(value) {
  return value;
}; // The 'default' and 'required' methods are available after any data-type method
// Don't use the nullSafeChain because they need to handle the null or undefined case


base.default = function _default(defaultValue) {
  return chain(this, createDefaultValidator(defaultValue));
};

base.required = function required() {
  return chain(this, requiredValidator);
}; // helper validators


var domain = function domain() {
  return nullSafeChain(this, domainValidator);
};

var minimumInteger = function minimumInteger(minValue) {
  return nullSafeChain(this, createMinimumValidator("an integer", minValue));
};

var minimumNumber = function minimumNumber(minValue) {
  return nullSafeChain(this, createMinimumValidator("a number", minValue));
};

var integer = function integer() {
  return nullSafeChain(this, integerValidator, {
    minimum: minimumInteger
  });
};

var nonEmpty = function nonEmpty() {
  return nullSafeChain(this, nonEmptyValidator);
};

var regexp = function regexp() {
  return nullSafeChain(this, regexpValidator);
};

var unique = function createUnique() {
  return nullSafeChain(this, createUniqueValidator());
}; // data-type validators.  These are the first functions that are called to create a validator.


var arrayOf = function arrayOf(elementValidator) {
  return nullSafeChain(this, createArrayOfValidator(elementValidator));
};

var boolean = function boolean() {
  return nullSafeChain(this, booleanValidator);
};

var callback = function callback() {
  return nullSafeChain(this, callbackValidator);
};

var number = function number() {
  return nullSafeChain(this, numberValidator, {
    minimum: minimumNumber,
    integer: integer,
    unique: unique
  });
};

var objectOf = function objectOf(schema) {
  return nullSafeChain(this, createObjectOfValidator(schema));
};

var string = function string() {
  return nullSafeChain(this, stringValidator, {
    regexp: regexp,
    domain: domain,
    nonEmpty: nonEmpty,
    unique: unique
  });
};

var boundArrayOf = arrayOf.bind(base);
var boundBoolean = boolean.bind(base);
var boundCallback = callback.bind(base);
var boundNumber = number.bind(base);
var boundObjectOf = objectOf.bind(base);
var boundString = string.bind(base);

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
var configValidators = {
  clickCollectionEnabled: boundBoolean().default(true),
  downloadLinkQualifier: boundString().regexp().default("\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$")
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
      event.documentMayUnload();
      event.mergeXdm({
        eventType: "web.webinteraction.linkClicks",
        web: {
          webInteraction: {
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
createActivityCollector.configValidators = configValidators;

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
var createResultLogMessage = function createResultLogMessage(idSync, success) {
  return "ID sync " + (success ? "succeeded" : "failed") + ": " + idSync.spec.url;
};

var processIdSyncsFactory = (function (_ref) {
  var fireReferrerHideableImage = _ref.fireReferrerHideableImage,
      logger = _ref.logger,
      consent = _ref.consent;
  return function (idSyncs) {
    var urlIdSyncs = idSyncs.filter(function (idSync) {
      return idSync.type === "url";
    });

    if (!urlIdSyncs.length) {
      return Promise.resolve();
    }

    return consent.whenConsented().then(function () {
      return Promise.all(urlIdSyncs.map(function (idSync) {
        return fireReferrerHideableImage(idSync.spec).then(function () {
          logger.log(createResultLogMessage(idSync, true));
        }).catch(function () {
          // We intentionally do not throw an error if id syncs fail. We
          // consider it a non-critical failure and therefore do not want it to
          // reject the promise handed back to the customer.
          logger.error(createResultLogMessage(idSync, false));
        });
      }));
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
var configValidators$1 = {
  idSyncEnabled: boundBoolean(),
  idSyncContainerId: boundNumber().integer().minimum(0),
  thirdPartyCookiesEnabled: boundBoolean().default(true),
  idMigrationEnabled: boundBoolean().default(true)
}; // Not much need to validate since we are our own consumer.

configValidators$1.reactorRegisterGetEcid = boundCallback().default(function () {});

/*
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

var createCustomerIds = (function (_ref) {
  var eventManager = _ref.eventManager,
      consent = _ref.consent,
      logger = _ref.logger;

  var hash = function hash(originalIds, normalizedIds) {
    var idNames = Object.keys(normalizedIds);
    var idsToHash = idNames.filter(function (idName) {
      return originalIds[idName].hashEnabled;
    });
    var idHashPromises = idsToHash.map(function (id) {
      return convertStringToSha256Buffer(normalizedIds[id].id.trim().toLowerCase());
    });
    return Promise.all(idHashPromises).then(function (hashedIds) {
      return hashedIds.reduce(function (finalIds, hashedId, index) {
        if (!hashedId) {
          delete finalIds[idsToHash[index]];
          logger.warn("Unable to hash identity " + idsToHash[index] + " due to lack of browser support.");
        } else {
          finalIds[idsToHash[index]].id = convertBufferToHex(hashedId);
        }

        return finalIds;
      }, normalizedIds);
    });
  };

  var state = {
    ids: {},
    hasIds: false
  };

  var setState = function setState(normalizedIds) {
    state.ids = _objectSpread2({}, state.ids, {}, normalizedIds);
    state.hasIds = !!Object.keys(state.ids).length;
  };

  var customerIds = {
    addToPayload: function addToPayload(payload) {
      if (state.hasIds) {
        var ids = clone(state.ids);
        Object.keys(ids).forEach(function (name) {
          payload.addIdentity(name, ids[name]);
        });
      }
    },
    sync: function sync(originalIds) {
      validateCustomerIds(originalIds);
      var normalizedIds = normalizeCustomerIds(originalIds);
      return hash(originalIds, normalizedIds).then(function (hashedIds) {
        if (isEmptyObject(hashedIds)) {
          return false;
        }

        setState(hashedIds);
        var event = eventManager.createEvent();
        return consent.whenConsented().then(function () {
          // FIXME: Konductor shouldn't require an event.
          return eventManager.sendEvent(event);
        });
      });
    }
  };
  return customerIds;
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

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
// Maybe default the domain in the cookieJar to apex while allowing overrides.

var apexDomain = getApexDomain(window, cookie);
var createMigration = (function (_ref) {
  var orgId = _ref.orgId,
      consent = _ref.consent;
  var amcvCookieName = "AMCV_" + orgId;
  return {
    getEcidFromLegacyCookies: function getEcidFromLegacyCookies() {
      var ecid = null;
      var secidCookieName = "s_ecid";
      var legacyEcidCookieValue = cookie.get(secidCookieName) || cookie.get(amcvCookieName);

      if (legacyEcidCookieValue) {
        var reg = /(^|\|)MCMID\|(\d+)($|\|)/;
        var matches = legacyEcidCookieValue.match(reg);

        if (matches) {
          // Destructuring arrays breaks in IE
          ecid = matches[2];
        }
      }

      return ecid;
    },
    createLegacyCookie: function createLegacyCookie(ecid) {
      var amcvCookieValue = cookie.get(amcvCookieName);

      if (amcvCookieValue) {
        return Promise.resolve();
      }

      return consent.whenConsented().then(function () {
        cookie.set(amcvCookieName, "MCMID|" + ecid, {
          domain: apexDomain,
          // Without `expires` this will be a session cookie.
          expires: 390 // days, or 13 months.

        });
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
var ecidNamespace = "ECID";

var addEcidToPayload = function addEcidToPayload(payload, ecid) {
  payload.addIdentity(ecidNamespace, {
    id: ecid
  });
};

var createComponent = (function (processIdSyncs, config, logger, consent, eventManager) {
  var idMigrationEnabled = config.idMigrationEnabled,
      orgId = config.orgId;
  var identityCookieName = getNamespacedCookieName(orgId, IDENTITY_COOKIE_KEY);
  var deferredForEcid;
  var migration = createMigration({
    orgId: orgId,
    consent: consent
  });

  var hasIdentityCookie = function hasIdentityCookie() {
    return Boolean(cookie.get(identityCookieName));
  };

  var customerIds = createCustomerIds({
    eventManager: eventManager,
    consent: consent,
    logger: logger
  }); // TO-DOCUMENT: We wait for ECID before trigger any events.

  var accommodateIdentityOnRequest = function accommodateIdentityOnRequest(payload) {
    var promise;

    if (!hasIdentityCookie()) {
      var ecidToMigrate = idMigrationEnabled && migration.getEcidFromLegacyCookies();

      if (ecidToMigrate) {
        // We don't have an identity cookie, but we do have an ECID
        // from a legacy cookie that we can explicitly provide
        // to the server, which is sufficient until the identity cookie
        // gets set.
        addEcidToPayload(payload, ecidToMigrate);
      } else if (deferredForEcid) {
        // We don't have an identity cookie, but the first request has
        // been sent to get it. We must wait for the response to the first
        // request to come back and a cookie set before we can let this
        // request go out.
        logger.log("Delaying request while retrieving ECID from server.");
        promise = deferredForEcid.promise.then(function () {
          logger.log("Resuming previously delayed request.");
        });
      } else {
        // We don't have an identity cookie and no request has gone out
        // to get it. We'll let this request go out to fetch the cookie,
        // but we'll set up a promise so that future requests can
        // know when the cookie has been set. We don't let additional
        // requests to go out in the meantime because a new ECID would
        // be minted for each request (each request would be seen as a
        // new visitor).
        deferredForEcid = defer();
        payload.expectResponse(); // If third-party cookies are enabled by the customer and
        // supported by the browser, we will send the request to a
        // a third-party domain that allows for more accurate
        // identification of the user through use of a third-party cookie.

        if (config.thirdPartyCookiesEnabled && areThirdPartyCookiesSupportedByDefault(getBrowser(window))) {
          payload.useIdThirdPartyDomain();
        }
      }
    }

    customerIds.addToPayload(payload);
    return promise;
  };

  return {
    lifecycle: {
      onBeforeEvent: function onBeforeEvent(_ref) {
        var event = _ref.event,
            payload = _ref.payload;
        event.mergeQuery({
          identity: {
            fetch: [ecidNamespace]
          }
        });
        var configOverrides = {};

        if (config.idSyncEnabled !== undefined) {
          configOverrides.idSyncEnabled = config.idSyncEnabled;
        }

        if (config.idSyncContainerId !== undefined) {
          configOverrides.idSyncContainerId = config.idSyncContainerId;
        }

        if (Object.keys(configOverrides).length) {
          payload.mergeConfigOverrides({
            identity: configOverrides
          });
        }
      },
      onBeforeDataCollectionRequest: function onBeforeDataCollectionRequest(_ref2) {
        var payload = _ref2.payload;
        return accommodateIdentityOnRequest(payload);
      },
      onBeforeConsentRequest: function onBeforeConsentRequest(_ref3) {
        var payload = _ref3.payload;
        return accommodateIdentityOnRequest(payload);
      },
      onResponse: function onResponse(_ref4) {
        var response = _ref4.response;
        var promises = [];

        if (idMigrationEnabled) {
          var identityResultPayloads = response.getPayloadsByType("identity:result");
          var ecidPayload = find(identityResultPayloads, function (payload) {
            return payload.namespace && payload.namespace.code === ecidNamespace;
          });

          if (ecidPayload) {
            promises.push(migration.createLegacyCookie(ecidPayload.id));
          }
        } // If we were queuing requests until we received the identity cookie,
        // and now we have the identity cookie, we can let the queued
        // requests go out. Technically, we should always have an identity
        // cookie at this point, but we check just to be sure.


        if (deferredForEcid && hasIdentityCookie()) {
          deferredForEcid.resolve();
        }

        promises.push(processIdSyncs(response.getPayloadsByType("identity:exchange"), logger));
        return Promise.all(promises);
      }
    },
    commands: {
      setCustomerIds: function setCustomerIds(options) {
        return customerIds.sync(options);
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
      consent = _ref.consent,
      eventManager = _ref.eventManager;
  var processIdSyncs = processIdSyncsFactory({
    fireReferrerHideableImage: fireReferrerHideableImage,
    logger: logger,
    consent: consent
  });
  return createComponent(processIdSyncs, config, logger, consent, eventManager);
};

createIdentity.namespace = "Identity";
createIdentity.configValidators = configValidators$1;

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

var createResultLogMessage$1 = function createResultLogMessage(urlDestination, success) {
  return "URL destination " + (success ? "succeeded" : "failed") + ": " + urlDestination.spec.url;
};

var processUrls = function processUrls(fireReferrerHideableImage, logger, destinations) {
  var urlDestinations = destinations.filter(function (dest) {
    return dest.type === "url";
  });
  return Promise.all(urlDestinations.map(function (urlDestination) {
    return fireReferrerHideableImage(urlDestination.spec).then(function () {
      logger.log(createResultLogMessage$1(urlDestination, true));
    }).catch(function () {
      // We intentionally do not throw an error if destinations fail. We
      // consider it a non-critical failure and therefore do not want it to
      // reject the promise handed back to the customer.
      logger.error(createResultLogMessage$1(urlDestination, false));
    });
  }));
};

var processCookies = function processCookies(destinations) {
  var cookieDestinations = destinations.filter(function (dest) {
    return dest.type === "cookie";
  });
  cookieDestinations.forEach(function (dest) {
    var _dest$spec = dest.spec,
        name = _dest$spec.name,
        value = _dest$spec.value,
        domain = _dest$spec.domain,
        ttlDays = _dest$spec.ttlDays;
    cookie.set(name, value || "", {
      domain: domain || "",
      expires: ttlDays || 10 // days

    });
  });
};

var processDestinationsFactory = (function (_ref) {
  var fireReferrerHideableImage = _ref.fireReferrerHideableImage,
      logger = _ref.logger;
  return function (destinations) {
    processCookies(destinations);
    return processUrls(fireReferrerHideableImage, logger, destinations);
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

var getConfigOverrides = function getConfigOverrides(config) {
  var configOverrides = {};

  if (config.urlDestinationsEnabled !== undefined) {
    configOverrides.urlDestinationsEnabled = config.urlDestinationsEnabled;
  }

  if (config.cookieDestinationsEnabled !== undefined) {
    configOverrides.storedDestinationsEnabled = config.cookieDestinationsEnabled;
  }

  return Object.keys(configOverrides).length ? configOverrides : undefined;
};

var createAudiences = function createAudiences(_ref) {
  var config = _ref.config,
      logger = _ref.logger;
  var processDestinations = processDestinationsFactory({
    fireReferrerHideableImage: fireReferrerHideableImage,
    logger: logger
  });
  return {
    lifecycle: {
      onBeforeEvent: function onBeforeEvent(_ref2) {
        var event = _ref2.event,
            isViewStart = _ref2.isViewStart,
            payload = _ref2.payload;

        if (isViewStart) {
          var configOverrides = getConfigOverrides(config);

          if (configOverrides) {
            event.expectResponse();
            payload.mergeConfigOverrides({
              activation: configOverrides
            });
          }
        }
      },
      onResponse: function onResponse(_ref3) {
        var response = _ref3.response;
        var destinations = response.getPayloadsByType("activation:push");
        return processDestinations(destinations);
      }
    },
    commands: {}
  };
};

createAudiences.namespace = "Audiences";
createAudiences.configValidators = {
  cookieDestinationsEnabled: boundBoolean(),
  urlDestinationsEnabled: boundBoolean()
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
    var ruleRespresentation = JSON.stringify(rule);
    return "Failed to execute " + ruleComponent.moduleType + " for " + ruleRespresentation + " rule.\n    " + errorMessage + " " + (errorStack ? "\n " + errorStack : "");
  };

  var logActionError = function logActionError(action, rule, e) {
    if (logger.enabled) {
      logger.error(getErrorMessage(action, rule, e.message, e.stack));
    }
  };

  var logRuleCompleted = function logRuleCompleted(rule) {
    if (logger.enabled) {
      var ruleRespresentation = JSON.stringify(rule);
      logger.log("Rule " + ruleRespresentation + " fired.");
    }
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

  var disablePersonalization = function disablePersonalization(payload) {
    payload.mergeConfigOverrides({
      personalization: {
        enabled: false
      }
    });
  };

  return {
    lifecycle: {
      onBeforeEvent: function onBeforeEvent(_ref2) {
        var event = _ref2.event,
            isViewStart = _ref2.isViewStart,
            payload = _ref2.payload;

        if (authoringModeEnabled) {
          logger.warn("Rendering is disabled, authoring mode.");
          disablePersonalization(payload);
          return;
        }

        if (!isViewStart) {
          // If NOT isViewStart disable personalization
          disablePersonalization(payload);
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
      onRequestFailure: function onRequestFailure() {
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
createPersonalization.configValidators = {
  prehidingStyle: boundString().nonEmpty()
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
var webFactory = (function (window) {
  return function (xdm) {
    var web = {
      webPageDetails: {
        URL: window.location.href || window.location
      },
      webReferrer: {
        URL: window.top.document.referrer
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
var libraryVersion = "0.0.12";

/*
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
var web = webFactory(window);
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
createContext.configValidators = {
  context: boundArrayOf(boundString()).default(Object.keys(optionalContexts))
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
var ALL = "all";
var NONE = "none";

var throwInvalidOptInPurposesError = function throwInvalidOptInPurposesError(purposes) {
  throw new Error("Opt-in purposes must be \"all\" or \"none\". Received: " + purposes);
};

var throwInvalidOptOutPurposesError = function throwInvalidOptOutPurposesError(purposes) {
  throw new Error("Opt-out purposes must be \"all\". Received: " + purposes);
};

var createPrivacy = function createPrivacy(_ref) {
  var config = _ref.config,
      consent = _ref.consent;
  return {
    commands: {
      optIn: function optIn(_ref2) {
        var purposes = _ref2.purposes;

        if (!config.optInEnabled) {
          throw new Error("optInEnabled must be set to true before using the optIn command.");
        }

        if (!isString(purposes)) {
          throwInvalidOptInPurposesError(purposes);
        }

        var lowerCasePurposes = purposes.toLowerCase();

        if (lowerCasePurposes !== ALL && lowerCasePurposes !== NONE) {
          throwInvalidOptInPurposesError(purposes);
        }

        return consent.setOptInPurposes({
          GENERAL: lowerCasePurposes === ALL
        });
      },
      optOut: function optOut(_ref3) {
        var purposes = _ref3.purposes;

        if (!isString(purposes)) {
          throwInvalidOptOutPurposesError(purposes);
        }

        var lowerCasePurposes = purposes.toLowerCase();

        if (lowerCasePurposes !== ALL) {
          throwInvalidOptOutPurposesError(purposes);
        }

        return consent.setOptOutPurposes({
          GENERAL: true
        });
      }
    }
  };
};

createPrivacy.namespace = "Privacy";
createPrivacy.configValidators = {
  optInEnabled: boundBoolean().default(false)
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
createEventMerge.configValidators = {}; // Not much need to validate since we are our own consumer.

createEventMerge.configValidators.reactorRegisterCreateEventMergeId = boundCallback().default(function () {});

/*
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

/*
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
var CONFIG_DOC_URI$1 = "https://adobe.ly/2M4ErNE";

var buildSchema = function buildSchema(coreConfigValidators, componentCreators) {
  var schema = {};
  assign(schema, coreConfigValidators);
  componentCreators.forEach(function (createComponent) {
    var configValidators = createComponent.configValidators;
    assign(schema, configValidators);
  });
  return schema;
};

var transformOptions = function transformOptions(schema, options) {
  try {
    var validator = boundObjectOf(schema).required();
    return validator(options);
  } catch (e) {
    throw new Error("Resolve these configuration problems:\n\t - " + e.message.split("\n").join("\n\t - ") + "\nFor configuration documentation see: " + CONFIG_DOC_URI$1);
  }
};

var buildAndValidateConfig = (function (_ref) {
  var options = _ref.options,
      componentCreators = _ref.componentCreators,
      coreConfigValidators = _ref.coreConfigValidators,
      createConfig = _ref.createConfig,
      logger = _ref.logger,
      setDebugEnabled = _ref.setDebugEnabled,
      setErrorsEnabled = _ref.setErrorsEnabled;
  var schema = buildSchema(coreConfigValidators, componentCreators);
  var config = createConfig(transformOptions(schema, options));
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
    var namespace = createComponent.namespace; // TO-DOCUMENT: Helpers that we inject into factories.

    var tools = getImmediatelyAvailableTools(namespace);
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
var EDGE_DOMAIN = "edge.adobedc.net";
var ID_THIRD_PARTY_DOMAIN = "adobedc.demdex.net";

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
    errorsEnabled: boundBoolean().default(true),
    debugEnabled: boundBoolean().default(false),
    configId: boundString().unique().required(),
    edgeDomain: boundString().domain().default(EDGE_DOMAIN),
    edgeBasePath: boundString().nonEmpty().default(EDGE_BASE_PATH),
    orgId: boundString().unique().required(),
    onBeforeEventSend: boundCallback().default(noop),
    datasetId: boundString().nonEmpty(),
    schemaId: boundString().nonEmpty()
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
var xhrRequestFactory = (function (XMLHttpRequest) {
  return function (url, body) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 0) {
            reject(new Error("Request aborted."));
          } else {
            resolve({
              status: request.status,
              body: request.responseText
            });
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
      credentials: "include",
      // To set the cookie header in the request.
      headers: {
        "Content-Type": "text/plain; charset=UTF-8"
      },
      referrer: "client",
      body: body
    }).then(function (response) {
      return response.text().then(function (responseBody) {
        return {
          status: response.status,
          body: responseBody
        };
      });
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
    } // Using sendBeacon, we technically don't get a response back from
    // the server, but we'll resolve the promise with an object to maintain
    // consistency with other network strategies.


    return Promise.resolve({
      status: 204,
      body: ""
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
var networkStrategyFactory = (function (window, logger) {
  var fetch = isFunction(window.fetch) ? fetchFactory(window.fetch) : xhrRequestFactory(window.XMLHttpRequest);
  var sendBeacon = window.navigator && isFunction(window.navigator.sendBeacon) ? sendBeaconFactory(window.navigator, fetch, logger) : fetch;
  return function (url, body, documentMayUnload) {
    var method = documentMayUnload ? sendBeacon : fetch;
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
  var config = _ref.config,
      logger = _ref.logger,
      lifecycle = _ref.lifecycle,
      consent = _ref.consent,
      createEvent = _ref.createEvent,
      createDataCollectionRequestPayload = _ref.createDataCollectionRequestPayload,
      sendEdgeNetworkRequest = _ref.sendEdgeNetworkRequest;
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
    var configOverrides = {
      orgId: orgId
    };
    var dataCollection = Object.create(null);
    assignIf(dataCollection, {
      synchronousValidation: true
    }, function () {
      return debugEnabled;
    });
    assignIf(dataCollection, {
      datasetId: config.datasetId
    }, function () {
      return datasetId;
    });
    assignIf(dataCollection, {
      schemaId: config.schemaId
    }, function () {
      return schemaId;
    });

    if (!isEmptyObject(dataCollection)) {
      configOverrides.dataCollection = dataCollection;
    }

    payload.mergeConfigOverrides(configOverrides);
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
      event.setLastChanceCallback(onBeforeEventSendWithLoggedExceptions);
      var _options$isViewStart = options.isViewStart,
          isViewStart = _options$isViewStart === void 0 ? false : _options$isViewStart;
      var payload = createDataCollectionRequestPayload();
      addMetaTo(payload);
      return lifecycle.onBeforeEvent({
        event: event,
        isViewStart: isViewStart,
        payload: payload
      }).then(function () {
        // it's important to add the event here because the payload object will call toJSON
        // which applies the userData, userXdm, and lastChanceCallback
        payload.addEvent(event);
        return consent.whenConsented();
      }).then(function () {
        return lifecycle.onBeforeDataCollectionRequest({
          payload: payload
        });
      }).then(function () {
        var documentMayUnload = event.getDocumentMayUnload();
        var expectResponse = payload.getExpectResponse();
        var reallyExpectResponse = documentMayUnload ? false : expectResponse;
        var action = reallyExpectResponse ? "interact" : "collect";
        return sendEdgeNetworkRequest({
          payload: payload,
          action: action
        });
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
var STATE_STORE_HANDLE_TYPE = "state:store";
var createCookieTransfer = (function (_ref) {
  var cookieJar = _ref.cookieJar,
      orgId = _ref.orgId,
      apexDomain = _ref.apexDomain;
  return {
    /**
     * When sending to a third-party endpoint, the endpoint won't be able to
     * access first-party cookies, therefore we transfer cookies into
     * the request body so they can be read by the server.
     */
    cookiesToPayload: function cookiesToPayload(payload, endpointDomain) {
      var isEndpointFirstParty = endsWith(endpointDomain, apexDomain);
      var state = {
        domain: apexDomain
      }; // If the endpoint is first-party, there's no need to transfer cookies
      // to the payload since they'll be automatically passed through cookie
      // headers.

      if (!isEndpointFirstParty) {
        var cookies = cookieJar.get();
        var entries = Object.keys(cookies).filter(function (name) {
          // We have a contract with the server that we will pass
          // all cookies whose names are namespaced according to the
          // logic in isNamespacedCookieName as well as any legacy
          // cookie names (so that the server can handle migrating
          // identities on websites previously using Visitor.js)
          return isNamespacedCookieName(orgId, name);
        }).map(function (qualifyingCookieName) {
          return {
            key: qualifyingCookieName,
            value: cookies[qualifyingCookieName]
          };
        });

        if (entries.length) {
          state.entries = entries;
        }
      }

      payload.mergeState(state);
    },

    /**
     * When receiving from a third-party endpoint, the endpoint won't be able to
     * write first-party cookies, therefore we write first-party cookies
     * as directed in the response body.
     */
    responseToCookies: function responseToCookies(response) {
      response.getPayloadsByType(STATE_STORE_HANDLE_TYPE).forEach(function (stateItem) {
        var options = {
          domain: apexDomain
        };

        if (stateItem.maxAge !== undefined) {
          // cookieJar expects "expires" in days
          options.expires = convertTimes(SECOND, DAY, stateItem.maxAge);
        }

        cookieJar.set(stateItem.key, stateItem.value, options);
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
/**
 * Creates a payload object that extends a base payload object. This is not
 * intended to be used from any modules other than "extending" payload modules.
 * @param {Function} construct A function that which will receive the content object
 * that the "subclass" can modify. The content object will be serialized when toJSON()
 * is called. The construct method should return an object whose methods will be merged on
 * on top of the methods of the base payload object.
 * @returns {Object} The extended payload object.
 */

var createRequestPayload = (function (construct) {
  var content = {};
  var _useIdThirdPartyDomain = false;
  var basePayload = {
    mergeConfigOverrides: createMerger(content, "meta.configOverrides"),
    mergeState: createMerger(content, "meta.state"),
    useIdThirdPartyDomain: function useIdThirdPartyDomain() {
      _useIdThirdPartyDomain = true;
    },
    getUseIdThirdPartyDomain: function getUseIdThirdPartyDomain() {
      return _useIdThirdPartyDomain;
    },
    expectResponse: function expectResponse() {},
    toJSON: function toJSON() {
      return content;
    }
  };
  var extendedPayload = construct(content);
  return assign({}, basePayload, extendedPayload);
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
var createConsentRequestPayload = (function () {
  return createRequestPayload(function (content) {
    return {
      addIdentity: function addIdentity(namespaceCode, identity) {
        content.identityMap = content.identityMap || {};
        content.identityMap[namespaceCode] = content.identityMap[namespaceCode] || [];
        content.identityMap[namespaceCode].push(identity);
      },
      setPurposes: function setPurposes(purposes) {
        content.purposes = purposes;
      }
    };
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
var createDataCollectionRequestPayload = (function () {
  var _expectResponse = false;
  return createRequestPayload(function (content) {
    return {
      addIdentity: function addIdentity(namespaceCode, identity) {
        content.xdm = content.xdm || {};
        content.xdm.identityMap = content.xdm.identityMap || {};
        content.xdm.identityMap[namespaceCode] = content.xdm.identityMap[namespaceCode] || [];
        content.xdm.identityMap[namespaceCode].push(identity);
      },
      addEvent: function addEvent(event) {
        content.events = content.events || [];
        _expectResponse = _expectResponse || event.getExpectResponse();
        content.events.push(event.toJSON());
      },
      expectResponse: function expectResponse() {
        _expectResponse = true;
      },
      getExpectResponse: function getExpectResponse() {
        return _expectResponse;
      }
    };
  });
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
var sendEdgeNetworkRequestFactory = (function (_ref) {
  var config = _ref.config,
      logger = _ref.logger,
      lifecycle = _ref.lifecycle,
      cookieTransfer = _ref.cookieTransfer,
      sendNetworkRequest = _ref.sendNetworkRequest,
      createResponse = _ref.createResponse,
      processWarningsAndErrors = _ref.processWarningsAndErrors;
  var edgeDomain = config.edgeDomain,
      edgeBasePath = config.edgeBasePath,
      configId = config.configId;
  /**
   * Sends a network request that is aware of payload interfaces,
   * lifecycle methods, configured edge domains, response structures, etc.
   */

  return function (_ref2) {
    var payload = _ref2.payload,
        action = _ref2.action;
    var endpointDomain = payload.getUseIdThirdPartyDomain() ? ID_THIRD_PARTY_DOMAIN : edgeDomain;
    var requestId = v4_1();
    var url = "https://" + endpointDomain + "/" + edgeBasePath + "/" + apiVersion + "/" + action + "?configId=" + configId + "&requestId=" + requestId;
    cookieTransfer.cookiesToPayload(payload, endpointDomain);
    return sendNetworkRequest({
      payload: payload,
      url: url,
      requestId: requestId
    }).catch(function (error) {
      // If we get to here, it's most likely that the network request
      // didn't actually get to the server (e.g., no internet connection).
      var throwError = function throwError() {
        throw error;
      };

      return lifecycle.onRequestFailure().then(throwError, throwError);
    }).then(function (result) {
      var response; // Whether a parsedBody exists is largely independent of success. For
      // example, a request can be successful without a body in the response.
      // On the other hand, a 500 status code could have been returned but
      // with a body in the response containing warnings and errors.

      if (result.parsedBody) {
        response = createResponse(result.parsedBody);
        cookieTransfer.responseToCookies(response);
      }

      var lifecyclePromise;

      if (result.success) {
        if (response) {
          lifecyclePromise = lifecycle.onResponse({
            response: response
          });
        }
      } else {
        lifecyclePromise = lifecycle.onRequestFailure();
      }

      lifecyclePromise = lifecyclePromise || Promise.resolve();
      return lifecyclePromise.then(function () {
        // We process warnings and errors after calling lifecycle
        // methods because warning and error processing can throw an
        // error that needs to get bubbled up to the promise returned to
        // the customer, but we want to make sure lifecycle methods are
        // still called in such a case and this is the easiest way to
        // make that happen.
        if (response) {
          processWarningsAndErrors(response, logger);
        }

        if (!result.success) {
          var messageSuffix = result.body ? "response body: " + result.body : "no response body.";
          throw new Error("Unexpected server response with status code " + result.statusCode + " and " + messageSuffix);
        }
      });
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

/**
 * Processes warnings and errors from a response object. If warnings are found,
 * they will be logged. If errors are found, an error will be thrown with information
 * about the errors received from the server.
 * @param {Object} response
 * @param {Object} logger
 */
var processWarningsAndErrors = (function (response, logger) {
  // Regardless of whether the response had a successful status code,
  // the response payload may have warnings and errors we still
  // want to process.
  var warnings = response.getWarnings();
  var errors = response.getErrors();
  warnings.forEach(function (warning) {
    logger.warn("Warning received from server: [Code " + warning.code + "] " + warning.message);
  });

  if (errors.length) {
    var errorMessage = errors.reduce(function (memo, error) {
      return memo + "\n\u2022 [Code " + error.code + "] " + error.message;
    }, "The server responded with the following errors:");
    throw new Error(errorMessage);
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

var instanceNamespaces = window.__alloyNS;
var createNamespacedStorage = storageFactory(window);
var _window = window,
    console = _window.console;
var coreConfigValidators = createCoreConfigs();
var apexDomain$1 = getApexDomain(window, cookie);

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
    var networkStrategy = networkStrategyFactory(window, logger);
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
        coreConfigValidators: coreConfigValidators,
        createConfig: createConfig,
        logger: logger,
        setDebugEnabled: setDebugEnabled,
        setErrorsEnabled: setErrorsEnabled
      });
      var cookieTransfer = createCookieTransfer({
        cookieJar: cookie,
        orgId: config.orgId,
        apexDomain: apexDomain$1
      });
      var sendNetworkRequest = sendNetworkRequestFactory({
        logger: logger,
        networkStrategy: networkStrategy
      });
      var sendEdgeNetworkRequest = sendEdgeNetworkRequestFactory({
        config: config,
        logger: logger,
        lifecycle: lifecycle,
        cookieTransfer: cookieTransfer,
        sendNetworkRequest: sendNetworkRequest,
        createResponse: createResponse,
        processWarningsAndErrors: processWarningsAndErrors
      });
      var consent = createConsent({
        config: config,
        logger: logger,
        lifecycle: lifecycle,
        createConsentRequestPayload: createConsentRequestPayload,
        sendEdgeNetworkRequest: sendEdgeNetworkRequest
      });
      var eventManager = createEventManager({
        config: config,
        logger: logger,
        lifecycle: lifecycle,
        consent: consent,
        createEvent: createEvent,
        createDataCollectionRequestPayload: createDataCollectionRequestPayload,
        sendEdgeNetworkRequest: sendEdgeNetworkRequest
      });
      return initializeComponents({
        componentCreators: componentCreators,
        lifecycle: lifecycle,
        componentRegistry: componentRegistry,
        getImmediatelyAvailableTools: function getImmediatelyAvailableTools(componentNamespace) {
          return {
            config: config,
            consent: consent,
            eventManager: eventManager,
            logger: logController.createComponentLogger(componentNamespace)
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

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

module.exports = () => {

	(function (factory) {
		typeof define === 'function' && define.amd ? define(factory) :
			factory();
	}(function () { 'use strict';

		if (document.documentMode && document.documentMode < 10) { console.warn('The Adobe Experience Cloud Web SDK does not support IE 9 and below.'); return; }

		/*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
		/* eslint-disable no-unused-vars */

		var getOwnPropertySymbols = Object.getOwnPropertySymbols;
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var propIsEnumerable = Object.prototype.propertyIsEnumerable;

		function toObject(val) {
			if (val === null || val === undefined) {
				throw new TypeError('Object.assign cannot be called with null or undefined');
			}

			return Object(val);
		}

		function shouldUseNative() {
			try {
				if (!Object.assign) {
					return false;
				} // Detect buggy property enumeration order in older V8 versions.
				// https://bugs.chromium.org/p/v8/issues/detail?id=4118


				var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

				test1[5] = 'de';

				if (Object.getOwnPropertyNames(test1)[0] === '5') {
					return false;
				} // https://bugs.chromium.org/p/v8/issues/detail?id=3056


				var test2 = {};

				for (var i = 0; i < 10; i++) {
					test2['_' + String.fromCharCode(i)] = i;
				}

				var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
					return test2[n];
				});

				if (order2.join('') !== '0123456789') {
					return false;
				} // https://bugs.chromium.org/p/v8/issues/detail?id=3056


				var test3 = {};
				'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
					test3[letter] = letter;
				});

				if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
					return false;
				}

				return true;
			} catch (err) {
				// We don't expect any of the above to throw, but better to be safe.
				return false;
			}
		}

		var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
			var from;
			var to = toObject(target);
			var symbols;

			for (var s = 1; s < arguments.length; s++) {
				from = Object(arguments[s]);

				for (var key in from) {
					if (hasOwnProperty.call(from, key)) {
						to[key] = from[key];
					}
				}

				if (getOwnPropertySymbols) {
					symbols = getOwnPropertySymbols(from);

					for (var i = 0; i < symbols.length; i++) {
						if (propIsEnumerable.call(from, symbols[i])) {
							to[symbols[i]] = from[symbols[i]];
						}
					}
				}
			}

			return to;
		};

		var reactorObjectAssign = objectAssign;

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */

		function createCommonjsModule(fn, module) {
			return module = { exports: {} }, fn(module, module.exports), module.exports;
		}

		var js_cookie = createCommonjsModule(function (module, exports) {

			(function (factory) {
				var registeredInModuleLoader = false;

				{
					module.exports = factory();
					registeredInModuleLoader = true;
				}

				if (!registeredInModuleLoader) {
					var OldCookies = window.Cookies;
					var api = window.Cookies = factory();

					api.noConflict = function () {
						window.Cookies = OldCookies;
						return api;
					};
				}
			})(function () {
				function extend() {
					var i = 0;
					var result = {};

					for (; i < arguments.length; i++) {
						var attributes = arguments[i];

						for (var key in attributes) {
							result[key] = attributes[key];
						}
					}

					return result;
				}

				function init(converter) {
					function api(key, value, attributes) {
						var result;

						if (typeof document === 'undefined') {
							return;
						} // Write


						if (arguments.length > 1) {
							attributes = extend({
								path: '/'
							}, api.defaults, attributes);

							if (typeof attributes.expires === 'number') {
								var expires = new Date();
								expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
								attributes.expires = expires;
							} // We're using "expires" because "max-age" is not supported by IE


							attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

							try {
								result = JSON.stringify(value);

								if (/^[\{\[]/.test(result)) {
									value = result;
								}
							} catch (e) {}

							if (!converter.write) {
								value = encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
							} else {
								value = converter.write(value, key);
							}

							key = encodeURIComponent(String(key));
							key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
							key = key.replace(/[\(\)]/g, escape);
							var stringifiedAttributes = '';

							for (var attributeName in attributes) {
								if (!attributes[attributeName]) {
									continue;
								}

								stringifiedAttributes += '; ' + attributeName;

								if (attributes[attributeName] === true) {
									continue;
								}

								stringifiedAttributes += '=' + attributes[attributeName];
							}

							return document.cookie = key + '=' + value + stringifiedAttributes;
						} // Read


						if (!key) {
							result = {};
						} // To prevent the for loop in the first place assign an empty array
						// in case there are no cookies at all. Also prevents odd result when
						// calling "get()"


						var cookies = document.cookie ? document.cookie.split('; ') : [];
						var rdecode = /(%[0-9A-Z]{2})+/g;
						var i = 0;

						for (; i < cookies.length; i++) {
							var parts = cookies[i].split('=');
							var cookie = parts.slice(1).join('=');

							if (cookie.charAt(0) === '"') {
								cookie = cookie.slice(1, -1);
							}

							try {
								var name = parts[0].replace(rdecode, decodeURIComponent);
								cookie = converter.read ? converter.read(cookie, name) : converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);

								if (this.json) {
									try {
										cookie = JSON.parse(cookie);
									} catch (e) {}
								}

								if (key === name) {
									result = cookie;
									break;
								}

								if (!key) {
									result[name] = cookie;
								}
							} catch (e) {}
						}

						return result;
					}

					api.set = api;

					api.get = function (key) {
						return api.call(api, key);
					};

					api.getJSON = function () {
						return api.apply({
							json: true
						}, [].slice.call(arguments));
					};

					api.defaults = {};

					api.remove = function (key, attributes) {
						api(key, '', extend(attributes, {
							expires: -1
						}));
					};

					api.withConverter = init;
					return api;
				}

				return init(function () {});
			});
		});

		// we have a little more flexibility to change the underlying implementation later. If clear
		// use cases come up for needing the other methods js-cookie exposes, we can re-evaluate whether
		// we want to expose them here.


		var reactorCookie = {
			get: js_cookie.get,
			set: js_cookie.set,
			remove: js_cookie.remove
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
		 * Returns the first item in the array that satisfies the provided testing funciton.
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

		/**
		 * Returns an array of matched DOM nodes.
		 * @param {String} selector
		 * @param {Node} doc, defaults to document
		 * @returns {Array} an array of DOM nodes
		 */
		function selectNodes(selector) {
			var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
			return [].slice.call(doc.querySelectorAll(selector));
		}

		/*
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

		function createError(selector) {
			return new Error("Could not find: ".concat(selector));
		}

		function createPromise(executor) {
			return new Promise(executor);
		}

		function canUseMutationObserver(win) {
			return isFunction(win[MUTATION_OBSERVER]);
		}
		function awaitUsingMutationObserver(win, doc, selector, timeout, selectFunc) {
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
		}
		function canUseRequestAnimationFrame(doc) {
			return doc[VISIBILITY_STATE] === VISIBLE;
		}
		function awaitUsingRequestAnimation(win, selector, timeout, selectFunc) {
			return createPromise(function (resolve, reject) {
				function execute() {
					var nodes = selectFunc(selector);

					if (isNonEmptyArray(nodes)) {
						resolve(nodes);
						return;
					}

					win[RAF](execute);
				}

				execute();
				setTimeout(function () {
					reject(createError(selector));
				}, timeout);
			});
		}
		function awaitUsingTimer(selector, timeout, selectFunc) {
			return createPromise(function (resolve, reject) {
				function execute() {
					var nodes = selectFunc(selector);

					if (isNonEmptyArray(nodes)) {
						resolve(nodes);
						return;
					}

					setTimeout(execute, DELAY);
				}

				execute();
				setTimeout(function () {
					reject(createError(selector));
				}, timeout);
			});
		}
		function awaitSelector(selector) {
			var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MAX_POLLING_TIMEOUT;
			var selectFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : selectNodes;
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
		}

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */
		function appendNode(parent, node) {
			return parent.appendChild(node);
		}

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */
		function createNode(tag) {
			var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
			var doc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document;
			var result = doc.createElement(tag);
			Object.keys(attrs).forEach(function (key) {
				result.setAttribute(key, attrs[key]);
			});
			children.forEach(function (child) {
				return appendNode(result, child);
			});
			return result;
		}

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */
		function removeNode(node) {
			var parent = node.parentNode;

			if (parent) {
				return parent.removeChild(node);
			}

			return null;
		}

		/*
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
		var IMAGE_TAG = "img";
		/**
		 * Fires an image pixel from the current document's window.
		 * @param {string} url
		 * @returns {undefined}
		 */

		var fireImage = (function (_ref) {
			var url = _ref.url,
				currentDocument = _ref.currentDocument;
			var doc = currentDocument || document;

			if (isNonEmptyString(url)) {
				createNode(IMAGE_TAG, {
					src: url
				}, [], doc);
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

		/*
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

		var getNestedObject = (function (obj, location, defaultObj) {
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

		/*
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

		function _slicedToArray(arr, i) {
			return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
		}

		function _arrayWithHoles(arr) {
			if (Array.isArray(arr)) return arr;
		}

		function _iterableToArrayLimit(arr, i) {
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

		function _nonIterableRest() {
			throw new TypeError("Invalid attempt to destructure non-iterable instance");
		}

		/*
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

		/*
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

		var setNestedObject = (function (obj, location, nestedObj) {
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
			stackedError.message = "".concat(message, "\nCaused by: ").concat(stackedError.message);
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

		function getStorageByType(context, storageType, namespace$$1) {
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
						console.log(e);
						return false;
					}
				}
			};
		}

		var storageFactory = (function (context) {
			return function (additionalNamespace) {
				var finalNamespace = namespace + (additionalNamespace || "");
				return {
					session: getStorageByType(context, "sessionStorage", finalNamespace),
					persistent: getStorageByType(context, "localStorage", finalNamespace)
				};
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

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */

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
					reactorObjectAssign(cfg, cfgAdd);
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
					cfg.forbiddenKeys.forEach(function (key) {
						keys.splice(keys.indexOf(key), 1);
					});
					return keys;
				},

				/**
				 * Adds schema information to the existing configuration schema.
				 */
				extendSchema: function extendSchema(schemaAddition) {
					reactorObjectAssign(cfg.schema, schemaAddition);
					return cfg.schema;
				},

				/**
				 * Validates the configuration against the defined schema.
				 */
				validate: function validate() {
					// TODO: Validate existing configuration against defined schema.
					return true;
				},
				toJSON: function toJSON() {
					var cfgCopy = {};
					reactorObjectAssign(cfgCopy, cfg);
					cfg.forbiddenKeys.forEach(function (key) {
						delete cfgCopy[key];
					});
					return cfgCopy;
				},
				schema: {},
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
		var createInstance = (function (namespace, initializeComponents, debugController) {
			var componentRegistry;

			var debugCommand = function debugCommand(_ref) {
				var enabled = _ref.enabled;
				// eslint-disable-next-line no-param-reassign
				debugController.debugEnabled = enabled;
			};

			var configureCommand = function configureCommand(options) {
				if (options.debug !== undefined) {
					debugCommand({
						enabled: options.debug
					});
				}

				var config = createConfig(options);
				componentRegistry = initializeComponents(config);
			};

			function executeCommand(commandName, options) {
				var command;

				if (commandName === "configure") {
					if (componentRegistry) {
						throw new Error("The library has already been configured and may only be configured once.");
					}

					command = configureCommand;
				} else if (commandName === "debug") {
					command = debugCommand;
				} else {
					if (!componentRegistry) {
						throw new Error("The library must be configured first. Please do so by calling ".concat(namespace, "(\"configure\", {...})."));
					}

					command = componentRegistry.getCommand(commandName);

					if (!isFunction(command)) {
						throw new Error("The ".concat(commandName, " command does not exist."));
					}
				}

				return command(options);
			}

			return function (args) {
				// Would use destructuring, but destructuring doesn't work on IE
				// without polyfilling Symbol.
				// https://github.com/babel/babel/issues/7597
				var resolve = args[0];
				var reject = args[1];
				var userProvidedArgs = args[2];
				var commandName = userProvidedArgs[0];
				var options = userProvidedArgs[1]; // We have to wrap the function call in "new Promise()" instead of just
				// doing "Promise.resolve(executeCommand(commandName, options))" so that
				// the promise can capture any errors that occur synchronously during the
				// underlying function call.
				// Also note that executeCommand may or may not return a promise.

				new Promise(function (_resolve) {
					_resolve(executeCommand(commandName, options));
				}).then(resolve).catch(function (error) {
					var err = toError(error); // eslint-disable-next-line no-param-reassign

					err.message = "[".concat(namespace, "] ").concat(err.message);
					reject(err);
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
		// - It implements all lifecycle hooks.
		// Let's start the first version with an explicit Hook interface,
		// and not a random pub/sub model. Meaning each Component will have
		// to implement the hook it's interested in as a method on its prototype.
		// We will have a Plop helper that generates Components and populate all the
		// hooks as Template methods.
		// TODO: Finalize the first set of Lifecycle hooks. (DONE)
		// TODO: Support Async hooks. (Or maybe default them as Async)
		// TODO: Hooks might have to publish events so the outside world can hooks in as well.
		// MAYBE: If a Component has a hard dependency, maybe throw an error somewhere:
		// if (componentRegistry.hasComponent('Personalization')) {
		//  new Error() or core.missingRequirement('I require Personalization');
		// }
		function invokeHook(componentRegistry, hookName) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				args[_key - 2] = arguments[_key];
			}

			return Promise.all(componentRegistry.getLifecycleCallbacks(hookName).map(function (callback) {
				return new Promise(function (resolve) {
					resolve(callback.apply(void 0, args));
				});
			}));
		}
		/**
		 * This ensures that if a component's lifecycle method X
		 * attempts to execute lifecycle method Y, that all X methods on all components
		 * will have been called before any of their Y methods are called. It does
		 * this by kicking the call to the Y method to the next JavaScript tick.
		 * @returns {function}
		 */


		var guardLifecycleMethod = function guardLifecycleMethod(fn) {
			return function () {
				for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				return Promise.resolve().then(function () {
					return fn.apply(void 0, args);
				});
			};
		}; // TO-DOCUMENT: Lifecycle hooks and their params.


		var createLifecycle = (function (componentRegistry) {
			return {
				// We intentionally don't guard onComponentsRegistered. When the user
				// configures the SDK, we need onComponentsRegistered on each component
				// to be executed synchronously (they would be run asynchronously if
				// this method were guarded due to how the guard works) so that if the
				// user immediately executes a command right after configuration,
				// all the components will have already had their onComponentsRegistered
				// called and be ready to handle the command. At the moment, commands
				// are always executed synchronously.
				onComponentsRegistered: function onComponentsRegistered(tools) {
					return invokeHook(componentRegistry, "onComponentsRegistered", tools);
				},
				onBeforeEvent: guardLifecycleMethod(function (event, isViewStart) {
					return invokeHook(componentRegistry, "onBeforeEvent", event, isViewStart);
				}),
				onBeforeRequest: guardLifecycleMethod(function (payload) {
					return invokeHook(componentRegistry, "onBeforeRequest", payload);
				}),
				onResponse: guardLifecycleMethod(function (response) {
					return invokeHook(componentRegistry, "onResponse", response);
				}),
				onBeforeUnload: guardLifecycleMethod(function () {
					return invokeHook(componentRegistry, "onBeforeUnload");
				}),
				onOptInChanged: guardLifecycleMethod(function (permissions) {
					return invokeHook(componentRegistry, "onOptInChanged", permissions);
				}) // TODO: We might need an `onError(error)` hook.

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
			var componentsByNamespace = {};
			var commandsByName = {};
			var lifecycleCallbacksByName = {};

			var registerComponentCommands = function registerComponentCommands(namespace) {
				var componentCommandsByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				var conflictingCommandNames = intersection(Object.keys(commandsByName), Object.keys(componentCommandsByName));

				if (conflictingCommandNames.length) {
					throw new Error("[ComponentRegistry] Could not register ".concat(namespace, " ") + "because it has existing command(s): ".concat(conflictingCommandNames.join(",")));
				}

				Object.keys(componentCommandsByName).forEach(function (commandName) {
					var command = componentCommandsByName[commandName];
					commandsByName[commandName] = wrapForErrorHandling(command, "[".concat(namespace, "] An error occurred while executing the ").concat(commandName, " command."));
				});
			};

			var registerLifecycleCallbacks = function registerLifecycleCallbacks(namespace) {
				var componentLifecycleCallbacksByName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
				Object.keys(componentLifecycleCallbacksByName).forEach(function (hookName) {
					lifecycleCallbacksByName[hookName] = lifecycleCallbacksByName[hookName] || [];
					lifecycleCallbacksByName[hookName].push(wrapForErrorHandling(componentLifecycleCallbacksByName[hookName], "[".concat(namespace, "] An error occurred while executing the ").concat(hookName, " lifecycle hook.")));
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
					return find(Object.keys(componentsByNamespace), function (namespace) {
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
		var initializeComponentsFactory = (function (componentCreators, logger, getNamespacedStorage) {
			return function (config) {
				var componentRegistry = createComponentRegistry();
				componentCreators.forEach(function (createComponent) {
					var namespace = createComponent.namespace; // TODO: Get the default config from the component
					// const { componentConfigSchema } = createComponent;
					// TODO: Extend the config with the component config schema

					var storage = getNamespacedStorage("orgID." // TODO: Make orgID mandatory and add it here
					); // TO-DOCUMENT: Helpers that we inject into factories.

					var component;

					try {
						component = createComponent({
							logger: logger.spawn("[".concat(namespace, "]")),
							config: config,
							storage: storage
						});
					} catch (error) {
						throw stackError("[".concat(namespace, "] An error occurred during component creation."), error);
					}

					componentRegistry.register(namespace, component);
				}); // TODO: Output the finalized config schema (if debug is turned on)

				var lifecycle = createLifecycle(componentRegistry);
				lifecycle.onComponentsRegistered({
					componentRegistry: componentRegistry,
					lifecycle: lifecycle
				});
				return componentRegistry;
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
		// TO-DOCUMENT: How to enable debugging and logging.
		var createLogger = function createLogger(window, debugController, prefix) {
			var process = function process(level) {
				if (debugController.debugEnabled) {
					var _window$console;

					for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						rest[_key - 1] = arguments[_key];
					}

					(_window$console = window.console)[level].apply(_window$console, [prefix].concat(rest));
				}
			};

			return {
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
					return createLogger(window, debugController, "".concat(prefix, " ").concat(additionalPrefix));
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
		var createDebugController = (function (instanceNamespace, getNamespacedStorage) {
			// Segregate whether debugging is enabled by the SDK instance name.
			// This way consumers can debug one instance at a time.
			// TODO: Figure out how this plays out with segregating Web Storage
			// in the rest of the SDK. Is it segregated by Org ID or Property ID
			// in the rest of the SDK?
			var storage = getNamespacedStorage("instance.".concat(instanceNamespace, "."));
			var debugEnabled = storage.persistent.getItem("debug") === "true";
			return {
				get debugEnabled() {
					return debugEnabled;
				},

				set debugEnabled(value) {
					storage.persistent.setItem("debug", value);
					debugEnabled = value;
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
		 * Creates a function that, when passed an object of updates, will merge
		 * the updates onto the current value of a payload property.
		 * @param content
		 * @param key
		 * @returns {Function}
		 */

		var createPayloadItemMerger = (function (content, key) {
			return function (updates) {
				// eslint-disable-next-line no-param-reassign
				content[key] = content[key] || {};
				reactorObjectAssign(content[key], updates);
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
			return {
				setPropertyID: function setPropertyID(propertyID) {
					content.propertyID = propertyID;
				},
				addIdentity: function addIdentity(namespaceCode, identity) {
					content.identityMap = content.identityMap || {};
					content.identityMap[namespaceCode] = content.identityMap[namespaceCode] || [];
					content.identityMap[namespaceCode].push(identity);
				},
				addEvent: function addEvent(event) {
					content.events = content.events || [];
					content.events.push(event);
				},
				mergeMeta: createPayloadItemMerger(content, "meta"),
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
		 *  - All the properties of the raw response, frozen
		 *  - `getPayloadByType`: returns a fragment of the response by type
		 *      - @param {String} type: A string with the current format: <namespace:action>
		 *          example: "identity:persist"
		 */

		var createResponse = (function () {
			var respDto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
				handle: []
			};
			var response = reactorObjectAssign(Object.create(null), respDto); // TODO: Should we freeze the response to prevent change by Components?
			// Object.freeze(response.handle.map(h => Object.freeze(h)));

			response.getPayloadByType = function (type) {
				var fragment = find(respDto.handle, function (content) {
					return content.type === type;
				});
				return fragment ? fragment.payload : null;
			}; // TODO: Maybe consider the following API as well?
			// - getPayloadsByAction


			return response;
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

		function setMeta(payload, config) {
			// Append meta to the payload.
			payload.mergeMeta({
				enableStore: config.shouldStoreCollectedData,
				device: config.device || "UNKNOWN-DEVICE"
			});
		}

		var initalizePayload = function initalizePayload(config, events, beforeHook) {
			// Populate the request's body with payload, data and meta.
			var payload = createPayload();
			events.forEach(function (event) {
				payload.addEvent(event);
			});
			return beforeHook(payload).then(function () {
				setMeta(payload, config);
				return payload;
			});
		}; // TODO: Extract this stuff into a core helper.


		var callServer = function callServer(config, endpoint) {
			return function (payload) {
				return fetch("".concat(config.collectionUrl, "/").concat(endpoint, "?propertyID=").concat(config.propertyID), {
					method: "POST",
					cache: "no-cache",
					headers: {
						"Content-Type": "application/json"
					},
					referrer: "client",
					body: JSON.stringify(payload)
				});
			};
		};

		var createRequest = (function (config) {
			return {
				send: function send(events, endpoint, beforeHook, afterHook) {
					return initalizePayload(config, events, beforeHook).then(callServer(config, endpoint)).then(function (response) {
						return response.json();
					}).then(createResponse).then(afterHook).then(function () {}); // Makes sure the promise is resolved with no value.
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
			return {
				setCorrelationId: function setCorrelationId(correlationId) {
					content.correlationID = correlationId;
				},
				setTimestamp: function setTimestamp(timestamp) {
					content.timestamp = timestamp;
				},
				mergeData: createPayloadItemMerger(content, "data"),
				mergeQuery: createPayloadItemMerger(content, "query"),
				mergeWeb: createPayloadItemMerger(content, "web"),
				mergeDevice: createPayloadItemMerger(content, "device"),
				mergeEnvironment: createPayloadItemMerger(content, "environment"),
				mergePlaceContext: createPayloadItemMerger(content, "placeContext"),
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

		var createDataCollector = function createDataCollector(_ref) {
			var config = _ref.config;
			var lifecycle;

			var makeServerCall = function makeServerCall(events) {
				var request = createRequest(config);
				return request.send(events, "interact", lifecycle.onBeforeRequest, lifecycle.onResponse);
			};

			var createEventHandler = function createEventHandler(isViewStart) {
				return function (options) {
					var event = createEvent();
					event.mergeData(options.data);
					lifecycle.onBeforeEvent(event, isViewStart).then(function () {
						makeServerCall([event]);
					});
				};
			};

			return {
				lifecycle: {
					onComponentsRegistered: function onComponentsRegistered(tools) {
						lifecycle = tools.lifecycle;
					}
				},
				commands: {
					viewStart: createEventHandler(true),
					event: createEventHandler(false)
				}
			};
		};

		createDataCollector.namespace = "DataCollector";

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */
		var ECID_NAMESPACE = "ECID";

		var addIdsContext = function addIdsContext(payload, ecid) {
			// TODO: Add customer ids.
			payload.addIdentity(ECID_NAMESPACE, {
				id: ecid
			});
		}; // TODO: Namespace the cookie to be specific to the org.


		var getEcid = function getEcid() {
			return reactorCookie.get("ecid");
		};

		var createIdentity = function createIdentity() {
			var ecid = getEcid();
			var deferredForEcid; // TO-DOCUMENT: We wait for ECID before trigger any events.

			var onBeforeRequest = function onBeforeRequest(payload) {
				payload.mergeMeta({
					identity: {
						lastSyncTS: 1222,
						containerId: 1
					}
				});
				var promise;

				if (ecid) {
					addIdsContext(payload, ecid);
				} else if (deferredForEcid) {
					// We don't have an ECID, but the first request has gone out to
					// fetch it. We must wait for the response to come back with the
					// ECID before we can apply it to this payload.
					promise = deferredForEcid.promise.then(function () {
						addIdsContext(payload, ecid);
					});
				} else {
					// We don't have an ECID and no request has gone out to fetch it.
					// We won't apply the ECID to this request, but we'll set up a
					// promise so that future requests can know when the ECID has returned.
					deferredForEcid = defer();
				}

				return promise;
			};

			var onResponse = function onResponse(response) {
				var ecidPayload = response.getPayloadByType("identity:persist");

				if (ecidPayload) {
					ecid = ecidPayload.id;
					reactorCookie.set("ecid", ecid, {
						expires: 7
					});

					if (deferredForEcid) {
						deferredForEcid.resolve();
					}
				}
			};

			return {
				lifecycle: {
					onBeforeRequest: onBeforeRequest,
					onResponse: onResponse
				},
				commands: {
					getEcid: getEcid
				}
			};
		};

		createIdentity.namespace = "Identity";

		var fireOnPage = fireImage;
		var fireDestinationsFactory = (function (_ref) {
			var iframe = _ref.iframe,
				logger = _ref.logger;

			var fireInIframe = function fireInIframe(_ref2) {
				var url = _ref2.url;

				if (iframe) {
					var currentDocument = iframe.contentWindow.document;
					fireImage({
						url: url,
						currentDocument: currentDocument
					});
				}
			};

			return function () {
				var destinations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
				destinations.forEach(function (dest) {
					if (isObject(dest)) {
						if (isNonEmptyString(dest.url)) {
							var url = new RegExp("^//:", "i").test(dest.url) ? dest.url : "//".concat(dest.url);

							if (!isNil(dest.hideReferrer)) {
								if (dest.hideReferrer) {
									fireInIframe({
										url: url
									});
								} else {
									fireOnPage({
										url: url
									});
								}
							} else {
								logger.error("Destination hideReferrer property is not defined for url ".concat(dest.url, " ."));
							}
						} else {
							logger.error("Destination url is not a populated string.");
						}
					} else {
						logger.error("Destination is not an object.");
					}
				});
			};
		});

		var BODY_TAG = "BODY";
		var IFRAME_TAG = "IFRAME";
		var IFRAME_ATTRS = {
			name: "Adobe Destinationing iFrame",
			class: "adobe-iframe",
			style: "display: none; width: 0; height: 0;"
		};

		function createIframe(_ref) {
			var _ref2 = _slicedToArray(_ref, 1),
				body = _ref2[0];

			var iframe = createNode(IFRAME_TAG, IFRAME_ATTRS);
			return appendNode(body, iframe);
		}

		var createDestinations = (function (_ref3) {
			var logger = _ref3.logger;
			var iframePromise = awaitSelector(BODY_TAG).then(createIframe);
			var fireDestinationsPromise = iframePromise.then(function (iframe) {
				return fireDestinationsFactory({
					iframe: iframe,
					logger: logger
				});
			});
			var ended = false;

			var end = function end() {
				ended = true;
				iframePromise.then(removeNode);
			};

			var fire = function fire(destinations) {
				fireDestinationsPromise.then(function (fireDests) {
					if (!ended) {
						fireDests(destinations);
					}
				});
			};

			return {
				fire: fire,
				end: end
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
		var processDestinations = (function (_ref) {
			var destinations = _ref.destinations,
				config = _ref.config,
				logger = _ref.logger;
			var urlDestinations = destinations.filter(function (dest) {
				return dest.type === "url";
			}).map(function (dest) {
				return dest.spec;
			});

			if (urlDestinations.length && (config.destinationsEnabled === undefined || config.destinationsEnabled)) {
				var destsUtil = createDestinations({
					logger: logger
				});
				destsUtil.fire(urlDestinations); // TODO: Figure out if this can be used correctly
				// destsUtil.end();
			}

			var cookieDestinations = destinations.filter(function (dest) {
				return dest.type === "cookie";
			}).map(function (dest) {
				return dest.spec;
			});
			cookieDestinations.forEach(function (dest) {
				if (isNonEmptyString(dest.name)) {
					reactorCookie.set(dest.name, dest.value || "", {
						domain: dest.domain || "",
						expires: dest.ttl ? dest.ttl : 13 * 30
					});
				} else {
					logger.error("Cookie destination had an invalid or no name.");
				}
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

		var createAudiences = function createAudiences(_ref) {
			var config = _ref.config,
				logger = _ref.logger;
			return {
				lifecycle: {
					onBeforeEvent: function onBeforeEvent(event, isViewStart) {
						if (!isViewStart) {
							return;
						}

						logger.log("Audiences:::onBeforeEvent"); // TODO: Remove; We won't need to request destinations explicitely.
						// This is just for demo currently.

						event.mergeQuery({
							urlDestinations: true
						});
					},
					onResponse: function onResponse(response) {
						logger.log("Audiences:::onResponse");
						var destinations = response.getPayloadByType("activation:push") || [];
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

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */
		// TODO: Can/Should we use the value exported from src/constants/namespace.js
		// for our key prefix?
		var KEY_PREFIX = "___alloy";
		var KEY_DETECT_PREFIX = "".concat(KEY_PREFIX, "-detect");

		function hash(string) {
			var result = 0;
			var length = string.length;

			for (var i = 0; i < length; i += 1) {
				/* eslint-disable */
				result = (result << 5) - result + string.charCodeAt(i) & 0xffffffff;
				/* eslint-enable */
			}

			return result;
		}

		function buildKey(prefix, selector) {
			return "".concat(prefix, "-").concat(hash(selector));
		}

		function createStyleTag(className, content) {
			var style = document.createElement("style");
			style.className = className;
			style.innerHTML = content;
			return style;
		}

		function appendTo(parent, element) {
			parent.appendChild(element);
		}

		function removeFrom(parent, element) {
			parent.removeChild(element);
		}

		function setupElementDetection(key, selector, callback) {
			var content = "\n    @keyframes ".concat(key, " {  \n      from { opacity: 0.99; }\n      to { opacity: 1; }  \n    }\n\n    ").concat(selector, " {\n      animation-duration: 0.001s;\n      animation-name: ").concat(key, ";\n    }\n    ");
			document.addEventListener("animationstart", callback, false);
			appendTo(document.head, createStyleTag(key, content));
		}

		function hideElement(selector) {
			var key = buildKey(KEY_PREFIX, selector);
			var content = "".concat(selector, " { visibility: hidden }");
			appendTo(document.head, createStyleTag(key, content));
		}

		function showElement(selector) {
			var key = buildKey(KEY_PREFIX, selector);
			var elements = document.querySelectorAll(".".concat(key));
			elements.forEach(function (e) {
				return removeFrom(document.head, e);
			});
		}

		function render(cache, event, logger) {
			var animationName = event.animationName;

			if (animationName.indexOf(KEY_DETECT_PREFIX) === -1) {
				return;
			}

			var option = cache[animationName];

			if (!option) {
				logger.log("Element with key:", animationName, "not in cache");
				return;
			}

			var type = option.type,
				selector = option.selector,
				content = option.content;

			switch (type) {
				case "setHtml":
					/* eslint-disable */
					event.target.innerHTML = content;
					/* eslint-enable */

					showElement(selector);
					break;

				default:
					logger.log(type, "rendering is not supported");
					break;
			}
		}

		var createPersonalization = function createPersonalization(_ref) {
			var logger = _ref.logger;
			var storage = {};
			var componentRegistry;

			var collect = function collect(offerInfo) {
				componentRegistry.getCommand("event")(offerInfo);
			};

			return {
				lifecycle: {
					onComponentsRegistered: function onComponentsRegistered(tools) {
						componentRegistry = tools.componentRegistry;
					},
					onBeforeEvent: function onBeforeEvent(event, isViewStart) {
						if (isViewStart) {
							console.log("Personalization:::onBeforeEvent");
							event.mergeQuery({
								personalization: {
									prefetch: {
										views: true
									},
									execute: {
										pageLoad: true
									}
								}
							});
						}
					},
					onBeforeRequest: function onBeforeRequest(payload) {
						payload.mergeMeta({
							personalization: {
								client: "demo12",
								sessionID: "12344566"
							}
						});
					},
					// TODO: pull personalization data from response fragments, which requires
					//  Jon's network gateway work
					onResponse: function onResponse(response) {
						// eslint-disable-next-line no-unreachable
						console.log("Personalization:::onResponse");
						var personalization = response.getPayloadByType("personalization:run") || []; // Caution!!! Here comes Target black magic

						personalization.forEach(function (option) {
							var selector = option.selector,
								eventToken = option.eventToken;
							var key = buildKey(KEY_DETECT_PREFIX, selector);
							storage[key] = option;
							hideElement(selector);
							setupElementDetection(key, selector, function (event) {
								render(storage, event, logger);
								collect({
									data: {
										offerInfo: eventToken
									}
								});
							});
						});
					}
				}
			};
		};

		createPersonalization.namespace = "Personalization";

		/*
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
			return function (event) {
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
			return function (event) {
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

				return event.mergeDevice(device);
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
			return function (event) {
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

				if (navigator && navigator.connection && navigator.connection.effectiveType) {
					environment.connectionType = navigator.connection.effectiveType;
				}

				event.mergeEnvironment(environment);
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
		var placeContextFactory = (function (window, dateProvider) {
			return function (event) {
				var date = dateProvider();
				var placeContext = {
					localTime: date.toISOString(),
					localTimezoneOffset: date.getTimezoneOffset()
				};
				event.mergePlaceContext(placeContext);
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
		var createComponent = (function (config, logger, availableContexts, defaultContextNames) {
			var configuredContexts;
			return {
				namespace: "Context",
				lifecycle: {
					onComponentsRegistered: function onComponentsRegistered() {
						var configuredContextNames;

						if (config.context) {
							if (Array.isArray(config.context)) {
								configuredContextNames = config.context;
							} else {
								logger.warn("Invalid configured context. Please specify an array of strings.");
								configuredContextNames = [];
							}
						} else {
							logger.log("No configured context. Using default context.");
							configuredContextNames = defaultContextNames;
						}

						configuredContexts = configuredContextNames.filter(function (configuredContextName) {
							if (!availableContexts[configuredContextName]) {
								logger.warn("Configured context ".concat(configuredContextName, " is not available."));
								return false;
							}

							return true;
						}).map(function (configuredContextName) {
							return availableContexts[configuredContextName];
						});
					},
					onBeforeEvent: function onBeforeEvent(event) {
						configuredContexts.forEach(function (context) {
							return context(event);
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
		var topFrameSetProvider = topFrameSetFactory(window);
		var web = webFactory(window, topFrameSetProvider);
		var device = deviceFactory(window);
		var environment = environmentFactory(window);
		var placeContext = placeContextFactory(window, function () {
			return new Date();
		});

		var createContext = function createContext(_ref) {
			var config = _ref.config,
				logger = _ref.logger;
			return createComponent(config, logger, {
				web: web,
				device: device,
				environment: environment,
				placeContext: placeContext
			}, ["web", "device", "environment", "placeContext"]);
		};

		createContext.namespace = "Context";

		/*
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

		var componentCreators = [createDataCollector, createIdentity, createAudiences, createPersonalization, createContext]; // eslint-disable-next-line no-underscore-dangle

		var namespaces = window.__alloyNS;
		var storage = storageFactory(window);

		if (namespaces) {
			namespaces.forEach(function (namespace) {
				var debugController = createDebugController(namespace, storage);
				var logger = createLogger(window, debugController, "[".concat(namespace, "]"));
				var initializeComponents = initializeComponentsFactory(componentCreators, logger, storage);
				var instance = createInstance(namespace, initializeComponents, debugController);
				var queue = window[namespace].q;
				queue.push = instance;
				queue.forEach(instance);
			});
		}

	}));

};


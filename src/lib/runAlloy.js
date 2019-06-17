/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

module.exports = (instanceNames) => {
	/////////////////////////////
	// BASE CODE
	/////////////////////////////
	!function(n,o){o.forEach(function(o){n[o]||((n.__alloyNS=n.__alloyNS||
		[]).push(o),n[o]=function(){var u=arguments;return new Promise(
		function(i,l){n[o].q.push([i,l,u])})},n[o].q=[])})}
	(window,instanceNames);

	/////////////////////////////
	// LIBRARY CODE
	/////////////////////////////
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

		/*
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

				if (typeof Object.getOwnPropertySymbols === 'function') {
					ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
						return Object.getOwnPropertyDescriptor(source, sym).enumerable;
					}));
				}

				ownKeys.forEach(function (key) {
					_defineProperty(target, key, source[key]);
				});
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

		/*
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
				var value = attrs[key];

				if (typeof value === "function") {
					result[key] = value;
				} else {
					// This sets value to a string
					result.setAttribute(key, value);
				}
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
		 * @param {object} currentDocument
		 * @param {string} src
		 * @returns {Promise}
		 */

		var fireImage = (function (_ref) {
			var _ref$currentDocument = _ref.currentDocument,
				currentDocument = _ref$currentDocument === void 0 ? document : _ref$currentDocument,
				src = _ref.src;
			return new Promise(function (resolve, reject) {
				var attributes = {
					onload: resolve,
					onerror: reject,
					onabort: reject,
					src: src
				};
				createNode(IMAGE_TAG, attributes, [], currentDocument);
			});
		});

		var fireOnPage = fireImage;
		var BODY_TAG = "BODY";
		var IFRAME_TAG = "IFRAME";
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
					iframePromise = awaitSelector(BODY_TAG).then(function (_ref2) {
						var _ref3 = _slicedToArray(_ref2, 1),
							body = _ref3[0];

						var iframe = createNode(IFRAME_TAG, IFRAME_ATTRS);
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

		/*
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
		var cookieName = namespace + "getTld";
		var topLevelCookieDomain = "";
		/**
		 * Retrieves the top-most domain that is able to accept cookies. This will
		 * be the top-most domain that is not a "public suffix" as outlined
		 * in https://publicsuffix.org/
		 * @param {Object} window
		 * @param {Object} cookie
		 * @returns {string}
		 */

		function getTopLevelCookieDomain(window, cookie) {
			if (topLevelCookieDomain) {
				return topLevelCookieDomain;
			} // If hostParts.length === 1, we may be on localhost.


			var hostParts = window.location.hostname.toLowerCase().split(".");
			var i = 1;

			while (i < hostParts.length - 1 && !cookie.get(cookieName)) {
				i += 1;
				topLevelCookieDomain = getLastArrayItems(hostParts, i).join(".");
				cookie.set(cookieName, cookieName, {
					domain: topLevelCookieDomain
				});
			}

			cookie.remove(cookieName, {
				domain: topLevelCookieDomain
			});
			return topLevelCookieDomain;
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

		/*
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

		// Copyright Joyent, Inc. and other Node contributors.
		// obj.hasOwnProperty(prop) will break.
		// See: https://github.com/joyent/node/issues/1707

		function hasOwnProperty$1(obj, prop) {
			return Object.prototype.hasOwnProperty.call(obj, prop);
		}

		var decode = function (qs, sep, eq, options) {
			sep = sep || '&';
			eq = eq || '=';
			var obj = {};

			if (typeof qs !== 'string' || qs.length === 0) {
				return obj;
			}

			var regexp = /\+/g;
			qs = qs.split(sep);
			var maxKeys = 1000;

			if (options && typeof options.maxKeys === 'number') {
				maxKeys = options.maxKeys;
			}

			var len = qs.length; // maxKeys <= 0 means that we should not limit keys count

			if (maxKeys > 0 && len > maxKeys) {
				len = maxKeys;
			}

			for (var i = 0; i < len; ++i) {
				var x = qs[i].replace(regexp, '%20'),
					idx = x.indexOf(eq),
					kstr,
					vstr,
					k,
					v;

				if (idx >= 0) {
					kstr = x.substr(0, idx);
					vstr = x.substr(idx + 1);
				} else {
					kstr = x;
					vstr = '';
				}

				k = decodeURIComponent(kstr);
				v = decodeURIComponent(vstr);

				if (!hasOwnProperty$1(obj, k)) {
					obj[k] = v;
				} else if (Array.isArray(obj[k])) {
					obj[k].push(v);
				} else {
					obj[k] = [obj[k], v];
				}
			}

			return obj;
		};

		// Copyright Joyent, Inc. and other Node contributors.

		var stringifyPrimitive = function (v) {
			switch (typeof v) {
				case 'string':
					return v;

				case 'boolean':
					return v ? 'true' : 'false';

				case 'number':
					return isFinite(v) ? v : '';

				default:
					return '';
			}
		};

		var encode = function (obj, sep, eq, name) {
			sep = sep || '&';
			eq = eq || '=';

			if (obj === null) {
				obj = undefined;
			}

			if (typeof obj === 'object') {
				return Object.keys(obj).map(function (k) {
					var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;

					if (Array.isArray(obj[k])) {
						return obj[k].map(function (v) {
							return ks + encodeURIComponent(stringifyPrimitive(v));
						}).join(sep);
					} else {
						return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
					}
				}).join(sep);
			}

			if (!name) return '';
			return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
		};

		var querystring = createCommonjsModule(function (module, exports) {

			exports.decode = exports.parse = decode;
			exports.encode = exports.stringify = encode;
		});
		var querystring_1 = querystring.decode;
		var querystring_2 = querystring.parse;
		var querystring_3 = querystring.encode;
		var querystring_4 = querystring.stringify;

		// This allows us to more easily make changes to the underlying implementation later without
		// having to worry about breaking extensions. If extensions demand additional functionality, we
		// can make adjustments as needed.


		var reactorQueryString = {
			parse: function (string) {
				//
				if (typeof string === 'string') {
					// Remove leading ?, #, & for some leniency so you can pass in location.search or
					// location.hash directly.
					string = string.trim().replace(/^[?#&]/, '');
				}

				return querystring.parse(string);
			},
			stringify: function (object) {
				return querystring.stringify(object);
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

		/*
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

		var getStorageByType = function getStorageByType(context, storageType, namespace$$1) {
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

		var storageFactory = (function (context) {
			return function (additionalNamespace) {
				var finalNamespace = namespace + (additionalNamespace || "");
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

		/*
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
		var CONFIG_DOC_URI = "https://launch.gitbook.io/adobe-experience-platform-web-sdk/get-started/getting-started#configuration";

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
				 * Adds more validators to any existing validators.
				 */
				addValidators: function addValidators(validators) {
					reactorObjectAssign(cfg.validators, validators);
					return cfg.validators;
				},

				/**
				 * Validates the configuration against the defined validators.
				 */
				validate: function validate() {
					var keys = Object.keys(cfg.validators);
					var errors = keys.reduce(function (ac, key) {
						var currentValue = cfg.get(key);
						var validator = cfg.validators[key];

						if (currentValue == null && Object.prototype.hasOwnProperty.call(validator, "defaultValue")) {
							cfg.set(key, validator.defaultValue);
						} else if (validator.validate) {
							var errorMessage = validator.validate(cfg, key, currentValue, validator.defaultValue);

							if (errorMessage) {
								ac.push(errorMessage);
							}
						}

						return ac;
					}, []);

					if (errors.length) {
						throw new Error("Resolve these configuration problems:\n\t - " + errors.join("\n\t - ") + "\nFor configuration documentation see: " + CONFIG_DOC_URI);
					}
				},
				toJSON: function toJSON() {
					var cfgCopy = {};
					reactorObjectAssign(cfgCopy, cfg);
					cfg.forbiddenKeys.forEach(function (key) {
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
		var required = (function (config, key, currentValue) {
			var err = "";

			if (currentValue == null) {
				err = key + " is a required configuration parameter";
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
		var validDomain = (function (config, key, currentValue) {
			var validUrl = /^[a-z0-9-.]{1,}$/gi.test(currentValue);
			var err = "";

			if (!validUrl) {
				err = "Invalid domain for " + key + ": " + currentValue + "\"";
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

		var configValidators = {
			propertyID: {
				validate: required
			},
			edgeDomain: {
				validate: validDomain,
				defaultValue: "edgegateway.azurewebsites.net"
			},
			// TODO: For debugging purposes only. Remove eventually.
			shouldStoreCollectedData: {
				defaultValue: 1
			},
			device: {
				defaultValue: "Chrome-Mac"
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
		var createInstance = (function (namespace, initializeComponents, logController, logger, window) {
			var componentRegistry;
			var configurationFailed = false;

			var logCommand = function logCommand(_ref) {
				var enabled = _ref.enabled;
				// eslint-disable-next-line no-param-reassign
				logController.logEnabled = enabled;
			};

			var configureCommand = function configureCommand(options) {
				if (options.log !== undefined) {
					logCommand({
						enabled: options.log
					});
				}

				var parsedQueryString = reactorQueryString.parse(window.location.search);

				if (parsedQueryString[logQueryParam] !== undefined) {
					logCommand({
						enabled: stringToBoolean(parsedQueryString[logQueryParam])
					});
				}

				var config = createConfig(options);
				config.addValidators(configValidators);

				try {
					componentRegistry = initializeComponents(config);
				} catch (e) {
					configurationFailed = true;
					throw e;
				}
			};

			var executeCommand = function executeCommand(commandName, options) {
				var command;

				if (configurationFailed) {
					// We've decided if configuration fails we'll return
					// never-resolved promises for all subsequent commands rather than
					// throwing an error for each of them.
					command = function command() {
						return new Promise(function () {});
					};
				} else if (commandName === "configure") {
					if (componentRegistry) {
						throw new Error("The library has already been configured and may only be configured once.");
					}

					command = configureCommand;
				} else if (commandName === "log") {
					command = logCommand;
				} else {
					if (!componentRegistry) {
						throw new Error("The library must be configured first. Please do so by calling " + namespace + "(\"configure\", {...}).");
					}

					command = componentRegistry.getCommand(commandName);

					if (!isFunction(command)) {
						throw new Error("The " + commandName + " command does not exist.");
					}
				}

				logger.log("Executing \"" + commandName + "\" command.", "Options:", options);
				return command(options);
			};

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

					err.message = "[" + namespace + "] " + err.message;
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
		var invokeHook = function invokeHook(componentRegistry, hookName) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				args[_key - 2] = arguments[_key];
			}

			return Promise.all(componentRegistry.getLifecycleCallbacks(hookName).map(function (callback) {
				return new Promise(function (resolve) {
					resolve(callback.apply(void 0, args));
				});
			}));
		};
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
				onResponse: guardLifecycleMethod(function (response) {
					return invokeHook(componentRegistry, "onResponse", response);
				}),
				onBeforeUnload: guardLifecycleMethod(function () {
					return invokeHook(componentRegistry, "onBeforeUnload");
				}),
				onOptInChanged: guardLifecycleMethod(function (permissions) {
					return invokeHook(componentRegistry, "onOptInChanged", permissions);
				}),
				onBeforeSend: guardLifecycleMethod(function (request) {
					return invokeHook(componentRegistry, "onBeforeSend", request);
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
				mergeMeta: createMerger(content, "meta"),
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
		 *  - `getPayloadByType`: returns a fragment of the response by type
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
				getPayloadByType: function getPayloadByType(type) {
					var fragment = find(content.handle, function (handleContent) {
						return handleContent.type === type;
					});
					return fragment ? fragment.payload : null;
				},
				toJSON: function toJSON() {
					return content;
				} // TODO: Maybe consider the following API as well?
				// - getPayloadsByAction

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
		var createNetwork = (function (config, logger, lifecycle, networkStrategy) {
			var handleResponse = function handleResponse(responseBody) {
				var parsedBody;

				try {
					parsedBody = JSON.parse(responseBody);
				} catch (e) {
					throw new Error("Error parsing server response.\n" + e + "\nResponse body: " + responseBody);
				}

				logger.log("Received network response:", parsedBody);
				var response = createResponse(parsedBody);
				return lifecycle.onResponse(response).then(function () {
					return response;
				});
			};

			var edgeDomain = config.edgeDomain,
				propertyID = config.propertyID;
			return {
				/**
				 * The object returned from network.newRequest
				 *
				 * @typedef {Object} Request
				 * @property {Function} send Call this function when you are ready to send
				 * the payload. Returns a promise yielding the raw response body.
				 * @property {Object} payload Payload object that will be sent.
				 */

				/**
				 * Create a new request.  Once "send" on the returned object is called, the
				 * lifecycle method "onBeforeSend" will be triggered with
				 * { payload, responsePromise, isBeacon } as the parameter.  When the
				 * response is returned it will call the lifecycle method "onResponse"
				 * with the returned response object.
				 *
				 * @param {boolean} [expectsResponse=true] The endpoint and request mechanism
				 * will be determined by whether a response is expected.
				 * @returns {Request}
				 */
				newRequest: function newRequest() {
					var expectsResponse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
					var payload = createPayload();

					var send = function send() {
						var responsePromise = Promise.resolve().then(function () {
							return lifecycle.onBeforeSend({
								payload: payload,
								responsePromise: responsePromise,
								isBeacon: !expectsResponse
							});
						}).then(function () {
							var action = expectsResponse ? "interact" : "collect";
							var url = "https://" + edgeDomain + "/" + action + "?propertyID=" + propertyID;
							var responseHandlingMessage = expectsResponse ? "" : " (response will be ignored)";
							logger.log("Sending network request" + responseHandlingMessage + ":", payload.toJSON());
							return networkStrategy(url, JSON.stringify(payload), expectsResponse);
						}).then(function (responseBody) {
							var handleResponsePromise;

							if (expectsResponse) {
								handleResponsePromise = handleResponse(responseBody);
							}

							return handleResponsePromise;
						});
						return responsePromise;
					};

					return {
						payload: payload,
						send: send
					};
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
							if (request.status === 204) {
								resolve();
							} else if (request.status >= 200 && request.status < 300) {
								resolve(request.responseText);
							} else {
								reject(new Error("Invalid response code " + request.status + ". Response was " + request.responseText + "."));
							}
						}
					};

					request.onloadstart = function () {
						request.responseType = "text";
					};

					request.open("POST", url, true);
					request.setRequestHeader("Content-Type", "application/json");
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
						// TODO: this will trigger a pre-flight request
						"Content-Type": "application/json"
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
		var sendBeaconFactory = (function (navigator) {
			return function (url, body) {
				return new Promise(function (resolve, reject) {
					var blob = new Blob([body], {
						type: "text/plain; charset=UTF-8"
					});

					if (!navigator.sendBeacon(url, blob)) {
						reject(new Error("Unable to send beacon."));
						return;
					}

					resolve();
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
		var createNetworkStrategy = (function (window) {
			var fetch = isFunction(window.fetch) ? fetchFactory(window.fetch) : xhrRequestFactory(window.XMLHttpRequest);
			var sendBeacon = window.navigator && isFunction(window.navigator.sendBeacon) ? sendBeaconFactory(window.navigator) : fetch;
			return function (url, body, expectsResponse) {
				var method = expectsResponse ? fetch : sendBeacon;
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
		var createNetwork$1 = (function (config, logger, lifecycle) {
			return createNetwork(config, logger, lifecycle, createNetworkStrategy(window));
		});

		/*
    Copyright 2019 Adobe. All rights reserved.
    This file is licensed to you under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License. You may obtain a copy
    of the License at http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software distributed under
    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
    OF ANY KIND, either express or implied. See the License for the specific language
    governing permissions and limitations under the License.
    */
		var initializeComponentsFactory = (function (componentCreators, logger, getNamespacedStorage, cookie) {
			return function (config) {
				var componentRegistry = createComponentRegistry();
				componentCreators.forEach(function (createComponent) {
					var configValidators = createComponent.configValidators;
					config.addValidators(configValidators);
				});
				config.validate();
				componentCreators.forEach(function (createComponent) {
					var namespace = createComponent.namespace;
					var propertyID = config.propertyID,
						cookieDomain = config.cookieDomain;
					var storage = getNamespacedStorage(config.orgID); // TO-DOCUMENT: Helpers that we inject into factories.

					var component;

					try {
						component = createComponent({
							logger: logger.spawn("[" + namespace + "]"),
							cookie: cookie(namespace, propertyID, cookieDomain),
							config: config,
							storage: storage
						});
					} catch (error) {
						throw stackError("[" + namespace + "] An error occurred during component creation.", error);
					}

					componentRegistry.register(namespace, component);
				});
				logger.log("Computed configuration:", config.toJSON());
				var lifecycle = createLifecycle(componentRegistry);
				var network = createNetwork$1(config, logger, lifecycle);
				lifecycle.onComponentsRegistered({
					componentRegistry: componentRegistry,
					lifecycle: lifecycle,
					network: network
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
		var createLogger = function createLogger(window, logController, prefix) {
			var process = function process(level) {
				if (logController.logEnabled) {
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
					return createLogger(window, logController, prefix + " " + additionalPrefix);
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
		var cookieDetails = {
			ALLOY_COOKIE_NAME: "adobe_alloy",
			// TODO: Rename this cookie
			ALLOY_COOKIE_TTL: 180
		};

		var ALLOY_COOKIE_NAME = cookieDetails.ALLOY_COOKIE_NAME,
			ALLOY_COOKIE_TTL = cookieDetails.ALLOY_COOKIE_TTL;

		var safeJSONParse = function safeJSONParse(object, cookieName) {
			try {
				return JSON.parse(object);
			} catch (error) {
				throw new Error("Invalid cookie format in " + cookieName + " cookie");
			}
		}; // TODO: Support passing a configurable expiry in the config when creating this cookie.


		var createCookie = function createCookie(prefix, id) {
			var cookieDomain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
			return {
				/**
				 * Returns the value from AlloyCookie for a prefix and a key.
				 * @param {...*} arg String key stored in alloy cookie under a component prefix.
				 */
				get: function get(name) {
					var cookieName = ALLOY_COOKIE_NAME + "_" + id;
					var currentCookie = reactorCookie.get(cookieName);
					var currentCookieParsed = currentCookie && safeJSONParse(currentCookie, cookieName);
					return currentCookieParsed && currentCookieParsed[prefix] && currentCookieParsed[prefix][name];
				},

				/**
				 * Updates the value  of a key from AlloyCookie for a prefix
				 * @param {...*} arg Strings with key and value to be stored in alloy cookie.
				 */
				set: function set(key, value) {
					var cookieName = ALLOY_COOKIE_NAME + "_" + id;
					var currentCookie = reactorCookie.get(cookieName) ? safeJSONParse(reactorCookie.get(cookieName)) : {};

					var updatedCookie = _objectSpread({}, currentCookie, _defineProperty({}, prefix, _objectSpread({}, currentCookie[prefix], _defineProperty({}, key, value))));

					reactorCookie.set(cookieName, updatedCookie, {
						expires: ALLOY_COOKIE_TTL,
						domain: cookieDomain || getTopLevelCookieDomain(window, reactorCookie)
					});
				},

				/**
				 * Removes a key from alloy cookie.
				 * @param {...*} arg String key stored in alloy cookie under a component prefix.
				 */
				remove: function remove(key) {
					var cookieName = ALLOY_COOKIE_NAME + "_" + id;
					var currentCookie = reactorCookie.get(cookieName);
					var currentCookieParsed = currentCookie && safeJSONParse(currentCookie);

					if (currentCookieParsed && currentCookieParsed[prefix]) {
						delete currentCookieParsed[prefix][key];
						reactorCookie.set(cookieName, currentCookieParsed, {
							expires: ALLOY_COOKIE_TTL,
							domain: cookieDomain || getTopLevelCookieDomain(window, reactorCookie)
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
		var createLogController = (function (instanceNamespace, getNamespacedStorage) {
			// Segregate whether logging is enabled by the SDK instance name.
			// This way consumers can log one instance at a time.
			// TODO: Figure out how this plays out with segregating Web Storage
			// in the rest of the SDK. Is it segregated by Org ID or Property ID
			// in the rest of the SDK?
			var storage = getNamespacedStorage("instance." + instanceNamespace + ".");
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
		});

		/*
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
				mergeData: createMerger(content, "data"),
				mergeMeta: createMerger(content, "meta"),
				mergeQuery: createMerger(content, "query"),
				mergeWeb: createMerger(content, "web"),
				mergeDevice: createMerger(content, "device"),
				mergeEnvironment: createMerger(content, "environment"),
				mergePlaceContext: createMerger(content, "placeContext"),
				expectsResponse: function expectsResponse() {
					return Boolean(content.query);
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
		var VIEW_START_EVENT = "viewStart";

		var createDataCollector = function createDataCollector() {
			var lifecycle;
			var network;

			var makeServerCall = function makeServerCall(event) {
				var expectsResponse = event.expectsResponse();

				var _network$newRequest = network.newRequest(expectsResponse),
					payload = _network$newRequest.payload,
					send = _network$newRequest.send;

				payload.addEvent(event);
				return send().then(function (response) {
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
				var isViewStart = options.type === VIEW_START_EVENT;
				event.mergeData(options.data);
				event.mergeMeta(options.meta);
				return lifecycle.onBeforeEvent(event, isViewStart).then(function () {
					return makeServerCall(event);
				});
			};

			return {
				lifecycle: {
					onComponentsRegistered: function onComponentsRegistered(tools) {
						lifecycle = tools.lifecycle;
						network = tools.network;
					}
				},
				commands: {
					event: createEventHandler
				}
			};
		};

		createDataCollector.namespace = "DataCollector";

		var millisecondsPerHour = 60 * 60 * 1000; // TODO: use alloy cookie once https://github.com/adobe/alloy/pull/26 is merged

		var getControlObject = function getControlObject() {
			var val = reactorCookie.get(namespace + "idSyncControl") || "";
			var arr = val ? val.split("_") : [];
			return arr.reduce(function (obj, pair) {
				var o = obj;

				var _pair$split = pair.split("-"),
					_pair$split2 = _slicedToArray(_pair$split, 2),
					id = _pair$split2[0],
					ts = _pair$split2[1];

				o[id] = ts;
				return o;
			}, {});
		};

		var setControlObject = function setControlObject(obj) {
			var arr = [];
			Object.keys(obj).forEach(function (id) {
				return arr.push(id + "-" + obj[id]);
			});
			reactorCookie.set(namespace + "idSyncControl", arr.join("_"), {
				expires: 6 * 30 // 6 months

			});
		};

		var processIdSyncs = (function (_ref) {
			var destinations = _ref.destinations,
				config = _ref.config,
				logger = _ref.logger;

			if (config.idSyncsEnabled) {
				var controlObject = getControlObject();
				var now = new Date().getTime() / millisecondsPerHour; // hours

				Object.keys(controlObject).forEach(function (key) {
					if (controlObject[key] < now) {
						delete controlObject[key];
					}
				});
				var idSyncs = destinations.filter(function (dest) {
					return dest.type === "url" && controlObject[dest.id] === undefined;
				}).map(function (dest) {
					return reactorObjectAssign({
						id: dest.id
					}, dest.spec);
				});

				if (idSyncs.length) {
					fireDestinations({
						logger: logger,
						destinations: idSyncs
					}).then(function (result) {
						var timeStamp = Math.round(new Date().getTime() / millisecondsPerHour); // hours

						result.succeeded.forEach(function (idSync) {
							var ttl = (idSync.ttl || 7) * 24; // hours

							if (idSync.id !== undefined) {
								controlObject[idSync.id] = timeStamp + ttl;
							}
						});
						setControlObject(controlObject);
					});
				}
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
		var ECID_NAMESPACE = "ECID";

		var addIdsContext = function addIdsContext(payload, ecid) {
			// TODO: Add customer ids.
			payload.addIdentity(ECID_NAMESPACE, {
				id: ecid
			});
		};

		var createIdentity = function createIdentity(_ref) {
			var config = _ref.config,
				logger = _ref.logger,
				cookie = _ref.cookie;

			var getEcid = function getEcid() {
				return cookie.get(ECID_NAMESPACE);
			};

			var ecid = getEcid();
			var deferredForEcid;

			var onBeforeEvent = function onBeforeEvent(event, isViewStart) {
				if (!isViewStart) {
					return;
				} // TODO: Remove; We won't need to request id syncs explicitely.
				// This is just for demo currently.


				event.mergeQuery({
					idSyncs: true
				});
			}; // TO-DOCUMENT: We wait for ECID before trigger any events.


			var onBeforeSend = function onBeforeSend(_ref2) {
				var payload = _ref2.payload;
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
					cookie.set(ECID_NAMESPACE, ecid);

					if (deferredForEcid) {
						deferredForEcid.resolve();
					}
				}

				var idSyncs = response.getPayloadByType("identity:exchange") || [];
				processIdSyncs({
					destinations: idSyncs,
					config: config,
					logger: logger
				});
			};

			return {
				lifecycle: {
					onBeforeEvent: onBeforeEvent,
					onBeforeSend: onBeforeSend,
					onResponse: onResponse
				},
				commands: {
					getEcid: getEcid
				}
			};
		};

		createIdentity.namespace = "Identity";
		createIdentity.configValidators = {
			idSyncsEnabled: {
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
		var processDestinations = (function (_ref) {
			var destinations = _ref.destinations,
				config = _ref.config,
				logger = _ref.logger;

			if (config.destinationsEnabled) {
				var urlDestinations = destinations.filter(function (dest) {
					return dest.type === "url";
				}).map(function (dest) {
					return reactorObjectAssign({
						id: dest.id
					}, dest.spec);
				});

				if (urlDestinations.length) {
					fireDestinations({
						logger: logger,
						destinations: urlDestinations
					});
				}

				var cookieDestinations = destinations.filter(function (dest) {
					return dest.type === "cookie";
				}).map(function (dest) {
					return dest.spec;
				});
				cookieDestinations.forEach(function (dest) {
					reactorCookie.set(dest.name, dest.value || "", {
						domain: dest.domain || "",
						expires: dest.ttl ? dest.ttl : 6 * 30 // default of 6 months

					});
				});
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

		var createAudiences = function createAudiences(_ref) {
			var config = _ref.config,
				logger = _ref.logger;
			return {
				lifecycle: {
					onBeforeEvent: function onBeforeEvent(event, isViewStart) {
						if (!isViewStart) {
							return;
						} // TODO: Remove; We won't need to request destinations explicitely.
						// This is just for demo currently.


						event.mergeQuery({
							urlDestinations: true
						});
					},
					onResponse: function onResponse(response) {
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
		var STYLE_TAG = "style";
		var CACHE = {};
		var hideElements = function hideElements(prehidingSelector) {
			// if we have different events with the same
			// prehiding selector we don't want to recreate
			// the style tag
			if (CACHE[prehidingSelector]) {
				return;
			}

			var node = createNode(STYLE_TAG);
			node.innerText = prehidingSelector + " { visibility: hidden }";
			appendNode(document.head, node);
			CACHE[prehidingSelector] = node;
		};
		var showElements = function showElements(prehidingSelector) {
			var node = CACHE[prehidingSelector];

			if (node) {
				removeNode(node);
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
		var createSetHtml = (function (collect) {
			return function (settings, event) {
				var element = event.element,
					prehidingSelector = event.prehidingSelector;
				var content = settings.content,
					meta = settings.meta; // this is a very naive approach, we will expand later

				element.innerHTML = content; // after rendering we should show remove the flicker control styles

				showElements(prehidingSelector); // make sure we send back the metadata after successful rendering

				collect({
					meta: {
						personalization: meta
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
		var elementExists = (function (settings, trigger) {
			var selector = settings.selector,
				prehidingSelector = settings.prehidingSelector;
			hideElements(prehidingSelector);
			awaitSelector(selector).then(function (nodes) {
				nodes.forEach(function (element) {
					trigger({
						element: element,
						prehidingSelector: prehidingSelector
					});
				});
			}).catch(function () {
				// in case of awaiting timing out we
				// need to remove the style tag
				// hence showing the nodes
				showElements(prehidingSelector);
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
		var initRuleComponentModules = (function (collect) {
			var setHtml = createSetHtml(collect);
			return {
				setHtml: setHtml,
				elementExists: elementExists
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
				if (!rule.events) {
					return;
				}

				rule.events.forEach(function (event) {
					ruleEventPairs.push({
						rule: rule,
						event: event
					});
				});
			});
			return ruleEventPairs;
		};

		var isConditionMet = function isConditionMet(condition, result) {
			return result && !condition.negate || !result && condition.negate;
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

			var logConditionError = function logConditionError(condition, rule, e) {
				logger.error(getErrorMessage(condition, rule, e.message, e.stack));
			};

			var logConditionNotMet = function logConditionNotMet(condition, rule) {
				logger.log("Condition " + condition.moduleType + " for rule " + rule.name + " not met.");
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
						executeModule(action.moduleType, [action.settings, syntheticEvent]);
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
						var result = executeModule(condition.moduleType, [condition.settings, syntheticEvent]);

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

		/*
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

		var createPersonalization = function createPersonalization(_ref) {
			var logger = _ref.logger;
			var ruleComponentModules;
			return {
				lifecycle: {
					onComponentsRegistered: function onComponentsRegistered(tools) {
						var componentRegistry = tools.componentRegistry;
						ruleComponentModules = initRuleComponentModules(componentRegistry.getCommand("event"));
					},
					onBeforeEvent: function onBeforeEvent(event, isViewStart) {
						if (!isViewStart) {
							return;
						}

						event.mergeQuery({
							personalization: {
								page: true,
								views: true
							}
						});
					},
					onResponse: function onResponse(response) {
						var fragments = response.getPayloadByType(PAGE_HANDLE) || [];
						fragments.forEach(function (fragment) {
							var _fragment$rules = fragment.rules,
								rules = _fragment$rules === void 0 ? [] : _fragment$rules;

							if (isNonEmptyArray(rules)) {
								executeRules(rules, ruleComponentModules, logger);
							}
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
		var createComponent = (function (config, logger, availableContexts) {
			var configuredContexts;
			return {
				namespace: "Context",
				lifecycle: {
					onComponentsRegistered: function onComponentsRegistered() {
						var configuredContextNames = [];

						if (Array.isArray(config.context)) {
							configuredContextNames = config.context;
						} else {
							logger.warn("Invalid configured context. Please specify an array of strings.");
						}

						configuredContexts = configuredContextNames.filter(function (configuredContextName) {
							if (!availableContexts[configuredContextName]) {
								logger.warn("Configured context " + configuredContextName + " is not available.");
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
			});
		};

		createContext.namespace = "Context";
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
		var createLibraryInfo = function createLibraryInfo() {
			return {
				commands: {
					getLibraryInfo: function getLibraryInfo() {
						return {
							// The value will be swapped with the proper version
							// at build time.
							version: "{{version}}"
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

		var componentCreators = [createDataCollector, createIdentity, createAudiences, createPersonalization, createContext, createLibraryInfo]; // eslint-disable-next-line no-underscore-dangle

		var namespaces = window.__alloyNS;
		var storage = storageFactory(window);

		if (namespaces) {
			namespaces.forEach(function (namespace) {
				var logController = createLogController(namespace, storage);
				var logger = createLogger(window, logController, "[" + namespace + "]");
				var initializeComponents = initializeComponentsFactory(componentCreators, logger, storage, createCookie);
				var instance = createInstance(namespace, initializeComponents, logController, logger, window);
				var queue = window[namespace].q;
				queue.push = instance;
				queue.forEach(instance);
			});
		}

	}));


};

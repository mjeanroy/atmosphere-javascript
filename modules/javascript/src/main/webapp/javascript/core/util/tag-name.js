/*
 * Copyright 2011-2019 Async-IO.org
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {has} from './has';
import {isNull} from './is-null';
import {isUndefined} from './is-undefined';

/**
 * Return the tag name of the object (a.k.a the result of `Object.prototype.toString`).
 *
 * @param {*} obj Object to get tag name.
 * @return {string} Tag name.
 */
export function tagName(obj) {
  // Handle null and undefined since it may fail on some browser.

  if (isNull(obj)) {
    return '[object Null]';
  }

  if (isUndefined(obj)) {
    return '[object Undefined]';
  }

  const tag = Object.prototype.toString.call(obj);

  // IE11 on Win10 returns `[object Object]` with `Map` and `Set`.
  // IE8 returns `[object Object]` with NodeList and HTMLCollection.
  // Try to patch this bug and return the appropriate tag value.
  if (tag === '[object Object]') {
    // -- IE8 Patch

    // Handle NodeList (IE8 only).
    if (obj instanceof NodeList) {
      return '[object NodeList]';
    }

    // Handle HTMLCollection (IE8 only).
    if (obj instanceof HTMLCollection) {
      return '[object HTMLCollection]';
    }

    // Handle Arguments (IE8 only).
    if (has(obj, 'callee')) {
      return '[object Arguments]';
    }
  }

  return tag;
}

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

import {tagName} from './tag-name';

/**
 * Check that a given value is of a given type.
 * The type is the tag name displayed with `Object.prototype.toString`
 * function call.
 *
 * @param {*} obj Value to check.
 * @param {string} type The type id.
 * @return {boolean} `true` if `obj` is of given type, `false` otherwise.
 */
export function is(obj, type) {
  return tagName(obj) === `[object ${type}]`;
}

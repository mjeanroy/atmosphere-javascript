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

const _trim = String.prototype.trim ?
  (value) => String.prototype.trim.call(value) :
  (value) => value.toString().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, '');

/**
 * Trim given value.
 * If value is not a `string`, it will be automatically transformed using its `toString` function.
 *
 * @param {*} value Value to trim.
 * @return {string} The trimmed value.
 */
export function trim(value) {
  return _trim(value);
}

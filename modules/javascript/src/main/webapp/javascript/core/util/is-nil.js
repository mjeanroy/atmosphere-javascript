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

import {isNull} from './is-null';
import {isUndefined} from './is-undefined';

/**
 * Check if given value is `null` or `undefined`.
 *
 * @param {*} value Value to check.
 * @return {boolean} `true` if value is `null` or `undefined`, `false` otherwise.
 */
export function isNil(value) {
  return isNull(value) || isUndefined(value);
}

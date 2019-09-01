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

import {isString} from '~/core/util/is-string';

describe('isString', () => {
  it('should return true with a string', () => {
    expect(isString('test')).toBe(true);
    expect(isString(String('test'))).toBe(true);

    // eslint-disable-next-line no-new-wrappers
    expect(isString(new String('test'))).toBe(true);
  });

  it('should return false without a string', () => {
    expect(isString(true)).toBe(false);
    expect(isString(0)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(() => {})).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
  });
});

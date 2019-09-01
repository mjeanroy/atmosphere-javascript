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

import {isNil} from '~/core/util/is-nil';

describe('isNil', () => {
  it('should return true with undefined or null', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(void 0)).toBe(true);
  });

  it('should return false without undefined', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil(true)).toBe(false);
    expect(isNil({})).toBe(false);
    expect(isNil(() => {})).toBe(false);
  });
});

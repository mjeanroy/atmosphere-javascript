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

import {is} from '~/core/util/is';

describe('is', () => {
  it('should return true for expected tag name', () => {
    expect(is('', 'String')).toBe(true);
    expect(is(0, 'Number')).toBe(true);
    expect(is(true, 'Boolean')).toBe(true);
    expect(is([], 'Array')).toBe(true);
    expect(is(new Date(), 'Date')).toBe(true);
  });
});

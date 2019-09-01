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

import {tagName} from '~/core/util/tag-name';

describe('tagName', () => {
  it('should get [object Null] with null', () => {
    expect(tagName(null)).toBe('[object Null]');
  });

  it('should get [object Undefined] with undefined', () => {
    expect(tagName(undefined)).toBe('[object Undefined]');
  });

  it('should get [object Array] with array', () => {
    expect(tagName([])).toBe('[object Array]');
  });

  it('should get [object String] with string', () => {
    expect(tagName('')).toBe('[object String]');
    expect(tagName(String(''))).toBe('[object String]');

    // eslint-disable-next-line no-new-wrappers
    expect(tagName(new String(''))).toBe('[object String]');
  });

  it('should get [object Date] with date', () => {
    expect(tagName(new Date())).toBe('[object Date]');
  });

  it('should get [object Boolean] with booleans', () => {
    expect(tagName(true)).toBe('[object Boolean]');
    expect(tagName(false)).toBe('[object Boolean]');
  });
});

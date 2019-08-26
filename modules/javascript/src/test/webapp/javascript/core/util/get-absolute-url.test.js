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

import {getAbsoluteURL} from '~/core/util/get-absolute-url';

describe('getAbsoluteUrl', () => {
  it('should get absolute URL from already absolute URL', () => {
    expect(getAbsoluteURL('http://localhost:8080/path')).toBe('http://localhost:8080/path');
  });

  it('should get absolute URL from relative URL', () => {
    const location = window.location;
    const port = location.port;
    const str = port === 80 ? '' : `:${port}`;
    expect(getAbsoluteURL('/path')).toBe(`http://localhost${str}/path`);
  });

  it('should get absolute URL with [ or ]', () => {
    expect(getAbsoluteURL('http://localhost:8080/path?q=[test]')).toBe('http://localhost:8080/path?q=[test]');
  });
});

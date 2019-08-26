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

import {fixedEncodeURI} from './fixed-encode-uri';
import {getUserAgent} from './get-user-agent';
import {isUndefined} from './is-undefined';

/**
 * Get absolute URL from given url.
 *
 * @param {string} url The URL to parse.
 * @return {string} The absolute URL.
 */
export function getAbsoluteURL(url) {
  if (isUndefined(document) || isUndefined(document.createElement)) {
    // Assuming the url to be already absolute when DOM is not supported
    return url;
  }

  const div = document.createElement('div');

  // Uses an innerHTML property to obtain an absolute URL
  div.innerHTML = `<a href="${url}"/>`;

  // `encodeURI` and `decodeURI` are needed to normalize URL between IE and non-IE,
  // since IE doesn't encode the href property value and return it - http://jsfiddle.net/Yq9M8/1/

  const ua = getUserAgent();
  if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0) {
    return fixedEncodeURI(decodeURI(div.firstChild.href));
  }

  return div.firstChild.href;
}

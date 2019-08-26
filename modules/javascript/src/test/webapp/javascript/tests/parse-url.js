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

/**
 * A fake `URL` implementation.
 *
 * @class
 */
class FakeUrl {
  /**
   * Build the fake `URL`.
   *
   * @param {string} protocol The URL protocol.
   * @param {string} username  The URL username.
   * @param {string} password The URL password.
   * @param {string} host The URL host.
   * @param {string} hostname The URL hostname.
   * @param {string} port The URL port.
   * @param {string} pathname The URL pathname.
   * @param {string} search  The URL search (a.k.a the query string).
   * @param {string} hash The URL hash (a.k.a the fragment).
   * @constructor
   */
  constructor(protocol, username, password, host, hostname, port, pathname, search, hash) {
    this.protocol = protocol;
    this.username = username || '';
    this.password = password || '';
    this.host = host || null;
    this.hostname = hostname || null;
    this.port = port || null;
    this.pathname = pathname || '';
    this.search = search || '';
    this.hash = hash || '';

    // Ensure the pathname always starts with a '/'
    if (this.pathname[0] !== '/') {
      this.pathname = '/' + this.pathname;
    }
  }

  /**
   * Parse search parameters and returns an object with parameter (parameter name
   * as the key, parameter value as the object value).
   *
   * @return {Object} An object with all query parameters.
   */
  parseSearchParams() {
    const searchParams = {};

    if (this.search) {
      const parts = this.search.split('?', 2);
      const queryString = parts.length === 2 ? parts[1] : parts[0];
      const pairs = queryString.split('&');

      for (let i = 0, size = pairs.length; i < size; ++i) {
        const pair = pairs[i];
        const parameter = pair.split('=', 2);
        const name = parameter[0];
        const value = parameter.length === 2 ? parameter[1] : '';
        searchParams[name] = value;
      }
    }

    return searchParams;
  }
}

/**
 * Parse URL using native API.
 *
 * @param {string} url The URL.
 * @return {FakeUrl} The parsed URL.
 */
function nativeUrl(url) {
  const result = new URL(url);
  return new FakeUrl(
      result.protocol,
      result.username,
      result.password,
      result.host,
      result.hostname,
      result.port,
      result.pathname,
      result.search,
      result.hash
  );
}

/**
 * Parse URL using polyfill url parser.
 *
 * @param {string} url The URL.
 * @return {FakeUrl} The parsed URL.
 */
function polyfillUrl(url) {
  const a = document.createElement('a');
  a.href = url;

  return new FakeUrl(
      a.protocol,
      a.username,
      a.password,
      a.host,
      a.hostname,
      a.port,
      a.pathname,
      a.search,
      a.hash
  );
}

/**
 * Ensure that given URL is valid with expected values.
 *
 * @param {URL} url The URL.
 * @param {string} protocol The expected protocol part.
 * @param {string} hostname The expected hostname part.
 * @param {string} port The expected port part.
 * @param {string} pathname The expected pathname part.
 * @param {string} search The expected search part.
 * @return {boolean} `true` if `url` has expected settings, `false` otherwise.
 */
function ensureUrl(url, protocol, hostname, port, pathname, search) {
  return url !== null &&
      url.protocol === protocol &&
      url.hostname === hostname &&
      url.port === port &&
      url.host === `${hostname}:${port}` &&
      url.pathname === pathname &&
      url.search === search;
}

/**
 * Check for `URL` support in current environment.
 *
 * @return {boolean} `true` if `URL` supported, `false` otherwise.
 */
function checkUrlSupport() {
  try {
    const url = new URL('http://localhost:8080/test?q');
    return ensureUrl(url, 'http:', 'localhost', '8080', '/test', '?q');
  } catch (e) {
    return false;
  }
}

const toUrl = checkUrlSupport() ? nativeUrl : polyfillUrl;

/**
 * Parse query string and extract all query string parameters.
 *
 * @param {string} url The url.
 * @return {URL} The URL object.
 */
export function parseUrl(url) {
  if (!url) {
    return null;
  }

  return toUrl(url);
}

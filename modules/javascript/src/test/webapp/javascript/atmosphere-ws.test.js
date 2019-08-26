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

import atmosphere from '~/index';
import {parseUrl} from './tests/parse-url';

describe('atmosphere WS', () => {
  let now;

  beforeEach(() => {
    now = new Date();
    jasmine.clock().mockDate(now);
  });

  beforeEach(() => {
    jasmine.ws().install();
  });

  afterEach(() => {
    jasmine.ws().uninstall();
  });

  it('should subscribe using given URL', () => {
    const url = 'wss://localhost/ws';
    const transport = 'websocket';
    const logLevel = 'debug';
    const subscription = atmosphere.subscribe({
      url,
      transport,
      logLevel,
    });

    expect(subscription).toBeDefined();
    expect(subscription.request).toBeDefined();
    expect(subscription.request.url).toBe(url);
    expect(subscription.request.logLevel).toBe(logLevel);
    expect(subscription.request.transport).toBe('websocket');

    const connections = jasmine.ws().connections();
    expect(connections.count()).toBe(1);

    const connection = connections.mostRecent();
    expect(connection.readyState).toBe(0);

    const connectionUrl = parseUrl(connection.url);
    expect(connectionUrl.protocol).toBe('wss:');
    expect(connectionUrl.host).toBe('localhost');
    expect(connectionUrl.pathname).toBe('/ws');
    expect(connectionUrl.parseSearchParams()).toEqual({
      'X-Atmosphere-tracking-id': jasmine.any(String),
      'X-Atmosphere-Framework': jasmine.any(String),
      'X-Atmosphere-Transport': 'websocket',
      'X-atmo-protocol': 'true',
    });

    expect(console.debug).toHaveBeenCalledWith(
        `${now.toString()} Atmosphere: Invoking executeWebSocket, using URL: ${connection.url}`
    );
  });

  describe('once subscribed', () => {
    let connection;
    let onOpen;
    let onMessage;

    beforeEach(() => {
      onOpen = jasmine.createSpy('onOpen');
      onMessage = jasmine.createSpy('onMessage');

      atmosphere.subscribe({
        url: 'wss://localhost/ws',
        transport: 'websocket',
        logLevel: 'debug',
        onOpen,
        onMessage,
      });

      connection = jasmine.ws().connections().mostRecent();
    });

    it('should trigger on open once opened', () => {
      connection.openHandshake().respond();
      expect(connection.readyState).toBe(1);
      expect(onOpen).not.toHaveBeenCalled();
      expect(onMessage).not.toHaveBeenCalled();

      // Since Atmosphere protocol is enabled, the first message will trigger the `onOpen` callback
      connection.emitMessage('45|729e6d1c-9235-4c42-b889-b178ac4be424|10000|X|');

      expect(onOpen).toHaveBeenCalledWith(jasmine.objectContaining({
        status: 200,
      }));
    });
  });
});

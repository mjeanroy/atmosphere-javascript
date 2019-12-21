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
import {tick} from './tests/jasmine/clock';
import {resetConsoleSpies} from './tests/jasmine/console';
import {resetSpies} from './tests/jasmine/reset-spies';
import {parseUrl} from './tests/utils/parse-url';

describe('atmosphere SSE', () => {
  let now;

  beforeEach(() => {
    now = new Date();
    jasmine.clock().mockDate(now);
  });

  beforeEach(() => {
    jasmine.sse().install();
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.sse().uninstall();
    jasmine.Ajax.uninstall();
  });

  it('should subscribe using given URL', () => {
    const socket = subscribe({});
    expect(socket).toBeDefined();

    const rq = socket.request;
    expect(rq).toBeDefined();
    expect(rq.url).toBe('http://localhost:9876/sse');
    expect(rq.logLevel).toBe('debug');
    expect(rq.transport).toBe('sse');

    const connections = jasmine.sse().connections();
    expect(connections.count()).toBe(1);

    const connection = connections.mostRecent();
    expect(connection.readyState).toBe(0);

    const connectionUrl = parseUrl(connection.url);
    expect(connectionUrl.protocol).toBe('http:');
    expect(connectionUrl.host).toBe('localhost:9876');
    expect(connectionUrl.pathname).toBe('/sse');
    expect(connectionUrl.parseSearchParams()).toEqual({
      'X-Atmosphere-tracking-id': jasmine.any(String),
      'X-Atmosphere-Framework': jasmine.any(String),
      'X-Atmosphere-Transport': 'sse',
      'X-atmo-protocol': 'true',
    });

    const tt = now.toString();
    expect(console.debug).toHaveBeenCalledWith(`${tt} Atmosphere: Invoking executeSSE`);
    expect(console.debug).toHaveBeenCalledWith(`${tt} Atmosphere: Using URL: ${connection.url}`);
  });

  it('should subscribe to websocket and trigger connect timeout after interval', () => {
    const connectTimeout = 3000;
    const onOpen = jasmine.createSpy('onOpen');
    const onMessage = jasmine.createSpy('onMessage');
    const onClose = jasmine.createSpy('onClose').and.callFake((e) => {
      expect(e.status).toBe(501);
      expect(e.responseBody).toBe('');
      expect(e.reason).not.toBeDefined();
      expect(e.transport).toBe('sse');
      expect(e.headers).toEqual([]);
    });

    subscribe({
      connectTimeout: 3000,
      onOpen,
      onMessage,
      onClose,
    });

    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    const connection = jasmine.sse().connections().mostRecent();
    expect(connection).toBeDefined();
    expect(connection.readyState).toBe(0);

    tick(connectTimeout + 1);

    expect(connection.readyState).toBe(2);

    // The `onclose` event does not exist with SSE connection.
    // So, expect it not to have been called.
    expect(onClose).not.toHaveBeenCalled();
    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();

    expect(console.info).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should subscribe to websocket and do not trigger connect timeout after interval if connect timeout is not set', () => {
    const onOpen = jasmine.createSpy('onOpen');
    const onMessage = jasmine.createSpy('onMessage');
    const onClose = jasmine.createSpy('onClose');

    subscribe({
      onOpen,
      onMessage,
      onClose,
    });

    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    const connection = jasmine.sse().connections().mostRecent();
    expect(connection).toBeDefined();
    expect(connection.readyState).toBe(0);

    tick(10000);

    expect(connection.readyState).toBe(0);
    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  describe('once subscribed', () => {
    let connection;
    let onOpen;
    let onMessage;
    let onClose;

    beforeEach(() => {
      onOpen = jasmine.createSpy('onOpen');
      onMessage = jasmine.createSpy('onMessage');
      onClose = jasmine.createSpy('onClose');

      subscribe({
        onOpen,
        onMessage,
        onClose,
      });

      connection = jasmine.sse().connections().mostRecent();

      resetConsoleSpies();
    });

    it('should trigger on open once opened', () => {
      expect(connection.readyState).toBe(0);
      expect(onOpen).not.toHaveBeenCalled();
      expect(onMessage).not.toHaveBeenCalled();

      onOpen.and.callFake((e) => {
        expect(e.status).toBe(200);
        expect(e.responseBody).toBe('');
        expect(e.reason).not.toBeDefined();
        expect(e.transport).toBe('sse');
        expect(e.headers).toEqual([]);
      });

      onMessage.and.callFake((e) => {
        expect(e.status).toBe(200);
        expect(e.responseBody).toBe('X|');
        expect(e.reason).not.toBeDefined();
        expect(e.transport).toBe('sse');
        expect(e.headers).toEqual([]);
      });

      // Emitting a message will triggered the sse onopen event.
      connection.emit('45|729e6d1c-9235-4c42-b889-b178ac4be424|10000|X|');

      expect(connection.readyState).toBe(1);
      expect(onOpen).toHaveBeenCalledOnce();
      expect(onMessage).toHaveBeenCalledOnce();

      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: sse.onopen`);
      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: SSE successfully opened`);
      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: sse.onmessage`);
      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: Firing onOpen`);
      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: Firing onMessage`);
    });
  });

  describe('once opened', () => {
    let connection;
    let onOpen;
    let onMessage;
    let onClose;

    beforeEach(() => {
      onOpen = jasmine.createSpy('onOpen');
      onMessage = jasmine.createSpy('onMessage');
      onClose = jasmine.createSpy('onClose');

      subscribe({
        onOpen,
        onMessage,
        onClose,
      });

      connection = jasmine.sse().connections().mostRecent();
      connection.emit('45|729e6d1c-9235-4c42-b889-b178ac4be424|10000|X|');

      tick(1000);
      resetConsoleSpies();
      resetSpies(onOpen, onClose, onMessage);
    });

    it('should receive message', () => {
      const message = 'Hello John Doe';

      onMessage.and.callFake((e) => {
        expect(e.responseBody).toBe(message);

        expect(e.status).toBe(200);
        expect(e.reason).not.toBeDefined();
        expect(e.transport).toBe('sse');
        expect(e.headers).toEqual([]);
      });

      connection.emit(message);

      expect(onOpen).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      expect(onMessage).toHaveBeenCalledOnce();
    });
  });

  /**
   * Subscribe to WebSocket.
   *
   * @param {Object} param0 Options.
   * @return {Object} The opened socket.
   */
  function subscribe({onOpen, onClose, onMessage, connectTimeout}) {
    return atmosphere.subscribe({
      url: 'http://localhost:9876/sse',
      transport: 'sse',
      logLevel: 'debug',
      connectTimeout,
      heartbeatInterval: 0,

      onOpen,
      onMessage,
      onClose,
    });
  }
});

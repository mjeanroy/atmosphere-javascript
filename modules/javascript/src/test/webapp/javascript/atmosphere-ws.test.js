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
import {mockDate, tick} from './tests/jasmine/clock';
import {resetConsoleSpies} from './tests/jasmine/console';
import {resetSpies} from './tests/jasmine/reset-spies';
import {parseUrl} from './tests/utils/parse-url';

describe('atmosphere WS', () => {
  let now;

  beforeEach(() => {
    now = mockDate();
  });

  beforeEach(() => {
    jasmine.ws().install();
  });

  afterEach(() => {
    jasmine.ws().uninstall();
  });

  it('should subscribe using given URL', () => {
    const socket = subscribe({});
    expect(socket).toBeDefined();

    const rq = socket.request;
    expect(rq).toBeDefined();
    expect(rq.url).toBe('wss://localhost/ws');
    expect(rq.logLevel).toBe('debug');
    expect(rq.transport).toBe('websocket');

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

  it('should subscribe to websocket and trigger connect timeout after interval', () => {
    const connectTimeout = 3000;
    const onOpen = jasmine.createSpy('onOpen');
    const onMessage = jasmine.createSpy('onMessage');
    const onClose = jasmine.createSpy('onClose').and.callFake((e) => {
      expect(e.status).toBe(501);
      expect(e.responseBody).toBe('');
      expect(e.reason).not.toBeDefined();
      expect(e.transport).toBe('websocket');
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


    tick(connectTimeout + 1);

    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();

    const tt = new Date(now.getTime() + connectTimeout + 1).toString();

    expect(console.debug).toHaveBeenCalledWith(`${tt} Atmosphere: websocket.onclose`);
    expect(console.debug).toHaveBeenCalledWith(`${tt} Atmosphere: Firing onClose (closed case)`);
    expect(console.debug).toHaveBeenCalledWith(`${tt} Atmosphere: Request already closed, not firing onClose (closed case)`);
    expect(console.debug).toHaveBeenCalledWith(`${tt} Atmosphere: Websocket failed on first connection attempt. Downgrading to streaming and resending`);
    expect(console.warn).toHaveBeenCalledWith(`${tt} Atmosphere: Websocket closed, reason: The endpoint is terminating the connection due to a protocol error. - wasClean: false`);

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

    tick(10000);

    expect(onOpen).not.toHaveBeenCalled();
    expect(onMessage).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    expect(console.debug).toHaveBeenCalledOnce();
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

      connection = jasmine.ws().connections().mostRecent();

      resetConsoleSpies();
    });

    it('should trigger on open once opened', () => {
      connection.openHandshake().respond();

      expect(connection.readyState).toBe(1);
      expect(onOpen).not.toHaveBeenCalled();
      expect(onMessage).not.toHaveBeenCalled();

      onOpen.and.callFake((e) => {
        expect(e.status).toBe(200);
        expect(e.responseBody).toBe('');
        expect(e.reason).not.toBeDefined();
        expect(e.transport).toBe('websocket');
        expect(e.headers).toEqual([]);
      });

      onMessage.and.callFake((e) => {
        expect(e.status).toBe(200);
        expect(e.responseBody).toBe('X|');
        expect(e.reason).not.toBeDefined();
        expect(e.transport).toBe('websocket');
        expect(e.headers).toEqual([]);
      });

      // Since Atmosphere protocol is enabled, the first message will trigger the `onOpen` callback
      connection.emitMessage('45|729e6d1c-9235-4c42-b889-b178ac4be424|10000|X|');

      expect(onOpen).toHaveBeenCalledOnce();
      expect(onMessage).toHaveBeenCalledOnce();

      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: websocket.onopen`);
      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: Websocket successfully opened`);
      expect(console.debug).toHaveBeenCalledWith(`${now.toString()} Atmosphere: websocket.onmessage`);
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

      connection = jasmine.ws().connections().mostRecent();
      connection.openHandshake().respond();
      connection.emitMessage('45|729e6d1c-9235-4c42-b889-b178ac4be424|10000|X|');

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
        expect(e.transport).toBe('websocket');
        expect(e.headers).toEqual([]);
      });

      connection.emitMessage(message);

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
      url: 'wss://localhost/ws',
      transport: 'websocket',
      logLevel: 'debug',
      connectTimeout,

      onOpen,
      onMessage,
      onClose,
    });
  }
});

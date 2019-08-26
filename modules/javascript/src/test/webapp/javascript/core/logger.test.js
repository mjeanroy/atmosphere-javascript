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

import {createLogger} from '~/core/logger';

describe('Logger', () => {
  let msg;
  let now;

  beforeEach(() => {
    msg = 'Atmosphere: Test';
    now = new Date();

    jasmine.clock().mockDate(now);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('debug level', () => {
    let logger;

    beforeEach(() => {
      logger = createLogger('debug');
    });

    it('should check enabled level', () => {
      expect(logger.isLevelEnabled('debug')).toBe(true);
      expect(logger.isLevelEnabled('info')).toBe(true);
      expect(logger.isLevelEnabled('warn')).toBe(true);
      expect(logger.isLevelEnabled('error')).toBe(true);
    });

    it('should log debug message', () => {
      logger.debug(msg);

      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.debug).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });

    it('should log info message', () => {
      logger.info(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.info).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });

    it('should log warn message', () => {
      logger.warn(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.warn).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });

    it('should log error message', () => {
      logger.error(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });
  });

  describe('info level', () => {
    let logger;

    beforeEach(() => {
      logger = createLogger('info');
    });

    it('should check enabled level', () => {
      expect(logger.isLevelEnabled('debug')).toBe(false);
      expect(logger.isLevelEnabled('info')).toBe(true);
      expect(logger.isLevelEnabled('warn')).toBe(true);
      expect(logger.isLevelEnabled('error')).toBe(true);
    });

    it('should not log debug message', () => {
      logger.debug(msg);

      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log info message', () => {
      logger.info(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.info).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });

    it('should log warn message', () => {
      logger.warn(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.warn).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });

    it('should log error message', () => {
      logger.error(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });
  });

  describe('warn level', () => {
    let logger;

    beforeEach(() => {
      logger = createLogger('warn');
    });

    it('should check enabled level', () => {
      expect(logger.isLevelEnabled('debug')).toBe(false);
      expect(logger.isLevelEnabled('info')).toBe(false);
      expect(logger.isLevelEnabled('warn')).toBe(true);
      expect(logger.isLevelEnabled('error')).toBe(true);
    });

    it('should not log debug message', () => {
      logger.debug(msg);

      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should not log info message', () => {
      logger.info(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log warn message', () => {
      logger.warn(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();

      expect(console.warn).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });

    it('should log error message', () => {
      logger.error(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });
  });

  describe('error level', () => {
    let logger;

    beforeEach(() => {
      logger = createLogger('error');
    });

    it('should check enabled level', () => {
      expect(logger.isLevelEnabled('debug')).toBe(false);
      expect(logger.isLevelEnabled('info')).toBe(false);
      expect(logger.isLevelEnabled('warn')).toBe(false);
      expect(logger.isLevelEnabled('error')).toBe(true);
    });

    it('should not log debug message', () => {
      logger.debug(msg);

      expect(console.info).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should not log info message', () => {
      logger.info(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should not log warn message', () => {
      logger.warn(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should log error message', () => {
      logger.error(msg);

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();

      expect(console.error).toHaveBeenCalledWith(
          `${now.toString()} Atmosphere: ${msg}`
      );
    });
  });
});

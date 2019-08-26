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

import {has} from './util/has';

export const DEBUG = 'debug';
export const INFO = 'info';
export const WARN = 'warn';
export const ERROR = 'error';
export const OFF = 'off';

const LEVELS = {
  [ERROR]: 1,
  [WARN]: 2,
  [INFO]: 3,
  [DEBUG]: 4,
  [OFF]: 5,
};

/**
 * A Logger.
 *
 * @class
 */
class ConsoleLogger {
  /**
   * Create new logger.
   *
   * @param {string} level Logger level.
   * @constructor
   */
  constructor(level = 'info') {
    this._level = level;
  }

  /**
   * Log debug message.
   *
   * @param {Array<*>} args Messages to log.
   * @return {void}
   */
  debug(...args) {
    this.log(DEBUG, ...args);
  }

  /**
   * Log info message.
   *
   * @param {Array<*>} args Messages to log.
   * @return {void}
   */
  info(...args) {
    this.log(INFO, ...args);
  }

  /**
   * Log warn message.
   *
   * @param {Array<*>} args Messages to log.
   * @return {void}
   */
  warn(...args) {
    this.log(WARN, ...args);
  }

  /**
   * Log error message.
   *
   * @param {Array<*>} args Messages to log.
   * @return {void}
   */
  error(...args) {
    this.log(ERROR, ...args);
  }

  /**
   * Check if given level is enabled for this logger.
   *
   * @param {string} level The log level to check.
   * @return {boolean} `true` if given level is enabled, `false` otherwise.
   */
  isLevelEnabled(level) {
    if (!has(LEVELS, level) || !has(LEVELS, this._level)) {
      return false;
    }

    return LEVELS[level] <= LEVELS[this._level];
  }

  /**
   * Set new log level to current logger.
   *
   * @param {string} level New log level.
   * @return {void}
   */
  setLogLevel(level) {
    this._level = level;
  }

  /**
   * Log message to the console.
   *
   * @param {string} level The console level.
   * @param  {...any} args Arguments to log.
   * @return {void}
   */
  log(level, ...args) {
    if (this.isLevelEnabled(level) && console[level]) {
      console[level](`${new Date()} Atmosphere: ${args}`);
    }
  }
}

/**
 * Create new logger.
 *
 * @param {string} level Logger level.
 * @return {Logger} The new logger instance.
 */
export function createLogger(level) {
  return new ConsoleLogger(level);
}

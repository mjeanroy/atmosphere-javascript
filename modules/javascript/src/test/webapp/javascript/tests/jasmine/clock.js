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

const timers = [];
const pollers = [];

let _setTimeout = null;
let _clearTimeout = null;

let _setInterval = null;
let _clearInterval = null;

beforeEach(() => {
  installClock();
  decorateTimers();
});

afterEach(() => {
  clearPendingTimers();
  restoreTimers();
  uninstallClock();
});

function installClock() {
  jasmine.clock().install();
}

function uninstallClock() {
  jasmine.clock().uninstall();
}

function clearPendingTimers() {
  while (timers.length > 0) {
    window.clearTimeout(timers[0]);
  }

  while (pollers.length > 0) {
    window.clearInterval(pollers[0]);
  }
}

function decorateTimers() {
  interceptSetTimers();
  interceptClearTimers();
}

function restoreTimers() {
  restoreSetTimers();
  restoreClearTimers();
}

function interceptSetTimers() {
  _setTimeout = window.setTimeout;
  _setInterval = window.setInterval;

  window.setTimeout = (fn, t) => track(fn, t, _setTimeout, timers);
  window.setInterval = (fn, t) => track(fn, t, _setInterval, pollers);
}

function interceptClearTimers() {
  _clearTimeout = window.clearTimeout;
  _clearInterval = window.clearInterval;

  window.clearTimeout = (t) => untrack(timers, t, _clearTimeout);
  window.clearInterval = (t) => untrack(pollers, t, _clearInterval);
}

function track(fn, t, timerFn, array) {
  const id = timerFn(fn, t);
  array.push(id);
  return id;
}

function untrack(array, x, clearFn) {
  const idx = array.indexOf(x);

  if (idx >= 0) {
    array.splice(idx, 1);
  }

  return clearFn(x);
}

function restoreSetTimers() {
  window.setTimeout = _setTimeout;
  window.setInterval = _setInterval;

  _setTimeout = null;
  _setInterval = null;
}

function restoreClearTimers() {
  window.clearTimeout = _clearTimeout;
  window.clearInterval = _clearInterval;

  _clearTimeout = null;
  _clearInterval = null;
}

/**
 * Tick clock.
 *
 * @param {number} delay Delay, default is zero.
 * @return {void}
 */
export function tick(delay = 0) {
  jasmine.clock().tick(delay);
}

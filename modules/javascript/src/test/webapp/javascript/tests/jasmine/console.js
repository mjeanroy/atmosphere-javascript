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

beforeEach(() => {
  const methods = ['log', 'debug', 'info', 'warn', 'error'];

  for (let i = 0, size = methods.length; i < size; ++i) {
    const name = methods[i];
    const fn = console[name];
    if (fn) {
      spyOn(console, name).and.callFake((msg, ...args) => {
        if (msg.indexOf('Atmosphere:') < 0) {
          fn.call(console, msg, ...args);
        }
      });
    }
  }
});

/**
 * Reset all global spies.
 *
 * @return {void}
 */
export function resetConsoleSpies() {
  console.log.calls.reset();
  console.debug.calls.reset();
  console.info.calls.reset();
  console.warn.calls.reset();
  console.error.calls.reset();
}

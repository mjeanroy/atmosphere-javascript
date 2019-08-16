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

const path = require('path');
const log = require('fancy-log');
const colors = require('ansi-colors');
const karma = require('karma');

function debug(msg) {
  log(colors.grey(msg));
}

function runKarma(mode, done) {
  const fileName = `karma.${mode}.conf.js`;
  const configFile = path.join(__dirname, fileName);
  const srv = new karma.Server({configFile}, (err) => {
    debug('Calling done callback of Karma');
    done(err);
  });

  debug(`Running karma with configuration: ${fileName}`);
  srv.start();
}

function test(done) {
  runKarma('test', done);
}

function tdd(done) {
  runKarma('tdd', done);
}

module.exports = {
  test,
  tdd,
};

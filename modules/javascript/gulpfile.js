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

/* eslint-env node */

const path = require('path');
const log = require('fancy-log');
const colors = require('ansi-colors');
const gulp = require('gulp');
const karma = require('karma');
const eslint = require('gulp-eslint');

/**
 * Log debug message in grey.
 *
 * @param {string} msg Message to log.
 * @return {void}
 */
function debug(msg) {
  log(colors.grey(msg));
}

/**
 * Run karma test suite.
 *
 * @param {string} mode Test mode (`tdd`, `test`).
 * @param {function} done The done callback.
 * @return {void}
 */
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

/**
 * Run test suite once, and exit.
 *
 * @param {function} done The done callback.
 * @return {void}
 */
function test(done) {
  runKarma('test', done);
}

/**
 * Run test suite and watch for changes.
 *
 * @param {function} done The done callback.
 * @return {void}
 */
function tdd(done) {
  runKarma('tdd', done);
}

/**
 * Lint source files.
 *
 * @return {Stream} The gulp stream.
 */
function lint() {
  const src = [
    path.join(__dirname, 'src', 'main', '**', '*js'),
    path.join(__dirname, 'src', 'test', '**', '*js'),
    path.join(__dirname, '*js'),
  ];

  return gulp.src(src)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
}

module.exports = {
  lint,
  test,
  tdd,
};

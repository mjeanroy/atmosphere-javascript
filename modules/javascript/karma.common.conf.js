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
const babel = require('rollup-plugin-babel');
const entryPoint = path.join(__dirname, 'src', 'test', 'webapp', 'javascript', 'index.js');

module.exports = (config) => ({
  // base path, that will be used to resolve files and exclude
  basePath: __dirname,

  frameworks: [
    'jasmine',
  ],

  files: [
    path.join(__dirname, 'node_modules', 'jasmine-utils', 'src', 'jasmine-utils.js'),
    path.join(__dirname, 'node_modules', 'jasmine-ws', 'dist', 'jasmine-ws.js'),
    path.join(__dirname, 'node_modules', 'jasmine-sse', 'dist', 'jasmine-sse.js'),
    path.join(__dirname, 'node_modules', 'jasmine-ajax', 'lib', 'mock-ajax.js'),
    entryPoint,
  ],

  exclude: [
  ],

  // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
  // CLI --reporters progress
  reporters: [
    'progress',
  ],

  // web server port
  // CLI --port 9876
  port: 9876,

  // cli runner port
  // CLI --runner-port 9100
  runnerPort: 9100,

  // enable / disable colors in the output (reporters and logs)
  // CLI --colors --no-colors
  colors: true,

  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  // CLI --log-level debug
  logLevel: config.LOG_INFO,

  // enable / disable watching file and executing tests whenever any file changes
  // CLI --auto-watch --no-auto-watch
  autoWatch: true,

  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera
  // - Safari (only Mac)
  // - PhantomJS
  // - IE (only Windows)
  // CLI --browsers Chrome,Firefox,Safari
  browsers: [
    'PhantomJS',
  ],

  // If browser does not capture in given timeout [ms], kill it
  // CLI --capture-timeout 5000
  captureTimeout: 10000,

  // Auto run tests on start (when browsers are captured) and exit
  // CLI --single-run --no-single-run
  singleRun: false,

  // report which specs are slower than 500ms
  // CLI --report-slower-than 500
  reportSlowerThan: 500,

  preprocessors: {
    [entryPoint]: ['rollup'],
  },

  // Rollup test configuration
  rollupPreprocessor: {
    output: {
      format: 'iife',
      name: 'atmosphere',
      sourcemap: false,
    },

    plugins: [
      babel(),

      {
        resolveId(id) {
          if (id && id.charAt(0) === '~') {
            const absoluteDir = path.join(__dirname, 'src', 'main', 'webapp', 'javascript');
            return absoluteDir + id.slice(1) + '.js';
          }
        },
      },
    ],
  },
});

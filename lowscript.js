'use strict';

const markdown = require('./lib/markdown.js');
const runtime = require('./lib/runtime.js');

module.exports = { ...markdown, ...runtime };

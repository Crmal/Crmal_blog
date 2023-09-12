const commitConvention = require('./commit-convention.js');

module.exports = {
  // extends: ['@commitlint/config-conventional'],
  rules: { 'type-enum': [2, 'always', commitConvention] },
};

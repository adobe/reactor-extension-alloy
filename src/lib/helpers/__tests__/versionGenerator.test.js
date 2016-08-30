'use strict';

var versionGenerator = require('../versionGenerator');

describe('version generator', function() {
  it('generates the correct version', function() {
    expect(versionGenerator('2016-07-01T06:10:34Z')).toBe('D671');
  });

  it('supports multiple version', function() {
    expect(versionGenerator('2016-07-01T18:18:34Z')).toBe('D6V1');
  });

  it('throws an error when invalid date is provided', function() {
    expect(function() {
      versionGenerator('2016-x');
    }).toThrow();
  });
});

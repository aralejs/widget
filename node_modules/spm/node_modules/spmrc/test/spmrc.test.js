var fs = require('fs');
var should = require('should');
var spmrc = require('..');

describe('spmrc', function() {
  spmrc.spmrcfile = 'tmp/spmrc';

  it('get nothing', function() {
    spmrc.get().should.eql({});
  });

  it('get default values', function() {
    spmrc.get('install.path').should.equal('sea-modules');
  });

  it('set user.username = spm', function() {
    spmrc.set('user.username', 'spm');
  });

  it('get user.username', function() {
    spmrc.get('user.username').should.equal('spm');
  });

  it('get via config', function() {
    spmrc.config('user.username').should.equal('spm');
  });

  it('set via config', function() {
    spmrc.config('user.username', 'spmjs');
    spmrc.get('user.username').should.equal('spmjs');
  });

  it('set section:title.key', function() {
    spmrc.set('section:title.key', 'value');
    spmrc.get('section:title.key').should.equal('value');
    spmrc.get('section.title.key').should.equal('value');
  });

  it('set section.title.key', function() {
    spmrc.set('section.title.key', 'value2');
    spmrc.get('section:title.key').should.equal('value2');
    spmrc.get('section.title.key').should.equal('value2');
  });

  fs.unlink(spmrc.spmrcfile);
});

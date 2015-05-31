/*global describe, it, beforeEach */
'use strict';

var expect = require('chai').expect;
var exec = require('child_process').exec;

var KyotoTocoon = require('../index');

describe('kt-client', function() {
  describe('get test', function() {
    beforeEach(function(done) {
      exec('ktremotemgr clear', function () {
        done();
      });
    });

    it('data', function(done) {
      exec('ktremotemgr set test_key test_value', function () {
        var client = new KyotoTocoon();
        client.get('test_key', function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('utf-8 data', function(done) {
      exec('ktremotemgr set test_key test_value', function () {
        var client = new KyotoTocoon();
        var options = {
          encoding: 'utf8'
        };
        client.get('test_key', options, function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('binary data', function(done) {
      exec('ktremotemgr set test_key binary', function () {
        var client = new KyotoTocoon();
        var options = {
          encoding: 'binary'
        };
        client.get('test_key', options, function(error, value, expire) {
          expect(Buffer.isBuffer(value)).to.be.true;
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('data and expiration time', function(done) {
      exec('ktremotemgr set -xt 300 test_key test_value', function () {
        var client = new KyotoTocoon();
        client.get('test_key', function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.an.instanceof(Date);
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('no data', function(done) {
      var client = new KyotoTocoon();
      client.get('test_key', function(error, value, expire) {
        expect(value).to.be.undefined;
        expect(expire).to.be.undefined;
        expect(error).to.equal('No record was found');
        done();
      });
    });

    it('connection error', function(done) {
      var client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });
      client.get('test_key', function(error, value, expire) {
        expect(value).to.be.undefined;
        expect(expire).to.be.undefined;
        expect(error).to.equal('Connection error');
        done();
      });
    });
  });

  describe('set test', function() {
    beforeEach(function(done) {
      exec('ktremotemgr clear', function () {
        done();
      });
    });

    it('data', function(done) {
      var client = new KyotoTocoon();
      client.set('test_key', 'test_value', function(error) {
        expect(error).to.be.undefined;
        client.get('test_key', function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('utf-8 data', function(done) {
      var client = new KyotoTocoon();
      var options = {
        encoding: 'utf8'
      };
      client.set('test_key', 'test_value', options, function(error) {
        expect(error).to.be.undefined;
        client.get('test_key', options, function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('binary data', function(done) {
      var client = new KyotoTocoon();
      var testValue = new Buffer('test_value');
      var options = {
        encoding: 'binary'
      };
      client.set('test_key', testValue, options, function(error) {
        expect(error).to.be.undefined;
        client.get('test_key', options, function(error, value, expire) {
          expect(value).to.equal(testValue);
          expect(expire).to.be.null;
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('data and expiration time', function(done) {
      var client = new KyotoTocoon();
      var options = {
        expire: 300
      };
      client.set('test_key', 'test_value', options, function(error) {
        expect(error).to.be.undefined;
        client.get('test_key', function(error, value, expire) {
          expect(value).to.equal('test_value');
          expect(expire).to.be.an.instanceof(Date);
          expect(error).to.be.undefined;
          done();
        });
      });
    });

    it('connection error', function(done) {
      var client = new KyotoTocoon({
        host: 'localhost',
        port: 9999
      });
      client.set('test_key', 'test_value', function(error) {
        expect(error).to.equal('Connection error');
        done();
      });
    });
  });
});

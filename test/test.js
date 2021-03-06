import 'babel-polyfill';

import assert from 'power-assert';
import KyotoTocoon from '../index';

async function clear(callback) {
  const client = new KyotoTocoon();

  await new Promise((resolve) => {
    client.clear({ db: 'red' }, resolve);
  });

  await new Promise((resolve) => {
    client.clear({ db: 'blue' }, resolve);
  });

  client.clear(callback);
}

describe('kt-client', () => {
  describe('get test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('utf-8 data', async () => {
      const client = new KyotoTocoon();
      const options = {
        encoding: 'utf8',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('binary data', async () => {
      const client = new KyotoTocoon();
      const testValue = Buffer.from('test_value');
      const options = {
        encoding: 'binary',
      };

      await new Promise((resolve) => {
        client.set('test_key', testValue, options, resolve);
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(Buffer.isBuffer(value));
          assert(value.toString() === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('data and expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no data', (done) => {
      const client = new KyotoTocoon();

      client.get('test_key', (error, value, expire) => {
        assert(typeof value === 'undefined');
        assert(typeof expire === 'undefined');
        assert(error === 'No record was found');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.get('test_key', (error, value, expire) => {
        assert(typeof value === 'undefined');
        assert(typeof expire === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('set test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('number', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 1, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === '1');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('utf-8 data', async () => {
      const client = new KyotoTocoon();
      const options = {
        encoding: 'utf8',
      };

      await new Promise((resolve) => {
        client.set('test_key', '京都', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === '京都');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('binary data', async () => {
      const client = new KyotoTocoon();
      const testValue = Buffer.from('test_value');
      const options = {
        encoding: 'binary',
      };

      await new Promise((resolve) => {
        client.set('test_key', testValue, options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value.toString() === testValue.toString());
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('object data', async () => {
      const client = new KyotoTocoon();
      const testValue = {
        key: 'test_value',
      };

      await new Promise((resolve) => {
        client.set('test_key', testValue, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert.deepEqual(JSON.parse(value), testValue);
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('data and expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.set('test_key', 'test_value', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('add test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.add('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('already exists', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'foo', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.add('test_key', 'test_value', (error) => {
          assert(error === 'Connection error');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(value === 'foo');
          resolve();
        });
      });
    });
  });

  describe('replace test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'foo', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.replace('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(value === 'test_value');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('not exists', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'foo', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.add('test_key', 'test_value', (error) => {
          assert(error === 'Connection error');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(value === 'foo');
          resolve();
        });
      });
    });
  });

  describe('remove test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(value === 'test_value');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.remove('test_key', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(typeof value === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', options, (error, value) => {
          assert(value === 'test_value');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.remove('test_key', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value) => {
          assert(typeof value === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('not exists', (done) => {
      const client = new KyotoTocoon();

      client.remove('test_key', (error) => {
        assert(error === 'No record was found');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.remove('test_key', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('void test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('success', (done) => {
      const client = new KyotoTocoon();

      client.void((error) => {
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.void((error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('echo test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('success', (done) => {
      const client = new KyotoTocoon();

      client.echo({ foo: 'bar' }, (error, ret) => {
        assert(typeof ret.foo !== 'undefined');
        assert(ret.foo === 'bar');
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.echo({ foo: 'bar' }, (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('report test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('success', (done) => {
      const client = new KyotoTocoon();

      client.report((error, data) => {
        assert(typeof data === 'object');
        assert(Object.prototype.hasOwnProperty.call(data, 'conf_os_name'));
        assert(data.conf_os_name === 'Linux');
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.report((error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('status test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('status', (done) => {
      const client = new KyotoTocoon();

      client.status((error, data) => {
        assert(typeof data === 'object');
        assert(Object.keys(data).length > 0);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('specify DB', (done) => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      client.status(options, (error, data) => {
        assert(typeof data === 'object');
        assert(Object.keys(data).length > 0);
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('no such DB', (done) => {
      const client = new KyotoTocoon();
      const options = {
        db: 'green',
      };

      client.status(options, (error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Bad request');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.status((error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('clear test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('clear', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(value === 'test_value');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.clear((error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value) => {
          assert(typeof value === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', options, (error, value) => {
          assert(value === 'test_value');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.clear(options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value) => {
          assert(typeof value === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.clear((error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('append test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('append', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.append('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.append('test_key', 'test_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_valuetest_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.append('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.append('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'test_valuetest_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.append('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.append('test_key', 'test_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'test_valuetest_value');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.append('test_key', 'test_value', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('increment test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('increment', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.increment('test_key', 1, (error, num) => {
          assert(num === 1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.increment('test_key', 1, (error, num) => {
          assert(num === 2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('with origin number', async () => {
      const client = new KyotoTocoon();
      const options = {
        orig: 10,
      };

      await new Promise((resolve) => {
        client.increment('test_key', 1, options, (error, num) => {
          assert(num === 11);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.increment('test_key', 1, options, (error, num) => {
          assert(num === 12);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.increment('test_key', 1, options, (error, num) => {
          assert(num === 1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.increment('test_key', 1, options, (error, num) => {
          assert(num === 2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.increment('test_key', 1, options, (error, num) => {
          assert(num === 1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value !== 'undefined');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.increment('test_key', 1, options, (error, num) => {
          assert(num === 2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value !== 'undefined');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.increment('test_key', 1, (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('incrementDouble test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('incrementDouble', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, (error, num) => {
          assert(num === 0.1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, (error, num) => {
          assert(num === 0.2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('with origin number', async () => {
      const client = new KyotoTocoon();
      const options = {
        orig: 10,
      };

      await new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, options, (error, num) => {
          assert(num === 10.1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, options, (error, num) => {
          assert(num === 10.2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, options, (error, num) => {
          assert(num === 0.1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, options, (error, num) => {
          assert(num === 0.2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, options, (error, num) => {
          assert(num === 0.1);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value !== 'undefined');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.incrementDouble('test_key', 0.1, options, (error, num) => {
          assert(num === 0.2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value !== 'undefined');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.incrementDouble('test_key', 0.1, (error, num) => {
        assert(typeof num === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('cas test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('swap', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.cas('test_key', 'test_value', 'new_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'new_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no old value', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.cas('test_key', undefined, 'new_value', (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'new_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no new value', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.cas('test_key', 'test_value', undefined, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(typeof value === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('difference', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.cas('test_key', 'difference_value', 'new_value', (error) => {
          assert(error === 'The old value assumption was failed');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      await new Promise((resolve) => {
        client.cas('test_key', 'test_value', 'new_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', options, (error, value, expire) => {
          assert(value === 'new_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('expiration time', async () => {
      const client = new KyotoTocoon();

      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      await new Promise((resolve) => {
        client.cas('test_key', 'test_value', 'new_value', options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, value, expire) => {
          assert(value === 'new_value');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.cas('test_key', 'test_value', 'new_value', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('check test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('check', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      return new Promise((resolve) => {
        client.check('test_key', (error, size, expire) => {
          assert(typeof size === 'number');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('and expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      return new Promise((resolve) => {
        client.check('test_key', (error, size, expire) => {
          assert(typeof size === 'number');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      return new Promise((resolve) => {
        client.check('test_key', options, (error, size, expire) => {
          assert(typeof size === 'number');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.check('test_key', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('seize test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('seize', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.seize('test_key', (error, data, expire) => {
          assert(data === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, data, expire) => {
          assert(typeof data === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('and expiration time', async () => {
      const client = new KyotoTocoon();
      const options = {
        expire: 300,
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      await new Promise((resolve) => {
        client.seize('test_key', options, (error, data, expire) => {
          assert(data === 'test_value');
          assert(expire instanceof Date);
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, data, expire) => {
          assert(typeof data === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key', 'test_value', options, resolve);
      });

      await new Promise((resolve) => {
        client.seize('test_key', options, (error, data, expire) => {
          assert(data === 'test_value');
          assert(typeof expire === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.get('test_key', (error, data, expire) => {
          assert(typeof data === 'undefined');
          assert(typeof expire === 'undefined');
          assert(error === 'No record was found');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.check('test_key', (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('setBulk test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('atomic', async () => {
      const client = new KyotoTocoon();
      const options = {
        atomic: true,
      };
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('utf-8 data', async () => {
      const client = new KyotoTocoon();
      const options = {
        encoding: 'utf8',
      };
      const testData = {
        test_key1: '京都',
        test_key2: '東京',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(ret.test_key1 === '京都');
          assert(ret.test_key2 === '東京');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('binary data', async () => {
      const client = new KyotoTocoon();
      const options = {
        encoding: 'binary',
      };
      const testData = {
        test_key1: Buffer.from([1, 2, 3]),
        test_key2: Buffer.from([4, 5, 6]),
      };

      await new Promise((resolve) => {
        client.setBulk(testData, options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(Buffer.isBuffer(ret.test_key1));
          assert(Buffer.isBuffer(ret.test_key2));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('object data', async () => {
      const client = new KyotoTocoon();
      const testData = {
        test_key1: { a: 'b' },
        test_key2: { c: 'd' },
      };

      await new Promise((resolve) => {
        client.setBulk(testData, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), (error, ret) => {
          assert.deepEqual(JSON.parse(ret.test_key1), testData.test_key1);
          assert.deepEqual(JSON.parse(ret.test_key2), testData.test_key2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      client.setBulk(testData, (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('removeBulk test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('data', async () => {
      const client = new KyotoTocoon();
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.getBulk(Object.keys(testData), (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.removeBulk(Object.keys(testData), (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), (error, ret) => {
          assert(typeof ret.test_key1 === 'undefined');
          assert(typeof ret.test_key2 === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, options, () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.removeBulk(Object.keys(testData), options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(typeof ret.test_key1 === 'undefined');
          assert(typeof ret.test_key2 === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('atomic', async () => {
      const client = new KyotoTocoon();
      const options = {
        atomic: true,
      };
      const testData = {
        test_key1: 'test_value1',
        test_key2: 'test_value2',
      };

      await new Promise((resolve) => {
        client.setBulk(testData, options, () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.removeBulk(Object.keys(testData), options, (error) => {
          assert(typeof error === 'undefined');
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.getBulk(Object.keys(testData), options, (error, ret) => {
          assert(typeof ret.test_key1 === 'undefined');
          assert(typeof ret.test_key2 === 'undefined');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('not exists', (done) => {
      const client = new KyotoTocoon();

      client.removeBulk(['test_key1', 'test_key2'], (error) => {
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.removeBulk(['test_key1', 'test_key2'], (error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('getBulk test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('getBulk', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value1', resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value2', resolve);
      });

      return new Promise((resolve) => {
        client.getBulk(['test_key1', 'test_key2'], (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('specify DB', async () => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value1', options, resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value2', options, resolve);
      });

      return new Promise((resolve) => {
        client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('atomic', async () => {
      const client = new KyotoTocoon();
      const options = {
        atomic: true,
      };

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value1', options, resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value2', options, resolve);
      });

      return new Promise((resolve) => {
        client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
          assert(ret.test_key1 === 'test_value1');
          assert(ret.test_key2 === 'test_value2');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('utf-8 data', async () => {
      const client = new KyotoTocoon();
      const options = {
        encoding: 'utf8',
      };

      await new Promise((resolve) => {
        client.set('test_key1', '京都', options, resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', '東京', options, resolve);
      });


      return new Promise((resolve) => {
        client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
          assert(ret.test_key1 === '京都');
          assert(ret.test_key2 === '東京');
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('binary data', async () => {
      const client = new KyotoTocoon();
      const options = {
        encoding: 'binary',
      };

      await new Promise((resolve) => {
        client.set('test_key1', Buffer.from([1, 2, 3]), options, resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', Buffer.from([4, 5, 6]), options, resolve);
      });

      return new Promise((resolve) => {
        client.getBulk(['test_key1', 'test_key2'], options, (error, ret) => {
          assert(Buffer.isBuffer(ret.test_key1));
          assert(Buffer.isBuffer(ret.test_key2));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no data', (done) => {
      const client = new KyotoTocoon();

      client.getBulk(['test_key'], (error, ret) => {
        assert(typeof ret.test_key === 'undefined');
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.getBulk(['test_key'], (error, ret) => {
        assert(typeof ret === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('vacuum test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('vacuum', (done) => {
      const client = new KyotoTocoon();

      client.vacuum((error) => {
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('specify DB', (done) => {
      const client = new KyotoTocoon();
      const options = {
        db: 'blue',
      };

      client.vacuum(options, (error) => {
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('step option', (done) => {
      const client = new KyotoTocoon();
      const options = {
        step: 10,
      };

      client.vacuum(options, (error) => {
        assert(typeof error === 'undefined');
        done();
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.vacuum((error) => {
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('matchPrefix test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('match', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.set('foo', 'test_value', resolve);
      });

      return new Promise((resolve) => {
        client.matchPrefix('test', (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(data.includes('test_key1'));
          assert(data.includes('test_key2'));
          assert(!data.includes('foo'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match DB option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', { db: 'blue' }, resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', { db: 'red' }, resolve);
      });

      return new Promise((resolve) => {
        client.matchPrefix('test', { db: 'blue' }, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 1);
          assert(data.includes('test_key1'));
          assert(!data.includes('test_key2'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match max option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key3', 'test_value', resolve);
      });

      const options = {
        max: 2,
      };

      return new Promise((resolve) => {
        client.matchPrefix('test', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no match', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', resolve);
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', resolve);
      });

      return new Promise((resolve) => {
        client.matchPrefix('foo', (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 0);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.matchPrefix('test', (error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('matchRegex test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('match', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('foo', 'test_value', () => {
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.matchRegex('^test_key[0-9]', (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(data.includes('test_key1'));
          assert(data.includes('test_key2'));
          assert(!data.includes('foo'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match DB option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        const options = {
          db: 'blue',
        };
        client.set('test_key1', 'test_value', options, () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        const options = {
          db: 'red',
        };
        client.set('test_key2', 'test_value', options, () => {
          resolve();
        });
      });

      const options = {
        db: 'blue',
      };

      return new Promise((resolve) => {
        client.matchRegex('^test_key[0-9]', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 1);
          assert(data.includes('test_key1'));
          assert(!data.includes('test_key2'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match max option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key3', 'test_value', () => {
          resolve();
        });
      });

      const options = {
        max: 2,
      };

      return new Promise((resolve) => {
        client.matchRegex('^test_key[0-9]', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no match', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.matchRegex('foo', (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 0);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.matchRegex('test', (error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });

  describe('matchSimilar test', () => {
    beforeEach((done) => {
      clear(done);
    });

    it('match', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('foo', 'test_value', () => {
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.matchSimilar('test_key1', (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(data.includes('test_key1'));
          assert(data.includes('test_key2'));
          assert(!data.includes('foo'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match DB option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        const options = {
          db: 'blue',
        };
        client.set('test_key1', 'test_value', options, () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        const options = {
          db: 'red',
        };
        client.set('test_key2', 'test_value', options, () => {
          resolve();
        });
      });

      const options = {
        db: 'blue',
      };
      return new Promise((resolve) => {
        client.matchSimilar('test_key1', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 1);
          assert(data.includes('test_key1'));
          assert(!data.includes('test_key2'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match range option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('foo', 'test_value', () => {
          resolve();
        });
      });

      const options = {
        range: 10,
      };

      return new Promise((resolve) => {
        client.matchSimilar('test_key1', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 3);
          assert(data.includes('test_key1'));
          assert(data.includes('test_key2'));
          assert(data.includes('foo'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match utf option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('京都', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('京芋', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('foo', 'test_value', () => {
          resolve();
        });
      });

      const options = {
        utf: true,
      };

      return new Promise((resolve) => {
        client.matchSimilar('京都', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(data.includes('京都'));
          assert(data.includes('京芋'));
          assert(!data.includes('foo'));
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('match max option', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key3', 'test_value', () => {
          resolve();
        });
      });

      const options = {
        max: 2,
      };

      return new Promise((resolve) => {
        client.matchSimilar('test_key1', options, (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 2);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('no match', async () => {
      const client = new KyotoTocoon();

      await new Promise((resolve) => {
        client.set('test_key1', 'test_value', () => {
          resolve();
        });
      });

      await new Promise((resolve) => {
        client.set('test_key2', 'test_value', () => {
          resolve();
        });
      });

      return new Promise((resolve) => {
        client.matchSimilar('foo', (error, data) => {
          assert(data instanceof Array);
          assert(data.length === 0);
          assert(typeof error === 'undefined');
          resolve();
        });
      });
    });

    it('connection error', (done) => {
      const client = new KyotoTocoon({
        host: 'localhost',
        port: 9999,
      });

      client.matchSimilar('test', (error, data) => {
        assert(typeof data === 'undefined');
        assert(error === 'Connection error');
        done();
      });
    });
  });
});

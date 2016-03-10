jest.dontMock('../index');
const memoize = require('../index').default;

describe('memoize', () => {
  it('memoizes when no arguments are passed', () => {
    let i = 0;
    function fn() {
      i += 1;
      return i;
    }
    const memoizedFn = memoize(fn);
    expect(i).toBe(0);
    expect(memoizedFn()).toBe(1);
    expect(i).toBe(1);
    expect(memoizedFn()).toBe(1);
  });

  it('memoizes when one argument is passed', () => {
    let i = 0;
    function fn(foo) {
      i += 1;
      return {
        arg: foo,
        i,
      };
    }
    const memoizedFn = memoize(fn);
    expect(i).toBe(0);
    expect(memoizedFn()).toEqual({ arg: undefined, i: 1 });
    expect(i).toBe(1);
    expect(memoizedFn()).toEqual({ arg: undefined, i: 1 });
    expect(i).toBe(1);
    expect(memoizedFn('foo')).toEqual({ arg: 'foo', i: 2 });
    expect(i).toBe(2);
    expect(memoizedFn('foo')).toEqual({ arg: 'foo', i: 2 });
    expect(i).toBe(2);
  });

  it('memoizes when three arguments are passed', () => {
    let i = 0;
    function fn(foo, bar, baz) {
      i += 1;
      return {
        args: [foo, bar, baz],
        i,
      };
    }
    const memoizedFn = memoize(fn);
    expect(i).toBe(0);
    expect(memoizedFn()).toEqual({ args: [undefined, undefined, undefined], i: 1 });
    expect(i).toBe(1);
    expect(memoizedFn()).toEqual({ args: [undefined, undefined, undefined], i: 1 });
    expect(i).toBe(1);
    expect(memoizedFn('foo', 'bar', 'baz')).toEqual({ args: ['foo', 'bar', 'baz'], i: 2 });
    expect(i).toBe(2);
    expect(memoizedFn('foo', 'bar', 'baz')).toEqual({ args: ['foo', 'bar', 'baz'], i: 2 });
    expect(i).toBe(2);
    expect(memoizedFn('foo', 'qux', 'baz')).toEqual({ args: ['foo', 'qux', 'baz'], i: 3 });
    expect(i).toBe(3);
  });

  it('memoizes when three object arguments are passed', () => {
    let i = 0;
    function fn(foo, bar, baz) {
      i += 1;
      return {
        args: [foo, bar, baz],
        i,
      };
    }
    const memoizedFn = memoize(fn);
    expect(i).toBe(0);
    expect(memoizedFn()).toEqual({ args: [undefined, undefined, undefined], i: 1 });
    expect(i).toBe(1);
    expect(memoizedFn()).toEqual({ args: [undefined, undefined, undefined], i: 1 });
    expect(i).toBe(1);
    const args = [{ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' }];
    expect(
      memoizedFn(...args)
    ).toEqual(
      { args: [{ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' }], i: 2 }
    );
    expect(i).toBe(2);
    expect(
      memoizedFn(...args)
    ).toEqual(
      { args: [{ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' }], i: 2 }
    );
    expect(i).toBe(2);
  });

  it('does not memoize when non-identical arguments are passed', () => {
    let i = 0;
    function fn(foo, bar, baz) {
      i += 1;
      return {
        args: [foo, bar, baz],
        i,
      };
    }
    const memoizedFn = memoize(fn);
    expect(i).toBe(0);
    expect(memoizedFn()).toEqual({ args: [undefined, undefined, undefined], i: 1 });
    expect(i).toBe(1);
    expect(memoizedFn()).toEqual({ args: [undefined, undefined, undefined], i: 1 });
    expect(i).toBe(1);
    expect(
      memoizedFn({ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' })
    ).toEqual(
      { args: [{ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' }], i: 2 }
    );
    expect(i).toBe(2);
    expect(
      memoizedFn({ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' })
    ).toEqual(
      { args: [{ foo: 'oof' }, { bar: 'rab' }, { baz: 'zab' }], i: 3 }
    );
    expect(i).toBe(3);
  });

  it('memoizes by the first N arguments when the arity option is passed', () => {
    let i = 0;
    function fn(foo, bar, baz) {
      i += 1;
      return {
        args: [foo, bar, baz],
        i,
      };
    }
    const memoizedFn = memoize(fn, { arity: 2 });
    expect(memoizedFn('foo', 'bar', 'baz')).toEqual({ args: ['foo', 'bar', 'baz'], i: 1 });
    expect(memoizedFn('foo', 'bar', 'qux')).toEqual({ args: ['foo', 'bar', 'baz'], i: 1 });
  });

  it('memoizes the initial return value when and arity of 0 is passed', () => {
    let i = 0;
    function fn(foo, bar, baz) {
      i += 1;
      return {
        args: [foo, bar, baz],
        i,
      };
    }
    const memoizedFn = memoize(fn, { arity: 0 });
    expect(memoizedFn('foo', 'bar', 'baz')).toEqual({ args: ['foo', 'bar', 'baz'], i: 1 });
    expect(memoizedFn('qux')).toEqual({ args: ['foo', 'bar', 'baz'], i: 1 });
  });

  pit('memoizes node-style async functions', async () => {
    let i = 0;
    function fn(foo, bar, callback) {
      i += 1;
      setImmediate(() => {
        callback(null, {
          args: [foo, bar],
          i,
        });
      });
    }
    const memoizedFn = memoize(fn, { async: true });
    await new Promise((resolve) => {
      memoizedFn('foo', 'bar', (error, result) => {
        expect(result).toEqual({ args: ['foo', 'bar'], i: 1 });
        resolve();
      });
    });
    await new Promise((resolve) => {
      let sync = true;
      memoizedFn('foo', 'bar', (error, result) => {
        expect(result).toEqual({ args: ['foo', 'bar'], i: 1 });
        expect(sync).toBe(false);
        resolve();
      });
      sync = false;
    });
  });

  pit('calls the callback immediately when using async: \'immediate\'', async () => {
    let i = 0;
    function fn(foo, bar, callback) {
      i += 1;
      setImmediate(() => {
        callback(null, {
          args: [foo, bar],
          i,
        });
      });
    }
    const memoizedFn = memoize(fn, { async: 'immediate' });
    await new Promise((resolve) => {
      memoizedFn('foo', 'bar', (error, result) => {
        expect(result).toEqual({ args: ['foo', 'bar'], i: 1 });
        resolve();
      });
    });
    await new Promise((resolve) => {
      let sync = true;
      memoizedFn('foo', 'bar', (error, result) => {
        expect(result).toEqual({ args: ['foo', 'bar'], i: 1 });
        expect(sync).toBe(true);
        resolve();
      });
      sync = false;
    });
  });
});

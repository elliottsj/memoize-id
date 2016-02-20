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
});

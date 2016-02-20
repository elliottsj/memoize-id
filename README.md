# memoize-id [![npm][npm-badge]][npm] [![Build Status][travis-badge]][travis]
Memoize a function by the identity of its arguments, using [ES2015 Map][Map].

### Installation
```shell
npm install memoize-id
```

_Note: ES2015 [Symbol][] and [Map][] must be available where memoize-id is used. Refer to [ECMAScript 6 compatibility table](https://kangax.github.io/compat-table/es6/)._

### Usage
```js
import memoize from 'memoize-id';
// or:
// const memoize = require('memoize-id').default;

let i = 0;
function fn(foo, bar, baz) {
  i += 1;
  return {
    args: [foo, bar, baz],
    i,
  };
}
const memoizedFn = memoize(fn);

console.log(i);
// 0
const v1 = memoizedFn('foo', 'bar', 'baz');
console.log(v1);
// { args: ['foo', 'bar', 'baz'], i: 1 }
console.log(i);
// 1
const v2 = memoizedFn('foo', 'bar', 'baz');
console.log(v2);
// { args: ['foo', 'bar', 'baz'], i: 1 }
console.log(v1 === v2);
// true
console.log(i);
// 1
const v3 = memoizedFn('foo', 'qux', 'baz');
console.log(v3);
// { args: ['foo', 'qux', 'baz'], i: 2 }
console.log(i);
// 2
console.log(v1 == v3);
// false
```

[Map]: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[Symbol]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol
[npm]: https://www.npmjs.com/package/memoize-id
[npm-badge]: https://img.shields.io/npm/v/memoize-id.svg
[travis]: https://travis-ci.org/elliottsj/memoize-id
[travis-badge]: https://travis-ci.org/elliottsj/memoize-id.svg?branch=master

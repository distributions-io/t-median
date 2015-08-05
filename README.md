Median
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Student t](https://en.wikipedia.org/wiki/Student_t_distribution) distribution [median](https://en.wikipedia.org/wiki/median).

The [median](https://en.wikipedia.org/wiki/median) for a [Student t](https://en.wikipedia.org/wiki/Student_t_distribution) random variable is

<div class="equation" align="center" data-raw-text="\operatorname{median}\left( X \right) = 0" data-equation="eq:median">
	<img src="https://cdn.rawgit.com/distributions-io/t-median/abaeadaf62e9cb782352fb1804b5622eaf9506e9/docs/img/eqn.svg" alt="Median for a Student t distribution.">
	<br>
</div>

where `v > 0` is the degrees of freedom.


## Installation

``` bash
$ npm install distributions-t-median
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var median = require( 'distributions-t-median' );
```

#### median( v[, opts] )

Computes the [median](https://en.wikipedia.org/wiki/median) for a [Student t](https://en.wikipedia.org/wiki/Student t_distribution) distribution with parameter `v`. `v` may be either a [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), or a [`matrix`](https://github.com/dstructs/matrix).

``` javascript
var matrix = require( 'dstructs-matrix' ),
	data,
	mat,
	out,
	i;

out = median( 2 );
// returns 0

v = [ 2, 4, 8, 16 ];
out = median( v );

// returns [ 0, 0, 0, 0 ]

v = new Float32Array( v );
out = median( v );
// returns Float64Array( [0,0,0,0] )

v =  matrix( [ 2, 4, 8, 16 ], [2,2] );
/*
	[ 2 4,
	  8 16 ]
*/

out = median( v );
/*
	[ 0 0,
	  0 0 ]
*/
```

The function accepts the following `options`:

* 	__accessor__: accessor `function` for accessing `array` values.
* 	__dtype__: output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix) data type. Default: `float64`.
*	__copy__: `boolean` indicating if the `function` should return a new data structure. Default: `true`.
*	__path__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path.
*	__sep__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path separator. Default: `'.'`.

For non-numeric `arrays`, provide an accessor `function` for accessing `array` values.

``` javascript
var v = [
	[0,2],
	[1,4],
	[2,8],
	[3,16]
];

function getValue( d, i ) {
	return d[ 1 ];
}

var out = median( v, {
	'accessor': getValue
});
// returns [ 0, 0, 0, 0 ]
```

To [deepset](https://github.com/kgryte/utils-deep-set) an object `array`, provide a key path and, optionally, a key path separator.

``` javascript
var v = [
	{'x':[9,2]},
	{'x':[9,4]},
	{'x':[9,8]},
	{'x':[9,16]}
];

var out = median( v, 'x|1', '|' );
/*
	[
		{'x':[9,0]},
		{'x':[9,0]},
		{'x':[9,0]},
		{'x':[9,0]},
	]
*/

var bool = ( data === out );
// returns true
```

By default, when provided a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix), the output data structure is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`matrix`](https://github.com/dstructs/matrix) for a list of acceptable data types).

``` javascript
var v, out;

v = new Float64Array( [ 2,4,8,16 ] );

out = median( v, {
	'dtype': 'int32'
});
// returns Int32Array( [ 0,0,0,0 ] )

// Works for plain arrays, as well...
out = median( [2,4,8,16], {
	'dtype': 'int32'
});
// returns Int32Array( [ 0,0,0,0 ] )
```

By default, the function returns a new data structure. To mutate the input data structure (e.g., when input values can be discarded or when optimizing memory usage), set the `copy` option to `false`.

``` javascript
var v,
	bool,
	mat,
	out,
	i;

v = [ 2, 4, 8, 16 ];

out = median( v, {
	'copy': false
});
// returns [ 0, 0, 0, 0 ]

bool = ( data === out );
// returns true

mat = matrix( [ 2, 4, 8, 16 ], [2,2] );
/*
	[ 2 4,
	  8 16 ]
*/

out = median( mat, {
	'copy': false
});
/*
	[ 0 0,
	  0 0 ]
*/

bool = ( mat === out );
// returns true
```


## Notes

*	If an element is __not__ a positive number, the [median](https://en.wikipedia.org/wiki/median) is `NaN`.

	``` javascript
	var v, out;

	out = median( -1 );
	// returns NaN

	out = median( 0 );
	// returns NaN

	out = median( null );
	// returns NaN

	out = median( true );
	// returns NaN

	out = median( {'a':'b'} );
	// returns NaN

	out = median( [ true, null, [] ] );
	// returns [ NaN, NaN, NaN ]

	function getValue( d, i ) {
		return d.x;
	}
	v = [
		{'x':true},
		{'x':[]},
		{'x':{}},
		{'x':null}
	];

	out = median( v, {
		'accessor': getValue
	});
	// returns [ NaN, NaN, NaN, NaN ]

	out = median( v, {
		'path': 'x'
	});
	/*
		[
			{'x':NaN},
			{'x':NaN},
			{'x':NaN,
			{'x':NaN}
		]
	*/
	```

*	Be careful when providing a data structure which contains non-numeric elements and specifying an `integer` output data type, as `NaN` values are cast to `0`.

	``` javascript
	var out = median( [ true, null, [] ], {
		'dtype': 'int8'
	});
	// returns Int8Array( [0,0,0] );
	```


## Examples

``` javascript
var matrix = require( 'dstructs-matrix' ),
	median = require( 'distributions-t-median' );

var v,
	mat,
	out,
	tmp,
	i;

// Plain arrays...
v = new Array( 10 );
for ( i = 0; i < v.length; i++ ) {
	v[ i ] = i + 1;
}
out = median( v );

// Object arrays (accessors)...
function getValue( d ) {
	return d.x;
}
for ( i = 0; i < v.length; i++ ) {
	v[ i ] = {
		'x': v[ i ]
	};
}
out = median( v, {
	'accessor': getValue
});

// Deep set arrays...
for ( i = 0; i < v.length; i++ ) {
	v[ i ] = {
		'x': [ i, v[ i ].x ]
	};
}
out = median( v, {
	'path': 'x/1',
	'sep': '/'
});

// Typed arrays...
v = new Float64Array( 10 );
for ( i = 0; i < v.length; i++ ) {
	v[ i ] = i + 1;
}
out = median( v );

// Matrices...
mat = matrix( v, [5,2], 'float64' );
out = median( mat );

// Matrices (custom output data type)...
out = median( mat, {
	'dtype': 'uint8'
});
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/distributions-t-median.svg
[npm-url]: https://npmjs.org/package/distributions-t-median

[travis-image]: http://img.shields.io/travis/distributions-io/t-median/master.svg
[travis-url]: https://travis-ci.org/distributions-io/t-median

[codecov-image]: https://img.shields.io/codecov/c/github/distributions-io/t-median/master.svg
[codecov-url]: https://codecov.io/github/distributions-io/t-median?branch=master

[dependencies-image]: http://img.shields.io/david/distributions-io/t-median.svg
[dependencies-url]: https://david-dm.org/distributions-io/t-median

[dev-dependencies-image]: http://img.shields.io/david/dev/distributions-io/t-median.svg
[dev-dependencies-url]: https://david-dm.org/dev/distributions-io/t-median

[github-issues-image]: http://img.shields.io/github/issues/distributions-io/t-median.svg
[github-issues-url]: https://github.com/distributions-io/t-median/issues

/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	median = require( './../lib' ),

	// Function to apply element-wise
	MEDIAN = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-median', function tests() {

	it( 'should export a function', function test() {
		expect( median ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				median( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				median( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				median( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				median( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( median( values[ i ] ) ) );
		}
	});

	it( 'should compute the distribution median when provided a number', function test() {
		assert.closeTo( median( 2 ), 0, 1e-5 );
		assert.closeTo( median( 4  ), 0, 1e-5 );
		assert.closeTo( median( 8  ), 0, 1e-5 );
		assert.closeTo( median( 16  ), 0, 1e-5 );
	});

	it( 'should compute the distribution median when provided a plain array', function test() {
		var v, actual, expected;

		v = [ 2, 4, 8, 16 ];
		expected = [ 0, 0, 0, 0 ];

		actual = median( v );
		assert.notEqual( actual, v );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate...
		actual = median( v, {
			'copy': false
		});
		assert.strictEqual( actual, v );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution median when provided a typed array', function test() {
		var v, actual, expected;

		v = new Float64Array ( [ 2,4,8,16 ] );
		expected = new Float64Array( [ 0,0,0,0 ] );

		actual = median( v );
		assert.notEqual( actual, v );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = median( v, {
			'copy': false
		});
		expected = new Float64Array( [ 0,0,0,0 ] );
		assert.strictEqual( actual, v );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution median and return an array of a specific type', function test() {
		var v, actual, expected;

		v = [ 2, 4, 8, 16 ];
		expected = new Int32Array( [ 0,0,0,0 ] );

		actual = median( v, {
			'dtype': 'int32'
		});
		assert.notEqual( actual, v );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 4 );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution median using an accessor', function test() {
		var v, actual, expected;

		v = [
			{'v':2},
			{'v':4},
			{'v':8},
			{'v':16}
		];
		expected = [ 0, 0, 0, 0 ];

		actual = median( v, {
			'accessor': getValue
		});
		assert.notEqual( actual, v );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = median( v, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, v );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		function getValue( d ) {
			return d.v;
		}
	});

	it( 'should compute an element-wise distribution median and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[9,2]},
			{'x':[9,4]},
			{'x':[9,8]},
			{'x':[9,16]}
		];

		expected = [
			{'x':[9,0]},
			{'x':[9,0]},
			{'x':[9,0]},
			{'x':[9,0]}
		];

		actual = median( data, {
			'path': 'x.1'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Specify a path with a custom separator...
		data = [
			{'x':[9,2]},
			{'x':[9,4]},
			{'x':[9,8]},
			{'x':[9,16]}
		];

		actual = median( data, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute an element-wise distribution median when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float64Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i / 10;
			d2[ i ] = MEDIAN( i / 10 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = median( mat );

		assert.deepEqual( out.data, d2 );

		// Mutate...
		out = median( mat, {
			'copy': false
		});
		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d2 );
	});

	it( 'should compute an element-wise distribution median and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float32Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = MEDIAN( i + 1 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = median( mat, {
			'dtype': 'float32'
		});

		assert.strictEqual( out.dtype, 'float32' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( median( [] ), [] );
		assert.deepEqual( median( matrix( [0,0] ) ).data, new Float64Array() );
		assert.deepEqual( median( new Int8Array() ), new Float64Array() );
	});

});

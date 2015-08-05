/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	median = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'number median', function tests() {

	it( 'should export a function', function test() {
		expect( median ).to.be.a( 'function' );
	});

	it( 'should compute the distribution median', function test() {
		assert.closeTo( median( 2 ), 0, 1e-5 );
		assert.closeTo( median( 4  ), 0, 1e-5 );
		assert.closeTo( median( 8  ), 0, 1e-5 );
		assert.closeTo( median( 16  ), 0, 1e-5 );
	});

	it( 'should return `NaN` for invalid values of parameter v', function test() {
		assert.isTrue( isnan( median( -1 ) ) );
	});

});

'use strict';

// MODULES //

var isPositive = require( 'validate.io-positive-primitive' );


// MEDIAN //

/**
* FUNCTION median( v )
*	Computes the distribution median for a Student t distribution with parameter v.
*
* @param {Number} v - degrees of freedom
* @returns {Number} distribution median
*/
function median( v ) {
	if ( !isPositive( v ) ) {
		return NaN;
	}
	return 0;
} // end FUNCTION median()


// EXPORTS

module.exports =  median;

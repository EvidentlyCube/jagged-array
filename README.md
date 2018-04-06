# jagged-array

A set of functions to work with jagged arrays (arrays of arrays) in Javascript with any number of dimensions

## Installation

Run `npm install jagged-array`

## API

### `countDimensions`
Counts the number of dimensions the array contains.

 * **Argument** `array: any|any[]` Array to check
 * **Returns** `number` An optional implementation of multimatch to inject into this class, if null or not defined will use the default multimatch.

### `hasJaggedEdges`
Checks if the given array has jagged edges, that is if any of the dimension has variation in its length.

 * **Argument** `array: any|any[]` Array to check
 * **Returns** `boolean` True if jagged edges are found. Returns false for non-arrays.
 
 
### `getMaxLengths`
Get largest edge for each dimension.

 * **Argument** `array: any|any[]` Array to check
 * **Returns** `number[]` An array of lengths for each dimension. It takes the biggest length of any array in the given dimension

 
### `containsValue`
Checks if the given array (or array of arrays) contains specific value. Warning: it won't be able to detect NaN!

 * **Argument** `haystack: any[]|any` Array which is searched through
 * **Argument** `needle: any` Value to find
 * **Argument** `useStrictComparison: boolean = true` Whether to use strict comparison or not
 * **Returns** `boolean` Whether the value was found or not

### `countValue`
Counts how many times given value appears in the array (or array of arrays). Warning: it won't detect NaN!

 * **Argument** `haystack: any[]|any` Array which is searched through
 * **Argument** `needle: any` Value to count
 * **Argument** `useStrictComparison: boolean = true` Whether to use strict comparison or not
 * **Returns** `boolean` Number of times the value was found
 
 
### `getUniqueValues`
Returns an array of all the unique values in the given array (or array of arrays). Each instance of NaN is considered unique.

 * **Argument** `array: any | any[]` Array which is searched through
 * **Returns** `boolean` Values found, each value appears only once in the resulting array with the exception of NaN.

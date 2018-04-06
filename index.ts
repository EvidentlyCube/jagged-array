/**
 * Counts the number of dimensions the array contains.
 * @param {any | any[]} array Array to check
 * @returns {number} Number of dimensions of the given array, 0 if not an array is passed
 */
import find = require("lodash.find");

export function countDimensions(array: any | any[]): number {
    if (!Array.isArray(array)) {
        return 0;
    }

    return array.reduce((previousValue, currentValue) => {
        return Math.max(previousValue, 1 + countDimensions(currentValue));
    }, 1);
}

/**
 * Checks if the given array has jagged edges, that is if any of the dimension has variation in its length.
 * @param {any | any[]} array Array to check
 * @returns {boolean} True if jagged edges are found. Returns false for non-arrays.
 */
export function hasJaggedEdges(array: any | any[]): boolean {
    if (!Array.isArray(array)) {
        return false;
    }

    return checkArray(array, [], 0);

    function checkArray(arrayItem: any, lengths: number[], depth: number): boolean {
        const isArray = Array.isArray(arrayItem);

        if (lengths.length <= depth) {
            if (isArray) {
                lengths[depth] = arrayItem.length;
            } else {
                lengths[depth] = null;
                return false;
            }

        } else if (isArray && lengths[depth] !== arrayItem.length) {
            return true;
        } else if (!isArray) {
            return lengths[depth] !== null;
        }

        for (let item of arrayItem) {
            if (checkArray(item, lengths, depth + 1)) {
                return true;
            }
        }

        return false;
    }
}

/**
 * Get largest edge for each dimension.
 * @param {any | any[]} array Array to check
 * @returns {number[]} An array of lengths for each dimension. It takes the biggest length of any array in the given dimension
 */
export function getMaxLengths(array: any | any[]): number[] {
    if (!Array.isArray(array)) {
        return [];
    }

    const lengths: number[] = [];
    checkArray(array, lengths, 0);

    return lengths;

    function checkArray(arrayItem: any, lengths: number[], depth: number): void {
        if (!Array.isArray(arrayItem)) {
            return;
        }

        lengths[depth] = Math.max(
            arrayItem.length,
            depth < lengths.length ? lengths[depth] : 0
        );

        for (let item of arrayItem) {
            checkArray(item, lengths, depth + 1);
        }
    }
}

/**
 * Checks if the given array (or array of arrays) contains specific value. Warning: it won't be able to detect NaN!
 * @param {any[] | any} haystack Array which is searched through
 * @param {any} needle Value to find
 * @param {boolean} useStrictComparison Whether to use strict comparison or not
 * @returns {boolean} Whether the value was found or not
 */
export function containsValue(haystack: any[] | any, needle: any, useStrictComparison: boolean = true): boolean {
    if (!Array.isArray(haystack)) {
        return useStrictComparison ? haystack === needle : haystack == needle;
    }

    return find(haystack, x => containsValue(x, needle, useStrictComparison)) != null;
}

/**
 * Counts how many times given value appears in the array (or array of arrays). Warning: it won't detect NaN!
 * @param {any[] | any} haystack Array which is searched through
 * @param needle Value to count
 * @param {boolean} useStrictComparison Whether to use strict comparison or not
 * @returns {number} Number of times the value was found
 */
export function countValue(haystack: any | any[], needle: any, useStrictComparison: boolean = true): number {
    if (!Array.isArray(haystack)) {
        return (useStrictComparison ? haystack === needle : haystack == needle) ? 1 : 0;
    }

    return haystack.reduce((sum, checked) => sum + countValue(checked, needle, useStrictComparison), 0);
}

/**
 * Returns an array of all the unique values in the given array (or array of arrays). Each instance of NaN is considered
 * unique
 * @param {any | any[]} array Array which is searched through
 * @returns {any[]} Values found, each value appears only once in the resulting array with the exception of NaN.
 */
export function getUniqueValues(array: any | any[]): any[] {
    if (!Array.isArray(array)) {
        return [array];
    }

    return collectUniqueValues(array, []);

    function collectUniqueValues(itemToCheck: any | any[], collection: any[]): any[] {
        if (!Array.isArray(itemToCheck)) {
            if (collection.indexOf(itemToCheck) === -1) {
                collection.push(itemToCheck);
            }
        } else {
            itemToCheck.forEach((item: any) => collectUniqueValues(item, collection));
        }

        return collection;
    }
}


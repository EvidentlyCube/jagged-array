import {expect} from 'chai';
import 'mocha';
import {containsValue, countDimensions, countValue, getMaxLengths, getUniqueValues, hasJaggedEdges} from "./index";

describe("countDimensions", () => {
    it("Should return 0 for not arrays", () => {
        expect(countDimensions(null)).to.equal(0);
        expect(countDimensions(Number.NaN as any)).to.equal(0);
        expect(countDimensions(1 as any)).to.equal(0);
        expect(countDimensions("" as any)).to.equal(0);
        expect(countDimensions("string" as any)).to.equal(0);
        expect(countDimensions({} as any)).to.equal(0);
        expect(countDimensions(new Date() as any)).to.equal(0);
        expect(countDimensions(undefined)).to.equal(0);
    });

    it("Should return 1 for 1-dimensional arrays", () => {
        expect(countDimensions([])).to.equal(1);
        expect(countDimensions([1, 2, 3, 4])).to.equal(1);
        expect(countDimensions([null])).to.equal(1);
        expect(countDimensions([null, {}, new Date()])).to.equal(1);
    });

    it("Should return 2 for 2-dimensional arrays", () => {
        expect(countDimensions([[]])).to.equal(2);
        expect(countDimensions([[], []])).to.equal(2);
        expect(countDimensions([[], null])).to.equal(2);
        expect(countDimensions([null, [], 1, 2])).to.equal(2);
        expect(countDimensions([{key: []}, 1, 2, [], []])).to.equal(2);
    });

    it("Should return array dimensionality", () => {
        expect(countDimensions([
            [
                []
            ]
        ])).to.equal(3);
        expect(countDimensions([
            [],
            [
                []
            ]
        ])).to.equal(3);
        expect(countDimensions([
            [],
            [
                [
                    [], []
                ],
                []
            ],
            [[]]
        ])).to.equal(4);
    });
});

describe("hasJaggedEdges", () => {
    it("Should return false for non-arrays", () => {
        expect(hasJaggedEdges(null)).to.be.false;
        expect(hasJaggedEdges(Number.NaN as any)).to.be.false;
        expect(hasJaggedEdges(1 as any)).to.be.false;
        expect(hasJaggedEdges("" as any)).to.be.false;
        expect(hasJaggedEdges("string" as any)).to.be.false;
        expect(hasJaggedEdges({} as any)).to.be.false;
        expect(hasJaggedEdges(new Date() as any)).to.be.false;
        expect(hasJaggedEdges(undefined)).to.be.false;
    });
    it("Should return false for arrays where each dimensions has the same length for every value", () => {
        expect(hasJaggedEdges([])).to.equal(false, "Test #1");
        expect(hasJaggedEdges([[], []])).to.equal(false, "Test #2");
        expect(hasJaggedEdges([[], [], [], []])).to.equal(false, "Test #3");
        expect(hasJaggedEdges([[1, 2, 3], [1, 2, 3], [1, 2, 3]])).to.equal(false, "Test #4");
        expect(hasJaggedEdges([[1, 2, 3, 4, 5, 6]])).to.equal(false, "Test #5");
        expect(hasJaggedEdges([[[[],[]], [[],[]], [[],[]]], [[[],[]], [[],[]], [[],[]]]])).to.equal(false, "Test #6");
        expect(hasJaggedEdges([[[1, 2]]])).to.equal(false, "Test #7");
    });
    it("Should return true for arrays where dimensions have different values", () => {
        expect(hasJaggedEdges([[], [1]])).to.equal(true, "Test #1");
        expect(hasJaggedEdges([[1], [1, 2], [], []])).to.equal(true, "Test #2");
        expect(hasJaggedEdges([[1, 2, 3], [1, 2, 3], [1, 2]])).to.equal(true, "Test #3");
        expect(hasJaggedEdges([[1, 2, 3, 4, 5, 6], [[]]])).to.equal(true, "Test #4");
    });
});

describe("getMaxLengths", () => {
    it("Should return empty array for no array", () => {
        expect(getMaxLengths(null)).to.be.lengthOf(0);
        expect(getMaxLengths(Number.NaN as any)).to.be.lengthOf(0);
        expect(getMaxLengths(1 as any)).to.be.lengthOf(0);
        expect(getMaxLengths("" as any)).to.be.lengthOf(0);
        expect(getMaxLengths("string" as any)).to.be.lengthOf(0);
        expect(getMaxLengths({} as any)).to.be.lengthOf(0);
        expect(getMaxLengths(new Date() as any)).to.be.lengthOf(0);
        expect(getMaxLengths(undefined)).to.be.lengthOf(0);
    });
    it("Should return max length for given dimension (perfect jagged arrays)", () => {
        expect(getMaxLengths([])).to.deep.equal([0], "Test #1");
        expect(getMaxLengths([[], [], []])).to.deep.equal([3, 0], "Test #2");
        expect(getMaxLengths([[1, 2], [1, 2], [1, 2], [1, 2]])).to.deep.equal([4, 2], "Test #3");
        expect(getMaxLengths([[[1], [1], [1]], [[1], [1], [1]], [[1], [1], [1]], [[1], [1], [1]]])).to.deep.equal([4, 3, 1], "Test #4");
        expect(getMaxLengths([[[[], []], [[], []], [[], []]], [[[], []], [[], []], [[], []]], [[[], []], [[], []], [[], []]], [[[], []], [[], []], [[], []]]])).to.deep.equal([4, 3, 2, 0], "Test #5");
    });
    it("Should return max length for given dimension (imperfect jagged arrays)", () => {
        expect(getMaxLengths([[1, 2], [1], [1, 2, 3]])).to.deep.equal([3, 3], "Test #1");
        expect(getMaxLengths([[1, 2], [1, 2], [1, 2], [1, 2]])).to.deep.equal([4, 2], "Test #2");
        expect(getMaxLengths([
            [[1], [1], [1]],
            [[1], [1], [1]],
            [
                [1],
                [1],
                [1, 2, 3, 4, 5]
            ],
            [
                [
                    [
                        [1, 2]
                    ]
                ],
                [1],
                [1]
            ]
        ])).to.deep.equal([4, 3, 5, 1, 2], "Test #3");
    });
});

describe("containsValue", () => {
    it("Should return false when passed no array and value doesn't match", () => {
        expect(containsValue(null as any, 1), "Test #1").to.be.false;
        expect(containsValue(Number.NaN as any, null), "Test #2").to.be.false;
        expect(containsValue(1 as any, null), "Test #3").to.be.false;
        expect(containsValue("" as any, null), "Test #4").to.be.false;
        expect(containsValue("string" as any, null), "Test #5").to.be.false;
        expect(containsValue({} as any, null), "Test #6").to.be.false;
        expect(containsValue(new Date() as any, null), "Test #7").to.be.false;
        expect(containsValue(undefined, null), "Test #8").to.be.false;
    });
    it("Should return true when passed no array but value matches", () => {
        expect(containsValue(null as any, null), "Test #1").to.be.true;
        expect(containsValue(1 as any, 1), "Test #2").to.be.true;
        expect(containsValue("" as any, ""), "Test #3").to.be.true;
        expect(containsValue("string" as any, "string"), "Test #4").to.be.true;
    });
    it("Return true when array contains value (strict false)", () => {
        expect(containsValue([1, 2, 3], 1, false)).to.be.true;
        expect(containsValue([1, 2, 3], true, false)).to.be.true;
        expect(containsValue([[1, 2, 5, "asd", [2, 4]], 2, [3, [[[[], [], [], [0]]]]]], false, false)).to.be.true;
    });
    it("Return false when array does not value (strict false)", () => {
        expect(containsValue([7, 2, 3], 1, false)).to.be.false;
        expect(containsValue([3, 2, 3], null, false)).to.be.false;
        expect(containsValue([[1, 2, 5, "asd", [2, 4]], 2, [3, [[[[], [], [], [1]]]]]], false, false)).to.be.false;
    });
    it("Return true when array contains value (strict true)", () => {
        expect(containsValue([1, 2, 3], 1)).to.be.true;
    });
    it("Return false when array does not value (strict true)", () => {
        expect(containsValue([7, 2, 3], 1)).to.be.false;
        expect(containsValue([1, 2, 3], true)).to.be.false;
        expect(containsValue([[1, 2, 5, "asd", [2, 4]], 2, [3, [[[[], [], [], [0]]]]]], false)).to.be.false;
    });
});

describe("countValue", () => {
    it("Should return 0 when passed no array and value doesn't match", () => {
        expect(countValue(null as any, 1), "Test #1").to.equal(0);
        expect(countValue(Number.NaN as any, null), "Test #2").to.equal(0);
        expect(countValue(1 as any, null), "Test #3").to.equal(0);
        expect(countValue("" as any, null), "Test #4").to.equal(0);
        expect(countValue("string" as any, null), "Test #5").to.equal(0);
        expect(countValue({} as any, null), "Test #6").to.equal(0);
        expect(countValue(new Date() as any, null), "Test #7").to.equal(0);
        expect(countValue(undefined, null), "Test #8").to.equal(0);
    });
    it("Should return 1 when passed no array but value matches", () => {
        expect(countValue(null as any, null), "Test #1").to.equal(1);
        expect(countValue(1 as any, 1), "Test #2").to.equal(1);
        expect(countValue("" as any, ""), "Test #3").to.equal(1);
        expect(countValue("string" as any, "string"), "Test #4").to.equal(1);
    });
    it ("Should count occurrences (strict false)", () => {
        expect(countValue([1, 2, 3, 1, 4, false, true], true, false), "Test #1").to.equal(3);
        expect(countValue([1, 2, 3, 1, 4, false, true], 1, false), "Test #2").to.equal(3);
        expect(countValue([[1, 1], 2, 3, [1, 1, [4, 3, [1, false, true, true]]], 4, false, true], true, false), "Test #3").to.equal(8);
        expect(countValue([[1, 1], 2, 3, [1, 1, [4, 3, [1, false, true, true]]], 4, false, true], 1, false), "Test #4").to.equal(8);
    });
    it ("Should count occurrences (strict true)", () => {
        expect(countValue([1, 2, 3, 1, 4, false, true], true), "Test #1").to.equal(1);
        expect(countValue([1, 2, 3, 1, 4, false, true], 1), "Test #2").to.equal(2);
        expect(countValue([[1, 1], 2, 3, [1, 1, [4, 3, [1, false, true, true]]], 4, false, true], true), "Test #3").to.equal(3);
        expect(countValue([[1, 1], 2, 3, [1, 1, [4, 3, [1, false, true, true]]], 4, false, true], 1), "Test #4").to.equal(5);
    });
});

describe("getUniqueValues", () => {
   it("Should return itself array for non arrays", () => {
       const date = new Date();
       expect(getUniqueValues(null), "Test #1").to.deep.equal([null]);
       expect(getUniqueValues(Number.NaN as any), "Test #2").to.deep.equal([Number.NaN]);
       expect(getUniqueValues(1 as any), "Test #3").to.deep.equal([1]);
       expect(getUniqueValues("" as any), "Test #4").to.deep.equal([""]);
       expect(getUniqueValues("string" as any), "Test #5").to.deep.equal(["string"]);
       expect(getUniqueValues({} as any), "Test #6").to.deep.equal([{}]);
       expect(getUniqueValues(date as any), "Test #7").to.deep.equal([date]);
       expect(getUniqueValues(undefined), "Test #8").to.deep.equal([undefined]);
   });
   it("Should return all unique values", () => {
       expect(getUniqueValues([1, 2, 1, 3, 1]), "Test #1").to.have.same.members([1, 2, 3]);
       expect(getUniqueValues([[1, 2, 1, 3, 1], [7, 1, 3, 8, 2, [2, 1, 3, 9, [15]]]]), "Test #1").to.have.same.members([1, 2, 3, 7, 8, 9, 15]);
   });
});
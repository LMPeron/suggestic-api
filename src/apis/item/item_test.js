/**
 * @jest-environment node
 */
jest.setTimeout(60000);
global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

const ItemUtils = require("../../apis/item/item_utils");
const ItemController = require("../../apis/item/item_controller");

describe("ItemUtils", () => {
  describe("flattenItems", () => {
    test("empty input returns empty array", () => {
      const input = [];
      const expectedOutput = [];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with no nested arrays returns same array", () => {
      const input = [1, 2, 3, "hello", true];
      const expectedOutput = [1, 2, 3, "hello", true];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with single nested array is flattened", () => {
      const input = [1, [2, 3], "hello"];
      const expectedOutput = [1, 2, 3, "hello"];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with multiple nested arrays is flattened", () => {
      const input = [1, [2, [3, 4]], "hello", [[5]]];
      const expectedOutput = [1, 2, 3, 4, "hello", 5];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with deeply nested array is flattened", () => {
      const input = [1, [2, [3, [4, [5]]]], "hello"];
      const expectedOutput = [1, 2, 3, 4, 5, "hello"];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with non-array items only is returned as-is", () => {
      const input = [1, "hello", true];
      const expectedOutput = [1, "hello", true];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with objects in nested arrays is flattened", () => {
      const input = [{ a: [1, 2] }, { b: [{ c: [3] }, 4] }];
      const expectedOutput = [1, 2, 3, 4];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("input with functions in nested arrays is flattened", () => {
      const fn1 = () => {};
      const fn2 = () => {};
      const input = [1, [2, [fn1, 3], [4, fn2]]];
      const expectedOutput = [1, 2, fn1, 3, 4, fn2];
      const output = ItemUtils.flattenItems(input);
      expect(output).toEqual(expectedOutput);
    });

    test("flattens a nested array with empty arrays", () => {
      const input = [1, [2, [], [3, [], 4], [], 5], 6];
      const expected = [1, 2, 3, 4, 5, 6];
      expect(ItemUtils.flattenItems(input)).toEqual(expected);
    });

    test("flattens an array with objects", () => {
      const input = [
        { name: "John", age: 30 },
        [1, 2, { foo: "bar", baz: [3, { qux: "quux" }] }],
        { x: [4, 5], y: { z: 6 } },
      ];
      const expected = ["John", 30, 1, 2, "bar", 3, "quux", 4, 5, 6];
      expect(ItemUtils.flattenItems(input)).toEqual(expected);
    });
  });
});

describe("ItemController", () => {
  describe("flattenItems", () => {
    test("flattens a simple nested array", async () => {
      const req = {
        body: { items: [1, [2, [3], 4], 5] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [1, 2, 3, 4, 5] });
    });

    test("flattens an array with empty arrays", async () => {
      const req = {
        body: { items: [[], [1], [], [2, [3, []], 4], []] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [1, 2, 3, 4] });
    });

    test("flattens an array with objects and functions", async () => {
      const fn = () => {};
      const req = {
        body: { items: [1, { a: [2, fn] }, [3, { b: fn }, [4]]] },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [1, 2, fn, 3, fn, 4] });
    });

    test("Flattens an array with nested arrays and functions", async () => {
      const func1 = () => console.log("function 1");
      const func2 = () => console.log("function 2");
      const req = {
        body: {
          items: [{ a: [1, 2] }, { b: [{ c: [3, func1] }, 4, func2] }],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        result: [1, 2, 3, func1, 4, func2],
      });
    });

    test("Flattens an array with multiple nested arrays and empty nested arrays", async () => {
      const req = {
        body: {
          items: [
            [1, []],
            [2, [3, [], 4]],
            [5, [6, []]],
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [1, 2, 3, 4, 5, 6] });
    });

    test("Flattens an array with nested objects and nested arrays with one item", async () => {
      const req = {
        body: {
          items: [{ a: [1] }, { b: [2] }],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [1, 2] });
    });

    test("Flattens an array with nested objects and empty nested arrays", async () => {
      const req = {
        body: {
          items: [
            { a: [] },
            { b: [1, []] },
            { c: [2, [3, [], 4]] },
            { d: [5, [6, []]] },
          ],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [1, 2, 3, 4, 5, 6] });
    });

    test("Flattens an array with nested arrays of different depths", async () => {
      const req = {
        body: {
          items: [[1, [2, [3]]], [4], [5, [6, [7, [8, [9]]]]]],
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        result: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      });
    });

    test("returns an empty array when given an empty array", async () => {
      const req = { body: { items: [] } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [] });
    });

    test("returns an empty array when given a non-array item", async () => {
      const req = { body: { items: 123 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: [] });
    });

    test("returns 500 on error", async () => {
      const req = {
        body: { items: null },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      await ItemController.prototype.flattenItems(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Flatting Items failed.");
    });
  });
});

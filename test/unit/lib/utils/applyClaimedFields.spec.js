import applyClaimedFields from "../../../../src/view/utils/applyClaimedFields";

describe("applyClaimedFields", () => {
  it("sets a field", () => {
    expect(applyClaimedFields({ a: 1 }, { b: 2 }, ["b"])).toEqual({
      a: 1,
      b: 2
    });
  });
  it("sets multiple fields", () => {
    expect(applyClaimedFields({ a: 1 }, { b: 2, c: 3 }, ["b", "c"])).toEqual({
      a: 1,
      b: 2,
      c: 3
    });
  });
  it("unsets claimed fields", () => {
    expect(applyClaimedFields({ a: 1 }, { b: 2 }, ["a", "b"])).toEqual({
      b: 2
    });
  });
  it("set a field in a sub-object", () => {
    expect(
      applyClaimedFields({ sub: { a: 1 } }, { sub: { b: 2 } }, ["sub.b"])
    ).toEqual({ sub: { a: 1, b: 2 } });
  });
  it("doesn't do anything when no claimed fields", () => {
    expect(applyClaimedFields({ a: 1 }, { b: 2 }, [])).toEqual({ a: 1 });
  });
});

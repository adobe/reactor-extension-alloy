/* import createPropositionCache from "../../../src/lib/createPropositionCache.js";

fdescribe("createActivePropositions", () => {
  let activePropositions;
  beforeEach(() => {
    activePropositions = createActivePropositions();
  });

  it("works", () => {
    activePropositions.updateScopes(
      ["aaa", "bbb"],
      Promise.resolve([
        {
          id: "id1",
          scope: "aaa",
          scopeDetails: { a: 1 }
        },
        {
          id: "id2",
          scope: "aaa",
          scopeDetails: { a: 2 }
        },
        {
          id: "id3",
          scope: "bbb",
          scopeDetails: { b: 1 }
        }
      ])
    );
    return activePropositions
      .getPropositionsForScopes(["aaa", "bbb"])
      .then(propositions => {
        expect(propositions).toEqual([
          {
            id: "id1",
            scope: "aaa",
            scopeDetails: { a: 1 }
          },
          {
            id: "id2",
            scope: "aaa",
            scopeDetails: { a: 2 }
          },
          {
            id: "id3",
            scope: "bbb",
            scopeDetails: { b: 1 }
          }
        ]);
      });
  });
});
*/

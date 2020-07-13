import computePopulationAmount from "../computePopulationAmount";

export default ({
  treeNode,
  formStateNode,
  isAncestorUsingWholePopulationStrategy,
  doesHighestAncestorWithWholePopulationStrategyHaveAValue
}) => {
  treeNode.populationAmount = computePopulationAmount({
    formStateNode,
    isAncestorUsingWholePopulationStrategy,
    doesHighestAncestorWithWholePopulationStrategyHaveAValue
  });
};

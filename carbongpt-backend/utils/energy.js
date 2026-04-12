function estimateEnergy(inputTokens, outputTokens, modelType) {
  let modelSizeFactor = 1;

  if (modelType === "SLM") modelSizeFactor = 0.5;
  if (modelType === "LLM") modelSizeFactor = 1.5;

  const totalTokens = inputTokens + outputTokens;

  // improved formula
  return totalTokens * modelSizeFactor * 0.002;
}

module.exports = { estimateEnergy };
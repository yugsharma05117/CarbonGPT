function routeModel(tokens) {
  if (tokens < 20) return "SLM";
  return "LLM";
}

module.exports = { routeModel };
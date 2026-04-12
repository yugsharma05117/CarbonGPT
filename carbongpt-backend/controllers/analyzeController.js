const { analyzePromptAsync, analyzePrompt } = require('../services/analyzeServices');

const analyzeController = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: "Prompt is required"
        });
    }

    try {
        // Use async version (Python optimizer when available)
        const result = await analyzePromptAsync(prompt);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Analyze controller error:", error.message);

        // Fallback to sync JS version
        try {
            const result = analyzePrompt(prompt);
            res.json({
                success: true,
                data: result
            });
        } catch (fallbackError) {
            res.status(500).json({
                success: false,
                error: "Analysis failed"
            });
        }
    }
}
module.exports = { analyzeController };

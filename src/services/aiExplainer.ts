export async function explainBias(biasScores: any, portfolio: any): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `Portfolio value: $${portfolio.total_value}
Alpha score: ${biasScores.alpha_score}/100
Top bias: Loss Aversion (${biasScores.loss_aversion_score}/100)

Explain in 2 sentences why this investor has a ${biasScores.alpha_score} alpha score and how loss aversion is costing them money.`,
        }],
      }),
    })

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error('AI explanation failed:', error)
    return 'Your portfolio shows signs of cognitive bias affecting performance.'
  }
}

import { supabase } from '../utils/supabase/client'

interface Position {
  symbol: string
  shares: number
  cost_basis: number
  current_price: number
  purchase_date: string
}

interface BiasScores {
  alpha_score: number
  loss_aversion_score: number
  confirmation_bias_score: number
  herding_behavior_score: number
  anchoring_bias_score: number
  recency_bias_score: number
  overconfidence_score: number
  disposition_effect_score: number
  missed_alpha_dollars: number
}

export async function analyzeBiases(
  userId: string,
  positions: Position[]
): Promise<BiasScores> {
  // Calculate individual bias scores
  const lossAversion = calculateLossAversion(positions)
  const confirmationBias = calculateConfirmationBias(positions)
  const herdingBehavior = calculateHerdingBehavior(positions)
  const anchoringBias = calculateAnchoringBias(positions)
  const recencyBias = calculateRecencyBias(positions)
  const overconfidence = calculateOverconfidence(positions)
  const dispositionEffect = calculateDispositionEffect(positions)

  // Calculate alpha score (inverse of average bias)
  const avgBias = (
    lossAversion +
    confirmationBias +
    herdingBehavior +
    anchoringBias +
    recencyBias +
    overconfidence +
    dispositionEffect
  ) / 7

  const alphaScore = Math.max(0, 100 - avgBias)

  // Calculate missed alpha in dollars
  const missedAlphaDollars = calculateMissedAlpha(positions, avgBias)

  const biasScores: BiasScores = {
    alpha_score: Math.round(alphaScore * 100) / 100,
    loss_aversion_score: Math.round(lossAversion * 100) / 100,
    confirmation_bias_score: Math.round(confirmationBias * 100) / 100,
    herding_behavior_score: Math.round(herdingBehavior * 100) / 100,
    anchoring_bias_score: Math.round(anchoringBias * 100) / 100,
    recency_bias_score: Math.round(recencyBias * 100) / 100,
    overconfidence_score: Math.round(overconfidence * 100) / 100,
    disposition_effect_score: Math.round(dispositionEffect * 100) / 100,
    missed_alpha_dollars: Math.round(missedAlphaDollars * 100) / 100,
  }

  // Save to database
  await supabase.from('bias_scores').insert({
    user_id: userId,
    ...biasScores,
    confidence_level: 0.85,
    model_version: 'v1.0',
  })

  return biasScores
}

function calculateLossAversion(positions: Position[]): number {
  // Users tend to hold losing positions too long
  const losingPositions = positions.filter(
    p => p.current_price < p.cost_basis
  )
  const winningPositions = positions.filter(
    p => p.current_price >= p.cost_basis
  )

  if (positions.length === 0) return 0

  const losingRatio = losingPositions.length / positions.length
  // High score if >50% positions are losing
  return Math.min(100, losingRatio * 150)
}

function calculateConfirmationBias(positions: Position[]): number {
  // Over-concentration in single stocks suggests confirmation bias
  if (positions.length === 0) return 0

  const totalValue = positions.reduce(
    (sum, p) => sum + p.shares * p.current_price,
    0
  )

  const largestPosition = Math.max(
    ...positions.map(p => (p.shares * p.current_price) / totalValue)
  )

  // High score if any single position >30% of portfolio
  if (largestPosition > 0.3) {
    return Math.min(100, (largestPosition - 0.3) * 300)
  }

  return 0
}

function calculateHerdingBehavior(positions: Position[]): number {
  // Check if portfolio has popular "meme stocks"
  const memeStocks = ['GME', 'AMC', 'TSLA', 'NVDA', 'PLTR']
  const memeCount = positions.filter(p =>
    memeStocks.includes(p.symbol)
  ).length

  if (positions.length === 0) return 0

  const memeRatio = memeCount / positions.length
  return Math.min(100, memeRatio * 120)
}

function calculateAnchoringBias(positions: Position[]): number {
  // Positions far from purchase price suggest anchoring
  let totalAnchorScore = 0

  positions.forEach(p => {
    const priceChange = Math.abs((p.current_price - p.cost_basis) / p.cost_basis)
    if (priceChange > 0.2 && p.current_price < p.cost_basis) {
      // Down >20% and still holding suggests anchoring
      totalAnchorScore += priceChange * 100
    }
  })

  return Math.min(100, totalAnchorScore / Math.max(1, positions.length))
}

function calculateRecencyBias(positions: Position[]): number {
  // Recent purchases dominate portfolio
  const now = new Date()
  const recentPositions = positions.filter(p => {
    const purchaseDate = new Date(p.purchase_date)
    const daysSince = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysSince < 30
  })

  if (positions.length === 0) return 0

  const recentRatio = recentPositions.length / positions.length
  return Math.min(100, recentRatio * 150)
}

function calculateOverconfidence(positions: Position[]): number {
  // Too many positions suggests overconfidence
  if (positions.length <= 10) return 0
  if (positions.length <= 15) return 20
  if (positions.length <= 20) return 40
  if (positions.length <= 25) return 60
  return Math.min(100, 80)
}

function calculateDispositionEffect(positions: Position[]): number {
  // Tendency to sell winners too early and hold losers too long
  const winners = positions.filter(p => p.current_price > p.cost_basis)
  const losers = positions.filter(p => p.current_price < p.cost_basis)
  
  if (positions.length === 0) return 0
  
  const avgWinnerGain = winners.length > 0 
    ? winners.reduce((sum, p) => sum + ((p.current_price - p.cost_basis) / p.cost_basis), 0) / winners.length 
    : 0
  const avgLoserLoss = losers.length > 0 
    ? losers.reduce((sum, p) => sum + Math.abs((p.current_price - p.cost_basis) / p.cost_basis), 0) / losers.length 
    : 0
  
  // High score if winners are sold at small gains while losers have large losses
  if (avgLoserLoss > avgWinnerGain) {
    return Math.min(100, (avgLoserLoss - avgWinnerGain) * 150)
  }
  return 0
}

function calculateMissedAlpha(positions: Position[], avgBias: number): number {
  // Estimate: each 10 points of bias = 1% annual return loss
  const totalValue = positions.reduce(
    (sum, p) => sum + p.shares * p.current_price,
    0
  )
  const annualLossPercent = (avgBias / 10) * 0.01
  return totalValue * annualLossPercent
}

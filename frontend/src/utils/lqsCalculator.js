
/**
 * LQS 3.1 Algorithm (Frontend Mirror)
 * Matches the backend logic in app/core/lqs_engine.py
 * 
 * Modules:
 * 1. Visual Impulse (Max 35) - Uses mock/default if no analysis data
 * 2. SEO Foundation (Max 35) - Pareto Title, Tag Health, Asset Richness
 * 3. Zeitgeist (Max 30) - Simulated market trends based on title seed
 */

/**
 * Simple seeded random number generator to match Python's random.seed(title) behavior roughly.
 * @param {string} seedStr 
 * @returns {Function} - Returns a random float between 0 and 1
 */
const createSeededRandom = (seedStr) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < seedStr.length; i++) {
        h ^= seedStr.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h >>> 0) / 4294967296;
    }
};

export const calculateLQS = (product) => {
    if (!product) return 0;

    // --- 1. MODULE: VISUAL IMPULSE (Max 35) ---
    // In frontend, we might not have the AI analysis data yet.
    // If 'lqs_visual_score' exists (from backend), use it.
    // Otherwise, assume a default "Good" score for new products to encourage user.
    let visualScore = product.lqs_visual_score || 0;

    // If no analysis data, we can't judge sharpness/contrast. 
    // We'll give a baseline score if images exist.
    if (!product.lqs_visual_score && (product.images?.length > 0 || product.image_url)) {
        visualScore = 20; // Baseline for having an image
    }

    // --- 2. MODULE: SEO FOUNDATION (Max 35) ---

    // A. Pareto Title (Max 15)
    const title = product.title || "";
    const titleLower = title.toLowerCase();
    let scorePareto = 15;

    // Rule 1: Core object in first 45 chars?
    // Since we don't have 'core_object' from AI in frontend editing, 
    // we skip this specific penalty OR check if title is very short.
    // Let's assume neutral here unless we have data.

    // Rule 2: Length < 80?
    if (title.length < 80) {
        scorePareto -= 4;
    }

    // Rule 3: Spam check (All caps or repetition)
    const isAllCaps = title.length > 5 && title === title.toUpperCase();
    const words = titleLower.split(/\s+/);
    const wordCounts = {};
    let hasSpam = false;
    words.forEach(w => {
        if (w.length > 2) {
            wordCounts[w] = (wordCounts[w] || 0) + 1;
            if (wordCounts[w] > 3) hasSpam = true;
        }
    });

    if (isAllCaps || hasSpam) {
        scorePareto -= 3;
    }

    if (scorePareto < 0) scorePareto = 0;

    // B. Tag Health (Max 15)
    const tags = product.tags || [];
    const tagCount = tags.length;

    // Fill (2 Points)
    const scoreTagFill = Math.min((tagCount / 13) * 2, 2);

    // Relevance (6 Points)
    // Hard to check without core_object. 
    // If we have suggested_tags, we can check overlap? 
    // For now, let's give full points if tags exist to avoid confusing user during edit.
    // Or better: Check if tags appear in title (a simple relevance check).
    let scoreTagRel = 0;
    if (tagCount > 0) {
        let matchCount = 0;
        tags.forEach(tag => {
            if (titleLower.includes(tag.toLowerCase())) matchCount++;
        });
        const matchRatio = matchCount / tagCount;
        if (matchRatio > 0.4) scoreTagRel = 6;
        else if (matchRatio > 0.1) scoreTagRel = 3;
    }

    // Long Tail Power (7 Points)
    let longTailCount = 0;
    tags.forEach(t => {
        if (t.trim().includes(' ')) longTailCount++;
    });

    let scoreTagLong = 0;
    if (longTailCount >= 7) scoreTagLong = 7;
    else if (longTailCount >= 4) scoreTagLong = 3.5;

    const seoScore = scorePareto + scoreTagFill + scoreTagRel + scoreTagLong;

    // C. Asset Richness (Max 5)
    let scoreAsset = 0;
    const images = product.images || (product.image_url ? [product.image_url] : []);
    const imageCount = images.length;

    if (imageCount >= 5) scoreAsset += 4;
    else if (imageCount >= 2) scoreAsset += 2;

    // We don't track video in frontend object usually, assume false unless property exists
    if (product.has_video) scoreAsset += 1;

    // SEO Total (Cap at 35)
    const finalSeoScore = Math.min(seoScore + scoreAsset, 35);

    // --- 3. MODULE: ZEITGEIST (Max 30) ---
    // Simulation based on title seed
    const rng = createSeededRandom(title || "default");

    // A. Best Seller Similarity (Max 15) -> 5 to 15
    const scoreBestseller = 5 + (rng() * 10);

    // B. Market Velocity (Max 10) -> 10, 8, or 5
    const velocityRand = rng();
    let scoreVelocity = 5;
    if (velocityRand > 0.66) scoreVelocity = 10;
    else if (velocityRand > 0.33) scoreVelocity = 8;

    // C. Seasonal Relevance (Max 5) -> 5 or 2
    const scoreSeasonal = rng() > 0.5 ? 5 : 2;

    let zeitgeistScore = scoreBestseller + scoreVelocity + scoreSeasonal;

    // --- TRENDSETTER PROTOCOL ---
    if (zeitgeistScore < 15 && visualScore > 30) {
        zeitgeistScore = 25;
    }

    // --- TOTAL SCORE ---
    const totalScore = visualScore + finalSeoScore + zeitgeistScore;

    return Math.round(totalScore);
};

export const getHealthStatus = (score) => {
    if (score < 50) return 'critical';
    if (score < 80) return 'warning';
    return 'healthy';
};

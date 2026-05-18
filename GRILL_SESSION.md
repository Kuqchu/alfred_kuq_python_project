# Kuq — Grill Session Record

Full project specification from design grilling session. All 7 sections locked.

---

## Section 1: Project Identity

| Field | Answer |
|---|---|
| **Name** | Kuq |
| **Mechanism** | PPRA Test (Psychological Perspective of Relationship Analysis) |
| **What it does** | Guided conflict analysis using 4 frameworks → categorized profile → tailored advice |
| **Frameworks** | Attachment Theory, RPCS, Gottman's Conflict Styles, ATWC Scale |
| **Target user** | Anyone experiencing relationship conflict, regardless of stage |
| **Differentiator** | Structured, psychology-grounded guidance vs. free-form AI chat |
| **Format** | One-time-visit web page (not a recurring app) |

---

## Section 2: Feature Scope

**2 features:**

1. **The PPRA Test** — guided questions across 4 frameworks
2. **The Results Page** — conflict profile + tailored advice

---

## Section 3: Data Architecture

### Layers and Values (15 total)

| Layer | Framework | Values |
|---|---|---|
| 1 | Attachment Theory | Attachment Anxiety, Attachment Avoidance |
| 2 | RPCS | Compromise, Domination, Submission, Separation, Avoidance, Interactional Reactivity |
| 3 | Gottman's Conflict Styles | Validating, Volatile, Avoidant, Hostile |
| 4 | ATWC Scale | Shame/Isolation, Renewal, Hostility |

### Scoring Model

- 10-20 questions per layer (40-80 total)
- 5-point discrete scale: Never (0.0) → Always (1.0)
- Each question has weighted contributions to multiple values
- Formula: `value_points = spectrum_position × weight`
- Negative scores clamped to 0
- Final scores normalized to 0-100 range
- Normalization: `(raw_score / max_possible_score) × 100`

### Example Question Weights

Question: "Do you feel your partner blows hot and cold?"

| Value | Weight | Reasoning |
|---|---|---|
| Attachment Anxiety | 1.0 | Direct trigger of abandonment fear |
| Hostile (Gottman) | 0.7 | Hot-and-cold = hallmark of hostile cycle |
| Interactional Reactivity | 0.6 | Unpredictable warmth keeps nervous system on edge |
| Shame/Isolation | 0.5 | Intermittent affection erodes self-worth |
| Domination | 0.3 | Some respond by trying to control the situation |
| Avoidance (RPCS) | 0.2 | Coping by avoiding the issue |
| Hostility (ATWC) | 0.2 | Post-conflict resentment |
| Attachment Avoidance | -0.1 | Negative — attuned users likely not high in avoidance |

### JSON Structure

```json
{
  "answers": [
    {"question_id": 1, "layer": 1, "position": 0.8},
    {"question_id": 2, "layer": 1, "position": 0.3}
  ],
  "value_scores": {
    "attachment_anxiety": 80,
    "attachment_avoidance": 0,
    "compromise": 45,
    "domination": 72,
    "submission": 30,
    "separation": 25,
    "avoidance": 55,
    "interactional_reactivity": 68,
    "validating": 35,
    "volatile": 60,
    "avoidant": 50,
    "hostile": 75,
    "shame_isolation": 70,
    "renewal": 20,
    "hostility": 65
  },
  "results": {
    "layer_1": {
      "highest_value": "attachment_anxiety",
      "severity": "High",
      "description": "Your attachment anxiety is high. In conflicts, you likely feel an urgent need to resolve things immediately..."
    },
    "layer_2": { "..." : "..." },
    "layer_3": { "..." : "..." },
    "layer_4": { "..." : "..." },
    "overall": {
      "profile_name": "The Anxious-Hostile Cycle",
      "conclusion": "...",
      "feedback": "..."
    }
  }
}
```

### Result Descriptions (Tiered by Severity)

Each value has 3 descriptions based on score range:
- **Low (0-33)**
- **Moderate (34-66)**
- **High (67-100)**

Example — Attachment Anxiety:
- Low: "Your attachment anxiety is low. You generally feel secure..."
- Moderate: "Your attachment anxiety is moderate. You sometimes worry..."
- High: "Your attachment anxiety is high. In conflicts, you likely feel an urgent need to resolve things immediately, because disconnection feels unbearable..."

---

## Section 4: Function Specifications

### 7 Functions

| # | Function | Parameters | Returns | Purpose |
|---|---|---|---|---|
| 1 | `loadQuestions()` | none | Array of question objects | Loads all PPRA questions with spectrum, layer, and value weights |
| 2 | `validateAnswers(answers)` | answers (raw input array) | `{valid, cleaned_answers, errors}` | Validates input, clamps ranges, handles duplicates |
| 3 | `calculateScores(answers)` | answers (array of `{question_id, position}`) | Object with 15 normalized value scores (0-100) | Multiplies position by weights, normalizes, clamps negatives |
| 4 | `getLayerScores(scores)` | scores (object) | Object grouped by layer | Restructures flat scores into per-layer groupings |
| 5 | `getResultDescription(valueName, score)` | valueName (string), score (number 0-100) | `{label, description, severity}` | Returns tiered feedback by severity |
| 6 | `generateOverall(layerScores)` | layerScores (grouped object) | `{profile_name, conclusion, feedback}` | Matches to one of ~10-15 named profiles |
| 7 | `renderResults(results)` | results (full results object) | void (displays HTML) | Renders the results page |

### Edge Cases per Function

**validateAnswers:**
- Empty answers array → return `valid=false` with error
- Duplicate question_ids → keep last answer, warn
- Non-numeric position → reject that answer
- Position outside 0-1 → clamp to 0 or 1

**calculateScores:**
- Missing answer → treat as 0.5 (neutral)
- Question_id not in bank → skip with warning
- Value with zero contributing questions → score = null (not 0)

**getLayerScores:**
- Layer with all null scores → mark as "insufficient data"
- Negative scores from negative weights → clamped to 0

**getResultDescription:**
- Score is null → "Insufficient data to assess this value"
- Missing valueName + severity combo → fall back to moderate description

**generateOverall:**
- No value above 50 in any layer → return "Balanced" profile
- Contradictory values both high → acknowledge internal conflict
- Fewer than 2 layers with valid scores → partial profile with disclaimer

---

## Section 5: UI / Interaction Design

### Page 1: Landing Page

**Headline:** Stop having the exact same fight.

**Subtext:** Kuq helps you untangle your relationship dynamics. Using four validated psychological frameworks, this 10-minute diagnostic reveals your hidden conflict patterns, attachment style, and what you actually need to feel secure.

**Trust Badge:** 100% private. No accounts, no tracking, and your answers never leave your device.

**Button:** [ Start the PPRA Test ]

### Page 2: Question Page

**Sticky Header:**
- Top Left: Kuq (logo)
- Top Center: Progress bar (fills as user answers)
- Top Right: Question 12 of 60 (dynamic counter)

**Layer Separations:**

| Layer | Heading | Subtext |
|---|---|---|
| 1 (Attachment) | Part 1: How You Connect | Let's start with how you generally feel in the relationship day-to-day. |
| 2 (RPCS) | Part 2: When Things Get Tense | Every couple disagrees. How do the two of you handle friction? |
| 3 (Gottman) | Part 3: In the Heat of the Moment | Think about your most typical arguments when answering these. |
| 4 (ATWC) | Part 4: The Aftermath | How do you feel after the dust settles? |

**Individual Question Format (5-point bubble scale):**
```
Do you feel your partner blows hot and cold?

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always
```

**Bottom of Page:**
- Text: "You're all done. Thanks for being honest — that isn't always easy to do."
- Button: [ View My Insights ]

### Page 3: Results Page

**Headline:** Your Relationship Insights

**Intro:** Thank you for your honesty. Relationships are complicated, and conflicts rarely happen for the reasons we think they do. Based on your answers, here is a breakdown of the invisible patterns driving your arguments, and a clear path forward.

**Layer Breakdown Format:**
```
Part 1: How You Connect
Your Core Pattern: Attachment Anxiety (High)

[Description text based on severity tier]
```

(Repeated for all 4 layers — shows highest value per layer with severity tier)

**Overall Profile:**
```
Bringing It All Together: The Anxious-Hostile Cycle

The Big Picture:
[Synthesis conclusion combining all 4 layers]

Your Next Step:
[One concrete, actionable feedback step]
```

**Safety Disclaimer:**
A quick note on safety: Kuq is a tool for understanding, not a substitute for professional help. If you ever feel physically or emotionally unsafe in your relationship, please reach out to [National Domestic Violence Hotline / Crisis Resources]. You deserve to be safe.

---

## Section 6: Error Handling

| Error | Response |
|---|---|
| **Unanswered questions** | Block submission. Highlight unanswered in red. Show: "Please answer all questions before continuing." |
| **Page refresh mid-test** | Save to localStorage on each click. On reload, restore. Show: "Welcome back — your progress has been restored." |
| **JavaScript fails to load** | `<noscript>` tag: "Kuq requires JavaScript to run. Please enable it in your browser settings." |
| **Results fail to generate** | Show: "Something went wrong generating your insights." Buttons: [Try Again] and [Start Over] |
| **Small screen / mobile** | Responsive CSS. Questions stack vertically as list. Text scales. Sections remain full-width. |

---

## Section 7: Testing Plan

### Test Case 1: Scoring Engine Math (calculateScores)

**Input:** One question answered. question_id=1, position=0.8 (leaning toward "Always").

**Weights:** Attachment Anxiety (1.0), Hostile (0.7), Attachment Avoidance (-0.1).

**Math:**
- Attachment Anxiety: `0.8 × 1.0 = 0.8` → `(0.8 / 1.0) × 100 = 80`
- Hostile: `0.8 × 0.7 = 0.56` → `(0.56 / 0.7) × 100 = 80`
- Attachment Avoidance: `0.8 × -0.1 = -0.08` → clamped to `0`

**Expected Output:** `{ attachment_anxiety: 80, hostile: 80, attachment_avoidance: 0 }`

### Test Case 2: Malformed Input (validateAnswers)

**Input:** Three answers with errors:
- question_id=1, position=1.5 (outside 0-1 range)
- question_id=2, position="Not sure" (string)
- question_id=1, position=0.2 (duplicate ID)

**Expected Output:**
- 1.5 clamped to 1.0
- "Not sure" converted to 0.5 fallback
- Duplicate overwrites, keeps position=0.2

**Result:** `[{question_id: 1, position: 0.2}, {question_id: 2, position: 0.5}]` with warning logged.

### Test Case 3: Contradiction Edge Case (generateOverall)

**Input:**
- attachment_anxiety: 92
- attachment_avoidance: 88
- All other values below 30

**Expected Output:**
- Profile matched: "The Push-Pull Dynamic" (or Fearful-Avoidant)
- Conclusion: "Your results show a deep internal conflict: a high need for closeness (Anxiety) battling an intense fear of getting hurt (Avoidance). You likely draw your partner in, only to push them away when they get too close."
- App does not crash or produce contradictory output.

---

## Named Profiles (5 defined)

### 1. The Anxious-Hostile Cycle
**Trigger:** Attachment Anxiety (High) + Domination (RPCS) + Hostile (Gottman) + Shame/Isolation (ATWC)

**Conclusion:** Because your drive for connection is so high, when your partner withdraws or blows hot and cold, panic sets in. This panic translates into a push for control (Domination) and sharp words (Hostility) to force a reaction from them. You aren't trying to be mean; you are trying to be seen. But the hostility often causes your partner to retreat further, leaving you with intense feelings of shame and isolation after the fight ends.

### 2. The "Keep the Peace" Cycle
**Trigger:** Attachment Avoidance (High) + Avoidance/Submission (RPCS) + Avoidant (Gottman) + Renewal (ATWC)

**Conclusion:** You prioritize harmony over resolution, often burying your own needs and shutting down the argument quickly to de-escalate tension, which temporarily restores the peace but leaves the root issues untouched.

### 3. The Volatile-Passionate Cycle
**Trigger:** Attachment Anxiety (High) + Interactional Reactivity (RPCS) + Volatile (Gottman) + Renewal (ATWC)

**Conclusion:** Your conflicts are loud and emotionally charged because you fight hard to be heard and understood, but you also make up intensely, often using the heat of the argument as a twisted reassurance that you both still care.

### 4. The Rational Wall
**Trigger:** Attachment Avoidance (High) + Domination/Separation (RPCS) + Stonewalling/Avoidant (Gottman) + Isolation (ATWC)

**Conclusion:** When conflict strikes, your instinct is to retreat to cold logic and physical distance to protect yourself, inadvertently taking control of the argument by deciding when — or if — the two of you will communicate.

### 5. The Anxious-Appeaser Cycle
**Trigger:** Attachment Anxiety (High) + Submission (RPCS) + Validating (Gottman) + Shame/Isolation (ATWC)

**Conclusion:** Terrified that the conflict will lead to abandonment, you quickly absorb the blame and submit to your partner's perspective, leaving you feeling emotionally drained, resentful, and lonely even after the fight is "resolved."

---

## Tech Stack

**Decision:** Pure front-end (HTML + CSS + JavaScript)

**Reasoning:**
- No data collection needed
- No back-end to manage
- Free hosting (GitHub Pages, Netlify)
- Scoring logic runs in browser
- AI-assisted coding (user doesn't know JS)

**Removed features:**
- Download as PDF
- Copy Link to Share

---

## Open Items for Later

- Define remaining 5-10 named profiles (5 of ~10-15 done)
- Write all 15 value descriptions × 3 severity tiers = 45 result texts
- Write 40-80 questions with weight mappings
- Validate questions with multiple AI systems
- Define max possible score per value for normalization

# PRD v2 — Kuq: Relationship Conflict Diagnostic

## Product Requirements Document (Version 2)

---

## Part 1: Project Identity (1-2 paragraphs)

> **Kuq** is a one-time-visit web-based diagnostic that helps people experiencing relationship conflict understand their hidden conflict patterns by completing the PPRA Test (Psychological Perspective of Relationship Analysis) — a guided questionnaire built on four validated psychological frameworks (Attachment Theory, Romantic Partner Conflict Scale, Gottman's Conflict Styles, and the After the Worst Conflict Scale). The test produces a personalized conflict profile with severity-tiered feedback for each dimension and a named overall relationship pattern.
>
> The target user is anyone experiencing relationship conflict, regardless of relationship stage. A concrete persona: an 18-year-old girl who just started her first relationship in college, dealing with anxiety when her partner doesn't text back immediately, fear of abandonment, and not understanding why small disagreements feel catastrophic. More broadly, Kuq serves anyone who has had the same fight with their partner over and over and can't figure out why — people who have tried Googling for advice but only find generic listicles, not structured, psychologically-grounded insight.
>
> I picked this project because relationship conflict is universal, but the tools available are either too clinical (therapy), too generic (Google), or too unstructured (ChatGPT). Kuq fills the gap: it's accessible, private (no accounts, no tracking, answers never leave the device), and guided — it asks the right questions so users don't need to know how to articulate their problems. The value over ChatGPT is that Kuq doesn't rely on the user knowing what to prompt; it walks them through a structured diagnostic and produces feedback grounded in specific, named psychological frameworks.

---

## Part 2: Feature Scope — The "Must-Have" List

Kuq has exactly **2 core features**.

### Feature 1: The PPRA Test

**What it does:** Presents the user with 40-80 questions organized into 4 psychological layers. Each question uses a 5-point bubble scale (Never to Always). Questions are written in plain, non-clinical language and grouped under friendly headings that hide the academic framework names.

**Why it matters:** This is the entire input mechanism — without the test, there is no diagnostic. The structured questioning forces users to reflect on their conflict patterns in ways they wouldn't on their own.

**User flow:**
  1. User arrives at landing page, reads headline and subtext
  2. User clicks "Start the PPRA Test"
  3. Questions page loads with sticky header (logo, progress bar, question counter)
  4. User scrolls through Part 1: How You Connect (Attachment Theory questions)
  5. User scrolls through Part 2: When Things Get Tense (RPCS questions)
  6. User scrolls through Part 3: In the Heat of the Moment (Gottman questions)
  7. User scrolls through Part 4: The Aftermath (ATWC questions)
  8. User sees closing text: "You're all done. Thanks for being honest — that isn't always easy to do."
  9. User clicks "View My Insights"

**Edge cases:**
  - User submits with unanswered questions → App blocks submission, highlights unanswered questions in red, shows: "Please answer all questions before continuing."
  - User refreshes the page mid-test → Answers are saved to localStorage on each click. On reload, progress is restored with message: "Welcome back — your progress has been restored."
  - User is on a very small screen → Questions stack vertically as a list instead of horizontal bubble scale. Text scales down. Layer sections remain full-width.

### Feature 2: The Results Page

**What it does:** Displays the user's personalized conflict profile. Shows the highest-scoring value for each of the 4 layers with a severity tier (Low/Moderate/High) and a detailed description. Then synthesizes all 4 layers into one named overall profile with a conclusion and one actionable feedback step.

**Why it matters:** This is the payoff — the entire reason the user took the test. The tiered, layered results give the user language for patterns they couldn't articulate on their own, and the overall profile names their dynamic so it feels understood and concrete.

**User flow:**
  1. User sees headline: "Your Relationship Insights"
  2. User reads validating intro paragraph
  3. User scrolls through Part 1 result: their highest Attachment value + severity + description
  4. User scrolls through Part 2 result: their highest RPCS value + severity + description
  5. User scrolls through Part 3 result: their highest Gottman value + severity + description
  6. User scrolls through Part 4 result: their highest ATWC value + severity + description
  7. User reads overall profile: named pattern, synthesis conclusion, one actionable next step
  8. User reads safety disclaimer with crisis resources

**Edge cases:**
  - Results fail to generate → User sees error screen: "Something went wrong generating your insights." Two buttons: [Try Again] (re-runs calculation) and [Start Over] (clears localStorage, returns to landing page)
  - A layer has insufficient data (all scores null) → Display: "Insufficient data for this section."
  - User scores high on contradictory values (e.g., Attachment Anxiety AND Attachment Avoidance both high) → The overall profile acknowledges the contradiction explicitly (e.g., "The Push-Pull Dynamic")

---

## Part 3: Data Architecture

### 3a: Data Structure

**Question Bank (one question example with full weights):**

```json
{
  "question_id": 1,
  "text": "Do you feel your partner blows hot and cold?",
  "spectrum": {"left": "Never", "right": "Always"},
  "layer": 1,
  "value_weights": {
    "attachment_anxiety": 1.0,
    "hostile_gottman": 0.7,
    "interactional_reactivity": 0.6,
    "shame_isolation": 0.5,
    "domination": 0.3,
    "avoidance_rpcs": 0.2,
    "hostility_atwc": 0.2,
    "attachment_avoidance": -0.1
  }
}
```

**User Answers (what the user submits):**

```json
{
  "answers": [
    {"question_id": 1, "position": 0.8},
    {"question_id": 2, "position": 0.25},
    {"question_id": 3, "position": 0.5},
    {"question_id": 4, "position": 1.0},
    {"question_id": 5, "position": 0.75}
  ]
}
```

**Calculated Scores (what the app computes):**

```json
{
  "value_scores": {
    "attachment_anxiety": 80,
    "attachment_avoidance": 12,
    "compromise": 35,
    "domination": 72,
    "submission": 28,
    "separation": 18,
    "avoidance_rpcs": 45,
    "interactional_reactivity": 68,
    "validating": 30,
    "volatile": 55,
    "avoidant_gottman": 40,
    "hostile_gottman": 75,
    "shame_isolation": 70,
    "renewal": 22,
    "hostility_atwc": 65
  }
}
```

**Layer Grouping (restructured for display):**

```json
{
  "layer_1": {
    "name": "Attachment Theory",
    "values": {
      "attachment_anxiety": 80,
      "attachment_avoidance": 12
    },
    "highest": "attachment_anxiety",
    "severity": "High"
  },
  "layer_2": {
    "name": "RPCS",
    "values": {
      "compromise": 35,
      "domination": 72,
      "submission": 28,
      "separation": 18,
      "avoidance": 45,
      "interactional_reactivity": 68
    },
    "highest": "domination",
    "severity": "High"
  },
  "layer_3": {
    "name": "Gottman's Conflict Styles",
    "values": {
      "validating": 30,
      "volatile": 55,
      "avoidant": 40,
      "hostile": 75
    },
    "highest": "hostile",
    "severity": "High"
  },
  "layer_4": {
    "name": "ATWC Scale",
    "values": {
      "shame_isolation": 70,
      "renewal": 22,
      "hostility": 65
    },
    "highest": "shame_isolation",
    "severity": "High"
  }
}
```

**Final Results (what the user sees):**

```json
{
  "layer_results": {
    "layer_1": {
      "label": "Attachment Anxiety",
      "severity": "High",
      "description": "Your attachment anxiety is high. In conflicts, you likely feel an urgent need to resolve things immediately, because disconnection feels unbearable. This can lead you to pursue your partner, demand reassurance, or become emotionally flooded quickly. The underlying question driving you is often: 'Are you still there for me?' Understanding this pattern helps you see that some of your conflict reactions are less about the surface issue and more about your deep need for security."
    },
    "layer_2": {
      "label": "Domination",
      "severity": "High",
      "description": "Your dominant conflict style is Domination. When disagreements arise, you have a strong impulse to take charge and push for your preferred outcome. While this can feel effective in the short term, it often leaves your partner feeling unheard or overwhelmed, escalating the fight. Your pattern says: 'I need to win this for the conflict to end.' A key growth area is learning to notice when this urge kicks in, and experimenting with stepping back, listening, and seeking a collaborative solution — which the Compromise strategy represents."
    },
    "layer_3": {
      "label": "Hostile",
      "severity": "High",
      "description": "Your conflict pattern as a couple is Hostile. This is the most corrosive of the four couple conflict styles. In your dynamic, arguments often feel unsafe — filled with eye-rolling, blame, and defensive retorts. Rather than resolving issues, you likely cycle through the same painful fights, each time chipping away at the foundation of your relationship. The good news: a pattern like this doesn't mean the relationship is doomed, but it does mean you need to actively replace contempt and defensiveness with 'softened startup' and active listening. Even small steps — like one partner calling a pause when criticism begins — can begin to shift this dynamic."
    },
    "layer_4": {
      "label": "Shame/Isolation",
      "severity": "High",
      "description": "After your worst conflicts, you experience intense shame and isolation. You may replay the argument in your head, blame yourself, and withdraw emotionally. This post-conflict pattern can be as damaging as the fight itself, creating a cycle where shame leads to distance, which leads to more insecurity, which triggers the next conflict."
    }
  },
  "overall": {
    "profile_name": "The Anxious-Hostile Cycle",
    "conclusion": "Because your drive for connection is so high, when your partner withdraws or blows hot and cold, panic sets in. This panic translates into a push for control (Domination) and sharp words (Hostility) to force a reaction from them. You aren't trying to be mean; you are trying to be seen. But the hostility often causes your partner to retreat further, leaving you with intense feelings of shame and isolation after the fight ends.",
    "feedback": "The next time you feel the panic of disconnection, your instinct will be to demand engagement or lash out. Instead, try pausing and naming the underlying emotion out loud: 'I am feeling really disconnected right now and it's making me panic. I need a little reassurance.' Name your feeling, not your partner's failure."
  }
}
```

### 3b: Data Flow Diagram

- **Where data comes FROM:** User input on the question page (5-point bubble scale selections). All questions are pre-defined in a JavaScript question bank — no external API or data source.
- **Where data gets STORED:** Nowhere permanently. Answers are temporarily stored in the browser's `localStorage` to survive page refreshes. Data is cleared when the user closes the tab or clicks "Start Over." No server, no database, no cookies beyond localStorage.
- **When data gets READ:** The question bank is loaded once when the question page opens. localStorage is read on page load to restore any saved progress.
- **When data gets WRITTEN:** Answers are saved to localStorage on every click (each time the user selects a bubble). Scores are calculated in memory when the user clicks "View My Insights." Results are rendered to the DOM — they are never stored.

---

## Part 4: Function Specifications

```javascript
function loadQuestions()
    /**
     * Loads the complete PPRA question bank with all questions, their spectrum labels, layers, and value weights.
     *
     * @returns {Array<Object>} Array of question objects, each containing question_id, text, spectrum, layer, and value_weights.
     *
     * Example:
     *   loadQuestions() → [
     *     {question_id: 1, text: "Do you feel your partner blows hot and cold?",
     *      spectrum: {left: "Never", right: "Always"}, layer: 1,
     *      value_weights: {attachment_anxiety: 1.0, hostile_gottman: 0.7, ...}},
     *     ...
     *   ]
     *
     * Edge cases handled:
     *   - Question data fails to load → Show error message to user
     *   - A question is missing weights → Skip question, log warning to console
     */
```

```javascript
function validateAnswers(answers)
    /**
     * Validates raw user answers before they reach the scoring engine. Checks for missing values, out-of-range positions, non-numeric types, and duplicate question IDs.
     *
     * @param {Array<Object>} answers - Raw array of {question_id, position} objects from user input.
     * @returns {Object} {valid: boolean, cleaned_answers: Array, errors: Array}
     *
     * Example:
     *   validateAnswers([{question_id: 1, position: 1.5}, {question_id: 2, position: "Not sure"}])
     *   → {valid: true, cleaned_answers: [{question_id: 1, position: 1.0}, {question_id: 2, position: 0.5}], errors: ["Q1: position clamped to 1.0", "Q2: non-numeric converted to 0.5"]}
     *
     * Edge cases handled:
     *   - Empty answers array → return valid=false with error "No answers provided"
     *   - Position outside 0-1 range → clamp to 0 or 1
     *   - Non-numeric position → convert to 0.5 (neutral fallback) or reject
     *   - Duplicate question_id → keep most recent answer, log warning
     */
```

```javascript
function calculateScores(answers)
    /**
     * Computes normalized value scores from validated answers. For each answer, multiplies the position (0-1) by the question's value weights, sums totals per value across all questions, then normalizes by dividing by the number of questions that contributed to each value. Final scores are clamped to 0-100 range. Negative scores from negative weights are clamped to 0.
     *
     * @param {Array<Object>} answers - Validated array of {question_id, position} objects.
     * @returns {Object} Object with 15 value names as keys and normalized scores (0-100) as values. Values with no contributing questions get null.
     *
     * Example:
     *   calculateScores([{question_id: 1, position: 0.8}])
     *   → {attachment_anxiety: 80, hostile_gottman: 80, attachment_avoidance: 0, ...}
     *
     * Math for question 1 (position=0.8):
     *   - attachment_anxiety: 0.8 × 1.0 = 0.8 → (0.8 / 1.0) × 100 = 80
     *   - hostile_gottman: 0.8 × 0.7 = 0.56 → (0.56 / 0.7) × 100 = 80
     *   - attachment_avoidance: 0.8 × -0.1 = -0.08 → clamped to 0
     *
     * Edge cases handled:
     *   - Answer position missing or undefined → treat as 0.5 (neutral)
     *   - question_id not found in question bank → skip that answer, log warning
     *   - Value has zero contributing questions → score = null (not 0)
     *   - Negative raw score from negative weights → clamped to 0
     */
```

```javascript
function getLayerScores(scores)
    /**
     * Restructures flat value scores into per-layer groupings for display. Each layer object contains its values, the highest-scoring value name, and the severity tier.
     *
     * @param {Object} scores - Flat object of {value_name: score} from calculateScores.
     * @returns {Object} Grouped by layer: {layer_1: {name, values, highest, severity}, layer_2: {...}, ...}
     *
     * Severity tiers: Low (0-33), Moderate (34-66), High (67-100)
     *
     * Edge cases handled:
     *   - Layer has all null scores → mark layer as "insufficient data"
     *   - Negative scores from negative weights → clamped to 0
     *   - Two values tie for highest → prioritize by predefined value order within the layer
     */
```

```javascript
function getResultDescription(valueName, score)
    /**
     * Returns tiered feedback text for a given value based on its score range. Each of the 15 values has 3 severity-tiered descriptions (Low, Moderate, High).
     *
     * @param {string} valueName - The value identifier (e.g., "attachment_anxiety").
     * @param {number|null} score - Normalized score (0-100), or null if insufficient data.
     * @returns {Object} {label: string, description: string, severity: string}
     *
     * Example:
     *   getResultDescription("attachment_anxiety", 80)
     *   → {label: "Attachment Anxiety", severity: "High",
     *      description: "Your attachment anxiety is high. In conflicts, you likely feel an urgent need to resolve things immediately..."}
     *
     * Edge cases handled:
     *   - Score is null → return {label, description: "Insufficient data to assess this value.", severity: "N/A"}
     *   - ValueName not found → return generic "Unable to determine" message
     *   - valueName + severity combination has no description → fall back to Moderate tier
     */
```

```javascript
function generateOverall(layerScores)
    /**
     * Matches the user's multi-dimensional score pattern to one of the predefined named profiles. Returns the profile name, a synthesis conclusion, and one actionable feedback step.
     *
     * @param {Object} layerScores - Grouped scores from getLayerScores.
     * @returns {Object} {profile_name: string, conclusion: string, feedback: string}
     *
     * Named profiles (5 defined):
     *   1. The Anxious-Hostile Cycle — Anxiety + Domination + Hostile + Shame/Isolation
     *   2. The "Keep the Peace" Cycle — Avoidance + Avoidance/Submission + Avoidant + Renewal
     *   3. The Volatile-Passionate Cycle — Anxiety + Interactional Reactivity + Volatile + Renewal
     *   4. The Rational Wall — Avoidance + Domination/Separation + Avoidant + Isolation
     *   5. The Anxious-Appeaser Cycle — Anxiety + Submission + Validating + Shame/Isolation
     *
     * Edge cases handled:
     *   - No value scores above 50 in any layer → return "Balanced" profile with gentle feedback
     *   - Contradictory values both high (e.g., Anxiety + Avoidance) → match to "The Push-Pull Dynamic" profile that acknowledges the internal conflict
     *   - Fewer than 2 layers have valid scores → generate partial profile with disclaimer: "We didn't get enough data to give you a complete picture."
     */
```

```javascript
function renderResults(results)
    /**
     * Renders the full results page to the DOM. Displays the headline, intro, 4 layer breakdowns (label + severity + description), overall profile (name + conclusion + feedback), and safety disclaimer.
     *
     * @param {Object} results - Complete results object from generateOverall and getResultDescription calls.
     * @returns {void} (modifies DOM directly)
     *
     * Edge cases handled:
     *   - A layer result is missing or null → display "Insufficient data for this section."
     *   - Small screen / mobile viewport → responsive CSS stacks content vertically
     *   - JavaScript rendering fails → show error screen with [Try Again] and [Start Over] buttons
     */
```

---

## Part 5: User Interface & Interaction Design

### 5a: Landing Page

```
============================================
       Stop having the exact same fight.
============================================

Kuq helps you untangle your relationship dynamics.
Using four validated psychological frameworks,
this 10-minute diagnostic reveals your hidden
conflict patterns, attachment style, and what you
actually need to feel secure.

100% private. No accounts, no tracking, and your
answers never leave your device.

[ Start the PPRA Test ]
```

### 5b: Question Page

**Sticky Header (always visible at top):**

```
Kuq          [████████░░░░░░░░░░░░]          Question 12 of 60
```

**Part 1: How You Connect**

```
Let's start with how you generally feel in the
relationship day-to-day.

Do you feel your partner blows hot and cold?

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

When there's a disagreement, I tend to shut down
and stop talking.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

I worry that my partner will leave me after a fight.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always
```

---

**Part 2: When Things Get Tense**

```
Every couple disagrees. How do the two of you
handle friction?

During arguments, I try to find a middle ground.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

I tend to push my point until my partner gives in.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

When things get heated, I withdraw completely.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always
```

---

**Part 3: In the Heat of the Moment**

```
Think about your most typical arguments when
answering these.

I feel like my partner and I argue passionately
but resolve things.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

Our arguments involve eye-rolling, blame, or
name-calling.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

I tend to go silent and wait for things to blow over.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always
```

---

**Part 4: The Aftermath**

```
How do you feel after the dust settles?

After a fight, I feel ashamed and want to isolate.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

After a fight, we reconnect and things feel renewed.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always

After a fight, I still feel bitter and resentful.

Never  ○ ──── ○ ──── ○ ──── ○ ──── ○  Always
```

---

**Bottom of Page:**

```
You're all done. Thanks for being honest — that
isn't always easy to do.

[ View My Insights ]
```

### 5c: Results Page

```
============================================
       Your Relationship Insights
============================================

Thank you for your honesty. Relationships are
complicated, and conflicts rarely happen for the
reasons we think they do. Based on your answers,
here is a breakdown of the invisible patterns
driving your arguments, and a clear path forward.

---

Part 1: How You Connect
Your Core Pattern: Attachment Anxiety (High)

Your attachment anxiety is high. In conflicts, you
likely feel an urgent need to resolve things
immediately, because disconnection feels unbearable.
This can lead you to pursue your partner, demand
reassurance, or become emotionally flooded quickly.
The underlying question driving you is often:
"Are you still there for me?" Understanding this
pattern helps you see that some of your conflict
reactions are less about the surface issue and more
about your deep need for security.

---

Part 2: When Things Get Tense
Your Core Pattern: Domination (High)

Your dominant conflict style is Domination. When
disagreements arise, you have a strong impulse to
take charge and push for your preferred outcome.
While this can feel effective in the short term, it
often leaves your partner feeling unheard or
overwhelmed, escalating the fight. Your pattern
says: "I need to win this for the conflict to end."
A key growth area is learning to notice when this
urge kicks in, and experimenting with stepping back,
listening, and seeking a collaborative solution —
which the Compromise strategy represents.

---

Part 3: In the Heat of the Moment
Your Core Pattern: Hostile (High)

Your conflict pattern as a couple is Hostile. This
is the most corrosive of the four couple conflict
styles. In your dynamic, arguments often feel unsafe
— filled with eye-rolling, blame, and defensive
retorts. Rather than resolving issues, you likely
cycle through the same painful fights, each time
chipping away at the foundation of your relationship.
The good news: a pattern like this doesn't mean the
relationship is doomed, but it does mean you need to
actively replace contempt and defensiveness with
"softened startup" and active listening. Even small
steps — like one partner calling a pause when
criticism begins — can begin to shift this dynamic.

---

Part 4: The Aftermath
Your Core Pattern: Shame/Isolation (High)

After your worst conflicts, you experience intense
shame and isolation. You may replay the argument in
your head, blame yourself, and withdraw emotionally.
This post-conflict pattern can be as damaging as the
fight itself, creating a cycle where shame leads to
distance, which leads to more insecurity, which
triggers the next conflict.

============================================
Bringing It All Together: The Anxious-Hostile Cycle
============================================

The Big Picture:
Because your drive for connection is so high, when
your partner withdraws or blows hot and cold, panic
sets in. This panic translates into a push for
control (Domination) and sharp words (Hostility) to
force a reaction from them. You aren't trying to be
mean; you are trying to be seen. But the hostility
often causes your partner to retreat further, leaving
you with intense feelings of shame and isolation
after the fight ends.

Your Next Step:
The next time you feel the panic of disconnection,
your instinct will be to demand engagement or lash
out. Instead, try pausing and naming the underlying
emotion out loud: "I am feeling really disconnected
right now and it's making me panic. I need a little
reassurance." Name your feeling, not your partner's
failure.

---

A quick note on safety: Kuq is a tool for
understanding, not a substitute for professional
help. If you ever feel physically or emotionally
unsafe in your relationship, please reach out to the
National Domestic Violence Hotline (1-800-799-7233)
or Crisis Text Line (text HOME to 741741). You
deserve to be safe.
```

---

## Part 6: Error Handling & Edge Cases

| # | Error Scenario | App Response |
|---|---------------|-------------|
| 1 | User submits with unanswered questions | Block submission. Highlight unanswered questions in red. Show message: "Please answer all questions before continuing." |
| 2 | User refreshes the page mid-test | Answers are saved to localStorage on each click. On page reload, restore all progress. Show small message: "Welcome back — your progress has been restored." |
| 3 | JavaScript fails to load in the browser | `<noscript>` tag displays: "Kuq requires JavaScript to run. Please enable it in your browser settings." Page is non-functional without JS. |
| 4 | Results fail to generate (scoring engine error) | Show error screen: "Something went wrong generating your insights." Provide two buttons: [Try Again] (re-runs calculation) and [Start Over] (clears localStorage, returns to landing page). |
| 5 | User is on a very small screen (mobile) | Responsive CSS adjusts layout. Questions stack vertically as a list instead of horizontal bubble scale. Text sizes reduce. Layer sections remain full-width. |
| 6 | User tampers with browser dev tools and sends invalid data (e.g., position=1.5, position="string") | validateAnswers() clamps out-of-range values to 0-1, converts non-numerics to 0.5 neutral fallback, and rejects malformed inputs before they reach the scoring engine. |
| 7 | A psychological layer has insufficient data (all scores null) | Display: "Insufficient data for this section." Overall profile generated from remaining layers with disclaimer. |

---

## Part 7: Testing Plan

```
Test 1: Scoring Engine Math (calculateScores)
  Input: One question answered — question_id=1, position=0.8
  Weights: attachment_anxiety=1.0, hostile_gottman=0.7, attachment_avoidance=-0.1
  Expected:
    - attachment_anxiety: 0.8 × 1.0 = 0.8 → (0.8/1.0) × 100 = 80
    - hostile_gottman: 0.8 × 0.7 = 0.56 → (0.56/0.7) × 100 = 80
    - attachment_avoidance: 0.8 × -0.1 = -0.08 → clamped to 0
  Pass criteria: Output matches {attachment_anxiety: 80, hostile_gottman: 80, attachment_avoidance: 0}

Test 2: Malformed Input Validation (validateAnswers)
  Input: [{question_id: 1, position: 1.5}, {question_id: 2, position: "Not sure"}, {question_id: 1, position: 0.2}]
  Expected:
    - position 1.5 clamped to 1.0
    - "Not sure" converted to 0.5 fallback
    - Duplicate question_id=1 keeps most recent (0.2), overwrites first
  Pass criteria: Returns [{question_id: 1, position: 0.2}, {question_id: 2, position: 0.5}] with warnings logged

Test 3: Contradiction Edge Case (generateOverall)
  Input: attachment_anxiety=92, attachment_avoidance=88, all other values below 30
  Expected:
    - Profile matched: "The Push-Pull Dynamic" (or Fearful-Avoidant)
    - Conclusion explicitly acknowledges the internal conflict between anxiety and avoidance
    - App does not crash or produce contradictory/confused output
  Pass criteria: Returns a named profile with text that addresses the paradox

Test 4: Empty Submission (validateAnswers)
  Input: Empty array []
  Expected: valid=false, error message "No answers provided"
  Pass criteria: Submission blocked, user cannot proceed to results

Test 5: localStorage Recovery
  Input: User answers 30 of 60 questions, refreshes page
  Expected: On reload, all 30 answers are restored from localStorage. Progress bar shows 30/60. Remaining questions are unanswered.
  Pass criteria: No data loss on refresh
```

---

## Part 8: Stretch Goals (Optional but Encouraged)

- [ ] Additional named profiles (currently 5, target 10-15)
- [ ] "Share with partner" feature — generates a link encoding the profile name so the partner can take the test and compare
- [ ] Multi-language support (Chinese, Spanish)
- [ ] Animated transitions between questions
- [ ] "What to do right now" emergency button — user is mid-conflict, gets one immediate coping strategy
- [ ] Partner comparison mode — both partners take the test, see where their profiles overlap or conflict

---

## Tech Stack

| Decision | Choice |
|---|---|
| **Front-end** | HTML + CSS + JavaScript (pure front-end, no framework) |
| **Back-end** | None (all logic runs in browser) |
| **Hosting** | GitHub Pages or Netlify (free) |
| **Data storage** | localStorage only (temporary, per-session) |
| **Coding approach** | AI-assisted (user defines specs, AI writes code) |
| **Question source** | AI-generated, validated with multiple AI systems |

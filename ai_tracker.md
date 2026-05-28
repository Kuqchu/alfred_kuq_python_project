---
title: AI Usage Log — Kuq Project
created: 2026-05-15
updated: 2026-05-28
project: Kuq (Relationship Conflict Diagnostic)
tags: [ai-log, kuq, prd-v2, reflection]
---

# AI Usage Log — Kuq Project

> Honest documentation of every AI interaction during the development of Kuq. Each entry tracks what was asked, what was received, what was changed, and what remains unclear.

---

## Entry 1: Starting the Grilling Session

### Date
2026-05-15

### AI Tool Used
Claude Code (claude-sonnet-4-6, via `/grill-me` skill)

### What I Asked AI
"I am working on a relationship app called Kuq. Grill me on each section of my project — Project Identity, Feature Scope, Data Architecture, Function Specifications, UI/Interaction Design, Error Handling, Testing Plan. Ask one section at a time. Wait for my answer before moving to the next."

### Why I Asked
I needed a structured, critical review of my project plan before building. The PRD v2 guide requires detailed specifications and I wanted an AI to stress-test my ideas and expose gaps.

### What AI Gave Me
A relentless question-by-question interview format. For Section 1 (Project Identity), the AI asked for the project name, one-sentence pitch, target user, and why I picked it. It also asked a hard question: "Why would someone open Kuq instead of just texting their partner?"

### What I Used
The hard question forced me to articulate the real differentiator — that Kuq provides structured, psychology-grounded guidance rather than free-form chat. This shaped the entire product pitch.

### What I Changed or Rejected
My initial description was vague ("MBTI format psychology model"). The AI pushed back on this framing, which made me clarify that the mechanism is a question-based test with pre-built answers based on psychological frameworks — not MBTI at all.

### What I Still Do Not Fully Understand
At this stage, I didn't have a clear one-sentence pitch. The AI's pushback helped, but I was still figuring out how to describe the product concisely.

### My Next Step
Answer the AI's follow-up questions about the MBTI framing, clarify the 4 psychological frameworks, and define the target user persona.

---

## Entry 2: Clarifying the MBTI Misunderstanding and Defining Frameworks

### Date
2026-05-15

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
I explained that "MBTI format" just means the mechanism (questions → category → advice), not actual MBTI. I listed the 4 frameworks: Attachment Theory, Romantic Partner Conflict Scale (RPCS), Gottman's Conflict Styles, After the Worst Conflict (ATWC) Scale. I also explained the value over ChatGPT: guided, structured, trained on specific models.

### Why I Asked
The AI flagged MBTI as widely criticized and a credibility risk. I needed to clarify that I'm not using MBTI — just the structural concept of "answer questions, get categorized, receive advice."

### What AI Gave Me
The AI accepted the clarification and asked two follow-up questions:
1. "What will you call this question → category → advice flow?" (MBTI framing is a liability)
2. "Who is the target user? Give me a persona."

### What I Used
- The suggestion to rename the mechanism. I proposed "PPRA" (Psychological Perspective of Relationship Analysis) — which the AI accepted as "solid, more credible, doesn't carry pop-psychology baggage."
- The persona format: I described an 18-year-old girl in college, first relationship, dealing with anxiety.

### What I Changed or Rejected
I rejected the idea that relationship length determines the target user. The AI pointed out that my frameworks (especially ATWC) are designed for established relationships with conflict history, while my persona was a few weeks into a new relationship. I argued that the frameworks measure conflict *patterns*, not relationship duration — someone 2 weeks in can have a real conflict. The AI accepted this.

### What I Still Do Not Fully Understand
I was unsure whether the "pre-built answers" concept was strong enough as a differentiator. The AI's framing of "structured guidance vs. free-form AI chat" helped me see the real value.

### My Next Step
Lock in the project identity and move to Feature Scope.

---

## Entry 3: Feature Scope — One-Shot vs. Recurring

### Date
2026-05-15

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
The AI asked for 3-5 core features. I said I only have the PPRA test and results — that's it.

### Why I Asked
The PRD requires 3-5 features. I only had 2 (test + results) and needed to either justify 2 or add more.

### What AI Gave Me
The AI challenged me: "If it's a one-time visit, why build it as a web app at all? A PDF worksheet or Typeform survey could do the same thing." It asked me to defend the one-shot format and explain what happens on Day 2.

### What I Used
I defended the web page format with two arguments:
1. Accessibility — a worksheet can only be shared with friends, a web page is accessible to anyone
2. Surveys collect data — Kuq generates advice, it's a diagnostic tool, not a data collector

The AI accepted both points: "Accessibility and the fact that this is a diagnostic generator, not a data collector — that's a clear product distinction."

### What I Changed or Rejected
I rejected the pressure to add more features. I committed to 2 features: the PPRA test and the results page. The AI agreed: "A well-executed 2-feature product beats a bloated 10-feature one."

### What I Still Do Not Fully Understand
I hadn't thought about what the results page actually shows. The AI's question ("Describe the results page from top to bottom") forced me to design the output format.

### My Next Step
Design the results page layout and content, then move to Data Architecture.

---

## Entry 4: Data Architecture — Scoring Mechanism and Weights

### Date
2026-05-15 to 2026-05-18

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
I described the scoring system: each question is a spectrum (Never ↔ Always), answers add points to multiple underlying values (loneliness, anxiety, etc.), and accumulated values determine the result. I provided a detailed weight mapping for one question ("blow hot and cold") with 8 weighted values and psychological reasoning for each weight.

### Why I Asked
The AI needed to understand the exact data flow to design the JSON structure and functions. I needed to explain that one question feeds into multiple values because the psychological frameworks are interconnected.

### What AI Gave Me
1. A JSON structure for questions with weights
2. A JSON structure for calculated scores (15 values)
3. A JSON structure for results with per-layer breakdowns
4. Three hard questions:
   - What are the two spectrum endpoints? (Never ↔ Always)
   - What's the scoring formula? (position × weight)
   - How does the overall conclusion work? (take top 3 values and generate)

### What I Used
All three JSON structures. The scoring formula: `value_points = spectrum_position × weight`. The "top 3 values" approach for the overall conclusion. The AI also flagged that I need score normalization and tiered severity — which I hadn't considered.

### What I Changed or Rejected
1. I changed the scale from continuous spectrum to 5-point discrete scale (easier to code, better for mobile)
2. I dropped the "I don't know" option from the scale — the middle bubble serves as neutral without needing a label
3. I rejected the AI's suggestion that I need hundreds of pre-written combinations for the overall conclusion — I just need to take the highest values and generate

### What I Still Do Not Fully Understand
At this point, I didn't realize that result descriptions should be tiered by severity. The AI caught this in the Function Specifications section.

### My Next Step
Define the 15 values across 4 layers, then design the functions.

---

## Entry 5: Function Specifications — Severity Tiers and Normalization

### Date
2026-05-18

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
I provided all 15 values across 4 layers and example result descriptions for Attachment Anxiety, Domination, and Hostile (Gottman).

### Why I Asked
The AI needed the complete value list to design the functions. The example descriptions showed the quality and tone of output I wanted.

### What AI Gave Me
7 functions with signatures, docstrings, and edge cases. But I identified a major flaw:

> `getResultDescription(valueName)` returns the same text regardless of whether the user scored 5 or 95. In psychological assessment, feedback must be tiered by severity.

The AI had designed a static, score-blind function. I flagged 5 additional issues:
1. Score normalization needed (normalize by question count, cap negatives)
2. Score-aware feedback (index by value + score range, not just value name)
3. Richer profile generation (multi-dimensional mapping, not just top 3 names)
4. Data validation (schema checking, sanity checks)
5. Layer grouping (utility to restructure flat scores)

### What I Used
The AI rewrote all 7 functions with my corrections:
- `calculateScores` now normalizes by question count, clamps to 0-100
- `getResultDescription` now takes both valueName AND score, with 3 severity tiers (Low 0-33, Moderate 34-66, High 67-100)
- `generateOverall` now maps multi-dimensional patterns to named profiles
- Added `validateAnswers` as a new function
- Added `getLayerScores` as a utility function

### What I Changed or Rejected
I accepted all 7 functions. I also decided on Option A for `generateOverall`: a fixed set of ~10-15 named profiles (rather than dynamic generation), because it keeps scope manageable for a class project.

### What I Still Do Not Fully Understand
I needed to define the actual named profiles. At this point I only had one ("The Anxious-Hostile Cycle").

### My Next Step
Define more named profiles, then design the UI.

---

## Entry 6: UI Design — Landing Page, Question Page, Results Page

### Date
2026-05-18

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
For each page (landing, questions, results), I provided the exact text and layout — some written by me, some generated with AI assistance and then reviewed.

### Why I Asked
The PRD requires exact text for every screen. I needed to specify the complete user experience.

### What AI Gave Me
Feedback on each page:
- Landing page: "Strong copy. The headline is a real pain point."
- Question page: Flagged the scale inconsistency (I said continuous earlier, but the AI-assisted design used 5-point discrete). I chose 5-point.
- Results page: Confirmed the structure was solid. Suggested using `window.print()` instead of a PDF library for simplicity.

### What I Used
- The 5-point discrete scale (easier to code, better for mobile)
- The `window.print()` suggestion (rejected both PDF and share link features as unnecessary)
- All the layer headings ("How You Connect", "When Things Get Tense", "In the Heat of the Moment", "The Aftermath")

### What I Changed or Rejected
1. Removed "Download as PDF" feature — too complex for scope
2. Removed "Copy Link to Share" feature — no server means no unique URLs
3. Changed "I don't know" label on scale — the middle bubble is neutral without needing a label, keeping UI uncluttered

### What I Still Do Not Fully Understand
Nothing at this point — the UI was fully specified.

### My Next Step
Define error handling, testing plan, and named profiles.

---

## Entry 7: Error Handling, Testing, and Named Profiles

### Date
2026-05-18

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
I provided:
1. Error handling decisions for 5 scenarios
2. Three detailed test cases with exact math
3. Four additional named profiles with triggering combinations and conclusion sentences

### Why I Asked
These are the final sections of the PRD. The test cases needed exact math to verify the scoring engine. The profiles needed to cover the most common high-score combinations.

### What AI Gave Me
1. Confirmation that all 5 error handlers were correct
2. Verification of the math in Test Case 1: `0.8 × 1.0 = 0.8 → (0.8/1.0) × 100 = 80` ✓
3. Validation that all 4 profiles were "psychologically coherent" — each describes a distinct, recognizable pattern

### What I Used
Everything. All 5 error handlers, all 3 test cases, all 5 named profiles.

### What I Changed or Rejected
Nothing — the AI confirmed all submissions were correct.

### What I Still Do Not Fully Understand
I still need to define the remaining 5-10 named profiles (currently at 5 of 10-15 planned). I also need to write all 45 result descriptions (15 values × 3 severity tiers).

### My Next Step
Write the remaining profiles and severity-tiered descriptions. Then begin building the app.

---

## Entry 8: PRD v2 Document Creation

### Date
2026-05-18

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
"Fill in the PRD v2 template with all the things we talked about. Copy and paste. Make it easy for me to copy it back."

### Why I Asked
The PRD v2 guide has a strict format with grading rubric. I needed the grilling session content formatted into the exact template structure.

### What AI Gave Me
A complete `PRD_V2.md` file with all 8 parts filled in:
- Part 1: Project Identity (2 paragraphs)
- Part 2: Feature Scope (2 features with full user flows and edge cases)
- Part 3: Data Architecture (full JSON structures, data flow diagram)
- Part 4: Function Specifications (7 functions with docstrings and edge cases)
- Part 5: UI Design (exact text for landing, question, and results pages)
- Part 6: Error Handling (7 scenarios with responses)
- Part 7: Testing Plan (5 test cases with exact math)
- Part 8: Stretch Goals (6 items)
- Tech Stack table

### What I Used
The entire document. Every section contains the exact content from our grilling session — no placeholders.

### What I Changed or Rejected
Nothing yet — this is the current state of the PRD.

### What I Still Do Not Fully Understand
- How to implement the 5-point bubble scale in HTML/CSS
- How localStorage save/restore works in practice
- How to structure the JavaScript question bank file
- How to implement responsive CSS for mobile

### My Next Step
Begin building the app. Start with the question bank (data layer), then the scoring engine (functions), then the UI (HTML/CSS).

---

## Entry 9: Building the MVP

### Date
2026-05-18 to 2026-05-20

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
"Build the full MVP — the HTML page, CSS styling, JavaScript scoring engine, and all the data."

### Why I Asked
The PRD was complete. Time to build the actual working app.

### What AI Gave Me
A complete working app with 6 files:
- `index.html` — 3-page structure (landing, questions, results)
- `style.css` — Base styling with responsive design
- `themes.css` — Theme system (added later)
- `data.js` — All 20 questions with weight mappings, 15 values, 45 descriptions, 5 profiles
- `script.js` — 7 functions: loadQuestions, validateAnswers, calculateScores, getLayerScores, getResultDescription, generateOverall, renderResults
- `themes.js` — Theme manager with audio player

### What I Used
Everything. The app worked end-to-end — users could answer 20 questions and get personalized results.

### What I Changed or Rejected
1. The AI initially used Web Audio API for music — it sounded like noise. I switched to HTML5 Audio with Mixkit royalty-free tracks.
2. The "Unknown" profile bug — generateOverall only checked the highest value per layer, not all high values. I had the AI fix it to check all values above 50.
3. The Start Over bug — bubble selections persisted visually after restarting. I had the AI add CSS class removal.

### What I Still Do Not Fully Understand
How CSS specificity works — this became a major issue later with theme colors.

### My Next Step
Add a backend for data storage and build the theme packs.

---

## Entry 10: Flask Backend for Data Storage

### Date
2026-05-20

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
"Create a local backend to store user responses. I want to collect anonymous data if users consent."

### Why I Asked
The project needed a way to store responses for analysis. A local Flask server was the simplest approach.

### What AI Gave Me
A `server.py` file with Flask that:
- Serves static files (HTML, CSS, JS)
- Has POST /api/respond to save responses to responses.json
- Has GET /api/stats for summary counts
- Has GET /api/responses for raw data

### What I Used
Everything. The server worked immediately. I tested it by having a friend take the quiz and verified the data was stored.

### What I Changed or Rejected
Nothing — the Flask backend was straightforward and worked as designed.

### What I Still Do Not Fully Understand
How Flask serves static files and handles CORS.

### My Next Step
Build the 3 theme packs.

---

## Entry 11: Theme Packs — Invincible, Aespa, Chill

### Date
2026-05-20 to 2026-05-25

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
"Build 3 theme packs with different colors, animations, and music. Invincible should have dark red with shake effects, Aespa should have neon purple with gradient text, Chill should have warm sage green with floating elements."

### Why I Asked
The app needed visual customization to make it more engaging. Each theme targets a different vibe.

### What AI Gave Me
- `themes.css` with 1400+ lines covering 3 theme packs
- `themes.js` with theme switching, audio player, and dynamic elements
- 4 different result page layouts (Dashboard, Timeline, Tabs, Magazine)
- Per-theme animations (shake, glow, float)
- Mixkit royalty-free music integration

### What I Used
Everything, but with many bugs that needed fixing over several sessions.

### What I Changed or Rejected
1. Rejected Web Audio API (sounded like noise) — switched to HTML5 Audio with Mixkit tracks
2. Changed from 4 different layouts to 1 shared dashboard layout (user wanted consistent scrolling experience)
3. Removed excessive Invincible wiggle — user wanted only a one-shot title shake, not continuous animation on everything

### What I Still Do Not Fully Understand
CSS specificity — the `!important` flag and how it interacts with selector specificity caused repeated bugs.

### My Next Step
Fix remaining color and layout bugs.

---

## Entry 12: Bug Fixes — CSS Specificity, Layout, Colors

### Date
2026-05-25 to 2026-05-28

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
Multiple rounds of bug fixes:
1. "Text colors are unreadable on dark themes"
2. "Different themes not showing different layouts"
3. "The Invincible wiggle is too much — only shake the title once"
4. "Change the feedback card colors for Invincible and Aespa to match their vibe"
5. "The layout changed back to tabs — put it back to scrollable cards"

### Why I Asked
The theme system had CSS specificity issues where base styles overrode theme colors, and layout changes kept reverting.

### What AI Gave Me
1. Added `!important` to theme color rules to override base styles
2. Fixed a CSS syntax error (extra `}` at end of themes.css) that broke all layout styles
3. Removed continuous wiggle animations, kept only one-shot title shake
4. Added per-theme results-layer card colors (dark red for Invincible, purple for Aespa)
5. Changed layout dispatch to use dashboard layout for all themes

### What I Changed or Rejected
I repeatedly had to correct the AI:
- It kept changing the layout when I only asked for color changes
- It added `!important` to consent-message rules which broke the color cascade
- It changed Original and Chill themes when I only asked for Invincible and Aespa
- It reverted layout changes when I asked for color changes

The core lesson: I needed to be extremely specific about what to change and what NOT to change.

### What I Still Do Not Fully Understand
CSS specificity cascade — when `!important` wins vs. when more specific selectors win.

### My Next Step
Prepare the class presentation.

---

## Entry 13: Stick Figure Animation and Music

### Date
2026-05-27

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
"Create a cramping stick figure animation (抽筋人 meme) for the landing page and add music from a Bilibili video."

### Why I Asked
The Invincible theme needed a visual element that matched the viral meme aesthetic.

### What AI Gave Me
- An SVG stick figure with 10 independent animation groups (head, torso, 4 arm segments, 4 leg segments, whole-body bounce)
- CSS keyframe animations using `steps()` easing for jerky motion
- Theme-specific colors (red for Invincible, pink for Aespa, green for Chill)
- Downloaded Mixkit track 958 as local MP3 for the Invincible theme music

### What I Used
Everything. The figure animates on the landing page with different colors per theme.

### What I Changed or Rejected
Nothing — the animation worked as requested.

### What I Still Do Not Fully Understand
How SVG transform-origin works with CSS animations.

### My Next Step
Prepare the class presentation materials.

---

## Entry 14: Presentation Preparation

### Date
2026-05-28

### AI Tool Used
Claude Code (claude-sonnet-4-6)

### What I Asked AI
"Help me prepare the Tech Demo and Technical Explanation sections of my class presentation. Write scripts I can read. All code examples must be in Python, not JavaScript."

### Why I Asked
The presentation requires explaining code and technical decisions. I needed clear scripts and Python-based code examples.

### What AI Gave Me
1. Tech Demo script covering 3 features (PPRA Test, Scoring Engine, Theme System)
2. Technical Explanation script covering data structures, libraries, and code architecture
3. Key function demo script walking through calculate_scores line by line
4. All code examples converted from JavaScript to Python equivalents
5. Simplified bullet-point versions for slides

### What I Used
Everything. The scripts are ready for the presentation.

### What I Changed or Rejected
Nothing — the scripts matched what I needed.

### What I Still Do Not Fully Understand
Nothing at this point.

### My Next Step
Practice the presentation and record it.

---

## Reflection

### Patterns I Noticed
1. **AI is good at structure, I'm good at content.** The AI designed the function signatures and JSON schemas, but I provided the psychological reasoning, the weight mappings, and the result descriptions.
2. **AI misses domain-specific flaws.** The AI designed `getResultDescription` as a static function — it didn't realize psychological assessment needs severity tiers. I caught this because I understand the domain.
3. **AI pushes back productively.** When I said "MBTI format," the AI flagged the credibility risk. When I said "one feature," the AI challenged me to think about Day 2. These challenges improved my product.
4. **I needed AI for the parts I can't do.** I don't know JavaScript, JSON structures, or function design. The AI filled those gaps. But I knew the psychology, the user experience, and the product vision.
5. **AI needs extremely specific instructions.** When I asked for color changes, the AI changed the layout. When I asked to fix one theme, it touched all themes. I learned to say "change ONLY this, do NOT touch anything else."
6. **AI can break things while fixing things.** Multiple times the AI fixed one bug while introducing another (adding `!important` that broke the color cascade, changing layouts when asked for colors). I had to repeatedly correct course.
7. **CSS specificity is hard for AI too.** The AI struggled with CSS specificity rules — it kept adding `!important` as a band-aid instead of understanding the cascade. This caused more bugs than it fixed.

### What I Can Do Independently Now
- Articulate the product pitch and differentiator
- Explain the 4 psychological frameworks and their values
- Describe the scoring mechanism (position × weight, normalize, tier)
- Name the user flow for all 3 pages
- List the error scenarios and responses
- Present the project with technical explanations
- Identify when AI changes things I didn't ask it to change

### What I Still Need AI For
- Writing the actual JavaScript code
- Designing the CSS (especially responsive/mobile)
- Implementing localStorage save/restore
- Building the HTML structure
- Testing the scoring engine math in code

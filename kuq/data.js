// ============================================================
// Kuq — PPRA Test Data Layer
// Questions, Weights, Result Descriptions, Named Profiles
// ============================================================

// ----------------------------
// LAYER METADATA
// ----------------------------
const LAYERS = {
  1: { name: "Attachment Theory", heading: "Part 1: How You Connect", subtext: "Let's start with how you generally feel in the relationship day-to-day." },
  2: { name: "RPCS", heading: "Part 2: When Things Get Tense", subtext: "Every couple disagrees. How do the two of you handle friction?" },
  3: { name: "Gottman's Conflict Styles", heading: "Part 3: In the Heat of the Moment", subtext: "Think about your most typical arguments when answering these." },
  4: { name: "ATWC Scale", heading: "Part 4: The Aftermath", subtext: "How do you feel after the dust settles?" }
};

// ----------------------------
// VALUE DEFINITIONS (15 total)
// ----------------------------
const VALUE_LAYERS = {
  attachment_anxiety: 1,
  attachment_avoidance: 1,
  compromise: 2,
  domination: 2,
  submission: 2,
  separation: 2,
  avoidance_rpcs: 2,
  interactional_reactivity: 2,
  validating_gottman: 3,
  volatile_gottman: 3,
  avoidant_gottman: 3,
  hostile_gottman: 3,
  shame_isolation: 4,
  renewal: 4,
  hostility_atwc: 4
};

// ----------------------------
// QUESTIONS (20 total, 5 per layer)
// ----------------------------
const QUESTIONS = [
  // ---- LAYER 1: Attachment Theory ----
  {
    question_id: 1,
    text: "Do you feel your partner blows hot and cold?",
    spectrum: { left: "Never", right: "Always" },
    layer: 1,
    value_weights: {
      attachment_anxiety: 1.0,
      hostile_gottman: 0.7,
      interactional_reactivity: 0.6,
      shame_isolation: 0.5,
      domination: 0.3,
      avoidance_rpcs: 0.2,
      hostility_atwc: 0.2,
      attachment_avoidance: -0.1
    }
  },
  {
    question_id: 2,
    text: "When there's a disagreement, I tend to shut down and stop talking.",
    spectrum: { left: "Never", right: "Always" },
    layer: 1,
    value_weights: {
      attachment_avoidance: 1.0,
      avoidance_rpcs: 0.9,
      avoidant_gottman: 0.8,
      separation: 0.6,
      submission: 0.3,
      attachment_anxiety: 0.2
    }
  },
  {
    question_id: 3,
    text: "I worry that my partner will leave me after a fight.",
    spectrum: { left: "Never", right: "Always" },
    layer: 1,
    value_weights: {
      attachment_anxiety: 1.0,
      shame_isolation: 0.6,
      interactional_reactivity: 0.5,
      submission: 0.4,
      hostile_gottman: 0.3
    }
  },
  {
    question_id: 4,
    text: "I need my partner to reassure me that they still love me during a conflict.",
    spectrum: { left: "Never", right: "Always" },
    layer: 1,
    value_weights: {
      attachment_anxiety: 1.0,
      interactional_reactivity: 0.5,
      domination: 0.3,
      submission: 0.2
    }
  },
  {
    question_id: 5,
    text: "I feel uncomfortable when my partner tries to get emotionally close to me.",
    spectrum: { left: "Never", right: "Always" },
    layer: 1,
    value_weights: {
      attachment_avoidance: 1.0,
      avoidant_gottman: 0.6,
      separation: 0.5,
      compromise: 0.2,
      attachment_anxiety: -0.2
    }
  },

  // ---- LAYER 2: RPCS ----
  {
    question_id: 6,
    text: "During arguments, I try to find a middle ground with my partner.",
    spectrum: { left: "Never", right: "Always" },
    layer: 2,
    value_weights: {
      compromise: 1.0,
      validating_gottman: 0.7,
      submission: 0.2,
      domination: -0.2
    }
  },
  {
    question_id: 7,
    text: "I tend to push my point until my partner gives in.",
    spectrum: { left: "Never", right: "Always" },
    layer: 2,
    value_weights: {
      domination: 1.0,
      hostile_gottman: 0.6,
      volatile_gottman: 0.4,
      interactional_reactivity: 0.4,
      compromise: -0.3
    }
  },
  {
    question_id: 8,
    text: "When things get heated, I withdraw completely from the conversation.",
    spectrum: { left: "Never", right: "Always" },
    layer: 2,
    value_weights: {
      avoidance_rpcs: 1.0,
      avoidant_gottman: 0.9,
      separation: 0.7,
      attachment_avoidance: 0.6,
      compromise: 0.1
    }
  },
  {
    question_id: 9,
    text: "During arguments, I snap or say things I don't really mean.",
    spectrum: { left: "Never", right: "Always" },
    layer: 2,
    value_weights: {
      interactional_reactivity: 1.0,
      volatile_gottman: 0.7,
      hostile_gottman: 0.5,
      hostility_atwc: 0.4,
      shame_isolation: 0.3
    }
  },
  {
    question_id: 10,
    text: "I give in to my partner just to keep the peace.",
    spectrum: { left: "Never", right: "Always" },
    layer: 2,
    value_weights: {
      submission: 1.0,
      avoidance_rpcs: 0.5,
      shame_isolation: 0.4,
      compromise: 0.2,
      domination: -0.3
    }
  },

  // ---- LAYER 3: Gottman's Conflict Styles ----
  {
    question_id: 11,
    text: "My partner and I argue passionately but usually come to a resolution.",
    spectrum: { left: "Never", right: "Always" },
    layer: 3,
    value_weights: {
      volatile_gottman: 1.0,
      renewal: 0.6,
      compromise: 0.4,
      interactional_reactivity: 0.4,
      hostile_gottman: -0.3
    }
  },
  {
    question_id: 12,
    text: "Our arguments involve eye-rolling, blame, or name-calling.",
    spectrum: { left: "Never", right: "Always" },
    layer: 3,
    value_weights: {
      hostile_gottman: 1.0,
      shame_isolation: 0.7,
      hostility_atwc: 0.6,
      interactional_reactivity: 0.5,
      attachment_anxiety: 0.3,
      renewal: -0.5
    }
  },
  {
    question_id: 13,
    text: "When conflict starts, I tend to go silent and wait for things to blow over.",
    spectrum: { left: "Never", right: "Always" },
    layer: 3,
    value_weights: {
      avoidant_gottman: 1.0,
      avoidance_rpcs: 0.8,
      attachment_avoidance: 0.7,
      separation: 0.5,
      submission: 0.3,
      renewal: 0.2
    }
  },
  {
    question_id: 14,
    text: "I take time to listen to my partner's perspective, even when I disagree.",
    spectrum: { left: "Never", right: "Always" },
    layer: 3,
    value_weights: {
      validating_gottman: 1.0,
      compromise: 0.6,
      renewal: 0.4,
      hostile_gottman: -0.3,
      submission: -0.1
    }
  },

  // ---- LAYER 4: ATWC Scale ----
  {
    question_id: 15,
    text: "After a fight, I feel ashamed and want to isolate myself.",
    spectrum: { left: "Never", right: "Always" },
    layer: 4,
    value_weights: {
      shame_isolation: 1.0,
      attachment_avoidance: 0.5,
      avoidance_rpcs: 0.4,
      attachment_anxiety: 0.3,
      renewal: -0.5
    }
  },
  {
    question_id: 16,
    text: "After a fight, my partner and I reconnect and things feel closer than before.",
    spectrum: { left: "Never", right: "Always" },
    layer: 4,
    value_weights: {
      renewal: 1.0,
      compromise: 0.5,
      validating_gottman: 0.4,
      shame_isolation: -0.6,
      hostility_atwc: -0.4
    }
  },
  {
    question_id: 17,
    text: "After a fight, I still feel bitter and resentful toward my partner.",
    spectrum: { left: "Never", right: "Always" },
    layer: 4,
    value_weights: {
      hostility_atwc: 1.0,
      hostile_gottman: 0.6,
      shame_isolation: 0.4,
      renewal: -0.7,
      attachment_anxiety: 0.3
    }
  },
  {
    question_id: 18,
    text: "After a major fight, I replay the argument in my head for days.",
    spectrum: { left: "Never", right: "Always" },
    layer: 4,
    value_weights: {
      shame_isolation: 0.8,
      attachment_anxiety: 0.7,
      hostility_atwc: 0.5,
      interactional_reactivity: 0.4,
      renewal: -0.4
    }
  },
  {
    question_id: 19,
    text: "I bring up past conflicts during new arguments.",
    spectrum: { left: "Never", right: "Always" },
    layer: 4,
    value_weights: {
      hostile_gottman: 0.8,
      hostility_atwc: 0.8,
      interactional_reactivity: 0.6,
      shame_isolation: 0.4,
      renewal: -0.5,
      compromise: -0.3
    }
  },
  {
    question_id: 20,
    text: "After we fight, I find it hard to be physically close to my partner.",
    spectrum: { left: "Never", right: "Always" },
    layer: 4,
    value_weights: {
      attachment_avoidance: 0.8,
      shame_isolation: 0.7,
      separation: 0.6,
      hostility_atwc: 0.5,
      renewal: -0.6,
      attachment_anxiety: 0.2
    }
  }
];

// ----------------------------
// VALUE LABELS (human-readable names)
// ----------------------------
const VALUE_LABELS = {
  attachment_anxiety: "Attachment Anxiety",
  attachment_avoidance: "Attachment Avoidance",
  compromise: "Compromise",
  domination: "Domination",
  submission: "Submission",
  separation: "Separation",
  avoidance_rpcs: "Avoidance",
  interactional_reactivity: "Interactional Reactivity",
  validating_gottman: "Validating",
  volatile_gottman: "Volatile",
  avoidant_gottman: "Avoidant",
  hostile_gottman: "Hostile",
  shame_isolation: "Shame / Isolation",
  renewal: "Renewal",
  hostility_atwc: "Hostility"
};

// ----------------------------
// RESULT DESCRIPTIONS (15 values x 3 tiers = 45 total)
// ----------------------------
const RESULT_DESCRIPTIONS = {

  // ==== LAYER 1: ATTACHMENT THEORY ====

  attachment_anxiety: {
    Low: "Your attachment anxiety is low. You generally feel secure in your relationship and trust that your partner will be there for you, even during disagreements. Conflicts may be uncomfortable, but they don't trigger a deep fear of losing the relationship. This sense of security is a real strength — it allows you to engage in conflict without feeling like the relationship itself is at stake.",
    Moderate: "Your attachment anxiety is moderate. You sometimes worry about your partner's feelings for you, especially during or after arguments. You might seek reassurance occasionally, but you can usually self-soothe and regain your footing. This level of anxiety is common and manageable — awareness of it is the first step to not letting it drive your conflict behavior.",
    High: "Your attachment anxiety is high. In conflicts, you likely feel an urgent need to resolve things immediately, because disconnection feels unbearable. This can lead you to pursue your partner, demand reassurance, or become emotionally flooded quickly. The underlying question driving you is often: 'Are you still there for me?' Understanding this pattern helps you see that some of your conflict reactions are less about the surface issue and more about your deep need for security."
  },

  attachment_avoidance: {
    Low: "Your attachment avoidance is low. You're comfortable with emotional closeness and vulnerability in your relationship. When conflicts arise, you can stay present and engaged rather than pulling away. This openness allows for genuine resolution and deeper connection.",
    Moderate: "Your attachment avoidance is moderate. You value your independence and sometimes find it difficult to fully open up during emotional moments. You might occasionally pull back when things get too intense, but you can usually re-engage. Recognizing when you're starting to shut down is key — it gives you the choice to stay in the conversation.",
    High: "Your attachment avoidance is high. When emotions run high, your instinct is to protect yourself by creating distance — physically, emotionally, or both. You might shut down, change the subject, or leave the room. Underneath this withdrawal is often a deep discomfort with vulnerability and a belief that relying on others leads to disappointment. The challenge is learning that closeness doesn't have to mean losing yourself."
  },

  // ==== LAYER 2: RPCS ====

  compromise: {
    Low: "Your tendency toward compromise is low. You may find it difficult to meet your partner halfway during disagreements. This could mean you tend toward either dominating the conversation or avoiding it entirely. Building the skill of compromise starts with small moments — asking 'What do you think?' and genuinely listening to the answer.",
    Moderate: "Your tendency toward compromise is moderate. You can find middle ground with your partner some of the time, but it may not be your default response under stress. You might compromise well on small issues but struggle when the stakes feel higher. Practicing compromise on low-stakes disagreements can build the muscle for the harder ones.",
    High: "Your tendency toward compromise is high. You naturally seek solutions that work for both you and your partner. This is one of the healthiest conflict strategies — it signals respect for both people's needs. The one thing to watch for: make sure your 'compromise' isn't actually you quietly giving up what you need. True compromise means both people adjust."
  },

  domination: {
    Low: "Your tendency toward domination is low. You don't feel a strong need to 'win' arguments or push your partner into agreement. This allows space for your partner's perspective. Just make sure low domination doesn't mean you're suppressing your own needs — having a voice in conflict is healthy.",
    Moderate: "Your tendency toward domination is moderate. You sometimes push hard for your preferred outcome, especially when you feel strongly about something. This isn't always bad — sometimes you genuinely have the better solution. The key is noticing when your partner starts to shut down. If they're going quiet, you may have pushed past the point of collaboration.",
    High: "Your dominant conflict style is Domination. When disagreements arise, you have a strong impulse to take charge and push for your preferred outcome. While this can feel effective in the short term, it often leaves your partner feeling unheard or overwhelmed, escalating the fight. Your pattern says: 'I need to win this for the conflict to end.' A key growth area is learning to notice when this urge kicks in, and experimenting with stepping back, listening, and seeking a collaborative solution — which the Compromise strategy represents."
  },

  submission: {
    Low: "Your tendency toward submission is low. You hold your ground in conflicts and express your needs clearly. This is healthy — your voice matters in the relationship. Just make sure standing your ground doesn't tip into refusing to budge at all.",
    Moderate: "Your tendency toward submission is moderate. You give in to your partner sometimes, especially when you sense the conflict is becoming too uncomfortable. Occasional yielding is normal, but if you notice a pattern of always being the one to back down, it may be worth examining what's driving that — fear of abandonment, desire for peace, or feeling that your needs don't matter as much.",
    High: "Your conflict pattern leans heavily toward Submission. You frequently give in to your partner's wishes to avoid conflict or keep the peace. On the surface, this looks like harmony — but underneath, resentment often builds. You may feel unheard, invisible, or taken for granted. The growth edge here is learning to voice your needs even when it's uncomfortable, and trusting that a healthy relationship can withstand disagreement."
  },

  separation: {
    Low: "Your tendency toward separation is low. You don't use emotional distance as a conflict strategy. You stay engaged with your partner even when things are hard. This closeness is a foundation for genuine resolution.",
    Moderate: "Your tendency toward separation is moderate. When conflicts get painful, you sometimes pull back emotionally — not necessarily shutting down, but creating a buffer. This can be a protective mechanism, and it's not always harmful. The question is whether the distance helps you process or just delays the real conversation.",
    High: "Your tendency toward emotional separation is high. When conflict arises, you instinctively create distance — not just in the moment, but as a broader pattern. You may feel like you're slowly detaching from the relationship, protecting yourself from further hurt. While self-protection is understandable, persistent separation makes genuine resolution nearly impossible. The first step is recognizing that the distance you're creating may be the very thing driving the conflict cycle."
  },

  avoidance_rpcs: {
    Low: "Your tendency toward avoidance is low. You face conflicts head-on rather than sidestepping them. This directness is a strength — it means issues get addressed before they fester. Just make sure your directness stays constructive and doesn't become confrontational.",
    Moderate: "Your tendency toward avoidance is moderate. You avoid some conflicts, especially when you sense they'll be particularly painful or when you're not sure how to express what you're feeling. This isn't always unhealthy — sometimes a pause is wise. But if you notice you're consistently avoiding the same topics, those unspoken issues may be silently damaging the relationship.",
    High: "Your conflict pattern is heavily avoidance-driven. You consistently sidestep disagreements, change the subject, or minimize problems to keep the peace. While this may reduce short-term tension, it allows unresolved issues to accumulate. Over time, the weight of everything unsaid can become more damaging than any single argument. The growth area here is learning to tolerate the discomfort of a direct conversation — even a messy one is better than silence that breeds resentment."
  },

  interactional_reactivity: {
    Low: "Your interactional reactivity is low. You stay emotionally regulated during conflicts — you can disagree without losing your temper or saying things you regret. This emotional stability is a real asset. It creates safety for your partner to express themselves honestly.",
    Moderate: "Your interactional reactivity is moderate. You sometimes get emotionally overwhelmed during arguments — snapping, raising your voice, or saying things in the heat of the moment that you later regret. You can usually recover, but the damage from those moments lingers. Building a habit of pausing before responding can help you stay in control.",
    High: "Your interactional reactivity is high. During conflicts, your emotions often overwhelm your ability to think clearly. You may snap, say hurtful things, raise your voice, or act impulsively — then feel intense regret afterward. Your nervous system treats conflict as a threat, triggering a fight response. Learning to recognize your physiological signs of flooding (racing heart, tight chest) and calling a timeout before you say something regrettable is one of the most impactful changes you can make."
  },

  // ==== LAYER 3: GOTTMAN'S CONFLICT STYLES ====

  validating_gottman: {
    Low: "Your validating conflict style is low. You may struggle to actively listen to your partner's perspective during disagreements, especially when you feel strongly about your own position. This doesn't mean you're a bad partner — it means the skill of validation (hearing your partner out, showing you understand even when you disagree) is an area for growth.",
    Moderate: "Your validating conflict style is moderate. You can listen to your partner's perspective some of the time, but under stress, you may default to defending your own position. You're capable of validation — the challenge is doing it consistently, especially when you feel attacked or misunderstood.",
    High: "Your validating conflict style is high. You take time to listen to your partner's perspective and show that you understand, even when you disagree. This is one of the healthiest couple conflict styles — it creates emotional safety and makes genuine resolution possible. The strength here is that validation doesn't mean agreement; it means 'I hear you, and your experience matters to me.'"
  },

  volatile_gottman: {
    Low: "Your volatile conflict style is low. Your arguments tend to be calm and measured rather than emotionally intense. This can be healthy — it means you don't escalate unnecessarily. Just make sure the low intensity isn't because you're avoiding conflict entirely rather than engaging with it calmly.",
    Moderate: "Your volatile conflict style is moderate. Your arguments can get emotionally intense — raised voices, passionate debates, strong feelings. This isn't inherently bad; volatile couples often have deep passion and genuine engagement. The question is whether the intensity leads to resolution or just leaves both of you exhausted.",
    High: "Your volatile conflict style is high. Your conflicts are loud, emotionally charged, and intense. You and your partner both engage fully — sometimes too fully. Volatile couples often have a deep underlying connection, and the passion that fuels your arguments can also fuel your makeups. The risk is that the intensity can tip into territory where someone gets hurt. Learning to channel the passion without letting it become destructive is the key growth area."
  },

  avoidant_gottman: {
    Low: "Your avoidant conflict style is low. You don't shy away from disagreements with your partner. You engage directly rather than hoping problems will resolve on their own. This willingness to face conflict is a foundation for real resolution.",
    Moderate: "Your avoidant conflict style is moderate. You sometimes go silent during conflicts or hope that problems will blow over without a direct conversation. This can work for minor issues, but for bigger ones, avoidance often means the problem resurfaces later — bigger and more entrenched.",
    High: "Your conflict pattern as a couple is Avoidant. When tension arises, one or both of you tend to go silent, change the subject, or wait for things to 'blow over.' On the surface, this can look like a peaceful relationship — but underneath, issues are being buried rather than resolved. Avoidant couples often feel emotionally distant over time, not because they don't care, but because they've never learned how to fight productively. The growth area is learning that engaging with conflict — even clumsily — is better than avoiding it entirely."
  },

  hostile_gottman: {
    Low: "Your hostile conflict style is low. Your arguments don't involve contempt, blame, or name-calling. You can disagree without attacking each other's character. This is a strong foundation — it means your conflicts stay about the issue, not about tearing each other down.",
    Moderate: "Your hostile conflict style is moderate. Your arguments sometimes cross the line into eye-rolling, blame, or dismissive comments. These moments of contempt may seem small, but research shows they are one of the most corrosive patterns in relationships. Catching yourself in the moment — noticing when you're about to roll your eyes or launch into blame — is the first step to breaking the pattern.",
    High: "Your conflict pattern as a couple is Hostile. This is the most corrosive of the four couple conflict styles. In your dynamic, arguments often feel unsafe — filled with eye-rolling, blame, and defensive retorts. Rather than resolving issues, you likely cycle through the same painful fights, each time chipping away at the foundation of your relationship. The good news: a pattern like this doesn't mean the relationship is doomed, but it does mean you need to actively replace contempt and defensiveness with 'softened startup' and active listening. Even small steps — like one partner calling a pause when criticism begins — can begin to shift this dynamic."
  },

  // ==== LAYER 4: ATWC SCALE ====

  shame_isolation: {
    Low: "Your post-conflict shame and isolation are low. After fights, you can process what happened without turning against yourself. You don't spiral into self-blame or withdraw from your partner. This resilience allows you to move forward after disagreements without carrying heavy emotional baggage.",
    Moderate: "Your post-conflict shame and isolation are moderate. After some fights, you feel a pull to withdraw and replay the argument in your head. You might blame yourself or feel a lingering sense of failure. This is common, but if it's happening regularly, it's worth examining — shame after conflict can be as damaging as the conflict itself.",
    High: "After your worst conflicts, you experience intense shame and isolation. You may replay the argument in your head, blame yourself, and withdraw emotionally. This post-conflict pattern can be as damaging as the fight itself, creating a cycle where shame leads to distance, which leads to more insecurity, which triggers the next conflict. Recognizing this pattern — that your post-fight shame is part of the cycle, not just a reaction to it — is the first step to breaking it."
  },

  renewal: {
    Low: "Your post-conflict renewal is low. After fights, you and your partner struggle to reconnect. The conflict may end, but the emotional distance remains. This lack of repair can leave both of you carrying unresolved tension into the next disagreement. Learning to 'make up' — even with a simple gesture like a touch or an apology — can break this pattern.",
    Moderate: "Your post-conflict renewal is moderate. You and your partner sometimes reconnect after fights, but it's not consistent. Some conflicts lead to closeness; others leave lingering tension. The difference often depends on how the fight went — if it stayed respectful, renewal is easier. If it got hostile, the repair is harder.",
    High: "Your post-conflict renewal is high. After fights, you and your partner reconnect and often feel closer than before. This is a powerful strength — it means your conflicts, even when painful, ultimately deepen your connection rather than erode it. Couples who can fight and repair have a resilience that couples who avoid conflict entirely often lack."
  },

  hostility_atwc: {
    Low: "Your post-conflict hostility is low. After fights, you don't carry lasting bitterness or resentment. You can let go of the argument and move forward. This ability to release rather than hold onto conflict is a significant strength.",
    Moderate: "Your post-conflict hostility is moderate. After some fights, you feel lingering bitterness or resentment that takes time to fade. This is normal — not every conflict can be neatly resolved in one conversation. The question is whether the resentment fades on its own or accumulates over time. If you notice you're bringing up old fights in new arguments, the hostility may be building.",
    High: "Your post-conflict hostility is high. After fights, you carry deep, lasting bitterness and resentment toward your partner. Old arguments don't fade — they accumulate, fueling future conflicts. This pattern is one of the most destructive in relationships, because it means every new fight is also a fight about every past fight. Breaking this cycle requires actively processing and releasing old resentments, often with professional support."
  }
};

// ----------------------------
// NAMED PROFILES (5 total)
// ----------------------------
const NAMED_PROFILES = [
  {
    name: "The Anxious-Hostile Cycle",
    trigger: {
      required_high: ["attachment_anxiety", "domination", "hostile_gottman", "shame_isolation"]
    },
    conclusion: "Because your drive for connection is so high, when your partner withdraws or blows hot and cold, panic sets in. This panic translates into a push for control (Domination) and sharp words (Hostility) to force a reaction from them. You aren't trying to be mean; you are trying to be seen. But the hostility often causes your partner to retreat further, leaving you with intense feelings of shame and isolation after the fight ends.",
    feedback: "The next time you feel the panic of disconnection, your instinct will be to demand engagement or lash out. Instead, try pausing and naming the underlying emotion out loud: 'I am feeling really disconnected right now and it's making me panic. I need a little reassurance.' Name your feeling, not your partner's failure."
  },
  {
    name: "The \"Keep the Peace\" Cycle",
    trigger: {
      required_high: ["attachment_avoidance", "avoidance_rpcs", "avoidant_gottman", "renewal"]
    },
    conclusion: "You prioritize harmony over resolution, often burying your own needs and shutting down the argument quickly to de-escalate tension, which temporarily restores the peace but leaves the root issues untouched. Over time, the accumulation of unspoken needs creates a quiet distance between you — a relationship that looks peaceful but feels hollow.",
    feedback: "The next time you feel the urge to shut down or smooth things over, try staying in the conversation for just two more minutes. You don't have to solve the problem — just name one thing you actually need. 'I need you to check in with me during the day' is harder to say than 'it's fine,' but it's the difference between peace and genuine connection."
  },
  {
    name: "The Volatile-Passionate Cycle",
    trigger: {
      required_high: ["attachment_anxiety", "interactional_reactivity", "volatile_gottman", "renewal"]
    },
    conclusion: "Your conflicts are loud and emotionally charged because you fight hard to be heard and understood, but you also make up intensely, often using the heat of the argument as a twisted reassurance that you both still care. The passion that fuels your fights is the same passion that fuels your connection — but without boundaries, the intensity can become addictive and exhausting.",
    feedback: "Your passion is a strength, but it needs direction. The next time you feel the argument escalating, try this: before you respond, take one breath and ask yourself, 'Am I trying to be heard, or am I trying to win?' If it's the first, slow down and say what you actually feel. If it's the second, pause — you're about to cross from passion into damage."
  },
  {
    name: "The Rational Wall",
    trigger: {
      required_high: ["attachment_avoidance", "domination", "avoidant_gottman", "shame_isolation"]
    },
    conclusion: "When conflict strikes, your instinct is to retreat to cold logic and physical distance to protect yourself, inadvertently taking control of the argument by deciding when — or if — the two of you will communicate. You may feel like you're being the 'reasonable one,' but from your partner's perspective, your withdrawal feels like punishment. The wall you build to protect yourself becomes the thing that keeps you isolated.",
    feedback: "The next time you feel the urge to withdraw or go logical, try naming what's happening in your body instead. 'My chest is tight and I want to leave the room' is more honest — and more connective — than 'I need some space.' Your partner can work with feelings. They can't work with a wall."
  },
  {
    name: "The Anxious-Appeaser Cycle",
    trigger: {
      required_high: ["attachment_anxiety", "submission", "validating_gottman", "shame_isolation"]
    },
    conclusion: "Terrified that the conflict will lead to abandonment, you quickly absorb the blame and submit to your partner's perspective, leaving you feeling emotionally drained, resentful, and lonely even after the fight is 'resolved.' On the surface, you look like the peacemaker — validating, accommodating, easy-going. But underneath, you're slowly losing yourself. The validation you offer your partner rarely comes back to you.",
    feedback: "The next time you feel the pull to agree just to end the fight, try this: pause and say, 'I want to understand your perspective, but I also need a minute to figure out what I actually think.' You don't have to fight. You just have to stop disappearing. Your needs are not a burden — they're a requirement for a relationship that actually works."
  }
];

// ----------------------------
// BALANCED PROFILE (fallback)
// ----------------------------
const BALANCED_PROFILE = {
  name: "The Balanced Communicator",
  conclusion: "Your results show a relatively balanced conflict profile. You don't strongly lean toward any single destructive pattern — you can compromise, you can express your needs, and you can recover from disagreements. This doesn't mean your relationship is perfect, but it does mean you have a healthy foundation to build on.",
  feedback: "Your growth area isn't fixing a broken pattern — it's deepening a working one. Try this: the next time you have a minor disagreement, practice naming your emotion before stating your position. 'I feel anxious when...' before 'You always...' It's a small shift that can turn a good dynamic into a great one."
};

// ----------------------------
// CONTRADICTION PROFILE (fallback)
// ----------------------------
const CONTRADICTION_PROFILE = {
  name: "The Push-Pull Dynamic",
  conclusion: "Your results show a deep internal conflict: a high need for closeness battling an intense fear of getting hurt. You likely draw your partner in, only to push them away when they get too close. This push-pull pattern is one of the most confusing and painful dynamics for both partners — you want connection but can't tolerate the vulnerability it requires.",
  feedback: "The push-pull pattern often comes from past experiences where closeness led to pain. You don't have to resolve this alone. But you can start by noticing the cycle in real time: 'I'm pulling away right now, and I think it's because I'm scared, not because I don't care.' Naming the pattern is the first step to choosing differently."
};

# Capturing evidence well

## Pacing

Ask in batches of two or three, and **skip anything the conversation already
answered**. If someone has just spent ten minutes describing a migration, do not ask
"what did you do?". Reflect it back and ask only what is genuinely missing.

Aim for one round of questions, not an interview.

## The recovery for "I don't know the impact"

This is the most common stall, and the answer is almost never "leave it blank".

- "What would have happened if you hadn't done it?"
- "Who stopped having a problem?"
- "What did people say afterwards?"
- "What can you do now that you couldn't before?"

If the honest answer is still "I don't know yet", record that. An empty impact field
is legitimate and scores lower completeness — which is information, not a failure.

## Propose, don't assert

The difference is scope and reversibility. Every statement about capability must be
scoped to *this piece of work*, sourced to something they said, and offered for
rejection.

| Don't | Do |
|---|---|
| "You're an expert in distributed systems." | "This reads as evidence you can design under real reliability constraints. Fair, or too strong?" |
| "This shows exceptional leadership." | "You made the call when nobody else would. Is 'made a contested decision under time pressure' accurate?" |
| "You improved performance by 40%." | "You said it got 'a lot faster' — do you have a number, or shall I record it as you said it?" |
| "Logged to LOCO ✅" | "Drafted this in LOCO — have a look and tell me if it's right." |

After they confirm, it becomes *their* claim. Before that it is your suggestion, and
should sound like one.

## Verbs, calibrated

Overclaiming is the fastest way to make a record untrustworthy, and the person is
usually the last to notice it happening on their behalf.

- Did it themselves → *built, wrote, designed, shipped, fixed*
- Drove it, others helped → *led, coordinated, drove*
- Contributed to something larger → *contributed to, supported, helped*
- Decided → *chose, prioritised, cut scope on*

If they say "we", find out which of these it was before writing anything.

## Confidentiality

Do the redaction pass **before** showing them the draft, so they are never put in
the position of un-saying something.

- Named colleagues → roles ("a staff engineer", not "Priya")
- Client and employer names → ask, unless it is obviously public
- Internal metrics → flag and ask before recording
- Anything under NDA → do not record it, even privately

For confidential work, set `is_confidential: true`, capture the full private
narrative, and propose a `public_draft`:

```
headline:       Led a six-month platform migration across ~40 services
redaction_note: client and system names omitted
```

The private record keeps the specifics. The public headline carries the shape. That
is the whole point — someone employed can be visible without leaking anything.

## What never becomes public

Say this plainly when it comes up, because it is the thing people are most wary of:

- Evidence — the seven answers — is **never** public. There is no setting for it.
- Reflections, notes and raw conversation are never stored.
- Objectives and phase are private unless explicitly published.
- Publishing happens in the web app, by them, never by an agent.

## Batch capture

For a weekly review with several things at once: ask question 1 across all of them
first, then go deep only on the two or three with real artifacts. Trying to run the
full seven questions on six items produces six thin records instead of two good
ones.

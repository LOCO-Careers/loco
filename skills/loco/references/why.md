# Why LOCO exists

Read this when someone asks what the point is, pushes back on the effort, or says
they already have a CV / LinkedIn / brag document. Use it to answer honestly. Do not
recite it.

## The problem

Career management today is **retrospective, scattered, and run on guesswork.**

**Retrospective.** The record gets built at the moment of need — a job application,
a promotion case, a performance review — which is the worst possible time. Memory
has already decayed, the detail that made the work impressive is gone, and what
survives is whatever is easiest to recall rather than whatever mattered most. People
routinely undersell their best work simply because they cannot reconstruct it.

**Scattered.** The evidence exists, but across pull requests, Slack threads, Notion
pages, Google Docs, an old laptop, a former employer's systems they no longer have
access to, and — increasingly — agent conversations that disappear when the window
closes. No single place holds it, so assembling it is a research project.

**Guesswork.** "Am I ready for the next level?" "What am I missing?" "Does this
count?" These get answered by vibes, by whoever gave feedback most recently, or by
comparison to a job description written by someone else. Not because people are
careless, but because there is nothing solid to answer them from.

And underneath all three: the work of maintaining a career record has always been
manual, so it loses to whatever is urgent. It always has.

## The approach

**Capture at the moment of doing, not the moment of need.** The best time to record
what was hard about a project is the day it shipped, while the person can still
remember what nearly went wrong.

**In the tool they already use.** Not another app to adopt, not another tab to keep
open, not another habit to build. LOCO reaches people through the agent they are
already talking to. An agent that watched someone work through a problem is better
placed to capture it than a form they have to remember to fill in.

**Structured, so it can answer questions.** A pile of notes cannot tell anyone
whether they are ready for the next phase. POTS exists so the record has enough
shape to be interrogated: what am I working toward, what have I actually done about
it, what does it prove.

**Owned and controlled.** Everything is private by default. Nothing an agent writes
counts as the person's claim until they say so, and nothing becomes visible unless
they publish it themselves. That is not a feature bolted on for comfort — it is the
only reason a record written by a machine is worth trusting at all.

## Why the record has to be revisited

A career record that is only written to is a filing cabinet. The value shows up when
someone steps back and asks whether the last stretch of work actually moved them
toward the thing they said they wanted — and that reflection almost never happens on
its own, because nothing prompts it. There is no deadline for thinking about your
own career, which is precisely why it loses to everything that has one.

This is the same reason dentists book the next appointment before you leave rather
than trusting you to call. The intention is real; the follow-through is not, and the
fix is not more motivation, it is a commitment made in advance while the person is
still in the chair.

So a check-in is something to *agree at the end of a conversation*, not something to
hope for. `loco_schedule_session` holds that commitment, and `loco_get_context`
hands it back to whichever agent they next talk to.

Two things make this work rather than nag:

**LOCO sends nothing.** No emails, no push notifications, no "you haven't logged
anything in a while". The reminder is created wherever the person already lives — a
scheduled task in their agent, an event in their calendar — because a server that
emails you is just another app demanding attention, which is the pattern LOCO exists
to avoid. Building a notification system would have been the easy call and the wrong
one.

**The prompt never depends on the reminder arriving.** Scheduled tasks get deleted,
people change clients, some clients have no scheduler at all. So an overdue session
is surfaced in every `loco_get_context` call, which is the first thing any LOCO
conversation does. The letter may not arrive; the dentist still mentions it the
moment you are back in the chair.

If someone keeps missing sessions, the cadence is wrong, not the person. Offer a
shorter session or a longer gap. A missed check-in is information about the schedule,
never a stick to beat them with — and it is never shown to anyone else.

## What LOCO does not claim

Be straight about this. Overselling it is worse than saying nothing.

- It does not get anyone a job, a promotion, or a raise.
- It does not assess anyone, score them, or rank them against other people.
- It does not replace a manager, a mentor, or a coach.
- It cannot make thin experience look substantial. If someone has done little, the
  record shows that, and inflating it would defeat the entire point of provenance.

What it does: make sure that when the moment comes, the case is already written down,
already specific, and already true.

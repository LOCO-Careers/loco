# POTS in detail

## The six phases

Every phase has the same meta-objective: **become a credible candidate for the next
phase.** That is the sentence to keep returning to when objectives drift into
activity lists.

| Phase | Where they are | "Next" means |
|---|---|---|
| Education | Studying, or building foundations before a first role | Entering the job market as one of the more compelling candidates |
| Early Career | First roles; proving they can do the work | Owning outcomes, not just tasks |
| Mid Career | Trusted operator with a track record | Leading through others |
| Leadership | Accountable for teams and their results | Owning strategy, not just delivery |
| Executive | Accountable for a function or the enterprise | Stewarding rather than operating |
| Legacy | Advising, governance, building institutions | Succession and what outlasts them |

Sub-phases are server-owned — read them from `loco_get_context({include:
['vocabulary']})`. Never invent one. A rejected value comes back with the legal set
attached; use it and move on without making a fuss about it.

## Awkward cases

These are common and none of them are edge cases to the person living them.

**Career changers.** Phase follows the *new* field, not total years worked. Someone
with fifteen years in law and six months in engineering is Early Career in
engineering — and their prior seniority is real context, not a demotion. Say that
explicitly; it is the most common place this feels insulting if handled carelessly.

**Founders.** Usually Mid Career or Leadership by scope rather than title.
"Founder" is not a phase.

**Strong ICs who refuse management.** Deepening within Mid Career is a legitimate
long-term position, not a stalled Leadership transition. Do not push them up a
ladder they have deliberately stepped off.

**Returners.** Someone back after caregiving, illness or a sabbatical resumes the
phase they were in. Use a context flag with dates rather than treating the gap as a
regression.

**Portfolio careers.** Pick the phase where most of their evidence is being
generated now, and name the others in `intent_statement`.

## Context flags

Flags explain the *shape* of someone's time, especially its gaps. Offer them
proactively — a flag with dates turns a gap into a fact, so nobody has to write a
paragraph justifying it.

`international_migration`, `parental_leave`, `caregiving`, `freelance`,
`entrepreneurial_detour`, `career_change`, `health_interruption`,
`military_service`, `return_to_education`, `layoff`, `sabbatical`.

## Objectives

An objective is a **testable credibility claim** tied to next-phase readiness.

Good:
- "Have shipped and operated a production service used by another team"
- "Be the person others ask about payments"
- "Have led a piece of work end to end, including the parts I'd rather delegate"

Not objectives:
- "Get better at system design" — an activity, not an outcome
- "Get promoted" — someone else's decision; name what would make it obvious
- "Be respected" — real, but needs a claim someone could check

Aim for coverage across the three parts of credibility. A set that is all Competence
is the most common weak set — it usually means Character and Chemistry evidence is
being done but not captured.

Cap is three, enforced by the database. If they want a fourth, something is finished
or is really a task.

## Task or SEDO?

- "I did X" → **Task**
- "I shipped / built / presented / published a coherent thing someone could look
  at" → **SEDO**

Tasks can hang off a SEDO via `parent_work_event_id`.

**Not SEDOs:** attending something, intentions, job titles, "learned a lot", things
only they can see.

If work does not fit any current objective, log it with `objective_id: null` and say
so. A run of unaligned work is a signal the objectives are stale — surface it rather
than forcing a fit.

## Planned vs done

The same vocabulary runs forwards. A **planned** Task or SEDO (`loco_set_plan`) is
something they have agreed to do; it always serves a named objective, and Tasks may
nest one level under a planned SEDO.

The wall between the two directions is absolute:

- A planned item is never work, never evidence, never public, never "done".
- It completes only when a real work event fulfils it (`fulfils_plan_item_id`) and
  the person confirms **both** the work and the fulfilment. "Some work toward it"
  (`plan_item_id`) is progress, not completion — a SEDO like "deliver the leadership
  presentation" survives research, interviews, a deck and a rehearsal, and completes
  on the delivery.
- If they say they intend to do something, that is a plan. If they say they did
  something, that is work. When someone describes future work to `loco_log_work` the
  server refuses the future date and points at `loco_set_plan` — trust it.

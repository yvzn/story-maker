# Bedtime Story UX and UI design brief

## Purpose

This brief defines the experience the design team should prototype for Story Maker. It is deliberately expressed as observable product behavior rather than a visual theme or implementation specification.

The primary promise is **“Make a bedtime Story together.”** The product is child-operable for ages 5–8, simple enough for ages 3–5 with adult help, and calm enough for bedtime.

## Design direction

- **Calm bedtime foundation:** quiet composition, comfortable reading, low visual noise, and playful accents only at moments of choice.
- **Child-facing language:** use warm, short sentences and clear action verbs. Do not expose technical terms such as Feature Option, Global Setting, or Chapter Role in the primary child UI.
- **Co-creation, not configuration:** choices should feel like ingredients in a Story, not fields in a business form.
- **Text-first inclusion:** illustrations and sound may enrich the experience, but no essential instruction or meaning may depend on them.
- **No extrinsic game loop:** no scores, streaks, rewards, collectibles, rankings, or unlocks in the bedtime core.

## Principles and observable rules

The rules below use Dan Norman and Steve Krug as rationale, not as a rigid checklist.

### Make the primary action obvious

Related to Krug's “don't make me think” and Norman's visibility principle.

- The landing view has one dominant **Make a Story** action.
- Continue and Favorites appear only when they exist and remain secondary.
- Parent Control uses one stable, quiet entry point from the landing view and Settings.
- Every state has one visually primary next action.

### Recognition over recall

Related to Krug's use of familiar conventions and Norman's conceptual models.

- Explain modes by outcome, not product terminology:
  - **Choose everything first**
  - **Choose as we go**
- Show one Chapter choice at a time.
- Present each Feature Option as a Choice Card with a child-facing name and short description.
- Keep progress visible as **Chapter N of 6** with a simple six-dot or shape indicator.
- Never require the child to remember earlier selections to understand where they are.

### Clear affordances and constraints

Related to Norman's signifiers, affordances, and constraints.

- Choice Cards look and behave like selectable objects.
- A selected Choice Card has a strong visual state and accessible status text.
- The persistent Next action is unavailable until the current choice is valid.
- Story Mode's final review exposes Change actions for each ingredient.
- Do not show controls that cannot work in the current state.

### Immediate, quiet feedback

Related to Norman's feedback principle.

- Selection feedback is immediate and visual; optional motion is subtle.
- Do not require sound to confirm an action.
- Loading uses a calm message such as **“Your next Chapter is growing…”**.
- Never show fake percentage progress for generation.
- Continue, backtracking, settings changes, and errors visibly change the current state.

### Keep the interface simple

Related to Krug's omission of needless words and Norman's simplicity principle.

- Use one decision per screen in the Story Configuration Flow.
- Keep secondary preferences in a calm Settings drawer or page.
- Keep the Reading View focused on text, progress, Listen/pause, and Continue.
- Keep Back and secondary Settings available but visually quieter.
- Do not turn six Chapters into six simultaneous business-like panels.

### Make recovery blame-free

Related to Norman's error prevention and recovery principles.

- Errors appear inline where the child is working.
- Use plain, reassuring language that conveys **“This is not your fault.”**
- Make Retry the primary recovery action.
- Offer Go Back or Start Over as the secondary action.
- Preserve all valid earlier choices and Chapters.
- Never silently substitute content or switch languages.

### Keep navigation explicit

- The child always chooses when to continue; there are no automatic transitions.
- A child does not need to finish listening or reading before continuing.
- Backtracking to an earlier Chapter discards all later choices and generated Chapters.
- Changing language or Chapter Length after generation begins warns that the Story will restart and requires confirmation.

### Design for bedtime accessibility

- Meet WCAG 2.2 AA fundamentals.
- Use at least 44 by 44 CSS-pixel touch targets.
- Provide visible keyboard focus and a logical reading/focus order.
- Reflow at 200% text size.
- Maintain sufficient contrast in light and dark themes.
- Respect reduced-motion preferences.
- Keep the full Chapter text visible alongside read-aloud.
- Treat browser/device text-to-speech as optional enhancement; failure never blocks reading.

## Core prototype flow

The prototype should validate one complete loop rather than six polished variants:

1. **Landing:** Make a Story is dominant. Continue, Favorites, and Parent Control appear only as applicable.
2. **Mode choice:** Present Choose everything first and Choose as we go with short explanations.
3. **Global Settings:** Keep language and Chapter Length clear and contextual; defer secondary preferences to Settings.
4. **Choice:** Present one Chapter prompt and a set of equal Choice Cards. Tap selects; Next advances.
5. **Story Mode review:** Show a narrative recipe of the six selected ingredients with accessible labels and Change actions, then Start Story.
6. **Generation:** Show a calm, non-deceptive waiting state.
7. **Reading View:** Show Chapter text, gentle Chapter N of 6 progress, a future illustration region, Listen/pause, and Continue.
8. **Guided Adventure continuation:** Continue leads to the next Chapter choice rather than an automatic transition.
9. **Representative failure:** Show inline, blame-free Retry and Go Back/Start Over recovery while preserving valid earlier work.

## Component and content rules

- **Primary action:** one per state, expressed as a clear verb.
- **Choice Card:** equal visual weight; child-facing name; short description; selected, focus, unavailable, loading, and error states.
- **Progress indicator:** visual plus text alternative; never the only way to understand position.
- **Reading View:** text is the largest and most visually important content.
- **Illustration region:** stable non-essential area with an accessible label and graceful empty state; missing media must not look like a broken dashboard panel.
- **Settings:** separate secondary surface; clearly warn and confirm when a change restarts generation.
- **Errors:** inline, short, reassuring, actionable; never blame the child.
- **Dark mode:** follow device preference by default, with a locally stored manual override.
- **API content:** use requested-language child-facing metadata from the API. Missing localized content is explicit and recoverable, never silently replaced.

## Review checklist

Before implementation proceeds, the prototype should demonstrate:

- A child identifies the primary action immediately.
- A child understands the two modes without knowing their technical names.
- A child can choose a Feature Option without adult explanation.
- The interface communicates current Chapter and total progress.
- The Story Mode review makes choices recognizable and changeable.
- The first Chapter is reachable without dead ends.
- Continue is always explicit.
- A representative failure is recoverable without blame or lost valid work.
- Reading remains understandable with illustrations, sound, and motion absent.
- Keyboard, screen-reader, text-resize, contrast, and reduced-motion behavior are represented in the prototype states.
- Parent Control is findable by an adult without competing with the child's main flow.

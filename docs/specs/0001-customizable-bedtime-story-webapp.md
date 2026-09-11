# Customizable bedtime story webapp

## Problem Statement

Children and families need a simple, accessible way to create and read bedtime Stories that feel personalized without requiring free-form prompts or complex controls. The current app is only a Vue starter and does not provide a child-friendly reading experience around the existing story-generation API.

## Solution

Build a mobile-first Vue webapp that loads curated Feature Options from the existing API, lets a child configure a Story in Story Mode or choose options progressively in Guided Adventure, and presents six generated Chapters sequentially. The webapp will preserve the existing API contract, own the reading lifecycle and local persistence, provide optional read-aloud, and expose Parent Control for accidental-access protection and lockable Global Settings.

## User Stories

1. As a child, I want to start a new Story without creating an account, so that I can begin reading immediately.
2. As a child, I want to choose between Story Mode and Guided Adventure, so that I can select the reading experience that suits me.
3. As a child, I want to see the available Feature Options for each Chapter, so that I can customize the Story using safe curated choices.
4. As a child, I want each Chapter's choices presented in a clear, simple interface, so that I can make a choice without understanding the underlying API.
5. As a child, I want Story Mode to require all six Feature Options before generation begins, so that my complete Story configuration is known up front.
6. As a child, I want Guided Adventure to ask me for one Chapter's Feature Option at a time, so that the Story unfolds as an interactive experience.
7. As a child, I want both reading experiences to use the same choices and narrative content, so that choosing a mode changes presentation rather than the Story itself.
8. As a child, I want the app to show the current Chapter clearly, so that I know where I am in the six-Chapter Story.
9. As a child, I want Chapters to be generated one at a time, so that I can begin reading without waiting for every Chapter.
10. As a child, I want the next Chapter to prefetch after the current Chapter is displayed, so that it is ready when I choose to continue.
11. As a child, I want to press Continue myself, so that the app never advances before I am ready.
12. As a child, I want to continue even if I did not listen to or read every word, so that the app does not block my progress.
13. As a child, I want to go back to any earlier Chapter, so that I can change a choice.
14. As a child, I want later choices and generated Chapters discarded after I change an earlier choice, so that the Story cannot contain content based on an old configuration.
15. As a child, I want valid earlier Chapters preserved after a later generation failure, so that I do not lose progress.
16. As a child, I want to retry a failed Chapter, so that a temporary generation problem does not end my Story.
17. As a child, I want to exit a failed or unfinished Story, so that I can stop without being trapped in the flow.
18. As a child, I want generation failures to be explained clearly, so that I understand why I cannot continue.
19. As a child, I want the app never to silently replace my selected Feature Option or generated content, so that the Story remains predictable.
20. As a child, I want to choose English or French as a Global Setting, so that I can read in my preferred language.
21. As a child, I want to choose a Chapter Length of 30, 100, or 250 words, so that the Story matches my reading ability or bedtime time.
22. As a child, I want language fixed for the current Story, so that all Chapters remain consistent.
23. As a child, I want changing language to start a new Story, so that existing generated content is not mixed with another language.
24. As a child, I want to listen to a Chapter with device or browser text-to-speech, so that I can enjoy the Story even when reading is difficult.
25. As a child, I want read-aloud to be off by default, so that sound never starts unexpectedly.
26. As a child, I want pause, replay, and stop controls, so that I can control listening.
27. As a child, I want read-aloud failures not to block the text Story, so that I can continue reading when audio is unavailable.
28. As a child, I want to disable audio after an audio failure, so that the problem does not recur.
29. As a child, I want animation and sound effects to be opt-in, so that the interface remains calm at bedtime.
30. As a child, I want reduced-motion preferences respected, so that the interface does not cause discomfort.
31. As a child, I want large touch targets and a low-complexity layout, so that I can use the app on a phone.
32. As a child, I want keyboard-accessible controls, so that I can use the app without touch.
33. As a child, I want screen-reader-compatible labels and structure, so that assistive technology can explain the Story flow.
34. As a child, I want visible text alongside read-aloud, so that audio is never the only way to access the Story.
35. As a child returning to the app, I want to see an explicit Continue or Start New choice, so that a Draft is never reopened unexpectedly.
36. As a child, I want an in-progress Story Draft saved locally, so that I can resume after leaving the app.
37. As a child, I want to discard a Draft and start again, so that an unwanted Story does not block a new one.
38. As a child, I want a completed Story marked as complete, so that I know the six-Chapter reading is finished.
39. As a child, I want to replay a completed Story from Chapter 1, so that I can hear or read it again.
40. As a child, I want to save a completed Story as a Favorite, so that I can recreate it later.
41. As a child, I want Favorites to reopen from Chapter 1, so that a Favorite always starts as a fresh reading.
42. As a child, I want a Favorite to preserve its ordered Feature Option IDs and Global Settings, so that the same choices can be used again.
43. As a child, I want Favorites not to store generated text or reading position, so that they remain reusable configurations rather than archived readings.
44. As a child, I want an unavailable Favorite explained in plain language, so that I know why it cannot start.
45. As a child, I want to replace an unavailable Feature Option or delete the Favorite, so that I can recover from catalog changes.
46. As a parent, I want an adult-gated Parent Control area, so that accidental child changes are less likely.
47. As a parent, I want to lock the reading experience, so that a child cannot change between Story Mode and Guided Adventure accidentally.
48. As a parent, I want to lock language, Chapter Length, read-aloud auto-play, animation, and sound, so that bedtime settings remain stable.
49. As a parent, I want read-aloud auto-play off by default, so that audio is enabled only intentionally.
50. As a parent, I want Parent Control described as accidental-access protection rather than account security, so that its limitations are clear.
51. As a parent, I want local Drafts and Favorites retained until explicitly deleted or browser storage is cleared, so that saved choices remain available.
52. As a parent, I want a delete-all-local-data control, so that I can remove Drafts, Favorites, and local settings from the device.
53. As a user, I want the app to load Feature Options from the existing API, so that displayed names and descriptions remain authoritative.
54. As a user, I want the app to send selected option IDs in the API's ordered hyphen-separated format, so that it works with the existing generation endpoint.
55. As a user, I want API loading and generation errors surfaced with retry or exit actions, so that failures are recoverable.
56. As a user, I want the app to work on mobile first and remain usable on tablet and desktop, so that the same Story experience follows me across screen sizes.
57. As a user, I want reserved space for future illustrations and sound providers, so that media can be added without redesigning the reading flow.

## Implementation Decisions

- Build the feature in the Vue app's top-level user flow, using the existing Vue Router and Pinia dependencies where useful.
- Keep the existing API unchanged. Load Feature Options per Chapter and use the ordered option-ID selection format for generation.
- Treat Chapters 1 through 6 as the fixed ordered Story structure. The webapp enforces completeness in Story Mode and represents incomplete work as a Story Draft.
- Model Story Mode as six selections followed by sequential Chapter generation and reading. Model Guided Adventure as one selection and one generated Chapter at a time.
- Allow prefetching of the next Chapter after the current Chapter is displayed, but require explicit Continue and never transition automatically.
- Allow backtracking to any earlier Chapter. Discard all later choices and generated Chapters when backtracking.
- Preserve valid earlier Chapters after generation failures. Provide retry and exit; do not silently substitute content.
- Keep language fixed for a Story. Changing language starts a new Story rather than translating existing Chapters.
- Offer English and French plus Chapter Length values of 30, 100, and 250 words as Global Settings.
- Store in-progress Story Drafts locally and present explicit Continue and Start New choices on return.
- Store Favorites locally as ordered option IDs plus Global Settings only. Do not store generated text or reading position. Reopen Favorites from Chapter 1.
- Treat removed options as unavailable Favorites. Explain the issue and allow replacement or deletion.
- Add Parent Control with a lightweight adult gate. It protects against accidental changes and is not account-grade security.
- Allow Parent Control to lock mode, language, Chapter Length, read-aloud auto-play, animation, and sound. Keep read-aloud auto-play disabled by default.
- Implement read-aloud through browser/device text-to-speech where available, with pause, replay, stop, and a non-blocking failure path. Keep an extension point for a future audio provider.
- Use accessible semantic structure, keyboard operation, large touch targets, visible text transcripts, reduced-motion support, and opt-in animation/sound.
- Reserve media extension points in the reading UI without implementing illustrations or generated audio in this spec.

## Testing Decisions

- Test external user behavior through the mounted `App` with Vue Test Utils and Vitest, using the highest existing seam.
- Mock only external boundaries: API `fetch`, browser `localStorage`, and browser `speechSynthesis`.
- Do not test Vue implementation details, internal component state shape, or the language-model implementation.
- Test Story Mode selection completeness, ordered API requests, sequential generation, prefetch behavior, explicit Continue, and completion.
- Test Guided Adventure progression, Draft auto-save, Continue versus Start New, and local recovery.
- Test backtracking from every Chapter position, including removal of later choices and generated text.
- Test retry, exit, preservation of valid earlier Chapters, and non-silent handling of API failures.
- Test language and Chapter Length Global Settings, Parent Control locks, adult-gate behavior, delete-all local data, and default read-aloud settings.
- Test Favorite creation, reopening from Chapter 1, current API metadata loading, unavailable options, replacement, and deletion.
- Test read-aloud controls and non-blocking speech failure behavior.
- Test keyboard and accessible-name behavior for primary actions, Chapter navigation, settings, and audio controls.
- Existing prior art is the `App.vue` mount test and the repository's Vitest, Vue Test Utils, and jsdom setup. Expand that existing test seam rather than introducing an end-to-end runner.

## Out of Scope

- Changes to the API endpoints, API selection format, generation algorithm, prompt templates, or language-model integration.
- Free-text prompts or user-created Feature Options.
- User accounts, cloud synchronization, multiple child profiles, or server-side persistence of Drafts and Favorites.
- Storing generated text or reading position in Favorites.
- Illustrations, generated audio, sound effects, or a production audio provider.
- Automatic chapter transitions or requiring a child to finish listening or reading before continuing.
- Account-grade parental authentication or security.
- A separate role-mapping API or duplicated API option metadata in the webapp.

## Further Notes

- The existing API accepts partial selection sequences; the webapp must distinguish an in-progress Story Draft from a complete six-Chapter Story.
- The API is the source of current Feature Option metadata. Stable option IDs are preserved in local data, while current names and descriptions are queried when displaying a Draft or Favorite.
- The six canonical Chapter Roles remain part of the domain vocabulary, but the webapp does not need to duplicate role metadata to integrate with the current API.

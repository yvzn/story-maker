---
status: accepted
---

# Keep the API stable and own story lifecycle in the webapp

The webapp will adapt to the existing API: it loads Feature Options by Chapter and sends the ordered hyphen-separated option IDs for generation. It will not duplicate option metadata or require new role-mapping endpoints. The webapp owns the user-facing lifecycle around that contract—Story Mode completeness, Guided Adventure progression, Story Draft and completion state, explicit navigation, backtracking invalidation, local Draft recovery, and local Favorites—because these are presentation and persistence concerns rather than generation concerns. This preserves a simple, already-working API while allowing the child-focused experience to enforce its own safety and accessibility behavior.

## Considered options

- Expand the API to expose UI-oriented role metadata and a structured Story Configuration: rejected for now because the existing API already provides the data needed to generate stories, and the additional contract would add coupling without a current product need.
- Store generated text and reading position in Favorites: rejected because Favorites are intended to preserve reusable choices and settings, while generated content must be regenerated from the current API catalog.

---
status: accepted
---

# Let the API own localized child-facing content

ADR-0001 kept the API stable and placed presentation concerns in the webapp. We are superseding that part of the decision: the API will own authoritative localized child-facing metadata for Chapters, Chapter Roles, and Feature Options, while retaining its existing technical fields for compatibility. The webapp will continue to own Story lifecycle, progression, Drafts, Favorites, and presentation state. This prevents localized copy from being duplicated across clients while keeping the existing generation contract stable.

## Considered options

- Keep all child-facing descriptions in the webapp: rejected because it duplicates localized content, risks drift from the generation contract, and makes content changes require a client release.
- Replace the existing API fields with a new UI-oriented schema: rejected because existing clients and generation behavior should remain compatible.

## Consequences

Missing content in the requested language is an explicit, recoverable content error; the webapp must not silently substitute another language. Changes to language or Chapter Length before generation are immediate, but after generation begins require a restart warning and confirmation.

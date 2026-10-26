# PRD Quality Review — Duplicate File Finder

## Overall verdict
A tight, honest hobby-scale PRD. Behaviour-only wording holds, each FR has a concrete test or consequence, non-goals and open questions are real, and the brief's eight criteria map one-to-one to FRs in SM-1. The last round's fix is mostly correct, but one sentence in FR-4 still uses "unreadable files" in the glossary's broad sense, so the finish-time identity is not strictly true. That is one low-to-medium wording residue; nothing blocks building.

## Decision-readiness — strong
Decisions are stated as decisions (symlinks are not followed and are reported, empty files take precedence over FR-1, cancelled results are marked incomplete). The two Open Questions (§8) are genuinely open and consciously accepted. The SM-C1 counter-metric names what is given up ("Never trade correctness ... for a faster scan").

## Substance over theater — strong
Two personas-in-one (Dana the owner), both UJs drive requirements (FR-4/5/7 and FR-8/9). No NFR boilerplate; FR-6 has a bound (2 seconds, 10,000 files). The Vision admits "There is no measured problem behind it", which is honest rather than theater.

## Strategic coherence — strong
The thesis is trust and safety (correct, read-only, never frozen), and FR-10, FR-5/6 and SM-C1 all serve it. Scope is a coherent problem-solving MVP; deferrals in §6.2 are explicit.

## Done-ness clarity — adequate
Almost every FR has a test or a testable consequence with numbers. Gaps are small and listed below.

### Findings
- **medium-low (call it low-medium)** "Unreadable" still has two meanings in the finish-time identity (§4.1 FR-4, bullet "When a scan finishes, checked plus unreadable files equals the total number of files to check"; §3 "Unreadable file"). The Glossary defines "Unreadable file" to include symbolic links and unopenable folders, which are not in the total. Read literally, the identity fails whenever a symlink exists. The preceding bullet's fix (screen count only covers files in the total; the FR-7 summary also lists links and folders) is correct, but this bullet and the Glossary's single-term rule ("uses only the term 'unreadable'") were not reconciled. Also, the on-screen "1 unreadable" can legitimately differ from the FR-7 summary count, and no wording tells the reader which count FR-7's "count of unreadable files" is. *Fix:* in the identity bullet say "checked plus unreadable files that are in the total"; in FR-7 say the summary count includes symbolic links and unopenable folders (and is therefore possibly higher than the on-screen count).
- **low** Read failure after being checked (FR-4 bullet 3): a file moved from checked to unreadable implies the checked count goes down, which contradicts the "count stops rising/never rises backwards" feel of the progress display. Unstated; harmless at hobby stakes. *Fix:* one clause saying the count may decrease in that case.
- **low** Symbolic links or unopenable folders located inside a skipped folder: not stated whether they appear in the unreadable list. FR-8 says "ignores everything inside", so implied no. Optional clarifier.
- **low** An empty file that cannot be read: FR-2 and "known to be empty" imply it is unreported or unreadable depending on whether size is readable; the FR-4 bullet "size cannot be read is counted in the total" covers it. Fine; no action.

## Scope honesty — strong
Non-Goals (§5) and Out of Scope (§6.2) do real work, including "Copies reachable only through a symbolic link are intentionally not reported" (FR-7). No assumption tags exist and §8 says none remain, which is consistent.

## Downstream usability — adequate
Glossary is thorough and terms are used consistently. FR-1 to FR-10 contiguous, UJ-1/2 have a named protagonist, SM IDs resolve, cross-references (FR-4, FR-6, FR-7, FR-9) all resolve. "Realizes UJ-1/UJ-2" links are present. Only the "unreadable" residue above affects extraction.

## Shape fit — strong
Capability-spec shape with two light UJs suits a solo, single-operator hobby tool; rigor is light but the substance bar is met. Brownfield reference (`corruptCache.ts`) in the addendum matches AGENTS.md policy.

## Fix verification (last round)
- FR-4 now says screen count includes only files in the total: correct and consistent with FR-2, FR-8 and "File to check".
- "File to check" excludes symbolic links: consistent with FR-7 bullet 3 and FR-4; no total-count contradiction remains.
- A group left with one file is removed: consistent with the Glossary ("two or more") and FR-5's "only truly identical" rule.
- "incomplete" replaces "partial": FR-3, FR-5 and the Glossary all use "incomplete"; no "partial" remains.
- Only residue: the identity bullet noted above.

## Mechanical notes
- IDs contiguous (FR-1 to FR-10, UJ-1 to UJ-2, SM-1, SM-C1); no gaps or duplicates.
- SM-1's eight criteria are all enumerated and map to FRs correctly.
- No inline `[ASSUMPTION]` tags, so no index roundtrip is needed.
- Required sections present for hobby stakes.

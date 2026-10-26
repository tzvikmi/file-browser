# Reconciliation: brief vs PRD (input: product brief + addendum, final, 2026-10-26)

Compared: brief.md and addendum.md against prd.md and addendum.md. Nothing edited.

## 1. Brief items dropped or weakened in the PRD

Success criteria: all 8 are present, mapped in SM-1 to FR-1, FR-2, FR-4/5/6, FR-7, FR-8, FR-9. No criterion is lost.

Constraints: all addendum constraints carried over (read-only, no storage/network, framework-free lib, corruptCache not extended, tokens, npm run check, Chromium). Size pre-filter and content comparison are kept as an "approach for the architect to confirm" in the PRD addendum, which is acceptable.

Gaps:
- G1 "This is enough is a valid outcome" is dropped. Brief Vision says neither extension is a commitment and that stopping is a valid outcome. PRD 6.2 says "not a commitment" only for the similar-files item. Jump-to-tree is "deferred; candidate for later". The practice-project / honest tone is kept in section 1 ("no measured pain"), but not the "enough is fine" idea.
- G2 Reason for non-persistence of the skip list is dropped. Brief: the edit is not kept "because the project forbids storage". PRD FR-9 and UJ-2 state the behaviour only. Minor. (Non-Goals do cover "nothing saved".)
- G3 Result presentation weakened. Brief: each group lists the "full paths" of its copies, shown as text. FR-1 says "file paths"; only FR-7 says "full paths". Minor; make FR-1 say full paths.
- G4 Brief qualitative intent "Success for them is a trustworthy answer ... without the page hanging" is kept in section 7. "Never freeze the browser" is kept (FR-6). No gap.
- G5 Brief "Problem" statement that the explorer cannot show identical files and the user compares by hand: kept in JTBD. No gap.

## 2. New in PRD, not in brief

Owner-approved additions (not violations):
- A1 Partial results after cancel, marked incomplete, only truly identical files (FR-5).
- A2 Partial wasted-space figure after cancel, marked partial (FR-3).
- A3 Symbolic links and unopenable folders listed as unreadable (FR-7, Glossary).

Other additions to flag (PRD section 8 says resolved with the owner on 2026-10-26, but they were not in the approved-additions list given to me, so confirm):
- B1 "Cancel takes effect within 2 seconds" (FR-6). The brief had no numeric threshold.
- B2 Skip list matches folder names at any depth (FR-8). The brief only says folders "such as node_modules".
- B3 Progress definition: total excludes skipped-folder files and empty files; unique-size files count as "checked" (Glossary, FR-2, FR-4, FR-8). The brief only requires "shows progress". This implies the app counts the files up front before checking.
- B4 FR-9 explicitly allows adding folders to the skip list. The brief says "edit this list" and criterion 7 covers only removal. Reasonable reading of "edit", but not stated in the brief.
- B5 SM-C1 counter-metric (never trade correctness for speed). The brief has no such metric; it fits the intent but is new wording.
- B6 FR-5 "user can start a new scan afterwards" and "Cancel at any time" (FR-6). Implied by the brief, not stated.
- B7 Terminology: the PRD renames the brief's "files not checked" to "unreadable files" ("also called not checked in the summary"). UJ-1 says "2 not checked". Also "Checked" in the Glossary means "decided", so cancelled or undecided files are also unchecked in that sense. This is a naming collision, not new scope.

## 3. Contradictions with the brief
No direct contradictions found. Tensions worth fixing:
- T1 FR-4 test expects "4 of 4" at the end, but the Glossary does not say whether an unreadable file counts as checked. With unreadable files the counter may never reach the total. Define it.
- T2 Brief criterion 8 puts unreadable files in the "list of files not checked". After a cancel, files left undecided are also not checked but are not in that list. The PRD does not say how the summary tells these two apart.

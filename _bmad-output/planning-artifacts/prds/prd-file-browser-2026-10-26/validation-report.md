# Validation Report — Duplicate File Finder

- **PRD:** `/home/tzvika/file-browser/_bmad-output/planning-artifacts/prds/prd-file-browser-2026-10-26/prd.md`
- **Rubric:** `/home/tzvika/file-browser/_bmad-output/planning-artifacts/prds/prd-file-browser-2026-10-26/review-rubric.md`
- **Run at:** 2026-10-26T19:41:37+02:00
- **Grade:** Excellent

## Overall verdict
A tight, honest, well-calibrated PRD for a hobby feature. The Glossary does real work, the three EARS requirements (FR-1, FR-4, FR-7) are present and each carries a concrete test, and nothing exceeds the brief. No critical or high findings, and no dimension below adequate, so the formula grade is Excellent.

The adversarial reviewer shifts the picture: the PRD is readable and honest, but not yet fully testable. The recurring seams are the FR-4 progress arithmetic against the "unreadable" definition, when groups appear, read-only and no-network having no requirement, and one wrong browser example added during polish. The grade reflects the rubric formula, not these testability gaps.

## Dimension verdicts
- Decision-readiness — strong
- Substance over theater — strong
- Strategic coherence — strong
- Done-ness clarity — adequate
- Scope honesty — strong
- Downstream usability — adequate
- Shape fit — strong

## Findings by severity

### Critical (0)

### High (0)

### Medium (3)
**[Substance over theater]** — Safety is the stated purpose, but nothing verifies it (§1, §7 SM-1)
The read-only and no-network properties appear only in Non-Goals and the addendum. SM-1's eight criteria cover correctness and responsiveness only.
Fix: Add one line to SM-1 (or a single FR): after a scan the open folder is unchanged and no network request was made.

**[Done-ness clarity]** — Progress arithmetic breaks for some unreadable items (FR-4 vs Glossary "File to check", "Unreadable file")
FR-4 requires checked + unreadable = total. But "unreadable" also covers folders (not files to check), an unreadable empty file falls in neither count, and a unique-size unreadable file is both "checked" and "never checked".
Fix: Count only unreadable files that were files to check; list unreadable folders separately; state that unreadable overrides the unique-size shortcut.

**[Done-ness clarity]** — When groups appear is unspecified (FR-1, FR-5, UJ-1)
FR-5 implies groups surface progressively, but FR-1 and UJ-1 do not say whether they appear during the scan or only at the end. FR-3's partial figure depends on the answer.
Fix: Add a consequence to FR-1 saying which, so a tester knows when to look.

### Low (9)
**[Decision-readiness]** — Case-matching question affects a testable FR (§8 Q1, FR-8)
Whether `Node_Modules` is skipped is left open, but the FR-8 and FR-9 tests will implicitly pick an answer.
Fix: State a default (for example exact match) in one sentence, or note that tests use lowercase names only.

**[Strategic coherence]** — Counter-metric has nothing to counter (§7 SM-C1)
SM-1 contains no speed target, so "Counterbalances SM-1" overstates it. It reads as a guardrail.
Fix: Reword as a guardrail, or drop.

**[Done-ness clarity]** — The 2-second bound is narrower than the claim (FR-6)
"However large the open folder is" is unbounded; the only testable consequence is 10,000 files.
Fix: Word the claim for the 10,000-file reference folder, or say the bound is for reference-size folders.

**[Done-ness clarity]** — "Human-readable size" is unspecified (FR-3)
The examples do not say 1000 or 1024, or rounding.
Fix: Pick one convention in one phrase.

**[Done-ness clarity]** — "Test folder" is not defined (§7 SM-1)
SM-1 says "proven on a test folder" but its content is only implied by the per-FR examples.
Fix: One sentence: the test folder is the union of the FR test examples plus a 10,000-file folder.

**[Scope honesty]** — No boundary for files changing during a scan (FR-6, FR-1)
"Never freeze" is stated, but there is no non-goal for a file that changes during the scan.
Fix: Optional one-line non-goal, or leave as is for hobby stakes.

**[Downstream usability]** — Browser example contradicts itself (§2.2)
"Any browser other than Chromium (for example Chrome or Edge)" lists two Chromium-based browsers as unsupported examples. This was introduced by the polish pass.
Fix: Use "for example Firefox or Safari".

**[Downstream usability]** — Glossary drift in UJ-1 (§2.3 UJ-1 Climax)
"its paths and size" and "total space taken by extra copies" use informal wording where the Glossary defines "shared size" and "wasted space".
Fix: Use the Glossary terms.

**[Downstream usability]** — Light implementation leakage (Glossary "Checked", FR-4 Test)
"Decided without comparison" and "slow comparison" describe the size pre-filter. It is needed to define the count, but conflicts with §0's behaviour-only claim.
Fix: Phrase as "files with no same-size file are counted immediately".

## Adversarial findings (no severity, 21)

1. **FR-4 identity contradicts the "unreadable" definition** (FR-4 consequences, Glossary). "Unreadable" includes symlinks and unopenable folders, which are not files to check, so checked + unreadable can exceed the total. Fix: Count only unreadable files that were in the total; report folders and symlinks separately.
2. **The total is unknown when first displayed** (Glossary "File to check", FR-4). Emptiness cannot be known for a file that cannot be opened, and nothing can be counted inside an unopenable folder. Fix: State when the total is fixed, or that unknowable files count as unreadable.
3. **A file counted "checked" can later turn out unreadable** (Glossary "Checked", FR-4, FR-7). A read failure can happen after a file was matched or decided unique by size; double counting breaks the FR-4 identity. Fix: A file is counted exactly once; a failure moves it to unreadable and removes it from any shown group.
4. **FR-4's test is not deterministic from behaviour alone** (FR-4 Test and example). "Slow comparison" and "2 of 4 after two files" assume an order and granularity. FR-4 is owner-verbatim, so the guard targets the surrounding text. Fix: Add observable checks: the count never decreases, never exceeds the total, starts at 0 and ends at the total.
5. **The Glossary leaks the size pre-filter** (Glossary "Checked", addendum). Behaviour-only PRD encodes the brief's pre-filter, which the addendum leaves for the architect to confirm. Fix: Reword: a file counts as checked once the app has determined whether it has an identical twin.
6. **"Full path" cannot be produced as written** (FR-1, FR-7, UJ-1). Browser folder access exposes only paths relative to the picked folder, never the absolute disk path. Fix: Define "path" in the Glossary as relative to the open folder and replace "full path".
7. **Responsiveness and cancel bound are under-specified** (FR-6, FR-5). The bound is tested on one example; a few huge files can block cancel as well as many small ones; "scroll" is untestable before results exist. Fix: Restate for any folder size; add a one-huge-file test case.
8. **FR-1 and FR-5 conflict on completeness** (FR-1 vs FR-5, FR-3). FR-1 says the app lists each group; FR-5 allows missing groups after a cancel; timing of results is not stated. Fix: State in 4.1 that a cancelled scan lists only confirmed groups and groups may appear while running.
9. **Progressive display conflicts with "one group of three, never pairs"** (FR-1 consequences, FR-5). A pair could be on screen before the third copy is found; a cancel then leaves a pair. Fix: State that a group may lack members until the scan ends, but is never split in a finished scan.
10. **Wasted space is silently low when files are unreadable** (FR-3, FR-7). Only the cancel case is marked partial; an unreadable twin leaves an unmarked, understated figure. Fix: Mark the figure possibly incomplete and show the unreadable count next to it.
11. **Size display is not specified enough to test** (FR-3, FR-1). No unit base, rounding or position; "at the top" appears only in UJ-1. Fix: Define the format in the Glossary and move the position into FR-3.
12. **Skip-list entry semantics are undefined** (FR-8, FR-9, §8). Nothing says what may be added (name or path, wildcards, empty, duplicates); case matching blocks a test. Fix: Define entries as a single folder name, reject empties and duplicates, exact matching; tests use lowercase until decided.
13. **Skip-list edge cases: files, symlinks, locked skipped folders** (FR-8, Glossary). A file or symlink named like a skipped folder, or a locked skipped folder, may add noise to the unreadable list. Fix: A skipped folder is never opened, so never reported unreadable; skipping applies to folders only.
14. **Scan lifecycle is undefined** (FR-1, FR-5, FR-9, UJ-1). Start with no folder, double start, previous results on a new scan, folder change mid-scan, skip-list edits after a scan. Fix: Add a short lifecycle rule.
15. **Empty and degenerate outcomes have no display** (FR-3, FR-4, FR-2). No files to check, or no groups: is it "0 of 0", a message, or silence? Does the final count stay on screen? Fix: Say "no duplicates found" and keep the final count visible.
16. **Unreadable summary on cancel and for changing files** (FR-7, FR-5). Not stated whether the list appears after a cancel, how files that change mid-scan are treated, or how a tester makes a file unreadable. Fix: Show the list at scan end and after cancel; add a test setup line.
17. **"Unreadable" includes readable things; symlink rule is post-brief** (Glossary, brief vs FR-7). The symlink rule is a decision taken after the approved brief (owner-confirmed); the browser API may not expose symlinks. Fix: Mark it as a post-brief owner decision; waive the test where symlinks are not exposed.
18. **Read-only and no-network are not requirements** (Vision, §5, SM-1, addendum). The top-priority promise has no FR and no pass/fail check. Fix: Add an FR: the app does not modify the open folder and makes no network requests; test by comparing the folder before and after.
19. **Hard links count as wasted space** (Glossary, FR-3). Two names for the same data match byte for byte, but deleting one frees nothing. Fix: Note that hard links are treated as separate files and the figure may overstate.
20. **SM-1 is a one-time single-folder check; SM-C1 is not measurable** (§7). The test folder is never described and nothing measures a missed copy. Fix: Describe the test folder contents; reword SM-C1 as a measurable guardrail.
21. **Requirement style and numbering are uneven** (FR-1 to FR-9). Only FR-1, FR-4, FR-7 use EARS; "can cancel" is not testable as an obligation; one missing blank line before FR-7. Fix: Rewrite the other FRs in EARS wording; fix the blank line.

## Mechanical notes
- No blank line before the FR-7 heading in prd.md.
- IDs are contiguous and unique (FR-1 to FR-9, UJ-1/2, SM-1, SM-C1); cross-references resolve.
- "interface", "app" and "screen" are used interchangeably; "duplicate scan" (FR-1) vs "scan" elsewhere.
- Finding counts: the rubric summary said 3 medium and 11 low; the file lists 3 medium, 9 dimension lows, and 2 mechanical items. The adversarial lens reports 21 findings and, by design, assigns no severity.

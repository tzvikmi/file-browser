# Adversarial Review: Duplicate File Finder PRD

Lens: adversarial. Content: prd.md + addendum.md, checked against brief.md. Read-only review; nothing edited. Findings carry no severity or ranking.
Note: FR-1, FR-4 and FR-7 are owner-verbatim. Where a finding touches them, the guard targets the surrounding text (Glossary, other FRs), not the verbatim sentence.

## Findings

### 1. FR-4 identity contradicts the "unreadable" definition
- location: FR-4 consequences vs Glossary "Unreadable file" / "File to check" / FR-7
- trigger_condition: FR-4 says "checked + unreadable = total files to check". But "unreadable" also includes symbolic links and folders that cannot be opened, and "File to check" is defined as a non-empty file. Folders are not files to check, and a symlink's status as a "file to check" is never stated. The sum can exceed the total.
- guard_snippet: Either define "unreadable count" in FR-4 as "unreadable files that were in the total", and report unreadable folders and symlinks in a separate count; or state that symlinks and unopenable folders are added to the total when found.
- potential_consequence: A tester with one unopenable folder sees "4 of 4, 1 unreadable" on a 4-file folder. The stated invariant fails and the tester cannot tell whether the app or the PRD is wrong.

### 2. Total is needed before the scan starts, but unreadable items hide their own size and contents
- location: Glossary "File to check", FR-4
- trigger_condition: "Total number of files to check" excludes empty files and skipped folders. Emptiness cannot be known for a file that cannot be opened, and nothing can be counted inside a folder that cannot be opened. The total is undefined when it is first displayed.
- guard_snippet: State when the total is fixed (for example "the total may grow while folders are still being listed, and the screen shows it as still counting"), or say that unknowable files are counted in the total as unreadable.
- potential_consequence: The tester cannot write a pass/fail for "N of total" on a folder with a locked file. The count may also visibly shrink or jump.

### 3. A file counted "checked" can later turn out unreadable
- location: Glossary "Checked", FR-4, FR-7
- trigger_condition: Failures can occur mid-read, after a file is matched, or after a file was decided "unique by size". The PRD does not say whether a file moves from "checked" to "unreadable", or whether it is counted twice.
- guard_snippet: Add a rule: "A file is counted exactly once, in either checked or unreadable. A read failure at any point moves it to unreadable and removes it from any group already shown."
- potential_consequence: Double counting breaks the FR-4 identity. A group shown on screen may still contain an unreadable file, which contradicts FR-7 and the trust goal.

### 4. FR-4's test and example are not deterministic from behaviour alone
- location: FR-4 Test and Concrete example
- trigger_condition: The test needs "slow comparison", and a behaviour-only PRD gives the tester no way to slow it. "2 of 4 after two files" assumes an order and a one-at-a-time granularity. Two identical files are decided together, so the count could go 0 to 2 to 4, or 0 to 1 to 2, depending on the design. In the example, "aa","aa","bb","cc" are all the same size, yet "bb" and "cc" are unique in content and could be counted separately or together.
- guard_snippet: Test only what is observable: the count never decreases, never exceeds the total, starts at 0 and ends at total minus unreadable. Drop "2 of 4 after two files". If a test hook is needed, say so as a test precondition, for example "a test folder large enough that progress is visible for at least 1 second".
- potential_consequence: The test cannot be run, or it passes or fails on implementation detail. Different testers will disagree.

### 5. Hidden implementation assumption leaks through the Glossary ("Checked")
- location: Glossary "Checked", FR-4 Concrete example; addendum last bullet
- trigger_condition: The PRD claims behaviour-only. But "a file with no other file of its size is decided without comparison and counts as checked" encodes the brief's size pre-filter. The addendum says that approach is for the architect to confirm, not a decision.
- guard_snippet: Reword as behaviour: "A file counts as checked once the app has determined whether it has an identical twin, however it determines that." Keep the size pre-filter only in the addendum.
- potential_consequence: The architect is locked into the pre-filter by a behaviour requirement. The FR-4 progress semantics change if the design changes, for example if it hashes everything.

### 6. "Full path" cannot be produced as written
- location: FR-1 consequences ("full path"), FR-7 ("full paths"), UJ-1
- trigger_condition: Browser folder access exposes only paths relative to the folder the user picked, never the absolute disk path. "Full path" is ambiguous and possibly unattainable. The relative or absolute question is a hidden platform assumption.
- guard_snippet: Define in the Glossary: "Path — the location of a file written relative to the open folder, for example `src/a/b.txt`." Replace "full path" everywhere with "path".
- potential_consequence: A tester expecting `C:\Users\...` fails a correct build. A developer invents a convention that the PRD does not specify.

### 7. Responsiveness and cancel bound are under-specified and not measurable
- location: FR-6, FR-5
- trigger_condition: "Stays responsive... however large" is unbounded. The 2-second bound is tested on one example, "10,000 files", with no file size, hardware or content stated. A few huge files can block cancel just as well as many small ones. "Stops" is undefined: does it mean the progress count freezes, or that all reading ends? FR-5 says "the 2-second bound given in FR-6", but FR-6 gives it only for that example, so cancel timing on other folders is undefined. "Scroll" is untestable before results exist.
- guard_snippet: Restate FR-6 as: "After the user presses cancel, the progress count stops changing and the screen shows the cancelled state within 2 seconds, regardless of folder size." State the test folder: for example, 10,000 files of 1 KB, plus a separate case with one 2 GB file and one identical copy. Name a reference machine class, or accept "owner's machine".
- potential_consequence: The requirement cannot fail in testing, or fails arbitrarily. The one-huge-file case is the real freeze risk and is untested.

### 8. FR-1 and FR-5 give conflicting answers on completeness
- location: FR-1 (verbatim) vs FR-5, FR-3
- trigger_condition: FR-1 says that on start the app "shall list each group". FR-5 allows groups to be missing after a cancel. FR-1 is also silent on when groups appear (progressively or only at the end). FR-5's "groups found before the cancel stay on screen" implies progressive display. FR-3 and FR-4 imply an end summary.
- guard_snippet: Add one sentence in 4.1, outside FR-1: "A scan that is cancelled, or in which some files were unreadable, lists only the groups it could confirm (see FR-5, FR-7). Groups may appear while the scan is still running."
- potential_consequence: A strict reading makes every cancel test a failure of FR-1. A tester cannot say whether to check results mid-scan or only at the end.

### 9. Progressive display conflicts with "three copies are one group, never pairs"
- location: FR-1 consequences ("Three identical files appear as one group of three"), FR-5
- trigger_condition: If groups appear during the scan, a pair can be shown before the third copy is found. A cancel at that moment leaves a pair on screen. The PRD does not say whether that is acceptable, and the FR-5 "never contain a non-identical file" rule passes while FR-1 appears broken.
- guard_snippet: Add: "A group on screen may be missing members until the scan ends. A group is never split into pairs at the end of a finished scan." Or state that groups appear only when the scan ends and that a cancel shows the groups confirmed complete.
- potential_consequence: The three-copy test (brief criterion 3) can pass or fail depending on when the tester looks.

### 10. Wasted-space figure is silently wrong when files are unreadable, and "partial" is defined only for cancel
- location: FR-3, FR-7, Vision (trust)
- trigger_condition: An unreadable file may be an identical twin of a listed group, so the wasted space is understated. Only the cancel case is marked partial. A finished scan with unreadable files shows an unmarked figure. The product's top goal is a trustworthy answer.
- guard_snippet: Add to FR-3: "If any file is unreadable, the figure is marked as possibly incomplete and shows the unreadable count next to it."
- potential_consequence: The owner trusts a total that is quietly low. This contradicts the stated reason for doing the project.

### 11. Size display is not specified enough to test
- location: FR-3, FR-1 (shared size)
- trigger_condition: "Human-readable (24 bytes or 1.5 MB)" gives no unit base (1000 or 1024), no rounding rule, and no list of units. "1.5 MB" cannot be asserted exactly. The shared size display format in FR-1 is not defined at all. "Single summary figure" has no stated position, although UJ-1 says "at the top". That position appears only in the journey, not in any FR.
- guard_snippet: Define in the Glossary: "Human-readable size: units B, KB, MB, GB, TB, base 1024, one decimal place, no decimals for bytes". Use the same format for the shared size. Move "shown above the groups" into FR-3.
- potential_consequence: Two testers read different values from the same screen. The UJ-1 requirement is untested because no FR owns it.

### 12. Skip list entry semantics are undefined, and the case-sensitivity gap blocks a test
- location: FR-8, FR-9, Open Questions 1 and 2
- trigger_condition: Nothing says what may be added: a name or a path, wildcards, trailing slashes, empty strings, duplicates, names containing `/`. Matching case is left open on purpose, but FR-8's "at any depth" cannot be tested on a case-insensitive disk without knowing it (`Node_Modules`). Open Question 2 (reset when another folder is picked) decides whether UJ-2's "folder picked, no scan started" state is stable. Neither question is mentioned anywhere in FR-9.
- guard_snippet: Add to FR-9: "An entry is a single folder name with no `/`. Empty entries and duplicates are rejected with a message. Matching is exact, character for character." Accept the owner's open questions, but add the tester-facing default: "until decided, tests use lowercase names only."
- potential_consequence: Tester cannot decide whether `Dist` is skipped. Adding `a/b` or an empty string has undefined behaviour.

### 13. Skip-list edge cases: files, symlinks and unreadable skipped folders
- location: FR-8, Glossary "Skipped folder"
- trigger_condition: A skipped folder name that matches a file, a symlink named `build`, or a skipped folder that cannot be opened. It is unspecified whether those are reported as unreadable, and whether items inside skipped folders ever appear in the unreadable list or the totals. Only counts are covered ("not counted in the progress total").
- guard_snippet: Add: "A skipped folder is never opened, so it is never reported as unreadable. The skip applies to folders only; a file with a skipped name is scanned normally."
- potential_consequence: A skipped but locked `node_modules` could add noise to the unreadable list, defeating the purpose of FR-8.

### 14. Scan lifecycle is undefined: start conditions, restarts and the post-scan skip list
- location: FR-1, FR-5, FR-9, UJ-1
- trigger_condition: Not stated: whether a scan can start with no folder picked (it should be blocked, with a message); whether Start is disabled while running; what happens to the previous results when a new scan starts; whether the user can start another scan after a finished scan, not only after a cancel (FR-5 mentions only cancel); whether picking another folder is allowed mid-scan; whether the skip list can be edited after a scan finishes, and whether that marks the shown results stale. FR-9 says only "before a scan" and "not while running".
- guard_snippet: Add a short "Scan lifecycle" rule: "Start is available only when a folder is open and no scan is running. Starting a scan clears earlier results. Folder change and skip-list edits are blocked while a scan runs and are allowed otherwise; shown results always belong to the settings of the scan that made them."
- potential_consequence: Different testers find a double-start, a stale result or a mid-scan folder switch and cannot decide whether it is a bug.

### 15. Empty and degenerate outcomes have no stated display
- location: FR-3, FR-4, FR-2
- trigger_condition: A folder with no files to check (empty, all skipped, only empty files): is the progress "0 of 0", is it hidden, does the scan end at once? No groups: is a "no duplicates found" message required, or only a zero figure? FR-4 applies only "while running", but the test expects "4 of 4" at the end. It is unclear whether the final count stays on screen after the scan ends or is replaced by the summary.
- guard_snippet: Add: "When a scan ends with no groups, the screen says no duplicates were found. After a scan ends or is cancelled, the final progress count stays visible."
- potential_consequence: A zero-result run looks the same as a broken run. The "4 of 4 at the end" check has no requirement behind it.

### 16. Unreadable summary behaviour on cancel and for changing files
- location: FR-7, FR-5
- trigger_condition: FR-7 consequences give a summary with unreadable count and paths, but nothing says it appears after a cancel (partial list) or when shown. A file that changes, shrinks or is deleted during the scan is not covered: is it unreadable, or compared with whatever it holds at that moment? The FR-7 test requires "a file that cannot be opened", and the PRD does not say how a tester creates one in a browser test.
- guard_snippet: Add: "The unreadable list is shown at scan end and after a cancel, covering files reached so far. A file that is removed or changed while the scan runs is reported as unreadable." Add a test setup line: "make a file unreadable by removing its read permission before the scan."
- potential_consequence: Unspecified results for the most common real-world case (editing a file during a scan). The FR-7 test cannot be set up the same way twice.

### 17. "Unreadable" includes things that are readable (terminology and brief drift)
- location: Glossary "Unreadable file", Non-Users, brief.md Scope vs PRD FR-7
- trigger_condition: The glossary defines symlinks as unreadable even when they open fine. The brief covers only files "that could not be read" and says nothing about symlinks. The symlink rule is a new decision beyond the approved brief, even though the owner is said to have confirmed it. The user sees "unreadable" for a perfectly readable shortcut. The browser folder API may not expose symlinks at all, which is a hidden platform assumption, and the tester cannot create the case on every operating system.
- guard_snippet: Mark the symlink rule explicitly as a decision taken after the brief and note its source ("confirmed with owner"). Add a testing note: "On a platform that does not expose symlinks, this consequence cannot be tested and is waived." Consider a separate display label such as "skipped (shortcut)" while counting it with unreadable in FR-4.
- potential_consequence: Scope creep beyond the brief and an untestable requirement. A user is told a readable file is unreadable.

### 18. Read-only and no-network are not requirements at all
- location: Vision, Non-Goals, Section 7 (SM-1), addendum
- trigger_condition: The Vision says the app "must never change a file or send anything anywhere", but no FR states or tests it. SM-1 lists eight criteria and none covers read-only or no-network. The addendum holds the constraint as an engineering rule, not as a pass/fail check. The owner's reason for doing the project carefully is therefore unverified.
- guard_snippet: Add an FR (or a constraint line in the PRD): "During and after a scan the app shall not modify, create, move or delete any file in the open folder and shall make no network requests." Test: compare the folder before and after; inspect browser network activity during the scan.
- potential_consequence: The top-priority behaviour could ship broken while SM-1 passes.

### 19. Hard links and other same-data cases count as "wasted"
- location: Glossary "Identical", "Wasted space", FR-3
- trigger_condition: Two names for the same stored data (a hard link) match byte for byte, so they are grouped and counted as wasted space, but deleting one frees nothing. The PRD defines the figure as "total space taken by extra copies" (UJ-1), which is then wrong. No rule covers it, not even a statement that it is accepted.
- guard_snippet: Add to Non-Goals or Open Questions: "Hard links are treated as separate identical files; wasted space may overstate the space that deleting would free."
- potential_consequence: The owner acts on the figure and frees less than shown. Or a tester reports it as a bug.

### 20. Success metric SM-1 is a single-folder, one-time check, and SM-C1 is not measurable
- location: Section 7
- trigger_condition: "On the test folder" is never described, so the metric is circular. It does not cover the largest risk: a missed copy (false negative) in a big real folder, which SM-C1 names but nothing measures. SM-1 includes "responsive" with no number beyond FR-6's. "Never trade correctness" is a principle, not a metric.
- guard_snippet: Define the test folder contents in an appendix (files, sizes, one unreadable, one skipped folder, empty files, three-copy group). Replace SM-C1 with "No known missed copy or wrong group on the test folder after any change to scanning speed".
- potential_consequence: "All eight pass" is claimed on a folder that cannot show a missed copy.

### 21. Requirement style and numbering are uneven
- location: FR-1 to FR-9
- trigger_condition: Only FR-1, FR-4 and FR-7 use EARS tags and "shall". FR-2, FR-3, FR-5, FR-6, FR-8 and FR-9 use mixed forms, such as "can cancel" and "are never listed". "Can" is not testable as an obligation. Some "Consequences" are really separate requirements, for example FR-2's "not counted in the progress total", which duplicates the Glossary. FR-5 has a blank line missing before FR-7 (FR-6 runs straight into the FR-7 heading).
- guard_snippet: Rewrite the non-verbatim FRs in the same EARS wording ("When ... the app shall ..."). Keep one source of truth for each rule (Glossary or FR, not both). Fix the missing blank line before the FR-7 heading.
- potential_consequence: A tester treats "can cancel" as optional. Duplicated rules drift apart in later edits.

## Count
21 findings.

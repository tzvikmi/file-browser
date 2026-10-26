---
title: Duplicate File Finder
status: final
created: 2026-10-26
updated: 2026-10-26
---

# PRD: Duplicate File Finder

## 0. Document Purpose
This PRD defines what the Duplicate File Finder does, in plain language, for the owner and for whoever designs and builds it next. It builds on the approved product brief and keeps all of its decisions. It states behaviour only; technical choices belong to the architecture phase and the project constraints are kept in `addendum.md`. Terms in the Glossary are used exactly, with no synonyms.

## 1. Vision
The file-browser app lets one person explore a folder on their own computer without changing anything in it. The Duplicate File Finder adds one more answer: which files in this folder are exactly the same, where each copy lives, and how much space the extra copies take up.

It is a personal practice project. There is no measured problem behind it, and this PRD does not claim one. What makes it worth doing carefully is trust and safety: the answer must be correct, the app must never change a file or send anything anywhere, and the app must never freeze while it works.

## 2. Target User

### 2.1 Jobs To Be Done
- When I suspect copies of the same file are scattered across a folder under different names, I want a trustworthy list of which files are identical, so I do not have to compare them by hand.
- When a scan is running on a big folder, I want to see progress and be able to stop it, so I stay in control.
- When there are folders I do not care about (such as `node_modules`, a folder of downloaded code libraries), I want them left out, so the results show only files that matter to me.

### 2.2 Non-Users (v1)
Anyone other than the owner. Also the owner on any machine other than their own, or in any browser other than Chromium (the engine behind Chrome and Edge), for example Firefox or Safari.

### 2.3 Key User Journeys
- **UJ-1. Dana finds the copies hiding in a project folder.**
  - **Persona + context:** Dana, the owner, suspects their project folder holds duplicated files under different names and wants a trustworthy answer.
  - **Entry state:** The app is open and Dana has already picked the project folder.
  - **Path:** Dana starts a scan. A progress count rises ("120 of 900"). Dana cancels once to see that it stops, then starts it again and lets it finish.
  - **Climax:** Groups of identical files appear, each with its paths and shared size, with the wasted space at the top.
  - **Resolution:** Dana reads the paths and knows where the copies are. The app has changed nothing.
  - **Edge case:** Two files could not be opened. The summary says "2 unreadable" and lists their paths; the rest of the scan was unaffected.
- **UJ-2. Dana keeps a folder out of the scan.**
  - **Persona + context:** Dana does not want `node_modules` scanned, but one day wants to see copies inside `dist`.
  - **Entry state:** Folder picked, no scan started yet.
  - **Path:** Dana looks at the list of skipped folders, removes `dist` from it, and starts the scan.
  - **Climax:** Copies inside `dist` now appear in the results.
  - **Resolution:** In the next session the list is back to its defaults, because nothing is remembered between sessions.

## 3. Glossary
- **Open folder** — the folder the user has picked in the app; the only place a scan looks.
- **Path** — where a file is, written relative to the open folder, for example `docs/a/b.txt`.
- **Scan** — one run of the finder over the open folder, from start to finish or cancel.
- **Identical** — two files whose contents match byte for byte. Names, locations and dates do not matter.
- **Duplicate group** — a set of two or more identical files. Three copies form one group, never several pairs.
- **Shared size** — the size of one file in a duplicate group (all files in a group have the same size).
- **Wasted space** — for each group, the shared size times (number of files minus one), summed over all groups.
- **Skipped folder** — a folder whose contents the scan ignores. Defaults: `node_modules`, `.git`, `dist`, `build`.
- **Skip list** — the list of skipped folders shown in the interface and editable before a scan.
- **File to check** — a file inside the open folder that is not inside a skipped folder, is not a symbolic link, and is not known to be empty. This defines the "total number of files to check" in FR-4.
- **Checked** — a file to check whose duplicate status the scan has decided. A file with no other file of its size is decided without comparison and counts as checked. An unreadable file is never checked.
- **Unreadable file** — a file the scan could not open or read, any symbolic link (a shortcut that points to another file or folder), or any folder the scan could not open. The interface and this document use only the term "unreadable".
- **Empty file** — a file with 0 bytes.

## 4. Features

### 4.1 Finding duplicates
**Description:** The user starts a scan on the open folder and receives groups of identical files. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: List duplicate groups
[Event-driven] When the user starts a duplicate scan on the open folder, the app shall list each group of files with identical content, showing the file paths and the shared size, and shall not list a file that has no identical twin.

**Test:** a folder with a.txt = "hi", b.txt = "hi", c.txt = "ho" (all 2 bytes). Start the scan. Expect one group {a.txt, b.txt}; c.txt is absent.

**Consequences (testable):**
- A copy of a file placed under a different name in a different folder is reported in one group with the original.
- Two files of the same size that differ by a single byte are not grouped.
- Three identical files appear as one group of three, not as pairs.
- Each file in a group is shown with its path.
- Groups appear on screen as the scan confirms them. A group on screen may gain more files until the scan ends. When a scan finishes, every set of identical files is shown as one group, never as pairs.

#### FR-2: Never show empty files
Empty files are never listed in any duplicate group, even when several empty files exist. This takes precedence over FR-1 for empty files.

**Consequences (testable):**
- A folder with two empty files and nothing else produces no groups.
- Empty files are not counted in the progress total (see FR-4).

#### FR-3: Total wasted space
When a scan ends, whether it finished or was cancelled, the app shows the wasted space as a single summary figure in a human-readable size (for example 24 bytes or 1.5 MB).

**Consequences (testable):**
- A folder with three identical 10-byte files and two identical 4-byte files has wasted space of 2×10 + 1×4 = 24 bytes.
- No groups: wasted space is zero.
- After a cancel, the figure is still shown, computed from the groups on screen and marked as incomplete.

#### FR-4: Show scan progress
[State-driven] While a scan is running, the app shall display how many files have been checked out of the total number of files to check.

**Test:** 4 files, with slow comparison. Mid-scan the screen shows "2 of 4" after two files, then "4 of 4" at the end.

**Consequences (testable):**
- A file is counted exactly once: either as checked or as unreadable. Unreadable files are not counted as checked; the screen shows them separately next to the count, for example "3 of 4, 1 unreadable".
- A file whose size cannot be read is counted in the total and reported as unreadable.
- A read failure at any point moves the file to unreadable and removes it from any group already shown; a group left with one file is removed. The checked count then goes down by one.
- The count on screen includes only files in the total. The unreadable summary (FR-7) also lists symbolic links and folders that cannot be opened.
- When a scan finishes, checked files plus unreadable files in the total equals the total number of files to check.
- Concrete example: four 2-byte files with contents "aa", "aa", "bb", "cc". All four need a content comparison, so the count rises as each is decided, up to "4 of 4". A file with no other file of its size needs no comparison and counts as checked at once.

#### FR-5: Cancel a scan
While a scan is running, the user can cancel it. A cancelled scan stops within the 2-second bound given in FR-6. The groups found before the cancel stay on screen, clearly marked as incomplete, and are never presented as a finished result.

**Consequences (testable):**
- After cancel, the progress count stops rising.
- After cancel, the screen says the scan was cancelled and the results are incomplete.
- Every group shown after a cancel contains only files that are truly identical; the results may be missing groups or files, but never contain a file that is not identical.
- The user can start a new scan afterwards.

#### FR-6: Stay responsive
During a scan the interface keeps responding: the user can scroll, see the progress count change, and press cancel at any time, however large the open folder is.

**Consequences (testable):**
- On a test folder of 10,000 files, pressing cancel mid-scan stops the scan within 2 seconds.

#### FR-7: Report unreadable files
[Unwanted behaviour] If a file cannot be read during a scan, then the app shall report that file as unreadable and still finish checking all the other files.

**Test:** three files, two identical and one that cannot be opened. The scan finishes, one duplicate group is shown, and the unreadable file appears in an "unreadable" list.

**Consequences (testable):**
- The summary shows the count of unreadable files and their paths.
- With no unreadable files, the summary shows a count of zero.
- A symbolic link, or a folder that cannot be opened, appears in the unreadable list with its path, and the scan continues.
- Copies reachable only through a symbolic link are intentionally not reported as duplicates.
- The unreadable count in the summary includes symbolic links and folders that cannot be opened, so it can be larger than the unreadable count shown during the scan.

### 4.2 Choosing what to scan
**Description:** Some folders hold many files of no interest. The scan skips them by default and the user can change that before a scan. Realizes UJ-2.

#### FR-8: Skip folders by default
By default the scan ignores everything inside the folders `node_modules`, `.git`, `dist` and `build`, at any depth.

**Consequences (testable):**
- Two identical files, one in the open folder and one inside a `node_modules` subfolder: no group is shown.
- Files inside skipped folders are not counted in the progress total.
- The open folder itself is always scanned, even if its own name is on the skip list; only folders inside it are skipped.
- Nothing inside a skipped folder is listed, including unreadable items.

#### FR-9: Edit the skip list
Before a scan, the user can view the skip list and remove folders from it or add folders to it. The change applies to the next scan only and is not remembered between sessions, because the app never saves anything. The list cannot be changed while a scan is running.

**Consequences (testable):**
- Removing `dist` from the list, then scanning, brings identical files inside `dist` into the results.
- Adding a folder name to the list leaves its files out of the next scan.
- After closing and reopening the app, the list shows the defaults again.

### 4.3 Keeping the folder untouched
**Description:** The app only reads. This is the reason the project is worth building carefully, so it has its own requirement and test.

#### FR-10: Read-only, no network
[State-driven] While a scan runs and after it ends, the app shall not create, change, move or delete any file or folder in the open folder, and shall not send or receive anything over a network.

**Test:** record the names, sizes and modified dates of everything in the open folder before a scan, scan, and compare: expect no differences. Watch the browser's network activity during the scan: expect no requests.

## 5. Non-Goals (Explicit)
- Not a clean-up tool: it never deletes, moves, renames or changes any file.
- Not a similarity tool: no near-duplicate matching (edited, renamed-and-edited, resized files).
- Not a service: nothing is sent over a network and nothing is saved between sessions (results, comparison data, skip list).
- It does not show empty files.

## 6. MVP Scope

### 6.1 In Scope
- Exact (byte-for-byte) duplicate detection inside the open folder.
- Duplicate groups with paths and shared size; total wasted space.
- Progress count and cancel; interface stays responsive.
- Skip list with defaults, editable before a scan.
- Summary of unreadable files: count and paths.

### 6.2 Out of Scope for MVP
- Jumping from a result to the file in the folder tree. Deferred; candidate for later.
- Finding similar (not identical) files. A separate, much costlier project; not a commitment.
- Deleting, moving or renaming files; any write access.
- Saving anything between sessions.
- Any network use.

If the first version proves useful, jumping to the file in the folder tree and finding similar files are candidates. Neither is a commitment, and "this is enough" is also a valid outcome.

## 7. Success Metrics
Success is a trustworthy answer to "which of these files are the same?" without the page hanging, proven on a test folder.

**Primary**
- **SM-1**: All eight criteria from the product brief pass on the test folder, and the wasted space figure is correct (FR-3: three identical 10-byte files and two identical 4-byte files give 24 bytes). The criteria: renamed copy grouped (FR-1); one-byte difference not grouped (FR-1); three copies form one group (FR-1); empty files never shown (FR-2); responsive with progress and cancel (FR-4, FR-5, FR-6); skipped folders never reported (FR-8); removing a folder from the list restores its files (FR-9); an unreadable file does not stop the scan (FR-7). In addition, the open folder is unchanged and no network request was made (FR-10).

**Counter-metrics (do not optimize)**
- **SM-C1**: Speed of scan. Never trade correctness (a wrong group or a missed copy) for a faster scan. Counterbalances SM-1.

## 8. Open Questions
Left unspecified by choice (accepted for a personal project):
1. Whether skip-list folder names match with or without regard to letter case.
2. Whether the skip list resets when a different open folder is picked in the same session.

All other decisions made with the owner are recorded in the Glossary and the requirements above. No assumptions remain unconfirmed.

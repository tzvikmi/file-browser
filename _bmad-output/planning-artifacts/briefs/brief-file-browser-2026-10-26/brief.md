---
title: "Product Brief: Duplicate File Finder"
status: final
created: 2026-10-26
updated: 2026-10-26
---

# Product Brief: Duplicate File Finder

## Executive Summary

The file-browser app is a browser-only, read-only explorer for a folder the user picks. This brief adds one capability: find files that are exactly identical, wherever they sit in the chosen folder, and show them grouped so the user can see where the copies are and how much space they waste.

It is a personal project for one user on their own machine, built out of curiosity and as practice. There is no measured pain behind it, and the brief does not pretend otherwise. What makes it worth doing carefully is its restrictions: it must stay read-only, make no network calls, and never freeze the browser.

## The Problem

Copies of the same file accumulate across folders under different names, and the existing explorer cannot show which files are identical. Today the only option is to compare files by hand.

The owner does not want folders such as `node_modules` scanned at all, because they hold many files that are of no interest.

## The Solution

The user picks a folder and starts a scan. The app narrows candidates by file size, then compares the contents of same-size files to decide which are truly identical. Results appear as groups of identical files.

Each group lists the full paths of its copies and the size of one copy. A summary shows the total space taken by the extra copies. While scanning, the user sees progress and can cancel.

Folders such as `node_modules`, `.git`, `dist` and `build` are skipped by default. The user can edit this list in the interface before a scan; the edit is not kept between sessions, because the project forbids storage. Files that cannot be read do not stop the scan. At the end the summary shows how many were not checked, with their paths.

## Who This Serves

One user, the owner, running the app locally in a Chromium browser on their own computer. Success for them is a trustworthy answer to "which of these files are the same?" without the page hanging.

## Success Criteria

The feature works when all of these hold on a test folder:

1. A file copied under a different name into a different folder is reported as one group with the original.
2. Two files of the same size that differ by a single byte are not grouped.
3. Three or more copies form one group, not several pairs.
4. Empty (0-byte) files are never shown.
5. Scanning a large folder keeps the interface responsive, shows progress, and can be cancelled.
6. Files inside a skipped folder (for example `node_modules`) are never reported.
7. Removing a folder from the skip list in the interface brings its files back into the scan.
8. A file that cannot be read does not stop the scan and appears in the list of files not checked.

## Scope

**In for the first version**
- Exact (byte-for-byte) duplicate detection within the selected folder.
- Size as a pre-filter; content comparison as the decision.
- Skipping folders such as `node_modules`: fixed default list, editable in the interface before a scan.
- Results view: groups of identical files (paths shown as text), total wasted space, progress and cancel.
- Summary of files that could not be read: count and paths.

**Explicitly out**
- Near-duplicate or similar-file matching (renamed-and-edited files, resized images).
- Deleting, moving, or renaming files; any write access.
- Persisting anything between sessions: results, hashes, the skip list (policy forbids storage and the old cache is slated for removal).
- Showing empty files.
- Jumping from a result to the file in the folder tree (deferred, see Vision).
- Any network use.

## Vision

If the first version proves useful, two extensions are candidates: jumping from a result to the file in the folder tree, and finding similar (not identical) files. The second is a separate and much costlier project. Neither is a commitment; "this is enough" is also a valid outcome for a practice project.

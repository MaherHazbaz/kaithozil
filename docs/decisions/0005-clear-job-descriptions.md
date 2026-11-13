# 0005: Clear job descriptions (additions to the approved design)

Date: 2026-11-12. Status: built at the owner's request; wording waits for the owner's approval.

## Why

A worker who accepts a job travels to it. If the job says only "Other", the worker cannot tell what
to bring or whether they can do it, and the customer may get the wrong help. Making every job say
enough before it is sent helps both sides.

## What was added to Describe the job

`design/source/Post.dc.html` has none of these. Everything else on the screen follows the design.

| Addition                             | Wording                                                                                        | When it shows                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Example in the empty description box | "e.g. Bedroom ceiling fan not spinning, makes a humming sound." (the design's own sample text) | While the box is empty                                 |
| Description becomes required         | Label changes from "Describe it (optional)" to "Describe it"                                   | When the chosen problem is "Other"                     |
| Reason the main button is disabled   | "Choose a problem to continue" / "Describe the problem to continue"                            | Below the main button, only while something is missing |
| Disabled main button                 | Half opacity                                                                                   | Until the job says enough                              |

The rule itself is a pure function, `missingJobDetail` in
`apps/customer/src/features/job/jobDraft.ts`, with tests. A problem chip is always needed; a
description is needed only for choices marked `needsDescription` ("Other").

## Consequences

- The new lines are English only. The design gives this screen Tamil for the title and one heading;
  Tamil for the new lines needs the owner's wording.
- The footer is one line taller while the reason shows, and shrinks when the job is ready.
- The server must apply the same rule when jobs are saved (CLAUDE.md: validate on client and server).
- The designer should add these states to `Post.dc.html`. When that happens, replace the values here
  with the designer's.

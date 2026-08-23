# Authority Evidence Ladder

- `E0_CLAIMED` — assertion only.
- `E1_OBSERVED` — directly inspected static fact/source.
- `E2_REPRODUCED` — relevant behavior reproduced.
- `E3_TARGET_TESTED` — focused deterministic target validation.
- `E4_REGRESSION_PROTECTED` — target validation plus meaningful broader/pre-existing protection.
- `E5_OPERATIONALLY_OBSERVED` — authorized real/production-like operation observed.

New tests alone are at most E3. A commit is not runtime evidence. Use the minimum level actually achieved.

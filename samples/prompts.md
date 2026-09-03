## Prompts by Phase

|Phase|Essential Prompt|
|---|---|
|Constitution|"Propose the constitution for this project: N short, verifiable principles about stack, quality, tests, and boundaries. Max 15 lines. Wait for my approval."|
|Spec (Interview)|"Do NOT write code. Ask me questions one by one (max 6) about edge cases, errors, and scope, and then generate spec.md with numbered Functional Requirements (FR) in EARS syntax, out-of-scope items, and definition of done criteria. Only the WHAT and the WHY."|
|Clarification|"Review the spec like a professional QA: ambiguities, contradictions, missing edge cases, conflicts with the constitution. Detect only, do not resolve."|
|Plan|"Read the constitution and spec. Without writing code: generate plan.md with modules, data models, justified decisions (including discarded alternatives), and testing strategy. Indicate which FR each part covers."|
|Tasks|"Break down the plan into tasks of <30 min, ordered by dependency, each with its FRs and a verifiable 'Done when:' line. With checkboxes."|
|Implementation|"Implement ONLY task Tn. Tests first. Run the test suite and show me the output. Mark Tn as done and STOP."|
|Validation|"Go through the spec Functional Requirement (FR) by FR: which test covers each one and its result. Final verdict: is the spec fulfilled?"|
|Change|"New requirement: <X>. Do NOT touch code: update the spec first and show me the diff."|

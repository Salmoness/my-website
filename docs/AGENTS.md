# Website vault — agent instructions

This `docs/` folder is the Obsidian vault for the public Azul website repository. It contains website implementation guidance and approved public facts only.

Before website work, read `Home.md`, `website/Public Content Contract.md`, `website/Implementation.md`, and the topic note relevant to the task. Use the current code to confirm what is implemented. `HANDOFF.md` records the latest working state.

## Boundaries

- Keep company strategy, private decisions, operating details, internal pricing rationale, client information, and credentials out of this repository.
- The separate company vault is the source of truth for business decisions. Copy only approved public facts into `website/Public Content Contract.md` when a website change needs them.
- Treat historic portfolio code and copy as implementation material, not current Azul requirements.
- Do not invent clients, results, testimonials, credentials, guarantees, or legal status.
- Keep core content, prices, navigation, email contact, and the ordinary enquiry form usable without JavaScript.
- Preserve keyboard access, visible focus, responsive layout, and reduced-motion behavior.
- Use `pnpm` and the root scripts documented in `README.md`. Do not add a dependency without a current need.
- Do not commit, push, deploy, or rewrite Git history unless the user asks.

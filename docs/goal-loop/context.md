# Context

This repository is currently a GitHub profile repository. It contains an empty
`README.md`, generated profile SVGs, and a workflow that rewrites the README.
There is no existing package manager, app, design-system source, test setup, or
local design language to preserve.

The requested system must support React web and React Native/Expo apps. The
user chose the three public catalogues to narrow component families and chose
Toss TDS as the component implementation authority. Daangn SEED and Wanted
Montage are catalogue, architecture, and evidence references; they are not
equal implementation authorities.

The recommended delivery location is a dedicated `KimGSeok/design-system`
repository. This profile repository may later link to its docs and package.

The system originated from a Loci admin workbench that combined Apple-informed
product sensitivity, Toss/SEED catalogue mapping, Web/App export audits, and
rendered previews in one product-owned route. That workbench proved the value
of role-first navigation and explicit platform gaps, but it also coupled a
generic system to Loci entities, brand decisions, one 2,600-line page, and
manually duplicated inventories.

This repository now owns the extracted, domain-neutral system. Consumer
projects import package primitives and composites, then add brand tokens and
domain compositions locally. `apps/design-docs` is the official explanatory
surface; Storybook remains the exhaustive state and QA laboratory.

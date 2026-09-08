---
title: "What BMad Method and GSD Core Actually Are"
description: "BMad Method simulates a full agile team of specialist AI agents. GSD Core keeps context clean through isolated, wave-based execution. Here's what's actually running under the hood when an engineer types a command."
image: "/images/blog/bmad-gsd-series-2.svg"
customSlug: "bmad-vs-gsd-what-bmad-and-gsd-are"
author: "Ryc Brownrigg"
categories:
  - "AI"
date: 2026-09-01T12:00:00Z
readTime: "5 min read"
comments: 0
draft: false
---

In the [last post](/blog/bmad-vs-gsd-why-this-matters-now/), I laid out the verdict without much explanation: BMad Method is a virtual agile team, and GSD Core is a production line. That's a useful shorthand, but it's still a pitch-deck answer. Before you can decide which one fits your organization, you need to know what's actually running under the hood when an engineer types a command. So let's open both of them up.

## BMad Method [.text-h4]

BMad Method, short for Breakthrough Method of Agile AI-Driven Development (also styled "Build More, Architect Dreams"), is an open-source, MIT-licensed framework created by Brian Madison. It integrates into a project and provides engineers with a roster of specialist AI agents: Product Manager, Architect, Analyst, Scrum Master, Developer, QA, UX, and others, along with guided workflows that scale from a small change to a full product.

The operating idea is agentic planning plus context-engineered development. Planning agents collaborate with a human to produce briefs, PRDs, architecture, epics, and stories. Those artifacts become the brief for the implementation agents, so the coder doesn't have to reconstruct intent from a long, meandering chat thread. It's the same reason a real dev team writes tickets instead of relaying instructions down a hallway. Later modules add test architecture, creative and innovation work, game development, custom agent building, and unattended epic loops for teams that want less hand-holding once the pattern is established.

In practical terms, BMad is a methodology packaged as prompts, skills, and workflows. It's not a new IDE, nor is it a hosted SaaS platform. It runs inside the AI coding environments you already have (Claude Code, Cursor, Codex CLI, and others), and it can even do its planning in a web LLM to conserve IDE tokens before implementation begins.

The typical flow looks like this: Analysis, then Planning (the PRD), then Solutioning (architecture, epics, stories), then Implementation with review. But BMad doesn't force every task through the full ceremony. Quick Dev handles small, well-understood changes without the full role roster. The full Method is for products and platforms, and BMad Loop is for less-attended epic execution once a team trusts the pattern. The software itself is free; what you pay for is the compute those specialist agents burn.

## GSD Core [.text-h4]

GSD Core, for "Git. Ship. Done.," is a lightweight framework built around meta-prompting, context engineering, and spec-driven development. It started as Get Shit Done and continues today under the Open GSD / gsd-core line. It's worth noting that lineage, because GSD was built as a direct reaction to heavier agile-simulation frameworks: less ceremony, more execution discipline.

The operating idea is that large language model quality degrades as the context window fills up, a phenomenon people in this space call context rot. Anyone who's had an hour-long coding session with an assistant that started strong and grew sloppier by the end has felt this firsthand. GSD's answer is to keep the main session thin and delegate research, planning, coding, and verification to fresh-context subagents. Each plan is deliberately small. Independent pieces of work run in parallel waves rather than sequentially. Durable Markdown files in a `.planning/` directory carry decisions across chat resets, so nothing important lives only in a conversation that's about to be summarized away.

The loop repeats as Discuss, Plan, Execute, Verify, Ship. By the time an executor agent touches the code, it's working from a `CONTEXT.md`, a `RESEARCH.md`, and a `PLAN.md`, not from a 200-message thread it has to re-read and reinterpret. That's the whole trick: the agent doing the coding never has to hold the entire history of how you got here.

GSD isn't tied to a single vendor. It covers Claude Code, Codex, Cursor, Windsurf, Copilot, OpenCode, Gemini CLI, and others. Like BMad, the software is free. Token spend is often lower than in a ceremony-heavy framework because the work is sliced and isolated rather than run through a full planning cast, though parallel waves can still add up to real compute if you're not watching them.

## The Shape of the Difference [.text-h4]

Put side by side, the contrast is really about where each framework invests its effort. BMad invests effort up front, in people-shaped roles that force explicit thinking before a line of code exists. GSD invests effort in keeping the execution environment clean so the thinking that already happened doesn't get diluted by a long session. Neither one solves the other's problem, which is exactly why the comparison keeps tripping people up: they look like competitors, but they're built to fail differently.

That difference in design intent is also where the real strengths and weaknesses come from, and it's not as clean a split as the one-page verdict makes it look. Next up, I'll go through what each framework is genuinely good at and where it breaks down in practice.

*This is Part 2 of the [BMad Method vs GSD Core series](/blog/bmad-vs-gsd-why-this-matters-now/). The full series makes the case that this is an operating-model decision, not a tooling choice, and works through where each framework fits, where it breaks, and how to pilot both without picking a winner too early.*

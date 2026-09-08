---
title: "Building a Cross-Chain Rights Management System"
description: "I built a Polkadot parachain that lets creators offer subscriptions, pay-per-view, and permanent ownership from a single rights record portable across blockchains. This is the series intro."
image: "/images/blog/ccrms-series-0.svg"
customSlug: "ccrms-intro"
author: "Ryc Brownrigg"
categories:
  - "Web3 & Blockchain"
date: 2026-05-05T12:00:00Z
readTime: "6 min read"
comments: 0
draft: false
---

I spent the final stretch of my graduate research building something I'll admit sounds a little dry on paper: a blockchain parachain for managing content rights. But the problem it addresses isn't dry at all. If you've ever tried to make a living as an independent creator, you've probably felt it firsthand.

Here's the setup. An independent musician earning USD 100,000 in streaming revenue typically keeps between USD 55,000 and 70,000 after platform fees and distributor commissions — and it's even worse for label-signed artists. Centralized intermediaries retain between 30 and 60 percent of gross creator revenue, depending on the platform. Fees are non-negotiable, audiences don't follow you if you switch platforms, and the terms of service can change under your feet at any time.

It gets worse when you look at how fragmented monetization models are. Subscriptions live on Patreon. One-time sales happen on Gumroad. Pay-per-view is barely supported anywhere because the overhead of traditional payment rails makes small transactions uneconomical. If you want to offer all three models to your audience, you're running three or four platforms in parallel and reconciling the accounting by hand.

Blockchain has been pitched as the fix for this for years, and there's real substance to that pitch: NFTs provide transferable ownership, cross-chain bridges move assets between ecosystems, and academic and industry projects have proposed rights-metadata schemes. But every attempt I found in the literature solved only a slice of the problem, not the whole. NFTs give you ownership but not recurring access. Subscription-style decentralized platforms provide recurring revenue but confine you to a single chain and audience. Cross-chain bridges move value but strip out the rights metadata that would tell the receiving chain what that value represents. No existing system — centralized or decentralized — lets a creator offer subscription, pay-per-view, and permanent ownership from a single rights record that remains portable across blockchains.

That gap is what my dissertation set out to close, and the result is a working prototype I call CCRMS, the Cross-Chain Content Rights Management Service. It's a Polkadot parachain built on FRAME pallet primitives, using Polkadot's Cross-Consensus Messaging protocol (XCM) to move rights operations across chains, with a bridge extension to Ethereum via Snowbridge. The central idea is a unified rights token: a single on-chain record that can represent an active subscription, a remaining pay-per-view balance, or permanent ownership of a single piece of content — all governed by a single set of rules rather than three separate systems bolted together.

I didn't just design this on paper. I built it, benchmarked it, and stress-tested the economics using a Monte Carlo simulation across a thousand simulated creators. Some of what I found confirmed what I'd hoped for. Some surprised me, and I think the honest surprises are the most useful part of the work.

## The Series [.text-h4]

Over the next six posts, I'm going to walk through what I built and what I learned. Here's where we're headed:

**[Part 1 — Why Creator Monetization Is Still Broken](/blog/ccrms-why-creator-monetization-broken/)** delves deeper into the problem: why existing blockchain approaches to content rights — including the most credible ones, such as Story Protocol — address only part of what creators need.

**[Part 2 — One Token, Three Ways to Pay](/blog/ccrms-one-token-three-ways-to-pay/)** explores the core technical idea: how a single unified rights token can natively support subscription, pay-per-view, and ownership simultaneously, without those three access modes stepping on each other.

**[Part 3 — Making Rights Portable Across Chains](/blog/ccrms-rights-portable-across-chains/)** covers cross-chain portability: how XCM lets a rights operation on one parachain be paid for by an account on a completely different chain, and what it took to extend that capability to Ethereum.

**[Part 4 — What Broke, and What It Taught Me](/blog/ccrms-what-broke/)** is the one I'm most looking forward to writing because it covers everything that broke. Nine significant engineering pivots shaped the final architecture — including one decision that, by pure luck, protected the whole project from a major ecosystem shakeup that occurred while I was still writing.

**[Part 5 — Is It Fast, Secure, and Actually Decentralized?](/blog/ccrms-fast-secure-decentralized/)** covers the numbers: throughput, latency, a security audit, and a decentralization comparison against Ethereum, Solana, and centralized platforms, using the same metric antitrust regulators use to assess market concentration.

**[Part 6 — The Honest Answer on Decentralization and Creator Revenue](/blog/ccrms-decentralization-creator-revenue/)** closes the series with the finding I think matters most: a Monte Carlo simulation of a thousand creators showed that decentralization isn't a universal win. It's conditional on audience size, and I'd rather give you the honest, conditional answer than a marketing pitch.

If you build on Polkadot, think about creator economics, or just want to see what a from-scratch cross-chain system looks like when you try to make it work, you'll find something useful here. Let's get into it.

---
title: "Is It Fast, Secure, and Actually Decentralized?"
description: "26.2 TPS, two real vulnerabilities found and fixed, and an HHI-based decentralization comparison against Ethereum, Solana, and centralized platforms. Here's what the numbers actually say."
image: "/images/blog/ccrms-series-5.svg"
customSlug: "ccrms-fast-secure-decentralized"
author: "Ryc Brownrigg"
categories:
  - "Web3 & Blockchain"
date: 2026-06-16T12:00:00Z
readTime: "8 min read"
comments: 0
draft: false
---

Design decisions and war stories are one thing. At some point, you have to measure the system and report what you find — including the parts that don't flatter it. This post covers the three questions I think any serious evaluation of a system like this must answer honestly: how fast it is, how secure it is, and whether decentralization is real or just a marketing claim.

## Throughput and Latency [.text-h4]

During a sustained stress test, 200 concurrently funded accounts submitted transactions continuously for 180 seconds. CCRMS sustained 26.2 transactions per second. Single-chain inclusion latency remained consistently around 6 seconds, aligning with the test parachain's roughly 6-second block time. Block weight utilization stayed low even under load: at 300 transactions per block, only about 12.9 percent of computational weight and 2.2 percent of proof-size weight were consumed, suggesting a theoretical single-parachain ceiling of around 283 TPS.

I want to put that 26.2 TPS figure in honest context, because on its own it sounds unimpressive. This aligns with published survey data on Nominated Proof-of-Stake networks without additional Layer-2 acceleration. Polkadot's scaling strategy is horizontal: with a hundred parachains each running at a similar rate, you're looking at aggregate capacity in the thousands of TPS, before even counting the Elastic Scaling features that let a single parachain use multiple cores. And practically speaking, rights-management transactions — subscribing, renewing, transferring ownership — are inherently low-frequency events. A subscriber renews a license once per billing cycle, not continuously. At 26.2 TPS, CCRMS could theoretically handle roughly 2.3 million transactions a day, which comfortably exceeds the addressable user base of most independent creator platforms.

Cross-chain latency was covered in the [previous post](/blog/ccrms-rights-portable-across-chains/): 3 to 5 blocks on the CCRMS chain, translating to roughly 100 seconds of wall-clock time after accounting for the relay-chain hop, on a pre-Polkadot-2.0 toolchain. That's an upper bound in the test environment, not a production forecast.

## Storage Efficiency [.text-h4]

Storage growth was perfectly linear, which matters more than it might sound. A content registration costs 191 bytes on-chain; an active subscription costs 112 bytes; a view pack costs 111 bytes; an ownership record costs just 36 bytes. The fiftieth registered item cost exactly the same as the first, confirming constant-time storage-map complexity rather than a hidden growth curve. Extrapolated to a hypothetical production scale of one million content items and ten million subscribers, the total on-chain state totals approximately 1.3 gigabytes — comfortably within range for commodity parachain node hardware.

## Reliability [.text-h4]

Reliability was tested by monitoring baseline block production, forcibly killing the collator process, and measuring the recovery time. Mean time to recovery was roughly 15 to 20 seconds, with full state integrity preserved through the crash and restart, and post-recovery block production statistically indistinguishable from the pre-crash baseline. Baseline uptime in this configuration was 90 percent, reflecting a single-collator test topology rather than a production deployment; production networks run multiple collators so that one node's downtime doesn't appear as network downtime.

## Security [.text-h4]

I conducted a thorough audit: static analysis, a manual review of all seventeen extrinsics, and targeted unit tests focused on authorization gaps and edge cases. The audit uncovered eight findings. Two were genuine vulnerabilities, and both were fixed.

One was the authorization gap I described in the [last post](/blog/ccrms-what-broke/): a cross-chain ownership-transfer call that failed to verify that the caller actually held the identity it claimed to be transferring from. The other was a view-pack overwrite bug in which a repurchase could overwrite an existing balance instead of adding to it. Three findings were accepted as design properties rather than bugs — for instance, allowing zero-price content registration is a legitimate use case, not an oversight. The remaining three were positive findings: confirmed full state persistence across crashes and that block production behavior didn't degrade after recovery.

By the end of the audit, no critical or high-severity vulnerabilities remained unresolved. I'd rather report eight findings and two real fixes than claim a clean audit that nobody actually stress-tested, because the latter claim isn't worth anything.

## Decentralization [.text-h4]

This deserves the most scrutiny because "decentralized" is used as a marketing term far more often than it's measured. I used the Herfindahl-Hirschman Index (HHI) — the same concentration metric antitrust regulators use to evaluate market power — to assess validator stake distribution.

Polkadot's mainnet, with roughly 300 validators holding nearly equal stakes, has an HHI of about 33. For context, the US Department of Justice defines anything below 1,500 as "unconcentrated." Ethereum's Proof-of-Stake network, despite having roughly 900,000 individual validators, has an HHI of about 1,200 to 2,000 once stake concentration among a handful of large staking providers is accounted for. Solana lands between 200 and 500, reflecting a more top-heavy stake distribution among its roughly 1,900 validators. A centralized platform — a single entity holding all authority — sits at 10,000, the maximum possible concentration.

Polkadot's Nakamoto coefficient, roughly the number of entities you'd need to collude to compromise the network, is about 80 to 100, compared with about 5 to 7 for Ethereum and exactly 1 for any centralized DRM system. By this measure, a CCRMS deployment on Polkadot would match or exceed the decentralization of the alternatives it's most often compared against — and it's not a qualitative claim. It's a number, calculated the same way regulators calculate market concentration elsewhere.

## The Honest Overall Picture [.text-h4]

CCRMS is roughly 270 times slower in throughput and 67,000 times slower in raw operation latency than a bare-bones centralized Express.js and SQLite baseline I built specifically for comparison. That sounds damning until you remember what the centralized baseline doesn't provide: no single point of failure, cross-chain portability, cryptographically provable rights state, and censorship resistance. None of those properties appear in a raw latency number, but they're exactly what a creator needs from a rights-management system — as opposed to what a high-frequency trading system needs.

The trade-off is real and steep, but for the specific use case this was built for — low-frequency, high-stakes rights transactions — it's the right trade-off to make.

In the [next post](/blog/ccrms-decentralization-creator-revenue/), I'll cover the final and, in some ways, most important question in the series: whether that trade-off actually translates into more money for creators, and the honest, conditional answer the data gave me.

*This is Part 5 of the [CCRMS series](/blog/ccrms-intro/). The full series walks through the architecture, engineering decisions, and honest results of building a cross-chain content rights system on Polkadot.*

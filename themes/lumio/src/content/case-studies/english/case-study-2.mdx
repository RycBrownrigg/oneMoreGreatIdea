---
title: "CCRMS — Cross-Chain Content Rights Management"
image: "/images/ccrms-card.jpg"
imageBanner: "/images/ccrms-banner.jpg"
imageAlt: "CCRMS — Cross-Chain Content Rights"
customSlug: "ccrms"
weight: 2
draft: false
categories:
  - "Web3"
  - "Research"
projectDetails:
  - label: "Stack"
    value: "Rust, FRAME/Substrate, ink!, XCM v5, Snowbridge V2, JavaScript"
  - label: "Context"
    value: "MSc Dissertation — University of Malta"
  - label: "License"
    value: "MIT (post-defense release)"
  - label: "Year"
    value: "2025–2026"
---

MSc dissertation artifact at the University of Malta. CCRMS is a Polkadot parachain prototype that delivers subscription, pay-per-view, and permanent ownership as three native access modes of a single unified rights token — with automatic royalty splits and cross-chain portability via XCM and Snowbridge. All 11 KPIs met their targets.

## The Problem [.text-h4]

The content creator economy concentrates value in centralized intermediaries that retain 30–60% of gross creator revenue. Fragmentation runs deeper than fees: subscriptions live on Patreon, one-time sales on Gumroad, pay-per-view is economically unviable on conventional payment rails, and content rights remain bound to each platform's terms of service. No existing system — centralized or decentralized — delivers all three monetization models from a single rights primitive portable across blockchains.

## Architecture [.text-h4]

CCRMS implements a pallet-first design on Polkadot's FRAME primitives with parent–child NFT nesting on `pallet-nfts`. A single `Content<T>` storage entry simultaneously encodes subscription terms, pay-per-view quota, and ownership state; one integrated access check enforces all three — renewal and expiry are first-class state transitions, not contract-layer constructions.

- **`pallet-content-rights`** — full rights token lifecycle: minting, transfer, verification, expiry, royalty distribution with up to 10 collaborators at basis-point precision
- **`pallet-rights-verifier`** — Merkle storage proof verification for off-chain rights assertion without full chain sync
- **XCM v5 + Snowbridge V2** — cross-chain portability with rights metadata preserved on transfer; Snowbridge V2 launched November 2025 with ~USD 75M TVL

The pallet-first architecture incidentally provided resilience when ink! development was discontinued in January 2026, demonstrating that the core system functions fully without a smart contract layer.

## Results [.text-h4]

Evaluated against a centralized Express.js/SQLite baseline with 56 unit tests, 7 performance benchmarks, a security audit, and a 10,000-iteration Monte Carlo creator revenue simulation:

- **26.2 TPS** sustained throughput · **~6-second** inclusion latency · **3–5-block** cross-chain finality
- **191 bytes** per content item · **90% baseline uptime** · **15–20-second MTTR**
- **~16.8% higher** average creator revenue than centralized platforms (Monte Carlo mean)
- **8 security findings** — 1 Medium and 1 Low remediated; 6 accepted as architectural trade-offs

The revenue advantage is strongly audience-dependent: creators above ~10,000 followers benefit decisively; those below ~2,000 are better served by centralized discovery platforms.

## Key Finding [.text-h4]

A unified rights token natively supporting all three access models can be constructed from standard FRAME primitives without novel cryptographic mechanisms. This closes a gap in the literature: no prior system had delivered subscription, pay-per-view, and permanent ownership as first-class modes of a single cross-chain-portable primitive.

---
title: "Making Rights Portable Across Chains"
description: "XCM v3 is sufficient for cross-chain rights operations with no custom protocol extensions. Here's how payer-beneficiary decoupling, trustless Merkle proofs, and Snowbridge forward compatibility make it work."
image: "/images/blog/ccrms-series-3.svg"
customSlug: "ccrms-rights-portable-across-chains"
author: "Ryc Brownrigg"
categories:
  - "Web3 & Blockchain"
date: 2026-06-02T12:00:00Z
readTime: "8 min read"
comments: 0
draft: false
---

A unified rights token is only half the story if it's confined to a single chain. The whole point of building CCRMS as a Polkadot parachain rather than a single-chain application was to make content rights genuinely portable: a user should be able to acquire rights on one blockchain and use them on another without losing access or repurchasing them. This post explains how that works and where I had to draw an honest line between what's proven and what's merely designed.

## Payer-Beneficiary Decoupling [.text-h4]

The mechanism is Polkadot's Cross-Consensus Messaging protocol, XCM, and the core insight that makes cross-chain rights operations tractable is what I call payer-beneficiary decoupling. In a normal, single-chain transaction, the account paying for an operation and the account receiving its effects are the same — the caller. In a cross-chain call, that's no longer true. When a remote parachain sends a message to CCRMS, the dispatch origin is the sovereign account of that remote chain, essentially a proxy address representing the entire parachain, while the actual beneficiary of the rights record is a separate, specific end-user account. That separation lets a remote parachain acquire rights on behalf of its users without those users ever needing to hold an account or interact directly with CCRMS.

Concretely, the pallet exposes five XCM extrinsics: `xcm_subscribe`, `xcm_renew_subscription`, `xcm_purchase_views`, `xcm_purchase_ownership`, and `xcm_transfer_ownership`. Each follows the same three-instruction message sequence: `WithdrawAsset` to withdraw the fee, `BuyExecution` to pay for the weight the operation consumes, and `Transact` to dispatch the extrinsic. This proved sufficient for every rights operation I needed to support, a meaningful finding in itself: no custom XCM extensions were required. XCM v3, used correctly, handles this class of problem out of the box.

## Trustless Rights Verification [.text-h4]

One question this raises immediately: if the rights record exists only on CCRMS, how does another parachain trust that a user holds an active subscription without running its own copy of CCRMS's entire state? That's what a second pallet, `pallet-rights-verifier`, is for. It provides trustless verification of CCRMS rights state via Merkle storage proofs. A remote parachain can submit a proof against a known CCRMS state root and — without any oracle or relayer in the loop — verify that a specific account holds an active subscription, an ownership record, or a remaining view-pack balance. Three extrinsics handle this: `verify_ownership`, `verify_subscription`, and `verify_view_pack`. Each constructs a storage key, validates the cryptographic proof, and emits a result event. The point is that CCRMS rights remain canonical on the CCRMS chain; other chains authenticate against that canonical state cryptographically rather than maintaining their own replicas.

## The Latency Numbers [.text-h4]

I measured end-to-end XCM latency for `xcm_subscribe`, `xcm_purchase_views`, and `xcm_purchase_ownership` at roughly 100 seconds of wall-clock time on my local test topology, which corresponds to a 3-to-5-block delta on the CCRMS chain. That block-count figure understates the actual elapsed time because the relay-chain hop and horizontal relay-routed message passing add about 70 seconds of wall-clock overhead that doesn't appear in the CCRMS block count.

It's worth being direct about this: that 100-second figure is a pre-Polkadot-2.0 upper bound, measured before the ecosystem's Async Backing, Agile Coretime, and Elastic Scaling features matured. Those features materially reduce per-parachain latency, and I'd expect this number to drop significantly in a production Polkadot 2.0 environment. I'm reporting the number I actually measured, not the one I'd prefer to have measured, because that's the only way this kind of result stays useful to anyone reading it later.

## Snowbridge and Forward Compatibility [.text-h4]

Another direction I pushed the cross-chain model was to move it entirely outside Polkadot and onto Ethereum via Snowbridge — a trust-minimized bridge that uses light-client verification on both sides rather than custodians or a trusted relayer. I successfully bridged two 1 ETH transactions from a local Ethereum chain to a local AssetHub parachain, running the complete pipeline: a Geth execution client, a Lodestar beacon node, sixteen Gateway contracts, and both a beacon relay and an execution relay forwarding proofs between the chains. Both transactions succeeded.

That demonstrates something I care about architecturally, which I call forward compatibility: I configured the CCRMS runtime's location converters to accept Ethereum-originated XCM messages at minimal extra cost, well before I had any concrete plan to use bridged Ether. When I later wanted to explore paying for CCRMS operations with bridged Ether, the runtime was already prepared for it without touching the business logic pallet at all.

## Honest Limits [.text-h4]

I want to be honest about what the Snowbridge work demonstrates. The integration ran entirely on a local Ethereum stack, not on a public testnet or mainnet, so it's a proof of architectural feasibility, not a validation of production bridge behavior under real network conditions, MEV, or beacon chain reorganizations. The final step — using bridged Ether to pay for a CCRMS rights operation end-to-end — was not implemented in the prototype. The XCM side is already configured to accept it; what's missing is configuring the pallet's payment currency to accept foreign Ether alongside the native token. That's a small, well-scoped piece of near-term work, not a fundamental gap in the design.

The honest summary: XCM v3 is sufficient for authenticated, atomic cross-chain rights operations, with no custom protocol extensions required. The architecture is deliberately designed to extend to non-Polkadot ecosystems like Ethereum without changing the core business logic. The main caveat is latency, which is a toolchain-maturity issue, not an architectural one.

In the [next post](/blog/ccrms-what-broke/), I want to talk about everything that didn't go as planned while I was building this — because that's where the more interesting lessons live.

*This is Part 3 of the [CCRMS series](/blog/ccrms-intro/). The full series walks through the architecture, engineering decisions, and honest results of building a cross-chain content rights system on Polkadot.*

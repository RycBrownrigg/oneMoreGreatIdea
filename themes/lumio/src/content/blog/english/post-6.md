---
title: "One Token, Three Ways to Pay: Designing a Unified Rights Primitive"
description: "Subscription is time-bounded. Pay-per-view is usage-counted. Ownership is indefinite. Here's how a single FRAME pallet encodes all three as native states of one on-chain record — no novel cryptography required."
image: "/images/blog/ccrms-series-2.svg"
customSlug: "ccrms-one-token-three-ways-to-pay"
author: "Ryc Brownrigg"
categories:
  - "Web3 & Blockchain"
date: 2026-05-26T12:00:00Z
readTime: "7 min read"
comments: 0
draft: false
---

If you take away one idea from this series, I'd want it to be this one. It's the central conceptual contribution of my dissertation, and it's the part I'm most proud to have gotten right.

The academic challenge, stated plainly: subscription, pay-per-view, and permanent ownership are three fundamentally different access semantics. Subscription is time-bounded. Pay-per-view is usage-counted. Ownership is indefinite. Every system I found in the literature treats these as separate product categories, built on separate infrastructure, often on entirely separate platforms. Story Protocol gets closer than most by making its licensing flexible, but it still requires distinct license-token types for each model. The question I set out to answer was whether you actually need three separate systems, or whether a single on-chain record can represent all three access modes as native states of one thing, resolved by a single set of rules.

The answer, it turns out, is yes — and you don't need any novel cryptography or consensus-layer trickery to achieve it. You need a single well-designed FRAME pallet.

## The Shape of the Model [.text-h4]

CCRMS represents content rights as NFTs using a parent-child nesting model. Each piece of registered content receives one parent Content NFT, which serves as the canonical on-chain identity for that item: creator, price, and subscription terms, all attached to that single record. For each user who acquires rights to that content, a child NFT is minted beneath it, tagged with a `rights_type` attribute: Subscription, PPV, or Ownership. The parent establishes identity. The children tokenize individual rights. Because it's all one collection, the relationship between content and rights holders remains auditable on-chain in a way that scattered platform databases never are.

## How Each Model Works [.text-h4]

**Subscription** grants time-limited access to a configurable number of blocks per content item, with optional automatic renewal triggered by an on-chain block hook, allowing a creator to offer something that behaves like a recurring Patreon tier without an off-chain billing system.

**Pay-per-view** provides prepaid access to a specified number of views. This was the part I was most careful about, because PPV is where blockchain-based systems have historically failed due to the micropayment problem: gas fees exceeding the value of the content itself. My solution was to reconceptualize PPV as a counter rather than a sequence of individual view transactions. Each `consume_view` operation simply decrements the counter; additional purchases increase the count rather than overwriting it. That single design choice — treating consumption as a counter rather than a chain of one-off payments — is what makes PPV economically viable on-chain rather than a theoretical nicety that nobody would actually use.

**Permanent ownership** grants unrestricted, transferable access. Transfers follow a mint-burn-mint pattern rather than a direct NFT handoff. This may sound like extra ceremony, but it preserves provenance and attribution consistency in a way that direct reassignment doesn't, and it avoids the ambiguity that comes with directly reassigning an existing token.

## What Makes It Unified [.text-h4]

Here's what makes this a unified primitive rather than three features of sitting next to each other: a single content item can offer all three models concurrently, and a single `check_access` function determines which applies, in strict priority order. Ownership beats Subscription beats PPV. If you own the content outright, that's checked first, and access is granted regardless of subscription or view-count state. If you don't own it, the system checks for an active subscription. Only if neither applies does it fall through to the PPV counter. One function, one priority order, and three storage maps — `Subscriptions`, `ViewPacks`, `Owners` — that never contaminate each other's state.

## RMRK and a Decision That Mattered More Than I Expected [.text-h4]

The nesting pattern is inspired by RMRK 2.0, the composable NFT specification that's become a standard reference point in the Polkadot ecosystem for parent-child token relationships. I implemented it directly on top of `pallet-nfts` rather than depending on the original RMRK pallets — and that decision turned out to matter far more than I expected. I'll explain exactly why in the [next post](/blog/ccrms-rights-portable-across-chains/), because it's one of the better war stories from the whole build.

## A Real Constraint [.text-h4]

One practical constraint worth being upfront about: the `Children` storage entry is limited to fifty child NFTs per parent because FRAME's benchmarking system needs to calculate worst-case computational weight in advance, and an unbounded collection makes that calculation impossible to do safely. In practice, that means a single piece of content can have up to fifty simultaneous rights holders under the current implementation before you'd need to raise that bound or restructure the storage. For a research prototype, that's a completely reasonable place to draw the line. For a production deployment serving a viral piece of content, it's a real constraint and one of the near-term items on my work list.

The bigger point is this: the unified rights token shows that you can encode three genuinely distinct, previously siloed monetization models into a single composable on-chain asset without inventing new cryptography or touching the consensus layer. All the machinery already exists in standard Polkadot SDK primitives. You just need to be deliberate about how you compose them.

In the [next post](/blog/ccrms-rights-portable-across-chains/), I'll cover how that same rights record remains useful when the person paying for it and the chain they're paying from aren't the same as the chain CCRMS lives on.

*This is Part 2 of the [CCRMS series](/blog/ccrms-intro/). The full series walks through the architecture, engineering decisions, and honest results of building a cross-chain content rights system on Polkadot.*

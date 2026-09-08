---
title: "What Broke, and What It Taught Me"
description: "Nine pivots shaped CCRMS's final architecture. One of them — made for entirely unrelated engineering reasons — accidentally protected the whole project from an industry shakeup I never saw coming."
image: "/images/blog/ccrms-series-4.svg"
customSlug: "ccrms-what-broke"
author: "Ryc Brownrigg"
categories:
  - "Web3 & Blockchain"
date: 2026-06-09T12:00:00Z
readTime: "9 min read"
comments: 0
draft: false
---

Every dissertation has a clean narrative in the final write-up and a much messier reality behind it. This post is about that messy reality — because I think the nine significant pivots that shaped CCRMS's final architecture are more instructive than the polished result on its own. One of them even protected the whole project from an industry shakeup I never saw coming.

## The Pivot Away From RMRK 2.0 [.text-h4]

My original plan was to build parent-child NFT nesting on top of RMRK 2.0, the composable NFT specification that provided the nesting semantics I needed. Reusing an established standard was supposed to reduce implementation risk. Instead, during early investigation, I discovered that the RMRK pallets were frozen on an old Polkadot SDK version and depended on a now-deprecated pallet that the current SDK monorepo no longer supports. My attempts to compile the reference implementation against the current toolchain failed outright because of incompatible storage schemas and removed traits. So I reimplemented RMRK's nesting semantics directly on top of the modern, actively maintained `pallet-nfts`, without relying on any RMRK pallets.

It took longer than reusing the standard would have. The lesson that stuck: established libraries carry latent compatibility risk when they aren't actively kept up to date, and reimplementing a standard's semantics from scratch can be more maintainable when the reference implementation has gone stale.

## The Pivot From Contract-First to Pallet-First [.text-h4]

My original design put ink! smart contracts front and center as the user-facing interface, with a chain extension bridging to a lightweight coordination pallet beneath. During implementation, two problems hit at once: the chain extension mechanism in the current `pallet-revive` release was effectively non-functional for write operations, and debugging cross-pallet contract calls was significantly more complex than working directly with FRAME pallets. So I inverted the architecture. The pallet, `pallet-content-rights`, became the definitive source of truth for all business logic, while the ink! contract was kept only as a thin, stateless interface layer that mirrors the pallet's API.

This is, without question, the single most consequential engineering decision in the entire project — and I'll explain exactly why at the end of this post.

## The Snowbridge Fork-Version Bug [.text-h4]

During the Ethereum bridge integration, the beacon relay was generating Merkle inclusion proofs at the wrong tree position — gindex 54 instead of the correct 86 — causing every submitted update to be rejected. The root cause was a subtle misinterpretation: the relay's configuration field was read as a version identifier, even though the code expects it to represent a fork activation epoch. A hex value that looked like a perfectly reasonable version number was silently interpreted as an enormous epoch number, placing the "active" fork tens of millions of epochs in the future.

Cryptographic verification systems often fail silently on configuration errors like this. There's no error message that says "you configured the epoch wrong." There's just a proof that mysteriously fails to verify.

## The Lodestar Preset Mismatch [.text-h4]

A related headache: the beacon client pallet was compiled assuming a full 512-validator mainnet sync committee, but Lodestar's development mode used a 32-validator minimal preset by default, and setting the relevant environment variable didn't change that behavior. The fix was to pin a specific Lodestar version built from source that respected the setting. Light clients impose strict counterpart requirements that configuration alone can't paper over, and bridge toolchain compatibility is fragile enough to require reconfirmation with every component upgrade.

## The XCM Endianness Bug [.text-h4]

This one cost me significant debugging time because the symptom pointed in exactly the wrong direction. Cross-chain tests showed funds debited on the source chain — successfully — while the destination chain reported insufficient payment. It turned out the JavaScript client library was constructing the sovereign account address in big-endian byte order by default, whereas the pallet expected little-endian. Both orderings produce a perfectly valid-looking 32-byte address. One was funded but never used; the other was used but never funded.

The lesson generalizes well beyond this specific bug: endianness mismatches are nasty precisely because both sides look correct in isolation, and the failure symptom actively misdirects you to the wrong half of the system.

## The XCM Fee Scaling Surprise [.text-h4]

I initially set cross-chain execution fees to what seemed like a reasonable round number, but every test failed. It turned out that Polkadot's fee model is dominated by proof size, not computational effort, and even a minimal cross-chain message requires a fee roughly seventy to a hundred times larger than my initial guess. Don't assume a blockchain's fee model scales the way your intuition about computational cost suggests.

## The Authorization Gap [.text-h4]

During a later security audit, I found that `xcm_transfer_ownership` accepted a `from` identity parameter without verifying that the caller actually held it — allowing any signed account to attempt to reassign someone else's ownership rights. One line fixed it: an explicit check that the caller matches the claimed identity. The generalizable lesson: any cross-chain extrinsic that accepts an identity parameter as input, rather than deriving it from the call's origin, needs an explicit authorization check — because the payer-beneficiary decoupling that makes cross-chain operations useful is exactly what introduces the impersonation risk in the first place.

## The Fifty-Child Ceiling [.text-h4]

Batches of subscription calls for the same content item started failing again once more than fifty child NFTs had been minted under a single parent, because FRAME's bounded-collection requirements cap it at fifty for benchmarking purposes. I documented it as a known limitation rather than trying to work around it under deadline pressure. Sometimes the right response to a constraint is honest documentation, not a rushed workaround.

## And Then ink! Was Discontinued [.text-h4]

On January 27th, 2026, the ink! Alliance announced it was ceasing development after three failed OpenGov treasury funding proposals; both the Web3 Foundation and Parity Technologies declined to provide further funding. For any project that had built its business logic inside ink! contracts, this would have been a genuine crisis. For CCRMS, it was almost a non-event — because the pallet-first pivot I made months earlier, for entirely unrelated engineering reasons, meant the ink! contract in my codebase was already a thin, non-load-bearing wrapper. I deferred any migration decision because, functionally, there was nothing urgent to migrate.

That last one is the moment that stuck with me most from this whole project. I didn't choose pallet-first architecture because I predicted ink!'s discontinuation. I chose it because chain extensions were broken and cross-pallet debugging was miserable. But it turned out that architectural decisions that minimize your dependence on any single non-essential component pay dividends precisely when the ecosystem changes in ways you can't predict. That's not a lesson specific to Polkadot or this project. It's just good engineering, and I got to watch it pay off in real time.

In the [next post](/blog/ccrms-fast-secure-decentralized/), I'll cover the numbers — what CCRMS measures in throughput, latency, security, and decentralization.

*This is Part 4 of the [CCRMS series](/blog/ccrms-intro/). The full series walks through the architecture, engineering decisions, and honest results of building a cross-chain content rights system on Polkadot.*

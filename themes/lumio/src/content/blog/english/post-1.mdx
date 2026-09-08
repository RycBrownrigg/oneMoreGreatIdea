---
title: "The Architecture Behind High-Concurrency OTT Streaming"
description: "What it actually takes to handle 300,000 concurrent live streams — and the architecture decisions that make or break it at scale."
image: "/images/blog/ott-high-concurrency.svg"
customSlug: "ott-architecture-high-concurrency"
author: "Ryc Brownrigg"
categories:
  - "OTT Architecture"
date: 2026-04-28T00:00:00Z
readTime: "8 min read"
comments: 0
draft: false
---

Most streaming architectures are designed to handle today's peak load with a comfortable margin. Very few are designed to handle 10× that load with zero advance warning — which is exactly what live sports events demand.

During a UEFA Champions League Final on HorizonGo, we sustained over 300,000 concurrent streams on a single unified codebase serving seven European operating companies simultaneously. Here is what actually matters at that scale.

## CDN Strategy Is Not a Vendor Decision [.text-h4]

The most common mistake I see in streaming architecture reviews is treating CDN selection as a procurement exercise. It isn't. CDN strategy is an architecture decision that determines your failure modes, your cost curve, and your ability to respond to unexpected load.

At 300K concurrent streams, the question is not "which CDN has the best SLA?" It's: what happens when your primary CDN has a regional incident during the biggest match of the year? Do you have a failover path? Can you switch without session interruption? Do your DRM licenses follow the CDN failover or do they depend on origin?

The answers to those questions are architectural, not contractual.

## Stateless Session Design [.text-h4]

Session state is the enemy of horizontal scale. Every piece of state that lives in a session — playback position, bitrate history, DRM license binding — is something that must be replicated, coordinated, or abandoned when you add capacity.

The architecture that survived 300K concurrent streams was almost entirely stateless at the delivery layer. Playback position was owned by the client and persisted to a lightweight key-value store on resume, not maintained in-flight. Bitrate decisions were client-side with server-side guardrails. DRM licenses were short-lived and renewable, not long-lived session tokens.

## What Actually Fails at Scale [.text-h4]

It's rarely the thing you prepared for. The components most likely to fail under unexpected load are:

- **Metadata services** — they're cheap to query at 10K streams and catastrophically expensive at 300K if you haven't built caching correctly
- **Auth/entitlement services** — similar pattern: every stream start hits entitlement, and entitlement services are usually the last thing to get load-tested
- **Error reporting pipelines** — at scale, your error rate generates its own load; a naive error reporting implementation can amplify a minor failure into a cascade

The architecture review I do for OTT clients almost always surfaces at least one of these. They're not glamorous findings, but they're the ones that matter when it counts.

---

*Interested in an architecture review of your platform? [Start a conversation.](/contact/)*

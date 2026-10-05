---
title: Third time lucky: how we won AI for Good
description: Two UB hackathons without a first place. Then one Saturday, five hours, and the moment they called our team name.
date: 2026-10-05
theme: hackathons
---

On October 3rd, my team and I won first place in the ACV Auctions challenge at AI for Good, Fall 2026, a hackathon hosted by UB's Startup and Innovation Collaboratory. Two days later, I still can't stop smiling about it, so I wanted to write down how it actually happened while it's still fresh.

:::image src="/assets/goingonce/first-place.jpg" alt="Team GoingOnce with the ACV Auctions first place award"
The screen said it before I could believe it: ACV Auctions, First Place, GoingOnce.
:::

## My first hackathon heartbreak

This wasn't my first UB hackathon. I had participated twice before, and neither time ended with first place.

The first one still hurts a little. We did everything right, except one thing. My team and I stayed awake for more than 24 hours building our project. And then we forgot to attach our GitHub link on Devpost. Because of that one missing link, we never got a table for judging. No judge ever saw what we built. That was my first heartbreak.

Lesson learned the hard way: the submission matters as much as the project. The second hackathon didn't end with first place either.

So this time I didn't want to just code faster. I wanted to do something different.

## Five hours, and we spent two of them talking

We had from 10:30 AM to 3:30 PM to build. That's five hours. When the clock started, my first instinct was to open the laptop and start coding. We didn't.

Instead, we spent the first two hours, till around 12:30, just discussing and brainstorming. What is the problem statement really asking? Who has this problem? If we build this, will it actually help them, or will it just look cool in a demo?

Before writing a single line of code, we did one more thing. We evaluated our own idea against the problem statement and asked ourselves honestly: does this really solve it? Only when all of us felt yes, this solves it, did we start building.

That left us around three hours to build a working MVP.

## What we built

We called it GoingOnce. The idea is simple: every car should find its best buyer, across ACV and Copart.

It has four AI agents, built with LangGraph and Claude, one for each part of a car dealer's day:

- **Buy:** a dealer says what they need in plain words. The agent searches ACV and Copart, checks each car's history, throws out cars with hidden damage, and asks before placing a bid.
- **Sell:** upload a few photos, and the agent writes the condition report and finds buyers who are already waiting for that car.
- **Negotiate:** the buyer's agent and the seller's agent each keep a private limit, and a mediator closes the gap until the deal is done.
- **Fleet:** for a rental company selling 120 similar cars, it spreads them across markets in full truckloads, so prices hold and transport stays cheap.

:::image src="/assets/goingonce/platform.jpg" alt="GoingOnce buying assistant inside an ACV-style marketplace"
The buying assistant. It found the cars, caught one with a hidden flood history, and asked before bidding.
:::

Was it a finished product? No. Some parts were real, like the agents, the history checks, and Claude reading requests and car photos. Some parts were simulated, like the listings, payments and trucks. But it worked end to end, and we could show it working live. We even added a "demo-safe" switch, just in case the Wi-Fi gave up on us in the middle of the pitch.

## What I actually learned

Writing code is the easy part now. With the tools we have today, you can build a lot in three hours. What's hard, and what really matters, is the idea. What are you building, why are you building it, and what impact will it have on the people who use it?

Looking back at my earlier hackathons, I think we jumped into code too fast. This time, those two hours of just talking were the best two hours we spent all day.

## The moment

Then it was time for results. When they called out GoingOnce for first place, out of all those teams, I honestly can't express that feeling in words. After two hackathons without it, hearing our team name was something else.

It's one of the best moments of my life, and easily the best since I came to the USA.

We also won some cool prizes: a 3D printer, a Lenovo tablet, headphones and AirPods. We're still figuring out what to do with the 3D printer. But honestly, hearing our team name was the real prize.

:::image src="/assets/goingonce/team.jpg" alt="Team GoingOnce at the University at Buffalo"
Team GoingOnce: Vedant Shinde, Aniket Khade, Jay Pathare and me.
:::

A big thank you to my teammates Vedant, Aniket and Jay. I couldn't have asked for a better team. And thank you to ACV Auctions and UB's Startup and Innovation Collaboratory for putting this together.

If you want to look at the code, it's all on [GitHub](https://github.com/raunakpandey1/goingonce).

On to the next one.

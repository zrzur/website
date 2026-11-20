---
title: Keep your server safe: AutoMod, slow mode and pauses
summary: Roles, AutoMod filters, slow mode, timeouts, bans, the audit log and pauses for raids. A practical guide to moderating a community on Zrzur.
date: 2026-11-13
cover: /blog/moderate-your-server/cover.jpg
tags: moderation, AutoMod, community safety, server moderation, anti-spam
---
A community grows best when people feel safe in it. That does not need a large moderation team: it needs good tools, set up once, that do the boring part for you. This guide walks through the moderation tools in Zrzur, from roles to emergency pauses, and how to set each one up.

## Start with roles and permissions

Every safe server starts with **roles**. A role is a group of permissions: who can read a channel, who can write, who can delete messages, who can time out or ban. A server can have up to **200 roles**, and permissions can be set for the whole server or changed for **each channel** on its own.

A simple setup that works for most communities:

- **Everyone**: read and write in the public channels, nothing more.
- **Moderators**: delete messages, time out and kick members, see the audit log.
- **Admins**: everything, including the server settings.

Keep announcement channels write-only for your team, and give new members their own channel where they can say hello.

## AutoMod: filters that work while you sleep

**AutoMod** checks messages before they appear. You find it in **Server settings › Safety**, under Filters. Each rule looks for one thing:

- **Blocked words**: words and phrases, one per line. Put `*` at the start or end to match part of a word, and keep a list of words that are **always allowed**. An optional list of common **Arabic insults** is there to start from: switch it on and it becomes a rule you can edit.
- **Mention spam**: the most mentions allowed in one message.
- **Link spam**: links from members who joined less than 10 minutes, 1 hour, 1 day or 7 days ago. You can list **allowed domains** that are always fine.
- **Repeated messages**: the same text in several channels within a short time you choose, the classic spam pattern.

When a rule matches, AutoMod can do one or more things: **block** the message, **send an alert** to a channel your team reads, and **time out** the sender for 1 minute, 10 minutes, 1 hour, 1 day or 7 days. The sender sees a short note that the server's AutoMod blocked the message.

## Slow mode for busy channels

When a channel moves too fast to read, turn on **slow mode** in the channel's settings. Each member then has to wait a little between messages. Roles that need to talk freely, such as your team, can be **immune to slow mode**.

## Timeouts, kicks and bans

Not every problem needs a ban.

- A **timeout** stops someone from taking part for a while: they can read, but not write or talk.
- A **kick** removes someone from the server; they can come back with a new invite.
- A **ban** removes them for good: banned people cannot rejoin, even with an invite, until you unban them.

When you act on a member, you can write a **reason**. It is saved in the audit log, so the rest of your team knows why.

## Who may join

In **Server settings › Joining** you decide how people come in:

- **Verification**: before someone can write, ask for a verified email; or a verified email and an account older than 5 minutes; or all of that and 10 minutes in your server.
- **Rules to accept**: new members read and accept your rules before they write.
- **Join requests**: instead of joining at once, people send a request and your team approves them by hand.

## Emergency: pause in one click

Sometimes a server is attacked: many new accounts join at once and start posting. For that there is **Server settings › Safety**, under Emergency. In one click you can:

- **Pause invites**: nobody new can join, even with a link.
- **Pause direct messages** between members of your server.

Each pause lasts **1 hour, 6 hours, 12 hours or 1 day**, and you can end it early with **End now**. Anyone who tries to join meanwhile sees a short note that the server has paused new members for now.

## The audit log: who changed what

The **audit log** lists the changes in your server: roles, channels, bans and settings, who made them, and the reason. When something looks wrong, it is the first place to check.

## Insights: see how your community is doing

**Insights** shows how your server grows: messages per channel, who joined and who left, and how many people write each day. A sudden jump in joins is often the first sign that something is wrong.

## When to report to us

Your tools handle your server. For anything illegal, or a person who harms others across servers, **report** the message, the profile or the server, and our team reviews it. And only friends can start a direct message with people aged 16 and 17.

## Try it

All of these tools come with every server. [Open Zrzur](https://app.zrzur.com), create a server, and spend five minutes in **Server settings**: set up your roles, one AutoMod rule against spam and your rules to accept. If you are setting up a new community, read our guide on [setting up a community server](/blog/set-up-community-server) next.

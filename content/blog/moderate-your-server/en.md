---
title: How to keep your community server safe: AutoMod, slowmode and emergency pauses
summary: Roles, AutoMod filters, slowmode, timeouts, bans, the audit log and one-click pauses for raids. A practical guide to moderating a community on Zrzur.
date: 2026-11-13
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

**AutoMod** checks every message before it appears. You find it in **Server settings › Safety**, under Filters. Each rule looks for one thing:

- **Blocked words**: words and phrases, one per line. Put `*` at the start or end to match part of a word, and keep a list of words that are **always allowed**. A ready list of **Arabic insults** is there to start from.
- **Mention spam**: the most mentions allowed in one message.
- **Link spam**: links from members who joined less than 10 minutes, 1 hour, 1 day or 7 days ago. You can list **allowed domains** that are always fine.
- **Repeated messages**: the same text in several channels within a few seconds, the classic spam pattern.

When a rule matches, AutoMod can do one or more things: **block** the message, **send an alert** to a channel your team reads, and **time out** the sender for 1 minute, 10 minutes, 1 hour, 1 day or 7 days. The sender sees a short note that the message was blocked.

## Slowmode for busy channels

When a channel moves too fast to read, turn on **slowmode** in the channel's settings. Each member then has to wait a little between messages. Roles that need to talk freely, such as your team, can be **immune to slowmode**.

## Timeouts, kicks and bans

Not every problem needs a ban.

- A **timeout** mutes someone for a while: they can read, but not write or talk.
- A **kick** removes someone from the server; they can come back with a new invite.
- A **ban** removes them for good: banned people cannot rejoin, even with an invite, until you unban them.

When you act on a member, you write a **reason**. It is saved in the audit log, so the rest of your team knows why.

## Who may join

In **Server settings › Joining** you decide how people come in:

- **Verification**: ask for a verified email address, or a verified email and an account older than 5 minutes, before someone can write.
- **Rules to accept**: new members read and accept your rules when they join.
- **Join requests**: instead of joining at once, people send a request and your team approves them by hand.

## Emergency: pause everything in one click

Sometimes a server is attacked: many new accounts join at once and start posting. For that there is **Server settings › Safety**, under Emergency. In one click you can:

- **Pause invites**: nobody new can join, even with a link.
- **Pause direct messages** between members of your server.

Each pause lasts **1 hour, 6 hours, 12 hours or 1 day**, and you can end it early with **End now**. Members see a short note that the server paused new members for now.

## The audit log: who changed what

The **audit log** lists every change in your server: roles, channels, bans, settings, and who made them, with the reason. When something looks wrong, it is the first place to check.

## Insights: see how your community is doing

**Insights** shows how your server grows: messages per channel, who joined and who left, and how many people write each day. A sudden jump in joins is often the first sign that something is wrong.

## When to report to us

Your tools handle your server. For anything illegal, or a person who harms others across servers, **report** the message, the profile or the server. Our team reviews every report. Accounts of people aged 16 and 17 get direct messages only from their friends.

## Try it

All of these tools are free. [Open Zrzur](https://app.zrzur.com), create a server, and spend five minutes in **Server settings**: set up your roles, one AutoMod rule against spam and your rules to accept. If you are setting up a new community, read our guide on [setting up a community server](/blog/set-up-community-server) next.

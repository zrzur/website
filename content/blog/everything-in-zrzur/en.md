---
title: Zrzur from A to Z: the idea and every feature
summary: What Zrzur is, why it looks familiar, and every feature of version 26.2.0, from servers and voice to events, moderation, bots and the Arabic experience.
date: 2026-11-20
cover: /blog/everything-in-zrzur/cover.jpg
tags: Zrzur 26.2.0, features, guide, Discord alternative, open source
---
Zrzur (زرزور, Arabic for starling) is a place where friends and communities talk: in text, by voice and on a shared screen. Version 26.2.0 is its first official release. This guide explains the idea behind it and then walks through everything you can do in it, one part at a time.

## The idea

A starling never lives alone. It flies in huge flocks and talks to the others in many voices. Zrzur is built on the same idea: a home for groups of people, from three friends who play together to a large community with its own rules and events.

Three things guide how we build it:

- **Familiar on purpose.** If you have used Discord, you already know your way around: servers along the side, channels next to them, the conversation in the middle. We kept that layout so that moving over does not mean learning a new app. We explain why in [our post about it](/blog/why-it-looks-familiar).
- **Arabic from the ground up.** Every screen reads right to left in Arabic, in Modern Standard Arabic that we check line by line. English and German get the same care.
- **Open source.** The code is public, so anyone can read it and check how Zrzur works.

## Getting started

Open [app.zrzur.com](https://app.zrzur.com/) in any current browser, on a computer or a phone, and create an account with your email address. If you prefer an app, the [download page](/download) has Zrzur for Windows, macOS and Linux. The same account works everywhere, and the app follows your device's language; you can change it at any time in the settings.

## Servers and channels

A server is the home of a group. Inside it, **channels** keep each topic in its place: one for announcements, one for chat, one for pictures. **Categories** group channels together, and you decide which roles can see each one.

Every server can have a **lobby**: its front page, with the server's banner, a short welcome and the channels that matter most, so a newcomer knows where to start.

Besides text channels there are voice channels, stage channels for talks in front of an audience, and channels for **tickets**, where a member opens a private conversation with the server's team.

## Messages

Messages support formatting (bold, lists, code and more), replies, reactions and emoji, GIFs, pictures and files. You can **pin** important messages, **forward** a message to another channel or conversation, start a **thread** to discuss one message without filling the channel, and create **polls**.

Search finds messages by their words, and "Jump to message" takes you straight to an old message and back to the present.

## Saved messages and reminders

**Save** a message to come back to it later: saved messages stay in one list that only you see. Or choose **"Remind me"** in a message's menu, pick a time, and Zrzur brings the message back to you then.

## Direct messages and friends

Talk to one person, or to a small group, outside any server. Add people as **friends** to find them again quickly. Everything that works in channels, from files to reactions, works here too.

## Voice, screen sharing and stages

**Voice channels are always open.** Click one to join, talk, and leave when you are done; nobody has to call anyone. From the call you can **share your screen** or a single window, to play together, show a design or explain a problem. Calls also work in direct messages.

For a clear voice there are **noise suppression** and **push to talk**, and on a server with a **soundboard** members can play short sounds into the call. If your connection gets weak, the call tells you, so you know why the sound is breaking up.

A **stage** is for talks with an audience: a few people speak, everyone else listens, and listeners can **ask to speak**.

Server owners can also let members open a **voice room of their own** with one click, named after them, with its own controls for who may join.

## Roles and permissions

**Roles** decide who can do what: who reads a channel, who writes in it, who manages the server. Give a role its own colour, and set rules for a single channel when it needs them.

When newcomers join, they can answer a few questions about their **interests** and get the matching roles right away. They can skip it and change their answers later.

## Moderation and safety

A community needs tools to stay pleasant, and Zrzur has them built in:

- **AutoMod** checks messages against the rules you set and stops the ones that break them.
- **Slowmode** limits how often each member can post in a busy channel.
- **Timeouts** silence a member for a while; bans remove them for good.
- The **audit log** records who changed what in the server.
- During a raid, **pause invites** or messages with one click.

Anyone can report a message or a member to the server's team, and illegal content to us through the [report form](/report).

## Events

Plan something in your server: a game night, a stream or a meeting. An **event** has a time, a place (a voice channel or somewhere else) and a description. Members see what is coming in a list and a calendar, and can say whether they will be there.

## Discover

**Discover** lists public servers. Browse by topic, or search by name and tag, look at a server's page and join with one click. Server owners can ask for their server to be listed, and every listing is reviewed before it appears.

## Bringing people in

**Join by link:** an invite link is all a new person needs. They open it, choose a name and are in the server without leaving the page; they confirm their email afterwards.

**Import from Discord:** moving a community should not mean rebuilding it by hand. In Discord, make a server template; in Zrzur, paste its link or its text, and Zrzur creates a new server with the same channels, categories and roles. Zrzur never asks for your Discord password, nothing changes in Discord, and messages are not copied. Zrzur is not affiliated with Discord.

## Your profile and your look

Your **profile** has a banner, your badges and the accounts you choose to link, such as Steam. **Zrzur Designs** offers profile designs and decorations, such as frames around your picture, and they show on your profile and next to your name.

In the settings you choose a **dark or light theme** and an **accent colour**. Almost every action has a **keyboard shortcut**; press Ctrl+/ to see them all.

## Save data

On a slow or expensive connection, turn on **Save data** in the settings. Zrzur then loads smaller previews of pictures and uses less data for voice, so busy channels open with a fraction of the data. If your device asks apps to use less data, Zrzur offers to turn it on.

## Bots and developers

Bots can welcome members, run games or post updates. Zrzur has its own games bot, **Game Hall**. **Webhooks** let another service post into a channel.

To build your own bot, the developer portal at [developers.zrzur.com](https://developers.zrzur.com/) has guides, the full API reference and examples, and the official JavaScript SDK is on npm as `@zrzur/sdk`.

## On your computer and your phone

Zrzur runs in any current browser at [app.zrzur.com](https://app.zrzur.com/), laid out for a large screen or a phone. The desktop app for Windows, macOS and Linux is on the [download page](/download). It is not signed with a paid certificate yet, so your system shows a warning the first time you open it; the download page explains what to click and how to check the file.

## Privacy

Our [privacy policy](/legal/privacy) says exactly what Zrzur stores, where it is kept and for how long. You can **export your data** or delete your account from the settings.

## Open source

Zrzur is open source under the AGPL-3.0, and its code is public on [GitHub](https://github.com/zrzur). It is built on Stoat (formerly Revolt), and we keep its licences and the credit to its contributors. The [source page](/source) shows exactly which version of each part is running.

## Where to start

1. Open [app.zrzur.com](https://app.zrzur.com/), or [download the app](/download).
2. Create your account and choose your language.
3. Join a server through an invite link, find one in Discover, or create your own and invite your friends.

If you have a question or an idea, write to us at [support@zrzur.com](mailto:support@zrzur.com).

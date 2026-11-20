---
title: Chat hosted in the EU: what Zrzur keeps, and for how long
summary: Where Zrzur's servers are, which companies help us, what is encrypted and what is not, how long we keep data, and how to download or delete it.
date: 2026-11-13
cover: /blog/private-chat-eu/cover.jpg
tags: privacy, GDPR, chat app EU, data protection
---
When you pick a chat app for your friends or your community, you are also picking who holds your messages. We think you should be able to answer that in one minute, not after reading forty pages. This post gives the short answers: where Zrzur runs, who helps us, what we keep, for how long, and what you can do about it. The full details are in our [privacy policy](/legal/privacy).

## Where your data lives

Zrzur's servers, databases and file storage are hosted by **Datalix in Frankfurt am Main, Germany**, inside the European Union. Zrzur is run from Austria, so the **GDPR** applies, and our supervisory authority is the Austrian Data Protection Authority.

Voice and video run on **our own voice server**, built on the open-source LiveKit software. No outside company receives your voice or your video.

## The companies that help us

These companies process data for us under a data-processing agreement:

- **Cloudflare** protects our servers from attacks and delivers the app. All traffic to our app and servers passes through it. Cloudflare is based in the United States; transfers rely on the EU-U.S. Data Privacy Framework and the Standard Contractual Clauses.
- **Cloudflare Turnstile** checks that you are a person when you sign up, sign in after several failed tries, reset your password, ask for a new verification email or send the public report form. It does not use cookies for advertising.
- **Resend** sends service emails such as verification and password reset. It receives your email address and the content of the email, and stores them in the United States.

Two more only come in when you choose them. When you turn on notifications, a notification token and the notification's content pass through the push service of your device or browser. And if you support Zrzur on Ko-fi, Ko-fi handles that payment under its own privacy policy; it is not linked to your Zrzur account.

Payments are not switched on in Zrzur, so no payment company receives anything from us.

## What is encrypted, and what is not

- Everything between your device and our servers is **encrypted in transit** (TLS).
- Passwords are stored only as a **hash**, never in plain text.
- **Two-step sign-in** is there for anyone who wants it.

We want to be clear about one thing: messages are **not end-to-end encrypted**. They are stored on our servers so you can read them on every device.

## What we keep about you, and for how long

For your birthday we keep only the **month and year**, never the day, to apply the minimum age of 16. Some data is kept only for a short time:

- Web server logs (IP address, requests): **14 days**.
- Voice metadata (who joined, and when): **30 days**.
- Backups: deleted data may stay in backups for **up to 30 days**, then it is deleted.

We do not show anyone **advertising based on profiling**.

## Download your data

In **Settings › My data** you can download a copy of your data in a common, machine-readable format. The file is kept for **7 days**, then it is deleted.

## Delete your account

You can delete your account yourself. You confirm by email, the account is **locked at once**, and it is **erased 14 days later**. Within those 14 days you can still change your mind by writing to privacy@zrzur.com from the address on your account.

## More ways to stay private

- **Sessions**: see where you are signed in, and end any session at any time.
- **Streamer mode** hides your email, your tag, invite links and direct-message previews while you stream.
- Only friends can start a direct message with people aged 16 and 17.

## Open source

Zrzur is open source under the AGPL licence, so how it works is not a secret. Together with EU hosting and a short list of helpers, that is what we mean by privacy-friendly: not a promise, but things you can check.

## Try it

[Open Zrzur](https://app.zrzur.com) and create an account. Questions about your data go to privacy@zrzur.com. To see everything Zrzur can do, read [Zrzur as a Discord alternative](/blog/discord-alternative).

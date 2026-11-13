---
title: A privacy-friendly chat app hosted in the EU: what Zrzur keeps, and for how long
summary: Where Zrzur's servers are, which companies help us run it, what is encrypted and what is not, how long we keep logs, and how you download or delete your data. Plain answers, no fine print.
date: 2026-11-13
tags: privacy, GDPR, chat app EU, data protection, secure chat
---
When you pick a chat app for your friends or your community, you are also picking who holds your messages. We think you should be able to answer that in one minute, not after reading forty pages. This post gives the plain answers: where Zrzur runs, who helps us, what we keep, for how long, and what you can do about it. The full details are in our [privacy policy](/legal/privacy).

## Where your data lives

Zrzur's servers, databases and file storage are hosted by **Datalix in Frankfurt am Main, Germany**, inside the European Union. Zrzur is run from Austria, so the **GDPR** applies, and our supervisory authority is the Austrian Data Protection Authority.

Voice and video run on **our own voice server**, built on the open-source LiveKit software. No outside company receives your voice or your video.

## The companies that help us

We keep this list short, and every company on it works for us under a data-processing agreement:

- **Cloudflare** protects our servers from attacks and delivers the app. All traffic passes through it. Cloudflare is based in the United States; transfers rely on the EU-U.S. Data Privacy Framework and the Standard Contractual Clauses.
- **Cloudflare Turnstile** checks that you are a person when you sign up, sign in after several wrong passwords, reset your password, ask for a new verification email or send the public report form. It does not use advertising cookies.
- **Resend** sends service emails such as verification and password reset. It receives your email address and the email.

Payments are not switched on, so no payment company receives anything from us.

## What is encrypted, and what is not

- Everything between your device and our servers is **encrypted in transit** (TLS).
- Passwords are stored only as a **hash**, never in plain text.
- **Two-step sign-in** is there for anyone who wants it.

We want to be honest about one thing: messages are **not end-to-end encrypted**. They are stored on our servers so you can read them on every device.

## What we keep about you, and for how long

We ask for as little as we can. For your birthday we keep only the **month and year**, never the day, to apply the minimum age of 16. And some data is kept only for a short time:

- Web server logs (IP address, requests): **14 days**.
- Voice metadata (who joined a call, and when): **30 days**.
- Backups: deleted data may stay in backups for **up to 30 days**, then it is gone.

We do not show anyone **advertising based on profiling**.

## Download your data

In **Settings › My data** you can ask for a copy of your data at any time, once every 24 hours. You confirm with your password or two-step code. When the file is ready we let you know; the link works for **7 days**, then the file is deleted. Other people appear in it only as user numbers.

## Delete your account

You can delete your account yourself. You confirm by email, the account is **locked at once**, and it is **erased 14 days later**. Within those 14 days you can still change your mind by writing to privacy@zrzur.com from the address on your account.

## More ways to stay private

- **Active sessions**: see where you are signed in, and end any session at any time.
- **Streamer mode** hides your email, your tag, invite links and direct-message previews while you stream.
- People aged 16 and 17 get direct messages **only from their friends**.

## Open source

Zrzur is open source under the AGPL licence, so how it works is not a secret. Combined with EU hosting and a short list of helpers, that is what we mean by privacy-friendly: not a promise, but things you can check.

## Try it

[Open Zrzur](https://app.zrzur.com) and create an account; there is nothing to pay. Questions about your data go to privacy@zrzur.com. To see everything Zrzur can do, read [Zrzur as a Discord alternative](/blog/discord-alternative).

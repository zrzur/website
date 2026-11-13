---
title: So schützt du deinen Community-Server: AutoMod, Slowmode und Notfall-Pausen
summary: Rollen, AutoMod-Filter, Slowmode, Timeouts, Sperren, das Protokoll und Pausen per Klick bei Raids. Ein praktischer Leitfaden für die Moderation einer Community auf Zrzur.
date: 2026-11-13
tags: Moderation, AutoMod, Community-Sicherheit, Server-Moderation, Anti-Spam
---
Eine Community wächst am besten, wenn sich die Leute darin sicher fühlen. Dafür braucht es kein großes Moderationsteam, sondern gute Werkzeuge, die du einmal einrichtest und die dir den langweiligen Teil abnehmen. Dieser Leitfaden geht die Moderationswerkzeuge in Zrzur durch, von Rollen bis zu Notfall-Pausen, und zeigt, wie du jedes einrichtest.

## Fang mit Rollen und Berechtigungen an

Jeder sichere Server beginnt mit **Rollen**. Eine Rolle ist eine Gruppe von Berechtigungen: wer einen Kanal lesen darf, wer schreiben, wer Nachrichten löschen, wer Timeouts geben oder sperren darf. Ein Server kann bis zu **200 Rollen** haben, und Berechtigungen lassen sich für den ganzen Server festlegen oder für **jeden Kanal** einzeln ändern.

Eine einfache Aufteilung, die für die meisten Communitys passt:

- **Alle**: lesen und schreiben in den öffentlichen Kanälen, mehr nicht.
- **Moderation**: Nachrichten löschen, Timeouts geben, Mitglieder kicken, das Protokoll sehen.
- **Admins**: alles, auch die Servereinstellungen.

Lass in Ankündigungskanälen nur dein Team schreiben, und gib neuen Mitgliedern einen eigenen Kanal zum Hallo-Sagen.

## AutoMod: Filter, die arbeiten, während du schläfst

**AutoMod** prüft jede Nachricht, bevor sie erscheint. Du findest ihn unter **Servereinstellungen › Schutz**, bei den Filtern. Jede Regel sucht nach einer Sache:

- **Gesperrte Wörter**: Wörter und Sätze, eins pro Zeile. Setz `*` an den Anfang oder das Ende, um einen Teil eines Wortes zu treffen, und führe eine Liste von Wörtern, die **immer erlaubt** sind. Eine fertige Liste **arabischer Beleidigungen** steht zum Start bereit.
- **Erwähnungsspam**: die meisten Erwähnungen, die in einer Nachricht erlaubt sind.
- **Linkspam**: Links von Mitgliedern, die vor weniger als 10 Minuten, 1 Stunde, 1 Tag oder 7 Tagen beigetreten sind. Du kannst **erlaubte Domains** festlegen, die immer in Ordnung sind.
- **Wiederholte Nachrichten**: der gleiche Text in mehreren Kanälen innerhalb weniger Sekunden, das klassische Spam-Muster.

Wenn eine Regel greift, kann AutoMod eins oder mehreres tun: die Nachricht **blockieren**, eine **Warnung** an einen Kanal deines Teams **senden** und den Absender für 1 Minute, 10 Minuten, 1 Stunde, 1 Tag oder 7 Tage **stummschalten**. Der Absender sieht einen kurzen Hinweis, dass seine Nachricht blockiert wurde.

## Slowmode für volle Kanäle

Wenn ein Kanal zu schnell läuft, um mitzulesen, schalte in den Kanaleinstellungen den **Slowmode** ein. Dann muss jedes Mitglied zwischen zwei Nachrichten kurz warten. Rollen, die frei reden müssen, etwa dein Team, können **vom Slowmode ausgenommen** sein.

## Timeouts, Kicks und Sperren

Nicht jedes Problem braucht eine Sperre.

- Ein **Timeout** schaltet jemanden für eine Weile stumm: lesen geht, schreiben und sprechen nicht.
- Ein **Kick** wirft jemanden aus dem Server; mit einer neuen Einladung kann er zurückkommen.
- Eine **Sperre** entfernt ihn dauerhaft: Gesperrte können nicht zurück, auch nicht mit einer Einladung, bis du die Sperre aufhebst.

Wenn du gegen ein Mitglied vorgehst, schreibst du einen **Grund**. Er wird im Protokoll gespeichert, damit der Rest deines Teams weiß, warum.

## Wer beitreten kann

Unter **Servereinstellungen › Beitritt** legst du fest, wie Leute hereinkommen:

- **Prüfung**: Verlange eine bestätigte E-Mail-Adresse oder eine bestätigte E-Mail und ein Konto, das älter als 5 Minuten ist, bevor jemand schreiben kann.
- **Zu akzeptierende Regeln**: Neue Mitglieder lesen und akzeptieren beim Beitritt deine Regeln.
- **Beitrittsanfragen**: Statt sofort beizutreten, schicken die Leute eine Anfrage, und dein Team nimmt sie von Hand an.

## Notfall: alles mit einem Klick pausieren

Manchmal wird ein Server angegriffen: Viele neue Konten treten auf einmal bei und fangen an zu posten. Dafür gibt es **Servereinstellungen › Schutz**, beim Notfall. Mit einem Klick kannst du:

- **Einladungen pausieren**: Niemand Neues kann beitreten, auch nicht mit einem Link.
- **Direktnachrichten pausieren** zwischen den Mitgliedern deines Servers.

Jede Pause dauert **1 Stunde, 6 Stunden, 12 Stunden oder 1 Tag**, und du kannst sie mit **Jetzt beenden** früher aufheben. Die Leute sehen einen kurzen Hinweis, dass der Server neue Mitglieder gerade pausiert hat.

## Das Protokoll: wer hat was geändert

Das **Protokoll** listet jede Änderung in deinem Server auf: Rollen, Kanäle, Sperren, Einstellungen, und wer sie gemacht hat, mit Grund. Wenn etwas komisch aussieht, schaust du zuerst hier.

## Statistiken: wie es deiner Community geht

Die **Statistiken** zeigen, wie dein Server wächst: Nachrichten pro Kanal, wer beigetreten ist und wer gegangen ist, und wie viele Leute jeden Tag schreiben. Ein plötzlicher Sprung bei den Beitritten ist oft das erste Zeichen, dass etwas nicht stimmt.

## Wann du uns etwas meldest

Deine Werkzeuge kümmern sich um deinen Server. Bei allem Illegalen oder bei einer Person, die anderen über mehrere Server hinweg schadet, **melde** die Nachricht, das Profil oder den Server. Unser Team prüft jede Meldung. Konten von 16- und 17-Jährigen bekommen Direktnachrichten nur von ihren Freunden.

## Probier es aus

Alle diese Werkzeuge sind kostenlos. [Öffne Zrzur](https://app.zrzur.com), lege einen Server an und nimm dir fünf Minuten für die **Servereinstellungen**: Richte deine Rollen ein, eine AutoMod-Regel gegen Spam und deine Regeln zum Akzeptieren. Wenn du eine neue Community aufbaust, lies als Nächstes unseren Leitfaden zum [Einrichten eines Community-Servers](/de/blog/set-up-community-server).

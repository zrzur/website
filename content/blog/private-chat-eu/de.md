---
title: Chat aus der EU: was Zrzur speichert und wie lange
summary: Wo die Server von Zrzur stehen, welche Firmen helfen, was verschlüsselt ist und was nicht, wie lange wir Daten speichern und wie du sie löschst.
date: 2026-11-13
cover: /blog/private-chat-eu/cover.jpg
tags: Datenschutz, DSGVO, Chat-App EU, Datensicherheit
---
Wenn du eine Chat-App für deine Freunde oder deine Community auswählst, wählst du auch, wer deine Nachrichten aufbewahrt. Wir finden, das solltest du in einer Minute beantworten können, nicht nach vierzig Seiten. Dieser Beitrag gibt die kurzen Antworten: wo Zrzur läuft, wer uns hilft, was wir speichern, wie lange und was du tun kannst. Alle Einzelheiten stehen in unserer [Datenschutzerklärung](/de/legal/privacy).

## Wo deine Daten liegen

Die Server, Datenbanken und der Dateispeicher von Zrzur werden von **Datalix in Frankfurt am Main** gehostet, in der Europäischen Union. Zrzur wird von Österreich aus betrieben, es gilt also die **DSGVO**, und unsere Aufsichtsbehörde ist die Österreichische Datenschutzbehörde.

Sprache und Video laufen auf **unserem eigenen Sprachserver** auf Basis der Open-Source-Software LiveKit. Kein fremdes Unternehmen erhält deine Stimme oder dein Video.

## Die Firmen, die uns helfen

Diese Firmen verarbeiten Daten für uns auf Grundlage eines Auftragsverarbeitungsvertrags:

- **Cloudflare** schützt unsere Server vor Angriffen und liefert die App aus. Der gesamte Datenverkehr zu unserer App und unseren Servern läuft darüber. Cloudflare hat seinen Sitz in den USA; die Übermittlung stützt sich auf das EU-US Data Privacy Framework und die Standardvertragsklauseln.
- **Cloudflare Turnstile** prüft, ob du ein Mensch bist, wenn du dich registrierst, dich nach mehreren Fehlversuchen anmeldest, dein Passwort zurücksetzt, eine neue Bestätigungs-E-Mail anforderst oder das öffentliche Meldeformular absendest. Es nutzt keine Cookies für Werbung.
- **Resend** verschickt Service-E-Mails wie Bestätigung und Passwort-Zurücksetzung. Es erhält deine E-Mail-Adresse und den Inhalt der E-Mail und speichert beides in den USA.

Zwei weitere kommen nur ins Spiel, wenn du dich dafür entscheidest. Schaltest du Benachrichtigungen ein, laufen ein Benachrichtigungs-Token und der Inhalt der Benachrichtigung über den Push-Dienst deines Geräts oder Browsers. Und wenn du Zrzur über Ko-fi unterstützt, wickelt Ko-fi die Zahlung nach seiner eigenen Datenschutzerklärung ab; mit deinem Zrzur-Konto wird das nicht verknüpft.

Zahlungen sind in Zrzur nicht freigeschaltet, deshalb erhält kein Zahlungsdienst etwas von uns.

## Was verschlüsselt ist und was nicht

- Alles zwischen deinem Gerät und unseren Servern ist **bei der Übertragung verschlüsselt** (TLS).
- Passwörter werden nur als **Hash** gespeichert, nie im Klartext.
- Die **Anmeldung in zwei Schritten** steht allen offen, die sie möchten.

In einem Punkt wollen wir deutlich sein: Nachrichten sind **nicht Ende-zu-Ende-verschlüsselt**. Sie liegen auf unseren Servern, damit du sie auf jedem Gerät lesen kannst.

## Was wir über dich speichern und wie lange

Von deinem Geburtstag speichern wir nur **Monat und Jahr**, nie den Tag, um das Mindestalter von 16 Jahren anzuwenden. Manche Daten bewahren wir nur kurz auf:

- Webserver-Protokolle (IP-Adresse, Anfragen): **14 Tage**.
- Sprach-Metadaten (wer wann beigetreten ist): **30 Tage**.
- Backups: Gelöschte Daten können **bis zu 30 Tage** in Backups bleiben, dann werden sie gelöscht.

Wir zeigen niemandem **Werbung auf Grundlage von Profiling**.

## Lade deine Daten herunter

Unter **Einstellungen › Meine Daten** kannst du eine Kopie deiner Daten in einem gängigen, maschinenlesbaren Format herunterladen. Die Datei bleibt **7 Tage** bestehen, dann wird sie gelöscht.

## Lösche dein Konto

Du kannst dein Konto selbst löschen. Du bestätigst per E-Mail, das Konto ist **sofort gesperrt** und wird **14 Tage später gelöscht**. Innerhalb dieser 14 Tage kannst du es dir noch anders überlegen und an privacy@zrzur.com schreiben, von der Adresse deines Kontos.

## Noch mehr Privatsphäre

- **Sitzungen**: Sieh, wo du angemeldet bist, und beende jede Sitzung jederzeit.
- Der **Streamer-Modus** verbirgt deine E-Mail, deinen Tag, Einladungslinks und die Vorschau von Direktnachrichten, während du streamst.
- Mit 16- und 17-Jährigen können nur ihre Freunde eine Direktnachricht beginnen.

## Open Source

Zrzur ist Open Source unter der AGPL-Lizenz, wie es funktioniert, ist also kein Geheimnis. Zusammen mit dem Hosting in der EU und einer kurzen Liste von Helfern meinen wir das mit datenschutzfreundlich: kein Versprechen, sondern Dinge, die du nachprüfen kannst.

## Probier es aus

[Öffne Zrzur](https://app.zrzur.com) und lege ein Konto an. Fragen zu deinen Daten gehen an privacy@zrzur.com. Was Zrzur alles kann, liest du in [Zrzur als Discord-Alternative](/de/blog/discord-alternative).

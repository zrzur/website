import { doc, list, para, revised, section } from "./shared.ts";

// Text in square brackets is still to be supplied.

export const enforcementAppeals = revised(doc({
  slug: "enforcement-appeals",
  group: "everyone",
  title: { en: "Enforcement and Appeals", ar: "الإنفاذ والاعتراض",
    de: "Durchsetzung und Einspruch" },
  intro: {
    en: "How we review reports, what we tell you when we act, how to appeal, and how we handle notices about illegal content under the EU Digital Services Act.",
    ar: "كيف نراجع البلاغات، وما الذي نخبرك به عند اتخاذ إجراء، وكيف تعترض، وكيف نتعامل مع إشعارات المحتوى غير القانوني بموجب قانون الخدمات الرقمية الأوروبي.",
    de: "Wie wir Meldungen prüfen, was wir dir mitteilen, wenn wir handeln, wie du Einspruch einlegst und wie wir Hinweise auf rechtswidrige Inhalte nach dem EU-Gesetz über digitale Dienste behandeln.",
  },
  sections: [
    section(
      "how",
      { en: "How moderation works", ar: "كيف يعمل الإشراف", de: "So funktioniert Moderation" },
      {
        en: para(
          "There are two layers of moderation on Zrzur:",
          list(
            "Server moderation: Server owners and their moderators enforce their own server rules inside their Server (for example, deleting messages, timing out or banning members). Their decisions are theirs; contact the Server's staff first.",
            "Zrzur moderation: our safety team enforces the Terms of Service and the Community Guidelines across the whole Service, including in private messages when they are reported.",
          ),
          "We find problems mainly through user reports and legal notices, and through our own review. Two automated tools exist. Server owners can turn on AutoMod, which acts in their Server on rules they set. The Zrzur team keeps a list of blocked words that is checked when you change public profile text; a match stops the change and tells you why. We do not scan messages or direct messages automatically.",
          "We do not read private conversations unless they are reported to us, or the law requires it, or we need to investigate a serious security problem.",
        ),
        ar: para(
          "للإشراف في زرزور مستويان:",
          list(
            "إشراف السيرفر: يطبّق مالكو السيرفرات ومشرفوهم قواعد سيرفراتهم داخلها (كحذف الرسائل أو الإسكات المؤقت أو حظر الأعضاء). والقرار في ذلك لهم، فتواصل أولًا مع فريق إدارة السيرفر.",
            "إشراف زرزور: يطبّق فريق السلامة لدينا شروط الخدمة وإرشادات المجتمع في الخدمة كلها، ومنها الرسائل الخاصة عند الإبلاغ عنها.",
          ),
          "نكتشف المشكلات أساسًا عبر بلاغات المستخدمين والإشعارات القانونية ومراجعتنا نحن. توجد أداتان آليتان. يمكن لمالكي السيرفرات تفعيل AutoMod، الذي يعمل في سيرفراتهم وفق قواعد يضعونها. ويدير فريق زرزور قائمة كلمات محظورة تُفحص عند تغيير نص الملف الشخصي العام؛ وإذا وُجدت كلمة منها يتوقف التغيير ونخبرك بالسبب. ولا نفحص الرسائل ولا الرسائل المباشرة آليًا.",
          "لا نقرأ المحادثات الخاصة إلا إذا أُبلغنا عنها، أو أوجب القانون ذلك، أو احتجنا إلى التحقيق في مشكلة أمنية خطيرة.",
        ),
        de: para(
          "Auf Zrzur gibt es zwei Ebenen der Moderation:",
          list(
            "Server-Moderation: Server-Inhaber und ihre Moderatoren setzen die eigenen Serverregeln in ihrem Server durch (zum Beispiel Nachrichten löschen, Mitglieder stummschalten oder sperren). Diese Entscheidungen sind ihre; wende dich zuerst an das Team des Servers.",
            "Zrzur-Moderation: Unser Sicherheitsteam setzt die Nutzungsbedingungen und die Community-Richtlinien im gesamten Dienst durch, auch in privaten Nachrichten, wenn sie gemeldet werden.",
          ),
          "Probleme finden wir hauptsächlich durch Meldungen von Nutzenden und rechtliche Hinweise sowie durch eigene Prüfung. Es gibt zwei automatische Werkzeuge. Server-Inhaber können AutoMod einschalten, das in ihrem Server nach selbst gesetzten Regeln handelt. Das Zrzur-Team pflegt eine Liste gesperrter Wörter, die geprüft wird, wenn du öffentlichen Profiltext änderst; bei einem Treffer wird die Änderung gestoppt und wir sagen dir, warum. Nachrichten und Direktnachrichten durchsuchen wir nicht automatisch.",
          "Wir lesen private Unterhaltungen nicht, es sei denn, sie werden uns gemeldet, das Gesetz verlangt es oder wir müssen ein ernstes Sicherheitsproblem untersuchen.",
        ),
      },
    ),
    section(
      "actions",
      { en: "Actions we can take", ar: "الإجراءات التي قد نتخذها", de: "Maßnahmen, die wir ergreifen können" },
      {
        en: list(
          "Remove or hide content, or put a warning on it.",
          "Limit features, for example sending messages, joining Servers, creating Servers, or using Discover.",
          "Remove a Server, bot, plugin, community item or profile effect from Discover or from the Service.",
          "Suspend an account, bot or Server for a set time.",
          "Close an account or Server permanently.",
          "Pause or end paid features linked to a broken rule, as described in the Paid Services terms.",
          "Report to the authorities where the law requires it or a life is at risk.",
        ),
        ar: list(
          "إزالة المحتوى أو إخفاؤه أو وضع تحذير عليه.",
          "تقييد الميزات، كإرسال الرسائل، أو الانضمام إلى السيرفرات، أو إنشائها، أو استخدام «اكتشف».",
          "إزالة سيرفر أو بوت أو إضافة أو عنصر مجتمع أو مؤثر ملف شخصي من «اكتشف» أو من الخدمة.",
          "إيقاف حساب أو بوت أو سيرفر مدةً محددة.",
          "إغلاق حساب أو سيرفر نهائيًا.",
          "تعليق الميزات المدفوعة المرتبطة بالمخالفة أو إنهاؤها، كما توضّح شروط الخدمات المدفوعة.",
          "إبلاغ السلطات حين يوجب القانون ذلك أو تكون حياة أحد في خطر.",
        ),
        de: list(
          "Inhalte entfernen, ausblenden oder mit einer Warnung versehen.",
          "Funktionen einschränken, zum Beispiel Nachrichten senden, Servern beitreten, Server erstellen oder Entdecken nutzen.",
          "Einen Server, Bot, ein Plugin, ein Community-Element oder einen Profileffekt aus Entdecken oder aus dem Dienst entfernen.",
          "Ein Konto, einen Bot oder Server für eine bestimmte Zeit sperren.",
          "Ein Konto oder einen Server dauerhaft schließen.",
          "Bezahlte Funktionen, die mit einem Regelverstoß zusammenhängen, pausieren oder beenden, wie in den Bedingungen für kostenpflichtige Dienste beschrieben.",
          "Behörden informieren, wenn das Gesetz es verlangt oder ein Leben in Gefahr ist.",
        ),
      },
    ),
    section(
      "reasons",
      { en: "A statement of reasons for every action", ar: "بيان بالأسباب مع كل إجراء", de: "Eine Begründung zu jeder Maßnahme" },
      {
        en: para(
          "When we restrict your content or account, we tell you in a private message from the official Zrzur account, in your app language. If we suspend or ban your account, we also send it to your email address, because you may not be able to sign in. The message says:",
          list(
            "what we did (for example removed a message, suspended the account, removed a Discover listing) and how long it lasts;",
            "where it applies (worldwide, or only in some countries);",
            "the facts we relied on, and whether we acted on a report, on a notice of illegal content, or on our own review;",
            "whether automated tools found the content, and whether the decision was made by automated means;",
            "the ground: either the law and the provision the content breaks, or the rule in our Terms or Community Guidelines that it breaks (a rule decision is not a finding that the content is illegal);",
            "how to appeal, the out-of-court option, and that you can always go to court.",
          ),
          "You can see the same statement at any time in Settings, Feedback & reports. We may leave out details if sharing them would break the law or put someone at risk. We do not tell you who reported you.",
        ),
        ar: para(
          "عندما نقيّد محتواك أو حسابك، نخبرك برسالة خاصة من حساب زرزور الرسمي، بلغة تطبيقك. وإذا أوقفنا حسابك أو حظرناه نرسلها أيضًا إلى بريدك الإلكتروني، لأنك قد لا تستطيع تسجيل الدخول. وتتضمن الرسالة:",
          list(
            "ما الذي فعلناه (كإزالة رسالة، أو إيقاف الحساب، أو إزالة عنصر من «اكتشف») ومدته؛",
            "نطاق سريانه (في العالم كله أو في بعض الدول فقط)؛",
            "الوقائع التي استندنا إليها، وهل تصرّفنا بناءً على بلاغ، أو على إشعار بمحتوى غير قانوني، أو على مراجعتنا نحن؛",
            "هل رصدت أدوات آلية المحتوى، وهل اتُّخذ القرار بوسائل آلية؛",
            "الأساس: إما القانون والحكم الذي يخالفه المحتوى، وإما القاعدة في شروطنا أو إرشادات المجتمع التي يخالفها (والقرار المبني على قاعدة ليس حكمًا بأن المحتوى غير قانوني)؛",
            "كيفية الاعتراض، وخيار التسوية خارج المحاكم، وأن بإمكانك دائمًا اللجوء إلى القضاء.",
          ),
          "ويمكنك رؤية البيان نفسه في أي وقت من الإعدادات، ثم الملاحظات والبلاغات. وقد نحذف بعض التفاصيل إذا كان كشفها يخالف القانون أو يعرّض أحدًا للخطر. ولا نخبرك بمن أبلغ عنك.",
        ),
        de: para(
          "Wenn wir deine Inhalte oder dein Konto einschränken, teilen wir dir das in einer privaten Nachricht vom offiziellen Zrzur-Konto mit, in deiner App-Sprache. Sperren oder bannen wir dein Konto, senden wir sie zusätzlich an deine E-Mail-Adresse, weil du dich eventuell nicht mehr anmelden kannst. Die Nachricht nennt:",
          list(
            "was wir getan haben (zum Beispiel eine Nachricht entfernt, das Konto gesperrt, einen Eintrag in Entdecken entfernt) und wie lange es gilt;",
            "wo es gilt (weltweit oder nur in einigen Ländern);",
            "die Tatsachen, auf die wir uns gestützt haben, und ob wir aufgrund einer Meldung, eines Hinweises auf rechtswidrige Inhalte oder aufgrund eigener Prüfung gehandelt haben;",
            "ob automatisierte Werkzeuge den Inhalt gefunden haben und ob die Entscheidung automatisiert getroffen wurde;",
            "den Grund: entweder das Gesetz und die Vorschrift, gegen die der Inhalt verstößt, oder die Regel in unseren Bedingungen oder Community-Richtlinien (eine Regelentscheidung ist keine Feststellung, dass der Inhalt rechtswidrig ist);",
            "wie du Einspruch einlegen kannst, die außergerichtliche Möglichkeit und dass du jederzeit ein Gericht anrufen kannst.",
          ),
          "Dieselbe Begründung siehst du jederzeit unter Einstellungen, Feedback und Meldungen. Wir können Einzelheiten weglassen, wenn ihre Mitteilung gegen das Gesetz verstieße oder jemanden gefährden würde. Wir sagen dir nicht, wer dich gemeldet hat.",
        ),
      },
    ),
    section(
      "appeals",
      { en: "How to appeal", ar: "كيف تعترض", de: "So legst du Einspruch ein" },
      {
        en: para(
          list(
            "In Zrzur, open Settings, Feedback & reports and choose Appeal next to the decision. If you cannot sign in, reply to the email we sent you or write to support@zrzur.com with your reference.",
            "You can appeal for at least 6 months after the decision.",
            "Explain briefly why you think the decision is wrong. You can add context we may have missed.",
            "A person reviews every appeal, looking again at the facts and your explanation. Appeals are never decided by automated means alone.",
            "We aim to answer within [14] days. If we were wrong, we undo the action and restore what we can.",
          ),
          "If you reported content and do not agree with our decision, write to support@zrzur.com with your reference within 6 months of our decision. A person will review it and answer you. Decisions made by a Server's own staff inside their Server are appealed to that Server's staff, not to us, unless the Server staff broke our rules.",
        ),
        ar: para(
          list(
            "في زرزور افتح الإعدادات ثم الملاحظات والبلاغات، واختر «اعتراض» بجانب القرار. وإذا لم تستطع تسجيل الدخول فردّ على البريد الذي أرسلناه إليك أو اكتب إلى support@zrzur.com مع رقم المرجع.",
            "يمكنك الاعتراض مدة ستة أشهر على الأقل بعد القرار.",
            "اشرح باختصار لماذا ترى أن القرار خاطئ، ويمكنك إضافة سياق ربما فاتنا.",
            "يراجع إنسان كل اعتراض، فيعيد النظر في الوقائع وفي شرحك. ولا يُبتّ في الاعتراضات بوسائل آلية وحدها أبدًا.",
            "نسعى إلى الرد خلال [14] يومًا. وإذا أخطأنا، نُلغي الإجراء ونستعيد ما يمكن استعادته.",
          ),
          "وإذا أبلغت عن محتوى ولم توافق على قرارنا، فاكتب إلى support@zrzur.com مع رقم المرجع خلال ستة أشهر من قرارنا، وسيراجعه إنسان ويردّ عليك. أما قرارات فريق إدارة السيرفر داخل سيرفره فيُعترض عليها لدى ذلك الفريق لا لدينا، إلا إذا خالف فريق السيرفر قواعدنا.",
        ),
        de: para(
          list(
            "Öffne in Zrzur Einstellungen, Feedback und Meldungen und wähle neben der Entscheidung „Einspruch“. Wenn du dich nicht anmelden kannst, antworte auf die E-Mail, die wir dir geschickt haben, oder schreibe mit deiner Referenz an support@zrzur.com.",
            "Du kannst mindestens 6 Monate nach der Entscheidung Einspruch einlegen.",
            "Erkläre kurz, warum du die Entscheidung für falsch hältst. Du kannst Zusammenhänge ergänzen, die uns entgangen sein könnten.",
            "Ein Mensch prüft jeden Einspruch und betrachtet die Tatsachen und deine Erklärung erneut. Einsprüche werden nie allein automatisiert entschieden.",
            "Wir wollen innerhalb von [14] Tagen antworten. Wenn wir falsch lagen, machen wir die Maßnahme rückgängig und stellen wieder her, was möglich ist.",
          ),
          "Wenn du Inhalte gemeldet hast und mit unserer Entscheidung nicht einverstanden bist, schreibe innerhalb von 6 Monaten nach unserer Entscheidung mit deiner Referenz an support@zrzur.com. Ein Mensch prüft das und antwortet dir. Entscheidungen des Teams eines Servers innerhalb seines Servers fechtest du bei diesem Team an, nicht bei uns, es sei denn, das Team hat unsere Regeln verletzt.",
        ),
      },
    ),
    section(
      "times",
      { en: "Response times", ar: "مدد الاستجابة", de: "Reaktionszeiten" },
      {
        en: para(
          "These are our targets, not guarantees:",
          list(
            "Child safety, credible threats to life and self-harm emergencies: reviewed first, as fast as possible, normally within [24 hours].",
            "Notices of illegal content: decided without undue delay, normally within [7] days.",
            "Other reports: normally within [7] days.",
            "Appeals: normally within [14] days.",
          ),
          "When you report something, we confirm that we received it (by email if you gave us your address, and with a reference on screen). When we decide, we tell you the outcome, also when we decide not to act, and how you can challenge it.",
        ),
        ar: para(
          "هذه أهدافنا لا ضمانات:",
          list(
            "سلامة الأطفال، والتهديدات الجدية للحياة، وحالات إيذاء النفس الطارئة: تُراجع أولًا وبأسرع ما يمكن، وعادةً خلال [24 hours].",
            "إشعارات المحتوى غير القانوني: يُبتّ فيها دون تأخير غير مبرّر، وعادةً خلال [7] أيام.",
            "البلاغات الأخرى: عادةً خلال [7] أيام.",
            "الاعتراضات: عادةً خلال [14] يومًا.",
          ),
          "عندما تبلّغ عن شيء نؤكد لك استلامه (بالبريد الإلكتروني إن أعطيتنا عنوانك، ومعه رقم مرجع على الشاشة). وعندما نقرر نخبرك بالنتيجة، حتى حين نقرر عدم اتخاذ إجراء، وبكيفية الطعن فيها.",
        ),
        de: para(
          "Das sind unsere Ziele, keine Garantien:",
          list(
            "Kindersicherheit, glaubhafte Bedrohungen des Lebens und Notfälle durch Selbstverletzung: werden zuerst und so schnell wie möglich geprüft, in der Regel innerhalb von [24 hours].",
            "Hinweise auf rechtswidrige Inhalte: unverzüglich entschieden, in der Regel innerhalb von [7] Tagen.",
            "Andere Meldungen: in der Regel innerhalb von [7] Tagen.",
            "Einsprüche: in der Regel innerhalb von [14] Tagen.",
          ),
          "Wenn du etwas meldest, bestätigen wir den Eingang (per E-Mail, wenn du uns deine Adresse gegeben hast, und mit einer Referenz auf dem Bildschirm). Wenn wir entscheiden, teilen wir dir das Ergebnis mit, auch wenn wir nicht handeln, und wie du es anfechten kannst.",
        ),
      },
    ),
    section(
      "illegal-content",
      { en: "Notices of illegal content (EU Digital Services Act)", ar: "إشعارات المحتوى غير القانوني (قانون الخدمات الرقمية الأوروبي)", de: "Hinweise auf rechtswidrige Inhalte (EU-Gesetz über digitale Dienste)" },
      {
        en: para(
          "Anyone, including people without an account, can tell us about content they believe is illegal: use the form at zrzur.com/report, or the Report button in the app and choose the reason that fits. A complete notice includes:",
          list(
            "a clear explanation of why you believe the content is illegal, and under which law if you know it;",
            "the exact location: a link to the message, Server, profile, Discover listing, Design or profile effect, or its ID;",
            "your name and email address (not needed for reports of child sexual abuse material);",
            "a statement that you believe in good faith that the notice is accurate and complete.",
          ),
          "We confirm receipt, review the notice carefully and objectively, and tell you our decision and how to challenge it. If content is illegal only in some countries, we may restrict it only in those countries. People without an account receive our answers by email.",
          "For copyright and trademark complaints, also tell us which work or mark is yours and how it is used without permission.",
          "If we have information that suggests a crime threatening someone's life or safety, we inform the relevant law-enforcement authorities.",
        ),
        ar: para(
          "يمكن لأي شخص، ولو لم يكن لديه حساب، أن يُعلمنا بمحتوى يعتقد أنه غير قانوني: استخدم النموذج على zrzur.com/report، أو زر «إبلاغ» في التطبيق واختر السبب المناسب. ويتضمّن الإشعار الكامل:",
          list(
            "شرحًا واضحًا لسبب اعتقادك أن المحتوى غير قانوني، والقانون المعني إن كنت تعرفه؛",
            "الموقع الدقيق: رابط الرسالة أو السيرفر أو الملف الشخصي أو عنصر «اكتشف» أو التصميم أو مؤثر الملف الشخصي، أو معرّفه؛",
            "اسمك وبريدك الإلكتروني (ولا يُشترط ذلك في بلاغات مواد الاعتداء الجنسي على الأطفال)؛",
            "إقرارًا بأنك تعتقد بحسن نية أن الإشعار صحيح وكامل.",
          ),
          "نؤكد الاستلام، ونراجع الإشعار بعناية وموضوعية، ونخبرك بقرارنا وكيفية الطعن فيه. وإذا كان المحتوى غير قانوني في بعض الدول فقط، فقد نقيّده في تلك الدول وحدها. ويصل ردّنا إلى من ليس لديه حساب بالبريد الإلكتروني.",
          "في شكاوى حقوق النشر والعلامات التجارية، أخبرنا أيضًا أي عمل أو علامة تعود إليك، وكيف تُستخدم دون إذن.",
          "وإذا توفّرت لدينا معلومات تشير إلى جريمة تهدد حياة أحد أو سلامته، فإننا نُعلم سلطات إنفاذ القانون المختصة.",
        ),
        de: para(
          "Jede Person, auch ohne Konto, kann uns auf Inhalte hinweisen, die sie für rechtswidrig hält: nutze das Formular unter zrzur.com/report oder die Schaltfläche „Melden“ in der App und wähle den passenden Grund. Ein vollständiger Hinweis enthält:",
          list(
            "eine klare Erklärung, warum du den Inhalt für rechtswidrig hältst, und nach welchem Gesetz, wenn du es kennst;",
            "den genauen Ort: einen Link auf die Nachricht, den Server, das Profil, den Eintrag in Entdecken, das Design oder den Profileffekt oder deren ID;",
            "deinen Namen und deine E-Mail-Adresse (nicht nötig bei Meldungen zu Material über sexuellen Kindesmissbrauch);",
            "die Erklärung, dass du in gutem Glauben davon ausgehst, dass der Hinweis richtig und vollständig ist.",
          ),
          "Wir bestätigen den Eingang, prüfen den Hinweis sorgfältig und objektiv und teilen dir unsere Entscheidung mit und wie du sie anfechten kannst. Ist ein Inhalt nur in einigen Ländern rechtswidrig, können wir ihn nur dort einschränken. Personen ohne Konto erhalten unsere Antworten per E-Mail.",
          "Bei Urheberrechts- und Markenbeschwerden teile uns außerdem mit, welches Werk oder welche Marke dir gehört und wie es ohne Erlaubnis verwendet wird.",
          "Haben wir Informationen, die auf eine Straftat hindeuten, die das Leben oder die Sicherheit einer Person bedroht, informieren wir die zuständigen Strafverfolgungsbehörden.",
        ),
      },
    ),
    section(
      "contact-point",
      { en: "Points of contact", ar: "جهات الاتصال", de: "Kontaktstellen" },
      {
        en: list(
          "Users and the public: support@zrzur.com.",
          "Authorities, the European Commission and the Digital Services Coordinators: dsa@zrzur.com, subject \"DSA authority request\".",
          "Removal orders for terrorist content (Regulation (EU) 2021/784): dsa@zrzur.com, subject \"TCO removal order\"; we act within one hour.",
          "Security reports: security@zrzur.com.",
          "Languages: Arabic, English and German.",
        ),
        ar: list(
          "المستخدمون والجمهور: support@zrzur.com.",
          "السلطات والمفوضية الأوروبية ومنسّقو الخدمات الرقمية: dsa@zrzur.com، بعنوان «DSA authority request».",
          "أوامر إزالة المحتوى الإرهابي (اللائحة الأوروبية 2021/784): dsa@zrzur.com، بعنوان «TCO removal order»؛ وننفّذها خلال ساعة واحدة.",
          "البلاغات الأمنية: security@zrzur.com.",
          "اللغات: العربية والإنجليزية والألمانية.",
        ),
        de: list(
          "Nutzende und Öffentlichkeit: support@zrzur.com.",
          "Behörden, die Europäische Kommission und die Koordinatoren für digitale Dienste: dsa@zrzur.com, Betreff „DSA authority request“.",
          "Entfernungsanordnungen für terroristische Inhalte (Verordnung (EU) 2021/784): dsa@zrzur.com, Betreff „TCO removal order“; wir handeln innerhalb einer Stunde.",
          "Sicherheitsmeldungen: security@zrzur.com.",
          "Sprachen: Arabisch, Englisch und Deutsch.",
        ),
      },
    ),
    section(
      "other-options",
      { en: "Other ways to resolve a dispute", ar: "طرق أخرى لحل النزاع", de: "Andere Wege zur Streitbeilegung" },
      {
        en: "If you are in the EU and do not agree with our decision, including a decision on your appeal, you can take the dispute to a certified out-of-court dispute settlement body under Article 21 of the Digital Services Act. You choose the body. The European Commission publishes the list of certified bodies on its website: [Commission list URL, checked on <date>]. Using our appeal process first is usually the fastest route, but it is not required, and none of this affects your right to go to court.",
        ar: "إذا كنت في الاتحاد الأوروبي ولم توافق على قرارنا، ومنه قرارنا في اعتراضك، فيمكنك عرض النزاع على جهة معتمدة لتسوية النزاعات خارج المحاكم بموجب المادة 21 من قانون الخدمات الرقمية. وأنت من يختار الجهة. وتنشر المفوضية الأوروبية قائمة الجهات المعتمدة على موقعها: [Commission list URL, checked on <date>]. واستخدام طريقة الاعتراض لدينا أولًا هو عادةً الطريق الأسرع، لكنه ليس شرطًا، ولا يمسّ شيء من هذا حقك في اللجوء إلى القضاء.",
        de: "Wenn du in der EU bist und mit unserer Entscheidung, auch über deinen Einspruch, nicht einverstanden bist, kannst du den Streit nach Artikel 21 des Gesetzes über digitale Dienste vor eine zertifizierte außergerichtliche Streitbeilegungsstelle bringen. Du wählst die Stelle. Die Europäische Kommission veröffentlicht die Liste der zertifizierten Stellen auf ihrer Website: [Commission list URL, checked on <date>]. Unser Einspruchsverfahren zuerst zu nutzen ist meist der schnellste Weg, aber nicht erforderlich, und nichts davon berührt dein Recht, ein Gericht anzurufen.",
      },
    ),
    section(
      "misuse",
      { en: "Misuse of reporting", ar: "إساءة استخدام البلاغات", de: "Missbrauch von Meldungen" },
      {
        en: "Reporting is for real problems. If someone often sends reports or notices that are clearly unfounded, or keeps posting clearly illegal content, we may, after a warning, stop handling their reports or suspend their account for a reasonable time.",
        ar: "البلاغات مخصّصة للمشكلات الحقيقية. وإذا أرسل شخص مرارًا بلاغات أو إشعارات لا أساس لها بوضوح، أو استمر في نشر محتوى غير قانوني بوضوح، فقد نتوقف بعد إنذاره عن معالجة بلاغاته أو نوقف حسابه مدةً معقولة.",
        de: "Meldungen sind für echte Probleme da. Wenn jemand häufig offensichtlich unbegründete Meldungen oder Hinweise sendet oder immer wieder offensichtlich rechtswidrige Inhalte postet, können wir nach einer Warnung aufhören, seine Meldungen zu bearbeiten, oder sein Konto für angemessene Zeit sperren.",
      },
    ),
    section(
      "reports-data",
      { en: "Reports and your data", ar: "البلاغات وبياناتك", de: "Meldungen und deine Daten" },
      {
        en: "If you report content without an account, we keep your name, email address and what you wrote only to handle the report, answer you and stop misuse of reporting. Our safety reviewers see them; the person you reported does not. We delete your name and email address 12 months after the case is closed. Reports of child sexual abuse material are kept longer while we clarify our legal duties to preserve evidence.",
        ar: "إذا أبلغت عن محتوى دون حساب، فنحتفظ باسمك وبريدك الإلكتروني وما كتبته فقط لمعالجة البلاغ والرد عليك ومنع إساءة استخدام البلاغات. ويراها مراجعو السلامة لدينا، ولا يراها الشخص الذي أبلغت عنه. ونحذف اسمك وبريدك الإلكتروني بعد ١٢ شهرًا من إغلاق الحالة. أما بلاغات مواد الاعتداء الجنسي على الأطفال فتُحفظ مدة أطول إلى أن نوضّح التزاماتنا القانونية في حفظ الأدلة.",
        de: "Wenn du Inhalte ohne Konto meldest, speichern wir deinen Namen, deine E-Mail-Adresse und das, was du geschrieben hast, nur, um die Meldung zu bearbeiten, dir zu antworten und Missbrauch von Meldungen zu verhindern. Unsere Sicherheitsprüfer sehen sie; die gemeldete Person nicht. Deinen Namen und deine E-Mail-Adresse löschen wir 12 Monate nach Abschluss des Falls. Meldungen zu Material über sexuellen Kindesmissbrauch bewahren wir länger auf, während wir unsere gesetzlichen Pflichten zur Beweissicherung klären.",
      },
    ),
    section(
      "transparency",
      { en: "Transparency", ar: "الشفافية", de: "Transparenz" },
      {
        en: "We publish a transparency report at least once a year on zrzur.com. It shows how many reports and legal notices we received, what actions we took, how many were automated, how many appeals we received, and how many decisions we reversed. We never include personal data.",
        ar: "ننشر تقرير شفافية مرة واحدة سنويًا على الأقل على zrzur.com، يبيّن عدد البلاغات والإشعارات القانونية التي تلقّيناها، والإجراءات التي اتخذناها، وعدد ما تم منها آليًا، وعدد الاعتراضات، وعدد القرارات التي تراجعنا عنها. ولا نُدرج فيه أي بيانات شخصية أبدًا.",
        de: "Wir veröffentlichen mindestens einmal im Jahr einen Transparenzbericht auf zrzur.com. Er zeigt, wie viele Meldungen und rechtliche Hinweise wir erhalten haben, welche Maßnahmen wir ergriffen haben, wie viele davon automatisiert waren, wie viele Einsprüche wir erhalten und wie viele Entscheidungen wir aufgehoben haben. Wir nehmen nie personenbezogene Daten auf.",
      },
    ),
  ],
}));

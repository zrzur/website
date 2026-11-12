import { doc, list, para, section } from "./shared.ts";

export const developerTerms = doc({
  slug: "developer-terms",
  group: "builders",
  title: { en: "Developer Terms and Policy", ar: "شروط المطوّرين وسياستهم",
    de: "Entwicklerbedingungen und -richtlinie" },
  intro: {
    en: "The rules for building bots, apps and OAuth integrations on the Zrzur API: keep tokens secret, respect limits, use as little data as possible, and keep people safe.",
    ar: "قواعد بناء البوتات والتطبيقات وعمليات التكامل عبر OAuth باستخدام واجهة زرزور البرمجية: احفظ الرموز سرًّا، واحترم الحدود، واستخدم أقل قدر ممكن من البيانات، وحافظ على سلامة الناس.",
    de: "Die Regeln für die Entwicklung von Bots, Apps und OAuth-Integrationen mit der Zrzur-API: Tokens geheim halten, Grenzen einhalten, so wenig Daten wie möglich verwenden und Menschen schützen.",
  },
  sections: [
    section(
      "scope",
      { en: "Scope", ar: "النطاق", de: "Geltungsbereich" },
      {
        en: para(
          "These terms apply when you create a bot or app, use the Zrzur API or WebSocket at api.zrzur.com and events.zrzur.com, or ask users to sign in with Zrzur (OAuth). They add to the Terms of Service and the Community Guidelines.",
          "The open-source code of Zrzur is licensed under AGPL-3.0, and these terms do not limit that licence. They govern access to the Zrzur service that we run.",
        ),
        ar: para(
          "تسري هذه الشروط عندما تنشئ بوتًا أو تطبيقًا، أو تستخدم واجهة زرزور البرمجية أو اتصال WebSocket على api.zrzur.com وevents.zrzur.com، أو تطلب من المستخدمين تسجيل الدخول بحساب زرزور (OAuth). وهي إضافة إلى شروط الخدمة وإرشادات المجتمع.",
          "شيفرة زرزور المفتوحة مرخّصة بموجب AGPL-3.0، ولا تُقيّد هذه الشروط تلك الرخصة، وإنما تنظّم الوصول إلى خدمة زرزور التي نشغّلها.",
        ),
        de: para(
          "Diese Bedingungen gelten, wenn du einen Bot oder eine App erstellst, die Zrzur-API oder den WebSocket unter api.zrzur.com und events.zrzur.com nutzt oder Nutzer bittest, sich mit Zrzur anzumelden (OAuth). Sie ergänzen die Nutzungsbedingungen und die Community-Richtlinien.",
          "Der Open-Source-Code von Zrzur steht unter der AGPL-3.0, und diese Bedingungen schränken diese Lizenz nicht ein. Sie regeln den Zugang zu dem Zrzur-Dienst, den wir betreiben.",
        ),
      },
    ),
    section(
      "tokens",
      { en: "Keep tokens secret", ar: "احفظ الرموز سرًّا", de: "Tokens geheim halten" },
      {
        en: list(
          "Bot tokens, client secrets and user access tokens are like passwords. Never put them in public code, screenshots, client apps or messages.",
          "Store them encrypted and give access only to people who need it.",
          "If a token leaks, reset it immediately in the developer settings and tell us at security@zrzur.com if users may be affected.",
          "We may reset tokens we find in public places to protect users.",
          "Do not ask users for their own login token or password, and never run a bot on a normal user account (\"self-bots\").",
        ),
        ar: list(
          "رموز البوتات وأسرار العملاء ورموز وصول المستخدمين مثل كلمات المرور. لا تضعها أبدًا في شيفرة عامة أو لقطات شاشة أو تطبيقات عميلة أو رسائل.",
          "خزّنها مشفّرة، ولا تمنح الوصول إليها إلا لمن يحتاجه.",
          "إذا تسرّب رمز، فأعد تعيينه فورًا من إعدادات المطوّرين، وأخبرنا على security@zrzur.com إذا كان المستخدمون قد يتأثرون.",
          "قد نعيد تعيين الرموز التي نجدها في أماكن عامة لحماية المستخدمين.",
          "لا تطلب من المستخدمين رمز دخولهم أو كلمة مرورهم، ولا تشغّل بوتًا على حساب مستخدم عادي أبدًا (ما يُعرف بالبوتات الذاتية).",
        ),
        de: list(
          "Bot-Tokens, Client-Secrets und Zugriffstokens von Nutzern sind wie Passwörter. Veröffentliche sie niemals in öffentlichem Code, Screenshots, Client-Apps oder Nachrichten.",
          "Speichere sie verschlüsselt und gewähre nur Personen Zugriff, die ihn brauchen.",
          "Wird ein Token bekannt, setze es sofort in den Entwicklereinstellungen zurück und informiere uns unter security@zrzur.com, wenn Nutzer betroffen sein könnten.",
          "Wir können Tokens, die wir an öffentlichen Orten finden, zum Schutz der Nutzer zurücksetzen.",
          "Frage Nutzer nicht nach ihrem eigenen Anmeldetoken oder Passwort und betreibe niemals einen Bot über ein normales Nutzerkonto („Self-Bots“).",
        ),
      },
    ),
    section(
      "limits",
      { en: "Rate limits and fair use", ar: "حدود الاستخدام والاستخدام العادل", de: "Ratenbegrenzungen und faire Nutzung" },
      {
        en: list(
          "Respect the rate limits returned by the API and wait when you are told to.",
          "Do not try to get around limits with many tokens, accounts or IP addresses.",
          "Do not send the same message to many users or channels, or send unwanted direct messages.",
          "Cache data responsibly and avoid needless requests.",
          "We may lower limits or block traffic that harms the Service.",
        ),
        ar: list(
          "احترم حدود الاستخدام التي تُرجعها الواجهة البرمجية، وانتظر عندما يُطلب منك ذلك.",
          "لا تحاول تجاوز الحدود باستخدام رموز أو حسابات أو عناوين IP متعددة.",
          "لا ترسل الرسالة نفسها إلى عدد كبير من المستخدمين أو القنوات، ولا ترسل رسائل خاصة غير مرغوب فيها.",
          "خزّن البيانات مؤقتًا بمسؤولية، وتجنّب الطلبات غير الضرورية.",
          "قد نخفّض الحدود أو نحجب أي حركة مرور تضرّ بالخدمة.",
        ),
        de: list(
          "Halte die von der API zurückgegebenen Ratenbegrenzungen ein und warte, wenn du dazu aufgefordert wirst.",
          "Versuche nicht, Begrenzungen mit vielen Tokens, Konten oder IP-Adressen zu umgehen.",
          "Sende nicht dieselbe Nachricht an viele Nutzer oder Kanäle und sende keine unerwünschten Direktnachrichten.",
          "Speichere Daten verantwortungsvoll im Cache und vermeide unnötige Anfragen.",
          "Wir können Begrenzungen senken oder Datenverkehr sperren, der dem Dienst schadet.",
        ),
      },
    ),
    section(
      "data",
      { en: "Use as little data as possible", ar: "استخدم أقل قدر ممكن من البيانات", de: "So wenig Daten wie möglich verwenden" },
      {
        en: para(
          list(
            "Ask only for the permissions and OAuth scopes your app really needs, and explain why.",
            "Use data only for the purpose you told users about, and only while they use your app.",
            "Delete data when it is no longer needed, when a user asks, when your bot is removed from a Server, or when we ask.",
            "Publish a privacy notice that explains what your app collects, why, how long you keep it, and how to ask for deletion. Link it in your app profile.",
            "Keep the data secure and tell affected users and us quickly about any breach.",
          ),
          "You are responsible for following data-protection law for the data your app processes. For that data you are usually an independent controller, not Zrzur.",
          "Privileged intents (message content and the member list) are for bots that need them for a feature people use. A bot in more than 100 Servers keeps them only after our approval. If your bot receives interactions over HTTP, the endpoint must use HTTPS, check our signature on every request, and keep the signing secret like a token; tell us at security@zrzur.com at once if it leaks.",
        ),
        ar: para(
          list(
            "اطلب فقط الصلاحيات ونطاقات OAuth التي يحتاجها تطبيقك فعلًا، ووضّح سبب الحاجة إليها.",
            "استخدم البيانات فقط للغرض الذي أخبرت المستخدمين به، وطوال مدة استخدامهم تطبيقك فقط.",
            "احذف البيانات عندما لا تعود بحاجة إليها، أو عندما يطلب المستخدم ذلك، أو عند إزالة بوتك من سيرفر، أو عندما نطلب ذلك.",
            "انشر إشعار خصوصية يوضّح ما يجمعه تطبيقك، ولماذا، ومدة حفظه، وكيفية طلب حذفه، وضع رابطه في ملف تطبيقك.",
            "حافظ على أمان البيانات، وأخبر المستخدمين المتأثرين وأخبرنا سريعًا بأي اختراق.",
          ),
          "أنت مسؤول عن الالتزام بقوانين حماية البيانات فيما يخص البيانات التي يعالجها تطبيقك، وتكون في الغالب متحكّمًا مستقلًا فيها، لا زرزور.",
          "الصلاحيات المميّزة (محتوى الرسائل وقائمة الأعضاء) مخصّصة للبوتات التي تحتاجها لميزة يستخدمها الناس. ولا يحتفظ بها البوت الموجود في أكثر من ١٠٠ سيرفر إلا بعد موافقتنا. وإذا كان بوتك يتلقّى التفاعلات عبر HTTP، فيجب أن يستخدم العنوان HTTPS، وأن يتحقق من توقيعنا في كل طلب، وأن تحفظ سرّ التوقيع كما تحفظ الرمز؛ وأخبرنا فورًا على security@zrzur.com إذا تسرّب.",
        ),
        de: para(
          list(
            "Fordere nur die Berechtigungen und OAuth-Scopes an, die deine App wirklich braucht, und erkläre, warum.",
            "Verwende Daten nur für den Zweck, über den du die Nutzer informiert hast, und nur, solange sie deine App nutzen.",
            "Lösche Daten, wenn sie nicht mehr benötigt werden, wenn ein Nutzer darum bittet, wenn dein Bot von einem Server entfernt wird oder wenn wir darum bitten.",
            "Veröffentliche eine Datenschutzerklärung, die erläutert, was deine App erhebt, warum, wie lange du es aufbewahrst und wie man die Löschung verlangen kann. Verlinke sie in deinem App-Profil.",
            "Halte die Daten sicher und informiere betroffene Nutzer und uns umgehend über jede Datenschutzverletzung.",
          ),
          "Du bist dafür verantwortlich, das Datenschutzrecht für die Daten einzuhalten, die deine App verarbeitet. Für diese Daten bist in der Regel du selbst eigenständiger Verantwortlicher, nicht Zrzur.",
          "Privilegierte Intents (Nachrichteninhalte und Mitgliederliste) sind für Bots gedacht, die sie für eine genutzte Funktion brauchen. Ein Bot in mehr als 100 Servern behält sie nur mit unserer Freigabe. Empfängt dein Bot Interaktionen über HTTP, muss der Endpunkt HTTPS nutzen und unsere Signatur bei jeder Anfrage prüfen, und du musst das Signaturgeheimnis wie ein Token schützen; melde uns ein Leck sofort an security@zrzur.com.",
        ),
      },
    ),
    section(
      "no-scraping",
      { en: "No scraping or selling data", ar: "لا للجمع الآلي للبيانات ولا لبيعها", de: "Kein Scraping und kein Verkauf von Daten" },
      {
        en: list(
          "Do not scrape, crawl or bulk-download messages, profiles, Servers or Discover.",
          "Do not sell, rent, license or give away data you get from Zrzur, including to data brokers or advertisers.",
          "Do not build profiles of users across Servers, track people, or use data to decide on someone's eligibility for jobs, housing, credit or insurance.",
          "Do not use message content to train AI models unless every affected user clearly agreed.",
        ),
        ar: list(
          "لا تجمع آليًا أو تزحف أو تنزّل بالجملة الرسائل أو الملفات الشخصية أو السيرفرات أو محتوى «اكتشف».",
          "لا تبع البيانات التي تحصل عليها من زرزور، ولا تؤجّرها، ولا ترخّصها، ولا تمنحها لأحد، ومن ذلك وسطاء البيانات والمعلنون.",
          "لا تبنِ ملفات تعريفية للمستخدمين عبر السيرفرات، ولا تتعقّب الأشخاص، ولا تستخدم البيانات للحكم على أهلية أحد للعمل أو السكن أو الائتمان أو التأمين.",
          "لا تستخدم محتوى الرسائل لتدريب نماذج الذكاء الاصطناعي إلا إذا وافق كل مستخدم معني على ذلك بوضوح.",
        ),
        de: list(
          "Scrape, crawle oder lade keine Nachrichten, Profile, Server oder Entdecken in großen Mengen herunter.",
          "Verkaufe, vermiete, lizenziere oder verschenke keine Daten, die du von Zrzur erhältst, auch nicht an Datenhändler oder Werbetreibende.",
          "Erstelle keine serverübergreifenden Nutzerprofile, verfolge keine Personen und verwende keine Daten, um über die Eignung einer Person für Arbeitsstellen, Wohnraum, Kredite oder Versicherungen zu entscheiden.",
          "Verwende Nachrichteninhalte nicht zum Training von KI-Modellen, es sei denn, jeder betroffene Nutzer hat eindeutig zugestimmt.",
        ),
      },
    ),
    section(
      "oauth",
      { en: "OAuth and user consent", ar: "OAuth وموافقة المستخدم", de: "OAuth und Einwilligung der Nutzer" },
      {
        en: list(
          "Users must see and approve every scope your app requests on the Zrzur consent screen. Never trick users into approving.",
          "Do not request new scopes silently; ask again when you need more.",
          "Let users disconnect your app easily, and stop using their data when they do.",
          "Do not join Servers, send messages or take actions on a user's behalf that they did not clearly ask for.",
        ),
        ar: list(
          "يجب أن يرى المستخدمون كل نطاق يطلبه تطبيقك ويوافقوا عليه في شاشة الموافقة الخاصة بزرزور. ولا تخدع المستخدمين أبدًا ليوافقوا.",
          "لا تطلب نطاقات جديدة دون علم المستخدم، واطلب الموافقة مجددًا عندما تحتاج إلى المزيد.",
          "اسمح للمستخدمين بفصل تطبيقك بسهولة، وتوقّف عن استخدام بياناتهم عندما يفعلون ذلك.",
          "لا تنضمّ إلى السيرفرات، ولا ترسل الرسائل، ولا تتخذ أي إجراء نيابةً عن المستخدم ما لم يطلبه بوضوح.",
        ),
        de: list(
          "Nutzer müssen jeden Scope, den deine App anfordert, auf dem Zustimmungsbildschirm von Zrzur sehen und genehmigen. Bringe Nutzer niemals durch Täuschung zur Zustimmung.",
          "Fordere neue Scopes nicht stillschweigend an; frage erneut, wenn du mehr brauchst.",
          "Ermögliche Nutzern, deine App einfach zu trennen, und hör dann auf, ihre Daten zu verwenden.",
          "Tritt keinen Servern bei, sende keine Nachrichten und führe keine Aktionen im Namen eines Nutzers aus, um die er nicht ausdrücklich gebeten hat.",
        ),
      },
    ),
    section(
      "behaviour",
      { en: "Bots must follow the rules", ar: "على البوتات الالتزام بالقواعد", de: "Bots müssen die Regeln einhalten" },
      {
        en: list(
          "Your bot must follow the Community Guidelines, and you are responsible for everything it posts — including content generated by AI or by users through your bot.",
          "Bots must be clearly marked as bots. Do not hide that users are talking to automation.",
          "Do not build bots that raid, spam, evade bans, or moderate in abusive ways.",
          "Paid features in your bot must be described honestly, and prices must be clear before users pay.",
        ),
        ar: list(
          "يجب أن يلتزم بوتك بإرشادات المجتمع، وأنت مسؤول عن كل ما ينشره — ومن ذلك المحتوى المولّد بالذكاء الاصطناعي أو الذي ينشره المستخدمون عبر بوتك.",
          "يجب أن تُوسم البوتات بوضوح بأنها بوتات، ولا تُخفِ عن المستخدمين أنهم يتحدثون إلى نظام آلي.",
          "لا تبنِ بوتات تشنّ الهجمات الجماعية أو ترسل الرسائل المزعجة أو تتحايل على الحظر أو تشرف بطريقة مسيئة.",
          "يجب وصف الميزات المدفوعة في بوتك بصدق، وأن تكون الأسعار واضحة قبل أن يدفع المستخدمون.",
        ),
        de: list(
          "Dein Bot muss die Community-Richtlinien einhalten, und du bist für alles verantwortlich, was er veröffentlicht – einschließlich Inhalten, die von KI oder von Nutzern über deinen Bot erzeugt werden.",
          "Bots müssen deutlich als Bots gekennzeichnet sein. Verbirg nicht, dass Nutzer mit einer Automatisierung sprechen.",
          "Entwickle keine Bots, die Raids durchführen, Spam versenden, Sperren umgehen oder missbräuchlich moderieren.",
          "Kostenpflichtige Funktionen deines Bots müssen ehrlich beschrieben werden, und die Preise müssen klar sein, bevor Nutzer bezahlen.",
        ),
      },
    ),
    section(
      "brand",
      { en: "No impersonation of Zrzur", ar: "لا لانتحال صفة زرزور", de: "Kein Auftreten als Zrzur" },
      {
        en: "Do not name, design or describe your bot or app so that it looks like it is made by Zrzur, is official, or is a Zrzur staff account. You may say your app \"works with Zrzur\". Do not use the Zrzur logo as your app's icon.",
        ar: "لا تُسمِّ بوتك أو تطبيقك أو تصمّمه أو تصفه بما يوحي بأن زرزور صنعه، أو أنه رسمي، أو أنه حساب لفريق زرزور. ويجوز لك القول إن تطبيقك «يعمل مع زرزور». ولا تستخدم شعار زرزور أيقونةً لتطبيقك.",
        de: "Benenne, gestalte oder beschreibe deinen Bot oder deine App nicht so, dass der Eindruck entsteht, er oder sie stamme von Zrzur, sei offiziell oder sei ein Konto von Zrzur-Mitarbeitenden. Du darfst sagen, dass deine App „mit Zrzur funktioniert“. Verwende das Zrzur-Logo nicht als Symbol deiner App.",
      },
    ),
    section(
      "verification",
      { en: "Verification", ar: "التحقّق", de: "Verifizierung" },
      {
        en: "Bots in more than 100 Servers, bots listed in Discover, and apps that request sensitive scopes must be verified. Verification means confirming who is responsible for the app, turning on two-factor authentication, and passing a short review of the app's purpose, permissions and privacy notice. We may ask for more information at any time.",
        ar: "يجب توثيق البوتات الموجودة في أكثر من ١٠٠ سيرفر، والبوتات المُدرجة في «اكتشف»، والتطبيقات التي تطلب نطاقات حساسة. ويعني التوثيق تأكيد الجهة المسؤولة عن التطبيق، وتفعيل التحقق بخطوتين، واجتياز مراجعة قصيرة لغرض التطبيق وصلاحياته وإشعار الخصوصية الخاص به. وقد نطلب مزيدًا من المعلومات في أي وقت.",
        de: "Bots in mehr als 100 Servern, in Entdecken gelistete Bots und Apps, die sensible Scopes anfordern, müssen verifiziert sein. Verifizierung bedeutet, zu bestätigen, wer für die App verantwortlich ist, die Zwei-Faktor-Authentifizierung zu aktivieren und eine kurze Prüfung von Zweck, Berechtigungen und Datenschutzerklärung der App zu bestehen. Wir können jederzeit weitere Informationen anfordern.",
      },
    ),
    section(
      "enforcement",
      { en: "Suspension and changes", ar: "الإيقاف والتغييرات", de: "Sperrung und Änderungen" },
      {
        en: para(
          "We may limit, suspend or remove a bot or app, reset its tokens, or remove it from Discover if it breaks these terms, puts users at risk, or harms the Service. When we can do so safely, we warn you first and give you time to fix the problem. You can appeal as described in the Enforcement and Appeals policy.",
          "The API can change. We announce breaking changes in advance where we can, but we may change things right away to fix security problems.",
          "The API is provided without a warranty, to the extent the law allows. You are responsible for claims that come from your app breaking these terms.",
        ),
        ar: para(
          "يجوز لنا تقييد بوت أو تطبيق أو إيقافه أو إزالته، أو إعادة تعيين رموزه، أو إزالته من «اكتشف»، إذا خالف هذه الشروط، أو عرّض المستخدمين للخطر، أو أضرّ بالخدمة. وحين يمكننا ذلك بأمان، ننبّهك أولًا ونمنحك وقتًا لإصلاح المشكلة. ويحق لك الاعتراض كما توضّح سياسة الإنفاذ والاعتراض.",
          "قد تتغيّر الواجهة البرمجية. ونعلن التغييرات الجذرية مسبقًا متى أمكن، لكن قد نغيّر بعض الأمور فورًا لإصلاح مشكلات أمنية.",
          "تُقدَّم الواجهة البرمجية دون ضمان في الحدود التي يسمح بها القانون. وأنت مسؤول عن المطالبات الناتجة عن مخالفة تطبيقك هذه الشروط.",
        ),
        de: para(
          "Wir können einen Bot oder eine App einschränken, sperren oder entfernen, seine Tokens zurücksetzen oder ihn aus Entdecken entfernen, wenn er gegen diese Bedingungen verstößt, Nutzer gefährdet oder dem Dienst schadet. Wenn dies gefahrlos möglich ist, warnen wir dich zuerst und geben dir Zeit, das Problem zu beheben. Du kannst Einspruch einlegen, wie in der Richtlinie zu Durchsetzung und Einspruch beschrieben.",
          "Die API kann sich ändern. Inkompatible Änderungen kündigen wir nach Möglichkeit im Voraus an, wir können aber Dinge sofort ändern, um Sicherheitsprobleme zu beheben.",
          "Die API wird, soweit gesetzlich zulässig, ohne Gewährleistung bereitgestellt. Du bist für Ansprüche verantwortlich, die daraus entstehen, dass deine App gegen diese Bedingungen verstößt.",
        ),
      },
    ),
  ],
});

import { doc, list, para, section } from "./shared.ts";

export const serverOwnerRules = doc({
  slug: "server-owner-rules",
  group: "servers",
  title: { en: "Server Owner Rules", ar: "قواعد مالكي السيرفرات",
    de: "Regeln für Serverinhaber" },
  intro: {
    en: "What we expect from people who own or moderate a Server on Zrzur, and how server rules and membership screening work.",
    ar: "ما نتوقّعه ممّن يملكون سيرفرًا على زرزور أو يشرفون عليه، وكيف تعمل قواعد السيرفر وفحص العضوية.",
    de: "Was wir von Personen erwarten, die auf Zrzur einen Server besitzen oder moderieren, und wie Serverregeln und die Regelprüfung funktionieren.",
  },
  sections: [
    section(
      "responsibility",
      { en: "Your responsibility", ar: "مسؤوليتك", de: "Deine Verantwortung" },
      {
        en: para(
          "When you create a Server, you become its owner. You decide what it is about and who helps run it. You are also responsible for making sure that what happens in your Server follows the Terms of Service and the Community Guidelines.",
          "You do not have to read every message. But you must act when you see or are told about content that breaks our rules, and you must not create a Server whose purpose is to break them.",
        ),
        ar: para(
          "عندما تنشئ سيرفرًا، تصبح مالكه، وتقرّر موضوعه ومن يساعدك في إدارته. وأنت مسؤول كذلك عن ضمان أن يلتزم ما يحدث في سيرفرك بشروط الخدمة وإرشادات المجتمع.",
          "لا يُطلب منك قراءة كل رسالة، لكن يجب أن تتصرّف عندما ترى محتوى يخالف قواعدنا أو تُبلَّغ عنه، ولا يجوز لك إنشاء سيرفر غرضه مخالفة هذه القواعد.",
        ),
        de: para(
          "Wenn du einen Server erstellst, wirst du sein Inhaber. Du entscheidest, worum es darin geht und wer bei der Leitung hilft. Du bist auch dafür verantwortlich, dass das, was in deinem Server geschieht, den Nutzungsbedingungen und den Community-Richtlinien entspricht.",
          "Du musst nicht jede Nachricht lesen. Du musst aber handeln, wenn du Inhalte siehst oder auf Inhalte hingewiesen wirst, die gegen unsere Regeln verstoßen, und du darfst keinen Server erstellen, dessen Zweck es ist, gegen sie zu verstoßen.",
        ),
      },
    ),
    section(
      "server-rules",
      { en: "Write clear server rules", ar: "اكتب قواعد واضحة للسيرفر", de: "Klare Serverregeln aufstellen" },
      {
        en: para(
          "Every Server that is public, listed in Discover or has more than 50 members must have written server rules. Keep them short and clear. Your rules can be stricter than ours, but they can never allow something our policies forbid.",
          "Write the rules in the main language of your Server. Tell members when you change them in an important way.",
        ),
        ar: para(
          "يجب أن تكون لكل سيرفر عام، أو مُدرج في «اكتشف»، أو يزيد عدد أعضائه على 50، قواعد مكتوبة. اجعلها قصيرة وواضحة. ويجوز أن تكون قواعدك أشدّ من قواعدنا، لكنها لا يجوز أبدًا أن تسمح بما تحظره سياساتنا.",
          "اكتب القواعد باللغة الرئيسية لسيرفرك، وأخبر الأعضاء عند تغييرها تغييرًا مهمًا.",
        ),
        de: para(
          "Jeder Server, der öffentlich ist, in Entdecken gelistet ist oder mehr als 50 Mitglieder hat, muss schriftliche Serverregeln haben. Halte sie kurz und klar. Deine Regeln dürfen strenger sein als unsere, aber niemals etwas erlauben, was unsere Richtlinien verbieten.",
          "Verfasse die Regeln in der Hauptsprache deines Servers. Informiere die Mitglieder, wenn du sie wesentlich änderst.",
        ),
      },
    ),
    section(
      "screening",
      { en: "Membership screening", ar: "فحص العضوية", de: "Mitgliederprüfung" },
      {
        en: para(
          "When a Server owner turns on rules screening, Zrzur shows the server rules to every member who joins after that, and they must accept them before they can post:",
          list(
            "new members can read the Server's public channels, but cannot send messages, react, join voice or send direct messages through the Server until they accept the server rules;",
            "you may add simple questions, but do not ask for passwords, ID documents, phone numbers or other sensitive personal data.",
          ),
          "Rules screening is your choice, and we recommend it for every public Server. Members who do not accept can leave at any time.",
        ),
        ar: para(
          "عندما يفعّل مالك السيرفر فحص القواعد، يعرض زرزور قواعد السيرفر على كل عضو ينضم بعد ذلك، ويجب عليه قبولها قبل أن يتمكّن من النشر:",
          list(
            "يستطيع الأعضاء الجدد قراءة القنوات العامة في السيرفر، لكنهم لا يستطيعون إرسال الرسائل أو التفاعل أو الانضمام إلى الصوت أو إرسال رسائل خاصة عبر السيرفر حتى يقبلوا قواعده؛",
            "يجوز لك إضافة أسئلة بسيطة، لكن لا تطلب كلمات المرور أو وثائق الهوية أو أرقام الهواتف أو غيرها من البيانات الشخصية الحساسة.",
          ),
          "فحص القواعد اختيارك، وننصح به لكل سيرفر عام. ويستطيع من لا يقبل القواعد المغادرة في أي وقت.",
        ),
        de: para(
          "Wenn ein Serverinhaber die Regelprüfung einschaltet, zeigt Zrzur die Serverregeln jedem Mitglied, das danach beitritt, und es muss sie annehmen, bevor es Beiträge schreiben kann:",
          list(
            "neue Mitglieder können die öffentlichen Kanäle des Servers lesen, aber keine Nachrichten senden, nicht reagieren, keinem Sprachkanal beitreten und über den Server keine Direktnachrichten senden, bis sie die Serverregeln annehmen;",
            "du darfst einfache Fragen hinzufügen, aber frage nicht nach Passwörtern, Ausweisdokumenten, Telefonnummern oder anderen sensiblen personenbezogenen Daten.",
          ),
          "Die Regelprüfung ist deine Entscheidung; wir empfehlen sie für jeden öffentlichen Server. Wer nicht annimmt, kann jederzeit gehen.",
        ),
      },
    ),
    section(
      "moderation",
      { en: "Moderate fairly", ar: "أشرف بعدل", de: "Fair moderieren" },
      {
        en: list(
          "Choose moderators you trust, and give them only the permissions they need.",
          "Apply your rules in the same way to everyone.",
          "Do not use moderation tools to harass, threaten or punish people for reasons unrelated to your Server.",
          "Do not ban or remove people in order to collect their data or for payment.",
          "Report serious problems — such as child safety issues, threats or illegal content — to Zrzur, not only by banning the user.",
        ),
        ar: list(
          "اختر مشرفين تثق بهم، وامنحهم الصلاحيات التي يحتاجونها فقط.",
          "طبّق قواعدك على الجميع بالطريقة نفسها.",
          "لا تستخدم أدوات الإشراف للتحرّش بالناس أو تهديدهم أو معاقبتهم لأسباب لا علاقة لها بسيرفرك.",
          "لا تحظر الأشخاص أو تزيلهم لجمع بياناتهم أو مقابل المال.",
          "أبلغ زرزور بالمشكلات الخطيرة — كقضايا سلامة الأطفال أو التهديدات أو المحتوى غير القانوني — ولا تكتفِ بحظر المستخدم.",
        ),
        de: list(
          "Wähle Moderatoren, denen du vertraust, und gib ihnen nur die Berechtigungen, die sie brauchen.",
          "Wende deine Regeln auf alle gleich an.",
          "Nutze Moderationswerkzeuge nicht, um Menschen zu belästigen, zu bedrohen oder aus Gründen zu bestrafen, die nichts mit deinem Server zu tun haben.",
          "Sperre oder entferne niemanden, um seine Daten zu sammeln oder gegen Bezahlung.",
          "Melde schwerwiegende Probleme – etwa Gefahren für Kinder, Drohungen oder rechtswidrige Inhalte – an Zrzur, statt den Nutzer nur zu sperren.",
        ),
      },
    ),
    section(
      "mature",
      { en: "Mature channels and age", ar: "قنوات البالغين والعمر", de: "Kanäle für Erwachsene und Alter" },
      {
        en: "Content for adults only is allowed only in channels or Servers you mark as mature, and pornography is not allowed anywhere (see the Community Guidelines). For now, these are closed to everyone, because a stated age is not proof of age. Mark them before posting such content, and never use mature content in your Server name, icon, banner, invite page or public channels. If your Server is clearly aimed at minors, it must not have mature channels.",
        ar: "يُسمح بالمحتوى المخصّص للبالغين فقط في القنوات أو السيرفرات التي تحدّدها كمحتوى للبالغين، ولا يُسمح بالمواد الإباحية في أي مكان (راجع إرشادات المجتمع). وهي مغلقة أمام الجميع حاليًا، لأن العمر المصرَّح به ليس إثباتًا للعمر. حدّدها قبل نشر هذا المحتوى، ولا تستخدم أبدًا محتوى البالغين في اسم سيرفرك أو أيقونته أو غلافه أو صفحة دعوته أو قنواته العامة. وإذا كان سيرفرك موجّهًا بوضوح إلى القاصرين، فلا يجوز أن يحتوي على قنوات للبالغين.",
        de: "Inhalte nur für Erwachsene sind nur in Kanälen oder Servern erlaubt, die du als nur für Erwachsene markierst, und Pornografie ist nirgends erlaubt (siehe die Community-Richtlinien). Sie sind vorerst für alle geschlossen, weil eine Altersangabe kein Altersnachweis ist. Markiere sie, bevor du solche Inhalte veröffentlichst, und verwende niemals Inhalte für Erwachsene in deinem Servernamen, Symbol, Banner, deiner Einladungsseite oder in öffentlichen Kanälen. Richtet sich dein Server erkennbar an Minderjährige, darf er keine Kanäle für Erwachsene haben.",
      },
    ),
    section(
      "data",
      { en: "Members' data and bots", ar: "بيانات الأعضاء والبوتات", de: "Daten der Mitglieder und Bots" },
      {
        en: list(
          "Add only bots you trust, and give them only the permissions they need.",
          "Do not use bots or tools to copy, export or archive members' messages or profiles for purposes outside running your Server.",
          "Do not share members' private information outside the Server.",
          "If you log messages for moderation, tell members in your server rules and keep logs only as long as you need them.",
        ),
        ar: list(
          "أضف فقط البوتات التي تثق بها، وامنحها الصلاحيات التي تحتاجها فقط.",
          "لا تستخدم البوتات أو الأدوات لنسخ رسائل الأعضاء أو ملفاتهم الشخصية أو تصديرها أو أرشفتها لأغراض خارج إدارة سيرفرك.",
          "لا تشارك المعلومات الخاصة بالأعضاء خارج السيرفر.",
          "إذا كنت تسجّل الرسائل لأغراض الإشراف، فأخبر الأعضاء بذلك في قواعد السيرفر، ولا تحتفظ بالسجلات إلا ما دامت الحاجة قائمة.",
        ),
        de: list(
          "Füge nur Bots hinzu, denen du vertraust, und gib ihnen nur die Berechtigungen, die sie brauchen.",
          "Nutze keine Bots oder Werkzeuge, um Nachrichten oder Profile von Mitgliedern für Zwecke außerhalb des Betriebs deines Servers zu kopieren, zu exportieren oder zu archivieren.",
          "Gib private Informationen von Mitgliedern nicht außerhalb des Servers weiter.",
          "Wenn du Nachrichten zur Moderation protokollierst, weise die Mitglieder in deinen Serverregeln darauf hin und bewahre Protokolle nur so lange auf, wie du sie brauchst.",
        ),
      },
    ),
    section(
      "money",
      { en: "Money, Wings and selling", ar: "المال و«الأجنحة» والبيع", de: "Geld, Flügel und Verkauf" },
      {
        en: list(
          "Do not buy, sell or rent Servers, invites, roles or ownership.",
          "Do not require members to buy Feather or give Wings to take part in normal activity.",
          "If you sell your own goods or services to members, be honest, follow consumer law, and do not run scams or gambling for money.",
        ),
        ar: list(
          "لا تشترِ السيرفرات أو الدعوات أو الأدوار أو الملكية، ولا تبعها، ولا تؤجّرها.",
          "لا تُلزم الأعضاء بشراء «ريشة» أو منح «أجنحة» للمشاركة في النشاط المعتاد.",
          "إذا كنت تبيع سلعك أو خدماتك الخاصة للأعضاء، فكن صادقًا، والتزم بقوانين حماية المستهلك، ولا تمارس الاحتيال أو القمار على المال.",
        ),
        de: list(
          "Kaufe, verkaufe oder vermiete keine Server, Einladungen, Rollen oder Inhaberschaften.",
          "Verlange von Mitgliedern nicht, Feather zu kaufen oder Flügel zu geben, um an normalen Aktivitäten teilzunehmen.",
          "Wenn du Mitgliedern eigene Waren oder Dienstleistungen verkaufst, sei ehrlich, halte das Verbraucherrecht ein und betreibe keinen Betrug und kein Glücksspiel um Geld.",
        ),
      },
    ),
    section(
      "ownership",
      { en: "Ownership changes and inactive Servers", ar: "نقل الملكية والسيرفرات غير النشطة", de: "Inhaberwechsel und inaktive Server" },
      {
        en: "You can transfer ownership to another member at any time. If an owner's account is deleted or has been inactive for a long time, we may, on request from the Server's moderators, transfer ownership to an active moderator. A Server whose staff does not respond to serious, repeated reports may be restricted or removed.",
        ar: "يمكنك نقل الملكية إلى عضو آخر في أي وقت. وإذا حُذف حساب المالك أو ظلّ غير نشط مدةً طويلة، فقد ننقل الملكية بطلب من مشرفي السيرفر إلى مشرف نشط. وقد يُقيَّد السيرفر أو يُزال إذا لم يستجب فريق إدارته لبلاغات خطيرة ومتكررة.",
        de: "Du kannst die Inhaberschaft jederzeit an ein anderes Mitglied übertragen. Wird das Konto eines Inhabers gelöscht oder ist es seit langer Zeit inaktiv, können wir die Inhaberschaft auf Antrag der Moderatoren des Servers an einen aktiven Moderator übertragen. Ein Server, dessen Team auf schwerwiegende, wiederholte Meldungen nicht reagiert, kann eingeschränkt oder entfernt werden.",
      },
    ),
    section(
      "enforcement",
      { en: "When we step in", ar: "متى نتدخّل", de: "Wann wir eingreifen" },
      {
        en: "If a Server repeatedly breaks our rules, we may act against the content, the members involved, the staff who allowed it, or the whole Server — from removing it from Discover to closing it. We tell the owner what we did and why, and the owner can appeal as described in the Enforcement and Appeals policy.",
        ar: "إذا خالف سيرفر قواعدنا مرارًا، فقد نتخذ إجراءً بحق المحتوى، أو الأعضاء المتورّطين، أو فريق الإدارة الذي سمح بذلك، أو السيرفر كله — بدءًا من إزالته من «اكتشف» حتى إغلاقه. ونخبر المالك بما فعلناه وسببه، ويحق له الاعتراض كما توضّح سياسة الإنفاذ والاعتراض.",
        de: "Verstößt ein Server wiederholt gegen unsere Regeln, können wir gegen die Inhalte, die beteiligten Mitglieder, das Team, das dies zugelassen hat, oder den gesamten Server vorgehen – von der Entfernung aus Entdecken bis zur Schließung. Wir teilen dem Inhaber mit, was wir getan haben und warum, und der Inhaber kann Einspruch einlegen, wie in der Richtlinie zu Durchsetzung und Einspruch beschrieben.",
      },
    ),
  ],
});

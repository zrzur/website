import { doc, list, para, section } from "./shared.ts";

export const communityGuidelines = doc({
  slug: "community-guidelines",
  group: "everyone",
  title: { en: "Community Guidelines", ar: "إرشادات المجتمع",
    de: "Community-Richtlinien" },
  intro: {
    en: "The rules for everyone on Zrzur — in every Server, group and private message. They exist so people can feel safe and enjoy talking here.",
    ar: "القواعد التي تسري على الجميع في زرزور — في كل سيرفر ومجموعة ورسالة خاصة. ووُضعت ليشعر الناس بالأمان ويستمتعوا بالحديث هنا.",
    de: "Die Regeln für alle auf Zrzur – in jedem Server, jeder Gruppe und jeder privaten Nachricht. Sie sollen dafür sorgen, dass sich alle hier sicher fühlen und gern miteinander sprechen.",
  },
  sections: [
    section(
      "spirit",
      { en: "The short version", ar: "باختصار", de: "Die Kurzfassung" },
      {
        en: para(
          "Treat people with respect, keep it legal, and do not put anyone at risk. Server owners can add stricter rules for their own Server, but nobody can allow what these guidelines forbid.",
          "These guidelines apply to everything on Zrzur: messages, profiles, usernames, avatars, Server names and icons, bots, plugins, community items and Discover listings.",
        ),
        ar: para(
          "عامِل الناس باحترام، والتزم بالقانون، ولا تعرّض أحدًا للخطر. يمكن لمالكي السيرفرات إضافة قواعد أشد في سيرفراتهم، لكن لا يحق لأحد أن يسمح بما تحظره هذه الإرشادات.",
          "تسري هذه الإرشادات على كل شيء في زرزور: الرسائل، والملفات الشخصية، وأسماء المستخدمين، والصور الرمزية، وأسماء السيرفرات وأيقوناتها، والبوتات، والإضافات، وعناصر المجتمع، وقوائم «اكتشف».",
        ),
        de: para(
          "Behandeln Sie andere mit Respekt, halten Sie sich an das Gesetz und bringen Sie niemanden in Gefahr. Serverinhaber können für ihren eigenen Server strengere Regeln festlegen, aber niemand kann erlauben, was diese Richtlinien verbieten.",
          "Diese Richtlinien gelten für alles auf Zrzur: Nachrichten, Profile, Benutzernamen, Avatare, Servernamen und -symbole, Bots, Plugins, Community-Elemente und Discover-Einträge.",
        ),
      },
    ),
    section(
      "harassment",
      { en: "No harassment or bullying", ar: "لا للتحرّش والتنمّر", de: "Keine Belästigung und kein Mobbing" },
      {
        en: list(
          "Do not threaten, insult repeatedly, or target someone to upset or scare them.",
          "Do not organise or join pile-ons, raids or brigading against people or Servers.",
          "Do not keep contacting someone who has blocked you or asked you to stop, including through new accounts.",
          "Do not send sexual messages or images to people who did not ask for them.",
        ),
        ar: list(
          "لا تهدّد أحدًا، ولا تكرّر إهانته، ولا تستهدفه لإزعاجه أو إخافته.",
          "لا تنظّم هجمات جماعية على الأشخاص أو السيرفرات ولا تشارك فيها.",
          "لا تواصل التواصل مع شخص حظرك أو طلب منك التوقف، ولو عبر حسابات جديدة.",
          "لا ترسل رسائل أو صورًا جنسية لأشخاص لم يطلبوها.",
        ),
        de: list(
          "Bedrohen Sie niemanden, beleidigen Sie niemanden wiederholt und nehmen Sie niemanden ins Visier, um ihn zu verunsichern oder ihm Angst zu machen.",
          "Organisieren Sie keine gemeinsamen Angriffe, Raids oder Brigading gegen Personen oder Server und beteiligen Sie sich nicht daran.",
          "Kontaktieren Sie niemanden weiter, der Sie blockiert oder Sie gebeten hat aufzuhören, auch nicht über neue Konten.",
          "Senden Sie keine sexuellen Nachrichten oder Bilder an Personen, die nicht darum gebeten haben.",
        ),
      },
    ),
    section(
      "hate",
      { en: "No hate", ar: "لا لخطاب الكراهية", de: "Kein Hass" },
      {
        en: "Do not attack, dehumanise or call for exclusion of people because of their race, ethnicity, nationality, religion, sex, gender identity, sexual orientation, disability, age or serious illness. Do not share hateful symbols or content that praises hate groups. Discussing these topics in good faith, for example in news or education, is allowed.",
        ar: "لا تهاجم الناس أو تجرّدهم من إنسانيتهم أو تدعُ إلى إقصائهم بسبب العرق أو الأصل أو الجنسية أو الدين أو الجنس أو الهوية الجندرية أو التوجّه الجنسي أو الإعاقة أو العمر أو المرض الخطير. ولا تنشر رموز الكراهية أو المحتوى الذي يمجّد جماعات الكراهية. ويُسمح بمناقشة هذه الموضوعات بحسن نية، كما في الأخبار أو التعليم.",
        de: "Greifen Sie Menschen nicht wegen ihrer Herkunft, ethnischen Zugehörigkeit, Staatsangehörigkeit, Religion, ihres Geschlechts, ihrer Geschlechtsidentität, sexuellen Orientierung, Behinderung, ihres Alters oder einer schweren Krankheit an, sprechen Sie ihnen nicht ihre Menschlichkeit ab und rufen Sie nicht zu ihrem Ausschluss auf. Teilen Sie keine Hasssymbole und keine Inhalte, die Hassgruppen verherrlichen. Die Auseinandersetzung mit diesen Themen in gutem Glauben, etwa in Nachrichten oder in der Bildung, ist erlaubt.",
      },
    ),
    section(
      "violence",
      { en: "No violence or violent extremism", ar: "لا للعنف والتطرّف العنيف", de: "Keine Gewalt und kein gewalttätiger Extremismus" },
      {
        en: list(
          "Do not threaten or encourage violence against anyone.",
          "Do not support, recruit for or share propaganda from terrorist or violent extremist groups.",
          "Do not share content that celebrates real attacks or shows extreme gore for shock value.",
          "News, documentation of human-rights abuses and historical discussion are allowed when shared with context and not to glorify violence.",
        ),
        ar: list(
          "لا تهدّد أحدًا بالعنف ولا تحرّض عليه.",
          "لا تدعم الجماعات الإرهابية أو المتطرّفة العنيفة، ولا تجنّد لها، ولا تنشر دعايتها.",
          "لا تنشر محتوى يحتفي بهجمات حقيقية أو يعرض مشاهد دموية شديدة بقصد الصدمة.",
          "يُسمح بالأخبار وتوثيق انتهاكات حقوق الإنسان والنقاش التاريخي إذا نُشرت مع سياقها ولم يكن الهدف تمجيد العنف.",
        ),
        de: list(
          "Drohen Sie niemandem Gewalt an und rufen Sie nicht zu Gewalt gegen andere auf.",
          "Unterstützen Sie keine terroristischen oder gewalttätig-extremistischen Gruppen, werben Sie nicht für sie an und teilen Sie keine Propaganda von ihnen.",
          "Teilen Sie keine Inhalte, die reale Anschläge feiern oder extreme Brutalität zur Schockwirkung zeigen.",
          "Nachrichten, die Dokumentation von Menschenrechtsverletzungen und historische Diskussionen sind erlaubt, wenn sie mit Kontext geteilt werden und nicht der Verherrlichung von Gewalt dienen.",
        ),
      },
    ),
    section(
      "child-safety",
      { en: "Child safety — zero tolerance", ar: "سلامة الأطفال — لا تسامح مطلقًا", de: "Kinderschutz – null Toleranz" },
      {
        en: para(
          "Any sexual content involving minors is forbidden — real, drawn, animated or AI-generated. So is grooming, sexualising minors, or trying to meet minors for sexual purposes.",
          "We remove this content immediately, permanently ban the accounts involved, and report it to the competent authorities as the law requires. There are no warnings and no exceptions.",
        ),
        ar: para(
          "يُحظر أي محتوى جنسي يتعلّق بالقاصرين — سواء كان حقيقيًا أو مرسومًا أو متحركًا أو مولّدًا بالذكاء الاصطناعي. ويُحظر كذلك استدراج القاصرين، أو إضفاء طابع جنسي عليهم، أو محاولة لقائهم لأغراض جنسية.",
          "نحذف هذا المحتوى فورًا، ونحظر الحسابات المتورّطة حظرًا دائمًا، ونبلّغ عنه السلطات المختصة كما يوجب القانون. ولا إنذارات ولا استثناءات.",
        ),
        de: para(
          "Jeder sexuelle Inhalt mit Minderjährigen ist verboten – ob real, gezeichnet, animiert oder KI-generiert. Ebenso verboten sind Cybergrooming, die Sexualisierung Minderjähriger und der Versuch, Minderjährige zu sexuellen Zwecken zu treffen.",
          "Wir entfernen solche Inhalte sofort, sperren die beteiligten Konten dauerhaft und melden sie den zuständigen Behörden, wie es das Gesetz verlangt. Es gibt keine Verwarnungen und keine Ausnahmen.",
        ),
      },
    ),
    section(
      "sexual-content",
      { en: "Sexual and mature content", ar: "المحتوى الجنسي ومحتوى البالغين", de: "Sexuelle und nicht jugendfreie Inhalte" },
      {
        en: list(
          "Pornography and other sexually explicit images or videos are not allowed anywhere on Zrzur, not even in mature channels. Zrzur cannot verify ages (people state their own), so we do not host content that needs a real age check.",
          "Other content for adults only — for example very graphic news, art or discussion — is allowed only in channels or Servers marked as mature. Those open only to accounts whose stated age is 18 or over.",
          "It must never appear in avatars, banners, usernames, Server icons, Discover listings or public areas.",
          "Never share intimate images of someone without their consent, or threaten to do so.",
          "Content involving non-consent, bestiality or real-world sexual violence is not allowed anywhere.",
        ),
        ar: list(
          "لا يُسمح بالمواد الإباحية ولا بغيرها من الصور أو الفيديوهات الجنسية الصريحة في أي مكان على زرزور، ولا حتى في القنوات المخصّصة للبالغين. فزرزور لا يستطيع التحقق من الأعمار (إذ يصرّح كل شخص بعمره بنفسه)، لذلك لا نستضيف محتوى يحتاج إلى تحقق فعلي من العمر.",
          "أما المحتوى الآخر المخصّص للبالغين فقط — مثل الأخبار أو الأعمال الفنية أو النقاشات الصادمة جدًا — فيُسمح به فقط في القنوات أو السيرفرات المحددة كمحتوى للبالغين، ولا تُفتح إلا للحسابات التي صرّح أصحابها بأن عمرهم ١٨ عامًا فأكثر.",
          "ولا يجوز أن يظهر أبدًا في الصور الرمزية أو الأغلفة أو أسماء المستخدمين أو أيقونات السيرفرات أو قوائم «اكتشف» أو الأماكن العامة.",
          "لا تشارك أبدًا صورًا حميمة لأي شخص دون موافقته، ولا تهدّد بذلك.",
          "لا يُسمح في أي مكان بالمحتوى الذي يتضمّن انعدام الموافقة أو البهيمية أو العنف الجنسي الحقيقي.",
        ),
        de: list(
          "Pornografie und andere sexuell explizite Bilder oder Videos sind nirgends auf Zrzur erlaubt, auch nicht in nicht jugendfreien Kanälen. Zrzur kann das Alter nicht überprüfen (jede Person gibt ihr Alter selbst an), daher hosten wir keine Inhalte, die eine echte Altersprüfung erfordern.",
          "Andere Inhalte nur für Erwachsene – zum Beispiel sehr drastische Nachrichten, Kunst oder Diskussionen – sind nur in Kanälen oder Servern erlaubt, die als nicht jugendfrei gekennzeichnet sind. Diese stehen nur Konten offen, deren angegebenes Alter 18 Jahre oder mehr beträgt.",
          "Solche Inhalte dürfen niemals in Avataren, Bannern, Benutzernamen, Serversymbolen, Discover-Einträgen oder öffentlichen Bereichen erscheinen.",
          "Teilen Sie niemals intime Bilder einer Person ohne deren Einwilligung und drohen Sie nicht damit.",
          "Inhalte mit nicht einvernehmlichen Handlungen, sexuellen Handlungen mit Tieren oder realer sexueller Gewalt sind nirgends erlaubt.",
        ),
      },
    ),
    section(
      "self-harm",
      { en: "Self-harm and suicide", ar: "إيذاء النفس والانتحار", de: "Selbstverletzung und Suizid" },
      {
        en: para(
          "Do not encourage, promote or give instructions for suicide, self-harm or eating disorders. Do not mock people who are struggling.",
          "Talking about your own feelings and asking for help is allowed and welcome. If someone is in immediate danger, contact local emergency services first, then report it to us so we can help.",
        ),
        ar: para(
          "لا تشجّع على الانتحار أو إيذاء النفس أو اضطرابات الأكل، ولا تروّج لها، ولا تقدّم إرشادات بشأنها. ولا تسخر ممّن يمرّون بأوقات صعبة.",
          "الحديث عن مشاعرك وطلب المساعدة مسموح ومرحّب به. وإذا كان شخص في خطر مباشر، فاتصل أولًا بخدمات الطوارئ المحلية، ثم أبلغنا لنتمكّن من المساعدة.",
        ),
        de: para(
          "Ermutigen Sie nicht zu Suizid, Selbstverletzung oder Essstörungen, werben Sie nicht dafür und geben Sie keine Anleitungen dazu. Machen Sie sich nicht über Menschen lustig, denen es schlecht geht.",
          "Über die eigenen Gefühle zu sprechen und um Hilfe zu bitten ist erlaubt und willkommen. Ist jemand in unmittelbarer Gefahr, wenden Sie sich zuerst an den örtlichen Notruf und melden Sie es danach uns, damit wir helfen können.",
        ),
      },
    ),
    section(
      "illegal",
      { en: "Illegal content and goods", ar: "المحتوى والسلع غير القانونية", de: "Rechtswidrige Inhalte und Waren" },
      {
        en: "Do not share content that is illegal, or use Zrzur to buy, sell or arrange illegal goods and services — such as drugs, weapons, stolen data, forged documents, or hacking services. Do not share instructions meant to help someone seriously hurt people.",
        ar: "لا تشارك محتوى غير قانوني، ولا تستخدم زرزور لشراء سلع أو خدمات غير قانونية أو بيعها أو الترتيب لها — كالمخدّرات أو الأسلحة أو البيانات المسروقة أو الوثائق المزوّرة أو خدمات الاختراق. ولا تشارك تعليمات هدفها مساعدة أحد على إلحاق أذى جسيم بالناس.",
        de: "Teilen Sie keine rechtswidrigen Inhalte und nutzen Sie Zrzur nicht, um rechtswidrige Waren und Dienstleistungen zu kaufen, zu verkaufen oder zu vermitteln – etwa Drogen, Waffen, gestohlene Daten, gefälschte Dokumente oder Hacking-Dienste. Teilen Sie keine Anleitungen, die jemandem helfen sollen, Menschen schwer zu verletzen.",
      },
    ),
    section(
      "spam-scams",
      { en: "No spam, scams or manipulation", ar: "لا للرسائل المزعجة والاحتيال والتلاعب", de: "Kein Spam, kein Betrug, keine Manipulation" },
      {
        en: list(
          "Do not send unwanted bulk messages, mass friend requests or mass invites.",
          "Do not run scams, phishing links, fake giveaways or fake \"free Feather\" offers.",
          "Do not buy, sell or trade accounts, Servers, invites or Wings.",
          "Do not use automation to fake members, reactions, views or activity.",
          "Do not create new accounts to get around a ban or block.",
        ),
        ar: list(
          "لا ترسل رسائل جماعية غير مرغوب فيها، ولا طلبات صداقة أو دعوات بالجملة.",
          "لا تمارس الاحتيال، ولا تنشر روابط التصيّد، ولا السحوبات الوهمية، ولا عروض «ريشة مجانية» الكاذبة.",
          "لا تشترِ الحسابات أو السيرفرات أو الدعوات أو «الأجنحة» ولا تبعها ولا تتاجر بها.",
          "لا تستخدم الأتمتة لتزييف الأعضاء أو التفاعلات أو المشاهدات أو النشاط.",
          "لا تنشئ حسابات جديدة للتحايل على حظر أو حجب.",
        ),
        de: list(
          "Senden Sie keine unerwünschten Massennachrichten, massenhaften Freundschaftsanfragen oder Masseneinladungen.",
          "Betreiben Sie keinen Betrug, kein Phishing, keine gefälschten Gewinnspiele und keine gefälschten Angebote für „kostenloses Feather“.",
          "Kaufen, verkaufen oder tauschen Sie keine Konten, Server, Einladungen oder Flügel.",
          "Nutzen Sie keine Automatisierung, um Mitglieder, Reaktionen, Aufrufe oder Aktivität vorzutäuschen.",
          "Erstellen Sie keine neuen Konten, um eine Sperre oder Blockierung zu umgehen.",
        ),
      },
    ),
    section(
      "impersonation",
      { en: "No impersonation", ar: "لا لانتحال الشخصية", de: "Kein Identitätsmissbrauch" },
      {
        en: "Do not pretend to be another person, a brand, an organisation, a Server's staff, or Zrzur staff. Zrzur staff will never ask for your password or login codes. Parody and fan accounts are allowed only if they clearly say so.",
        ar: "لا تنتحل صفة شخص آخر أو علامة تجارية أو جهة أو فريق إدارة سيرفر أو فريق زرزور. ولن يطلب منك فريق زرزور أبدًا كلمة مرورك أو رموز دخولك. ويُسمح بحسابات المحاكاة الساخرة والمعجبين فقط إذا أوضحت ذلك بجلاء.",
        de: "Geben Sie sich nicht als eine andere Person, eine Marke, eine Organisation, das Team eines Servers oder Mitarbeitende von Zrzur aus. Mitarbeitende von Zrzur werden Sie niemals nach Ihrem Passwort oder Ihren Anmeldecodes fragen. Parodie- und Fan-Konten sind nur erlaubt, wenn sie sich deutlich als solche kennzeichnen.",
      },
    ),
    section(
      "privacy",
      { en: "Respect privacy — no doxxing", ar: "احترم الخصوصية — لا لكشف المعلومات الشخصية", de: "Privatsphäre achten – kein Doxing" },
      {
        en: "Do not share someone's private information without their permission — such as their home address, phone number, ID documents, private photos, location, or private messages meant to expose them. Do not threaten to do so. Do not record voice calls without the consent of everyone in the call where the law requires it.",
        ar: "لا تشارك معلومات شخص الخاصة دون إذنه — مثل عنوان منزله أو رقم هاتفه أو وثائق هويته أو صوره الخاصة أو موقعه أو رسائله الخاصة بقصد فضحه. ولا تهدّد بذلك. ولا تسجّل المكالمات الصوتية دون موافقة جميع المشاركين حيث يشترط القانون ذلك.",
        de: "Teilen Sie keine privaten Informationen über andere ohne deren Erlaubnis – etwa ihre Wohnanschrift, Telefonnummer, Ausweisdokumente, privaten Fotos, ihren Standort oder private Nachrichten, um sie bloßzustellen. Drohen Sie nicht damit. Zeichnen Sie Sprachanrufe nicht ohne die Einwilligung aller Teilnehmenden auf, wo das Gesetz dies verlangt.",
      },
    ),
    section(
      "ip",
      { en: "Respect other people's work", ar: "احترم أعمال الآخرين", de: "Die Werke anderer achten" },
      {
        en: "Share only what you have the right to share. Do not post pirated software, films, music, books or game copies, or use other people's art, logos or trademarks as your own. Rights holders can send us a notice as described in the Enforcement and Appeals policy.",
        ar: "شارك فقط ما يحق لك مشاركته. لا تنشر البرامج أو الأفلام أو الموسيقى أو الكتب أو نسخ الألعاب المقرصنة، ولا تنسب لنفسك رسومات الآخرين أو شعاراتهم أو علاماتهم التجارية. ويمكن لأصحاب الحقوق إرسال إشعار إلينا كما توضّح سياسة الإنفاذ والاعتراض.",
        de: "Teilen Sie nur, wozu Sie berechtigt sind. Veröffentlichen Sie keine raubkopierte Software, Filme, Musik, Bücher oder Spielkopien und geben Sie Kunstwerke, Logos oder Marken anderer nicht als Ihre eigenen aus. Rechteinhaber können uns eine Meldung senden, wie in der Richtlinie zu Durchsetzung und Einspruch beschrieben.",
      },
    ),
    section(
      "platform",
      { en: "Keep Zrzur working", ar: "حافظ على سلامة زرزور", de: "Zrzur funktionsfähig halten" },
      {
        en: "Do not spread malware, try to break into accounts or systems, abuse bugs, or overload the Service. If you find a security problem, report it privately to support@zrzur.com.",
        ar: "لا تنشر البرمجيات الضارّة، ولا تحاول اختراق الحسابات أو الأنظمة، ولا تستغل الأخطاء البرمجية، ولا تُثقل الخدمة. وإذا وجدت مشكلة أمنية، فأبلغ عنها بسرية إلى support@zrzur.com.",
        de: "Verbreiten Sie keine Schadsoftware, versuchen Sie nicht, in Konten oder Systeme einzudringen, nutzen Sie keine Fehler aus und überlasten Sie den Dienst nicht. Wenn Sie ein Sicherheitsproblem finden, melden Sie es vertraulich an support@zrzur.com.",
      },
    ),
    section(
      "enforcement",
      { en: "What happens if rules are broken", ar: "ماذا يحدث عند مخالفة القواعد", de: "Was bei Regelverstößen geschieht" },
      {
        en: para(
          "We look at what happened, how serious it was, and whether it happened before. Usually we go step by step:",
          list(
            "a warning and removal of the content;",
            "a temporary limit — for example, no messages or no joining Servers for a while;",
            "a temporary suspension of the account or Server;",
            "a permanent ban.",
          ),
          "Serious harm — such as child sexual abuse material, credible threats, terrorism or large-scale scams — can lead straight to a permanent ban and a report to the authorities. Every action comes with a statement of reasons, and you can appeal. See the Enforcement and Appeals policy for details.",
        ),
        ar: para(
          "ننظر فيما حدث، ومدى خطورته، وهل تكرّر من قبل. وعادةً نتدرّج على النحو الآتي:",
          list(
            "إنذار وإزالة المحتوى؛",
            "تقييد مؤقت — كمنع إرسال الرسائل أو الانضمام إلى السيرفرات مدةً معيّنة؛",
            "إيقاف مؤقت للحساب أو السيرفر؛",
            "حظر دائم.",
          ),
          "الأذى الجسيم — مثل مواد الاعتداء الجنسي على الأطفال، أو التهديدات الجدية، أو الإرهاب، أو الاحتيال الواسع — قد يؤدي مباشرةً إلى حظر دائم وإبلاغ السلطات. ويرافق كل إجراء بيانٌ بالأسباب، ويحق لك الاعتراض. راجع سياسة الإنفاذ والاعتراض لمزيد من التفاصيل.",
        ),
        de: para(
          "Wir prüfen, was geschehen ist, wie schwer es wiegt und ob es schon früher vorgekommen ist. In der Regel gehen wir schrittweise vor:",
          list(
            "eine Verwarnung und die Entfernung der Inhalte;",
            "eine vorübergehende Einschränkung – zum Beispiel für eine gewisse Zeit keine Nachrichten senden oder keinen Servern beitreten;",
            "eine vorübergehende Sperrung des Kontos oder Servers;",
            "eine dauerhafte Sperre.",
          ),
          "Schwerer Schaden – etwa Darstellungen sexuellen Kindesmissbrauchs, ernsthafte Drohungen, Terrorismus oder Betrug in großem Umfang – kann unmittelbar zu einer dauerhaften Sperre und einer Meldung an die Behörden führen. Jede Maßnahme wird begründet, und Sie können Einspruch einlegen. Einzelheiten finden Sie in der Richtlinie zu Durchsetzung und Einspruch.",
        ),
      },
    ),
    section(
      "report",
      { en: "How to report", ar: "كيف تُبلغ", de: "So melden Sie etwas" },
      {
        en: list(
          "In the app: open the menu on a message, user, Server or bot and choose Report. This is the fastest way.",
          "By email: support@zrzur.com — include a message link and a short explanation.",
          "Security problems: security@zrzur.com.",
          "If someone is in immediate danger, contact local emergency services first.",
          "You can also block a user at any time; they will not be told.",
        ),
        ar: list(
          "من داخل التطبيق: افتح القائمة على الرسالة أو المستخدم أو السيرفر أو البوت واختر «إبلاغ». وهذه أسرع طريقة.",
          "بالبريد الإلكتروني: support@zrzur.com — مع رابط الرسالة وشرح قصير.",
          "المشكلات الأمنية: security@zrzur.com.",
          "إذا كان شخص في خطر مباشر، فاتصل أولًا بخدمات الطوارئ المحلية.",
          "ويمكنك أيضًا حظر أي مستخدم في أي وقت، ولن يُبلَّغ بذلك.",
        ),
        de: list(
          "In der App: Öffnen Sie das Menü einer Nachricht, eines Nutzers, eines Servers oder eines Bots und wählen Sie „Melden“. Das ist der schnellste Weg.",
          "Per E-Mail: support@zrzur.com – mit einem Link zur Nachricht und einer kurzen Erklärung.",
          "Sicherheitsprobleme: security@zrzur.com.",
          "Ist jemand in unmittelbarer Gefahr, wenden Sie sich zuerst an den örtlichen Notruf.",
          "Sie können einen Nutzer auch jederzeit blockieren; er wird darüber nicht informiert.",
        ),
      },
    ),
  ],
});

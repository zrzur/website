import { doc, list, para, section } from "./shared.ts";

/**
 * What a creator accepts with each effect. The server refuses any other
 * value, so backend and web carry the same one; it changes when these terms
 * change in substance.
 */
export const CREATOR_TERMS_VERSION = "2026-11-07";

const terms = doc({
  slug: "creator-terms",
  group: "builders",
  title: { en: "Creator Terms", ar: "شروط المبدعين",
    de: "Bedingungen für Creator" },
  intro: {
    en: "The rules for publishing community items — avatar decorations, effects, nameplates and themes — and for the Zrzur Creator Program.",
    ar: "قواعد نشر عناصر المجتمع — زينة الصورة، والمؤثرات، ولوحات الأسماء، والسمات — وقواعد برنامج المبدعين في زرزور.",
    de: "Die Regeln für die Veröffentlichung von Community-Elementen – Avatar-Rahmen, Effekte, Namensschilder und Themes – und für das Zrzur-Creator-Programm.",
  },
  sections: [
    section(
      "scope",
      { en: "What these terms cover", ar: "ما تشمله هذه الشروط", de: "Was diese Bedingungen umfassen" },
      {
        en: "These terms apply when you submit a community item to Zrzur or take part in the Creator Program. They add to the Terms of Service and the Community Guidelines. You must accept them in the app before your first submission. Creator access is for adults: you must have declared an age of 18 or over, otherwise you cannot get access or publish.",
        ar: "تسري هذه الشروط عندما تقدّم عنصرًا من عناصر المجتمع إلى زرزور أو تشارك في برنامج المبدعين. وهي إضافة إلى شروط الخدمة وإرشادات المجتمع، ويجب أن تقبلها داخل التطبيق قبل تقديمك الأول. وصفة المبدع للبالغين فقط: يجب أن تكون قد صرّحت بأن عمرك ١٨ عامًا أو أكثر، وإلا فلا يمكنك الحصول عليها ولا النشر.",
        de: "Diese Bedingungen gelten, wenn du ein Community-Element bei Zrzur einreichst oder am Creator-Programm teilnimmst. Sie ergänzen die Nutzungsbedingungen und die Community-Richtlinien. Du musst sie in der App annehmen, bevor du zum ersten Mal etwas einreichst. Der Creator-Zugang ist Erwachsenen vorbehalten: Du musst ein Alter von mindestens 18 Jahren angegeben haben, sonst kannst du keinen Zugang erhalten und nichts veröffentlichen.",
      },
    ),
    section(
      "originality",
      { en: "Only original work", ar: "الأعمال الأصلية فقط", de: "Nur eigene Werke" },
      {
        en: para(
          "Submit only work you made yourself, or that you have a clear licence to use and share in this way.",
          list(
            "Do not copy art, icons, sounds, fonts or designs from other apps or platforms — this explicitly includes Discord and its artwork — or from games, films or other creators.",
            "Do not use trademarks, logos, brand names or famous characters without permission from the owner.",
            "Do not use pictures of real people without their consent.",
            "If you use third-party parts with an open licence (for example a font), name the source and the licence in your submission.",
            "AI-generated parts are allowed only if you have the right to use them, you say so in your submission, and they do not copy a recognisable existing work or style of a living artist on request.",
          ),
        ),
        ar: para(
          "قدّم فقط الأعمال التي صنعتها بنفسك، أو التي تملك ترخيصًا واضحًا لاستخدامها ومشاركتها بهذه الطريقة.",
          list(
            "لا تنسخ الرسومات أو الأيقونات أو الأصوات أو الخطوط أو التصاميم من تطبيقات أو منصّات أخرى — ومن ذلك صراحةً Discord ورسوماته — ولا من الألعاب أو الأفلام أو مبدعين آخرين.",
            "لا تستخدم العلامات التجارية أو الشعارات أو أسماء العلامات أو الشخصيات المشهورة دون إذن مالكها.",
            "لا تستخدم صور أشخاص حقيقيين دون موافقتهم.",
            "إذا استخدمت أجزاءً من أطراف أخرى بترخيص مفتوح (كخط مثلًا)، فاذكر المصدر والترخيص في تقديمك.",
            "يُسمح بالأجزاء المولّدة بالذكاء الاصطناعي فقط إذا كان يحق لك استخدامها، وصرّحت بذلك في تقديمك، ولم تكن نسخًا لعمل قائم معروف أو تقليدًا مقصودًا لأسلوب فنان على قيد الحياة.",
          ),
        ),
        de: para(
          "Reiche nur Werke ein, die du selbst geschaffen hast oder für die du eine klare Lizenz hast, sie auf diese Weise zu nutzen und zu teilen.",
          list(
            "Kopiere keine Grafiken, Symbole, Töne, Schriften oder Designs aus anderen Apps oder Plattformen – ausdrücklich auch nicht von Discord und dessen Grafiken – oder aus Spielen, Filmen oder von anderen Creators.",
            "Verwende Marken, Logos, Markennamen oder bekannte Figuren nur mit Erlaubnis der Inhaber.",
            "Verwende Bilder echter Menschen nur mit deren Einwilligung.",
            "Wenn du Teile Dritter mit offener Lizenz verwendest (zum Beispiel eine Schrift), nenne in deiner Einreichung die Quelle und die Lizenz.",
            "KI-generierte Teile sind nur erlaubt, wenn du sie nutzen darfst, sie in deiner Einreichung angibst und sie weder ein erkennbares bestehendes Werk kopieren noch auf Anweisung den Stil lebender Künstlerinnen oder Künstler nachahmen.",
          ),
        ),
      },
    ),
    section(
      "content",
      { en: "Content rules", ar: "قواعد المحتوى", de: "Inhaltsregeln" },
      {
        en: "Community items are visible to everyone, so they must be suitable for everyone who uses Zrzur, including people aged 16 and 17. No sexual content, gore, hate symbols, political propaganda, scams, hidden messages or anything else that breaks the Community Guidelines. Items must not imitate Zrzur badges, staff marks, verification marks or safety labels.",
        ar: "عناصر المجتمع ظاهرة للجميع، لذا يجب أن تناسب كل من يستخدم زرزور، ومنهم من تبلغ أعمارهم ١٦ أو ١٧ عامًا. فلا محتوى جنسيًا، ولا مشاهد دموية، ولا رموز كراهية، ولا دعاية سياسية، ولا احتيال، ولا رسائل مخفية، ولا أي شيء يخالف إرشادات المجتمع. ولا يجوز أن تقلّد العناصرُ شاراتِ زرزور أو علامات فريقه أو علامات التوثيق أو وسوم السلامة.",
        de: "Community-Elemente sind für alle sichtbar und müssen daher für alle geeignet sein, die Zrzur nutzen, auch für Personen von 16 und 17 Jahren. Keine sexuellen Inhalte, keine Gewaltdarstellungen, keine Hasssymbole, keine politische Propaganda, kein Betrug, keine versteckten Botschaften und nichts anderes, das gegen die Community-Richtlinien verstößt. Elemente dürfen keine Zrzur-Abzeichen, Team-Kennzeichen, Verifizierungszeichen oder Sicherheitshinweise nachahmen.",
      },
    ),
    section(
      "animated",
      { en: "Animated items", ar: "العناصر المتحركة", de: "Animierte Elemente" },
      {
        en: list(
          "No item may flash or strobe.",
          "An effect that flashes more than three times in a second, or that fails our automatic check, is refused.",
          "Effects play once, for up to 4 seconds. Files set to repeat are refused.",
          "Effects have no sound and a transparent background, and the profile under them must stay readable.",
          "Effects must not show real people, even with their consent.",
          "With each effect you confirm that you made it or hold the rights to it, and you name any third-party or AI parts. We store this with the item.",
          "You can upload a decoration, nameplate or effect as a WebM file. We convert it to an animated image and remove any audio. We do not store the WebM, and the checks run on the image.",
        ),
        ar: list(
          "يُمنع الوميض والتذبذب الضوئي في جميع العناصر.",
          "يُرفض المؤثر الذي يومض أكثر من ثلاث مرات في الثانية، أو الذي لا يجتاز فحصنا الآلي.",
          "تُعرض المؤثرات مرة واحدة، لمدة تصل إلى ٤ ثوانٍ. وتُرفض الملفات المضبوطة على التكرار.",
          "لا صوت في المؤثرات، وخلفيتها شفافة، ويجب أن يبقى الملف الشخصي تحتها مقروءًا.",
          "يُمنع ظهور أشخاص حقيقيين في المؤثرات، ولو بموافقتهم.",
          "مع كل مؤثر تؤكد أنك صنعته أو أنك تملك حقوقه، وتذكر أي أجزاء من أطراف أخرى أو مولّدة بالذكاء الاصطناعي، ونحفظ ذلك مع العنصر.",
          "يمكنك رفع زينة أو لوحة اسم أو مؤثر بصيغة WebM، فنحوّله إلى صورة متحركة ونزيل منه الصوت. ولا نحتفظ بملف WebM، وتجري الفحوص على الصورة الناتجة.",
        ),
        de: list(
          "Kein Element darf blitzen oder stroboskopartig flackern.",
          "Ein Effekt, der mehr als dreimal pro Sekunde blitzt oder unsere automatische Prüfung nicht besteht, wird abgelehnt.",
          "Effekte laufen einmal ab, höchstens 4 Sekunden lang. Dateien, die auf Wiederholung eingestellt sind, werden abgelehnt.",
          "Effekte haben keinen Ton und einen transparenten Hintergrund, und das Profil darunter muss lesbar bleiben.",
          "Effekte dürfen keine echten Menschen zeigen, auch nicht mit deren Einwilligung.",
          "Mit jedem Effekt bestätigst du, dass du ihn geschaffen hast oder die Rechte daran hältst, und du nennst alle Teile Dritter und alle KI-Teile. Wir speichern diese Angaben mit dem Element.",
          "Du kannst einen Avatar-Rahmen, ein Namensschild oder einen Effekt als WebM-Datei hochladen. Wir wandeln sie in ein animiertes Bild um und entfernen jeden Ton. Die WebM-Datei speichern wir nicht, und die Prüfungen laufen auf dem Bild.",
        ),
      },
    ),
    section(
      "licence",
      { en: "You keep ownership; we get a licence", ar: "تحتفظ بالملكية ونحصل على ترخيص", de: "Du bleibst Inhaber, wir erhalten eine Lizenz" },
      {
        en: para(
          "You keep the copyright in your work. By submitting an item, you give Zrzur a worldwide, non-exclusive, royalty-free licence to host, copy, display and distribute it in the Zrzur apps and website, to adapt it technically (for example resizing, compressing or converting formats) and to show it in Zrzur's own promotion of the item or the Creator Program, with your creator name where possible.",
          "Users who obtain your item may use it on Zrzur for as long as it is available to them.",
          "You can withdraw your item at any time. It then leaves Designs and everyone using it at once. We keep the file with your account, so you can publish it again, until you delete the item or your account is erased; copies may stay in backups for up to 30 days.",
          "If your account is erased, all your items are deleted with it, including published ones, and they leave everyone using them.",
        ),
        ar: para(
          "تحتفظ بحقوق النشر في عملك. وبتقديمك عنصرًا، تمنح زرزور ترخيصًا عالميًا وغير حصري ودون مقابل لاستضافته ونسخه وعرضه وتوزيعه في تطبيقات زرزور وموقعه، وتكييفه تقنيًا (مثل تغيير الحجم أو الضغط أو تحويل الصيغة)، وعرضه في ترويج زرزور للعنصر أو لبرنامج المبدعين، مع ذكر اسمك كمبدع حيثما أمكن.",
          "يجوز للمستخدمين الذين يحصلون على عنصرك استخدامه في زرزور ما دام متاحًا لهم.",
          "يمكنك سحب عنصرك في أي وقت، فيختفي فورًا من التصاميم وممن يستخدمونه. ونحتفظ بالملف مع حسابك لتتمكّن من نشره مجددًا، إلى أن تحذف العنصر أو يُمحى حسابك؛ وقد تبقى نسخ منه في النسخ الاحتياطية مدة تصل إلى ٣٠ يومًا.",
          "عند محو حسابك تُحذف معه جميع عناصرك، ومنها المنشورة، وتُزال ممن يستخدمونها.",
        ),
        de: para(
          "Das Urheberrecht an deinem Werk bleibt bei dir. Mit dem Einreichen eines Elements räumst du Zrzur eine weltweite, nicht ausschließliche, unentgeltliche Lizenz ein, es in den Zrzur-Apps und auf der Website zu hosten, zu vervielfältigen, anzuzeigen und zu verbreiten, es technisch anzupassen (zum Beispiel Größe ändern, komprimieren oder Formate umwandeln) und es in der eigenen Werbung von Zrzur für das Element oder das Creator-Programm zu zeigen, wenn möglich mit deinem Creator-Namen.",
          "Nutzer, die dein Element erhalten, dürfen es auf Zrzur nutzen, solange es ihnen zur Verfügung steht.",
          "Du kannst dein Element jederzeit zurückziehen. Es verschwindet dann sofort aus Designs und bei allen, die es nutzen. Die Datei bewahren wir mit deinem Konto auf, damit du es wieder veröffentlichen kannst, bis du das Element löschst oder dein Konto gelöscht wird; Kopien können bis zu 30 Tage in Sicherungen bleiben.",
          "Wenn dein Konto gelöscht wird, werden alle deine Elemente mit ihm gelöscht, auch veröffentlichte, und sie verschwinden bei allen, die sie nutzen.",
        ),
      },
    ),
    section(
      "review",
      { en: "Review", ar: "المراجعة", de: "Prüfung" },
      {
        en: para(
          "Avatar decorations and nameplates go live after automatic checks of the file (type, size, frames and length). Reviewers can look at them at any time and may take them down.",
          "Effects go through the same checks and those in Animated items, and a reviewer must approve each one before it is published.",
          "We may ask for changes or refuse an item, and we tell you why. An item reported by several people may leave Designs until a reviewer looks at it. Approval does not mean we have checked every right in the work — you remain responsible for it.",
        ),
        ar: para(
          "تُنشر زينة الصورة ولوحات الأسماء بعد الفحوص الآلية للملف (النوع والحجم وعدد الإطارات والمدة). ويجوز للمراجعين الاطلاع عليها في أي وقت وإزالتها.",
          "أما المؤثرات فتخضع لهذه الفحوص وللفحوص الواردة في قسم «العناصر المتحركة»، ويجب أن يوافق عليها مراجع قبل نشرها.",
          "وقد نطلب تعديلات أو نرفض العنصر، ونخبرك بالسبب. وقد يختفي العنصر الذي يبلّغ عنه عدة أشخاص من التصاميم إلى أن ينظر فيه مراجع. ولا تعني الموافقة أننا تحقّقنا من كل الحقوق في العمل، فأنت تبقى مسؤولًا عنه.",
        ),
        de: para(
          "Avatar-Rahmen und Namensschilder gehen nach automatischen Prüfungen der Datei (Typ, Größe, Frames und Länge) online. Prüferinnen und Prüfer können sie jederzeit ansehen und entfernen.",
          "Effekte durchlaufen dieselben Prüfungen und die aus dem Abschnitt Animierte Elemente, und jeder Effekt muss vor der Veröffentlichung von einer prüfenden Person freigegeben werden.",
          "Wir können Änderungen verlangen oder ein Element ablehnen und sagen dir, warum. Ein Element, das von mehreren Personen gemeldet wird, kann aus Designs verschwinden, bis es geprüft wurde. Eine Freigabe bedeutet nicht, dass wir alle Rechte am Werk geprüft haben – du bleibst dafür verantwortlich.",
        ),
      },
    ),
    section(
      "removal",
      { en: "Removal", ar: "الإزالة", de: "Entfernung" },
      {
        en: para(
          "We may remove an item at any time if it breaks these terms, receives a valid rights complaint, or puts users at risk. A removed item leaves Designs and everyone using it at once, and the people using it are told.",
          "If a removal is reversed, the item returns to Designs and people can choose it again. It does not go back to them by itself.",
          "You can appeal as described in the Enforcement and Appeals policy.",
        ),
        ar: para(
          "يجوز لنا إزالة عنصر في أي وقت إذا خالف هذه الشروط، أو تلقّى شكوى صحيحة تتعلّق بالحقوق، أو عرّض المستخدمين للخطر. ويختفي العنصر المُزال فورًا من التصاميم وممن يستخدمونه، ونُعلمهم بذلك.",
          "إذا أُلغي قرار الإزالة، يعود العنصر إلى التصاميم ويمكن للناس اختياره من جديد، لكنه لا يعود إليهم تلقائيًا.",
          "ويحق لك الاعتراض كما توضّح سياسة الإنفاذ والاعتراض.",
        ),
        de: para(
          "Wir können ein Element jederzeit entfernen, wenn es gegen diese Bedingungen verstößt, eine berechtigte Rechtebeschwerde dazu eingeht oder es Nutzer gefährdet. Ein entferntes Element verschwindet sofort aus Designs und bei allen, die es nutzen, und diese Personen werden informiert.",
          "Wird eine Entfernung aufgehoben, kehrt das Element in Designs zurück und kann wieder gewählt werden. Bei den Personen, die es genutzt haben, erscheint es nicht von selbst wieder.",
          "Du kannst Einspruch einlegen, wie es die Richtlinie Durchsetzung und Einspruch beschreibt.",
        ),
      },
    ),
    section(
      "repeat",
      { en: "Repeated breaches", ar: "المخالفات المتكررة", de: "Wiederholte Verstöße" },
      {
        en: para(
          "If you repeatedly infringe other people's rights or break these terms, we suspend or revoke your creator access. We look at valid rights complaints and items we removed, and at how serious and how recent they are.",
          list(
            "While suspended, you can see your designs, download a copy, read the reason and appeal, but you cannot publish or edit. Your designs are hidden from the public and leave everyone using them.",
            "Once revoked, you can no longer submit items. Items you already published stay unless we remove them.",
            "Serious or repeated breaches can also lead to action on your account, as described in the Enforcement and Appeals policy.",
          ),
        ),
        ar: para(
          "إذا انتهكت حقوق غيرك أو خالفت هذه الشروط مرارًا، نعلّق صفة المبدع لديك أو نسحبها. وننظر في الشكاوى الصحيحة المتعلّقة بالحقوق والعناصر التي أزلناها، وفي مدى خطورتها وحداثتها.",
          list(
            "في أثناء التعليق، يمكنك رؤية تصاميمك وتنزيل نسخة منها والاطلاع على السبب والاعتراض، لكن لا يمكنك النشر أو التعديل. وتُخفى تصاميمك عن الجمهور وتُزال ممن يستخدمونها.",
            "بعد السحب، لا يمكنك تقديم عناصر جديدة، وتبقى عناصرك المنشورة ما لم نُزلها.",
            "وقد تؤدي المخالفات الجسيمة أو المتكررة أيضًا إلى إجراء بحق حسابك، كما توضّح سياسة الإنفاذ والاعتراض.",
          ),
        ),
        de: para(
          "Wenn du wiederholt die Rechte anderer verletzt oder gegen diese Bedingungen verstößt, sperren wir deinen Creator-Zugang vorübergehend oder entziehen ihn. Wir berücksichtigen berechtigte Rechtebeschwerden und von uns entfernte Elemente sowie deren Schwere und Aktualität.",
          list(
            "Während der Sperre kannst du deine Designs sehen, eine Kopie herunterladen, den Grund lesen und Einspruch einlegen, aber nichts veröffentlichen oder bearbeiten. Deine Designs sind für die Öffentlichkeit verborgen und verschwinden bei allen, die sie nutzen.",
            "Nach dem Entzug kannst du keine Elemente mehr einreichen. Bereits veröffentlichte Elemente bleiben, sofern wir sie nicht entfernen.",
            "Schwere oder wiederholte Verstöße können auch zu Maßnahmen gegen dein Konto führen, wie es die Richtlinie Durchsetzung und Einspruch beschreibt.",
          ),
        ),
      },
    ),
    section(
      "public",
      { en: "Public pages and your name", ar: "الصفحات العامة واسمك", de: "Öffentliche Seiten und dein Name" },
      {
        en: para(
          "Every published item, including profile effects, gets a public page on Designs that anyone can open without an account and that search engines may list. The page shows the item's picture, name and description.",
          list(
            "People signed in to Zrzur see your display name and avatar with your items, or your username if you have no display name. Your username#tag never shows.",
            "Visitors without an account see your name and avatar, and anyone can see a page of all your work, only if you turn on \"Show my name on the public Designs site\" in Settings › Profile. It is off by default.",
            "While you are an active creator, the Their creations and Wearing sections show on your profile even with this setting off, so people who open your profile can see that you are a creator.",
          ),
        ),
        ar: para(
          "يحصل كل عنصر منشور، ومنه مؤثرات الملف الشخصي، على صفحة عامة في التصاميم يستطيع أي شخص فتحها دون حساب، وقد تُدرجها محركات البحث. وتعرض الصفحة صورة العنصر واسمه ووصفه.",
          list(
            "يرى مستخدمو زرزور المسجّلون اسمك الظاهر وصورتك مع عناصرك، أو اسم المستخدم إن لم يكن لك اسم ظاهر. ولا يظهر username#tag أبدًا.",
            "لا يرى الزوار دون حساب اسمك وصورتك، ولا يرى أحد صفحة تجمع كل أعمالك، إلا إذا فعّلت خيار «أظهِر اسمي في موقع التصاميم العام» في الإعدادات › الملف الشخصي. وهذا الخيار معطّل افتراضيًا.",
            "ما دمت مبدعًا نشطًا، يظهر في ملفك الشخصي قسما «إبداعاته» و«تستخدمه» حتى لو كان هذا الخيار معطّلًا، فيعرف من يفتح ملفك أنك مبدع.",
          ),
        ),
        de: para(
          "Jedes veröffentlichte Element, auch Profileffekte, erhält eine öffentliche Seite auf Designs, die alle ohne Konto öffnen können und die Suchmaschinen aufführen dürfen. Die Seite zeigt Bild, Namen und Beschreibung des Elements.",
          list(
            "Bei Zrzur angemeldete Personen sehen bei deinen Elementen deinen Anzeigenamen und dein Avatarbild, oder deinen Benutzernamen, wenn du keinen Anzeigenamen hast. Dein username#tag wird nie angezeigt.",
            "Besucher ohne Konto sehen deinen Namen und dein Avatarbild, und alle sehen eine Seite mit all deinen Werken, nur wenn du unter Einstellungen › Profil die Option \"Meinen Namen auf der öffentlichen Designs-Seite zeigen\" einschaltest. Sie ist standardmäßig aus.",
            "Solange du aktiver Creator bist, erscheinen die Bereiche Kreationen und Getragen auch bei ausgeschalteter Option auf deinem Profil, sodass Personen, die dein Profil öffnen, sehen können, dass du Creator bist.",
          ),
        ),
      },
    ),
    section(
      "program",
      { en: "Creator Program rewards", ar: "مكافآت برنامج المبدعين", de: "Prämien im Creator-Programm" },
      {
        en: "There are no Creator Program rewards yet. Before any start, we will add their rules to these terms and tell you. Taking part is voluntary and does not make you an employee, contractor or partner of Zrzur.",
        ar: "لا توجد مكافآت لبرنامج المبدعين حتى الآن. وقبل أن تبدأ أي مكافأة، سنضيف قواعدها إلى هذه الشروط ونخبرك. والمشاركة طوعية، ولا تجعلك موظفًا لدى زرزور أو متعاقدًا معه أو شريكًا له.",
        de: "Prämien im Creator-Programm gibt es noch nicht. Bevor welche starten, nehmen wir ihre Regeln in diese Bedingungen auf und informieren dich. Die Teilnahme ist freiwillig und macht dich nicht zu Angestellten, Auftragnehmern oder Partnern von Zrzur.",
      },
    ),
    section(
      "fraud",
      { en: "No fraud", ar: "لا للاحتيال", de: "Kein Betrug" },
      {
        en: para(
          list(
            "Do not fake views, uses, likes or downloads, whether with bots, scripts, groups that trade activity, or extra accounts.",
            "Do not buy, sell or borrow accounts to submit items or collect rewards.",
            "Do not submit the same item many times, or slightly changed copies, to get more rewards.",
            "Do not pay or pressure people to use your items.",
          ),
          "If we find fraud, we may cancel unearned rewards, remove Feather time that came from fraud, remove items, and close the accounts involved.",
        ),
        ar: para(
          list(
            "لا تزيّف المشاهدات أو الاستخدامات أو الإعجابات أو التنزيلات، سواء بالبوتات أو البرامج النصية أو مجموعات تبادل النشاط أو الحسابات الإضافية.",
            "لا تشترِ الحسابات أو تبعها أو تستعرها لتقديم العناصر أو جمع المكافآت.",
            "لا تقدّم العنصر نفسه مرات عديدة، أو نسخًا معدّلة قليلًا منه، للحصول على مكافآت أكثر.",
            "لا تدفع للناس ولا تضغط عليهم لاستخدام عناصرك.",
          ),
          "إذا اكتشفنا احتيالًا، فقد نلغي المكافآت غير المستحقة، ونزيل مدة «ريشة» الناتجة عن الاحتيال، ونزيل العناصر، ونغلق الحسابات المتورّطة.",
        ),
        de: para(
          list(
            "Täusche keine Aufrufe, Nutzungen, Likes oder Downloads vor, weder mit Bots oder Skripten noch mit Gruppen zum Aktivitätstausch oder Zusatzkonten.",
            "Kaufe, verkaufe oder leihe keine Konten, um Elemente einzureichen oder Prämien zu sammeln.",
            "Reiche dasselbe Element nicht mehrfach oder in leicht veränderten Kopien ein, um mehr Prämien zu erhalten.",
            "Bezahle oder bedränge niemanden, damit deine Elemente genutzt werden.",
          ),
          "Wenn wir Betrug feststellen, können wir unverdiente Prämien streichen, durch Betrug erlangte Feather-Zeit entfernen, Elemente entfernen und die beteiligten Konten schließen.",
        ),
      },
    ),
    section(
      "claims",
      { en: "Rights complaints", ar: "شكاوى الحقوق", de: "Rechtebeschwerden" },
      {
        en: "If you think a community item copies your work or uses your trademark, send a notice as described in the Enforcement and Appeals policy. If a complaint about your item is valid, you are responsible for it, and you agree to help us resolve it.",
        ar: "إذا رأيت أن عنصرًا من عناصر المجتمع ينسخ عملك أو يستخدم علامتك التجارية، فأرسل إشعارًا كما توضّح سياسة الإنفاذ والاعتراض. وإذا كانت الشكوى بشأن عنصرك صحيحة، فأنت المسؤول عنها، وتوافق على مساعدتنا في حلّها.",
        de: "Wenn du meinst, dass ein Community-Element dein Werk kopiert oder deine Marke nutzt, sende eine Meldung, wie es die Richtlinie Durchsetzung und Einspruch beschreibt. Ist eine Beschwerde zu deinem Element berechtigt, bist du dafür verantwortlich und sagst zu, uns bei der Lösung zu helfen.",
      },
    ),
  ],
});

export const creatorTerms = {
  ...terms,
  version: CREATOR_TERMS_VERSION,
  lastUpdated: {
    en: "Last updated: 7 November 2026",
    ar: "آخر تحديث: ٧ نوفمبر ٢٠٢٦",
    de: "Stand: 7. November 2026",
  },
};

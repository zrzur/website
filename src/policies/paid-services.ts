import { doc, list, para, revised, section } from "./shared.ts";

export const paidServices = revised(doc({
  slug: "paid-services",
  group: "everyone",
  title: { en: "Paid Services Terms", ar: "شروط الخدمات المدفوعة",
    de: "Bedingungen für kostenpflichtige Dienste" },
  intro: {
    en: "The rules for Feather, Wings, gifts and Discover promotion: prices, renewal, cancellation, your right of withdrawal, and refunds.",
    ar: "قواعد «ريشة» و«أجنحة» والهدايا والترويج في «اكتشف»: الأسعار، والتجديد، والإلغاء، وحقك في الانسحاب، واسترداد المبالغ.",
    de: "Die Regeln für Feather, Flügel, Geschenke und Werbung in Entdecken: Preise, Verlängerung, Kündigung, dein Widerrufsrecht und Erstattungen.",
  },
  sections: [
    section(
      "status",
      { en: "Payments are not open yet", ar: "الدفع غير مفتوح بعد", de: "Zahlungen sind noch nicht geöffnet" },
      {
        en: para(
          "Zrzur is free to use and nothing can be bought yet. The rest of this page describes how paid services will work once payments open; we will update it and tell you before the first sale.",
          "Purchases are open only to people who declared an age of 18 or over.",
        ),
        ar: para(
          "استخدام زرزور مجاني ولا يمكن شراء أي شيء حاليًا. ويصف باقي هذه الصفحة كيف ستعمل الخدمات المدفوعة حين يُفتح الدفع؛ وسنحدّثها ونخبرك قبل أول عملية بيع.",
          "الشراء متاح فقط لمن صرّح بأن عمره ١٨ عامًا فأكثر.",
        ),
        de: para(
          "Zrzur ist kostenlos nutzbar, und es kann noch nichts gekauft werden. Der Rest dieser Seite beschreibt, wie kostenpflichtige Dienste funktionieren werden, sobald Zahlungen geöffnet sind; wir aktualisieren ihn und informieren dich vor dem ersten Verkauf.",
          "Kaufen können nur Personen, die ein Alter von mindestens 18 Jahren angegeben haben.",
        ),
      },
    ),
    section(
      "what",
      { en: "What you can buy", ar: "ما الذي يمكنك شراؤه", de: "Was du kaufen kannst" },
      {
        en: para(
          "Zrzur is free. Paid services are optional extras:",
          list(
            "Feather — a member subscription that adds personal perks: longer messages, larger uploads, sharper screen sharing, one free Wing, a Feather badge you can hide, and faster review of what you send to Discover.",
            "Wings — boosts you give to a Server to unlock Server perks for everyone in it.",
            "Discover promotion — paid placement for a Server or bot in Discover: Promoted, Spotlight, Headline and Top row.",
            "Gifts — Feather time you buy for someone else.",
          ),
          "The current perks of each product are listed in the app before you buy. These terms are part of the Terms of Service.",
        ),
        ar: para(
          "زرزور مجاني. والخدمات المدفوعة إضافات اختيارية:",
          list(
            "«ريشة» — اشتراك للأعضاء يضيف مزايا شخصية: رسائل أطول، وملفات أكبر حجمًا عند الرفع، ومشاركة شاشة أوضح، وجناح واحد مجاني، وشارة «ريشة» يمكنك إخفاؤها، ومراجعة أسرع لما ترسله إلى «اكتشف».",
            "«أجنحة» — تعزيزات تمنحها لسيرفر لتفتح مزايا السيرفر لجميع أعضائه.",
            "الترويج في «اكتشف» — ظهور مدفوع لسيرفر أو بوت في «اكتشف»: مُروَّج، وتحت الأضواء، وفي الصدارة، والصف الأول.",
            "الهدايا — مدة «ريشة» تشتريها لشخص آخر.",
          ),
          "تُعرض المزايا الحالية لكل منتج داخل التطبيق قبل الشراء. وهذه الشروط جزء من شروط الخدمة.",
        ),
        de: para(
          "Zrzur ist kostenlos. Kostenpflichtige Dienste sind optionale Extras:",
          list(
            "Feather – ein Mitgliedsabo mit persönlichen Vorteilen: längere Nachrichten, größere Uploads, schärfere Bildschirmfreigabe, ein kostenloser Flügel, ein Feather-Abzeichen, das du ausblenden kannst, und eine schnellere Prüfung dessen, was du bei Entdecken einreichst.",
            "Flügel – Boosts, die du einem Server gibst, um Server-Vorteile für alle darin freizuschalten.",
            "Werbung in Entdecken – bezahlte Platzierung eines Servers oder Bots in Entdecken: Beworben, Im Rampenlicht, Schlagzeile und Oberste Reihe.",
            "Geschenke – Feather-Zeit, die du für jemand anderen kaufst.",
          ),
          "Die aktuellen Vorteile jedes Produkts werden in der App angezeigt, bevor du kaufst. Diese Bedingungen sind Bestandteil der Nutzungsbedingungen.",
        ),
      },
    ),
    section(
      "prices",
      { en: "Prices and payment", ar: "الأسعار والدفع", de: "Preise und Zahlung" },
      {
        en: para(
          "The price, currency, billing period and any taxes are shown at checkout before you confirm. Prices for consumers include VAT where it applies.",
          "Payments will be processed by Stripe, PayPal or by the app store you buy through (for example Google Play or the Apple App Store). Zrzur never stores your card number. Where an app store handles the purchase, its own billing rules also apply, and cancellations and refunds may need to go through that store.",
        ),
        ar: para(
          "يُعرض السعر والعملة ومدة الفوترة وأي ضرائب عند الدفع قبل أن تؤكد. وتشمل أسعار المستهلكين ضريبة القيمة المضافة حيث تنطبق.",
          "ستُعالج المدفوعات عبر Stripe أو PayPal أو عبر متجر التطبيقات الذي تشتري منه (مثل Google Play أو Apple App Store). ولا يحفظ زرزور رقم بطاقتك أبدًا. وحين يتولّى متجر التطبيقات عملية الشراء، تسري قواعد الفوترة الخاصة به أيضًا، وقد يلزم إجراء الإلغاء والاسترداد عبر ذلك المتجر.",
        ),
        de: para(
          "Preis, Währung, Abrechnungszeitraum und etwaige Steuern werden beim Bezahlvorgang angezeigt, bevor du bestätigst. Preise für Verbraucher enthalten die Umsatzsteuer, soweit diese anfällt.",
          "Zahlungen werden über Stripe, PayPal oder den App-Store abgewickelt, über den du kaufst (zum Beispiel Google Play oder den Apple App Store). Zrzur speichert niemals deine Kartennummer. Wickelt ein App-Store den Kauf ab, gelten zusätzlich dessen eigene Abrechnungsregeln, und Kündigungen und Erstattungen müssen möglicherweise über diesen Store erfolgen.",
        ),
      },
    ),
    section(
      "renewal",
      { en: "Auto-renewal and cancelling", ar: "التجديد التلقائي والإلغاء", de: "Automatische Verlängerung und Kündigung" },
      {
        en: para(
          "Feather and Wings are subscriptions. They renew automatically every month at the price shown when you subscribed, until you cancel.",
          list(
            "You can cancel at any time in the app settings, with one click, with no reason needed.",
            "After you cancel, you keep your perks until the end of the period you already paid for. We do not charge you again.",
            "If a payment fails, we try again for a short time. If it still fails, the perks end.",
          ),
          "If we want to raise the price of your subscription, we will tell you at least 30 days before the next renewal. The new price applies only from the next period, and you can cancel before then.",
        ),
        ar: para(
          "«ريشة» و«أجنحة» اشتراكان يتجدّدان تلقائيًا كل شهر بالسعر المعروض عند اشتراكك، إلى أن تلغيهما.",
          list(
            "يمكنك الإلغاء في أي وقت من إعدادات التطبيق بنقرة واحدة، ودون ذكر سبب.",
            "بعد الإلغاء، تحتفظ بمزاياك حتى نهاية المدة التي دفعت ثمنها، ولا نخصم منك مجددًا.",
            "إذا فشل الدفع، نعيد المحاولة مدةً قصيرة، فإن استمر الفشل تنتهي المزايا.",
          ),
          "إذا أردنا رفع سعر اشتراكك، فسنخبرك قبل 30 يومًا على الأقل من التجديد التالي. ولا يسري السعر الجديد إلا من المدة التالية، ويمكنك الإلغاء قبل ذلك.",
        ),
        de: para(
          "Feather und Flügel sind Abonnements. Sie verlängern sich automatisch jeden Monat zu dem Preis, der beim Abschluss angezeigt wurde, bis du kündigst.",
          list(
            "Du kannst jederzeit in den App-Einstellungen mit einem Klick und ohne Angabe von Gründen kündigen.",
            "Nach der Kündigung behältst du deine Vorteile bis zum Ende des bereits bezahlten Zeitraums. Wir belasten dich nicht erneut.",
            "Schlägt eine Zahlung fehl, versuchen wir es für kurze Zeit erneut. Schlägt sie weiterhin fehl, enden die Vorteile.",
          ),
          "Wenn wir den Preis deines Abos erhöhen wollen, teilen wir dir dies mindestens 30 Tage vor der nächsten Verlängerung mit. Der neue Preis gilt erst ab dem nächsten Zeitraum, und du kannst vorher kündigen.",
        ),
      },
    ),
    section(
      "withdrawal",
      { en: "EU right of withdrawal (14 days)", ar: "حق الانسحاب في الاتحاد الأوروبي (١٤ يومًا)", de: "EU-Widerrufsrecht (14 Tage)" },
      {
        en: para(
          "If you are a consumer in the EU, you may withdraw from a purchase within 14 days of the contract, without giving a reason. To withdraw, use the withdrawal option in the app or send a clear statement to support@zrzur.com. [A model withdrawal form will be added.]",
          "Paid services start right away. At checkout we ask you to confirm that you want the service to begin during the 14-day period. If you then withdraw:",
          list(
            "Feather and Wings: we refund what you paid, minus a fair amount for the days you already used.",
            "Discover promotion: we refund what you paid, minus a fair amount for the time your listing was already promoted.",
            "Your right of withdrawal ends once the service has been fully provided within the 14 days.",
          ),
          "We refund within 14 days using the same payment method you used, at no cost to you.",
        ),
        ar: para(
          "إذا كنت مستهلكًا في الاتحاد الأوروبي، فيحق لك الانسحاب من الشراء خلال ١٤ يومًا من إبرام العقد، دون ذكر سبب. وللانسحاب، استخدم خيار الانسحاب في التطبيق أو أرسل بيانًا واضحًا إلى support@zrzur.com. [A model withdrawal form will be added.]",
          "تبدأ الخدمات المدفوعة فورًا. وعند الدفع نطلب منك تأكيد رغبتك في بدء الخدمة خلال مدة الأيام الأربعة عشر. فإذا انسحبت بعد ذلك:",
          list(
            "«ريشة» و«أجنحة»: نردّ ما دفعته مخصومًا منه مبلغ منصف عن الأيام التي استخدمتها.",
            "الترويج في «اكتشف»: نردّ ما دفعته مخصومًا منه مبلغ منصف عن المدة التي رُوّجت فيها قائمتك.",
            "ينتهي حقك في الانسحاب متى قُدّمت الخدمة كاملةً خلال الأيام الأربعة عشر.",
          ),
          "نردّ المبلغ خلال ١٤ يومًا بوسيلة الدفع نفسها التي استخدمتها، ودون أي تكلفة عليك.",
        ),
        de: para(
          "Wenn du Verbraucher in der EU bist, kannst du einen Kauf innerhalb von 14 Tagen ab Vertragsschluss ohne Angabe von Gründen widerrufen. Für den Widerruf nutzt du die Widerrufsoption in der App oder sendest eine eindeutige Erklärung an support@zrzur.com. [A model withdrawal form will be added.]",
          "Kostenpflichtige Dienste beginnen sofort. Beim Bezahlvorgang bitten wir dich zu bestätigen, dass der Dienst bereits während der 14-tägigen Frist beginnen soll. Wenn du dann widerrufst:",
          list(
            "Feather und Flügel: Wir erstatten den gezahlten Betrag abzüglich eines angemessenen Betrags für die bereits genutzten Tage.",
            "Werbung in Entdecken: Wir erstatten den gezahlten Betrag abzüglich eines angemessenen Betrags für die Zeit, in der dein Eintrag bereits beworben wurde.",
            "Dein Widerrufsrecht erlischt, sobald der Dienst innerhalb der 14 Tage vollständig erbracht wurde.",
          ),
          "Wir erstatten innerhalb von 14 Tagen über dasselbe Zahlungsmittel, das du verwendet hast, ohne Kosten für dich.",
        ),
      },
    ),
    section(
      "refunds",
      { en: "Other refunds", ar: "حالات الاسترداد الأخرى", de: "Sonstige Erstattungen" },
      {
        en: para(
          "Outside the withdrawal period, payments are generally not refundable, except:",
          list(
            "if you were charged by mistake or charged twice;",
            "if a paid feature did not work for a long time because of a problem on our side;",
            "if we close the Service or a paid product, for the unused prepaid time;",
            "where the law gives you a right to a refund.",
          ),
          "Write to support@zrzur.com with your payment reference. If your account or Server is suspended or closed because you broke our rules, unused paid time is not refunded unless the law requires it.",
        ),
        ar: para(
          "خارج مدة الانسحاب، لا تُستردّ المدفوعات عمومًا، إلا في الحالات الآتية:",
          list(
            "إذا خُصم منك مبلغ بالخطأ أو خُصم مرتين؛",
            "إذا تعطّلت ميزة مدفوعة مدةً طويلة بسبب مشكلة من جهتنا؛",
            "إذا أغلقنا الخدمة أو منتجًا مدفوعًا، فنردّ قيمة المدة المدفوعة مسبقًا غير المستخدمة؛",
            "حيث يمنحك القانون حق الاسترداد.",
          ),
          "راسل support@zrzur.com مع مرجع الدفع. وإذا أُوقف حسابك أو سيرفرك أو أُغلق بسبب مخالفتك قواعدنا، فلا تُردّ قيمة المدة المدفوعة غير المستخدمة إلا إذا أوجب القانون ذلك.",
        ),
        de: para(
          "Außerhalb der Widerrufsfrist werden Zahlungen grundsätzlich nicht erstattet, außer:",
          list(
            "wenn dir versehentlich oder doppelt etwas berechnet wurde;",
            "wenn eine kostenpflichtige Funktion wegen eines Problems auf unserer Seite längere Zeit nicht funktioniert hat;",
            "wenn wir den Dienst oder ein kostenpflichtiges Produkt einstellen, für die nicht genutzte, im Voraus bezahlte Zeit;",
            "wenn dir das Gesetz ein Recht auf Erstattung gibt.",
          ),
          "Schreib an support@zrzur.com und gib deine Zahlungsreferenz an. Wird dein Konto oder Server gesperrt oder geschlossen, weil du gegen unsere Regeln verstoßen hast, wird nicht genutzte bezahlte Zeit nicht erstattet, es sei denn, das Gesetz verlangt es.",
        ),
      },
    ),
    section(
      "wings",
      { en: "How Wings work", ar: "كيف تعمل «أجنحة»", de: "So funktionieren Flügel" },
      {
        en: list(
          "Wings belong to you, not to the Server. You choose which Server to give them to.",
          "You can move Wings to another Server. A short waiting period may apply; the app shows it before you move them.",
          "If you leave or are removed from a Server, your Wings stop counting for it.",
          "If a Server loses Wings, it may lose the perks that needed them. Content created with those perks may be hidden but is not deleted.",
          "Server owners must not require members to give Wings, or reward them with money for it.",
        ),
        ar: list(
          "«الأجنحة» ملك لك، لا للسيرفر، وأنت من يختار السيرفر الذي تمنحه إياها.",
          "يمكنك نقل «أجنحتك» إلى سيرفر آخر، وقد تنطبق مدة انتظار قصيرة يعرضها التطبيق قبل النقل.",
          "إذا غادرت سيرفرًا أو أُزلت منه، تتوقف «أجنحتك» عن الاحتساب له.",
          "إذا فقد السيرفر بعض «الأجنحة»، فقد يفقد المزايا التي تتطلّبها. وقد يُخفى المحتوى المُنشأ بتلك المزايا، لكنه لا يُحذف.",
          "لا يجوز لمالكي السيرفرات إلزام الأعضاء بمنح «أجنحة»، ولا مكافأتهم على ذلك بالمال.",
        ),
        de: list(
          "Flügel gehören dir, nicht dem Server. Du entscheidest, welchem Server du sie gibst.",
          "Du kannst Flügel auf einen anderen Server übertragen. Dabei kann eine kurze Wartezeit gelten; die App zeigt sie an, bevor du sie überträgst.",
          "Wenn du einen Server verlässt oder daraus entfernt wirst, zählen deine Flügel für ihn nicht mehr.",
          "Verliert ein Server Flügel, kann er die Vorteile verlieren, für die sie nötig waren. Inhalte, die mit diesen Vorteilen erstellt wurden, können ausgeblendet, werden aber nicht gelöscht.",
          "Serverinhaber dürfen von Mitgliedern nicht verlangen, Flügel zu geben, und sie dafür nicht mit Geld belohnen.",
        ),
      },
    ),
    section(
      "promotion",
      { en: "Discover promotion", ar: "الترويج في «اكتشف»", de: "Werbung in Entdecken" },
      {
        en: para(
          "Promoted, Spotlight, Headline and Top row are paid advertising placements. They are always shown with an \"Ad\" label, and buying them does not change how Zrzur reviews or ranks unpaid listings.",
          "Promoted Servers and bots must follow the Discover Guidelines. We can refuse or stop a promotion that breaks them. Promotion buys visibility for a set time; it does not guarantee members, installs or results.",
        ),
        ar: para(
          "مُروَّج، وتحت الأضواء، وفي الصدارة، والصف الأول، أماكن ظهور إعلانية مدفوعة. وتُعرض دائمًا مع وسم «إعلان»، ولا يغيّر شراؤها طريقة مراجعة زرزور للقوائم غير المدفوعة أو ترتيبها.",
          "يجب أن تلتزم السيرفرات والبوتات المروَّج لها بإرشادات «اكتشف»، ويحق لنا رفض أي ترويج يخالفها أو إيقافه. والترويج يمنح ظهورًا مدةً محددة، ولا يضمن أعضاءً أو عمليات تثبيت أو نتائج.",
        ),
        de: para(
          "Beworben, Im Rampenlicht, Schlagzeile und Oberste Reihe sind bezahlte Werbeplatzierungen. Sie werden immer mit der Kennzeichnung „Anzeige“ angezeigt, und ihr Kauf ändert nichts daran, wie Zrzur unbezahlte Einträge prüft oder einordnet.",
          "Beworbene Server und Bots müssen die Richtlinien für „Entdecken“ einhalten. Wir können eine Werbung, die dagegen verstößt, ablehnen oder beenden. Mit Werbung erwirbst du Sichtbarkeit für einen bestimmten Zeitraum; sie garantiert keine Mitglieder, Installationen oder Ergebnisse.",
        ),
      },
    ),
    section(
      "gifts",
      { en: "Gifts", ar: "الهدايا", de: "Geschenke" },
      {
        en: list(
          "You can give Feather for 1, 3 or 12 months to another person on Zrzur.",
          "It starts for them as soon as the payment is confirmed, and they see who gave it and your note.",
          "A gift cannot be returned once it has started, except under your right of withdrawal above.",
          "Gifts must not be sold or offered as prizes in exchange for money.",
        ),
        ar: list(
          "يمكنك إهداء «ريشة» لمدة شهر أو ثلاثة أشهر أو ١٢ شهرًا لشخص آخر على زرزور.",
          "وتبدأ لديه فور تأكيد الدفع، ويرى من أهداها والملاحظة التي كتبتها.",
          "ولا يمكن ردّ الهدية بعد بدئها إلا بموجب حقك في الانسحاب المذكور أعلاه.",
          "ولا يجوز بيع الهدايا ولا تقديمها جوائز مقابل المال.",
        ),
        de: list(
          "Du kannst einer anderen Person auf Zrzur Feather für 1, 3 oder 12 Monate schenken.",
          "Es beginnt für sie, sobald die Zahlung bestätigt ist, und sie sieht, von wem es kommt, und deine Notiz.",
          "Ein Geschenk kann nach dem Start nicht zurückgegeben werden, außer über dein Widerrufsrecht oben.",
          "Geschenke dürfen nicht verkauft oder gegen Geld als Preise angeboten werden.",
        ),
      },
    ),
    section(
      "no-cash",
      { en: "No cash value", ar: "لا قيمة نقدية", de: "Kein Geldwert" },
      {
        en: "Feather time, Wings, gifts and any rewards have no cash value. They cannot be exchanged for money, transferred outside the features the app offers, or sold.",
        ar: "ليست لمدة «ريشة» ولا لـ«الأجنحة» ولا للهدايا ولا لأي مكافآت قيمة نقدية. ولا يجوز استبدالها بالمال، ولا نقلها خارج الميزات التي يتيحها التطبيق، ولا بيعها.",
        de: "Feather-Zeit, Flügel, Geschenke und etwaige Prämien haben keinen Geldwert. Sie können nicht in Geld umgetauscht, außerhalb der in der App angebotenen Funktionen übertragen oder verkauft werden.",
      },
    ),
    section(
      "chargebacks",
      { en: "Chargebacks", ar: "استرداد المبالغ عبر البنك", de: "Rückbuchungen" },
      {
        en: "If something went wrong, please contact support@zrzur.com first — we usually fix it faster than a bank can. If you file a chargeback, we pause the paid features linked to that payment while it is open. Fraudulent chargebacks may lead to account restrictions.",
        ar: "إذا حدث خطأ ما، فنرجو التواصل أولًا مع support@zrzur.com، فنحن نحلّ المشكلة عادةً أسرع من البنك. وإذا قدّمت طلب استرداد عبر البنك، فإننا نعلّق الميزات المدفوعة المرتبطة بتلك الدفعة ما دام الطلب قائمًا. وقد تؤدي طلبات الاسترداد الاحتيالية إلى تقييد الحساب.",
        de: "Wenn etwas schiefgelaufen ist, wende dich bitte zuerst an support@zrzur.com – wir lösen das Problem meist schneller, als eine Bank es kann. Wenn du eine Rückbuchung veranlasst, setzen wir die mit dieser Zahlung verbundenen kostenpflichtigen Funktionen aus, solange sie offen ist. Missbräuchliche Rückbuchungen können zu Einschränkungen des Kontos führen.",
      },
    ),
    section(
      "changes",
      { en: "Changes to perks", ar: "التغييرات على المزايا", de: "Änderungen der Vorteile" },
      {
        en: "We improve Zrzur over time, so perks can change. We will not remove a main perk from a period you already paid for. If we make a change that clearly reduces what you get, we will tell you in advance, and you can cancel and get a refund for the unused time.",
        ar: "نطوّر زرزور باستمرار، لذا قد تتغيّر المزايا. ولن نزيل ميزة رئيسية من مدة دفعت ثمنها بالفعل. وإذا أجرينا تغييرًا يُنقص بوضوح ما تحصل عليه، فسنخبرك مسبقًا، ويمكنك الإلغاء واسترداد قيمة المدة غير المستخدمة.",
        de: "Wir entwickeln Zrzur laufend weiter, daher können sich Vorteile ändern. Wir entfernen keinen wesentlichen Vorteil aus einem Zeitraum, den du bereits bezahlt hast. Wenn wir eine Änderung vornehmen, die deine Leistungen deutlich verringert, informieren wir dich vorab, und du kannst kündigen und eine Erstattung für die nicht genutzte Zeit erhalten.",
      },
    ),
  ],
}));

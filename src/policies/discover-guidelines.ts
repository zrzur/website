import { doc, list, para, section } from "./shared.ts";

export const discoverGuidelines = doc({
  slug: "discover-guidelines",
  group: "servers",
  title: { en: "Discover Guidelines", ar: "إرشادات «اكتشف»",
    de: "Richtlinien für „Entdecken“" },
  intro: {
    en: "The rules for listing a Server or bot in Discover, and for paid promotion with Promoted, Spotlight, Headline and Top row.",
    ar: "قواعد إدراج سيرفر أو بوت في «اكتشف»، والترويج المدفوع عبر مُروَّج، وتحت الأضواء، وفي الصدارة، والصف الأول.",
  },
  sections: [
    section(
      "purpose",
      { en: "What Discover is for", ar: "الغرض من «اكتشف»" },
      {
        en: "Discover helps people find good communities and useful bots. A listing is an invitation to strangers, so listed Servers and bots are held to a higher standard than private ones. Being listed is a privilege, not a right, and every listing is reviewed before it appears.",
        ar: "يساعد «اكتشف» الناس على إيجاد مجتمعات جيدة وبوتات مفيدة. والإدراج دعوة موجّهة إلى الغرباء، لذا تخضع السيرفرات والبوتات المُدرجة لمعايير أعلى من الخاصة. والإدراج امتياز لا حق، وتُراجَع كل قائمة قبل ظهورها.",
      },
    ),
    section(
      "eligibility",
      { en: "Who can be listed", ar: "من يمكن إدراجه" },
      {
        en: list(
          "The Server or bot follows the Terms of Service, the Community Guidelines and, for bots, the Developer Terms.",
          "The Server has clear server rules and membership screening turned on.",
          "The owner's account is in good standing and has two-factor authentication turned on.",
          "The Server has active moderation — someone responds to reports and keeps channels clean.",
          "A bot is online and works as described, and its privacy information is filled in.",
        ),
        ar: list(
          "يلتزم السيرفر أو البوت بشروط الخدمة وإرشادات المجتمع، وبشروط المطوّرين في حالة البوتات.",
          "لدى السيرفر قواعد واضحة، وفحص العضوية مفعّل فيه.",
          "حساب المالك في وضع سليم، والتحقق بخطوتين مفعّل فيه.",
          "في السيرفر إشراف نشط — أي من يستجيب للبلاغات ويحافظ على نظافة القنوات.",
          "البوت متصل ويعمل كما هو موصوف، ومعلومات الخصوصية الخاصة به مكتملة.",
        ),
      },
    ),
    section(
      "accuracy",
      { en: "Be accurate", ar: "كن دقيقًا" },
      {
        en: list(
          "Your name, description, tags, language and category must honestly describe what people will find.",
          "Do not use misleading claims, fake member counts, or keywords unrelated to your Server.",
          "Do not use other brands' names or logos — including Zrzur's — in a way that suggests a partnership that does not exist.",
          "Keep the listing up to date when your Server or bot changes.",
        ),
        ar: list(
          "يجب أن يصف الاسم والوصف والوسوم واللغة والفئة بصدق ما سيجده الناس.",
          "لا تستخدم ادعاءات مضلِّلة، ولا أعداد أعضاء وهمية، ولا كلمات مفتاحية لا علاقة لها بسيرفرك.",
          "لا تستخدم أسماء العلامات الأخرى أو شعاراتها — ومنها زرزور — بطريقة توحي بشراكة غير موجودة.",
          "حدّث القائمة عند تغيّر سيرفرك أو بوتك.",
        ),
      },
    ),
    section(
      "no-nsfw",
      { en: "No adult listings", ar: "لا قوائم لمحتوى البالغين" },
      {
        en: "Servers marked as mature, or whose main purpose is sexual or very graphic content, cannot be listed in Discover. Listings, icons, banners and descriptions must be suitable for everyone aged 16 and over (the minimum age for Zrzur). A listed Server may have a few mature channels only if they are clearly marked and are not the focus of the Server.",
        ar: "لا يجوز إدراج السيرفرات المحددة كمحتوى للبالغين، أو التي يكون غرضها الرئيسي محتوى جنسيًا أو صادمًا جدًا، في «اكتشف». ويجب أن تكون القوائم والأيقونات والأغلفة والأوصاف مناسبة لكل من بلغ ١٦ عامًا فأكثر (الحد الأدنى للعمر في زرزور). ويجوز أن يحتوي السيرفر المُدرج على قنوات قليلة للبالغين فقط إذا كانت محددة بوضوح ولم تكن محور السيرفر.",
      },
    ),
    section(
      "growth",
      { en: "Fair growth", ar: "النمو العادل" },
      {
        en: list(
          "Do not use bots, fake accounts or paid services to inflate members, activity or votes.",
          "Do not offer rewards for joining that are worth money, or run \"join to win\" schemes that break the law.",
          "Do not send unwanted direct messages to advertise your listing.",
        ),
        ar: list(
          "لا تستخدم البوتات أو الحسابات الوهمية أو الخدمات المدفوعة لتضخيم الأعضاء أو النشاط أو الأصوات.",
          "لا تقدّم مكافآت ذات قيمة مالية مقابل الانضمام، ولا تنظّم مسابقات «انضم واربح» المخالفة للقانون.",
          "لا ترسل رسائل خاصة غير مرغوب فيها للإعلان عن قائمتك.",
        ),
      },
    ),
    section(
      "paid",
      { en: "Paid promotion is advertising", ar: "الترويج المدفوع إعلان" },
      {
        en: para(
          "Promoted, Spotlight, Headline and Top row are paid placements. They are advertising, and Zrzur always labels them clearly with \"Ad\" so people can tell them apart from unpaid results (\"Ad\" / \"إعلان\" / \"Anzeige\" in English, Arabic and German). Paid placement is not available yet.",
          list(
            "Paying does not skip review: promoted listings must follow every rule on this page.",
            "Paying does not change unpaid rankings, reviews or badges.",
            "Do not describe a paid placement as an award, a recommendation or a choice by Zrzur staff.",
            "Do not hide that you paid, for example by removing or covering the label in screenshots you share.",
            "If you were paid by someone else to promote their Server or bot, say so clearly.",
          ),
          "Prices, duration and refunds are covered by the Paid Services terms.",
        ),
        ar: para(
          "مُروَّج، وتحت الأضواء، وفي الصدارة، والصف الأول، أماكن ظهور مدفوعة. وهي إعلانات، ويَسِمها زرزور دائمًا بوضوح بكلمة «إعلان» ليميّزها الناس من النتائج غير المدفوعة. والترويج المدفوع غير متاح بعد.",
          list(
            "الدفع لا يُعفي من المراجعة: يجب أن تلتزم القوائم المروَّج لها بكل قاعدة في هذه الصفحة.",
            "الدفع لا يغيّر ترتيب النتائج غير المدفوعة ولا تقييماتها ولا شاراتها.",
            "لا تصف الظهور المدفوع بأنه جائزة أو توصية أو اختيار من فريق زرزور.",
            "لا تُخفِ أنك دفعت، كأن تزيل الوسم أو تغطّيه في لقطات الشاشة التي تشاركها.",
            "إذا تلقّيت مالًا من غيرك للترويج لسيرفره أو بوته، فصرّح بذلك بوضوح.",
          ),
          "تخضع الأسعار والمدة والاسترداد لشروط الخدمات المدفوعة.",
        ),
      },
    ),
    section(
      "review",
      { en: "Review and removal", ar: "المراجعة والإزالة" },
      {
        en: para(
          "We review every listing request and every paid promotion before it goes live. We may ask for changes, refuse a listing, or remove it later if it no longer meets these guidelines or receives many valid reports.",
          "We tell you why, and you can fix the problem and apply again, or appeal as described in the Enforcement and Appeals policy. If a promoted listing is removed for breaking these rules, the remaining promotion time is not refunded unless the law requires it.",
        ),
        ar: para(
          "نراجع كل طلب إدراج وكل ترويج مدفوع قبل نشره. وقد نطلب تعديلات، أو نرفض القائمة، أو نزيلها لاحقًا إذا لم تعد تستوفي هذه الإرشادات أو تلقّت كثيرًا من البلاغات الصحيحة.",
          "نخبرك بالسبب، ويمكنك إصلاح المشكلة والتقديم مجددًا، أو الاعتراض كما توضّح سياسة الإنفاذ والاعتراض. وإذا أُزيلت قائمة مروَّج لها بسبب مخالفة هذه القواعد، فلا تُردّ قيمة مدة الترويج المتبقية إلا إذا أوجب القانون ذلك.",
        ),
      },
    ),
    section(
      "ranking",
      { en: "How unpaid results are ordered", ar: "كيف تُرتَّب النتائج غير المدفوعة" },
      {
        en: "Unpaid results are ordered mainly by how well they match your search, language and category, and by signals such as recent activity and member growth. We do not sell better unpaid rankings. [Owner to confirm the actual ranking signals before publication.]",
        ar: "تُرتَّب النتائج غير المدفوعة أساسًا بحسب مطابقتها لبحثك ولغتك والفئة، وبحسب مؤشرات مثل النشاط الحديث ونمو الأعضاء. ولا نبيع ترتيبًا أفضل في النتائج غير المدفوعة. [Owner to confirm the actual ranking signals before publication.]",
      },
    ),
  ],
});

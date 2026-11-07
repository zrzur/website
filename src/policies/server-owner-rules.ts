import { doc, list, para, section } from "./shared.ts";

export const serverOwnerRules = doc({
  slug: "server-owner-rules",
  group: "servers",
  title: { en: "Server Owner Rules", ar: "قواعد مالكي السيرفرات",
    de: "Regeln für Serverinhaber" },
  intro: {
    en: "What we expect from people who own or moderate a Server on Zrzur, and how server rules and membership screening work.",
    ar: "ما نتوقّعه ممّن يملكون سيرفرًا على زرزور أو يشرفون عليه، وكيف تعمل قواعد السيرفر وفحص العضوية.",
  },
  sections: [
    section(
      "responsibility",
      { en: "Your responsibility", ar: "مسؤوليتك" },
      {
        en: para(
          "When you create a Server, you become its owner. You decide what it is about and who helps run it. You are also responsible for making sure that what happens in your Server follows the Terms of Service and the Community Guidelines.",
          "You do not have to read every message. But you must act when you see or are told about content that breaks our rules, and you must not create a Server whose purpose is to break them.",
        ),
        ar: para(
          "عندما تنشئ سيرفرًا، تصبح مالكه، وتقرّر موضوعه ومن يساعدك في إدارته. وأنت مسؤول كذلك عن ضمان أن يلتزم ما يحدث في سيرفرك بشروط الخدمة وإرشادات المجتمع.",
          "لا يُطلب منك قراءة كل رسالة، لكن يجب أن تتصرّف عندما ترى محتوى يخالف قواعدنا أو تُبلَّغ عنه، ولا يجوز لك إنشاء سيرفر غرضه مخالفة هذه القواعد.",
        ),
      },
    ),
    section(
      "server-rules",
      { en: "Write clear server rules", ar: "اكتب قواعد واضحة للسيرفر" },
      {
        en: para(
          "Every Server that is public, listed in Discover or has more than [50] members must have written server rules. Keep them short and clear. Your rules can be stricter than ours, but they can never allow something our policies forbid.",
          "Write the rules in the main language of your Server. Tell members when you change them in an important way.",
        ),
        ar: para(
          "يجب أن تكون لكل سيرفر عام، أو مُدرج في «اكتشف»، أو يزيد عدد أعضائه على [50]، قواعد مكتوبة. اجعلها قصيرة وواضحة. ويجوز أن تكون قواعدك أشدّ من قواعدنا، لكنها لا يجوز أبدًا أن تسمح بما تحظره سياساتنا.",
          "اكتب القواعد باللغة الرئيسية لسيرفرك، وأخبر الأعضاء عند تغييرها تغييرًا مهمًا.",
        ),
      },
    ),
    section(
      "screening",
      { en: "Membership screening", ar: "فحص العضوية" },
      {
        en: para(
          "When a Server has server rules, Zrzur shows them to every new member, and members must accept them before they can post. This is called membership screening:",
          list(
            "new members can read the Server's public channels, but cannot send messages, react, join voice or send direct messages through the Server until they accept the server rules;",
            "if you change the rules in an important way, members are asked to accept them again;",
            "you may add simple questions, but do not ask for passwords, ID documents, phone numbers or other sensitive personal data.",
          ),
          "Screening is always on for Servers that have server rules, including every Server listed in Discover. Members who do not accept can still leave at any time.",
        ),
        ar: para(
          "عندما تكون للسيرفر قواعد، يعرضها زرزور على كل عضو جديد، ويجب على الأعضاء قبولها قبل أن يتمكّنوا من النشر. ويُسمّى هذا فحص العضوية:",
          list(
            "يستطيع الأعضاء الجدد قراءة القنوات العامة في السيرفر، لكنهم لا يستطيعون إرسال الرسائل أو التفاعل أو الانضمام إلى الصوت أو إرسال رسائل خاصة عبر السيرفر حتى يقبلوا قواعده؛",
            "إذا غيّرت القواعد تغييرًا مهمًا، يُطلب من الأعضاء قبولها مجددًا؛",
            "يجوز لك إضافة أسئلة بسيطة، لكن لا تطلب كلمات المرور أو وثائق الهوية أو أرقام الهواتف أو غيرها من البيانات الشخصية الحساسة.",
          ),
          "فحص العضوية مفعّل دائمًا في السيرفرات التي لديها قواعد، ومنها كل سيرفر مُدرج في «اكتشف». ويستطيع من لا يقبل القواعد مغادرة السيرفر في أي وقت.",
        ),
      },
    ),
    section(
      "moderation",
      { en: "Moderate fairly", ar: "أشرف بعدل" },
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
      },
    ),
    section(
      "mature",
      { en: "Mature channels and age", ar: "قنوات البالغين والعمر" },
      {
        en: "Content for adults only is allowed only in channels or Servers you mark as mature, and pornography is not allowed anywhere (see the Community Guidelines). Mature channels open only to accounts whose stated age is 18 or over. Mark them before posting such content, and never use mature content in your Server name, icon, banner, invite page or public channels. If your Server is clearly aimed at minors, it must not have mature channels.",
        ar: "يُسمح بالمحتوى المخصّص للبالغين فقط في القنوات أو السيرفرات التي تحدّدها كمحتوى للبالغين، ولا يُسمح بالمواد الإباحية في أي مكان (راجع إرشادات المجتمع). ولا تُفتح قنوات البالغين إلا للحسابات التي صرّح أصحابها بأن عمرهم ١٨ عامًا فأكثر. حدّدها قبل نشر هذا المحتوى، ولا تستخدم أبدًا محتوى البالغين في اسم سيرفرك أو أيقونته أو غلافه أو صفحة دعوته أو قنواته العامة. وإذا كان سيرفرك موجّهًا بوضوح إلى القاصرين، فلا يجوز أن يحتوي على قنوات للبالغين.",
      },
    ),
    section(
      "data",
      { en: "Members' data and bots", ar: "بيانات الأعضاء والبوتات" },
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
      },
    ),
    section(
      "money",
      { en: "Money, Wings and selling", ar: "المال و«الأجنحة» والبيع" },
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
      },
    ),
    section(
      "ownership",
      { en: "Ownership changes and inactive Servers", ar: "نقل الملكية والسيرفرات غير النشطة" },
      {
        en: "You can transfer ownership to another member at any time. If an owner's account is deleted or has been inactive for a long time, we may, on request from the Server's moderators, transfer ownership to an active moderator. A Server whose staff does not respond to serious, repeated reports may be restricted or removed.",
        ar: "يمكنك نقل الملكية إلى عضو آخر في أي وقت. وإذا حُذف حساب المالك أو ظلّ غير نشط مدةً طويلة، فقد ننقل الملكية بطلب من مشرفي السيرفر إلى مشرف نشط. وقد يُقيَّد السيرفر أو يُزال إذا لم يستجب فريق إدارته لبلاغات خطيرة ومتكررة.",
      },
    ),
    section(
      "enforcement",
      { en: "When we step in", ar: "متى نتدخّل" },
      {
        en: "If a Server repeatedly breaks our rules, we may act against the content, the members involved, the staff who allowed it, or the whole Server — from removing it from Discover to closing it. We tell the owner what we did and why, and the owner can appeal as described in the Enforcement and Appeals policy.",
        ar: "إذا خالف سيرفر قواعدنا مرارًا، فقد نتخذ إجراءً بحق المحتوى، أو الأعضاء المتورّطين، أو فريق الإدارة الذي سمح بذلك، أو السيرفر كله — بدءًا من إزالته من «اكتشف» حتى إغلاقه. ونخبر المالك بما فعلناه وسببه، ويحق له الاعتراض كما توضّح سياسة الإنفاذ والاعتراض.",
      },
    ),
  ],
});

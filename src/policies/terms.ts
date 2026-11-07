import { doc, list, para, section } from "./shared.ts";

export const terms = doc({
  slug: "terms",
  group: "everyone",
  title: { en: "Terms of Service", ar: "شروط الخدمة",
    de: "Nutzungsbedingungen" },
  intro: {
    en: "The agreement between you and the operator of Zrzur when you use the Zrzur apps and services at zrzur.com.",
    ar: "الاتفاق بينك وبين الجهة المشغّلة لزرزور عند استخدامك تطبيقات زرزور وخدماته على zrzur.com.",
  },
  sections: [
    section(
      "about",
      { en: "Who we are and what these terms cover", ar: "من نحن وما الذي تشمله هذه الشروط" },
      {
        en: para(
          "Zrzur is a chat service for communities, friends and teams. It is run by [Operator legal name], [Address] (\"Zrzur\", \"we\", \"us\"). These terms apply when you use the Zrzur web app, desktop app, mobile apps, website and APIs that we run at zrzur.com and its subdomains (together, the \"Service\").",
          "By creating an account or using the Service, you agree to these terms and to the policies they mention: the Privacy Policy, the Community Guidelines, the Enforcement and Appeals policy and, when you use them, the Paid Services terms, the Server Owner Rules, the Discover Guidelines, the Developer Terms, the Plugin Policy and the Creator Terms. If you do not agree, please do not use the Service.",
          "Zrzur's software is open source under the GNU Affero General Public License v3.0. These terms do not limit any right that licence gives you over the code. If someone else runs their own copy of the software, that operator — not us — is responsible for their service and their rules.",
        ),
        ar: para(
          "زرزور خدمة محادثة للمجتمعات والأصدقاء وفرق العمل، وتشغّلها [Operator legal name]، [Address] (ويُشار إليها بـ«زرزور» أو «نحن»). تسري هذه الشروط عند استخدامك تطبيق زرزور على الويب أو سطح المكتب أو الهاتف، أو الموقع، أو الواجهات البرمجية التي نشغّلها على zrzur.com ونطاقاته الفرعية (ويُشار إليها مجتمعةً بـ«الخدمة»).",
          "بإنشائك حسابًا أو استخدامك الخدمة، فإنك توافق على هذه الشروط وعلى السياسات المذكورة فيها: سياسة الخصوصية، وإرشادات المجتمع، وسياسة الإنفاذ والاعتراض، وعند الاستخدام: شروط الخدمات المدفوعة، وقواعد مالكي السيرفرات، وإرشادات «اكتشف»، وشروط المطوّرين، وسياسة الإضافات، وشروط المبدعين. إن لم توافق، فالرجاء عدم استخدام الخدمة.",
          "برمجيات زرزور مفتوحة المصدر بموجب رخصة جنو أفيرو العمومية العامة، الإصدار الثالث (AGPL-3.0). ولا تُقيّد هذه الشروط أي حق تمنحك إياه تلك الرخصة على الشيفرة. وإذا شغّل طرف آخر نسخته الخاصة من البرمجيات، فهو المسؤول عن خدمته وقواعده، لا نحن.",
        ),
      },
    ),
    section(
      "accounts",
      { en: "Your account and minimum age", ar: "حسابك والحد الأدنى للعمر" },
      {
        en: para(
          "You must be at least 16 years old to use Zrzur, wherever you live. When you sign up you give your month and year of birth, and it must be true. This is your own statement: Zrzur does not verify ages. Channels and Servers marked as mature open only to accounts whose stated age is 18 or over, and pornography is not allowed anywhere. The Privacy Policy explains how we use your age and how you can correct it.",
          "When you create an account:",
          list(
            "give accurate information, including a working email address;",
            "keep your password and login codes secret, and turn on two-factor authentication if you can;",
            "do not share, sell, rent or transfer your account;",
            "tell us quickly at support@zrzur.com if you think someone else has accessed your account.",
          ),
          "You are responsible for what happens through your account, unless it was used without your fault after you told us it was compromised.",
        ),
        ar: para(
          "يجب ألا يقلّ عمرك عن ١٦ عامًا لاستخدام زرزور أينما كنت تقيم. وعند التسجيل تذكر شهر ميلادك وسنته، ويجب أن يكونا صحيحين. وهذا تصريح منك، ولا يتحقق زرزور من الأعمار. ولا تُفتح القنوات والسيرفرات المحددة كمحتوى للبالغين إلا للحسابات التي صرّح أصحابها بأن عمرهم ١٨ عامًا فأكثر، ولا يُسمح بالمواد الإباحية في أي مكان. وتشرح سياسة الخصوصية كيف نستخدم عمرك وكيف يمكنك تصحيحه.",
          "عند إنشاء حسابك:",
          list(
            "قدّم معلومات صحيحة، ومنها بريد إلكتروني فعّال؛",
            "احفظ كلمة المرور ورموز الدخول سرًّا، وفعّل التحقق بخطوتين إن أمكنك؛",
            "لا تشارك حسابك أو تبعه أو تؤجره أو تنقله إلى غيرك؛",
            "أخبرنا سريعًا على support@zrzur.com إذا ظننت أن أحدًا دخل إلى حسابك.",
          ),
          "أنت مسؤول عمّا يحدث عبر حسابك، إلا إذا استُخدم دون تقصير منك بعد أن أبلغتنا باختراقه.",
        ),
      },
    ),
    section(
      "your-content",
      { en: "Your content", ar: "محتواك" },
      {
        en: para(
          "Your messages, files, images, voice and other content stay yours. We do not claim ownership of them.",
          "To run the Service, you give us a worldwide, non-exclusive, royalty-free licence to store, copy, transmit, display and technically adapt your content (for example, making thumbnails, compressing images or converting file formats). We use this licence only to provide, secure and support the Service — for example, to deliver a message to the people you sent it to — and to enforce our rules. We do not sell your content.",
          "This licence ends when you delete the content or your account, except for: copies that other people already received or re-shared; copies kept for a limited time in backups; and copies we must keep by law or to handle a report or legal claim.",
          "You promise that you have the rights needed to share what you post, and that it does not break these terms or the law.",
        ),
        ar: para(
          "رسائلك وملفاتك وصورك وصوتك وسائر محتواك تبقى ملكًا لك، ولا ندّعي ملكيتها.",
          "لتشغيل الخدمة، تمنحنا ترخيصًا عالميًا وغير حصري ودون مقابل لتخزين محتواك ونسخه ونقله وعرضه وتكييفه تقنيًا (مثل إنشاء صور مصغّرة، أو ضغط الصور، أو تحويل صيغ الملفات). ولا نستخدم هذا الترخيص إلا لتقديم الخدمة وحمايتها ودعمها — كإيصال رسالتك إلى من أرسلتها إليهم — ولتطبيق قواعدنا. ولا نبيع محتواك.",
          "ينتهي هذا الترخيص عند حذفك المحتوى أو حسابك، باستثناء: النسخ التي تلقّاها آخرون أو أعادوا مشاركتها، والنسخ المحفوظة مدةً محدودة في النسخ الاحتياطية، والنسخ التي يلزمنا القانون بحفظها أو نحتاجها لمعالجة بلاغ أو مطالبة قانونية.",
          "وتتعهّد بأنك تملك الحقوق اللازمة لمشاركة ما تنشره، وأنه لا يخالف هذه الشروط ولا القانون.",
        ),
      },
    ),
    section(
      "acceptable-use",
      { en: "Acceptable use", ar: "الاستخدام المقبول" },
      {
        en: para(
          "Follow the Community Guidelines everywhere on Zrzur, including in private messages. In addition, you must not:",
          list(
            "break the law or help others break it;",
            "access accounts, servers or data you are not allowed to access, or try to get around security, rate limits or bans;",
            "send malware, run attacks, or overload or disrupt the Service;",
            "collect data about other users without their permission, including by scraping;",
            "use bots, scripts or modified clients to spam, inflate numbers or act in ways the Developer Terms or Plugin Policy do not allow;",
            "pretend to be Zrzur, our staff, or another person or organisation;",
            "use the Service to send unwanted advertising.",
          ),
          "Security researchers acting in good faith may test the Service under our security policy and should report findings to support@zrzur.com.",
        ),
        ar: para(
          "التزم بإرشادات المجتمع في كل مكان على زرزور، ومنه الرسائل الخاصة. ويُحظر عليك كذلك:",
          list(
            "مخالفة القانون أو مساعدة غيرك على مخالفته؛",
            "الدخول إلى حسابات أو سيرفرات أو بيانات غير مسموح لك بها، أو محاولة تجاوز أنظمة الحماية أو حدود الاستخدام أو الحظر؛",
            "إرسال البرمجيات الضارّة، أو شنّ الهجمات، أو إثقال الخدمة أو تعطيلها؛",
            "جمع بيانات المستخدمين الآخرين دون إذنهم، ومن ذلك الجمع الآلي للبيانات؛",
            "استخدام البوتات أو البرامج النصية أو العملاء المعدّلة لإرسال الرسائل المزعجة أو تضخيم الأرقام أو التصرّف بما لا تسمح به شروط المطوّرين أو سياسة الإضافات؛",
            "انتحال صفة زرزور أو فريقه أو أي شخص أو جهة أخرى؛",
            "استخدام الخدمة لإرسال إعلانات غير مرغوب فيها.",
          ),
          "يجوز للباحثين الأمنيين الذين يعملون بحسن نية اختبار الخدمة وفق سياسة الأمان لدينا، وعليهم إبلاغ ما يجدونه إلى support@zrzur.com.",
        ),
      },
    ),
    section(
      "servers",
      { en: "Servers, bots and other people's content", ar: "السيرفرات والبوتات ومحتوى الآخرين" },
      {
        en: para(
          "Anyone can create a Server on Zrzur. Server owners set their own server rules, but those rules can never allow what our policies forbid. Owners and moderators must also follow the Server Owner Rules.",
          "Content on Zrzur comes from its users, bots and creators, not from us. We do not check content before it is posted, but we act on reports and on illegal content we become aware of, as described in the Enforcement and Appeals policy.",
          "Bots, apps and plugins are made by third parties. Their makers are responsible for them under the Developer Terms and the Plugin Policy. Check what a bot or plugin asks for before you add it.",
        ),
        ar: para(
          "يمكن لأي شخص إنشاء سيرفر على زرزور. ويضع مالكو السيرفرات قواعدهم الخاصة، لكن هذه القواعد لا يجوز أن تسمح أبدًا بما تحظره سياساتنا. وعلى المالكين والمشرفين الالتزام كذلك بقواعد مالكي السيرفرات.",
          "المحتوى على زرزور يأتي من المستخدمين والبوتات والمبدعين، لا منّا. ولا نراجع المحتوى قبل نشره، لكننا نتعامل مع البلاغات ومع المحتوى غير القانوني الذي نعلم به، كما توضّح سياسة الإنفاذ والاعتراض.",
          "البوتات والتطبيقات والإضافات يصنعها أطراف آخرون، وهم مسؤولون عنها بموجب شروط المطوّرين وسياسة الإضافات. تحقّق ممّا يطلبه البوت أو الإضافة قبل إضافته.",
        ),
      },
    ),
    section(
      "paid",
      { en: "Paid services", ar: "الخدمات المدفوعة" },
      {
        en: "Zrzur is free to use. Optional paid features — the Feather member subscription, Wings server boosts and Discover promotion (Promoted, Spotlight, Headline and Top row) — are covered by the Paid Services terms, which form part of these terms. Payments are not open yet; prices will always be shown before you pay.",
        ar: "استخدام زرزور مجاني. أما الميزات المدفوعة الاختيارية — اشتراك الأعضاء «ريشة»، وتعزيزات السيرفرات «أجنحة»، والترويج في «اكتشف» (مُروَّج، وتحت الأضواء، وفي الصدارة، والصف الأول) — فتخضع لشروط الخدمات المدفوعة، وهي جزء من هذه الشروط. والدفع غير مفتوح بعد؛ وستُعرض الأسعار دائمًا قبل الدفع.",
      },
    ),
    section(
      "brand",
      { en: "Zrzur's name, logo and software", ar: "اسم زرزور وشعاره وبرمجياته" },
      {
        en: para(
          "The Zrzur name, the زرزور name and the Zrzur logo are our brand. The open-source licence covers the code, not the brand. You may refer to Zrzur by name, but do not use our name or logo in a way that suggests we made, approve or partner with your project, server, bot or product unless we agreed in writing.",
          "Parts of the Service are based on open-source software from other projects. Their copyright notices and licences are kept in our source code and in the NOTICE files.",
        ),
        ar: para(
          "اسم Zrzur واسم «زرزور» وشعار زرزور هي علامتنا. وتشمل الرخصة المفتوحة الشيفرة البرمجية لا العلامة. يجوز لك ذكر زرزور بالاسم، لكن لا تستخدم اسمنا أو شعارنا بطريقة توحي بأننا صنعنا مشروعك أو سيرفرك أو بوتك أو منتجك، أو نعتمده، أو نشاركك فيه، إلا باتفاق مكتوب معنا.",
          "تعتمد أجزاء من الخدمة على برمجيات مفتوحة المصدر من مشاريع أخرى، وتُحفظ إشعارات حقوقها وتراخيصها في شيفرتنا المصدرية وفي ملفات NOTICE.",
        ),
      },
    ),
    section(
      "ending",
      { en: "Suspension and ending your use", ar: "الإيقاف وإنهاء الاستخدام" },
      {
        en: para(
          "You can stop using Zrzur and delete your account at any time in the app settings. Deleting your account does not by itself cancel a paid subscription bought through an app store; see the Paid Services terms.",
          "We may remove content, limit features, or suspend or close an account or Server if you break these terms or our policies, if the law requires it, or to protect users or the Service. We follow the Enforcement and Appeals policy: we tell you what we did and why, and you can appeal in the app. In serious cases (for example, child sexual abuse material or credible threats of violence) we may act immediately and without warning.",
          "We may stop offering the Service or a feature. If we close the whole Service, we will give at least [30] days' notice where possible so you can download your data, and we will refund unused prepaid time on paid services.",
        ),
        ar: para(
          "يمكنك التوقف عن استخدام زرزور وحذف حسابك في أي وقت من إعدادات التطبيق. ولا يُلغي حذف الحساب وحده اشتراكًا مدفوعًا اشتريته عبر متجر تطبيقات؛ راجع شروط الخدمات المدفوعة.",
          "يجوز لنا إزالة محتوى، أو تقييد ميزات، أو إيقاف حساب أو سيرفر أو إغلاقه، إذا خالفت هذه الشروط أو سياساتنا، أو إذا أوجب القانون ذلك، أو لحماية المستخدمين أو الخدمة. ونتّبع سياسة الإنفاذ والاعتراض: نخبرك بما فعلناه وسببه، ويمكنك الاعتراض من داخل التطبيق. وفي الحالات الخطيرة (مثل مواد الاعتداء الجنسي على الأطفال أو التهديدات الجدية بالعنف) قد نتصرّف فورًا ودون إنذار.",
          "يجوز لنا إيقاف تقديم الخدمة أو ميزة منها. وإذا أغلقنا الخدمة كلها، فسنُعلن ذلك قبل [30] يومًا على الأقل متى أمكن، لتتمكّن من تنزيل بياناتك، وسنردّ قيمة المدة المدفوعة مسبقًا غير المستخدمة في الخدمات المدفوعة.",
        ),
      },
    ),
    section(
      "liability",
      { en: "Warranties and liability", ar: "الضمانات والمسؤولية" },
      {
        en: para(
          "We work hard to keep Zrzur fast, secure and available, but we cannot promise it will always be free of errors or interruptions. Keep your own copies of anything important.",
          "To the extent the law allows, the Service is provided \"as is\". Nothing in these terms limits liability that cannot be limited by law — including for death or personal injury caused by negligence, for fraud, for intent or gross negligence, or under mandatory consumer-protection law.",
          "Otherwise, if we are liable for slight negligence, we are liable only for breach of an essential obligation of these terms and only for damage that was typical and foreseeable when you started using the Service. For free use of the Service, our total liability is limited to [amount]; for paid services, to the amount you paid us in the 12 months before the event.",
        ),
        ar: para(
          "نعمل جاهدين لإبقاء زرزور سريعًا وآمنًا ومتاحًا، لكننا لا نستطيع أن نعد بأنه سيبقى دائمًا خاليًا من الأخطاء أو الانقطاعات. احتفظ بنسخ خاصة بك من كل ما هو مهم.",
          "في الحدود التي يسمح بها القانون، تُقدَّم الخدمة «كما هي». ولا يحدّ أي شيء في هذه الشروط من المسؤولية التي لا يجوز قانونًا الحدّ منها — ومنها المسؤولية عن الوفاة أو الإصابة الجسدية الناتجة عن الإهمال، أو عن الاحتيال، أو عن العمد أو الإهمال الجسيم، أو بموجب قوانين حماية المستهلك الإلزامية.",
          "وفيما عدا ذلك، إذا كنّا مسؤولين عن إهمال بسيط، فلا نُسأل إلا عن الإخلال بالتزام جوهري في هذه الشروط، وعن الضرر المعتاد والمتوقّع عند بدء استخدامك الخدمة فقط. وتقتصر مسؤوليتنا الكلية عن الاستخدام المجاني على [amount]، وعن الخدمات المدفوعة على ما دفعته لنا خلال الأشهر الاثني عشر السابقة للحادثة.",
        ),
      },
    ),
    section(
      "law",
      { en: "Governing law and disputes", ar: "القانون الواجب التطبيق والنزاعات" },
      {
        en: para(
          "These terms are governed by [Governing law / courts]. If you are a consumer, you also keep the protection of the mandatory laws of the country where you live, and you may bring a claim in your local courts.",
          "Please contact support@zrzur.com first so we can try to solve the problem together. [Information on consumer dispute resolution bodies, if required.]",
        ),
        ar: para(
          "تخضع هذه الشروط لـ[Governing law / courts]. وإذا كنت مستهلكًا، فتبقى لك الحماية التي تمنحها القوانين الإلزامية في بلد إقامتك، ويحق لك رفع دعواك أمام محاكم بلدك.",
          "نرجو أن تتواصل أولًا مع support@zrzur.com لنحاول حلّ المشكلة معًا. [Information on consumer dispute resolution bodies, if required.]",
        ),
      },
    ),
    section(
      "changes",
      { en: "Changes to these terms", ar: "التغييرات على هذه الشروط" },
      {
        en: para(
          "We may update these terms when the Service or the law changes. For important changes we will tell you in the app or by email at least [30] days before they take effect, and the app will ask you to read and accept the new version. Small changes that do not affect your rights (such as fixing typos) may take effect right away.",
          "If you do not agree with a change, you can stop using the Service and delete your account before the change takes effect. The date at the top of this page shows the current version.",
        ),
        ar: para(
          "قد نحدّث هذه الشروط عند تغيّر الخدمة أو القانون. وفي التغييرات المهمة سنخبرك داخل التطبيق أو بالبريد الإلكتروني قبل [30] يومًا على الأقل من نفاذها، وسيطلب منك التطبيق قراءة النسخة الجديدة وقبولها. أما التغييرات الصغيرة التي لا تمسّ حقوقك (كتصحيح الأخطاء الإملائية) فقد تسري فورًا.",
          "وإن لم توافق على تغيير ما، فيمكنك التوقف عن استخدام الخدمة وحذف حسابك قبل نفاذه. ويبيّن التاريخ في أعلى هذه الصفحة النسخة الحالية.",
        ),
      },
    ),
    section(
      "contact",
      { en: "Contact", ar: "التواصل" },
      {
        en: "Questions about these terms and security issues: support@zrzur.com. Our legal details are on the Operator Information page.",
        ar: "للأسئلة عن هذه الشروط وللمشكلات الأمنية: support@zrzur.com. وتجد بياناتنا القانونية في صفحة بيانات الجهة المشغّلة.",
      },
    ),
  ],
});

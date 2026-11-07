import { doc, list, para, section } from "./shared.ts";

export const pluginPolicy = doc({
  slug: "plugin-policy",
  group: "builders",
  title: { en: "Plugin Policy", ar: "سياسة الإضافات",
    de: "Richtlinie für Erweiterungen" },
  intro: {
    en: "What client plugins may and may not do, how we review them, and who is responsible when you turn one on.",
    ar: "ما يجوز للإضافات في التطبيق فعله وما لا يجوز، وكيف نراجعها، ومن المسؤول عند تفعيلك إحداها.",
  },
  sections: [
    section(
      "what",
      { en: "What plugins are", ar: "ما الإضافات" },
      {
        en: "Plugins are small add-ons that change how the Zrzur app looks or works on your device — for example, a new panel, a theme or a shortcut. They run inside your app with your account, so they must be trustworthy. This policy applies to plugin authors and to plugins published in the Zrzur plugin directory.",
        ar: "الإضافات ملحقات صغيرة تغيّر شكل تطبيق زرزور أو طريقة عمله على جهازك — مثل لوحة جديدة أو سمة أو اختصار. وهي تعمل داخل تطبيقك وبحسابك، لذا يجب أن تكون جديرة بالثقة. وتسري هذه السياسة على مؤلفي الإضافات وعلى الإضافات المنشورة في دليل إضافات زرزور.",
      },
    ),
    section(
      "may",
      { en: "Plugins may", ar: "يجوز للإضافات" },
      {
        en: list(
          "change the look and layout of the app on your own device;",
          "add tools and shortcuts that act only when you ask;",
          "use the plugin interfaces and permissions the app offers, after you approve them;",
          "store their own settings on your device.",
        ),
        ar: list(
          "تغيير شكل التطبيق وتخطيطه على جهازك أنت؛",
          "إضافة أدوات واختصارات لا تعمل إلا عندما تطلب ذلك؛",
          "استخدام واجهات الإضافات وصلاحياتها التي يوفّرها التطبيق، بعد موافقتك عليها؛",
          "حفظ إعداداتها الخاصة على جهازك.",
        ),
      },
    ),
    section(
      "must-not",
      { en: "Plugins must not", ar: "لا يجوز للإضافات" },
      {
        en: list(
          "read, copy or send your login token, password, session or keys;",
          "track you or other users, or send analytics or message content to any server without your clear, separate permission;",
          "inject advertising, affiliate links or paid promotions into the app;",
          "contain malware, crypto-miners, hidden code, or code that downloads and runs new code without review;",
          "send messages, join Servers or take any action on your behalf without you asking;",
          "hide or change other people's messages to mislead you, or hide safety warnings, reports, or the \"Ad\" label on Discover promotion;",
          "unlock paid features such as Feather perks without paying, or get around blocks, bans and privacy settings;",
          "break the Community Guidelines or pretend to be an official Zrzur feature.",
        ),
        ar: list(
          "قراءة رمز دخولك أو كلمة مرورك أو جلستك أو مفاتيحك، أو نسخها، أو إرسالها؛",
          "تتبّعك أو تتبّع المستخدمين الآخرين، أو إرسال بيانات تحليلية أو محتوى الرسائل إلى أي سيرفر دون إذن واضح ومستقل منك؛",
          "إدخال إعلانات أو روابط تسويق بالعمولة أو ترويج مدفوع إلى التطبيق؛",
          "احتواء برمجيات ضارّة، أو برامج تعدين العملات الرقمية، أو شيفرة مخفية، أو شيفرة تنزّل شيفرة جديدة وتشغّلها دون مراجعة؛",
          "إرسال الرسائل أو الانضمام إلى السيرفرات أو اتخاذ أي إجراء نيابةً عنك دون طلبك؛",
          "إخفاء رسائل الآخرين أو تغييرها لتضليلك، أو إخفاء تحذيرات السلامة أو البلاغات أو وسم «إعلان» على الترويج في «اكتشف»؛",
          "فتح الميزات المدفوعة كمزايا «ريشة» دون دفع، أو تجاوز الحجب والحظر وإعدادات الخصوصية؛",
          "مخالفة إرشادات المجتمع، أو الادعاء بأنها ميزة رسمية من زرزور.",
        ),
      },
    ),
    section(
      "review",
      { en: "Review in the plugin directory", ar: "المراجعة في دليل الإضافات" },
      {
        en: list(
          "Plugins in the Zrzur plugin directory are reviewed before they are published, and again when they are updated.",
          "The source code must be readable (not hidden or obfuscated) so reviewers can check it.",
          "The plugin page must list exactly what the plugin does and which permissions it asks for.",
          "Review lowers risk but cannot guarantee that a plugin is safe or bug-free.",
        ),
        ar: list(
          "تُراجَع الإضافات في دليل إضافات زرزور قبل نشرها، ومرة أخرى عند تحديثها.",
          "يجب أن تكون الشيفرة المصدرية مقروءة (غير مخفية أو مموّهة) ليتمكّن المراجعون من فحصها.",
          "يجب أن تذكر صفحة الإضافة بدقة ما تفعله الإضافة والصلاحيات التي تطلبها.",
          "المراجعة تقلّل المخاطر، لكنها لا تضمن أن الإضافة آمنة أو خالية من الأخطاء.",
        ),
      },
    ),
    section(
      "removal",
      { en: "Removal", ar: "الإزالة" },
      {
        en: "We may remove a plugin from the directory, turn it off remotely in the app, or block its author if it breaks this policy or puts users at risk. For security problems we act immediately; otherwise we tell the author and give time to fix the problem. Authors can appeal as described in the Enforcement and Appeals policy.",
        ar: "يجوز لنا إزالة إضافة من الدليل، أو تعطيلها عن بُعد في التطبيق، أو حظر مؤلفها، إذا خالفت هذه السياسة أو عرّضت المستخدمين للخطر. وفي المشكلات الأمنية نتصرّف فورًا؛ وفي غيرها نُعلم المؤلف ونمنحه وقتًا لإصلاح المشكلة. ويحق للمؤلفين الاعتراض كما توضّح سياسة الإنفاذ والاعتراض.",
      },
    ),
    section(
      "your-risk",
      { en: "Turning on plugins is your choice", ar: "تفعيل الإضافات اختيارك" },
      {
        en: para(
          "Plugins are made by third parties, not by Zrzur. You turn them on at your own risk. Check the permissions a plugin asks for before you approve them. Plugins from outside the directory are not reviewed at all.",
          "If something goes wrong, Safe Mode turns off all plugins at once. Bugs in the app caused by plugins are not covered by Zrzur support.",
        ),
        ar: para(
          "الإضافات يصنعها أطراف آخرون، لا زرزور، وأنت تفعّلها على مسؤوليتك. تحقّق من الصلاحيات التي تطلبها الإضافة قبل الموافقة عليها. والإضافات من خارج الدليل لا تخضع لأي مراجعة.",
          "إذا حدث خلل، فإن الوضع الآمن يعطّل جميع الإضافات دفعة واحدة. ولا يشمل دعم زرزور الأعطال التي تسبّبها الإضافات في التطبيق.",
        ),
      },
    ),
    section(
      "authors",
      { en: "Authors are responsible", ar: "المؤلفون مسؤولون" },
      {
        en: list(
          "You are responsible for your plugin, its updates, and the data it handles.",
          "Follow the Developer Terms for any data your plugin processes, and publish a privacy notice if it sends any data off the device.",
          "Use only code, images and fonts you have the right to use, and record their licences.",
          "Report security problems in your plugin, or in Zrzur, to security@zrzur.com.",
        ),
        ar: list(
          "أنت مسؤول عن إضافتك وتحديثاتها والبيانات التي تتعامل معها.",
          "التزم بشروط المطوّرين في أي بيانات تعالجها إضافتك، وانشر إشعار خصوصية إذا كانت ترسل أي بيانات خارج الجهاز.",
          "استخدم فقط الشيفرة والصور والخطوط التي يحق لك استخدامها، ودوّن تراخيصها.",
          "أبلغ عن المشكلات الأمنية في إضافتك أو في زرزور إلى security@zrzur.com.",
        ),
      },
    ),
  ],
});

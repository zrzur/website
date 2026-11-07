import type { Language } from "./i18n.ts";
import type { CategoryId, FieldError, Kind } from "./report-logic.ts";

/** Where people write when the form cannot be used (one place) */
export const CONTACT_EMAIL = "support@zrzur.com";

type Text = {
  title: string;
  intro: string;
  kindLegend: string;
  kinds: Record<Kind, string>;
  locationLabel: string;
  locationHint: string;
  categoryLegend: string;
  categories: Record<CategoryId, string>;
  csamNote: string;
  descriptionLabel: string;
  descriptionHint: string;
  lawLabel: string;
  lawHint: string;
  nameLabel: string;
  emailLabel: string;
  optionalForCsam: string;
  contactHint: string;
  goodFaith: string;
  submit: string;
  sending: string;
  doneTitle: string;
  doneBody: string;
  referenceLabel: string;
  receiptMail: string;
  another: string;
  errors: Record<FieldError, string>;
  failed: string;
  tooMany: string;
  captchaFailed: string;
  unavailable: string;
  details: string;
  privacy: string;
  privacyLink: string;
  captchaNote: string;
  inApp: string;
};

export const reportText: Record<Language, Text> = {
  en: {
    title: "Report illegal content",
    intro:
      "You do not need an account. Tell us what the content is, where it is and why you think it is illegal. We read every report.",
    kindLegend: "What are you reporting?",
    kinds: {
      Message: "A message",
      Server: "A server",
      User: "A person",
      Bot: "A bot",
      DiscoverServer: "A Discover listing",
      CommunityItem: "A design or profile effect",
      Attachment: "A file",
    },
    locationLabel: "Link or ID",
    locationHint: "A link to the message, server, profile, Discover listing, design, profile effect or file, or its ID.",
    categoryLegend: "Why is it illegal?",
    categories: {
      illegal: "Illegal content (other)",
      threat: "A threat to someone's life or safety",
      csam: "Child sexual abuse material",
      hate: "Hate, threats or violent extremism",
      scam: "Fraud or scam",
      malware: "Malware",
      harassment: "Harassment",
      privacy: "Privacy or personal data",
      copyright: "Copyright or trademark",
      flashing: "Flashing or harmful: it could cause seizures",
      other: "Something else",
    },
    csamNote: "For child sexual abuse material your name and email are optional.",
    descriptionLabel: "Explain why it is illegal",
    descriptionHint: "At least 10 characters. Say what you saw.",
    lawLabel: "Which law, if you know (optional)",
    lawHint: "For example the name of the law and the section.",
    nameLabel: "Your name",
    emailLabel: "Your email",
    optionalForCsam: "optional",
    contactHint: "We send a receipt to this address and tell you the decision.",
    goodFaith:
      "I believe in good faith that the information in this report is accurate and complete.",
    submit: "Send report",
    sending: "Sending…",
    doneTitle: "We received your report",
    doneBody: "Thank you. We will look at it.",
    referenceLabel: "Your reference",
    receiptMail: "We sent a receipt to your email.",
    another: "Send another report",
    errors: {
      location: "Add a link or ID (up to 500 characters).",
      description: "Describe the problem in 10 to 2000 characters.",
      name: "Add your name (up to 100 characters).",
      email: "Add a valid email address.",
      goodFaith: "Please confirm the statement.",
      law: "The law name is too long (up to 200 characters).",
    },
    failed: "The report could not be sent. Please try again in a moment.",
    tooMany: "Too many reports from this connection. Please try again in an hour.",
    captchaFailed: `Please solve the check and try again. If it does not appear, write to ${CONTACT_EMAIL}.`,
    unavailable: `Reporting is not available on this page right now. Write to ${CONTACT_EMAIL}.`,
    details: "Details",
    privacy:
      "We use your details only to handle this report and to tell you the result. Our reviewers see them; the reported person does not. We delete your name and email 12 months after the case is closed.",
    privacyLink: "Privacy Policy",
    captchaNote:
      "If a check is shown, it is provided by hCaptcha, which receives your browser data to tell people from bots.",
    inApp: "Signed in? You can also use the Report button inside the app.",
  },
  de: {
    title: "Rechtswidrige Inhalte melden",
    intro:
      "Du brauchst kein Konto. Sag uns, um welchen Inhalt es geht, wo er ist und warum du ihn für rechtswidrig hältst. Wir lesen jede Meldung.",
    kindLegend: "Was meldest du?",
    kinds: {
      Message: "Eine Nachricht",
      Server: "Einen Server",
      User: "Eine Person",
      Bot: "Einen Bot",
      DiscoverServer: "Einen Eintrag bei „Entdecken“",
      CommunityItem: "Ein Design oder einen Profileffekt",
      Attachment: "Eine Datei",
    },
    locationLabel: "Link oder ID",
    locationHint: "Ein Link zur Nachricht, zum Server, zum Profil, zum Eintrag bei „Entdecken“, zum Design, zum Profileffekt oder zur Datei, oder die ID.",
    categoryLegend: "Warum ist es rechtswidrig?",
    categories: {
      illegal: "Rechtswidriger Inhalt (sonstiges)",
      threat: "Eine Bedrohung für Leben oder Sicherheit",
      csam: "Darstellung sexuellen Kindesmissbrauchs",
      hate: "Hass, Drohungen oder gewalttätiger Extremismus",
      scam: "Betrug",
      malware: "Schadsoftware",
      harassment: "Belästigung",
      privacy: "Privatsphäre oder personenbezogene Daten",
      copyright: "Urheberrecht oder Marke",
      flashing: "Blinkend oder schädlich: Es könnte Anfälle auslösen",
      other: "Etwas anderes",
    },
    csamNote: "Bei Darstellungen sexuellen Kindesmissbrauchs sind Name und E-Mail freiwillig.",
    descriptionLabel: "Erkläre, warum es rechtswidrig ist",
    descriptionHint: "Mindestens 10 Zeichen. Schreib, was du gesehen hast.",
    lawLabel: "Welches Gesetz, falls bekannt (freiwillig)",
    lawHint: "Zum Beispiel Name des Gesetzes und Paragraf.",
    nameLabel: "Dein Name",
    emailLabel: "Deine E-Mail",
    optionalForCsam: "freiwillig",
    contactHint: "Wir schicken eine Bestätigung an diese Adresse und teilen dir die Entscheidung mit.",
    goodFaith:
      "Ich bin in gutem Glauben überzeugt, dass die Angaben in dieser Meldung richtig und vollständig sind.",
    submit: "Meldung senden",
    sending: "Wird gesendet…",
    doneTitle: "Wir haben deine Meldung erhalten",
    doneBody: "Danke. Wir sehen sie uns an.",
    referenceLabel: "Dein Aktenzeichen",
    receiptMail: "Wir haben dir eine Bestätigung per E-Mail geschickt.",
    another: "Weitere Meldung senden",
    errors: {
      location: "Gib einen Link oder eine ID an (bis 500 Zeichen).",
      description: "Beschreibe das Problem in 10 bis 2000 Zeichen.",
      name: "Gib deinen Namen an (bis 100 Zeichen).",
      email: "Gib eine gültige E-Mail-Adresse an.",
      goodFaith: "Bitte bestätige die Erklärung.",
      law: "Der Gesetzesname ist zu lang (bis 200 Zeichen).",
    },
    failed: "Die Meldung konnte nicht gesendet werden. Versuch es gleich noch einmal.",
    tooMany: "Zu viele Meldungen von dieser Verbindung. Versuch es in einer Stunde wieder.",
    captchaFailed: `Bitte löse die Prüfung und versuch es erneut. Wenn sie nicht erscheint, schreib an ${CONTACT_EMAIL}.`,
    unavailable: `Melden ist auf dieser Seite gerade nicht möglich. Schreib an ${CONTACT_EMAIL}.`,
    details: "Details",
    privacy:
      "Wir nutzen deine Angaben nur, um diese Meldung zu bearbeiten und dir das Ergebnis mitzuteilen. Unsere Prüfenden sehen sie, die gemeldete Person nicht. Name und E-Mail löschen wir 12 Monate nach Abschluss des Falls.",
    privacyLink: "Datenschutzerklärung",
    captchaNote:
      "Wenn eine Prüfung angezeigt wird, stammt sie von hCaptcha, das dafür Daten deines Browsers erhält, um Menschen von Bots zu unterscheiden.",
    inApp: "Angemeldet? Du kannst auch die Melden-Schaltfläche in der App nutzen.",
  },
  ar: {
    title: "الإبلاغ عن محتوى مخالف للقانون",
    intro:
      "لا تحتاج إلى حساب. أخبرنا ما المحتوى وأين يوجد ولماذا تراه مخالفاً للقانون. نقرأ كل بلاغ.",
    kindLegend: "ما الذي تبلّغ عنه؟",
    kinds: {
      Message: "رسالة",
      Server: "سيرفر",
      User: "شخص",
      Bot: "بوت",
      DiscoverServer: "إدراج في «اكتشف»",
      CommunityItem: "تصميم أو مؤثر ملف شخصي",
      Attachment: "ملف",
    },
    locationLabel: "الرابط أو المعرّف",
    locationHint: "رابط الرسالة أو السيرفر أو الملف الشخصي أو الإدراج في «اكتشف» أو التصميم أو مؤثر الملف الشخصي أو الملف، أو معرّفه.",
    categoryLegend: "لماذا هو مخالف للقانون؟",
    categories: {
      illegal: "محتوى مخالف للقانون (غير ذلك)",
      threat: "تهديد لحياة شخص أو سلامته",
      csam: "مواد اعتداء جنسي على الأطفال",
      hate: "كراهية أو تهديد أو تطرف عنيف",
      scam: "احتيال",
      malware: "برمجيات خبيثة",
      harassment: "مضايقة",
      privacy: "الخصوصية أو البيانات الشخصية",
      copyright: "حقوق النشر أو العلامة التجارية",
      flashing: "وميض أو ضرر: قد يسبب نوبات صرع",
      other: "سبب آخر",
    },
    csamNote: "في حالة مواد الاعتداء الجنسي على الأطفال يكون الاسم والبريد الإلكتروني اختياريين.",
    descriptionLabel: "اشرح لماذا هو مخالف للقانون",
    descriptionHint: "10 أحرف على الأقل. اذكر ما رأيته.",
    lawLabel: "أي قانون، إن كنت تعرفه (اختياري)",
    lawHint: "مثلاً اسم القانون ورقم المادة.",
    nameLabel: "اسمك",
    emailLabel: "بريدك الإلكتروني",
    optionalForCsam: "اختياري",
    contactHint: "نرسل إيصالاً إلى هذا العنوان ونخبرك بالقرار.",
    goodFaith: "أقرّ بحسن نية أن المعلومات الواردة في هذا البلاغ صحيحة وكاملة.",
    submit: "إرسال البلاغ",
    sending: "جارٍ الإرسال…",
    doneTitle: "استلمنا بلاغك",
    doneBody: "شكراً لك. سننظر فيه.",
    referenceLabel: "الرقم المرجعي",
    receiptMail: "أرسلنا إيصالاً إلى بريدك الإلكتروني.",
    another: "إرسال بلاغ آخر",
    errors: {
      location: "أضف رابطاً أو معرّفاً (حتى 500 حرف).",
      description: "صف المشكلة بين 10 و2000 حرف.",
      name: "أضف اسمك (حتى 100 حرف).",
      email: "أضف بريداً إلكترونياً صحيحاً.",
      goodFaith: "يرجى تأكيد الإقرار.",
      law: "اسم القانون طويل جداً (حتى 200 حرف).",
    },
    failed: "تعذّر إرسال البلاغ. حاول مرة أخرى بعد قليل.",
    tooMany: "عدد البلاغات من هذا الاتصال كبير. حاول مجدداً بعد ساعة.",
    captchaFailed: `يرجى إكمال التحقق ثم المحاولة مرة أخرى. إن لم يظهر التحقق، اكتب إلى ${CONTACT_EMAIL}.`,
    unavailable: `الإبلاغ غير متاح في هذه الصفحة الآن. اكتب إلى ${CONTACT_EMAIL}.`,
    details: "التفاصيل",
    privacy:
      "نستخدم بياناتك لمعالجة هذا البلاغ وإبلاغك بالنتيجة فقط. يراها مراجعونا ولا يراها الشخص المبلَّغ عنه. نحذف اسمك وبريدك الإلكتروني بعد 12 شهراً من إغلاق القضية.",
    privacyLink: "سياسة الخصوصية",
    captchaNote:
      "إن ظهر اختبار تحقق فهو من hCaptcha، الذي يتلقى بيانات متصفحك للتمييز بين البشر والبرامج الآلية.",
    inApp: "هل سجّلت الدخول؟ يمكنك أيضاً استخدام زر الإبلاغ داخل التطبيق.",
  },
};

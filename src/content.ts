import type { Language } from "./i18n";

export type { Language };
/** Site copy in every listed language (test/i18n.test.mjs checks completeness). */
export type Localized = Record<Language, string>;
/** Texts that may not exist in every language yet (legal drafts): English is the fallback. */
export type Partial = { en: string } & { [L in Language]?: string };
export const localize = (value: Partial, language: Language) =>
  value[language] ?? value.en;

export const features = [
  {
    id: "channels",
    view: "lobby",
    icon: "hash",
    title: {
      en: "Every conversation has a place.",
      de: "Jedes Gespräch hat seinen Platz.",
      ar: "لكل حديث مكانه.",
    },
    body: {
      en: "Servers for your communities, with categories and channels for every interest. Everyday chat, announcements and shared files each stay easy to follow.",
      de: "Server für deine Communitys, mit Kategorien und Kanälen für jedes Thema. Alltagsgespräche, Ankündigungen und geteilte Dateien bleiben übersichtlich.",
      ar: "أنشئ سيرفرات لمجتمعاتك، ونظّم المواضيع في فئات وقنوات. اجعل الإعلانات والملفات والمحادثات اليومية سهلة المتابعة.",
    },
    detail: {
      en: "Servers · Categories · Text channels",
      de: "Server · Kategorien · Textkanäle",
      ar: "سيرفرات · فئات · قنوات نصية",
    },
  },
  {
    id: "voice",
    view: "voice",
    icon: "headphones",
    title: {
      en: "Talk, play and share your screen.",
      de: "Reden, spielen, Bildschirm teilen.",
      ar: "تحدّث والعب وشارك شاشتك.",
    },
    body: {
      en: "Drop into a voice channel with your friends, and share your screen when you want to show something.",
      de: "Komm mit deinen Freunden in einen Sprachkanal und teile deinen Bildschirm, wenn du etwas zeigen willst.",
      ar: "انضم إلى قناة صوتية مع أصدقائك، وشارك شاشتك عندما تريد أن تعرض شيئًا.",
    },
    detail: {
      en: "Voice channels · Screen sharing",
      de: "Sprachkanäle · Bildschirmfreigabe",
      ar: "قنوات صوتية · مشاركة الشاشة",
    },
  },
  {
    id: "sharing",
    view: "chat",
    icon: "image",
    title: {
      en: "More than words.",
      de: "Mehr als Worte.",
      ar: "مشاركة تتجاوز الكلمات.",
    },
    body: {
      en: "Images, files, formatting, emoji and reactions. Give ideas and everyday moments the format they deserve.",
      de: "Bilder, Dateien, Formatierung, Emoji und Reaktionen. Gib Ideen und Alltagsmomenten die Form, die sie verdienen.",
      ar: "شارك الصور والملفات، ونسّق الرسائل، واستخدم الرموز التعبيرية والتفاعلات لإضافة معنى إلى الحوار.",
    },
    detail: {
      en: "Images · Files · Reactions",
      de: "Bilder · Dateien · Reaktionen",
      ar: "صور · ملفات · تفاعلات",
    },
  },
  {
    id: "roles",
    view: "settings",
    icon: "shield",
    title: {
      en: "Your community. Clear ground rules.",
      de: "Deine Community. Klare Regeln.",
      ar: "أدوار وصلاحيات واضحة.",
    },
    body: {
      en: "Roles and permissions decide who can read and who can post. Keep announcements, member spaces and team rooms apart.",
      de: "Rollen und Berechtigungen legen fest, wer lesen und wer schreiben darf. Ankündigungen, Mitgliederbereiche und Teamräume bleiben getrennt.",
      ar: "حدّد من يقرأ ومن يشارك، ووزّع مسؤوليات الإدارة والإشراف على الأعضاء المناسبين.",
    },
    detail: {
      en: "Roles · Permissions · Moderation",
      de: "Rollen · Berechtigungen · Moderation",
      ar: "أدوار · صلاحيات · إشراف",
    },
  },
  {
    id: "interests",
    view: "roles",
    icon: "users",
    title: {
      en: "Newcomers pick what they came for.",
      de: "Neue wählen, wofür sie gekommen sind.",
      ar: "يختار الجدد ما جاؤوا من أجله.",
    },
    body: {
      en: "On a first visit, members answer a few questions and get the matching roles right away. They can skip it and change it later.",
      de: "Beim ersten Besuch beantworten Mitglieder ein paar Fragen und bekommen sofort die passenden Rollen. Sie können das überspringen und später ändern.",
      ar: "في الزيارة الأولى يجيب العضو عن بضعة أسئلة ويحصل على الرتب المناسبة فورًا. ويمكنه تخطّي ذلك وتغييره لاحقًا.",
    },
    detail: {
      en: "Interests · Roles · Lobby",
      de: "Interessen · Rollen · Lobby",
      ar: "اهتمامات · رتب · ردهة",
    },
  },
  {
    id: "discover",
    view: "discover",
    icon: "compass",
    title: {
      en: "Find a community worth joining.",
      de: "Finde eine Community, die zu dir passt.",
      ar: "اعثر على مجتمع يستحق الانضمام.",
    },
    body: {
      en: "Browse public servers by topic or search by name and tag, then join in a click.",
      de: "Stöbere in öffentlichen Servern nach Thema oder suche nach Name und Tag, und tritt mit einem Klick bei.",
      ar: "تصفّح السيرفرات العامة حسب الموضوع أو ابحث بالاسم والوسم، ثم انضم بنقرة.",
    },
    detail: {
      en: "Topics · Search · Tags",
      de: "Themen · Suche · Tags",
      ar: "مواضيع · بحث · وسوم",
    },
  },
  {
    id: "appearance",
    view: "light",
    icon: "palette",
    title: {
      en: "The details feel like you.",
      de: "Die Details fühlen sich nach dir an.",
      ar: "تجربة تناسب أسلوبك.",
    },
    body: {
      en: "Dark or light, your own accent colour, and keyboard shortcuts for every action.",
      de: "Dunkel oder hell, deine eigene Akzentfarbe und Tastenkürzel für jede Aktion.",
      ar: "داكن أو فاتح، ولون تمييز تختاره، واختصارات لوحة مفاتيح لكل إجراء.",
    },
    detail: {
      en: "Themes · Accent colour · Shortcuts",
      de: "Themes · Akzentfarbe · Tastenkürzel",
      ar: "مظاهر · لون التمييز · اختصارات",
    },
  },
  {
    id: "open",
    view: "code",
    icon: "code",
    title: {
      en: "Open source at the core.",
      de: "Open Source im Kern.",
      ar: "مفتوح المصدر في أساسه.",
    },
    body: {
      en: "Built on an open-source foundation under the AGPL. Licences, project history and contributor credit stay intact, and the source is public.",
      de: "Auf einer Open-Source-Grundlage unter der AGPL gebaut. Lizenzen, Projektgeschichte und die Nennung der Mitwirkenden bleiben erhalten, der Quellcode ist öffentlich.",
      ar: "نبني على أساس برمجي مفتوح المصدر برخصة AGPL، مع حفظ التراخيص وتاريخ المشروع وحقوق المساهمين، والشيفرة المصدرية متاحة للجميع.",
    },
    detail: {
      en: "Open source · AGPL · Attribution preserved",
      de: "Open Source · AGPL · Namensnennung erhalten",
      ar: "مصدر مفتوح · AGPL · حقوق محفوظة",
    },
  },
] as const;

export const faqs = [
  {
    question: {
      en: "What is Zrzur?",
      de: "Was ist Zrzur?",
      ar: "ما هو زرزور؟",
    },
    answer: {
      en: "A place for friends and communities to talk: servers with text and voice channels, screen sharing, files, roles and member management. It runs in your browser, in Arabic, German and English.",
      de: "Ein Ort, an dem Freunde und Communitys miteinander reden: Server mit Text- und Sprachkanälen, Bildschirmfreigabe, Dateien, Rollen und Mitgliederverwaltung. Es läuft im Browser, auf Arabisch, Deutsch und Englisch.",
      ar: "مكان يتحدث فيه الأصدقاء والمجتمعات: سيرفرات بقنوات نصية وصوتية، ومشاركة الشاشة والملفات، ورتب وإدارة للأعضاء. يعمل من المتصفح، بالعربية والألمانية والإنجليزية.",
    },
  },
  {
    question: {
      en: "Is Zrzur free?",
      de: "Ist Zrzur kostenlos?",
      ar: "هل زرزور مجاني؟",
    },
    answer: {
      en: "Yes. There is nothing to pay in this version: no subscription and no checkout.",
      de: "Ja. In dieser Version gibt es nichts zu bezahlen: kein Abo und keinen Bezahlvorgang.",
      ar: "نعم. لا يوجد ما تدفعه في هذه النسخة: لا اشتراك ولا عملية شراء.",
    },
  },
  {
    question: {
      en: "Do I need to install anything?",
      de: "Muss ich etwas installieren?",
      ar: "هل أحتاج إلى تثبيت شيء؟",
    },
    answer: {
      en: "No. Zrzur runs in any current browser, on a computer or a phone.",
      de: "Nein. Zrzur läuft in jedem aktuellen Browser, auf dem Computer und auf dem Handy.",
      ar: "لا. يعمل زرزور في أي متصفح حديث، على الكمبيوتر والهاتف.",
    },
  },
  {
    question: {
      en: "Is Zrzur only a rename of another project?",
      de: "Ist Zrzur nur eine Umbenennung eines anderen Projekts?",
      ar: "هل زرزور مجرد إعادة تسمية لمشروع آخر؟",
    },
    answer: {
      en: "No. Zrzur is an independent product with its own releases and identity. We build on an open-source foundation and keep working on the app and its services. Licences and contributor credit remain intact; we do not claim authorship of the original code.",
      de: "Nein. Zrzur ist ein eigenständiges Produkt mit eigenen Versionen und eigener Identität. Wir bauen auf einer Open-Source-Grundlage auf und entwickeln App und Dienste weiter. Lizenzen und die Nennung der Mitwirkenden bleiben erhalten; den ursprünglichen Code geben wir nicht als unseren aus.",
      ar: "لا. زرزور منتج مستقل بإصداراته وهويته. نبني على أساس برمجي مفتوح المصدر ونواصل العمل على التطبيق وخدماته. نحافظ على حقوق المساهمين والتراخيص، ولا ننسب تأليف الشيفرة الأصلية إلينا.",
    },
  },
  {
    question: {
      en: "Which languages does Zrzur speak?",
      de: "Welche Sprachen spricht Zrzur?",
      ar: "ما اللغات التي يدعمها زرزور؟",
    },
    answer: {
      en: "The app and this website are available in Arabic (right to left), German and English. More languages will be added once their translations have been reviewed.",
      de: "App und Website gibt es auf Arabisch (von rechts nach links), Deutsch und Englisch. Weitere Sprachen kommen hinzu, sobald ihre Übersetzungen geprüft sind.",
      ar: "التطبيق وهذا الموقع متاحان بالعربية (من اليمين إلى اليسار) والألمانية والإنجليزية. ستُضاف لغات أخرى بعد مراجعة ترجماتها.",
    },
  },
];

const en = {
  brand: "Zrzur",
  home: "Home",
  features: "Features",
  project: "About",
  help: "Guide",
  discover: "Discover",
  open: "Open Zrzur",
  explore: "Explore the features",
  close: "Close",
  menu: "Menu",
  skip: "Skip to content",
  language: "Language",
  themeLight: "Switch to light theme",
  themeDark: "Switch to dark theme",
  top: "Back to top",

  heroTitle: "Where voices gather",
  heroBody:
    "An open-source group chat platform for friends and communities. Create your server and invite your friends in a minute.",
  heroFacts: "Free. In your browser. Nothing to install.",
  flockName: "Zrzur",

  demoAlt: "A live preview of the chat channel in a Zrzur server",
  demoServer: "Game Night",
  demoInitials: "GN",
  demoLobby: "Lobby",
  demoInfo: "Info",
  demoChatCategory: "Chat",
  demoVoiceCategory: "Voice",
  demoAnnouncements: "announcements",
  demoRules: "rules",
  demoChat: "chat",
  demoSquad: "looking-for-group",
  demoLounge: "Game Lounge",
  demoQuiet: "Quiet Room",
  demoPeople1: "Omar",
  demoPeople2: "Lina",
  demoMessage1: "Good evening! Who's ready for game night?",
  demoMessage2: "I am. The Game Lounge is open, join whenever you like.",
  demoMessage3: "Great, I'll be there in two minutes.",
  demoMessage4: "Reminder: the Minecraft tournament is on Friday at 8 pm.",
  demoMessage5: "Signed up 👍",
  demoToday: "Today at 20:07",
  demoNow: "Just now",
  demoYou: "You",
  demoPlaceholder: "Type a word, the flock writes it",
  demoSend: "Send",
  demoNote: "A preview on this page. What you type stays in your browser.",

  tourTitle: "Every conversation has a place.",
  tourBody: "Look around a server. These are screens from the app, with demo accounts.",
  tourLabel: "Screens of Zrzur",
  tabLobby: "Lobby",
  tabChat: "Messages",
  tabRoles: "Roles",
  tabInterests: "Interests",
  tabDiscover: "Discover",
  lobbyBody:
    "The first page a new member sees: what the server is about, where people talk, what to do first and who runs it.",
  lobbyAlt: "A server lobby in Zrzur",
  chatBody:
    "Messages arrive the moment they are sent. Reply, react, share images and files, and mention the people who need to see it.",
  chatAlt: "Messages in a Zrzur text channel",
  commBody:
    "Channels and categories for every topic, roles that decide who sees what, and moderation tools for when the community grows.",
  commAlt: "Server settings in Zrzur, listing the server's roles",
  rolesBody:
    "On their first visit, members pick what interests them and get those roles right away. They can skip it and change it later from the server menu.",
  rolesAlt: "The interests window when joining a server",
  discoverBody:
    "Browse public servers by topic or search by name and tag, see what each one is about and which language it speaks, and join in a click.",
  discoverAlt: "Discover public servers in Zrzur",

  voiceTitle: "Hop in. Talk. Share your screen.",
  voiceBody:
    "Voice channels are always open: join with one click, leave when you're done. Share your screen to show a game, a design or a bug.",
  voiceP1: "One click to join a voice channel",
  voiceP2: "Screen sharing from the call",
  voiceP3: "Microphone and audio settings",
  voiceAlt: "The voice channels of a Zrzur server, with Lina and Omar in the Game Lounge",

  langTitle: "In your language. Really.",
  langBody:
    "Arabic reads right to left across the whole app. German and English get the same care, with no half-translated screens.",
  langAltAr: "Zrzur on a phone in Arabic",
  langAltEn: "Zrzur on a phone in English",
  langAltDe: "Zrzur on a phone in German",
  langGreeting: "Hello|مرحبًا|Hallo",

  openTitle: "Free to use. Open to read.",
  openBody:
    "There is nothing to pay in this version. The source code is public under the AGPL, so anyone can see how Zrzur works.",
  openP1: "No subscription and no checkout",
  openP2: "Public source code under the AGPL",
  openP3: "Licences and contributor credit preserved",

  faqTitle: "Good questions.",
  ctaTitle: "Your next good conversation starts with hello.",
  ctaBody: "Make a little room for your people.",

  footerTag: "A place for your people.",
  footerProduct: "Product",
  footerProject: "Project",
  footerResources: "Resources",
  footerLegal: "Legal",
  source: "Source code",
  licences: "Licences and attribution",
  thirdParty: "Third-party notices",
  questions: "FAQ",
  gettingStarted: "Getting started",
  safety: "Safety and guidelines",
  feedback: "Contact support",
  allPolicies: "All policies",
  draftNote: "Policies are drafts pending legal review.",
  copyright: "© 2026 Zrzur",
  footerAttribution:
    "Independent Zrzur releases. Open-source licences and attribution preserved.",

  featuresTitle: "For your conversations.\nFor your community.",
  featuresBody:
    "Organised chats, voice channels and screen sharing, shared files, and clear roles and permissions, in one app.",

  projectTitle: "A bird that never lives alone.",
  projectBody:
    "The starling, زرزور in Arabic, flies in huge flocks and talks to the others in many voices. Zrzur is built on the same idea: a place where friends and communities gather.",
  projectQuote: "Communication comes first. Development keeps it moving.",
  projectP1:
    "Zrzur ships its own product line. The open-source foundation is a starting point, not the limit of the project. We work on the communication experience and on the application and services it needs.",
  projectP2:
    "Our focus includes conversations, communities, voice, performance, member management, and getting Arabic, German and English right, including right-to-left layouts.",
  projectP3:
    "Zrzur is new, and it runs in the browser. It is free to use, and there is nothing to pay in this version.",
  projectFeedbackTitle: "Tell us what you think.",
  projectFeedbackBody: "If something breaks or something is missing, write to us.",
  pillarCommunication: "A place to connect",
  pillarCommunicationBody:
    "Chats, channels and communities, with tools to organise conversations, share files and manage members.",
  pillarLanguage: "Languages done properly",
  pillarLanguageBody:
    "Clear wording in every language, right-to-left layouts for Arabic, and no half-translated screens.",
  pillarDevelopment: "Always improving",
  pillarDevelopmentBody:
    "We keep improving the app, the services behind it, and how they work together every day.",
  licensesTitle: "Respect the work. Preserve the source.",
  licensesBody:
    "The AGPL and other applicable component licences remain in effect. Copyright notices, attribution and network source availability obligations are preserved. We do not claim that the original code was written by us.",
  storyNote:
    "Upstream history, licences and contributor attribution are preserved.",

  downloadTitle: "Nothing to download.",
  downloadBody:
    "Zrzur runs in any current browser on a computer or a phone. Open it and you are in, always on the latest version.",
  trustTitle: "Stay safe",
  trustBody:
    "The only official address is zrzur.com. We do not send installers, so a download offered in Zrzur's name is not from us.",

  helpTitle: "Start with hello.\nMake it your space.",
  helpBody: "A short guide to finding your way around Zrzur.",
  guideGreeting: "Hello|مرحبًا|Hallo",
  step1: "Open Zrzur",
  step1Body:
    "Open the web app, then sign in or create an account. Confirm your email address and pick a username.",
  step2: "Find your people",
  step2Body:
    "Join a server through an invite link, find a public one in Discover, or create a server for your friends.",
  step3: "Give every topic a place",
  step3Body:
    "Create text and voice channels, put them in categories, and set member roles and permissions.",
  step4: "Make yourself at home",
  step4Body:
    "Set up your profile, choose a theme and your language, and adjust notifications in the settings.",

  modalTitle: "Your space is almost here.",
  modalBody:
    "The public web app address has not been switched on yet. You can still explore the features and real screens of the app.",

  notFound: "This conversation took a different turn.",
  notFoundBody: "The page you're looking for isn't here. Let's take you home.",
  backHome: "Back home",

  legalTitle: "Legal and policies",
  legalIntro:
    "Terms, privacy and community guidelines, plus the rules for servers, Discover, developers, creators and paid services.",
  documents: "Documents",
  docContents: "Document contents",
  draftSources: "Draft reference sources",
  draftSourcesBody:
    "Upstream documents are linked for comparison; their operator and hosting details are not Zrzur's.",
  legalLanguageNote:
    "This policy is available in English and Arabic. A reviewed German version will follow.",
};

type Labels = typeof en;

const de: Labels = {
  brand: "Zrzur",
  home: "Startseite",
  features: "Funktionen",
  project: "Über uns",
  help: "Anleitung",
  discover: "Entdecken",
  open: "Zrzur öffnen",
  explore: "Funktionen ansehen",
  close: "Schließen",
  menu: "Menü",
  skip: "Zum Inhalt springen",
  language: "Sprache",
  themeLight: "Zum hellen Design wechseln",
  themeDark: "Zum dunklen Design wechseln",
  top: "Nach oben",

  heroTitle: "Wo Stimmen zusammenkommen",
  heroBody:
    "Eine Open-Source-Gruppenchat-Plattform für Freunde und Communities. Erstelle deinen Server und lade deine Freunde in einer Minute ein.",
  heroFacts: "Kostenlos. Im Browser. Nichts zu installieren.",
  flockName: "Zrzur",

  demoAlt: "Eine Live-Vorschau des Chatkanals auf einem Zrzur-Server",
  demoServer: "Spieleabend",
  demoInitials: "S",
  demoLobby: "Lobby",
  demoInfo: "Info",
  demoChatCategory: "Chat",
  demoVoiceCategory: "Sprache",
  demoAnnouncements: "ankündigungen",
  demoRules: "regeln",
  demoChat: "chat",
  demoSquad: "team-suche",
  demoLounge: "Spiele-Lounge",
  demoQuiet: "Ruheraum",
  demoPeople1: "Omar",
  demoPeople2: "Lina",
  demoMessage1: "Guten Abend! Wer ist bereit für den Spieleabend?",
  demoMessage2: "Ich bin dabei. Die Spiele-Lounge ist offen, kommt einfach dazu.",
  demoMessage3: "Super, bin in zwei Minuten da.",
  demoMessage4: "Erinnerung: Das Minecraft-Turnier ist am Freitag um 20 Uhr.",
  demoMessage5: "Bin angemeldet 👍",
  demoToday: "Heute um 20:07",
  demoNow: "Gerade eben",
  demoYou: "Du",
  demoPlaceholder: "Tipp ein Wort, der Schwarm schreibt es",
  demoSend: "Senden",
  demoNote: "Eine Vorschau auf dieser Seite. Was du tippst, bleibt in deinem Browser.",

  tourTitle: "Jedes Gespräch hat seinen Platz.",
  tourBody: "Sieh dich auf einem Server um. Das sind Bildschirme aus der App, mit Demo-Konten.",
  tourLabel: "Bildschirme von Zrzur",
  tabLobby: "Lobby",
  tabChat: "Nachrichten",
  tabRoles: "Rollen",
  tabInterests: "Interessen",
  tabDiscover: "Entdecken",
  lobbyBody:
    "Die erste Seite, die neue Mitglieder sehen: worum es auf dem Server geht, wo geredet wird, was zuerst zu tun ist und wer ihn betreibt.",
  lobbyAlt: "Eine Server-Lobby in Zrzur",
  chatBody:
    "Nachrichten kommen in dem Moment an, in dem sie gesendet werden. Antworte, reagiere, teile Bilder und Dateien und erwähne die Leute, die es sehen sollen.",
  chatAlt: "Nachrichten in einem Textkanal von Zrzur",
  commBody:
    "Kanäle und Kategorien für jedes Thema, Rollen, die festlegen, wer was sieht, und Moderationswerkzeuge, wenn die Community wächst.",
  commAlt: "Servereinstellungen in Zrzur mit den Rollen des Servers",
  rolesBody:
    "Beim ersten Besuch wählen Mitglieder, was sie interessiert, und bekommen sofort die passenden Rollen. Sie können das überspringen und später im Servermenü ändern.",
  rolesAlt: "Das Interessenfenster beim Beitritt zu einem Server",
  discoverBody:
    "Stöbere in öffentlichen Servern nach Thema oder suche nach Name und Tag, sieh, worum es jeweils geht und welche Sprache dort gesprochen wird, und tritt mit einem Klick bei.",
  discoverAlt: "Öffentliche Server entdecken in Zrzur",

  voiceTitle: "Rein. Reden. Bildschirm teilen.",
  voiceBody:
    "Sprachkanäle sind immer offen: mit einem Klick beitreten, gehen, wenn du fertig bist. Teile deinen Bildschirm, um ein Spiel, ein Design oder einen Fehler zu zeigen.",
  voiceP1: "Mit einem Klick in den Sprachkanal",
  voiceP2: "Bildschirmfreigabe direkt aus dem Anruf",
  voiceP3: "Mikrofon- und Audioeinstellungen",
  voiceAlt: "Die Sprachkanäle eines Zrzur-Servers, Lina und Omar sind in der Spiele-Lounge",

  langTitle: "In deiner Sprache. Wirklich.",
  langBody:
    "Arabisch läuft in der ganzen App von rechts nach links. Deutsch und Englisch bekommen dieselbe Sorgfalt, ohne halb übersetzte Seiten.",
  langAltAr: "Zrzur auf einem Handy auf Arabisch",
  langAltEn: "Zrzur auf einem Handy auf Englisch",
  langAltDe: "Zrzur auf einem Handy auf Deutsch",
  langGreeting: "Hallo|مرحبًا|Hello",

  openTitle: "Kostenlos nutzen. Offen mitlesen.",
  openBody:
    "In dieser Version gibt es nichts zu bezahlen. Der Quellcode ist unter der AGPL öffentlich, sodass jeder sehen kann, wie Zrzur funktioniert.",
  openP1: "Kein Abo und kein Bezahlvorgang",
  openP2: "Öffentlicher Quellcode unter der AGPL",
  openP3: "Lizenzen und Nennung der Mitwirkenden bleiben erhalten",

  faqTitle: "Gute Fragen.",
  ctaTitle: "Dein nächstes gutes Gespräch beginnt mit Hallo.",
  ctaBody: "Mach ein bisschen Platz für deine Leute.",

  footerTag: "Ein Ort für deine Leute.",
  footerProduct: "Produkt",
  footerProject: "Projekt",
  footerResources: "Ressourcen",
  footerLegal: "Rechtliches",
  source: "Quellcode",
  licences: "Lizenzen und Namensnennung",
  thirdParty: "Hinweise zu Drittanbieter-Komponenten",
  questions: "Häufige Fragen",
  gettingStarted: "Erste Schritte",
  safety: "Sicherheit und Richtlinien",
  feedback: "Support kontaktieren",
  allPolicies: "Alle Richtlinien",
  draftNote: "Die Richtlinien sind Entwürfe und werden rechtlich geprüft.",
  copyright: "© 2026 Zrzur",
  footerAttribution:
    "Unabhängige Zrzur-Versionen. Open-Source-Lizenzen und Namensnennung bleiben erhalten.",

  featuresTitle: "Für deine Gespräche.\nFür deine Community.",
  featuresBody:
    "Geordnete Chats, Sprachkanäle und Bildschirmfreigabe, geteilte Dateien sowie klare Rollen und Berechtigungen, in einer App.",

  projectTitle: "Ein Vogel, der nie allein lebt.",
  projectBody:
    "Der Star, auf Arabisch زرزور, fliegt in riesigen Schwärmen und spricht mit den anderen in vielen Stimmen. Zrzur folgt derselben Idee: ein Ort, an dem Freunde und Communitys zusammenkommen.",
  projectQuote: "Kommunikation zuerst. Entwicklung hält sie in Bewegung.",
  projectP1:
    "Zrzur veröffentlicht eigene Versionen. Die Open-Source-Grundlage ist ein Anfang, nicht die Grenze des Projekts. Wir arbeiten am Kommunikationserlebnis und an App und Diensten, die es braucht.",
  projectP2:
    "Im Fokus stehen Gespräche, Communitys, Sprache, Leistung, Mitgliederverwaltung und gute Arabisch-, Deutsch- und Englischfassungen, einschließlich Layouts von rechts nach links.",
  projectP3:
    "Zrzur ist neu und läuft im Browser. Es ist kostenlos, und in dieser Version gibt es nichts zu bezahlen.",
  projectFeedbackTitle: "Sag uns, was du denkst.",
  projectFeedbackBody: "Wenn etwas kaputt ist oder fehlt, schreib uns.",
  pillarCommunication: "Ein Ort zum Verbinden",
  pillarCommunicationBody:
    "Chats, Kanäle und Communitys mit Werkzeugen, um Gespräche zu ordnen, Dateien zu teilen und Mitglieder zu verwalten.",
  pillarLanguage: "Sprachen, richtig gemacht",
  pillarLanguageBody:
    "Klare Formulierungen in jeder Sprache, Layouts von rechts nach links für Arabisch und keine halb übersetzten Seiten.",
  pillarDevelopment: "Ständig besser",
  pillarDevelopmentBody:
    "Wir verbessern laufend die App, die Dienste dahinter und wie beides im Alltag zusammenspielt.",
  licensesTitle: "Die Arbeit respektieren. Die Quelle bewahren.",
  licensesBody:
    "Die AGPL und weitere geltende Komponentenlizenzen bleiben in Kraft. Urheberrechtshinweise, Namensnennung und die Pflicht zur Bereitstellung des Quellcodes bleiben gewahrt. Wir behaupten nicht, den ursprünglichen Code selbst geschrieben zu haben.",
  storyNote:
    "Projektgeschichte, Lizenzen und die Nennung der Mitwirkenden bleiben erhalten.",

  downloadTitle: "Nichts herunterzuladen.",
  downloadBody:
    "Zrzur läuft in jedem aktuellen Browser, auf dem Computer und auf dem Handy. Öffnen und loslegen, immer in der neuesten Version.",
  trustTitle: "Bleib sicher",
  trustBody:
    "Die einzige offizielle Adresse ist zrzur.com. Wir verschicken keine Installer, ein Download in Zrzurs Namen stammt also nicht von uns.",

  helpTitle: "Sag Hallo.\nMach es zu deinem Ort.",
  helpBody: "Eine kurze Anleitung, um dich in Zrzur zurechtzufinden.",
  guideGreeting: "Hallo|مرحبًا|Hello",
  step1: "Zrzur öffnen",
  step1Body:
    "Öffne die Web-App und melde dich an oder erstelle ein Konto. Bestätige deine E-Mail-Adresse und wähle einen Benutzernamen.",
  step2: "Finde deine Leute",
  step2Body:
    "Tritt über einen Einladungslink einem Server bei, finde einen öffentlichen unter „Entdecken“ oder erstelle einen Server für deine Freunde.",
  step3: "Jedem Thema seinen Platz",
  step3Body:
    "Erstelle Text- und Sprachkanäle, ordne sie in Kategorien und lege Rollen und Berechtigungen fest.",
  step4: "Fühl dich wie zu Hause",
  step4Body:
    "Richte dein Profil ein, wähle Design und Sprache und passe die Benachrichtigungen in den Einstellungen an.",

  modalTitle: "Dein Ort ist fast da.",
  modalBody:
    "Die öffentliche Adresse der Web-App ist noch nicht freigeschaltet. Du kannst trotzdem die Funktionen und echte Bildschirme der App ansehen.",

  notFound: "Dieses Gespräch hat eine andere Wendung genommen.",
  notFoundBody: "Die gesuchte Seite gibt es hier nicht. Wir bringen dich zurück.",
  backHome: "Zur Startseite",

  legalTitle: "Rechtliches und Richtlinien",
  legalIntro:
    "Nutzungsbedingungen, Datenschutz und Community-Richtlinien sowie die Regeln für Server, Entdecken, Entwickler, Creator und kostenpflichtige Dienste.",
  documents: "Dokumente",
  docContents: "Inhalt des Dokuments",
  draftSources: "Quellen des Entwurfs",
  draftSourcesBody:
    "Dokumente des Ursprungsprojekts sind zum Vergleich verlinkt; deren Betreiber- und Hostingangaben gelten nicht für Zrzur.",
  legalLanguageNote:
    "Diese Richtlinie liegt auf Englisch und Arabisch vor. Eine geprüfte deutsche Fassung folgt.",
};

const ar: Labels = {
  brand: "زرزور",
  home: "الرئيسية",
  features: "المزايا",
  project: "عن زرزور",
  help: "الدليل",
  discover: "اكتشف",
  open: "افتح زرزور",
  explore: "استعرض المزايا",
  close: "إغلاق",
  menu: "القائمة",
  skip: "انتقل إلى المحتوى",
  language: "اللغة",
  themeLight: "تفعيل المظهر الفاتح",
  themeDark: "تفعيل المظهر الداكن",
  top: "العودة إلى الأعلى",

  heroTitle: "حيث تجتمع الأصوات",
  heroBody:
    "منصة دردشة جماعية مفتوحة المصدر للأصدقاء والمجتمعات. أنشئ سيرفرك وادعُ أصدقاءك خلال دقيقة.",
  heroFacts: "مجاني. يعمل في المتصفح. لا شيء لتثبيته.",
  flockName: "زرزور",

  demoAlt: "معاينة حيّة لقناة الدردشة في سيرفر على زرزور",
  demoServer: "سهرة الألعاب",
  demoInitials: "سا",
  demoLobby: "الردهة",
  demoInfo: "معلومات",
  demoChatCategory: "دردشة",
  demoVoiceCategory: "صوت",
  demoAnnouncements: "الإعلانات",
  demoRules: "القوانين",
  demoChat: "دردشة",
  demoSquad: "ابحث-عن-فريق",
  demoLounge: "صالة اللعب",
  demoQuiet: "غرفة الهدوء",
  demoPeople1: "عمر",
  demoPeople2: "لينا",
  demoMessage1: "مساء الخير! من مستعد لسهرة الألعاب الليلة؟",
  demoMessage2: "أنا مستعدة. فتحت صالة اللعب، انضموا متى شئتم.",
  demoMessage3: "ممتاز، دقيقتان وأكون معكم.",
  demoMessage4: "تذكير: بطولة Minecraft يوم الجمعة الساعة الثامنة مساءً.",
  demoMessage5: "سجّلت اسمي 👍",
  demoToday: "اليوم الساعة 20:07",
  demoNow: "الآن",
  demoYou: "أنت",
  demoPlaceholder: "اكتب كلمة، وسيكتبها السرب",
  demoSend: "إرسال",
  demoNote: "معاينة على هذه الصفحة. ما تكتبه يبقى في متصفحك.",

  tourTitle: "لكل حديث مكانه.",
  tourBody: "تجوّل في سيرفر. هذه شاشات من التطبيق نفسه، بحسابات تجريبية.",
  tourLabel: "شاشات من زرزور",
  tabLobby: "الردهة",
  tabChat: "الرسائل",
  tabRoles: "الرتب",
  tabInterests: "الاهتمامات",
  tabDiscover: "اكتشف",
  lobbyBody:
    "أول صفحة يراها العضو الجديد: عمّ يدور السيرفر، وأين يتحدث الناس، وما يفعله أولًا، ومن يديره.",
  lobbyAlt: "ردهة سيرفر في زرزور",
  chatBody:
    "تصل الرسائل لحظة إرسالها. ردّ وتفاعل وشارك الصور والملفات، واذكر من يجب أن يراها.",
  chatAlt: "رسائل في قناة نصية في زرزور",
  commBody:
    "قنوات وفئات لكل موضوع، ورتب تحدّد من يرى ماذا، وأدوات إشراف حين يكبر المجتمع.",
  commAlt: "إعدادات السيرفر في زرزور مع قائمة رتبه",
  rolesBody:
    "عند الزيارة الأولى يختار العضو اهتماماته ويحصل على رتبها فورًا. ويمكنه تخطّي ذلك وتغييره لاحقًا من قائمة السيرفر.",
  rolesAlt: "نافذة اختيار الاهتمامات عند الانضمام إلى سيرفر",
  discoverBody:
    "تصفّح السيرفرات العامة حسب الموضوع أو ابحث بالاسم والوسم، واطّلع على ما يدور في كلٍّ منها ولغته، وانضم بنقرة.",
  discoverAlt: "اكتشاف السيرفرات العامة في زرزور",

  voiceTitle: "ادخل. تحدّث. شارك شاشتك.",
  voiceBody:
    "القنوات الصوتية مفتوحة دائمًا: انضم بنقرة واحدة، وغادر متى انتهيت. شارك شاشتك لتعرض لعبة أو تصميمًا أو خطأً.",
  voiceP1: "نقرة واحدة للانضمام إلى قناة صوتية",
  voiceP2: "مشاركة الشاشة من داخل المكالمة",
  voiceP3: "إعدادات الميكروفون والصوت",
  voiceAlt: "القنوات الصوتية في سيرفر على زرزور، ولينا وعمر في صالة اللعب",

  langTitle: "بلغتك، حقًا.",
  langBody:
    "تُقرأ العربية من اليمين إلى اليسار في التطبيق كله. وتنال الألمانية والإنجليزية العناية نفسها، دون شاشات نصف مترجمة.",
  langAltAr: "زرزور على هاتف بالعربية",
  langAltEn: "زرزور على هاتف بالإنجليزية",
  langAltDe: "زرزور على هاتف بالألمانية",
  langGreeting: "مرحبًا|Hello|Hallo",

  openTitle: "مجاني للاستخدام، مفتوح للقراءة.",
  openBody:
    "لا يوجد ما تدفعه في هذه النسخة. والشيفرة المصدرية منشورة برخصة AGPL، فيستطيع أي شخص أن يرى كيف يعمل زرزور.",
  openP1: "لا اشتراك ولا عملية شراء",
  openP2: "شيفرة مصدرية منشورة برخصة AGPL",
  openP3: "نحافظ على التراخيص وحقوق المساهمين",

  faqTitle: "أسئلة شائعة.",
  ctaTitle: "ابدأ حديثًا جديدًا، واجمع مجتمعك.",
  ctaBody: "مساحة لأفكارك، وأصدقائك، وكل ما يجمعكم.",

  footerTag: "مساحة تجمعك بمجتمعك.",
  footerProduct: "المنتج",
  footerProject: "المشروع",
  footerResources: "المصادر",
  footerLegal: "القانونية",
  source: "الشيفرة المصدرية",
  licences: "التراخيص وحقوق المساهمين",
  thirdParty: "إشعارات الجهات الخارجية",
  questions: "الأسئلة الشائعة",
  gettingStarted: "دليل البداية",
  safety: "الأمان والإرشادات",
  feedback: "تواصل مع الدعم",
  allPolicies: "كل السياسات",
  draftNote: "السياسات مسودات قيد المراجعة القانونية.",
  copyright: "© ٢٠٢٦ زرزور",
  footerAttribution:
    "إصدارات زرزور المستقلة. نحافظ على تراخيص المصدر المفتوح وحقوق المساهمين.",

  featuresTitle: "كل ما يجمع\nأصدقاءك ومجتمعك.",
  featuresBody:
    "محادثات منظّمة، وقنوات صوتية ومشاركة للشاشة، وملفات مشتركة، ورتب وصلاحيات واضحة، في تطبيق واحد.",

  projectTitle: "طائر لا يعيش وحده.",
  projectBody:
    "الزرزور طائر يطير في أسراب كبيرة، ويتواصل مع غيره بأصوات كثيرة. وزرزور منصة مبنية على الفكرة نفسها: مكان يجتمع فيه الأصدقاء والمجتمعات.",
  projectQuote: "التواصل هو الأساس. والتطوير مسؤولية مستمرة.",
  projectP1:
    "زرزور يطلق إصداراته الخاصة. الأساس البرمجي المفتوح نقطة بداية، وليس حدود المشروع. نعمل على تجربة التواصل وما تحتاج إليه من تطبيق وخدمات.",
  projectP2:
    "يشمل اهتمامنا تنظيم المحادثات والمجتمعات، وتجربة الصوت، والأداء، وإدارة الأعضاء، وإتقان العربية والألمانية والإنجليزية، بما في ذلك اتجاه الكتابة من اليمين إلى اليسار.",
  projectP3:
    "زرزور مشروع جديد يعمل من المتصفح. استخدامه مجاني، ولا يوجد ما تدفعه في هذه النسخة.",
  projectFeedbackTitle: "أخبرنا برأيك.",
  projectFeedbackBody: "إذا تعطّل شيء أو نقص شيء، فراسلنا.",
  pillarCommunication: "تواصل يجمعكم",
  pillarCommunicationBody:
    "محادثات وقنوات ومجتمعات، مع أدوات لتنظيم الحوار ومشاركة الملفات وإدارة الأعضاء.",
  pillarLanguage: "لغات متقنة",
  pillarLanguageBody:
    "صياغة واضحة في كل لغة، واتجاه من اليمين إلى اليسار للعربية، ولا شاشات نصف مترجمة.",
  pillarDevelopment: "تطوير مستمر",
  pillarDevelopmentBody:
    "نطوّر التطبيق والخدمات التي تشغّله، ونحسّن تكامل أجزائه في الاستخدام اليومي.",
  licensesTitle: "نحترم المساهمات ونحافظ على التراخيص.",
  licensesBody:
    "تبقى رخصة AGPL وتراخيص المكوّنات الأخرى سارية، وكذلك إشعارات حقوق النشر وحقوق المساهمين والتزامات إتاحة المصدر. لا ننسب إلى زرزور تأليف الشيفرة الأصلية للمشروع.",
  storyNote: "نحافظ على تاريخ المشروع وتراخيصه وحقوق المساهمين فيه.",

  downloadTitle: "لا شيء لتنزيله.",
  downloadBody:
    "يعمل زرزور في أي متصفح حديث، على الكمبيوتر والهاتف. افتحه وابدأ، بأحدث إصدار دائمًا.",
  trustTitle: "ابقَ آمنًا",
  trustBody:
    "العنوان الرسمي الوحيد هو zrzur.com. لا نرسل ملفات تثبيت، فأي تنزيل يُعرض باسم زرزور ليس منا.",

  helpTitle: "ابدأ المحادثة،\nوأنشئ مساحتك.",
  helpBody: "دليل قصير للتعرّف على زرزور.",
  guideGreeting: "مرحبًا|Hello|Hallo",
  step1: "افتح زرزور",
  step1Body:
    "افتح تطبيق الويب، ثم سجّل الدخول أو أنشئ حسابًا. أكّد بريدك الإلكتروني واختر اسم مستخدم.",
  step2: "اعثر على مجتمعك",
  step2Body:
    "انضم إلى سيرفر برابط دعوة، أو ابحث عن سيرفر عام في «اكتشف»، أو أنشئ سيرفرًا لأصدقائك.",
  step3: "لكل موضوع مكانه",
  step3Body:
    "أنشئ قنوات نصية وصوتية، واجمعها في فئات، ثم حدّد رتب الأعضاء وصلاحياتهم.",
  step4: "اجعله مكانك",
  step4Body:
    "أكمل ملفك الشخصي، واختر المظهر واللغة، واضبط الإشعارات من الإعدادات.",

  modalTitle: "مكانك يكاد يكون جاهزًا.",
  modalBody:
    "لم يُفعَّل العنوان العام لتطبيق الويب بعد. يمكنك في الأثناء استكشاف المزايا وصور حقيقية من التطبيق.",

  notFound: "الصفحة غير موجودة.",
  notFoundBody:
    "قد يكون الرابط قد تغيّر. يمكنك العودة إلى الصفحة الرئيسية ومتابعة التصفّح.",
  backHome: "العودة إلى الرئيسية",

  legalTitle: "القوانين والسياسات",
  legalIntro:
    "شروط الخدمة والخصوصية وإرشادات المجتمع، وقواعد السيرفرات و«اكتشف» والمطوّرين والمبدعين والخدمات المدفوعة.",
  documents: "الوثائق",
  docContents: "محتويات الوثيقة",
  draftSources: "مراجع إعداد المسودة",
  draftSourcesBody:
    "تُذكر وثائق المشروع الأصلي للمقارنة، ولا تُعدّ بيانات مشغّله أو استضافته بيانات خاصة بزرزور.",
  legalLanguageNote:
    "هذه السياسة متاحة بالعربية والإنجليزية. وستتبعها نسخة ألمانية بعد مراجعتها.",
};

export const labels: Record<Language, Labels> = { en, de, ar };
export type Label = keyof Labels;

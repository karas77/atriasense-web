// Metinler atriasense.com (i18n.js) kaynağından alındı; site TR/EN iki dilli.
export type Lang = "tr" | "en";

type ProductMeta = { label: string; sub: string };
export type Partner = {
  id: string;
  name: string;
  logo: string;
  width: number;
  height: number;
  title: string;
  badge: string;
  text: string;
};
type Product = {
  id: "atrialens" | "wristband";
  name: string;
  image: string;
  alt: string;
  desc: string;
  heading: string;
  lead: string;
  features: string[];
  meta: ProductMeta[];
  metaLabel: string;
  palette: [string, string, string];
};

export type Content = {
  meta: { title: string; description: string };
  skip: string;
  intro: { label: string; preparing: string; skip: string };
  nav: {
    label: string;
    products: string;
    about: string;
    contact: string;
    cta: string;
    langSwitch: string;
    langShort: string;
    home: string;
  };
  hero: {
    label: string;
    wordmark: string;
    sloganLeft: string;
    sloganRight: string;
    lineOne: string;
    lineTwo: string;
    scrollHint: string;
  };
  products: { eyebrow: string; heading: string; intro: string; items: Product[] };
  about: {
    eyebrow: string;
    heading: string;
    p1: string;
    quote: string;
    quoteCite: string;
    p2: string;
    p3: string;
  };
  partners: { eyebrow: string; hint: string; close: string; items: Partner[] };
  transition: { lineOne: string; lineTwo: string };
  contact: {
    eyebrow: string;
    heading: string;
    lead: string;
    note: string;
    form: {
      title: string;
      name: string;
      email: string;
      product: string;
      productPlaceholder: string;
      productError: string;
      note: string;
      optional: string;
      placeholder: string;
      submit: string;
      sending: string;
      error: string;
      successTitle: string;
      successText: string;
      reset: string;
    };
    faqHeading: string;
    faq: [string, string][];
    location: string;
    locationLabel: string;
    socialLabel: string;
    socialNote: string;
    tagline: string;
    motto: string;
    rights: string;
  };
};

// Ürün metinleri Atria Sense Rehberi (2026-2027) ile doğrulandı. Teknik değer verilmez.
const products = {
  tr: [
    {
      id: "atrialens",
      name: "AtriaLens",
      image: "/img/atrialens",
      alt: "AtriaLens akıllı gözlük, üç çeyrek görünüm",
      desc: "Konuşmayı yazıya, gerektiğinde başka bir dile çevirir ve yalnızca senin gördüğün göz hizasında gösterir.",
      heading: "Konuşma, gözünün önünde kalır.",
      lead: "Başını eğmeden, telefona bakmadan, karşındakiyle göz temasını kesmeden konuşmayı takip edersin.",
      features: [
        "Gerçek zamanlı altyazı, anlaşılması kolay sade dille",
        "Gerektiğinde başka bir dile canlı çeviri",
        "İşitme cihazı gibi değil, her gün takılan bir gözlük gibi",
      ],
      meta: [
        { label: "ALTYAZI", sub: "Göz hizasında" },
        { label: "ÇEVİRİ", sub: "Gerektiğinde başka dile" },
        { label: "GÖRÜNÜM", sub: "Sıradan bir gözlük" },
      ],
      metaLabel: "AtriaLens öne çıkanlar",
      palette: ["#CDFC8A", "#FFFC8C", "#3E6BFF"],
    },
    {
      id: "wristband",
      name: "Atria Attention",
      image: "/img/wristband",
      alt: "Atria Attention bileklik, çift görünüm",
      desc: "Çevrendeki önemli sesleri bileğinde hissettiğin bir titreşimle haber verir.",
      heading: "Önemli sesler, bileğinde.",
      lead: "Zil çaldığında, alarm öttüğünde, kapı çalındığında ya da biri adını seslendiğinde başını eğmeden haberdar olursun.",
      features: [
        "Zil, alarm ve kapı sesinde titreşimli uyarı",
        "Adın seslenildiğinde dikkatini çeker",
        "Yalnızca önemli olanı bildirir",
      ],
      meta: [
        { label: "ZİL", sub: "Okul ve kapı zili" },
        { label: "ALARM", sub: "Yangın alarmı" },
        { label: "AD", sub: "Adın seslenildiğinde" },
      ],
      metaLabel: "Atria Attention öne çıkanlar",
      palette: ["#FFFC8C", "#CDFC8A", "#2B4FD8"],
    },
  ],
  en: [
    {
      id: "atrialens",
      name: "AtriaLens",
      image: "/img/atrialens",
      alt: "AtriaLens smart glasses, three-quarter view",
      desc: "Turns speech into text, translates it into another language when needed, and shows it at eye level where only you can see it.",
      heading: "Speech stays right in front of your eyes.",
      lead: "Follow the conversation without looking down, without checking your phone and without breaking eye contact.",
      features: [
        "Real-time captions in clear, plain language",
        "Live translation into another language when needed",
        "Worn like everyday glasses, not like a hearing device",
      ],
      meta: [
        { label: "CAPTIONS", sub: "At eye level" },
        { label: "TRANSLATION", sub: "When you need it" },
        { label: "LOOK", sub: "Ordinary glasses" },
      ],
      metaLabel: "AtriaLens highlights",
      palette: ["#CDFC8A", "#FFFC8C", "#3E6BFF"],
    },
    {
      id: "wristband",
      name: "Atria Attention",
      image: "/img/wristband",
      alt: "Atria Attention wristband, pair view",
      desc: "Lets you know about important sounds around you with a vibration you feel on your wrist.",
      heading: "Important sounds, on your wrist.",
      lead: "When a bell rings, an alarm goes off, someone knocks or calls your name, you know without looking down.",
      features: [
        "Vibration alerts for bells, alarms and knocks",
        "Gets your attention when someone calls your name",
        "Only tells you what matters",
      ],
      meta: [
        { label: "BELL", sub: "School and door bells" },
        { label: "ALARM", sub: "Fire alarms" },
        { label: "NAME", sub: "When you’re called" },
      ],
      metaLabel: "Atria Attention highlights",
      palette: ["#FFFC8C", "#CDFC8A", "#2B4FD8"],
    },
  ],
} satisfies Record<Lang, Product[]>;

// Kurum bilgileri Atria Sense Rehberi 10.3-10.4 bölümünden.
const logos = {
  meta: { id: "meta", name: "Meta", logo: "/logos/meta.svg", width: 260, height: 52 },
  akbank: { id: "akbank", name: "Akbank", logo: "/logos/akbank.svg", width: 250, height: 28 },
  meb: { id: "meb", name: "T.C. Millî Eğitim Bakanlığı", logo: "/logos/meb.svg", width: 120, height: 120 },
  gitex: { id: "gitex", name: "GITEX AI Türkiye", logo: "/logos/gitex-ai-turkiye.png", width: 519, height: 155 },
  ytu: { id: "ytu", name: "YTÜ Startup House", logo: "/logos/ytu-startup-house.png", width: 412, height: 264 },
};

const partners: Record<Lang, Partner[]> = {
  tr: [
    { ...logos.meta, badge: "Birincilik", title: "Meta Founders Create", text: "Meta Founders Create programında birinci olduk. Meta ile iletişimimiz aktif olarak sürüyor." },
    { ...logos.akbank, badge: "Birincilik", title: "Akbank Girişimcilik Yarışması", text: "Akbank Girişimcilik Yarışması'nda birinciliği kazandık." },
    { ...logos.meb, badge: "Hızlandırma programı", title: "ETKİM Yıldızları", text: "Millî Eğitim Bakanlığı'nın ETKİM Yıldızları hızlandırma programında yer aldık ve Ekim 2026'da Demo Day sahnesine çıktık." },
    { ...logos.gitex, badge: "Sahne", title: "GITEX AI Türkiye 2026", text: "GITEX AI Türkiye 2026'da Tech Talks sahnesinde AtriaSense'i anlattık." },
    { ...logos.ytu, badge: "Ön kuluçka", title: "YTÜ Startup House", text: "YTÜ Startup House ön kuluçka programındayız; YTÜ Teknopark'ta çalışıyoruz." },
  ],
  en: [
    { ...logos.meta, badge: "First place", title: "Meta Founders Create", text: "We took first place in Meta Founders Create, and we remain in active contact with Meta." },
    { ...logos.akbank, badge: "First place", title: "Akbank Entrepreneurship Competition", text: "We won first place in the Akbank Entrepreneurship Competition." },
    { ...logos.meb, badge: "Accelerator", title: "ETKİM Stars", text: "We took part in the Turkish Ministry of National Education’s ETKİM Stars accelerator and presented at its Demo Day in October 2026." },
    { ...logos.gitex, badge: "Stage", title: "GITEX AI Türkiye 2026", text: "We presented AtriaSense on the Tech Talks stage at GITEX AI Türkiye 2026." },
    { ...logos.ytu, badge: "Pre-incubation", title: "YTÜ Startup House", text: "We are part of the YTÜ Startup House pre-incubation program, based at YTÜ Teknopark." },
  ],
};

export const content: Record<Lang, Content> = {
  tr: {
    meta: {
      title: "AtriaSense · Konuşmayı gör. Anın içinde kal.",
      description:
        "AtriaSense; çevreden gelen bilginin kontrolünü insana veren donanım ve yazılım ürünleri tasarlar.",
    },
    skip: "Ana içeriğe geç",
    intro: { label: "Atria logo animasyonu", preparing: "Deneyim hazırlanıyor", skip: "Geç" },
    nav: {
      label: "Ana menü",
      products: "Ürünler",
      about: "Hakkımızda",
      contact: "İletişim",
      cta: "Talep bırak",
      langSwitch: "Switch to English",
      langShort: "EN",
      home: "AtriaSense ana sayfa",
    },
    hero: {
      label: "AtriaSense tanıtım",
      wordmark: "Atria Sense",
      sloganLeft: "Feel the flow",
      sloganRight: "Inspire the future",
      lineOne: "Konuşmayı gör.",
      lineTwo: "Anın içinde kal.",
      scrollHint: "Keşfetmek için kaydır",
    },
    products: {
      eyebrow: "Ürünler",
      heading: "Tek ihtiyaç. İki form.",
      intro:
        "AtriaLens konuşmayı göz hizana taşır, Atria Attention konuşma dışındaki sesleri bileğine. Başını eğmeden, telefona bakmadan anın içinde kalırsın.",
      items: products.tr,
    },
    about: {
      eyebrow: "Neden varız",
      heading: "Herkes konuşmanın içinde kalabilsin diye.",
      p1: "Kurucu ortağımız Aybüke Pamukçu yaklaşık beş yıldır gerçek zamanlı altyazı fikrini düşünüyordu. İşitme cihazları kalabalık ve gürültülü ortamlarda yetmiyordu; ders, toplantı ya da bir arkadaş sohbeti kolayca kaçıyordu.",
      quote: "“Sağır olurum ama o cihazı takmam.”",
      quoteCite: "Saha araştırmamızdan",
      p2: "Sahada en sık bunu duyduk. Bu yüzden AtriaLens bir işitme cihazı gibi değil, her gün takılan bir gözlük gibi taşınıyor. Fikir, bir gömülü sistemler dersindeki gözlük projesiyle prototipe dönüştü; ardından gelen yarışmalarla AtriaSense doğdu.",
      p3: "Hayalimiz, herkesin neyin kendisine ulaşacağına kendi karar verdiği bir dünya. Bunun için çevreden gelen bilginin kontrolünü kullanıcıya veren, herkesin erişebileceği ürünler yapıyoruz.",
    },
    partners: { eyebrow: "Kurumlar", hint: "Ayrıntı için bir kuruma dokun", close: "Kapat", items: partners.tr },
    transition: { lineOne: "İletişim,", lineTwo: "herkes için erişilebilir olmalı." },
    contact: {
      eyebrow: "İletişim",
      heading: "Satış açıldığında haber verelim.",
      lead: "Ürünler geliştirme aşamasında. Fiyat, paket ve teslimat ayrıntıları kesinleştiğinde talep bırakanlarla paylaşılacak.",
      note: "Talebinizi, görüş ve beklentilerinizle birlikte ekibimize iletebilirsiniz. Başvurunuz değerlendirmeye alınır; ayrıca seçtiğiniz ürünle ilgili gelişmeler için bildirim listemize eklenirsiniz.",
      form: {
        title: "Talep bırak",
        name: "Adın",
        email: "E-posta adresin",
        product: "İlgilendiğin ürün",
        productPlaceholder: "Ürün seç",
        productError: "Lütfen ilgilendiğin ürünü seç.",
        note: "Notun",
        optional: "(isteğe bağlı)",
        placeholder: "Görüş ve beklentilerini paylaşabilirsin.",
        submit: "Talebi kaydet",
        sending: "Gönderiliyor…",
        error: "Talebin gönderilemedi. Lütfen tekrar dene.",
        successTitle: "Talebin kaydedildi",
        successText: "Satış açıldığında ve fiyat ayrıntıları netleştiğinde e-posta ile haber vereceğiz.",
        reset: "Yeni talep bırak",
      },
      faqHeading: "Sık sorulan sorular",
      faq: [
        [
          "AtriaLens ne yapıyor?",
          "Konuşmayı yazıya, gerektiğinde başka bir dile çevirip göz hizasında gösteriyor. Başını eğmeden, göz temasını kesmeden konuşmanın içinde kalırsın.",
        ],
        [
          "Ne zaman satışa çıkacak?",
          "Satış tarihi henüz açıklanmadı. Talep formunu bırakanlara geliştirme ve erişim bilgileri paylaşılacak.",
        ],
        [
          "Fiyatı ne olacak?",
          "Herkesin erişebileceği bir fiyat hedefliyoruz. Kesin rakamlar geliştirme sürecinde netleşecek ve talep bırakanlarla paylaşılacak.",
        ],
        [
          "Atria Attention ne zaman gelecek?",
          "Atria Attention’ın demosu hazır. Talep bırakarak gelişmelerden ilk sen haberdar olabilirsin.",
        ],
      ],
      location: "YTÜ Teknopark",
      locationLabel: "Konum",
      socialLabel: "Sosyal",
      socialNote: "LinkedIn",
      tagline: "İletişim, herkes için erişilebilir olmalı.",
      motto: "Kontrol insanda",
      rights: "© 2026 AtriaSense",
    },
  },
  en: {
    meta: {
      title: "AtriaSense · See the conversation. Stay in the moment.",
      description:
        "AtriaSense designs hardware and software products that put people in control of the information coming from their surroundings.",
    },
    skip: "Skip to main content",
    intro: { label: "Atria logo animation", preparing: "Preparing the experience", skip: "Skip" },
    nav: {
      label: "Main menu",
      products: "Products",
      about: "About",
      contact: "Contact",
      cta: "Join waitlist",
      langSwitch: "Türkçe'ye geç",
      langShort: "TR",
      home: "AtriaSense home",
    },
    hero: {
      label: "AtriaSense introduction",
      wordmark: "Atria Sense",
      sloganLeft: "Feel the flow",
      sloganRight: "Inspire the future",
      lineOne: "See the conversation.",
      lineTwo: "Stay in the moment.",
      scrollHint: "Scroll to explore",
    },
    products: {
      eyebrow: "Products",
      heading: "One need. Two forms.",
      intro:
        "AtriaLens brings speech to eye level, Atria Attention brings the sounds beyond speech to your wrist. You stay in the moment without looking down or reaching for your phone.",
      items: products.en,
    },
    about: {
      eyebrow: "Why we exist",
      heading: "So everyone can stay in the conversation.",
      p1: "Our co-founder Aybüke Pamukçu had been thinking about real-time captions for about five years. Hearing aids weren’t enough in crowded, noisy places; a lesson, a meeting or a chat with a friend could easily slip away.",
      quote: "“I’d rather be deaf than wear that device.”",
      quoteCite: "From our field research",
      p2: "That is what we heard most often. So AtriaLens is worn like everyday glasses, not like a hearing device. The idea became a prototype through a glasses project in an embedded systems course, and AtriaSense grew out of the competitions that followed.",
      p3: "We imagine a world where everyone decides for themselves what reaches them. That’s why we build accessible products that give people control over the information coming from their surroundings.",
    },
    partners: { eyebrow: "Institutions", hint: "Tap an institution for details", close: "Close", items: partners.en },
    transition: { lineOne: "Communication", lineTwo: "should be accessible to everyone." },
    contact: {
      eyebrow: "Contact",
      heading: "We’ll let you know when sales open.",
      lead: "Our products are in development. Pricing, packages and delivery details will be shared with those on the waitlist once they’re finalized.",
      note: "You can send your request to our team along with your thoughts and expectations. Your application will be reviewed, and you’ll also be added to our notification list for updates on the product you choose.",
      form: {
        title: "Join the waitlist",
        name: "Your name",
        email: "Your email address",
        product: "Product you’re interested in",
        productPlaceholder: "Choose a product",
        productError: "Please choose the product you’re interested in.",
        note: "Your note",
        optional: "(optional)",
        placeholder: "Feel free to share a note or any expectations you have.",
        submit: "Save my request",
        sending: "Sending…",
        error: "Your request could not be sent. Please try again.",
        successTitle: "Your request is saved",
        successText: "We’ll email you when sales open and pricing details are finalized.",
        reset: "Submit another request",
      },
      faqHeading: "Frequently asked questions",
      faq: [
        [
          "What does AtriaLens do?",
          "It turns speech into text, translates it when needed and shows it at eye level, so you stay in the conversation without looking down or breaking eye contact.",
        ],
        [
          "When will it go on sale?",
          "The sale date hasn’t been announced yet. Anyone on the waitlist will receive development and access updates.",
        ],
        [
          "How much will it cost?",
          "We’re aiming for a price everyone can reach. Final numbers will be set during development and shared with those on the waitlist.",
        ],
        [
          "When will Atria Attention arrive?",
          "The Atria Attention demo is ready. Join the waitlist to be the first to hear about it.",
        ],
      ],
      location: "YTÜ Teknopark",
      locationLabel: "Location",
      socialLabel: "Social",
      socialNote: "LinkedIn",
      tagline: "Communication should be accessible to everyone.",
      motto: "People in control",
      rights: "© 2026 AtriaSense",
    },
  },
};

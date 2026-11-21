/**
 * "Rivojlanish / Развитие" section: how to develop players by age, plus coaching principles.
 * Retold in our own words from public FIFA Training Centre and UEFA material (see DEV_SOURCES).
 * Self-contained: no imports, so it can be dropped into src/ without touching other files.
 * Text pairs are [uz, ru].
 */

export type DevText = [uz: string, ru: string]

export interface DevSource {
  id: string
  org: 'FIFA' | 'UEFA'
  title: string
  url: string
}

export const DEV_SOURCES: DevSource[] = [
  { id: 'fifaGrass', org: 'FIFA', title: 'FIFA Training Centre: Grassroots (4–8, 8–12, 12–15)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots.php' },
  { id: 'fifaPPP', org: 'FIFA', title: 'An introduction to Play-Practice-Play (4–8)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/an-introduction-to-play-practice-play.php' },
  { id: 'fifaWarm', org: 'FIFA', title: 'Creating fun and effective warm-ups (4–8)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/creating-fun-and-effective-warm-ups.php' },
  { id: 'fifaGAG', org: 'FIFA', title: 'Coaching with the Global-Analytical-Global model (8–12)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/coaching-with-the-global-analytical-global-model.php' },
  { id: 'fifaWeek', org: 'FIFA', title: 'Sessions for once-a-week training (8–12)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/sessions-for-once-a-week-training.php' },
  { id: 'fifaProg', org: 'FIFA', title: 'Introduction to the progressive methodology (12–15)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/introduction-to-the-progressive-methodology.php' },
  { id: 'fifaSkill', org: 'FIFA', title: 'Optimising skill development (U12–U15)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/optimising-skill-development-u12-u15.php' },
  { id: 'fifaGame', org: 'FIFA', title: 'Optimising game application (12–15)', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/optimising-game-application.php' },
  { id: 'fifaSpiral', org: 'FIFA', title: 'Spiralling up: the long-term development process', url: 'https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/training-framework/spiralling-up--the-long-term-development-process.php' },
  { id: 'fifaTrain', org: 'FIFA', title: 'Talent development scheme: Train the talent', url: 'https://www.fifatrainingcentre.com/en/environment/talent-development/talent-development/train-the-talent.php' },
  { id: 'fifaPlay', org: 'FIFA', title: 'Talent development scheme: Play the talent', url: 'https://www.fifatrainingcentre.com/en/environment/talent-development/talent-development/play-the-talent.php' },
  { id: 'uefaRules', org: 'UEFA', title: 'Grassroots tips for coaching kids (10 golden rules)', url: 'https://www.uefa.com/news-media/news/0252-0f8e6ccae436-cec1c47608d5-1000--grassroots-tips-for-coaching-kids/' },
  { id: 'uefaU18', org: 'UEFA', title: 'The profile of under-18s and how to communicate with them', url: 'https://de.uefa.com/news-media/news/0298-1da3861fcbd8-d3a13aa3bed3-1000--webinar-summary-the-profile-of-under-18s-and-how-to-comm' },
  { id: 'uefaHead', org: 'UEFA', title: "Mind your head: UEFA's age-by-age guide to safer heading", url: 'https://www.uefa.com/news-media/news/02a9-219e9938ce03-97a84993f054-1000--mind-your-head-uefa-s-age-by-age-guide-to-safer-heading/' },
  { id: 'uefaNews', org: 'UEFA', title: 'UEFA Grassroots Newsletter No. 3 (small-sided games)', url: 'https://www.uefa.com/newsfiles/377902.pdf' },
]

/** The four sides of development every stage card covers. */
export type DevArea = 'technical' | 'tactical' | 'physical' | 'mental'

export const DEV_AREA_LABELS: Record<DevArea, DevText> = {
  technical: ['Texnika', 'Техника'],
  tactical: ["O'yinni tushunish", 'Понимание игры'],
  physical: ['Jismoniy', 'Физика'],
  mental: ['Psixologiya va jamoa', 'Психология и команда'],
}

export interface DevStage {
  id: string
  ages: string // e.g. "4–7"
  title: DevText
  /** One-line "main job" of the coach at this age. */
  goal: DevText
  /** What children of this age are like. */
  profile: DevText[]
  focus: Record<DevArea, DevText[]>
  /** Game formats and pitch. */
  formats: DevText[]
  /** How to build one session. */
  session: DevText
  /** Do / avoid for the coach. */
  coachDo: DevText[]
  coachAvoid: DevText[]
  /** Heading rule for this age (UEFA framework). */
  heading: DevText
  sources: string[]
}

export const DEV_STAGES: DevStage[] = [
  {
    id: 'st1',
    ages: '4–7',
    title: ["Futbolni sevib qolish", 'Влюбиться в футбол'],
    goal: ["Bola har mashg'ulotdan quvonch bilan qaytsin va yana kelishni xohlasin.", 'Ребёнок уходит с каждого занятия радостным и хочет прийти снова.'],
    profile: [
      ["Diqqat qisqa: bitta topshiriq bir necha daqiqadan ortiq ushlab turmaydi", 'Внимание короткое: одно задание держит лишь несколько минут'],
      ["Hamma to'p ortidan yuguradi — bu normal, jamoa tushunchasi hali shakllanmagan", 'Все бегут за мячом — это нормально, понятие команды ещё не сложилось'],
      ["O'yin va tasavvur orqali o'rganadi (ertak, obrazlar)", 'Учится через игру и воображение (сказки, образы)'],
    ],
    focus: {
      technical: [
        ["To'pni his qilish: ko'p teginish, ikki oyoq bilan", 'Чувство мяча: много касаний, обеими ногами'],
        ["Olib yurish, to'xtatish, darvozaga zarba", 'Ведение, остановка, удар по воротам'],
      ],
      tactical: [
        ["Qaysi darvozaga hujum qilamiz, to'pni yo'qotsak — qaytarib olamiz", 'Куда атакуем; потеряли мяч — отбираем'],
        ["1ga1 va kichik o'yinlarda o'zi qaror qilish", 'Сам принимает решения в 1×1 и маленьких играх'],
      ],
      physical: [
        ["Asosiy harakatlar: yugurish, sakrash, muvozanat, yo'nalish o'zgartirish", 'Базовые движения: бег, прыжки, равновесие, смена направления'],
        ["Koordinatsiya o'yinlari (quvlashmachoq, svetofor)", 'Игры на координацию (догонялки, «светофор»)'],
      ],
      mental: [
        ["Har bola muvaffaqiyatni his qilsin", 'Каждый ребёнок должен почувствовать успех'],
        ["Navbat, qoidalar va sherikni hurmat qilishni o'yin orqali o'rgatish", 'Через игру учить очереди, правилам, уважению к партнёру'],
      ],
    },
    formats: [
      ["3×3 yoki 4×4, bir nechta kichik maydon bir vaqtda", '3×3 или 4×4, несколько маленьких полей одновременно'],
      ["Darvozabonsiz yoki ko'p kichik darvoza bilan boshlang", 'Начинайте без вратарей или с несколькими маленькими воротами'],
      ["Kichik va yengil to'p (odatda 3-o'lcham)", 'Маленький и лёгкий мяч (обычно размер 3)'],
    ],
    session: ["O'yin – Mashq – O'yin: kichik o'yinlar bilan boshlang, keyin bitta ko'nikmani ko'p takrorlang (masalan 2×2), oxirida erkin o'yinda qo'llashsin. Bo'sh turish deyarli bo'lmasin.",
      'Игра – Упражнение – Игра: начните с маленьких игр, затем много повторений одного навыка (например 2×2), в конце свободная игра, где дети применяют навык. Почти без простоя.'],
    coachDo: [
      ["Har bolaga to'p — navbatda turish minimal", 'У каждого мяч — минимум ожидания в очереди'],
      ["Qisqa gapiring, ko'rsating, maqtang", 'Говорите коротко, показывайте, хвалите'],
      ["Bolalarga tanlov bering: o'yin qoidasini o'zlari taklif qilsin", 'Давайте выбор: пусть сами предлагают правила игры'],
    ],
    coachAvoid: [
      ["Uzun tushuntirish va saflarda kutish", 'Долгих объяснений и ожидания в колоннах'],
      ["Pozitsiyalarga qattiq bog'lash va natijaga bosim", 'Жёсткой привязки к позициям и давления на результат'],
    ],
    heading: ["Bosh bilan o'ynash o'rgatilmaydi. Faqat yumshoq to'p yoki shar bilan koordinatsiya o'yinlari.", 'Игру головой не учат. Только игры на координацию с мягким мячом или шариком.'],
    sources: ['fifaGrass', 'fifaPPP', 'fifaWarm', 'uefaRules', 'uefaHead'],
  },
  {
    id: 'st2',
    ages: '8–11',
    title: ["Texnikaning oltin yoshi", 'Золотой возраст техники'],
    goal: ["To'p bilan ishonchli bo'lish: ko'p teginish, ko'p qaror, ko'p zavq.", 'Уверенность с мячом: много касаний, много решений, много удовольствия.'],
    profile: [
      ["Yangi harakatlarni tez o'zlashtiradi — texnika uchun eng qulay davr", 'Быстро осваивает новые движения — лучший период для техники'],
      ["Musobaqani yaxshi ko'radi, o'zini boshqalar bilan solishtira boshlaydi", 'Любит соревноваться, начинает сравнивать себя с другими'],
      ["Sherik bilan birga o'ynashni tushuna boshlaydi", 'Начинает понимать игру вместе с партнёром'],
    ],
    focus: {
      technical: [
        ["Birinchi teginish, uzatma, olib yurish va aldash, zarba", 'Первое касание, передача, ведение и обводка, удар'],
        ["Ikkala oyoq, turli yuzalar (ichki, tashqi, taglik)", 'Обе ноги, разные поверхности (внутренняя, внешняя, подошва)'],
      ],
      tactical: [
        ["Atrofga qarash (skanerlash) va bo'sh joyga ochilish", 'Осмотр (сканирование) и открывание в свободную зону'],
        ["2×1, 3×2: qachon olib o'tish, qachon uzatish", '2×1, 3×2: когда обыгрывать, когда отдавать'],
        ["To'p yo'qolganda darhol qaytarib olish", 'Сразу отбирать мяч после потери'],
      ],
      physical: [
        ["Tezkorlik, chaqqonlik, koordinatsiya — to'p bilan", 'Быстрота, ловкость, координация — с мячом'],
        ["Alohida \"yugurish\" kerak emas: o'yinning o'zi yuklama beradi", 'Отдельный «бег» не нужен: нагрузку даёт сама игра'],
      ],
      mental: [
        ["Xatodan qo'rqmaslik — xato o'rganishning bir qismi", 'Не бояться ошибок — ошибка часть обучения'],
        ["Jamoada o'zini kerakli his qilish, do'stlik", 'Чувствовать себя нужным в команде, дружба'],
      ],
    },
    formats: [
      ["4×4 dan 7×7 gacha, kichik maydon", 'От 4×4 до 7×7, небольшое поле'],
      ["Neytral o'yinchilar bilan (masalan 3×3+2) — hujumda son ustunligi", 'С нейтральными (например 3×3+2) — численное преимущество в атаке'],
      ["To'p: 4-o'lcham", 'Мяч: размер 4'],
    ],
    session: ["Global – Analitik – Global: o'yin bilan boshlang va kimga nima kerakligini kuzating; keyin bitta texnik mavzuni raqibsiz takrorlang (tezlikdan ko'ra aniqlik muhim); oxirida yana o'yin — ko'nikma o'yinda ishladimi, tekshiring.",
      'Глобально – Аналитически – Глобально: начните с игры и понаблюдайте, кому что нужно; затем повторяйте одну техническую тему без соперника (точность важнее скорости); в конце снова игра — проверьте, работает ли навык.'],
    coachDo: [
      ["Haftada bir marta yig'ilsangiz ham: qiziqarli razminka, mini-o'yinlar, oxirida haqiqiy o'yin", 'Даже если встречаетесь раз в неделю: интересная разминка, мини-игры, в конце настоящая игра'],
      ["Pozitsiyalarni almashtiring — hamma hujumda ham, himoyada ham o'ynasin", 'Меняйте позиции — каждый играет и в атаке, и в защите'],
      ["Natijani emas, harakatni maqtang", 'Хвалите усилие, а не результат'],
    ],
    coachAvoid: [
      ["Har bir harakatni to'xtatib tuzatish (ortiqcha murabbiylik)", 'Останавливать и поправлять каждое действие (перетренированность словами)'],
      ["Faqat kuchli bolalarni o'ynatish", 'Выпускать только сильных'],
    ],
    heading: ["10–12 yoshda boshlang'ich o'rgatish: raqibsiz, yaqin masofadan, yengil to'p bilan. \"Yoshim — bosh zarbalarim\": masalan 10 yoshli bola haftasiga 10 tadan ko'p emas.", 'С 10–12 лет начальное обучение: без соперника, с близкого расстояния, лёгким мячом. «Мой возраст — мои удары»: например 10-летний не больше 10 в неделю.'],
    sources: ['fifaGrass', 'fifaGAG', 'fifaWeek', 'uefaRules', 'uefaNews', 'uefaHead'],
  },
  {
    id: 'st3',
    ages: '12–14',
    title: ["O'yinni tushunishni o'rganish", 'Учиться понимать игру'],
    goal: ["Texnikani bosim ostida va to'g'ri qaror bilan qo'llash.", 'Применять технику под давлением и с правильным решением.'],
    profile: [
      ["Bo'y tez o'sadi: koordinatsiya vaqtincha yomonlashishi mumkin", 'Быстрый рост: координация может временно ухудшиться'],
      ["Bir yoshdagi bolalar jismoniy jihatdan juda farq qiladi (erta va kech yetiluvchilar)", 'Ровесники сильно различаются физически (ранние и поздние)'],
      ["Tengdoshlar fikri juda muhim, o'zini tasdiqlashni istaydi", 'Мнение сверстников очень важно, хочет самоутвердиться'],
    ],
    focus: {
      technical: [
        ["Bosim ostida birinchi teginish, uzatma va zarba texnikasi", 'Первое касание, передача и удар под давлением'],
        ["Zarba: avval texnika, keyin kuch va tezlik", 'Удар: сначала техника, потом сила и скорость'],
      ],
      tactical: [
        ["To'pni saqlash, o'yinni oldinga olib chiqish, imkoniyat yaratish", 'Владение, продвижение мяча, создание моментов'],
        ["Kichik guruh harakatlari: sug'urta, kenglik, chuqurlik", 'Групповые действия: страховка, ширина, глубина'],
        ["Jamoa shakli va to'psiz harakat", 'Форма команды и движение без мяча'],
      ],
      physical: [
        ["Tana og'irligi bilan kuch, muvozanat, kor (qorin-bel)", 'Сила с собственным весом, баланс, кор'],
        ["O'sish davrida yuklamani ehtiyotkorlik bilan rejalash — jarohatning oldini olish", 'Аккуратно планировать нагрузку в период роста — профилактика травм'],
      ],
      mental: [
        ["Mas'uliyat: o'z rivojlanishi uchun uy vazifalari", 'Ответственность: домашние задания для своего развития'],
        ["Etakchilik, jamoaviylik, bosim ostida ishonch", 'Лидерство, командность, уверенность под давлением'],
      ],
    },
    formats: [
      ["7×7 va 9×9, 13–14 yoshdan katta maydon va 11×11 ga o'tish", '7×7 и 9×9, с 13–14 лет переход на большое поле и 11×11'],
      ["Rondo, son ustunligi o'yinlari, zonali o'yinlar", 'Рондо, игры с численным перевесом, игры по зонам'],
      ["To'p: 4-o'lcham, 13–14 yoshdan 5-o'lcham", 'Мяч: размер 4, с 13–14 лет размер 5'],
    ],
    session: ["Bosqichli usul: 1) texnik asos — ko'p takror, raqibsiz, lekin musobaqa elementi bilan; 2) taktikani kiritish — savollar bering; 3) o'yinda qo'llash — cheklovlar kam, murabbiy kam aralashadi.",
      'Прогрессивный метод: 1) техническая база — много повторений, без соперника, но с элементом соревнования; 2) ввод тактики — задавайте вопросы; 3) применение в игре — меньше ограничений, тренер вмешивается мало.'],
    coachDo: [
      ["Bitta mavzuni butun mashg'ulot davomida saqlang", 'Держите одну тему всё занятие'],
      ["Savol bilan o'rgating: \"Yana qanday variant bor edi?\"", 'Учите вопросами: «Какой был ещё вариант?»'],
      ["Kech yetiluvchilarni tashlab yubormang; kerak bo'lsa bo'y-vazn bo'yicha guruhlang", 'Не отсеивайте поздно созревающих; при необходимости группируйте по росту-весу'],
    ],
    coachAvoid: [
      ["Bugungi kuchli (erta o'sgan) bolalarga tayanib, qolganlarni chetga surish", 'Опираться только на сегодня сильных (рано выросших) и отодвигать остальных'],
      ["Kattalar mashg'ulotini nusxalash — bolalar kichik kattalar emas", 'Копировать взрослые тренировки — дети не маленькие взрослые'],
    ],
    heading: ["12 yoshdan razminkaga bo'yin va yelka mashqlari. 14 yoshdan yengil bosim bilan, kam takror va kuzatuv ostida.", 'С 12 лет — упражнения для шеи и плеч в разминке. С 14 лет — с лёгким давлением, малым числом повторов и под контролем.'],
    sources: ['fifaGrass', 'fifaProg', 'fifaSkill', 'fifaGame', 'fifaSpiral', 'fifaTrain', 'uefaU18', 'uefaHead'],
  },
  {
    id: 'st4',
    ages: '15–17',
    title: ["Katta futbolga tayyorlanish", 'Подготовка к взрослому футболу'],
    goal: ["Pozitsiyada o'ynash, musobaqa bosimi va mustaqil qaror.", 'Игра на позиции, соревновательное давление и самостоятельность.'],
    profile: [
      ["Jismonan kattalarga yaqinlashadi — kuch va chidamlilik o'sadi", 'Физически приближается к взрослым — растут сила и выносливость'],
      ["O'qish, ish, do'stlar — futboldan ketish xavfi yuqori (16–17 yosh)", 'Учёба, работа, друзья — высокий риск ухода из футбола (16–17 лет)'],
      ["Ishonch, maqsad va adolatli munosabatga sezgir", 'Чувствителен к доверию, цели и справедливому отношению'],
    ],
    focus: {
      technical: [
        ["Tezlikda va pozitsiyaga xos texnika (himoyachi, yarim himoyachi, hujumchi)", 'Техника на скорости и по позиции (защитник, полузащитник, нападающий)'],
      ],
      tactical: [
        ["Jamoa o'yin modeli: to'p bilan va to'psiz, o'tish fazalari", 'Модель игры команды: с мячом, без мяча, переходы'],
        ["Standart holatlar, o'yinni o'qish", 'Стандарты, чтение игры'],
      ],
      physical: [
        ["Kuch, tezlik va chidamlilikni rejalashtirilgan holda oshirish", 'Плановое развитие силы, скорости и выносливости'],
        ["Tiklanish: uyqu, ovqatlanish, yuklamani nazorat qilish", 'Восстановление: сон, питание, контроль нагрузки'],
      ],
      mental: [
        ["Maqsad qo'yish, o'z o'yinini tahlil qilish", 'Ставить цели, анализировать свою игру'],
        ["G'alaba va mag'lubiyatni to'g'ri qabul qilish, etakchilik", 'Правильно принимать победы и поражения, лидерство'],
      ],
    },
    formats: [
      ["11×11, katta maydon, 5-o'lcham to'p", '11×11, большое поле, мяч размер 5'],
      ["Turli darajadagi raqiblar bilan muntazam o'yinlar", 'Регулярные игры с соперниками разного уровня'],
    ],
    session: ["Kattalarnikiga yaqin: razminka, mavzu bo'yicha o'yin mashqlari, o'yin. Taktik va jismoniy yuklamani hafta davomida muvozanatlang.",
      'Близко к взрослой: разминка, игровые упражнения по теме, игра. Балансируйте тактическую и физическую нагрузку в течение недели.'],
    coachDo: [
      ["Har o'yinchi bilan yakka suhbat: maqsad va rivojlanish rejasi", 'Индивидуальные беседы: цель и план развития'],
      ["O'yin vaqti bering — o'yinchi o'yinda o'sadi", 'Давайте игровое время — игрок растёт в игре'],
    ],
    coachAvoid: [
      ["Faqat natija uchun o'ynab, rivojlanishni unutish", 'Играть только на результат и забыть о развитии'],
    ],
    heading: ["16 yoshdan bosh zarbasi to'liq o'yinning bir qismi (kross, standartlar, havo kurashi). Bo'yin-kor mashqlari va bosh zarbalari sonini nazorat qilish davom etadi.", 'С 16 лет игра головой — часть полной игры (навесы, стандарты, верховая борьба). Упражнения для шеи и кора и контроль количества ударов продолжаются.'],
    sources: ['fifaTrain', 'fifaPlay', 'fifaSpiral', 'uefaU18', 'uefaHead'],
  },
]

export interface DevPrinciple {
  id: string
  title: DevText
  idea: DevText
  tips: DevText[]
  sources: string[]
}

/** General coaching principles for youth coaches. */
export const DEV_PRINCIPLES: DevPrinciple[] = [
  {
    id: 'p1',
    title: ["Bola markazda", 'Ребёнок в центре'],
    idea: ["Futbolga bolaning ko'zi bilan qarang: u o'ynash, do'stlar bilan bo'lish va o'zini xavfsiz his qilish uchun keladi. Bolalar kichik kattalar emas.", 'Смотрите на футбол глазами ребёнка: он приходит играть, быть с друзьями и чувствовать себя в безопасности. Дети не маленькие взрослые.'],
    tips: [
      ["Mashg'ulot oxirida bolalardan so'rang: nima yoqdi?", 'В конце спросите детей: что понравилось?'],
      ["Mashqni yoshga moslang, kattalarnikini ko'chirmang", 'Подбирайте упражнения по возрасту, не копируйте взрослые'],
    ],
    sources: ['uefaRules'],
  },
  {
    id: 'p2',
    title: ["Avval sevgi, keyin o'rganish", 'Сначала любовь, потом обучение'],
    idea: ["Ko'pchilik bolalar professional bo'lmaydi, lekin hammasi sog'lom va faol inson bo'lib ulg'ayishi mumkin. Futbolni sevgan bola uzoq qoladi va ko'proq o'rganadi.", 'Большинство детей не станут профессионалами, но все могут вырасти здоровыми и активными. Ребёнок, который любит футбол, остаётся надолго и учится больше.'],
    tips: [
      ["Har mashg'ulotda albatta o'yin bo'lsin", 'В каждом занятии обязательно должна быть игра'],
      ["Kuchsizlar ham ko'p to'p teginsin va gol ursin", 'Слабые тоже должны много касаться мяча и забивать'],
    ],
    sources: ['uefaRules', 'fifaGrass'],
  },
  {
    id: 'p3',
    title: ["Hammani qamrab oling", 'Включайте всех'],
    idea: ["Mashg'ulot har xil darajadagi va har xil maqsaddagi bolalar uchun bo'lsin. Topshiriqni kuchli bola uchun qiyinlashtiring, zaif uchun osonlashtiring — lekin hamma bir o'yinda.", 'Занятие — для детей любого уровня и мотивации. Усложняйте задание сильному, упрощайте слабому — но все в одной игре.'],
    tips: [
      ["Bitta mashqqa \"oson\" va \"qiyin\" variant tayyorlang", 'Готовьте к упражнению «лёгкий» и «сложный» вариант'],
      ["Qizlar va yangilarga alohida e'tibor: qatnashishdagi to'siqlarni olib tashlang", 'Особое внимание девочкам и новичкам: убирайте барьеры для участия'],
    ],
    sources: ['uefaRules', 'fifaSkill'],
  },
  {
    id: 'p4',
    title: ["O'yin – eng yaxshi o'qituvchi", 'Игра — лучший учитель'],
    idea: ["Mashg'ulotni o'yin bilan boshlang va o'yin bilan tugating, o'rtada bitta ko'nikmani takrorlang. Kichik o'yinlarda har bola ko'p teginish va ko'p qaror oladi.", 'Начинайте и заканчивайте занятие игрой, в середине повторяйте один навык. В маленьких играх каждый получает много касаний и решений.'],
    tips: [
      ["4–8 yosh: O'yin – Mashq – O'yin", '4–8 лет: Игра – Упражнение – Игра'],
      ["8–12 yosh: Global – Analitik – Global", '8–12 лет: Глобально – Аналитически – Глобально'],
      ["12–15 yosh: texnika → taktika → o'yinda qo'llash", '12–15 лет: техника → тактика → применение в игре'],
    ],
    sources: ['fifaPPP', 'fifaGAG', 'fifaProg'],
  },
  {
    id: 'p5',
    title: ["Spiral: mavzuga qayta-qayta qaytish", 'Спираль: возвращаться к теме снова и снова'],
    idea: ["Asosiy mavzular (to'pni saqlash, oldinga olib chiqish, imkoniyat yaratish, to'pni qaytarish) bir marta o'tilmaydi. Har yoshda ularga qaytib, murakkabroq qilib o'rgatiladi.", 'Главные темы (владение, продвижение, создание моментов, отбор) не проходят один раз. В каждом возрасте к ним возвращаются и усложняют.'],
    tips: [
      ["Kuzat → maqsad qo'y → rejala → o'tkaz → tahlil qil → o'zgartir", 'Наблюдай → поставь цель → спланируй → проведи → проанализируй → измени'],
      ["O'yinchi bir joyda \"qotib\" qolmasin — qiyinlikni asta oshiring", 'Не давайте игроку «застрять» — постепенно повышайте сложность'],
    ],
    sources: ['fifaSpiral'],
  },
  {
    id: 'p6',
    title: ["Savol bering, javobni aytib bermang", 'Спрашивайте, а не подсказывайте'],
    idea: ["Yo'naltiruvchi savollar o'yinchini o'zi o'ylashga majbur qiladi. O'yin qismida murabbiy chetga chiqib kuzatadi, bolalar sinab ko'rsin.", 'Наводящие вопросы заставляют игрока думать самому. В игровой части тренер отходит и наблюдает, пусть дети пробуют.'],
    tips: [
      ["\"Qayerda bo'sh joy bor edi?\", \"Kim ochiq edi?\"", '«Где было свободное место?», «Кто был открыт?»'],
      ["Shaxsiy va ijobiy fikr bildiring, mashq paytida", 'Давайте личную и позитивную обратную связь во время упражнения'],
    ],
    sources: ['fifaPPP', 'fifaSkill', 'fifaGame'],
  },
  {
    id: 'p7',
    title: ["Musobaqa — rivojlanish uchun", 'Соревнование — ради развития'],
    idea: ["Musobaqa qo'rqitmasin, motivatsiya bersin. U adolat, hurmat va jamoaviylikni o'rgatadi. Formati bolalarga mos bo'lishi kerak: kichik maydon, kam o'yinchi, hamma o'ynaydi.", 'Соревнование должно мотивировать, а не пугать. Оно учит честности, уважению и командности. Формат — под детей: маленькое поле, мало игроков, играют все.'],
    tips: [
      ["Mashq ichiga ochko va kichik musobaqalar qo'shing", 'Добавляйте очки и мини-соревнования внутрь упражнений'],
      ["Turnirda hamma bolaga teng o'yin vaqti", 'На турнире — равное игровое время всем'],
    ],
    sources: ['uefaRules', 'uefaNews', 'fifaPlay'],
  },
  {
    id: 'p8',
    title: ["Biologik yoshni hisobga oling", 'Учитывайте биологический возраст'],
    idea: ["Bir yoshdagi bolalar bo'yi va kuchi bo'yicha 2–3 yilga farq qilishi mumkin. Erta o'sganlar bugun kuchli, kech o'sganlar ertaga yulduz bo'lishi mumkin.", 'Ровесники могут отличаться по росту и силе на 2–3 года. Рано выросшие сильны сегодня, поздние могут стать звёздами завтра.'],
    tips: [
      ["Erta o'sganni bir yosh yuqoriga o'tkazish mumkin", 'Рано созревшего можно перевести на год старше'],
      ["Kech o'sganni bo'yi o'xshash bolalar bilan mashq qildiring", 'Поздно созревающего тренируйте с похожими по росту'],
      ["Bo'y va vaznni har 3 oyda yozib boring", 'Записывайте рост и вес каждые 3 месяца'],
    ],
    sources: ['fifaTrain', 'fifaSpiral'],
  },
  {
    id: 'p9',
    title: ["Kam bola — ko'proq murabbiy vaqti", 'Меньше детей — больше внимания тренера'],
    idea: ["Bir murabbiyga to'g'ri keladigan o'yinchilar qancha kam bo'lsa, har biri shuncha ko'p e'tibor oladi. Kuchli federatsiyalarda 9–11 yoshda bir murabbiyga taxminan 10 bola to'g'ri keladi.", 'Чем меньше игроков на тренера, тем больше внимания каждому. В сильных федерациях в 9–11 лет на тренера приходится около 10 детей.'],
    tips: [
      ["Katta guruhni 2–3 kichik maydonga bo'ling, yordamchi yoki ota-onani jalb qiling", 'Делите большую группу на 2–3 поля, привлекайте помощника или родителя'],
      ["O'yinchilarga uy vazifasi bering (masalan, 100 ta jonglyor)", 'Давайте домашние задания (например, 100 набиваний)'],
    ],
    sources: ['fifaTrain'],
  },
  {
    id: 'p10',
    title: ["Ota-onalar — hamkor", 'Родители — партнёры'],
    idea: ["Ota-onalarni muammo emas, yordamchi deb biling. Ularga qanday yordam berishlarini tushuntiring: qo'llab-quvvatlash, chetdan baqirmaslik, natijadan ko'ra quvonch.", 'Родители — не проблема, а помощники. Объясните, как помочь: поддерживать, не кричать с бровки, радость важнее счёта.'],
    tips: [
      ["Mavsum boshida ota-onalar bilan qisqa uchrashuv", 'Короткая встреча с родителями в начале сезона'],
      ["O'yin paytida ota-onalar chiziqdan uzoqroq tursin", 'Во время игры родители стоят подальше от бровки'],
    ],
    sources: ['uefaRules', 'uefaNews'],
  },
  {
    id: 'p11',
    title: ["O'smirlar bilan muloqot", 'Общение с подростками'],
    idea: ["O'smir uchun do'stlik, jamoada qabul qilinish va o'zini boshqalar bilan solishtirish juda muhim. Murabbiyga hissiyotni boshqarish, tinglash, hamdardlik va aniq tushuntirish kerak.", 'Для подростка очень важны дружба, принятие в команде и сравнение себя с другими. Тренеру нужны управление эмоциями, умение слушать, эмпатия и ясные объяснения.'],
    tips: [
      ["Hech kimni jamoa oldida kamsitmang", 'Никого не унижайте перед командой'],
      ["Bola o'ynashni \"xohlasin\", \"majbur\" bo'lmasin", 'Пусть ребёнок «хочет» играть, а не «должен»'],
    ],
    sources: ['uefaU18'],
  },
  {
    id: 'p12',
    title: ["Bosh bilan o'ynash xavfsizligi", 'Безопасная игра головой'],
    idea: ["Bosh zarbasi bosqichma-bosqich o'rgatiladi: sifat miqdordan muhim. To'g'ri to'p, bo'yin-kor mashqlari va sog'liq birinchi o'rinda.", 'Игру головой учат постепенно: качество важнее количества. Правильный мяч, упражнения для шеи и кора, здоровье прежде всего.'],
    tips: [
      ["Ho'l yoki juda qattiq to'p bilan bosh mashqi qilmang", 'Не тренируйте игру головой мокрым или перекачанным мячом'],
      ["Bosh og'rig'i, bosh aylanishi, ko'ngil aynishi bo'lsa — darhol to'xtating, shu kuni qaytarmang, ota-onaga xabar bering, faqat shifokor ruxsati bilan qaytsin", 'Головная боль, головокружение, тошнота — сразу остановить, в тот же день не возвращать, сообщить родителям, вернуть только с разрешения врача'],
    ],
    sources: ['uefaHead'],
  },
]

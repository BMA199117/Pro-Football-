import type { Row } from './library-books'

/**
 * Professional (18+) sample drills from three Phase of Play books on positional play:
 * "Positional Play" (pp-<page>), "Xabi Alonso: Positionism and Relationism" (xa-<page>),
 * "4-3-3 In Possession" (ip-<page>). Retold briefly in our own words; diagrams in src/book/pos-*.ts.
 * Only drills not already in the app were taken (e.g. the 4v4+3 positional rondo = s100-87 is left out).
 */
type T = [string, string]
const r = (id: string, src: string, dia: Row[2], min: number, players: string, name: T, desc: T, equip: T, points: T[]): Row =>
  [id, 'tact', dia, 'Pro', min, players, src, name, desc, equip, points]

const MINI: T = ["Kichik darvozalar, konuslar, nimchalar, to'plar", 'Малые ворота, конусы, манишки, мячи']
const CONES: T = ["Konuslar, nimchalar, to'plar", 'Конусы, манишки, мячи']
const BIG: T = ["Katta darvoza, kichik darvozalar, konuslar, nimchalar, to'plar", 'Большие ворота, малые ворота, конусы, манишки, мячи']
const TOUCH: T = ["Avval tegish cheklovisiz, keyin 3 va 2 marta tegish bilan — o'yin tezlashadi", 'Сначала без ограничения касаний, затем 3 и 2 касания — игра ускоряется']
const THIRD: T = ["Uchinchi o'yinchini qidiring: to'p kimga borishini oldindan biling", 'Ищите третьего: заранее знайте, куда пойдёт мяч']
const TRANS: T = ["To'p yo'qotilganda darhol kontrpressing, olinganda — darhol oldinga", 'Потеря мяча — сразу контрпрессинг, отбор — сразу вперёд']
const ANGLE: T = ["To'p egasiga burchak ostida ochiling, uchburchaklar hosil qiling", 'Открывайтесь под углом к владеющему, образуйте треугольники']
const INVITE: T = ["Bosimni chaqiring: to'pni chuqurda sabr bilan ushlang, oldinda bo'sh joy ochiladi", 'Приглашайте прессинг: терпеливо держите мяч в глубине, впереди откроется пространство']
const UBT: T = ["«Yuqoriga – orqaga – oldinga» (up, back, through): oldinga pas, qaytarish, chiziq ortiga pas", '«Вверх – назад – вперёд» (up, back, through): пас вперёд, скидка назад, пас за линию']
const COMPACT: T = ["Chiziqlar orasi 8–12 m, blok ixcham, to'p tomonga birga suriladi", 'Между линиями 8–12 м, блок компактный, вместе смещается к мячу']

const PP = 'posPlay', XA = 'xabi', IP = 'ip433'

export const POS_PLAY: Row[] = [
  // ---------- Positional Play ----------
  r('pp-19', PP, 'rondo', 15, '11', ["Darvozabondan 9-raqamgacha (rondo 7×4)", 'От вратаря до девятки (рондо 7×4)'],
    ["20×15 m maydon. Ko'klar (darvozabon, 2 markaziy va 2 chetki himoyachi, 6 va 9) to'pni darvozabondan 9-raqamgacha qoralar tegmasdan yetkazsa, ochko oladi (kamida 2 pas, 2 marta tegish). Keyin teskari yo'nalishda. Qoralar 4 kishi bosadi va to'pni olsa, pastdagi 3 ta kichik darvozadan biriga uradi.",
     'Поле 20×15 м. Синие (вратарь, 2 центральных и 2 крайних защитника, 6 и 9) получают очко, если доведут мяч от вратаря до 9-го без касания чёрных (минимум 2 паса, 2 касания). Затем в обратную сторону. Четверо чёрных прессингуют и после отбора бьют в одни из 3 малых ворот.'],
    MINI, [ANGLE, ["Kenglik va chuqurlik: maydon chetlarini egallang", 'Ширина и глубина: занимайте края поля'], ["Darvozabon — son ustunligi uchun qo'shimcha o'yinchi", 'Вратарь — лишний игрок для численного превосходства'], THIRD]),
  r('pp-26', PP, 'rondo', 15, '11', ["Pozitsion rondo 7×4: bitta chiziqda pas yo'q", 'Позиционное рондо 7×4: без паса по одной вертикали'],
    ["20×20 m, ikki yonida yo'lak chizilgan. Ko'klar 2 marta tegish bilan to'pni ushlaydi, 15 ta pas — ochko. Chetki himoyachi va qanot hujumchisi bir vertikal chiziqda turganda bir-biriga pas bera olmaydi: diagonal ochilish kerak. Qoralar to'pni olsa, burchaklardagi 4 ta kichik darvozadan biriga uradi.",
     '20×20 м, по бокам размечены коридоры. Синие держат мяч в 2 касания, 15 передач — очко. Крайний защитник и вингер, стоящие на одной вертикали, не могут пасовать друг другу: нужно открыться по диагонали. Чёрные после отбора бьют в одни из 4 малых ворот в углах.'],
    MINI, [["Diagonal ochilish: bir chiziqda ikki kishi turmasin", 'Открывание по диагонали: двое не стоят на одной линии'], ANGLE, ["Pas — keyingi o'yinchining oldingi oyog'iga", 'Пас — на дальнюю от соперника ногу партнёра'], TRANS]),
  r('pp-29', PP, 'rondo', 12, '10', ["Rotatsiyalar rondosi 3×3+4", 'Рондо на ротации 3×3+4'],
    ["20×15 m maydon 4 kvadratga bo'linadi. Ichkarida ikki yarim himoyachilar uchligi to'p uchun kurashadi, tashqaridagi 4 neytral to'pga ega jamoa bilan o'ynaydi (1 marta tegish). To'pga ega jamoa o'yinchilari bitta kvadratda qola olmaydi — doim rotatsiya va harakat.",
     'Поле 20×15 м разделено на 4 квадрата. Внутри две тройки полузащитников борются за мяч, 4 нейтральных снаружи играют с владеющей командой (1 касание). Игроки владеющей команды не могут оставаться в одном квадрате — постоянная ротация и движение.'],
    CONES, [["Bo'sh kvadratga o'ting, sherigingiz joyini oling", 'Переходите в свободный квадрат, занимайте место партнёра'], THIRD, ["Birinchi teginish — keyingi pas tomonga", 'Первое касание — в сторону следующего паса'], ["Neytrallardan son ustunligi uchun foydalaning", 'Используйте нейтральных для численного превосходства']]),
  r('pp-32', PP, 'rondo', 12, '12', ["Vertikal rondo 4×4+4", 'Вертикальное рондо 4×4+4'],
    ["Tor va uzun maydon (30×10 m) vertikal paslarni qidirishga majbur qiladi. Ko'klar 2 marta tegish bilan tez kombinatsiyalar orqali to'pni bir uchdan ikkinchi uchga olib o'tadi; neytrallar (uchlarda va yonlarda) 1 marta tegadi. 15 ta pas ketma-ket — ochko. Qoralar to'pni olsa, rollar almashadi.",
     'Узкое длинное поле (30×10 м) заставляет искать вертикальные передачи. Синие в 2 касания быстрыми комбинациями проводят мяч из одного конца в другой; нейтральные (на концах и по бокам) играют в 1 касание. 15 передач подряд — очко. После отбора команды меняются ролями.'],
    CONES, [["Imkon bo'lsa — vertikal pas, chiziqlar orasidan", 'Есть возможность — вертикальный пас сквозь линии'], THIRD, ["Raqib chiziqlari orasida ochiling", 'Открывайтесь между линиями соперника'], TRANS]),
  r('pp-35', PP, 'smallgame', 12, '9', ["Ixchamlik: ozchilikda himoya 5×4", 'Компактность: оборона в меньшинстве 5×4'],
    ["30×30 m, ikki uchida 3 tadan kichik darvoza. Qoralar 2-3 shaklida hujum qiladi, ko'klar 2-2 shaklida himoyalanadi. Ko'klarning vazifasi — ixcham turib, to'p tomonga birga surilish va ozchilikda gol o'tkazmaslik. To'pni olsa, 6 soniyada qarama-qarshi kichik darvozalardan biriga uradi.",
     '30×30 м, на каждом конце по 3 малых ворот. Чёрные атакуют в построении 2-3, синие обороняются в 2-2. Задача синих — оставаться компактными, вместе смещаться к мячу и не пропустить в меньшинстве. После отбора — 6 секунд, чтобы забить в одни из малых ворот на другой стороне.'],
    MINI, [COMPACT, ["Markazni yoping, raqibni chetga yo'naltiring", 'Закрывайте центр, уводите соперника к краю'], ["Bir kishi bosadi, qolganlar sug'urtalaydi", 'Один прессингует, остальные страхуют'], ["To'p olinganda — tez qarshi hujum", 'После отбора — быстрая контратака']]),
  r('pp-39', PP, 'rondo', 15, '11', ["O'tishlar bilan rondo 7×4 (FC Barcelona)", 'Рондо 7×4 с переходами (ФК «Барселона»)'],
    ["40×20 m, ikki uchida yakunlash zonasi va 3 tadan kichik darvoza. Qoralar 2 marta tegish bilan to'pni ushlaydi, 10 ta pas — ochko. Ko'klar 4 kishi bosadi; to'pni olsa, yakunlash zonasiga kirib, 6 ta kichik darvozadan biriga uradi (tegish cheklanmagan). To'pni yo'qotgan qoralar darhol kontrpressing qiladi.",
     '40×20 м, на концах зоны завершения и по 3 малых ворот. Чёрные держат мяч в 2 касания, 10 передач — очко. Четверо синих прессингуют; после отбора входят в зону завершения и бьют в одни из 6 малых ворот (касания не ограничены). Потерявшие мяч чёрные сразу включают контрпрессинг.'],
    MINI, [TRANS, ["Bosimdan dribling bilan chiqing, keyin zonaga kiring", 'Выходите из-под давления дриблингом, затем входите в зону'], ["Bosimda ham 2 ta pas varianti bo'lsin", 'Даже под давлением — два варианта паса'], ["Birinchi 5 soniya: to'pni qaytarib olish", 'Первые 5 секунд — вернуть мяч']]),
  r('pp-41', PP, 'rondo', 12, '10', ["«Yuqoriga – orqaga – oldinga» rondosi 6×4", 'Рондо 6×4 «вверх – назад – вперёд»'],
    ["Uchta zona: ikki chetki va o'rtada tor zona. Ko'klar bitta zonada 4×2 da boshlaydi, ikkinchi zonada 2 hujumchi va 1 himoyachi. Bir hujumchi o'rta zonaga tushib, orqaga pas beradi: to'p faqat «yuqoriga – orqaga – oldinga» bilan keyingi zonaga o'tadi. To'p yo'lda ekan, chetki o'yinchilar (2 va 3) keyingi zonaga yuguradi, u yerda yana 4×2 bo'ladi. 2 marta tegish.",
     'Три зоны: две крайние и узкая в середине. Синие начинают 4×2 в одной зоне, во второй — 2 атакующих и 1 защитник. Один атакующий опускается в среднюю зону и отдаёт назад: мяч переходит в следующую зону только через «вверх – назад – вперёд». Пока мяч в пути, крайние (2 и 3) бегут в следующую зону, где снова 4×2. 2 касания.'],
    CONES, [UBT, ["Tushib kelish va yugurish vaqti pas bilan bir paytda", 'Опускание и рывок — одновременно с пасом'], ["Orqaga pas — bir teginishda, oldingi oyoqqa", 'Скидка назад — в одно касание, на ход'], ANGLE]),
  r('pp-45', PP, 'smallgame', 15, '17', ["Ortiqcha yuklab, yakkalash (2 zona)", 'Перегрузка и изоляция (2 зоны)'],
    ["Ortiqcha yuklash zonasida ko'klar va qoralar neytral bilan to'pni ushlaydi (2 marta tegish). 5 ta pasdan keyin to'p yakkalash zonasidagi qanot hujumchisiga (7) uzatiladi, u bir teginishda chetki himoyachiga (2) qaytaradi. Shundan keyin 5 soniya 2×1: himoyachi faqat chetki himoyachi to'pni olganda faollashadi, gol 2 ta kichik darvozadan biriga.",
     'В зоне перегрузки синие и чёрные с нейтральным держат мяч (2 касания). После 5 передач мяч уходит вингеру (7) в зону изоляции, тот в одно касание скидывает крайнему защитнику (2). Затем 5 секунд 2×1: защитник включается, только когда крайний получил мяч, гол — в одни из 2 малых ворот.'],
    MINI, [["Bir tomonda ko'pchilik — raqibni torting, keyin uzoq tomonga", 'Перегрузите одну сторону — стяните соперника, затем на дальнюю'], ["Uzoq tomonda 1–2 o'yinchi qolsin", 'На дальней стороне оставьте 1–2 игроков'], ["Pas uzatilganda qabul qiluvchiga yordamga yuguring", 'После переноса — сразу поддержка принимающего'], ["2×1: himoyachini o'zingizga torting, keyin pas", '2×1: привяжите защитника к себе, потом пас']]),

  // ---------- Xabi Alonso ----------
  r('xa-12', XA, 'rondo', 12, '13', ["Yaqin masofada pozitsion rondo 5×5+3", 'Позиционное рондо в близкой дистанции 5×5+3'],
    ["Tor maydon (35×10 m). 3 neytral (uchlarda markaziy himoyachilar, o'rtada tayanch yarim himoyachi) to'pga ega jamoa bilan o'ynaydi (2 marta tegish). To'p kamida 3 ta pas bilan bir uchdan ikkinchi uchga yetsa — ochko. Tor maydon vertikal yechim qidirishga majbur qiladi. To'pni yo'qotgan jamoa darhol kontrpressing qiladi.",
     'Узкое поле (35×10 м). 3 нейтральных (центральные защитники на концах, опорный в середине) играют с владеющей командой (2 касания). Мяч доведён из одного конца в другой минимум за 3 передачи — очко. Узкое поле заставляет искать вертикальные решения. Потерявшая мяч команда сразу контрпрессингует.'],
    CONES, [["Birinchi teginish shunday bo'lsinki, ikkinchisi — uchinchi o'yinchiga pas", 'Первое касание такое, чтобы второе стало пасом третьему'], ANGLE, ["Qisqa va tez paslar, imkon bo'lsa — chiziqlar orasidan", 'Короткие быстрые пасы, при возможности — сквозь линии'], TRANS]),
  r('xa-23', XA, 'rondo', 12, '8', ["3 markaziy himoyachi va «ikki tayanch» (rondo 5×3)", 'Три центральных и двойной опорный (рондо 5×3)'],
    ["25×20 m. Qizillar (3 markaziy himoyachi va 2 tayanch yarim himoyachi) o'rta blokka qarshi markazdan o'yin quradi: 10 ta pas ketma-ket — ochko. Qoralar (2 hujumkor yarim himoyachi va hujumchi) jadal bosadi va to'pni olsa, 2 ta kichik darvozadan biriga uradi; qizillar darhol kontrpressing qiladi.",
     '25×20 м. Красные (3 центральных защитника и 2 опорных) строят игру через центр против среднего блока: 10 передач подряд — очко. Чёрные (2 атакующих полузащитника и нападающий) активно прессингуют и после отбора бьют в одни из 2 малых ворот; красные сразу контрпрессингуют.'],
    MINI, [["Ikki tayanch yaqin va turli balandlikda turadi", 'Двое опорных рядом и на разной высоте'], INVITE, THIRD, TRANS]),
  r('xa-25', XA, 'pass', 15, '9–18', ["Qanot orqali kombinatsiyalar (A va B sxemalari)", 'Комбинации через фланг (схемы A и B)'],
    ["A sxemasi: markaziy himoyachi → tayanch → ikkinchi markaziy himoyachi → hujumkor yarim himoyachi → tayanch → bo'sh joyga yugurgan chap qanot himoyachisi. B sxemasi: markaziy himoyachi → hujumkor yarim himoyachi → tayanch → hujumchi → unga qarab kelgan hujumkor yarim himoyachi → o'ng qanot himoyachisi. Himoyachilar to'p qanotga borguncha passiv bosadi, keyin erkin o'yin: qanot himoyachisi gol urishga harakat qiladi.",
     'Схема A: центральный защитник → опорный → второй центральный → атакующий полузащитник → опорный → левый вингбек, убегающий в свободную зону. Схема B: центральный защитник → атакующий полузащитник → опорный → нападающий → встречный атакующий полузащитник → правый вингбек. Защитники пассивно прессингуют, пока мяч не ушёл на фланг, затем свободная игра: вингбек пытается забить.'],
    BIG, [["Avval ichkariga, keyin tashqariga: markaz orqali torting", 'Сначала внутрь, потом наружу: стяните соперника через центр'], UBT, ["Qanot himoyachisi pas bilan bir paytda yuguradi", 'Вингбек стартует одновременно с пасом'], ["Sxemani bilib, o'yinda vaziyatni taniy oling", 'Выучив схему, узнавайте её в игре']]),
  r('xa-30', XA, 'smallgame', 15, '17', ["Past blokka qarshi markazdan (8×8+darvozabon)", 'Против низкого блока через центр (8×8+вратарь)'],
    ["Qizillar 3-2-3 shaklida past blokni markazdan yorib, katta darvozaga gol urishga harakat qiladi (ofsayd bor). Qoralar ixcham turadi; to'pni olsa, 5 soniyada 3 ta kichik darvozadan biriga uradi. O'yin qizillarning to'pi bilan boshlanadi.",
     'Красные в построении 3-2-3 вскрывают низкий блок через центр и атакуют большие ворота (офсайд действует). Чёрные остаются компактными; после отбора за 5 секунд бьют в одни из 3 малых ворот. Игра начинается с мяча у красных.'],
    BIG, [["Bir-ikki va «yuqoriga – orqaga – oldinga» kombinatsiyalari", 'Стенки и комбинация «вверх – назад – вперёд»'], ["Pas ber va harakatlan (toco y me voy)", 'Отдай и открывайся (toco y me voy)'], ["Yarim himoya va himoya chiziqlari orasidagi «cho'ntak»larda oling", 'Принимайте в «карманах» между линиями полузащиты и обороны'], ["Dribling bilan 2 himoyachini torting", 'Дриблингом стягивайте двух защитников']]),
  r('xa-34', XA, 'shoot', 15, '11', ["Qanot himoyachilari orqali yakunlash (5×5+darvozabon)", 'Завершение через вингбеков (5×5+вратарь)'],
    ["Murabbiy to'pni markazdagi 3 hujumchidan biriga beradi (qanot himoyachilari chetki yo'lakda turadi), ular to'pni qanotga uzatadi. Shundan keyin cheklovlar yo'q: qanot himoyachisi erta oshiradi yoki jarima maydoniga kiradi, qolganlar maydonga yuguradi. Qoralar to'pni olsa, 7 soniyada 3 ta kichik darvozadan biriga uradi.",
     'Тренер отдаёт мяч одному из 3 центральных атакующих (вингбеки — в крайних коридорах), они переводят мяч на фланг. Дальше ограничений нет: вингбек подаёт рано или входит в штрафную, остальные врываются в штрафную. Чёрные после отбора за 7 секунд бьют в одни из 3 малых ворот.'],
    BIG, [["Oshirmalar har xil: past, orqaga (cut-back), baland", 'Разные подачи: низом, назад (cut-back), верхом'], ["«Noaniqlik koridori»ga — darvozabon va himoyachilar orasiga", 'В «коридор неуверенности» — между вратарём и защитниками'], ["Yaqin, uzoq burchak va orqaga — maydonni to'ldiring", 'Ближняя, дальняя штанга и под откат — заполните штрафную'], ["Darvoza oldida sovuqqonlik", 'Хладнокровие у ворот']]),
  r('xa-38', XA, 'smallgame', 15, '15', ["Shaxsiy yuqori pressing 3-2-5 (7×7+darvozabon)", 'Персональный высокий прессинг 3-2-5 (7×7+вратарь)'],
    ["Qoralar darvozabondan o'yin boshlab, 3 ta kichik darvozadan biriga gol urishga harakat qiladi. Qizillar har biri o'z raqibini ushlab turadi; markaziy himoyachi darvozabonga orqaga pas bersa (signal), bir qizil darvozabonni bosadi, qolganlar birga bosimga o'tadi. To'pni olsa, 7 soniyada katta darvozaga uradi.",
     'Чёрные разыгрывают от вратаря и пытаются забить в одни из 3 малых ворот. У каждого красного свой подопечный; когда центральный защитник отдаёт назад вратарю (сигнал), один красный прессингует вратаря, остальные синхронно включаются в прессинг. После отбора — 7 секунд на удар по большим воротам.'],
    BIG, [["Signallar: orqaga pas, yomon qabul, to'p qanotga", 'Сигналы: пас назад, плохой приём, мяч на фланге'], ["Bosayotgan o'yinchi xavfli pas yo'lini soyasi bilan yopadi", 'Прессингующий «тенью» закрывает опасную передачу'], ["Hamma birga suriladi, oraliq qolmaydi", 'Все смещаются вместе, без разрывов'], ["Pressing yorilsa — tez orqaga, ixchamlik birinchi", 'Прессинг пройден — быстро назад, компактность прежде всего']]),
  r('xa-39', XA, 'rondo', 12, '11', ["Kontrpressing o'yini 5×5+1", 'Игра на контрпрессинг 5×5+1'],
    ["30×30 m, har tomonda kichik darvoza. To'pga ega jamoa neytral bilan 10 ta pas ketma-ket qilsa — ochko. Raqib jadal bosadi va to'pni olsa, 4 ta kichik darvozadan biriga uradi. To'pni yo'qotgan jamoa darhol kontrpressing qiladi.",
     '30×30 м, с каждой стороны малые ворота. Владеющая команда с нейтральным делает 10 передач подряд — очко. Соперник активно прессингует и после отбора бьёт в одни из 4 малых ворот. Потерявшая мяч команда сразу включает контрпрессинг.'],
    MINI, [["To'p yo'qotilgandan keyingi birinchi 5 soniya hal qiladi", 'Первые 5 секунд после потери решают всё'], ["Yaqin o'yinchilar to'p egasini o'rab oladi, qolganlar pas yo'llarini yopadi", 'Ближние окружают владеющего, остальные закрывают передачи'], ["Bosim va sug'urta muvozanati: kimdir uzun pasni ushlaydi", 'Баланс прессинга и страховки: кто-то перехватывает длинный пас'], ["To'p olinganda — tez vertikal pas yoki yugurish", 'После отбора — быстрый вертикальный пас или рывок']]),
  r('xa-41', XA, 'smallgame', 15, '12', ["O'rta blokda markaziy ixchamlik (5+darvozabon × 6)", 'Компактность в среднем блоке (5+вратарь × 6)'],
    ["Qoralar 6 kishi bilan hujum qiladi. Qizillar ozchilikda (2-2-1 shakli va darvozabon) ixcham turib, markazni himoya qiladi va to'p tomonga birga suriladi. To'pni olsa, 8 soniyada 3 ta kichik darvozadan biriga uradi.",
     'Чёрные атакуют вшестером. Красные в меньшинстве (построение 2-2-1 и вратарь) остаются компактными, защищают центр и вместе смещаются к мячу. После отбора — 8 секунд, чтобы забить в одни из 3 малых ворот.'],
    BIG, [COMPACT, ["Tayanch yarim himoyachiga pas yo'lini yoping", 'Закрывайте передачу на опорного соперника'], ["Tana holati bilan raqibni chetga yo'naltiring", 'Положением корпуса уводите соперника к флангу'], ["Sabr: shaklni buzib oldinga chiqmang", 'Терпение: не ломайте построение лишним выходом']]),

  // ---------- 4-3-3 In Possession ----------
  r('ip-11a', IP, 'rondo', 10, '6', ["Darvozabon, 2 markaziy himoyachi va «6» (rondo 4×2)", 'Вратарь, два центральных и «шестой» (рондо 4×2)'],
    ["11×10 m. Darvozabon, 2 markaziy himoyachi va tayanch yarim himoyachi (6) — yuqori pressingga qarshi markazdan o'yin boshlashning asosiy olmos shakli. To'pni 2 marta tegish bilan ushlaydi, 2 qora jadal bosadi.",
     '11×10 м. Вратарь, 2 центральных защитника и опорный (6) — основной ромб для начала атаки через центр против высокого прессинга. Держат мяч в 2 касания, двое чёрных активно прессингуют.'],
    CONES, [["Olmos: darvozabon, 2 markaziy himoyachi va 6", 'Ромб: вратарь, 2 центральных и 6-й'], ["To'pni ishonch bilan aylantiring", 'Катайте мяч уверенно'], ["Tempni boshqaring", 'Управляйте темпом'], ["Erkin o'yinchini toping", 'Найдите свободного игрока']]),
  r('ip-11b', IP, 'smallgame', 15, '11', ["Orqadan markaz orqali o'yin boshlash (5+darvozabon × 5)", 'Выход из обороны через центр (5+вратарь × 5)'],
    ["40×40 m. To'q sariqlar darvozabondan boshlab, yuqori pressingga qarshi o'yin quradi va 3 ta kichik darvozadan biriga gol uradi. Qoralar jadal bosadi va to'pni olsa, 6 soniyada katta darvozaga hujum qiladi. To'p chiqib ketsa, yana boshlang'ich holatdan.",
     '40×40 м. Оранжевые начинают от вратаря, строят атаку против высокого прессинга и забивают в одни из 3 малых ворот. Чёрные активно прессингуют и после отбора за 6 секунд атакуют большие ворота. Мяч ушёл за поле — снова со стартовой позиции.'],
    BIG, [TOUCH, ["Yarim himoyachilar tushib, son ustunligi yaratadi", 'Полузащитники опускаются и создают численное превосходство'], INVITE, ["Oldinga o'ynash imkonini taniy oling", 'Узнавайте момент для игры вперёд']]),
  r('ip-13', IP, 'rondo', 12, '8', ["Qanot orqali o'yin boshlash (rondo 5×3)", 'Выход через фланг (рондо 5×3)'],
    ["20×15 m. To'q sariqlar (markaziy himoyachi 5, chetki himoyachi 3, 6, 8 va qanot hujumchisi 11) to'pni 5-raqamdan yuqoridagi 11-raqamga olib chiqishi kerak; 10 ta pas ketma-ket — ochko. Qoralar jadal bosadi, to'pni olsa 4 ta kichik darvozadan biriga uradi; to'q sariqlar kontrpressing qiladi.",
     '20×15 м. Оранжевые (центральный защитник 5, крайний 3, 6-й, 8-й и вингер 11) должны вывести мяч от 5-го к 11-му наверху; 10 передач подряд — очко. Чёрные активно прессингуют, после отбора бьют в одни из 4 малых ворот; оранжевые контрпрессингуют.'],
    MINI, [TOUCH, ANGLE, THIRD, TRANS]),
  r('ip-19a', IP, 'smallgame', 10, '5', ["Uchinchi o'yinchi bilan o'yin 2×2+1", 'Игра с третьим 2×2+1'],
    ["22×18 m, har uchida 2 ta kichik darvoza. Gol faqat neytral 10-raqam ishtirokidagi uchinchi o'yinchi kombinatsiyasidan keyin hisoblanadi; neytral bir marta tegadi. Yarim himoyachilar uchligining aloqasi.",
     '22×18 м, на каждом конце по 2 малых ворот. Гол засчитывается только после комбинации с третьим через нейтрального 10-го; нейтральный играет в одно касание. Связи в тройке полузащитников.'],
    MINI, [THIRD, ["Uchinchi o'yinchi yugurishni pas bilan bir paytda boshlaydi", 'Третий начинает рывок одновременно с пасом'], ["Vertikal va gorizontal chiziqlar orasida turing", 'Располагайтесь между вертикальными и горизонтальными линиями'], TOUCH]),
  r('ip-19b', IP, 'smallgame', 12, '8', ["«Soxta 9» bilan 4×4", '4×4 с «ложной девяткой»'],
    ["Yarim himoyachilar uchligi va soxta 9-raqam 2 ta kichik darvozaga hujum qiladi. Oddiy gol — 1 ochko, «yuqoriga – orqaga – oldinga» kombinatsiyasidan keyingi gol — 3 ochko.",
     'Тройка полузащитников и ложная девятка атакуют 2 малых ворот. Обычный гол — 1 очко, гол после комбинации «вверх – назад – вперёд» — 3 очка.'],
    MINI, [UBT, ["Soxta 9 tushib keladi, himoyachini o'zi bilan tortadi", 'Ложная девятка опускается и уводит за собой защитника'], ["Rotatsiyalar va chiziq ortiga yugurishlar", 'Ротации и забегания за линию'], TOUCH]),
  r('ip-21', IP, 'rondo', 10, '6', ["Qanotda rondo 2×2+2", 'Рондо на фланге 2×2+2'],
    ["15×10 m. Qanot hujumchisi va chetki himoyachi (1 marta tegish) doim harakatda bo'lib to'pni ushlaydi. 2 neytral markaziy himoyachi (2 marta tegish) imkon bo'lsa himoyani yoruvchi vertikal pas beradi. Qoralar to'pni olsa, rollar almashadi.",
     '15×10 м. Вингер и крайний защитник (1 касание) держат мяч, постоянно двигаясь. 2 нейтральных центральных защитника (2 касания) при возможности отдают вертикальный пас, разрезающий оборону. После отбора чёрные меняются ролями.'],
    CONES, [["Doim harakatda: to'xtagan o'yinchi — pas varianti emas", 'Всегда в движении: стоящий — не вариант для паса'], ["Markaziy himoyachi vertikal pasni qidiradi", 'Центральный ищет вертикальный пас'], ["Olmos shaklini quring", 'Стройте ромб'], ["Bir teginishda aniq pas", 'Точный пас в одно касание']]),
  r('ip-33', IP, 'shoot', 15, '14', ["Markazdan yakunlash (4+2 × 4+2)", 'Завершение через центр (4+2 × 4+2)'],
    ["Har jamoada darvozabon, maydonda 4 o'yinchi va raqib darvozasi ortida 2 o'yinchi. Gol faqat darvoza ortidagi o'yinchidan pas olgandan keyin hisoblanadi (u bir marta tegadi). Bu vertikal variantlarni qidirish va doim harakatlanishga majbur qiladi.",
     'В каждой команде вратарь, 4 игрока в поле и 2 за воротами соперника. Гол засчитывается только после паса от игрока за воротами (он играет в одно касание). Это заставляет искать вертикальные варианты и постоянно двигаться.'],
    ["2 ta darvoza, konuslar, nimchalar, to'plar", '2 ворот, конусы, манишки, мячи'],
    [["Darvoza ortidagi o'yinchiga ochiq bo'ling", 'Будьте открыты для паса от игрока за воротами'], ["Yakunlash texnikasi: birinchi teginishda zarba", 'Техника завершения: удар с первого касания'], ["Qaytgan to'pga yugurish (yordam)", 'Добивание: поддержка удара'], TOUCH]),
  r('ip-38', IP, 'smallgame', 15, '12', ["Kvadratdan yorib chiqish (5×5+2 darvozabon)", 'Выход из квадрата (5×5+2 вратаря)'],
    ["20×20 m kvadratda to'pga ega jamoa 5 ta pas qilgach, kvadratdan chiqib istalgan darvozaga hujum qiladi (5 soniya). Himoyachilar tez qaytadi. To'pni olgan jamoa darhol yorib chiqadi, yo'qotgan jamoa kontrpressing qiladi. Gol yoki aut — o'yin yana kvadratda.",
     'В квадрате 20×20 м владеющая команда после 5 передач выходит из него и атакует любые ворота (5 секунд). Защитники быстро возвращаются. Отобравшая мяч команда сразу выходит из квадрата, потерявшая — контрпрессингует. Гол или аут — игра снова в квадрате.'],
    ["2 ta darvoza, konuslar, nimchalar, to'plar", '2 ворот, конусы, манишки, мячи'],
    [["To'p olinganda birinchi qarash — oldinga, iloji boricha uzoqqa", 'После отбора первый взгляд — вперёд, как можно дальше'], ["To'pni bo'sh joyga, sherikning yo'liga bering", 'Отдавайте мяч в свободную зону, на ход партнёру'], ["To'p egasi avval himoyachini o'ziga tortadi, keyin pas", 'Владеющий сначала привязывает защитника, потом пас'], TRANS]),
]

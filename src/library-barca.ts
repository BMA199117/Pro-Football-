import type { Row } from './library-books'

/**
 * Barça Academy Coaching U7–U12 (SoccerTutor): practices from the warm-up, technique and rondo chapters.
 * Retold briefly in our own words; diagrams drawn as in the book in src/book/barca-a.ts and barca-b.ts (id bc-<page>).
 */
type T = [string, string]
const B = 'barcaAcad'
const CONES: T = ["Konuslar, nimchalar, to'plar", 'Конусы, манишки, мячи']
const GOALS: T = ["Darvoza, konuslar, nimchalar, to'plar", 'Ворота, конусы, манишки, мячи']
const HEAD: T = ["Boshni ko'taring: to'p kelmasdan oldin atrofga qarang", 'Поднимайте голову: осмотритесь до того, как придёт мяч']
const OPEN: T = ["Tanani ochiq tuting, to'pni uzoqdagi oyoq bilan qabul qiling", 'Держите корпус открытым, принимайте мяч дальней ногой']
const MOVE: T = ["Pas berdingizmi — darhol harakatlaning, yangi pas yo'li oching", 'Отдали пас — сразу двигайтесь, открывайте новую линию передачи']
const CLOSE: T = ["To'pni oyoqqa yaqin olib yuring, ko'p tegining", 'Ведите мяч близко к ноге, касайтесь часто']
const SHIELD: T = ["Tana bilan to'pni to'sing: raqib va to'p orasida turing", 'Укрывайте мяч корпусом: стойте между соперником и мячом']
const ANGLE: T = ["Himoyachi ortida qolmang: pas yo'liga chiqing", 'Не прячьтесь за защитником: выходите на линию передачи']
const QUICK: T = ["Bir-ikki teginishda tez o'ynang", 'Играйте быстро, в одно-два касания']

export const BARCA: Row[] = [
  // ---------- Warm-ups ----------
  ['bc-15', 'tact', 'warmup', 'U7–U12', 12, '10', B, ["Qo'l to'pi: ismini aytib pas 5×5", 'Гандбол: пас с именем 5×5'],
    ["Ikki jamoa 5 tadan to'pni qo'lda uzatadi. Uzatishdan oldin sherigining ismini baland aytadi. To'p bilan yurish mumkin emas; raqib uzatishni ilib olsa, to'p unga o'tadi. Ketma-ket 10 ta uzatish — 1 ochko. Keyin to'pni oyoqda o'ynashga o'tiladi.",
     'Две команды по 5 передают мяч руками. Перед передачей громко называют имя партнёра. Бегать с мячом нельзя; перехват — мяч переходит сопернику. 10 передач подряд — 1 очко. Затем переходят к игре ногами.'],
    CONES, [["Ismni aytish — muloqotning birinchi qadami", 'Назвать имя — первый шаг общения'], HEAD, MOVE, ["Bo'sh joyga chiqing, raqib ortida turmang", 'Открывайтесь в свободную зону, не стойте за соперником']]],
  ['bc-16', 'tech', 'pass', 'U7–U12', 12, '2–12', B, ["Juftlikda futbol-tennis", 'Футбольный теннис в парах'],
    ["Juftlar o'rtadagi chiziq orqali to'pni havodan oshirib bir-biriga uzatadi. To'p yerga bir marta tegishi mumkin, keyin qabul qilib, yana havodan qaytariladi. Avval qo'lda tashlab, keyin faqat oyoq, son va bosh bilan o'ynaladi.",
     'Пары перебрасывают мяч друг другу через среднюю линию верхом. Мяч может один раз коснуться земли, затем его принимают и снова возвращают верхом. Сначала подбрасывают руками, затем только ногой, бедром и головой.'],
    CONES, [["To'p tushadigan joyni oldindan ko'ring va unga boring", 'Заранее читайте место падения мяча и идите к нему'], ["Qabul qiluvchi yuzani yumshoq qiling", 'Делайте принимающую поверхность мягкой'], ["Oshirma pas: oyoq tagi bilan to'p ostiga tegining", 'Передача верхом: подбивайте мяч снизу подъёмом'], ["Ikkala oyoq bilan ham o'ynang", 'Играйте обеими ногами']]],
  ['bc-21', 'tech', 'dribble', 'U7–U12', 10, '8–16', B, ["To'p bilan nimcha o'yini", 'Салки с манишками и мячом'],
    ["Har bir o'yinchida to'p, nimchasi shortisiga qistirilgan. Hamma kvadrat ichida to'p olib yuradi va raqib jamoa o'yinchilarining nimchasini tortib olishga harakat qiladi, o'zinikini esa himoya qiladi. To'pni kvadratdan chiqarib yuborgan yoki nimchasini yo'qotgan o'yinchi tashqarida 5 marta to'p o'ynatadi.",
     'У каждого мяч и манишка, заправленная в шорты. Все ведут мяч в квадрате и стараются выдернуть манишку у соперников, защищая свою. Кто потерял мяч за пределами квадрата или манишку, делает 5 набиваний снаружи.'],
    CONES, [CLOSE, HEAD, ["Raqib yaqinlashsa — yo'nalishni keskin o'zgartiring", 'Соперник рядом — резко меняйте направление'], SHIELD]],
  ['bc-22', 'tech', 'dribble', 'U7–U12', 10, '8–16', B, ["«To'pingni asra»", '«Сохрани мяч»'],
    ["Hamma to'p bilan kvadrat ichida. Har kim o'z to'pini olib yurib, boshqalarning to'pini kvadratdan tepib chiqarishga harakat qiladi. To'pi chiqib ketgan o'yinchi tashqarida 10 marta to'p o'ynatib, o'yinga qaytadi. Kim ko'proq to'pni chiqardi — g'olib.",
     'Все с мячами в квадрате. Каждый ведёт свой мяч и старается выбить из квадрата чужие. Кто потерял мяч, делает снаружи 10 набиваний и возвращается. Побеждает тот, кто выбил больше мячей.'],
    CONES, [SHIELD, ["To'pni raqibdan uzoqdagi oyoq bilan olib yuring", 'Ведите мяч дальней от соперника ногой'], HEAD, ["Hujum va himoyani tez almashtiring", 'Быстро переключайтесь между атакой и защитой']]],
  ['bc-25', 'tech', 'duel', 'U7–U12', 12, '2–16', B, ["To'p o'ynatish, so'ng 1×1 darvozachalar orqali", 'Набивание, затем 1×1 через воротца'],
    ["Juftlar bir to'p bilan navbatma-navbat to'p o'ynatadi. Murabbiy «Boshla!» deganda to'p kimda bo'lsa, u hujumchi bo'ladi va 1×1 o'ynaydi: maydondagi istalgan konus darvozachadan to'p bilan o'tsa — 1 ochko. Himoyachi to'pni olsa, rollar almashadi.",
     'Пары по очереди набивают один мяч. По команде тренера «Старт!» тот, у кого мяч, становится атакующим и играет 1×1: провёл мяч через любые конусные воротца — 1 очко. Защитник отобрал — роли меняются.'],
    CONES, [["Signalga tez javob bering", 'Быстро реагируйте на сигнал'], ["Bo'sh darvozachani ko'ring va o'shanga yuring", 'Видьте свободные воротца и атакуйте их'], ["Finta va tezlikni o'zgartirish bilan himoyachini aldab o'ting", 'Обыгрывайте финтом и сменой скорости'], SHIELD]],
  ['bc-26', 'tact', 'rondo', 'U9–U12', 12, '12', B, ["Uchta rondo 3×1, rang bo'yicha almashinuv", 'Три рондо 3×1 со сменой по цвету'],
    ["Uchta 10×10 kvadratda 3×1 rondo. Murabbiy rangni aytganda shu rangdagi o'yinchilar soat miliga teskari yo'nalishda keyingi kvadratga yugurib o'tadi; himoyachi to'pni olsa, xato qilgan o'yinchi bilan almashadi.",
     'В трёх квадратах 10×10 рондо 3×1. Тренер называет цвет — игроки этого цвета перебегают в следующий квадрат против часовой стрелки; защитник после отбора меняется с ошибившимся.'],
    CONES, [ANGLE, OPEN, ["Murabbiy chaqirig'ini eshitib, tez almashinish", 'Слышать команду тренера и быстро смещаться'], QUICK]],
  ['bc-31', 'tech', 'dribble', 'U7–U12', 10, '8–16', B, ["Murabbiy raqami bo'yicha burilishlar", 'Повороты по номеру тренера'],
    ["Hamma kvadrat ichida to'p olib yuradi. Murabbiy raqam aytadi va har bir raqam bitta burilish yoki fintaga mos keladi (masalan, 3 — oyoqning ichki, keyin tashqi tomoni bilan burilish). O'yinchilar darhol shu harakatni bajarib, tezlikni oshiradi.",
     'Все ведут мяч в квадрате. Тренер называет номер, каждому номеру соответствует поворот или финт (например, 3 — внутренней, затем внешней стороной стопы). Игроки сразу выполняют движение и ускоряются.'],
    CONES, [CLOSE, ["Burilishdan keyin keskin tezlashing", 'После поворота резко ускоряйтесь'], HEAD, ["Ikkala oyoq bilan bajaring", 'Выполняйте обеими ногами']]],
  ['bc-33', 'tech', 'dribble', 'U7–U12', 10, '6–10', B, ["To'p bilan «yulduz»", '«Звезда» с мячом'],
    ["Besh stansiya yulduz shaklida. To'p egasi qarama-qarshi stansiyaga to'p olib yugurib, to'pni u yerdagi o'yinchiga beradi va o'sha yerda qoladi (A→B→C→D→E→A). Ikkinchi to'p qo'shilsa, mashq tezlashadi.",
     'Пять станций в форме звезды. Игрок с мячом бежит с ним к противоположной станции, передаёт мяч стоящему там игроку и остаётся там (A→B→C→D→E→A). Со вторым мячом упражнение ускоряется.'],
    CONES, [["Ochiq maydonda to'pni oldinga surib, tez olib yuring", 'На свободном пространстве толкайте мяч вперёд и ведите быстро'], HEAD, ["To'pni sherigiga aniq va to'xtatib bering", 'Отдавайте мяч партнёру точно и остановленным'], ["Markazda boshqa o'yinchilar bilan to'qnashmang", 'В центре не сталкивайтесь с другими']]],
  ['bc-35', 'tech', 'dribble', 'U7–U12', 12, '6–12', B, ["Oltita burilish", 'Шесть поворотов'],
    ["O'yinchi to'p bilan markaziy konusgacha boradi, murabbiy aytgan burilishni (masalan, oyoqning tashqi tomoni bilan kesish) bajaradi va tashqi konusgacha tezlashadi. Navbatdagi o'yinchi boshlaydi.",
     'Игрок ведёт мяч к центральному конусу, выполняет поворот, названный тренером (например, срез внешней стороной стопы), и ускоряется к внешнему конусу. Стартует следующий.'],
    CONES, [["Konusga yaqinlashganda sekinlashing, burilishdan keyin tezlashing", 'У конуса замедлитесь, после поворота ускорьтесь'], CLOSE, ["Burilishda tanani pastga tushiring", 'В повороте опускайте центр тяжести'], ["Ikkala oyoq bilan bajaring", 'Выполняйте обеими ногами']]],
  ['bc-37', 'tech', 'sprint', 'U7–U12', 10, '4–12', B, ["To'p bilan quvlash", 'Догонялки с мячом'],
    ["Ko'k va oq o'yinchi qarama-qarshi burchaklardan to'p bilan bir vaqtda start oladi va darvozachalar atrofida aylanib yuguradi. Raqibni quvib yetsa — 1 ochko. To'pni oldinga surib, yuqori tezlikda olib yurish mashqi.",
     'Синий и белый игроки одновременно стартуют с мячом из противоположных углов и бегут вокруг воротец. Догнал соперника — 1 очко. Упражнение на ведение мяча на высокой скорости.'],
    CONES, [["Tezlikda to'pni uzoqroq surib, kam tegining", 'На скорости толкайте мяч дальше, касайтесь реже'], ["Burilishda to'pni yaqin oling", 'В повороте держите мяч ближе'], HEAD, ["Har safar to'liq kuch bilan", 'Каждый раз с полной отдачей']]],
  ['bc-38', 'tech', 'duel', 'U7–U12', 12, '4–12', B, ["Tezlikda 1×1 va to'pni to'sish", '1×1 на скорости и укрывание мяча'],
    ["«Boshla!» signalida hujumchi to'p bilan diagonal qarama-qarshi darvozachaga yuguradi, himoyachi quvib yetishga harakat qiladi. Yetib kelsa, hujumchi tana bilan to'pni to'sib, darvozachadan o'tishga urinadi.",
     'По сигналу «Старт!» атакующий бежит с мячом к воротцам по диагонали, защитник догоняет. Если догнал, атакующий укрывает мяч корпусом и пытается пройти через воротца.'],
    CONES, [SHIELD, ["Qo'l va yelka bilan masofani saqlang (qoidaga ko'ra)", 'Держите дистанцию рукой и плечом (по правилам)'], ["Himoyachi qaysi tomonda — to'pni boshqa oyoqqa oling", 'С какой стороны защитник — переводите мяч на другую ногу'], ["Imkoniyat bo'lsa — burilib, tezlashing", 'Есть шанс — развернитесь и ускорьтесь']]],
  ['bc-40', 'tact', 'smallgame', 'U9–U12', 15, '10', B, ["4×4+2: pasdan oldin 3–5 teginish", '4×4+2: 3–5 касаний перед пасом'],
    ["Ikki jamoa 4 tadan va 2 joker. Har bir o'yinchi pas berishdan oldin to'pga kamida 3–5 marta tegishi shart — shu bilan to'p olib yurish va to'pni asrash o'rgatiladi. Jokerlar to'pga ega jamoa bilan o'ynaydi. Gol darvozachalarga yoki chiziqqa to'p olib o'tish bilan.",
     'Две команды по 4 и 2 джокера. Перед пасом каждый обязан коснуться мяча минимум 3–5 раз — так тренируется ведение и сохранение мяча. Джокеры играют за владеющих. Гол — проводкой мяча через воротца или за линию.'],
    CONES, [CLOSE, ["Olib yurganda boshni ko'tarib, keyingi pasni ko'ring", 'Ведя мяч, поднимайте голову и видьте следующий пас'], SHIELD, ["Jokerlar keng turib, maydonni kengaytirsin", 'Джокеры стоят широко и растягивают поле']]],
  // ---------- Passing and rondos ----------
  ['bc-44', 'tech', 'pass', 'U7–U12', 12, '4–8', B, ["«Senga qaytadi»", '«Тебе обратно»'],
    ["Uchta uzatuvchi har birida to'p bilan kvadrat chetida. O'rtadagi o'yinchi qo'riqchidan ajralib chiqib (yolg'on harakat bilan), uzatuvchidan to'p oladi va bir teginishda qaytaradi, keyin keyingi uzatuvchiga ochiladi.",
     'Три подающих с мячами по сторонам квадрата. Игрок в центре уходит от опекуна (ложным движением), получает мяч от подающего и возвращает в одно касание, затем открывается под следующего.'],
    CONES, [["Avval qo'riqchidan uzoqlashing, keyin to'pga keskin chiqing", 'Сначала уйдите от опекуна, затем резко выйдите к мячу'], ["Qaytarma pas — bir teginishda, aniq va oyoq tagiga", 'Скидка — в одно касание, точно и в ноги'], HEAD, OPEN]],
  ['bc-46', 'tech', 'pass', 'U7–U12', 12, '9–12', B, ["Uch to'p bilan oltita katakda pas", 'Пас в шести клетках с тремя мячами'],
    ["Maydon oltita katakka bo'lingan, uchta to'p o'yinda. O'yinchilar uzluksiz pas beradi va pasdan keyin darhol boshqa katakka harakatlanadi. To'psiz o'yinchilar doim to'p egasiga pas yo'li ochadi.",
     'Поле разделено на шесть клеток, в игре три мяча. Игроки непрерывно пасуют и после паса сразу перемещаются в другую клетку. Игроки без мяча всегда открывают линию передачи владеющему.'],
    CONES, [MOVE, HEAD, ["To'pni harakatda, birinchi teginishda keyingi tomonga oling", 'Принимайте мяч в движении, первым касанием в сторону следующего действия'], ["Uch to'pni bir vaqtda kuzating", 'Следите за всеми тремя мячами']]],
  ['bc-48', 'tact', 'overload', 'U9–U12', 12, '6–10', B, ["2×1: o'rta zonadan o'tish", '2×1: прохождение средней зоны'],
    ["Juftlar ikkala chetki chiziqdan navbatma-navbat o'rta zonaga kiradi va u yerdagi himoyachi yonidan pas yoki olib o'tish bilan qarama-qarshi chiziqqa chiqadi. Himoyachi to'pni olsa, xato qilgan o'yinchi bilan almashadi.",
     'Пары по очереди с обеих лицевых линий входят в среднюю зону и пасом или обводкой проходят защитника к противоположной линии. Защитник отобрал — меняется с ошибившимся.'],
    CONES, [["Himoyachini o'ziga torting, keyin sherigiga pas bering", 'Притяните защитника к себе, затем отдайте партнёру'], ["Sherik kengroq turib, pas yo'lini ochsin", 'Партнёр стоит шире и открывает линию передачи'], ["Himoyachi pasni kessa — darhol olib o'ting", 'Защитник закрыл пас — сразу обыгрывайте сами'], QUICK]],
  ['bc-49', 'tact', 'duel', 'U9–U12', 15, '8–12', B, ["«Oxirgi qolgan»: 2×1, 1×1 va darvozabon", '«Последний оставшийся»: 2×1, 1×1 и вратарь'],
    ["Birinchi zonada 2×1 o'ynaladi, keyin sariq zonada 1×1, so'ng 1×1 darvozabonga qarshi zarba. Har bir zonada bitta himoyachi o'z zonasida qoladi. Maydon ikki yarimga bo'lingan, ikki guruh bir vaqtda o'ynaydi.",
     'В первой зоне играют 2×1, затем в жёлтой зоне 1×1, затем 1×1 с вратарём и удар. В каждой зоне свой защитник, который не выходит из зоны. Поле разделено на две половины, две группы играют одновременно.'],
    GOALS, [["Son ustunligidan foydalanib himoyachini o'ziga torting", 'Используйте численное преимущество, притяните защитника'], ["1×1 da tezlik va yo'nalishni o'zgartiring", 'В 1×1 меняйте скорость и направление'], ["Darvozabonga qarshi: past va burchakka zarba", 'Против вратаря: удар низом в угол'], ["Har bir zonadan tez o'ting", 'Проходите каждую зону быстро']]],
  ['bc-52', 'tact', 'overload', 'U11–U12', 15, '9–11', B, ["5×3, keyin 2×1 va darvozabonga zarba", '5×3, затем 2×1 и удар по воротам'],
    ["Katta zonada 5×3: ketma-ket 5 ta pas. Shundan so'ng to'pga oxirgi tekkan ikki o'yinchi oldinga yugurib, konus darvozacha orqali 2×1 o'ynaydi va darvozabonga qarshi 1×1 da zarba beradi.",
     'В большой зоне 5×3: 5 передач подряд. После этого двое последних коснувшихся мяча убегают вперёд, играют 2×1 через конусные ворота и бьют 1×1 с вратарём.'],
    GOALS, [["Rondoda keng turing, son ustunligidan foydalaning", 'В рондо стойте широко, используйте большинство'], ["To'pni ushlashdan hujumga tez o'tish", 'Быстрый переход от удержания мяча к атаке'], ["2×1 da himoyachini o'ziga tortib, pas bering", 'В 2×1 притяните защитника и отдайте пас'], ["Yakunlash: birinchi imkoniyatda zarba", 'Завершение: бить при первой возможности']]],
  ['bc-56', 'tact', 'rondo', 'U9–U12', 10, '4', B, ["Rondo 3×1: orqadagi oyoq bilan qabul", 'Рондо 3×1: приём дальней ногой'],
    ["Kvadratda 3×1. To'psiz o'yinchilar himoyachi ortidan chiqib pas yo'liga turadi va to'pni orqadagi (uzoqdagi) oyoq bilan qabul qilib, keyingi pasga tayyorlanadi. Himoyachi to'pni olsa, xato qilgan o'yinchi bilan almashadi.",
     'В квадрате 3×1. Игроки без мяча выходят из-за защитника на линию передачи и принимают мяч дальней (задней) ногой, готовя следующий пас. Защитник отобрал — меняется с ошибившимся.'],
    CONES, [ANGLE, OPEN, ["Qabuldan keyin to'p keyingi pasga tayyor bo'lsin", 'После приёма мяч готов к следующему пасу'], QUICK]],
  ['bc-59', 'tact', 'rondo', 'U9–U12', 12, '6', B, ["«Bo'shliqni top» 4×2 juftlikda", '«Найди щель» 4×2 в парах'],
    ["Kvadratda 4×2: uch juftdan biri himoyada. Ikki himoyachi orasidan o'tgan chiziqni yoruvchi pas — 1 ochko. To'pni yo'qotgan juftlik himoyaga o'tadi.",
     'В квадрате 4×2: одна из трёх пар в защите. Разрезающая передача между двумя защитниками — 1 очко. Пара, потерявшая мяч, идёт в защиту.'],
    CONES, [["Himoyachilar orasidagi bo'shliqni ko'ring", 'Видьте щель между защитниками'], ["To'pni yon tomonga surib, himoyachilarni ajrating", 'Смещая мяч в сторону, растаскивайте защитников'], ANGLE, ["Juftlik bo'lib birga himoyalaning", 'Защищайтесь парой, вместе']]],
  ['bc-62', 'tact', 'rondo', 'U9–U12', 12, '11', B, ["Qo'sh rondo 5×0 va 5×1", 'Двойное рондо 5×0 и 5×1'],
    ["Ikki kvadrat: birida 5×0 to'pni ushlash, ikkinchisida 5×1. To'pni yo'qotgan o'yinchi nimchani olib, himoyachisiz kvadratga borib himoya qiladi, eski himoyachi esa o'sha kvadratda hujumchiga aylanadi.",
     'Два квадрата: в одном удержание 5×0, в другом 5×1. Игрок, потерявший мяч, берёт манишку и идёт защищаться в квадрат без защитника, а прежний защитник становится атакующим.'],
    CONES, [QUICK, OPEN, ["Xatodan keyin tez himoyaga o'tish", 'После ошибки быстро переходите в защиту'], HEAD]],
  ['bc-67', 'tact', 'rondo', 'U11–U12', 15, '10', B, ["«Bostirib kirish» rondosi 8×2", 'Рондо «вторжение» 8×2'],
    ["8 o'yinchi maydon chetida, 2 himoyachi ichkarida. Tashqarida 10 ta pas — 1 ochko, to'pni markaziy kvadratga olib kirsa yoki u yerdagi sherikka pas bersa — ham 1 ochko. Himoyachilar 1 daqiqadan keyin almashadi.",
     '8 игроков по периметру, 2 защитника внутри. 10 передач по кругу — 1 очко, вход с мячом в центральный квадрат или пас партнёру туда — тоже 1 очко. Защитники меняются через 1 минуту.'],
    CONES, [["Himoyachilar chetga tortilganda — markazga bostirib kiring", 'Защитники смещены — врывайтесь в центр'], HEAD, ["To'pni tez aylantirib, himoyachilarni charchating", 'Быстро гоняйте мяч, утомляйте защитников'], ["Markazga kirish uchun to'g'ri vaqtni tanlang", 'Выбирайте момент для входа в центр']]],
  ['bc-69', 'tact', 'rondo', 'U11–U12', 15, '9', B, ["«Ichkariga-tashqariga» rondosi 3+3×3", 'Рондо «внутрь-наружу» 3+3×3'],
    ["3 sariq tashqarida, 3 ko'k ichkarida, 3 oq himoyada. Markaziy kvadratga pas berish yoki to'p olib kirish — 1 ochko. Himoyachilar to'pni olsa, chetki zonalardan biriga pas berib yoki olib kirib ochko oladi. Belgilangan vaqtdan keyin himoyachi jamoa almashadi.",
     '3 жёлтых снаружи, 3 синих внутри, 3 белых в защите. Пас или вход с мячом в центральный квадрат — 1 очко. Защитники после отбора получают очко пасом или проходом в одну из крайних зон. Через заданное время защищающаяся команда меняется.'],
    CONES, [["Markazda bo'sh joy yarating: tashqariga torting, ichkariga o'ynang", 'Создавайте пространство в центре: растягивайте наружу, играйте внутрь'], ANGLE, ["To'p yo'qotilsa — darhol bosim, zonalarga yo'l bermang", 'Потеря — сразу прессинг, не пускайте в зоны'], OPEN]],
]

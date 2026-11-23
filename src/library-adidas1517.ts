import type { Row } from './library-books'

/**
 * adidas / RFS / DFB "Programme for players aged 15–17" – group-tactics game exercises,
 * retold briefly in our own words. Diagrams: src/book/adidas1517.ts. Shirt numbers follow the book.
 */
type T = [string, string]
const S = 'adidas1517'
const REST: T = ["Dam — to'liq tiklanguncha (3 daqiqagacha); mashqni to'xtatish belgisi: tezlik pasayadi, texnik xatolar ko'payadi", 'Отдых до восстановления, до 3 минут; сигнал остановки — падает скорость, растёт число технических ошибок']
const COUNTER: T = ["Himoyachilar to'pni olsa — darhol tez hujum", 'Обороняющиеся после отбора — сразу быстрая атака']
const THREE: T = ["Bitta zonada 3 tadan ortiq pas berilmaydi", 'Не больше трёх передач в одной зоне']
const r = (id: string, age: string, dia: Row[2], min: number, players: string, name: T, desc: T, equip: T, points: T[]): Row =>
  [id, 'tact', dia, age, min, players, S, name, desc, equip, points]

export const ADIDAS_1517: Row[] = [
  // ---------- 15 years ----------
  r('a17-1', 'U15', 'overload', 20, '13–17', ['4 + darvozabon × 3: markazdan hujum boshlash (1-zona)', '4 + вратарь × 3: начало атаки по центру (зона 1)'],
    ["Maydon 35–40 × 40 m, himoya qiluvchi jamoaning chet chizig'i oldida 2 m lik zona. Hujum qiluvchi jamoa: darvozabon (1), markaziy himoyachilar (3, 4), tayanch yarim himoyachilar (6, 8). Himoya qiluvchi jamoa: 8, 10 va hujumchi 9. Har hujum darvozabondan boshlanadi; maqsad — to'pni o'sha zonaga olib kirish. Himoya qiluvchilar to'pni olsa, tez hujum bilan darvozaga uradi. Har hujumdan keyin himoyadagi uchlik almashadi.",
     'Поле 35–40 × 40 м, на лицевой линии обороняющихся зона 2 м. Атакующие: вратарь (1), центральные защитники (3, 4), опорные (6, 8). Обороняющиеся: 8, 10 и нападающий 9. Каждая атака — от вратаря; цель — завести мяч в зону. Обороняющиеся после отбора быстрой атакой бьют по воротам. После каждой атаки меняется тройка.'],
    ['Darvoza, konuslar, nimchalar, to\'plar', 'Ворота, конусы, манишки, мячи'],
    [['Markaziy himoyachilar keng ochiladi, tayanchlar chiziqlar orasida', 'Центральные защитники раскрываются широко, опорные — между линиями'], ['To\'pni bosimsiz o\'yinchiga uzating', 'Передавайте мяч игроку без давления'], COUNTER, REST]),
  r('a17-2', 'U15', 'overload', 20, '14', ['4 + darvozabon × 3: qanotdan hujum boshlash (1-zona)', '4 + вратарь × 3: начало атаки по флангу (зона 1)'],
    ["Maydon uzunligi 35–40 m, himoya qiluvchi jamoaning chet chizig'ida, ikki qanotda 12–15 m lik zonalar. Hujum qiluvchi jamoa (1-4): darvozabon, markaziy himoyachilar (3, 4) va chetki himoyachilar (2, 5). Himoya qiluvchi jamoa: qanot yarim himoyachilari (7, 11) va hujumchi 9. Maqsad — to'pni qanot zonalaridan biriga olib kirish.",
     'Длина поля 35–40 м, на флангах лицевой линии обороняющихся две зоны по 12–15 м. Атакующие 1-4: вратарь, центральные (3, 4) и крайние защитники (2, 5). Обороняющиеся: фланговые полузащитники (7, 11) и нападающий 9. Цель — завести мяч в одну из фланговых зон.'],
    ['Darvoza, konuslar, nimchalar, to\'plar', 'Ворота, конусы, манишки, мячи'],
    [['Chetki himoyachi baland va keng turadi', 'Крайний защитник стоит высоко и широко'], ['Bosim bir tomonda bo\'lsa — o\'yinni boshqa qanotga', 'Давление с одной стороны — переводите на другой фланг'], COUNTER, REST]),
  r('a17-3', 'U15', 'smallgame', 20, '11–14', ["6 + darvozabon × 4: hujum yo'nalishini o'zgartirish", '6 + вратарь × 4: смена направления атак'],
    ["Maydon uzunligi 40–45 m, uchta bo'ylama yo'lak (20–22 m dan), chet chizig'ida 2 m lik zona. Hujum qiluvchi jamoa (1-4-2): darvozabon, 2, 3, 4, 5 va tayanch yarim himoyachilar 6, 8. Himoya qiluvchi jamoa (3-1): 10, 7, 11 va 9. Hujum darvozabondan, bosqichma-bosqich quriladi; bitta yo'lakda 3 tadan ortiq pas berib bo'lmaydi — o'yinni yo'lakdan yo'lakka o'tkazish majburiy.",
     'Длина поля 40–45 м, три продольных коридора по 20–22 м, на лицевой зона 2 м. Атакующие 1-4-2: вратарь, 2, 3, 4, 5, опорные 6 и 8. Обороняющиеся 3-1: 10, 7, 11 и 9. Атака от вратаря, постепенная; в одном коридоре не больше трёх передач — переводить игру из коридора в коридор обязательно.'],
    ['Darvoza, konuslar, nimchalar, to\'plar', 'Ворота, конусы, манишки, мячи'],
    [THREE, ['Tayanch yarim himoyachi — o\'yinni o\'tkazish nuqtasi', 'Опорный полузащитник — точка перевода игры'], ['Uzoq qanotdagi o\'yinchi keng turib kutadi', 'Игрок дальнего фланга ждёт широко'], REST]),
  r('a17-4', 'U15', 'rondo', 15, '9–12', ['6 × 3 (+3 × 3 × 3): chiziqni yoruvchi paslar', '6 × 3 (+3 × 3 × 3): проникающие передачи'],
    ["Maydon 25–30 × 25–30 m. Chet chiziqlarda ikki uchlik, o'rtada uchta himoyachi bir chiziqda turadi. Uchliklar o'rtadagi himoya chizig'i orqali bir-biriga yoruvchi pas beradi. Himoyachilar bosim beradi; to'pni olsa, hujumchilar chizig'i ortidagi 3 ta kichik darvozadan biriga uradi, hujumchilar esa darhol himoyaga o'tadi. Har o'yindan keyin himoyadagi uchlik almashadi.",
     'Поле 25–30 × 25–30 м. На лицевых — две тройки, в центре трое обороняющихся в линию. Тройки проникающими передачами играют друг на друга через центр. Обороняющиеся прессингуют и после перехвата атакуют одни из 3 малых ворот за линией атакующих; атакующие сразу переходят в оборону. После каждой игры меняется тройка в центре.'],
    ['6 kichik darvoza, konuslar, nimchalar, to\'plar', '6 малых ворот, конусы, манишки, мячи'],
    [['Chiziq bo\'ylab tez pas — bo\'shliq ochilguncha', 'Быстрый пас вдоль линии — пока не откроется щель'], ['Himoyachilar birga harakatlanadi, oraliqlar qisqa', 'Обороняющиеся смещаются вместе, интервалы короткие'], ['To\'p yo\'qotilganda darhol bosim', 'При потере — сразу прессинг']]),
  r('a17-5', 'U15', 'overload', 20, '11', ['5 × 4 + 2 darvozabon: markazdan hujum (2-zona)', '5 × 4 + 2 вратаря: атака по центру (зона 2)'],
    ["Maydon 35–40 × 35–40 m, ikkala tomonda darvozabonli darvoza. Hujum qiluvchi jamoa (1-2-2-1): darvozabon, 3, 4, tayanch yarim himoyachilar 6, 8 va hujumkor yarim himoyachi 10. Himoya qiluvchi jamoa: darvozabon, 6, 8, 10 va 9. Hujum qiluvchilar raqib chet chizig'ini to'p bilan kesib o'tib, darvozabon bilan yakkama-yakka chiqadi. Himoya qiluvchilar bosim beradi va to'pni olsa, xuddi shunday tez hujum qiladi. Seriyadan keyin jamoalar o'rin almashadi.",
     'Поле 35–40 × 35–40 м, с обеих сторон ворота с вратарями. Атакующие 1-2-2-1: вратарь, 3, 4, опорные 6, 8 и атакующий полузащитник 10. Обороняющиеся: вратарь, 6, 8, 10 и 9. Атакующие пересекают с мячом лицевую линию соперника и выходят один на один с вратарём. Обороняющиеся прессингуют и после отбора так же проводят быструю атаку. После серии команды меняются.'],
    ['2 darvoza, konuslar, nimchalar, to\'plar', '2 ворот, конусы, манишки, мячи'],
    [['10-raqam himoya chiziqlari orasida ochiladi', 'Десятка открывается между линиями обороны'], ['Chiziqni kesgach — darvozabon bilan yakkama-yakkani yakunlang', 'Пересёк линию — завершай выход один на один'], REST]),
  r('a17-6', 'U15', 'overload', 15, '12–17', ['3 × 2 + darvozabon: markazdan yakunlash (3-zona)', '3 × 2 + вратарь: завершение атак по центру (зона 3)'],
    ["Maydon 30–35 × 25–30 m. Hujum qiluvchi uchlik (2-1) o'z chizig'idan boshlab darvozaga hujum qiladi. Himoyachi juftlik darvozabon bilan birga qarshi turadi; to'pni olsa, hujumchilar chizig'idagi ikki kichik darvozadan biriga uradi. Himoyachi juftliklar har hujumdan, uchliklar ikki hujumdan keyin almashadi.",
     'Поле 30–35 × 25–30 м. Атакующие (2-1) начинают от своей лицевой линии и атакуют ворота. Пара обороняющихся (1-2) прессингует; после отбора бьёт в одни из двух малых ворот на линии атакующих. Пары меняются после каждой атаки, тройки — после двух.'],
    ['Darvoza, 2 kichik darvoza, to\'plar', 'Ворота, 2 малых ворот, мячи'],
    [['Son ustunligini tez ishlating — himoyachi qaytib ulgurmasin', 'Используйте большинство быстро, пока защита не вернулась'], ['Zarba ikki teginishdan oshmasin', 'Удар не позже второго касания'], COUNTER]),
  r('a17-7', 'U15', 'shoot', 15, '11–14', ['4 × 2 + darvozabon: qanotdan uzatmadan gol', '4 × 2 + вратарь: гол после передачи с фланга'],
    ["Maydon 30–35 × 50–55 m, hujumchilar chizig'ida 3 ta kichik darvoza. Hujum qiluvchi to'rtlik 1-2-1: orqada bitta, qanotlarda ikkita, oldinda bitta. Gol faqat qanotdan uzatmadan keyin hisoblanadi. Himoyachi juftlik to'pni olsa, kichik darvozalardan biriga uradi.",
     'Поле 30–35 × 50–55 м, на линии атакующих 3 малых ворот. Атакующие 1-2-1: один сзади, двое на флангах, один впереди. Гол засчитывается только после передачи с фланга. Пара обороняющихся после отбора бьёт в одни из малых ворот.'],
    ['Darvoza, 3 kichik darvoza, to\'plar', 'Ворота, 3 малых ворот, мячи'],
    [['Qanotchi chet chiziqqacha olib boradi', 'Фланговый доводит мяч до лицевой'], ['Jarima maydoniga ikki kishi: yaqin va uzoq ustun', 'В штрафную двое: ближняя и дальняя штанга'], COUNTER]),
  r('a17-8', 'U15', 'duel', 15, '7–10', ['1 + darvozabon × 2: ozchilikda tez hujumga qarshi', '1 + вратарь × 2: оборона в меньшинстве против быстрой атаки'],
    ["Maydon 30–35 × 25–30 m. Ikki hujumchi o'z chizig'idan bir qatorda boshlab tez hujum qiladi; himoyachi darvozabon bilan birga qarshi turadi. Himoyachi to'pni olsa, hujumchilar chizig'idagi ikki kichik darvozadan biriga uradi. Himoyachi har hujumdan, juftlik ikki hujumdan keyin almashadi.",
     'Поле 30–35 × 25–30 м. Двое атакующих стартуют в линию от своей лицевой и проводят быструю атаку; защитник вместе с вратарём противодействует. Защитник после отбора бьёт в одни из двух малых ворот на линии атакующих. Защитник меняется после каждой атаки, пара — после двух.'],
    ['Darvoza, 2 kichik darvoza, to\'plar', 'Ворота, 2 малых ворот, мячи'],
    [['Himoyachi: chekinib vaqt yuting, pas yo\'lini yoping', 'Защитник: отступайте, выигрывайте время, закрывайте пас'], ['Darvozabon bilan gaplashing: kim to\'pli o\'yinchiga', 'Говорите с вратарём: кто идёт на игрока с мячом'], ['Hujumchilar: himoyachini o\'zingizga torting, so\'ng pas', 'Атакующие: притяните защитника, затем пас']]),
  // ---------- 16–17 years ----------
  r('a17-9', 'U16–U17', 'rondo', 15, '12–16', ['8 × 4 (4 × 4 × 4): chiziqni yoruvchi paslar', '8 × 4 (4 × 4 × 4): проникающие передачи'],
    ["Maydon 25–30 × 35–40 m. Chet chiziqlarda ikki to'rtlik, o'rtada to'rtta himoyachi bir chiziqda turadi. To'rtliklar o'rtadagi himoya chizig'i orqali bir-biriga yoruvchi pas beradi; to'p yo'qotilsa, darhol bosim beradi. Himoyachilar to'pni olsa, chiziqlar ortidagi 3 ta kichik darvozadan biriga uradi. Har o'yindan keyin o'rtadagi to'rtlik almashadi.",
     'Поле 25–30 × 35–40 м. На лицевых — две четвёрки, в центре четверо обороняющихся в линию. Четвёрки проникающими передачами играют друг на друга, при потере — сразу прессинг. Обороняющиеся после перехвата атакуют одни из 3 малых ворот за линиями. После каждой игры меняется четвёрка в центре.'],
    ['6 kichik darvoza, konuslar, nimchalar, to\'plar', '6 малых ворот, конусы, манишки, мячи'],
    [['Pasdan oldin himoyachini joyidan qo\'zg\'ating', 'Сместите обороняющихся перед передачей'], ['Himoya chizig\'i: zich va bir vaqtda', 'Линия обороны: плотно и синхронно'], REST]),
  r('a17-10', 'U16–U17', 'shoot', 20, '13–16', ['7 × 5 + darvozabon: qanotdan uzatmadan gol', '7 × 5 + вратарь: гол после передачи с фланга'],
    ["Maydon uzunligi 35–40 m, hujumchilar chizig'ida 3 ta kichik darvoza. Hujum qiluvchilar 2-2-3, himoya qiluvchilar darvozabon bilan 1-4-1 sxemasida. Hujum o'z chizig'idan boshlanadi; gol faqat qanotdan uzatmadan keyin hisoblanadi. Himoya qiluvchilar bosim beradi va to'pni olsa, kichik darvozalardan biriga tez hujum qiladi.",
     'Длина поля 35–40 м, на линии атакующих 3 малых ворот. Атакующие 2-2-3, обороняющиеся с вратарём 1-4-1. Атака начинается от своей лицевой; гол — только после передачи с фланга. Обороняющиеся прессингуют и после отбора проводят быструю атаку в одни из малых ворот.'],
    ['Darvoza, 3 kichik darvoza, nimchalar, to\'plar', 'Ворота, 3 малых ворот, манишки, мячи'],
    [['Uzatmaga uch kishi: yaqin ustun, uzoq ustun, penalti nuqtasi', 'На передачу трое: ближняя, дальняя штанга, точка пенальти'], ["Yarim himoyachi jarima maydoni chetida qaytgan to'pni kutadi", 'Полузащитник ждёт отскок'], COUNTER]),
  r('a17-11', 'U16–U17', 'smallgame', 20, '15–18', ['7 + darvozabon × 7: qanotdan hujum', '7 + вратарь × 7: атака по флангу'],
    ["Maydon uzunligi 40–45 m, hujumchilar chizig'ida 3 ta kichik darvoza. Hujum qiluvchilar 1-2-3-1, himoya qiluvchilar darvozabon bilan 1-4-3 sxemasida. Har hujum o'z chizig'idan boshlanadi; maqsad — qanotdan hujum qilib gol urish. Himoya qiluvchilar bosim beradi va to'pni olsa, kichik darvozalardan biriga tez hujum qiladi. O'yinchilar almashinuvini murabbiy belgilaydi.",
     'Длина поля 40–45 м, на линии атакующих 3 малых ворот. Атакующие 1-2-3-1, обороняющиеся с вратарём 1-4-3. Каждая атака — от своей лицевой; цель — гол после атаки по флангу. Обороняющиеся прессингуют и после отбора быстро атакуют одни из малых ворот. Порядок замен определяет тренер.'],
    ['Darvoza, 3 kichik darvoza, nimchalar, to\'plar', 'Ворота, 3 малых ворот, манишки, мячи'],
    [['Qanotda ikki kishi: biri ichkariga, ikkinchisi aylanib o\'tadi', 'На фланге двое: один внутрь, второй в забегание'], ['Uzatmadan oldin jarima maydonini to\'ldiring', 'До передачи заполните штрафную'], ['O\'yin 60 soniyagacha yoki gol bo\'lguncha', 'Игра до 60 секунд или до гола']]),
]

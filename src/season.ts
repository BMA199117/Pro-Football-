import type { Text } from './types'

/**
 * Season plans (year → months → weeks), taken only from the programmes in the uploaded books.
 *
 *  - adidas / RFS / DFB 10–14: block periodization. A block = 1 main task + 2 extra tasks,
 *    8–14 sessions; a year = 6–8 blocks; every block at least once a year, in any order;
 *    a block may be repeated, but not more than twice and not back to back. Book example
 *    (10–11 years): «1 сентября — 3 октября. Блок 1», sessions Mon/Wed/Fri, Saturday mini-tournaments.
 *  - adidas / RFS / DFB 15–17: 6 blocks (attack zones 1–3, defence zones 1–3, each with its
 *    transition). A block = 12 sessions or more; book example: one block = 3 weekly microcycles
 *    with at least 3 (best 4) themed sessions, 1 physical session, 1 game, at least 1 rest day.
 *  - «NOI» 12–17 (Moldova FA): year plans U11, U13, U15, U17: August → June by microcycles,
 *    a winter break after December and the July holidays; hours by month; 8-week cycle no. 1.
 *  - EPYSA U6–U12: the book's week-by-week season plans (already in Tayyor rejalar).
 *  - RFS 6–9: one stage per year of age (Ball, + Goal, + Opponent, + Partner).
 *  - FIFA «План тренировки»: the periods of the year (preparation, competition, transition).
 *
 * Kept as plain data with string ids, so the admin panel can show and edit it like other content.
 */

export type UnitKind = 'prep' | 'comp' | 'trans' | 'block' | 'week' | 'break'

export interface SeasonUnit {
  id: string
  kind: UnitKind
  title: Text
  /** what the week or block works on (technique / tactics), as in the book */
  focus?: Text
  /** default length in weeks */
  weeks: number
  /** ready plans (Tayyor rejalar) that are this exact week of the book */
  tpl?: string[]
}

/** NOI year plan: one month column (hours). */
export interface SeasonMonth {
  /** month index, 0 = January */
  m: number
  /** microcycles (weeks of the season) */
  mc: string
  tech: number
  tact: number
  spec: number
  theory: number
  total: number
}

export interface SeasonProgram {
  id: string
  source: string
  /** shown in the age picker */
  ages: string
  title: Text
  summary: Text
  /** sessions a week (from the book), if the book gives it */
  perWeek?: string
  minutes?: string
  /** month the book's year starts in (0 = January) */
  startMonth: number
  units: SeasonUnit[]
  /** block length the coach can choose (weeks), if the book allows a range */
  blockWeeks?: number[]
  /** the book allows going through the blocks a second time */
  canRepeat?: boolean
  months?: SeasonMonth[]
  /** totals for the year (hours), NOI */
  year?: { label: Text; v: number }[]
  /** the book's rules, shown under the plan */
  rules: Text[]
}

const T = (uz: string, ru: string): Text => ({ uz, ru })
const blocks = (pfx: string, weeks: number, list: [string, string][]): SeasonUnit[] =>
  list.map(([uz, ru], i) => ({ id: `${pfx}-b${i + 1}`, kind: 'block', weeks, title: T(`${i + 1}-blok. ${uz}`, `Блок ${i + 1}. ${ru}`) }))

/* ---------- adidas 10–14 ---------- */
const A14_RULES = [
  T("Blok — bitta asosiy vazifa va ikkita qo'shimcha vazifa, 8 dan 14 tagacha mashg'ulot.", 'Блок — 1 главная задача + 2 дополнительные, от 8 до 14 тренировок.'),
  T("Yil — 6–8 blok. Har bir blok yil davomida kamida bir marta o'tiladi, bloklar istalgan tartibda keladi.", 'Год — 6–8 блоков. Каждый блок отрабатывается не менее 1 раза за год, блоки идут друг за другом в произвольном порядке.'),
  T("Barcha bloklar yil tugashidan oldin o'tilsa, takrorlash mumkin, lekin ko'pi bilan ikki marta va ketma-ket emas.", 'Если все блоки пройдены до окончания года, возможны повторения (но не более двух раз и не подряд).'),
  T("Kitobdagi misol (10–11 yosh): 1-sentabr — 3-oktabr — 1-blok; dushanba, chorshanba, juma mashg'ulot, shanba — mini-turnir (4×4, 8×8), yakshanba — dam.", 'Пример из книги (10–11 лет): 1 сентября — 3 октября — Блок 1; тренировки пн, ср, пт, в субботу мини-турниры (4×4, 8×8), воскресенье — отдых.'),
]
const A14_WEEKS = [3, 4, 5]

/* ---------- adidas 15–17 ---------- */
const A17_LIST: [string, string][] = [
  ["Hujum — 1-zona: hujumni boshlash va rivojlantirish + o'tish hujum→himoya", 'Атака — зона 1: начало и развитие атак + переход атака→оборона'],
  ["Hujum — 2-zona: hujumni boshlash va rivojlantirish + o'tish hujum→himoya", 'Атака — зона 2: начало и развитие атак + переход атака→оборона'],
  ["Hujum — 3-zona: boshlash, rivojlantirish va yakunlash + o'tish hujum→himoya", 'Атака — зона 3: начало, развитие и завершение атак + переход атака→оборона'],
  ["Himoya — 1-zona: hujumni boshlash, rivojlantirish va yakunlashga qarshi + o'tish himoya→hujum", 'Оборона — зона 1: противодействие началу, развитию и завершению атак + переход оборона→атака'],
  ["Himoya — 2-zona: hujumni boshlash va rivojlantirishga qarshi + o'tish himoya→hujum", 'Оборона — зона 2: противодействие началу и развитию атак + переход оборона→атака'],
  ["Himoya — 3-zona: hujumni boshlash va rivojlantirishga qarshi + o'tish himoya→hujum", 'Оборона — зона 3: противодействие началу и развитию атак + переход оборона→атака'],
]
const A17_RULES = [
  T("Blok — bitta asosiy vazifa, uchta qo'shimcha vazifa, 7 ta mashq namunasi va 12 va undan ko'p mashg'ulot.", 'Блок — 1 главная задача + 3 дополнительные, 7 примеров упражнений, 12 тренировок и более.'),
  T("Kitobdagi misol: bitta blok — uchta haftalik mikrosikl.", 'Пример из книги: один блок — три недельных микроцикла.'),
  T("Haftada: mavzuli mashg'ulot kamida 3 ta (eng yaxshisi 4 ta), jismoniy tayyorgarlik 1 ta, o'yin 1 ta, dam olish kuni kamida 1 ta.", 'В микроцикле: тематических тренировок не менее 3 (оптимально 4), 1 тренировка по физподготовке, 1 игра, не менее 1 дня отдыха.'),
  T("Jismoniy tayyorgarlik mashg'uloti o'yindan kamida 72 soat oldin va o'yindan kamida 72 soat keyin.", 'Тренировка по физподготовке — не позднее чем за 72 часа до игры и не раньше чем через 72 часа после игры.'),
  T("Mashg'ulotning asosiy qismida 4 tadan ko'p mashq bo'lmaydi.", 'Основная часть тренировочного занятия — не более 4 упражнений.'),
]

/* ---------- NOI 12–17 ---------- */
const MC = ['1–4', '5–8', '9–12', '13–17', '18–20', '21–23', '24–27', '28–32', '33–36', '37–41', '42–45']
/** August … June (July = holidays) */
const MONTHS = [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5]
const months = (tech: number[], tact: number[], spec: number[], theory: number[], total: number[]): SeasonMonth[] =>
  MONTHS.map((m, i) => ({ m, mc: MC[i], tech: tech[i], tact: tact[i], spec: spec[i], theory: theory[i], total: total[i] }))
const year = (tech: number, tact: number, gen: number, spec: number, theory: number, psy: number, test: number, total: number, games: number) => [
  { label: T('Texnika', 'Техника'), v: tech }, { label: T('Taktika', 'Тактика'), v: tact },
  { label: T('Umumiy jismoniy', 'Общий фитнес'), v: gen }, { label: T('Maxsus jismoniy', 'Спец. фитнес'), v: spec },
  { label: T('Nazariya', 'Теория'), v: theory }, { label: T('Psixologiya', 'Психология'), v: psy },
  { label: T('Testlar', 'Тестирование'), v: test }, { label: T('Jami soat', 'Всего часов'), v: total },
  { label: T("O'yinlar", 'Игры'), v: games },
]
const NOI_RULES = (n: number, min: number, [a, b, c, d]: number[]) => [
  T(`Mavsum avgustdan boshlanadi: 45 mikrosikl (hafta). Dekabrdan keyin qishki ta'til, iyul — ta'til. Haftasiga ${n} ta mashg'ulot, har biri ${min} daqiqa.`, `Сезон начинается в августе: 45 микроциклов (недель). После декабря — зимние каникулы, июль — каникулы. Тренировок в неделю: ${n}, по ${min} мин.`),
  T(`Mashg'ulot tuzilishi (daqiqa): tayyorlov qismi ${a}, asosiy qism ${b}, o'quv o'yini ${c}, yakuniy qism ${d}.`, `Структура тренировки (мин): подготовительная часть ${a}, основная ${b}, учебная игра ${c}, заключительная ${d}.`),
  T("Kitobda 8 haftalik sikl №1 namuna sifatida berilgan: haftalar hujum va himoya mavzulari bilan almashadi. Keyingi sikllarni murabbiy shu tartibda tuzadi.", 'В книге дан 8-недельный цикл №1 как образец: недели чередуют темы атаки и обороны. Следующие циклы тренер строит так же.'),
]
const wk = (pfx: string, i: number, tuz: string, tru: string, fuz: string, fru: string): SeasonUnit =>
  ({ id: `${pfx}-w${i}`, kind: 'week', weeks: 1, title: T(`${i}-hafta: ${tuz}`, `Неделя ${i}: ${tru}`), focus: T(fuz, fru) })

const IND_BALL = ["Yakka harakatlar (to'p bilan)", 'Индивидуальные действия с мячом']
const IND_BOTH = ["Yakka harakatlar (to'p bilan va to'psiz)", 'Индивидуальные действия с мячом и без мяча']

const NOI_U11: SeasonUnit[] = [
  wk('n11', 1, "Olib yurish, burilishlar", 'Ведение мяча, повороты', IND_BALL[0], IND_BALL[1]),
  wk('n11', 2, "Dribling, fintlar, burilishlar", 'Дриблинг, финты, развороты', IND_BALL[0], IND_BALL[1]),
  wk('n11', 3, "Darvozaga zarba, qabul qilish va pas", 'Прямой удар по воротам, приём и передача', IND_BOTH[0], IND_BOTH[1]),
  wk('n11', 4, "Himoyada 1×1, 2×1, 2×2", 'Игра в обороне 1×1, 2×1, 2×2', "Himoyada yakka harakatlar, yakkama-yakka kurash", 'Индивидуальные действия в обороне, единоборства'),
  wk('n11', 5, "Qabul qilish (birinchi teginish) va pas", 'Приём (первое касание) и передача мяча', IND_BOTH[0], IND_BOTH[1]),
  wk('n11', 6, "Dribling, fintlar, to'pni tana bilan to'sish", 'Дриблинг, финты, укрывание мяча корпусом', IND_BALL[0], IND_BALL[1]),
  wk('n11', 7, "Pas o'yini (kombinatsiyalar), o'yin vaziyatlari", 'Игра в пас (комбинации), игровые ситуации', IND_BOTH[0], IND_BOTH[1]),
  wk('n11', 8, "Hujumni yakunlash, darvozaga zarbalar", 'Завершение атакующих действий, удары по воротам', IND_BOTH[0], IND_BOTH[1]),
]
const G_ATT = ["Yakka va guruh harakatlari (hujumda)", 'Индивидуальные / групповые действия в атаке']
const G_DEF = ["Himoyada yakka va guruh harakatlari, vasiylik turlari, yakkama-yakka kurash", 'Индивидуальные / групповые действия в обороне, виды опеки, единоборства']
const NOI_U13: SeasonUnit[] = [
  wk('n13', 1, "Dribling, fintlar, to'pni tana bilan to'sish", 'Дриблинг, финты, укрывание мяча корпусом', 'Hujumda yakka harakatlar', 'Индивидуальные действия в атаке'),
  wk('n13', 2, "Harakatda qabul qilish va pas, ochilish", 'Приём и передача мяча в движении, открывание', G_ATT[0], G_ATT[1]),
  wk('n13', 3, "Kombinatsiyalar, birinchi teginish, to'pni nazorat qilish, darvozaga zarba", 'Комбинации, первое касание, контроль мяча, удары по воротам', G_ATT[0], G_ATT[1]),
  wk('n13', 4, 'Himoya 1×1, 2×1, 2×2, 3×2', 'Оборона 1×1, 2×1, 2×2, 3×2', G_DEF[0], G_DEF[1]),
  wk('n13', 5, "Harakatda qabul qilish va pas, ochilish", 'Приём и передача мяча в движении, открывание', "Hujumda yakka va guruh harakatlari, o'z uchdan bir qismida hujum qurish", 'Индивидуальные / групповые действия в атаке, построение на своей трети поля'),
  wk('n13', 6, "Qabul qilish va pas, burilishlar, to'pni nazorat qilish, ochilish", 'Приём и передача мяча, развороты, контроль мяча, открывание', "Hujumda yakka va guruh harakatlari, maydonning o'rta qismida hujum qurish", 'Индивидуальные / групповые действия в атаке, построение в средней трети поля'),
  wk('n13', 7, 'Himoya 2×1, 2×2, 3×2, 3×3', 'Оборона 2×1, 2×2, 3×2, 3×3', G_DEF[0], G_DEF[1]),
  wk('n13', 8, "Hujumni yakunlash, dribling, fintlar, darvozaga zarba, ochilish", 'Завершение атакующих действий, дриблинг, финты, удары по воротам, открывание', "Hujumda yakka va guruh harakatlari, oxirgi uchdan bir qismda hujumni yakunlash", 'Индивидуальные / групповые действия в атаке, завершение атакующих действий в последней трети поля'),
]
const ZA = ["A zona (qizil, o'z uchdan bir qismi)", 'зона А (красная)'], ZB = ["B zona (sariq, o'rta qism)", 'зона В (жёлтая)'], ZC = ["C zona (yashil, oxirgi uchdan bir qism)", 'зона С (зелёная)']
const SP = [' Standart holatlar (hujum va himoya).', ' Стандартные положения (атака/оборона).']
const U15T = [
  ["Qabul qilish (birinchi teginish), pas, pas o'yini (kombinatsiyalar)", 'Приём (первое касание), передача мяча, игра в пас (комбинации)'],
  ["Yakkama-yakka kurash, to'pni olib qo'yish, qabul qilish, pas, pas o'yini", 'Единоборства, отбор мяча, приём, передача, игра в пас (комбинации)'],
  ["Qabul qilish, pas, pas o'yini, burilishlar, uzun paslar", 'Приём, передача мяча, игра в пас, развороты, длинные передачи'],
  ["Yakkama-yakka kurash, to'pni olib qo'yish, qabul qilish, pas, burilishlar, to'pni tana bilan to'sish, uzun paslar", 'Единоборства, отбор мяча, приём, передача, развороты, укрывание мяча корпусом, длинные передачи'],
]
const team = (g: boolean) => (g ? ['guruh va jamoa harakatlari', 'групповые и командные действия'] : ['guruh harakatlari', 'групповые действия'])
const zoneWeeks = (pfx: string, g17: boolean, tech: string[][]): SeasonUnit[] => {
  const [tu, tr] = team(g17)
  const z = [ZA, ZA, ZB, ZB, ZC, ZC]
  const out: SeasonUnit[] = z.map((zz, i) => {
    const both = i % 2 === 1
    const uz = both ? `Hujum va himoya bosqichi: ${zz[0]}da ${tu}.` : `Hujum bosqichi: ${zz[0]}da ${tu}.`
    const ru = both ? `Фаза атаки и фаза обороны: ${tr} в ${zz[1]}.` : `Фаза атаки: ${tr} в ${zz[1]}.`
    return { id: `${pfx}-w${i + 1}`, kind: 'week', weeks: 1, title: T(`${i + 1}-hafta: ${uz}${SP[0]}`, `Неделя ${i + 1}: ${ru}${SP[1]}`), focus: T(tech[i][0], tech[i][1]) }
  })
  out.push({ id: `${pfx}-w7`, kind: 'week', weeks: 1,
    title: T(`7-hafta: Himoya bosqichi: guruh va jamoa harakatlari.${g17 ? ' Pressing.' : ''}${SP[0]}`, `Неделя 7: Фаза обороны: групповые и командные действия.${g17 ? ' Прессинг.' : ''}${SP[1]}`),
    focus: T(tech[6][0], tech[6][1]) })
  out.push({ id: `${pfx}-w8`, kind: 'week', weeks: 1, title: T('8-hafta: mavzu murabbiy tanlovi bilan', 'Неделя 8: тема на усмотрение тренера') })
  return out
}
const NOI_U15 = zoneWeeks('n15', false, [...U15T,
  ["Qabul qilish, pas, burilishlar, to'pni tana bilan to'sish, to'pni olib qo'yish, bosh bilan o'yin, qanotdan oshirma va uzatmalar, hujumni yakunlash", 'Приём, передача, развороты, укрывание мяча корпусом, отбор мяча, игра головой, подачи, прострелы с фланга, завершение атакующих действий'],
  ["Yakkama-yakka kurash, to'pni olib qo'yish, qabul qilish, pas, burilishlar, to'pni tana bilan to'sish, bosh bilan o'yin, qanotdan oshirma va uzatmalar, hujumni yakunlash", 'Единоборства, отбор мяча, приём, передача, развороты, укрывание мяча корпусом, игра головой, подачи, прострелы с фланга, завершение атакующих действий'],
  ["Yakkama-yakka kurash, to'pni tana bilan to'sish, to'pni olib qo'yish", 'Единоборства, укрывание мяча корпусом, отбор мяча'],
])
const NOI_U17 = zoneWeeks('n17', true, [...U15T,
  ["Qabul qilish, pas, burilishlar, to'pni tana bilan to'sish, bosh bilan o'yin, qanotdan oshirma va uzatmalar, hujumni yakunlash", 'Приём, передача, развороты, укрывание мяча корпусом, игра головой, подачи, прострелы с фланга, завершение атакующих действий'],
  ["Yakkama-yakka kurash, to'pni olib qo'yish, qabul qilish, pas, burilishlar, to'pni tana bilan to'sish, bosh bilan o'yin, qanotdan oshirma va uzatmalar, hujumni yakunlash", 'Единоборства, отбор мяча, приём и передача, развороты, укрывание мяча корпусом, игра головой, подачи, прострелы с фланга, завершение атакующих действий'],
  ["Yakkama-yakka kurash, to'pni tana bilan to'sish, to'pni olib qo'yish va tutib olish", 'Единоборства, укрывание мяча корпусом, отбор и перехват мяча'],
])

/* ---------- EPYSA (week = ready plan) ---------- */
const epysa = (n: number, pfx: string): SeasonUnit[] =>
  Array.from({ length: n }, (_, i) => ({ id: `${pfx}-w${i + 1}`, kind: 'week' as const, weeks: 1, title: T(`${i + 1}-hafta`, `Неделя ${i + 1}`), tpl: [`${pfx}w${i + 1}`] }))

/* ---------- RFS 6–9 (one stage a year) ---------- */
const rfs = (id: string, uz: string, ru: string, tpl: string[]): SeasonUnit => ({ id, kind: 'block', weeks: 0, title: T(uz, ru), tpl })

/* ---------- FIFA periods ---------- */
const FIFA_UNITS: SeasonUnit[] = [
  { id: 'fp-1', kind: 'prep', weeks: 2, title: T("Tayyorgarlik, 1-bosqich: umumiy jismoniy tayyorgarlik", 'Подготовка, этап 1: общая физическая подготовка'),
    focus: T("8–14 kun. Asosiy chidamlilik (aerob), kuch, koordinatsiya va egiluvchanlik, o'yinlar (texnika/taktika).", '8–14 дней. Основная выносливость (аэробная), экстенсивная сила, координация и гибкость, игры (техника/тактика).') },
  { id: 'fp-2', kind: 'prep', weeks: 2, title: T("Tayyorgarlik, 2-bosqich: maxsus jismoniy tayyorgarlik", 'Подготовка, этап 2: специальная физическая подготовка'),
    focus: T("10–15 kun. Aerob quvvat, intervalli mashg'ulot, tezlik va portlovchi kuch, texnik-taktik ish.", '10–15 дней. Аэробная мощность, интервальная тренировка, скорость и взрывная сила, техническая/тактическая работа.') },
  { id: 'fp-3', kind: 'prep', weeks: 2, title: T("Yakuniy bosqich: mavsum oldi o'yinlari", 'Завершающий этап: предсезонные матчи'),
    focus: T("8–12 kun. 2–3 o'rtoqlik o'yini, texnik-taktik ish.", '8–12 дней. 2–3 матча, техническая/тактическая работа.') },
  { id: 'fp-4', kind: 'comp', weeks: 14, title: T("Musobaqa davri, 1-yarim", 'Период соревнований, 1-я половина'),
    focus: T("Yosh o'yinchilar uchun 12–15 hafta. Haftalik mikrosikllar 3–4 haftalik mezosikllarga birlashadi; o'quv mezosikllari ham kiritiladi (masalan, 3 hafta: qabul qilish, nazorat va birinchi pas).", 'Для молодых игроков 12–15 недель. Недельные микроциклы объединяются в 3–4-недельные мезоциклы; включаются и обучающие мезоциклы (например, 3 недели: приём, контроль мяча и первый пас).') },
  { id: 'fp-5', kind: 'comp', weeks: 14, title: T("Musobaqa davri, 2-yarim", 'Период соревнований, 2-я половина'),
    focus: T("Yosh o'yinchilar uchun 12–15 hafta. Yoshlar bilan ishlashda mezosiklga tiklanish sikllari qo'shiladi.", 'Для молодых игроков 12–15 недель. При работе с молодыми игроками в мезоцикл вносятся циклы восстановления.') },
  { id: 'fp-6', kind: 'trans', weeks: 4, title: T("O'tish davri", 'Переходный период'),
    focus: T("4–8 hafta. To'liq dam 2–3 haftadan oshsa, ish qobiliyati 20–25% ga tushadi, shuning uchun bosqichma-bosqich yuklama: 1-bosqich 7–14 kun (boshqa sport turlari), 2-bosqich 10–20 kun (haftasiga 3–4 mashg'ulot, 45–60 daqiqa, 60–70% intensivlik).", '4–8 недель. 2–3 недели полного отдыха снижают результативность на 20–25 %, поэтому нагрузка прогрессивная: этап 1 — 7–14 дней (другие виды спорта), этап 2 — 10–20 дней (3–4 тренировки в неделю по 45–60 минут, интенсивность 60–70 %).') },
]

/* ---------- FIFA 8.1: strength through the year (table 14) and the weekly cycle, adult players ---------- */
const PRO_UNITS: SeasonUnit[] = [
  { id: 'pr-1', kind: 'prep', weeks: 1, title: T("Tayyorgarlik (ekstensiv bosqich): 1-hafta", 'Подготовка (экстенсивная стадия): 1-я неделя'),
    focus: T("Kuch: 1–2 mashg'ulot, 2 seriya. Asosiy chidamlilik (1–2-zona), o'z vazni bilan mustahkamlash.", 'Сила: 1–2 тренировки, 2 подхода. Основная выносливость (зоны 1–2), укрепление весом тела.'), tpl: ['pro7', 'pro4'] },
  { id: 'pr-2', kind: 'prep', weeks: 1, title: T("Tayyorgarlik (ekstensiv bosqich): 2-hafta", 'Подготовка (экстенсивная стадия): 2-я неделя'),
    focus: T("Kuch: 2 mashg'ulot, 3 seriya. Aerob mashg'ulot (2–3-zona).", 'Сила: 2 тренировки, 3 подхода. Аэробная тренировка (зоны 2–3).'), tpl: ['pro4', 'pro1'] },
  { id: 'pr-3', kind: 'prep', weeks: 1, title: T("Tayyorgarlik (ekstensiv bosqich): 3-hafta", 'Подготовка (экстенсивная стадия): 3-я неделя'),
    focus: T("Kuch: 2 mashg'ulot, 3–4 seriya. Aerob quvvat (3–4-zona), pliometrika haftada kamida 1 marta.", 'Сила: 2 тренировки, 3–4 подхода. Аэробная мощность (зоны 3–4), плиометрика не реже раза в неделю.'), tpl: ['pro4', 'pro2'] },
  { id: 'pr-4', kind: 'prep', weeks: 1, title: T("Tayyorgarlik: yengillashtirilgan hafta", 'Подготовка: разгрузочная неделя'),
    focus: T("Kuch: 1 mashg'ulot, 2–3 seriya (yuklama kamaytirilgan sikl).", 'Сила: 1 тренировка, 2–3 подхода (цикл со сниженной нагрузкой).'), tpl: ['pro7', 'pro1'] },
  { id: 'pr-5', kind: 'prep', weeks: 2, title: T("Musobaqa oldi (intensiv bosqich)", 'Перед соревнованиями (интенсивная стадия)'),
    focus: T("2 hafta: kuch 1–2 mashg'ulot, 2–3 seriya, yuklama oshadi; maksimal va kontrast kuch, tezlik. Laktat ish faqat 4–5 haftalik tayyorgarlikdan keyin.", '2 недели: сила 1–2 тренировки, 2–3 подхода, нагрузка растёт; максимальная и контрастная сила, скорость. Лактатная работа — только после 4–5 недель подготовки.'), tpl: ['pro5', 'pro3', 'pro2'] },
  { id: 'pr-6', kind: 'prep', weeks: 1, title: T("Musobaqa oldi: yengillashtirilgan hafta", 'Перед соревнованиями: разгрузочная неделя'),
    focus: T("Kuch: 1 mashg'ulot, 2 seriya. O'rtoqlik o'yinlari.", 'Сила: 1 тренировка, 2 подхода. Товарищеские матчи.'), tpl: ['pro6'] },
  { id: 'pr-7', kind: 'comp', weeks: 30, title: T("Musobaqa davri (maxsus bosqich)", 'Период соревнований (специальная стадия)'),
    focus: T("Har hafta kuch 1–2 mashg'ulot, 2–3 seriya (kuchni saqlash). 1-kun (o'yindan keyin): tiklanish; 2-kun: kuch; 4–5-kun: portlovchi kuch va reaksiya. Tezlik haftasiga 2 marta, laktat ish haftada 1 marta, o'yindan 3 kun oldin emas.", 'Каждую неделю сила 1–2 тренировки, 2–3 подхода (поддержание). 1-й день (после матча): восстановление; 2-й день: сила; 4–5-й день: мощность и реактивность. Скорость 2 раза в неделю, лактатная работа раз в неделю, не за 3 дня до матча.'), tpl: ['pro7', 'pro4', 'pro3', 'pro8', 'pro6'] },
  { id: 'pr-8', kind: 'trans', weeks: 4, title: T("O'tish davri", 'Переходный период'),
    focus: T("Boshqa sport turlari, uzlukli yugurish yo'lagi, o'z vazni bilan umumiy tonus (haftasiga 1–2), egiluvchanlik.", 'Другие виды спорта, прерывистая полоса препятствий, общий тонус весом тела (1–2 раза в неделю), гибкость.') },
]


/* ---------- Verheijen, football periodisation: 6-week cycles, conditioning through football ---------- */
const vh = (n: number, kind: 'prep' | 'comp', uz: string, ru: string, fuz: string, fru: string): SeasonUnit =>
  ({ id: `vh-${n}`, kind, weeks: 1, title: T(`${n}-hafta: ${uz}`, `Неделя ${n}: ${ru}`), focus: T(fuz, fru) })
const VH_GAMES_BIG = ["Katta o'yinlar 11×11 / 8×8", 'Большие игры 11×11 / 8×8']
const VH_UNITS: SeasonUnit[] = [
  vh(1, 'prep', VH_GAMES_BIG[0], VH_GAMES_BIG[1], "1-sikl. Seshanba: portlovchi tayyorlov mashqlari 7 × 50 m (70%, dam 50 s), so'ng kondision o'yinlar 11×11/8×8: 2 × 12 daqiqa, o'yinlar orasida 2 daqiqa. Shanba: 9 × 30 m (90%) va yana 2 × 12 daqiqa.", 'Цикл 1. Вторник: взрывные подготовительные упражнения 7 × 50 м (70 %, отдых 50 с), затем кондиционные игры 11×11/8×8: 2 × 12 мин, пауза 2 мин. Суббота: 9 × 30 м (90 %) и снова 2 × 12 мин.'),
  vh(2, 'prep', VH_GAMES_BIG[0], VH_GAMES_BIG[1], "Seshanba: 10 × 20 m (100%, dam 20 s), kondision o'yinlar 11×11/8×8: 2 × 13 daqiqa. Shanba: o'rtoqlik o'yini.", 'Вторник: 10 × 20 м (100 %, отдых 20 с), кондиционные игры 11×11/8×8: 2 × 13 мин. Суббота: товарищеский матч.'),
  vh(3, 'prep', "O'rta o'yinlar 7×7 / 5×5", 'Средние игры 7×7 / 5×5', "Seshanba: qisqa sprintlar, dam kam: 2 seriya × 6 × 15 m, sprintlar orasida 10 s, seriyalar orasida 4 daqiqa. Kondision o'yinlar 7×7/5×5: 4 × 4 daqiqa, orasida 2 daqiqa.", 'Вторник: короткие спринты с минимальным отдыхом: 2 серии × 6 × 15 м, 10 с между спринтами, 4 мин между сериями. Кондиционные игры 7×7/5×5: 4 × 4 мин, пауза 2 мин.'),
  vh(4, 'prep', "O'rta o'yinlar 7×7 / 5×5", 'Средние игры 7×7 / 5×5', "Seshanba: 2 × 7 × 15 m (dam 10 s / 4 daqiqa). Kondision o'yinlar 7×7/5×5: 4 × 4,5 daqiqa.", 'Вторник: 2 × 7 × 15 м (отдых 10 с / 4 мин). Кондиционные игры 7×7/5×5: 4 × 4,5 мин.'),
  vh(5, 'prep', "Kichik o'yinlar 4×4 / 3×3", 'Малые игры 4×4 / 3×3', "Seshanba: start va tezlanish, dam ko'p: 6 × 5 m (dam 30 s), 4 × 15 m (45 s), 2 × 25 m (60 s). Kondision o'yinlar 4×4/3×3: 2 seriya × 6 × 1 daqiqa, o'yinlar orasida 2 daqiqa.", 'Вторник: старт и ускорение с максимальным отдыхом: 6 × 5 м (отдых 30 с), 4 × 15 м (45 с), 2 × 25 м (60 с). Кондиционные игры 4×4/3×3: 2 серии × 6 × 1 мин, пауза 2 мин.'),
  vh(6, 'prep', "Kichik o'yinlar 4×4 / 3×3", 'Малые игры 4×4 / 3×3', "Seshanba: 7 × 5 m, 4 × 15 m, 2 × 25 m. Kondision o'yinlar 4×4/3×3: 2 × 6 × 1 daqiqa, orasida 1,5 daqiqa (dam qisqaradi).", 'Вторник: 7 × 5 м, 4 × 15 м, 2 × 25 м. Кондиционные игры 4×4/3×3: 2 × 6 × 1 мин, пауза 1,5 мин (отдых сокращается).'),
  vh(7, 'comp', VH_GAMES_BIG[0], VH_GAMES_BIG[1], "2-sikl (liga boshlandi). Seshanba: 8 × 40 m (80%, dam 40 s), kondision o'yinlar 11×11/8×8: 2 × 13 daqiqa. Shanba: liga o'yini.", 'Цикл 2 (лига началась). Вторник: 8 × 40 м (80 %, отдых 40 с), кондиционные игры 11×11/8×8: 2 × 13 мин. Суббота: игра лиги.'),
  vh(8, 'comp', VH_GAMES_BIG[0], VH_GAMES_BIG[1], "Seshanba: 9 × 30 m (90%, dam 30 s), kondision o'yinlar 11×11/8×8: 2 × 14 daqiqa.", 'Вторник: 9 × 30 м (90 %, отдых 30 с), кондиционные игры 11×11/8×8: 2 × 14 мин.'),
  vh(9, 'comp', "O'rta o'yinlar 7×7 / 5×5", 'Средние игры 7×7 / 5×5', "Seshanba: 2 × 7 × 15 m (dam 10 s / 4 daqiqa), kondision o'yinlar 7×7/5×5: 4 × 4,5 daqiqa.", 'Вторник: 2 × 7 × 15 м (отдых 10 с / 4 мин), кондиционные игры 7×7/5×5: 4 × 4,5 мин.'),
  vh(10, 'comp', "O'rta o'yinlar 7×7 / 5×5", 'Средние игры 7×7 / 5×5', "Seshanba: 2 × 8 × 15 m, kondision o'yinlar 7×7/5×5: 4 × 5 daqiqa.", 'Вторник: 2 × 8 × 15 м, кондиционные игры 7×7/5×5: 4 × 5 мин.'),
  vh(11, 'comp', "Kichik o'yinlar 4×4 / 3×3", 'Малые игры 4×4 / 3×3', "Seshanba: 7 × 5 m, 4 × 15 m, 2 × 25 m (dam 30/45/60 s), kondision o'yinlar 4×4/3×3: 2 × 6 × 1 daqiqa, orasida 1,5 daqiqa.", 'Вторник: 7 × 5 м, 4 × 15 м, 2 × 25 м (отдых 30/45/60 с), кондиционные игры 4×4/3×3: 2 × 6 × 1 мин, пауза 1,5 мин.'),
  vh(12, 'comp', "Kichik o'yinlar 4×4 / 3×3", 'Малые игры 4×4 / 3×3', "Seshanba: 7 × 5 m, 5 × 15 m, 2 × 25 m, kondision o'yinlar 4×4/3×3: 2 × 6 × 1 daqiqa, orasida 1 daqiqa. Keyin yangi 6 haftalik sikl yuqoriroq bosqichdan boshlanadi.", 'Вторник: 7 × 5 м, 5 × 15 м, 2 × 25 м, кондиционные игры 4×4/3×3: 2 × 6 × 1 мин, пауза 1 мин. Затем новый 6-недельный цикл со следующей ступени.'),
]

export const SEASON_PROGRAMS: SeasonProgram[] = [
  // ---- EPYSA ----
  { id: 'epysa6', source: 'epysa6', ages: '5–6', startMonth: 8, title: T('EPYSA U6: haftalik reja', 'EPYSA U6: план по неделям'),
    summary: T("Kitobdagi haftalik reja: har hafta texnik isinish, kichik o'yinlar va oxirida 3×3 o'yini.", 'Недельный план из книги: техническая разминка, игры в малых группах и игра 3×3 в конце.'),
    units: epysa(5, 'u6'), rules: [T("Har bir hafta — kitobdagi tayyor mashg'ulot, uni bir bosishda rejaga qo'shish mumkin.", 'Каждая неделя — готовое занятие из книги, его можно добавить в план одним нажатием.')] },
  { id: 'epysa8', source: 'epysa8', ages: '7–8', startMonth: 8, title: T('EPYSA U8: 8 haftalik reja', 'EPYSA U8: план на 8 недель'),
    summary: T("Kitobdagi haftalik reja: har hafta oxirida 4×4 o'yini.", 'Недельный план из книги: в конце каждой недели игра 4×4.'),
    units: epysa(8, 'u8'), rules: [T("Har bir hafta — kitobdagi tayyor mashg'ulot.", 'Каждая неделя — готовое занятие из книги.')] },
  { id: 'epysa10', source: 'epysa10', ages: '9–10', startMonth: 8, title: T('EPYSA U10: 10 haftalik reja', 'EPYSA U10: план на 10 недель'),
    summary: T("Kitobdagi haftalik reja: har hafta oxirida 7×7 o'yini.", 'Недельный план из книги: в конце каждой недели игра 7×7.'),
    units: epysa(10, 'u10'), rules: [T("Har bir hafta — kitobdagi tayyor mashg'ulot.", 'Каждая неделя — готовое занятие из книги.')] },
  { id: 'epysa12', source: 'epysa12', ages: '11–12', startMonth: 8, title: T('EPYSA U12: 10 haftalik reja', 'EPYSA U12: план на 10 недель'),
    summary: T("Kitobdagi haftalik reja: har hafta oxirida 8×8 / 9×9 o'yini.", 'Недельный план из книги: в конце каждой недели игра 8×8 / 9×9.'),
    units: epysa(10, 'u12'), rules: [T("Har bir hafta — kitobdagi tayyor mashg'ulot.", 'Каждая неделя — готовое занятие из книги.')] },
  // ---- RFS 6–9 ----
  { id: 'rfs6', source: 'rfs69', ages: '5–6', startMonth: 8, perWeek: '2 + o\'yin / 2 + игра', minutes: '45–60',
    title: T("RFS 6 yosh: «To'p» bosqichi", 'РФС 6 лет: этап «Мяч»'),
    summary: T("Yil davomida bitta bosqich. Mashg'ulot oxirida futbol o'yini kamida 15 daqiqa, bitta mashq 10 daqiqadan oshmaydi; 1×1, 2×2, 3×3 darvozabonsiz.", 'Весь год — один этап. Игра в футбол в конце основной части не менее 15 минут, одно упражнение не более 10 минут; составы 1×1, 2×2, 3×3 без вратарей.'),
    units: [rfs('rfs6-1', "«To'p» bosqichi", 'Этап «Мяч»', ['r69p1', 'r69p2'])], rules: [] },
  { id: 'rfs7', source: 'rfs69', ages: '7–8', startMonth: 8, perWeek: '2–3 + o\'yin / 2–3 + игра', minutes: '60–75',
    title: T("RFS 7 yosh: «To'p + darvoza» bosqichi", 'РФС 7 лет: этап «Мяч + ворота»'),
    summary: T("Yil davomida bitta bosqich. Mashg'ulot oxirida futbol o'yini kamida 20 daqiqa; 1×1, 2×2, 3×3 darvozabonsiz.", 'Весь год — один этап. Игра в футбол в конце основной части не менее 20 минут; составы 1×1, 2×2, 3×3 без вратарей.'),
    units: [rfs('rfs7-1', "«To'p + darvoza» bosqichi", 'Этап «Мяч + ворота»', ['r69p3', 'r69p4'])], rules: [] },
  { id: 'rfs8', source: 'rfs69', ages: '7–8', startMonth: 8, perWeek: '3 + o\'yin / 3 + игра', minutes: '75–90',
    title: T("RFS 8 yosh: «To'p + darvoza + raqib» bosqichi", 'РФС 8 лет: этап «Мяч + ворота + соперник»'),
    summary: T("Yil davomida bitta bosqich. Mashg'ulot oxirida futbol o'yini kamida 25 daqiqa; 1×1 dan 4×4 gacha, darvozabon bilan yoki darvozabonsiz.", 'Весь год — один этап. Игра в футбол в конце основной части не менее 25 минут; составы от 1×1 до 4×4, с вратарём или без.'),
    units: [rfs('rfs8-1', "«To'p + darvoza + raqib» bosqichi", 'Этап «Мяч + ворота + соперник»', ['r69p5', 'r69p6'])], rules: [] },
  { id: 'rfs9', source: 'rfs69', ages: '9–10', startMonth: 8, perWeek: '3 + o\'yin / 3 + игра', minutes: '90',
    title: T("RFS 9 yosh: «To'p + darvoza + raqib + sherik» bosqichi", 'РФС 9 лет: этап «Мяч + ворота + соперник + партнёр»'),
    summary: T("Yil davomida bitta bosqich. Mashg'ulot oxirida futbol o'yini kamida 30 daqiqa; 1×1 dan 4×4 gacha, darvozabon bilan yoki darvozabonsiz.", 'Весь год — один этап. Игра в футбол в конце основной части не менее 30 минут; составы от 1×1 до 4×4, с вратарём или без.'),
    units: [rfs('rfs9-1', "«To'p + darvoza + raqib + sherik» bosqichi", 'Этап «Мяч + ворота + соперник + партнёр»', ['r69p7', 'r69p8'])], rules: [] },
  // ---- adidas 10–14 ----
  { id: 'a14-1011', source: 'adidas1014', ages: '9–10', startMonth: 8, perWeek: '3 + o\'yin / 3 + игра', title: T('adidas 10–11 yosh: 8 blok', 'adidas 10–11 лет: 8 блоков'),
    summary: T("Texnika bloklari. Kitobdagi yillik reja sentabrdan avgustgacha.", 'Блоки по технике. Годичный план в книге — с сентября по август.'),
    blockWeeks: A14_WEEKS, canRepeat: true, rules: A14_RULES,
    units: blocks('a1011', 5, [
      ["Texnika. Olib yurish va to'pni olib qo'yish", 'Техника. Ведение и отбор мяча'],
      ["Texnika. To'pni olib qo'yish", 'Техника. Отбор мяча'],
      ["Texnika. To'psiz harakatlanish", 'Техника. Перемещения без мяча'],
      ['Texnika. Pas', 'Техника. Передача'],
      ["Texnika. To'pni qabul qilish va ishlov berish", 'Техника. Приём и обработка мяча'],
      ['Texnika. Zarba', 'Техника. Удар'],
      ['Texnika. Bosh bilan zarba', 'Техника. Удар головой'],
      ["Texnika. Bog'lam «olib yurish + fint + zarba»", 'Техника. Связка «ведение + финт + удар»'],
    ]) },
  { id: 'a14-12', source: 'adidas1014', ages: '11–12', startMonth: 8, title: T('adidas 12 yosh: 8 blok', 'adidas 12 лет: 8 блоков'),
    summary: T("Texnika (1–3) va taktika (4–8) bloklari.", 'Блоки по технике (1–3) и тактике (4–8).'),
    blockWeeks: A14_WEEKS, canRepeat: true, rules: A14_RULES,
    units: blocks('a12', 5, [
      ["Texnika. Olib yurish va fintlar, to'pni olib qo'yish va pas", 'Техника. Ведение и финты, отбор и передача'],
      ["Texnika. Turli balandlikda uchib kelayotgan to'pga ishlov berish", 'Техника. Обработка мяча, летящего на разной высоте'],
      ["Texnika. Turli balandlikda uchib kelayotgan to'pga zarba (havoda, yarim havoda, bosh bilan)", 'Техника. Удары по мячу (с лёта, полулёта, головой), летящему на разной высоте'],
      ["Taktika. To'psiz yakka taktika", 'Тактика. Индивидуальная тактика игры без мяча'],
      ["Taktika. To'psiz yakka taktika: raqibni chalg'itish, son ustunligini yaratish", 'Тактика. Индивидуальная тактика без мяча: отвлечение соперника, создание численного преимущества'],
      ["Taktika. Kichik guruhlarda o'zaro harakat", 'Тактика. Взаимодействия в малых группах'],
      ["Taktika. Kichik guruhlarda o'zaro harakat", 'Тактика. Взаимодействия в малых группах'],
      ['Taktika. Hujumni darvozabondan boshlash', 'Тактика. Начало атаки от вратаря'],
    ]) },
  { id: 'a14-13', source: 'adidas1014', ages: '13–14', startMonth: 8, title: T('adidas 13 yosh: 6 blok', 'adidas 13 лет: 6 блоков'),
    summary: T('Taktika bloklari.', 'Блоки по тактике.'), blockWeeks: A14_WEEKS, canRepeat: true, rules: A14_RULES,
    units: blocks('a13', 5, [
      ['Taktika. Gol vaziyatlarini yaratish', 'Тактика. Создание голевых ситуаций'],
      ["Taktika. Hujumda chiziqlar bo'yicha o'zaro harakat (bosqichma-bosqich hujum)", 'Тактика. Взаимодействия в линиях при атаке (постепенное нападение)'],
      ['Taktika. Hujumni darvozabondan boshlash', 'Тактика. Начало атаки от вратаря'],
      ['Taktika. Pressing', 'Тактика. Прессинг'],
      ["Taktika. Himoyadan hujumga va hujumdan himoyaga o'tish", 'Тактика. Переход от обороны к атаке и от атаки к обороне'],
      ['Taktika. 1-4-3-3', 'Тактика. 1-4-3-3'],
    ]) },
  { id: 'a14-14', source: 'adidas1014', ages: '13–14', startMonth: 8, title: T('adidas 14 yosh: 6 blok', 'adidas 14 лет: 6 блоков'),
    summary: T('Taktika bloklari.', 'Блоки по тактике.'), blockWeeks: A14_WEEKS, canRepeat: true, rules: A14_RULES,
    units: blocks('a14', 5, [
      ['Taktika. Hujumni yakunlash', 'Тактика. Завершение атак'],
      ['Taktika. Qanotlardan keskin uzatmalar', 'Тактика. Обостряющие передачи с флангов'],
      ["Taktika. Chiziqlar bo'yicha o'zaro harakat", 'Тактика. Взаимодействия в линиях'],
      ['Taktika. Pressing', 'Тактика. Прессинг'],
      ["Taktika. Himoyadan hujumga va hujumdan himoyaga o'tish", 'Тактика. Переход от обороны к атаке и от атаки к обороне'],
      ['Taktika. 1-4-3-3', 'Тактика. 1-4-3-3'],
    ]) },
  // ---- adidas 15–17 ----
  { id: 'a17-15', source: 'adidas1517', ages: '15–17', startMonth: 8, perWeek: '3–4 + 1 jismoniy + o\'yin / 3–4 + 1 физ. + игра',
    title: T('adidas 15 yosh: 6 blok', 'adidas 15 лет: 6 блоков'),
    summary: T("1- va 2-chiziqlarda guruh taktik o'zaro harakatlari.", 'Тренировка групповых тактических взаимодействий в 1 и 2 линиях.'),
    blockWeeks: [3, 4, 5, 6], rules: A17_RULES, units: blocks('a15', 3, A17_LIST) },
  { id: 'a17-1617', source: 'adidas1517', ages: '15–17', startMonth: 8, perWeek: '3–4 + 1 jismoniy + o\'yin / 3–4 + 1 физ. + игра',
    title: T('adidas 16–17 yosh: 6 blok', 'adidas 16–17 лет: 6 блоков'),
    summary: T("2- va 3-chiziqlarda guruh taktik o'zaro harakatlari.", 'Тренировка групповых тактических взаимодействий во 2 и 3 линиях.'),
    blockWeeks: [3, 4, 5, 6], rules: A17_RULES, units: blocks('a1617', 3, A17_LIST) },
  // ---- NOI 12–17 ----
  { id: 'noi-u11', source: 'noi1217', ages: '9–10', startMonth: 7, perWeek: '3', minutes: '80',
    title: T('NOI: U11 yillik reja', 'NOI: годовой план U11'),
    summary: T("O'yin 8×8, sxema 1-3-1-3, o'yin 3×20 daqiqa. Asosiy mavzu — koordinatsiya, barcha mashqlar to'p bilan.", 'Матчи 8×8, схема 1-3-1-3, матч 3×20 мин. Центральная тема — координация, все упражнения с мячом.'),
    units: NOI_U11, rules: NOI_RULES(3, 80, [15, 40, 20, 5]),
    months: months([5, 7, 7, 7, 5, 6, 7, 7, 7, 7, 5], [2, 4, 4, 4, 2, 2, 3, 4, 3, 4, 2], [2, 3, 3, 2, 1, 1, 2, 2, 2, 3, 2], [0.5, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 0.5], [14, 16.5, 16.5, 15, 9.5, 14, 14, 15.5, 14.5, 16.5, 13]),
    year: year(70, 34, 10, 23, 8, 5, 9, 159, 27) },
  { id: 'noi-u13', source: 'noi1217', ages: '11–12', startMonth: 7, perWeek: '4', minutes: '90',
    title: T('NOI: U13 yillik reja', 'NOI: годовой план U13'),
    summary: T("O'yin 11×11, sxema 1-4-3-3, o'yin 2×30 daqiqa. Texnik va taktik rivojlanish jismoniydan ustun.", 'Матчи 11×11, схема 1-4-3-3, матч 2×30 мин. Техническое и тактическое развитие выше физического.'),
    units: NOI_U13, rules: NOI_RULES(4, 90, [20, 40, 25, 5]),
    months: months([7, 10, 10, 10, 8, 8, 9, 10, 10, 10, 8], [7, 8, 8, 8, 5, 7, 7, 8, 8, 8, 6], [3, 4, 4, 4, 3, 4, 4, 4, 4, 4, 2], [1, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1], [24, 26, 26, 25, 19, 27, 24, 25, 26, 25, 23]),
    year: year(100, 80, 16, 40, 14, 8, 12, 270, 27) },
  { id: 'noi-u15', source: 'noi1217', ages: '13–14', startMonth: 7, perWeek: '5', minutes: '90',
    title: T('NOI: U15 yillik reja', 'NOI: годовой план U15'),
    summary: T("O'yin 11×11, sxema 1-4-3-3, o'yin 2×35 daqiqa. Jamoaviy taktik harakatlar asosi, o'yin amplua'sini aniqlash.", 'Матчи 11×11, схема 1-4-3-3, матч 2×35 мин. Основы командных тактических действий, определение игрового амплуа.'),
    units: NOI_U15, rules: NOI_RULES(5, 90, [20, 45, 20, 5]),
    months: months([9, 8, 8, 7, 6, 8, 7, 8, 8, 7, 6], [8, 13, 13, 13, 7, 9, 13, 13, 13, 13, 7], [5, 6, 6, 6, 4, 4, 6, 7, 7, 7, 4], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [34, 30, 31, 31, 24, 34, 33, 32, 32, 31, 28]),
    year: year(82, 122, 22, 62, 20, 14, 18, 340, 31) },
  { id: 'noi-u17', source: 'noi1217', ages: '15–17', startMonth: 7, perWeek: '5', minutes: '90',
    title: T('NOI: U17 yillik reja', 'NOI: годовой план U17'),
    summary: T("O'yin 11×11, sxema 1-4-3-3 yoki 1-4-2-3-1, o'yin 2×40 daqiqa. Guruh va jamoa o'zaro harakatlarini takomillashtirish.", 'Матчи 11×11, схема 1-4-3-3 или 1-4-2-3-1, матч 2×40 мин. Совершенствование групповых и командных взаимодействий.'),
    units: NOI_U17, rules: NOI_RULES(5, 90, [20, 45, 20, 5]),
    months: months([6, 5, 5, 5, 5, 6, 5, 5, 5, 5, 4], [9, 15, 15, 14, 8, 9, 14, 15, 15, 15, 8], [5, 8, 8, 7, 4, 4, 8, 8, 8, 7, 3], [1, 3, 3, 2, 2, 2, 2, 2, 3, 3, 1], [31, 33, 33, 30, 22, 31, 33, 32, 33, 32, 24]),
    year: year(56, 137, 12, 70, 24, 17, 18, 334, 31) },
  // ---- FIFA 8.1, adult players ----
  { id: 'fifa-pro', source: 'fifaPhys', ages: 'Pro', startMonth: 6,
    title: T("FIFA 8.1: professional futbolchilar mavsumi", 'FIFA 8.1: сезон профессиональных футболистов'),
    summary: T("Kuch tayyorgarligi jadvali (14-jadval) va musobaqa davridagi haftalik sikl. Haftalar oxirida tayyor mashg'ulot rejalari bor.", 'График силовой подготовки (таблица 14) и недельный цикл в период соревнований. К неделям привязаны готовые тренировки.'),
    units: PRO_UNITS, rules: [
      T("Kuch: ekstensiv bosqich (mushak asosi, aylanma 15–30 s yoki 3 × 10 marta 50–70% bilan) → intensiv bosqich (maksimal kuch) → maxsus bosqich (kontrast kuch, pliometrika).", 'Сила: экстенсивная стадия (мышечная база, круг 15–30 с или 3 × 10 при 50–70%) → интенсивная (максимальная сила) → специальная (контрастная сила, плиометрика).'),
      T("Musobaqa davrida kuch mashg'uloti haftada kamida 1 marta, hafta boshida; og'ir-yengil almashinuvi hafta boshida, quvvat va reaktiv kuch haftaning ikkinchi yarmida.", 'В период соревнований силовая тренировка не реже раза в неделю, в начале недели; чередование тяжёлой и лёгкой нагрузки — в начале недели, мощность и реактивная сила — во второй половине.'),
      T("Tezlik haftasiga 2 marta: hafta boshida bajarish tezligi, oxirida reaksiya va chaqqonlik. Tezlik mashg'ulotning boshida, dam olgandan keyin.", 'Скорость 2 раза в неделю: в начале недели скорость выполнения, в конце — реакция и живость. Скорость — в начале тренировки, после отдыха.'),
      T("Laktat ish 4–5 haftalik tayyorgarlikdan keyin boshlanadi va o'yindan 3 kun oldin o'tkazilmaydi; uglevodga boy ovqat kerak.", 'Лактатная работа начинается после 4–5 недель подготовки и не проводится за 3 дня до матча; нужна богатая углеводами диета.'),
      T("Kuch mashqidan keyin texnik ish ayniqsa samarali.", 'Техническая работа особенно эффективна после силовой.'),
    ] },
  // ---- Verheijen, football periodisation (adult teams; one league match a week) ----
  { id: 'verheijen', source: 'verheijen', ages: 'Pro', startMonth: 6, perWeek: "3 + o'yin / 3 + игра",
    title: T("Verheyen: futbol periodizatsiyasi (6 haftalik sikllar)", 'Верхейен: футбольная периодизация (6-недельные циклы)'),
    summary: T("Jismoniy tayyorgarlik futbolning o'zi orqali: haftada bitta kondision mashg'ulot (seshanba). 1–2-haftalar katta o'yinlar, 3–4 o'rta, 5–6 kichik o'yinlar; har haftada yuklama bir pog'ona oshadi. Kitobdagi 1-sikl (tayyorgarlik) va 2-sikl (liga) jadvali.", 'Физическая подготовка через сам футбол: одна кондиционная тренировка в неделю (вторник). Недели 1–2 — большие игры, 3–4 — средние, 5–6 — малые; каждую неделю нагрузка растёт на одну ступень. Расписание цикла 1 (подготовка) и цикла 2 (лига) из книги.'),
    units: VH_UNITS, rules: [
      T("Fitnes — futbol tilida: «chidamlilik» emas, «90 daqiqa davomida yuqori sur'atda harakatni takrorlay olish». Har bir yuklama futbol harakati orqali beriladi.", 'Фитнес — футбольным языком: не «выносливость», а «умение повторять высокоинтенсивные действия все 90 минут». Любая нагрузка даётся через футбольное действие.'),
      T("6 haftalik sikl: 1–2-haftalar 11×11/8×8 (o'yin uzunligi oshadi), 3–4-haftalar 7×7/5×5, 5–6-haftalar 4×4/3×3 (dam qisqaradi). Keyingi sikl yuqoriroq pog'onadan boshlanadi (kitobdagi 21 pog'onali jadval).", '6-недельный цикл: недели 1–2 — 11×11/8×8 (растёт длина игры), 3–4 — 7×7/5×5, 5–6 — 4×4/3×3 (сокращается отдых). Следующий цикл начинается со ступени выше (таблица из 21 ступени).'),
      T("Sprintlar ham bosqichma-bosqich: 1–2-haftalar portlovchi tayyorlov mashqlari (6 × 60 m 60% dan 10 × 20 m 100% gacha), 3–4-haftalar dam kam qisqa sprintlar (15 m), 5–6-haftalar dam ko'p start va tezlanish (5/15/25 m).", 'Спринты тоже по ступеням: недели 1–2 — взрывные подготовительные упражнения (от 6 × 60 м на 60 % до 10 × 20 м на 100 %), 3–4 — короткие спринты (15 м) с минимальным отдыхом, 5–6 — старт и ускорение (5/15/25 м) с максимальным отдыхом.'),
      T("Haftada bitta o'yin bo'lsa: kondision mashg'ulot seshanba kuni. Haftada ikki o'yin bo'lsa: kondision kun o'yinlar orasidagi eng uzun tanaffusga qo'yiladi, qolgan kunlar tiklanish va yuklamasi kam o'yinlar (masalan, 7×7/5×5: 4 × 2 daqiqa).", 'При одной игре в неделю кондиционная тренировка — во вторник. При двух играх кондиционный день ставят в самый длинный промежуток между матчами, остальные дни — восстановление и игры с недогрузкой (например, 7×7/5×5: 4 × 2 мин).'),
      T("Yuklamani birdan oshirmang: bir pog'onadan sakrab o'tish jarohat va charchoq xavfini oshiradi.", 'Не повышайте нагрузку скачком: пропуск ступеней повышает риск травм и переутомления.'),
    ] },
  // ---- FIFA ----
  { id: 'fifa-year', source: 'fifaPlan', ages: '15–17', startMonth: 7,
    title: T('FIFA: yil davrlari', 'FIFA: периоды года'),
    summary: T("Tayyorgarlik (6–8 hafta), musobaqa (8–10 oy), o'tish davri (4–8 hafta). Haftalar kitobdagi oraliqlarning o'rtacha qiymati bilan olingan, murabbiy o'zgartirishi mumkin.", 'Подготовка (6–8 недель), соревнования (8–10 месяцев), переходный период (4–8 недель). Недели взяты по середине диапазонов из книги, тренер может менять.'),
    units: FIFA_UNITS, rules: [
      T("Yillik reja odatda 4–6 oylik ikki yoki uchta katta siklga (makrosikl) bo'linadi.", 'План ежегодных тренировок, как правило, делится на два или три макроцикла по 4–6 месяцев.'),
      T("Tayyorgarlik davri 6–8 hafta (4 dan 10 haftagacha), 1–3 haftalik 3–4 mezosiklga bo'linadi.", 'Период подготовки 6–8 недель (от 4 до 10), делится на 3–4 мезоцикла по 1–3 недели.'),
      T("Musobaqa davri haftalik mikrosikllardan iborat, ular 3–4 haftalik mezosikllarga birlashadi.", 'Период соревнований состоит из недельных микроциклов, которые объединяются в 3–4-недельные мезоциклы.'),
    ] },
]

export const SEASON_AGES = ['5–6', '7–8', '9–10', '11–12', '13–14', '15–17', 'Pro']

/** The coach's own season plan (synced: AppData.seasons). */
export interface SeasonPlan {
  id: string
  program: string
  group: string
  /** YYYY-MM-DD, first day of the season */
  start: string
  blockWeeks?: number
  repeat?: boolean
}

export interface PlanWeek {
  /** Monday of the week (YYYY-MM-DD) */
  monday: string
  /** index of the week in the season, from 1 */
  n: number
  unit?: SeasonUnit
  /** week inside the unit, from 1 */
  k?: number
  /** second pass through the blocks */
  again?: boolean
  /** NOI: winter break or July holidays */
  rest?: Text
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const isoDay = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
/** Monday of the week the date falls in (a Saturday or Sunday start moves to the next Monday). */
const mondayOf = (s: string) => { const d = new Date(s + 'T12:00:00'); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() + (wd >= 5 ? 7 - wd : -wd)); return d }
const plusDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }

export const programOf = (id: string) => SEASON_PROGRAMS.find((p) => p.id === id)

/** The first day of the book's season on or after today (e.g. 1 September). */
export function defaultStart(p: SeasonProgram, today = new Date()): string {
  // the season that is running now, or the next one when it starts within a month
  let y = today.getFullYear()
  if (new Date(y, p.startMonth, 1).getTime() > today.getTime() + 31 * 864e5) y -= 1
  return `${y}-${pad2(p.startMonth + 1)}-01`
}

/** Weeks of a season plan, Monday by Monday. */
export function planWeeks(p: SeasonProgram, plan: SeasonPlan): PlanWeek[] {
  const out: PlanWeek[] = []
  let day = mondayOf(plan.start)
  const push = (w: Omit<PlanWeek, 'monday' | 'n'>) => { out.push({ monday: isoDay(day), n: out.length + 1, ...w }); day = plusDays(day, 7) }
  if (p.months) {
    // NOI: microcycles 1–20 from August, winter break until January, 21–45, then the July holidays
    const units = p.units
    const unit = (n: number) => units[n - 1]
    for (let n = 1; n <= 20; n++) push({ unit: unit(n), k: 1 })
    const jan = new Date(day.getFullYear() + (day.getMonth() >= 6 ? 1 : 0), 0, 1, 12)
    while (day < jan && out.length < 30) push({ rest: T("Qishki ta'til", 'Зимние каникулы') })
    for (let n = 21; n <= 45; n++) push({ unit: unit(n), k: 1 })
    const aug = new Date(day.getFullYear(), 7, 1, 12)
    while (day < aug && out.length < 60) push({ rest: T("Yozgi ta'til", 'Летние каникулы') })
    return out
  }
  const weeksOf = (u: SeasonUnit) => (u.kind === 'block' && plan.blockWeeks ? plan.blockWeeks : u.weeks)
  const pass = (again: boolean) => { for (const u of p.units) for (let k = 1; k <= weeksOf(u); k++) push({ unit: u, k, again }) }
  pass(false)
  if (plan.repeat && p.canRepeat) {
    // the second pass only fills the rest of the training year (the book: repeat when all blocks are done before the year ends)
    const first = out.length
    const yearEnd = plusDays(mondayOf(plan.start), 364)
    pass(true)
    let keep = out.length
    while (keep > first && new Date(out[keep - 1].monday + 'T12:00:00') >= yearEnd) keep--
    // a block cut short by the end of the year is dropped (a block is at least 8 sessions)
    const lastW = out[keep - 1]
    if (keep > first && lastW.unit && lastW.k !== weeksOf(lastW.unit)) while (keep > first && out[keep - 1].unit === lastW.unit) keep--
    out.length = keep
  }
  return out
}

/** NOI: microcycle number of a season week (weeks off are not counted). */
export function microcycle(weeks: PlanWeek[], w: PlanWeek): number {
  return weeks.slice(0, weeks.indexOf(w) + 1).filter((x) => !x.rest).length
}

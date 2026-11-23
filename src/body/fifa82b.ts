import type { Limb, Pose } from './pose'
import type { BodyProgram, Exercise } from './program'

/**
 * FIFA part 8.2, section 10 "Varied strengthening programme (special phase)" — five complexes,
 * each a chain: strength → plyometrics → a quick, accurate football action (source in the book:
 * CardiSport, Dijon) — and section 11 "Stretching programme" (8 stretches, two variants each).
 */
const T = (uz: string, ru: string): [string, string] => [uz, ru]
const bar = (p: Pose): Pose => ({ ...p, o: [['bar', 'neck', -1.5, -1.5]] })
const HOLD: [number, number] = [102, -62]

// ---------- 10.1 legs, vertical jumps ----------
const wallSit: Pose = { h: [34.6, 43], t: -90, a: [70, 20], l: [0, 90], f: 0 }
const box1: Pose = { h: [24, 15.6], t: -90, a: [95, 95], l: { to: [24.5, 42.2] }, f: 0 }
const box2: Pose = { h: [34, 20], t: -85, a: [60, 40], l: { to: [38, 44] }, m: { to: [33, 45] }, f: 40, g: 50 }
const box3: Pose = { h: [43, 42], t: -55, hd: -70, a: [130, 130], l: { to: [48.5, 56.1] }, m: { to: [47, 56.1] }, f: 0 }
const box4: Pose = { h: [49, 21], t: -88, a: [-75, -75], l: { to: [49.5, 49] }, f: 70 }
const box5: Pose = { h: [51, 33], t: -80, a: [100, 80], l: { to: [52.5, 56.1] }, f: 0 }
const crouch = (x: number): Pose => ({ h: [x, 33.5], t: -74, hd: -84, a: [128, 128], l: { to: [x + 1.5, 56.1] }, m: { to: [x, 56.1] }, f: 0 })
const tuck = (x: number): Pose => ({ h: [x, 19], t: -86, a: [-60, -60], l: [40, 120], m: [46, 126], f: 60 })
const hurdles = [crouch(20), tuck(32), crouch(43), tuck(54), crouch(65), tuck(76), crouch(87)]
const head0: Pose = { h: [45, 34], t: -78, hd: -70, a: [122, 122], l: { to: [46.5, 56.1] }, f: 0, o: [['ball', [88, 8]]] }
const head1: Pose = { h: [47, 20], t: -95, hd: -78, a: [-40, 10], b: [-140, 170], l: [95, 102], m: [100, 120], f: 70, g: 80, o: [['ball', 'head', 4.8, -1]] }
const head2: Pose = { h: [48, 31], t: -86, a: [100, 80], l: { to: [49.5, 56.1] }, f: 0, o: [['ball', [97, 6]]] }

// ---------- 10.2 legs, horizontal jumps ----------
const split0 = bar({ h: [44, 31], t: -86, a: HOLD, l: { to: [54, 56.1] }, m: { to: [29, 44.4] }, f: 0, g: 190 })
const split1 = bar({ h: [41.5, 41], t: -80, a: HOLD, l: { to: [54, 56.1] }, m: { to: [29, 44.4] }, f: 0, g: 190 })
const bound: Pose[] = [
  { h: [14, 31], t: -80, a: [60, 30], b: [122, 122], l: { to: [10, 56.1] }, m: [20, 100], f: 20, g: 40 },
  { h: [36, 24], t: -80, a: [60, 30], b: [122, 122], l: [122, 150], m: [8, 95], f: 170, g: 40 },
  { h: [58, 31], t: -80, a: [122, 122], b: [60, 30], l: [62, 140], m: { to: [60, 56.1] }, f: 60, g: 0 },
  { h: [80, 24], t: -80, a: [122, 122], b: [60, 30], l: [8, 95], m: [122, 150], f: 40, g: 170 },
  { h: [100, 31], t: -80, a: [60, 30], b: [122, 122], l: { to: [102, 56.1] }, m: [62, 140], f: 0, g: 60 },
]
const kick = (ball: [number, number], end: boolean, far: boolean): Pose[] => [
  { h: [38, 30.5], t: -84, a: [20, 10], b: [150, 150], l: { to: [43, 56.1] }, m: [130, 176], f: 0, g: 176, o: [['ball', [49, 55.4]]] },
  { h: [41, 30], t: -88, a: [10, 0], b: [160, 150], l: { to: [43, 56.1] }, m: [70, 75], f: 0, g: 18, o: [['ball', [51.5, 55.4]]] },
  { h: [43, 30], t: end ? -100 : -92, a: [0, -10], b: [150, 140], l: { to: [43, 56.1] }, m: far ? [-2, 6] : [12, 22], f: 0, g: -20, o: [['ball', ball]] },
]

// ---------- 10.3 arms and shoulders ----------
const push0: Pose = { h: [43.8, 44.5], t: -23.4, a: { to: [60, 56.2] }, l: { to: [19.5, 55] }, f: 100 }
const push1: Pose = { ...push0, h: [45.7, 51.3], t: -8 }
const stride = (t: number, a: Limb, extra: Partial<Pose> = {}): Pose => ({ h: [50, 31.5], t, a, l: { to: [58, 56.1] }, m: { to: [42, 56.1] }, f: 0, g: 0, ...extra })
const med = [
  stride(-98, [-115, -150], { o: [['med', 'hands']] }),
  stride(-78, [-28, -22], { o: [['med', 'hands']] }),
  stride(-76, [-10, 10], { o: [['med', [97, 22]]] }),
]
const throwIn = [
  { ...stride(-100, [-118, -155]), l: { to: [52, 56.1] }, m: { to: [47, 56.1] }, o: [['ball', 'hands', 0, -1]] } as Pose,
  { ...stride(-82, [-40, -30]), l: { to: [52, 56.1] }, m: { to: [47, 56.1] }, o: [['ball', 'hands', 0, -1]] } as Pose,
  { ...stride(-80, [-12, 6]), l: { to: [52, 56.1] }, m: { to: [47, 56.1] }, o: [['ball', [96, 54]]] } as Pose,
]

// ---------- 10.4 legs, lateral lunges (front view) ----------
const lat0: Pose = { h: [50, 30], t: -90, fr: true, a: { to: [61, 12.5], bend: 1 }, b: { to: [39, 12.5], bend: -1 }, l: { to: [56, 56.1] }, m: { to: [44, 56.1] }, o: [['rod', 'neck', 24, -1]] }
const lat1: Pose = { ...lat0, h: [58, 39.5], a: { to: [69, 21.5], bend: 1 }, b: { to: [47, 21.5], bend: -1 }, l: { to: [69, 56.1] }, m: { to: [32.5, 56.1] } }
const hopL: Pose = { h: [38, 33], t: -90, fr: true, a: [30, 40], b: [150, 140], l: { to: [43, 56.1] }, m: { to: [33, 56.1] } }
const hopM: Pose = { h: [50, 21], t: -90, fr: true, a: [-20, -10], b: [-160, -170], l: { to: [53.5, 46.5] }, m: { to: [46.5, 46.5] } }
const hopR: Pose = { ...hopL, h: [62, 33], l: { to: [67, 56.1] }, m: { to: [57, 56.1] } }

// ---------- 10.5 ankles ----------
const calf0 = bar({ h: [50, 29.6], t: -90, a: HOLD, l: { to: [50.5, 56.2] }, f: 0 })
const calf1 = bar({ h: [50, 26.6], t: -90, a: HOLD, l: { to: [50.5, 53.4] }, f: 56 })
const toe = (x: number): Pose => ({ h: [x, 27.6], t: -88, a: [110, 100], l: { to: [x + 0.5, 54.2] }, m: { to: [x - 0.5, 54.2] }, f: 52 })
const air = (x: number): Pose => ({ h: [x, 20.9], t: -88, a: [70, 50], l: { to: [x + 0.5, 47.5] }, m: { to: [x - 0.5, 47.5] }, f: 62 })
const ankleHops = [toe(20), air(30), toe(40), air(50), toe(60), air(70), toe(80)]
const ah0: Pose = { ...toe(46), o: [['ball', [90, 10]]] }
const ah1: Pose = { ...air(46), hd: -80, a: [-40, 10], b: [-140, 170], o: [['ball', 'head', 4.8, -1]] }
const ah2: Pose = { ...toe(46), o: [['ball', [97, 6]]] }

const D3 = T("2–3 seriya, orasida 2–3 daqiqa faol dam (to'pni o'ynatish)", '2–3 подхода, между ними 2–3 мин активного отдыха (чеканка мяча)')
const D4 = T('2–4 seriya, orasida 2–3 daqiqa faol dam', '2–4 подхода, между ними 2–3 мин активного отдыха')

const EX1: Exercise = {
  name: T('Oyoq mushaklari: vertikal sakrashlar', 'Мышцы ног: вертикальные прыжки'), dose: D3, w: 100,
  cue: T("Kuch → pliometrika → aniq futbol harakati: devorga suyanib o'tirish, qutidan sakrab tushib sakrash, to'siqlardan sakrash, keyin bosh bilan zarba", 'Сила → плиометрика → точное футбольное действие: «стульчик» у стены, спрыгивание с тумбы и выпрыгивание, прыжки через барьеры, затем удар головой'),
  seg: [
    { k: [wallSit], hold: 3, sc: [['wall', 30]], label: T("Izometrik 30 s (yoki 70–80% yuk bilan 3–5 o'tirib-turish)", 'Изометрия 30 с (или 3–5 приседаний со штангой 70–80%)') },
    { k: [box1, box2, box3, box4, box5], loop: 'fwd', reps: 1, mv: 0.7, ghost: true, show: [0, 2, 3], sc: [['box', 14, 16, 14]], label: T('Ekssentrik: tushish va sakrash (1 marta)', 'Эксцентрика: спрыгивание и выпрыгивание (1 раз)') },
    { k: hurdles, loop: 'fwd', reps: 1, mv: 0.55, hold: 0.15, ghost: true, show: [0, 1, 2, 3], sc: [['hurdle', 32, 10], ['hurdle', 54, 10], ['hurdle', 76, 10]], label: T('Pliometrik: 5–8 sakrash', 'Плиометрика: 5–8 прыжков') },
    { k: [head0, head1, head2], loop: 'fwd', reps: 2, mv: 0.7, show: [1], label: T('Bosh bilan kuchli aniq zarba: 2–3', 'Резкий точный удар головой: 2–3') },
  ],
}
const EX2: Exercise = {
  name: T('Oyoq mushaklari: gorizontal sakrashlar', 'Мышцы ног: горизонтальные прыжки'), dose: T("2–3 seriya, orasida 2–3 daqiqa faol dam (2–3 kishi bilan to'p o'ynatish)", '2–3 подхода, между ними 2–3 мин активного отдыха (чеканка с 2–3 игроками)'), w: 110,
  cue: T("Shtanga bilan hamla (orqa oyoq qutida), keyin qadam-sakrashlar va darvozaga kuchli zarba", 'Выпады со штангой (задняя нога на тумбе), затем прыжки шагом и сильный удар по воротам'),
  seg: [
    { k: [split0, split1], reps: 2, sc: [['box', 20, 12, 12]], label: T('Dinamik: har oyoqqa 5–10 (yengil yuk)', 'Динамика: 5–10 на каждую ногу (небольшой вес)') },
    { k: bound, loop: 'fwd', reps: 1, mv: 0.6, hold: 0.1, ghost: true, show: [0, 1, 2], label: T('8–12 qadam-sakrash', '8–12 прыжков шагом') },
    { k: kick([100, 30], true, false), loop: 'fwd', reps: 2, mv: 0.5, show: [1], label: T("Kuchli aniq zarba: o'ng va chap oyoq bilan 2 ta", 'Резкий точный удар: 2 (правой и левой)') },
  ],
}
const EX3: Exercise = {
  name: T("Qo'l va yelka mushaklari", 'Мышцы рук и плеч'), dose: D4,
  cue: T("Otjimaniya, to'ldirilgan to'pni ikki qo'llab otish, keyin tez va aniq autlar", 'Отжимания, броски набивного мяча двумя руками, затем быстрые точные вбрасывания'),
  seg: [
    { k: [push0, push1], reps: 3, mv: 0.8, sc: [['mat', 10, 74]], label: T('10–15 dinamik yoki 5–10 tez otjimaniya', '10–15 динамичных или 5–10 быстрых отжиманий') },
    { k: med, loop: 'fwd', reps: 2, mv: 0.6, show: [0], label: T("To'ldirilgan to'pni 5–10 marta otish (2–3 kg)", '5–10 бросков набивного мяча (2–3 кг)') },
    { k: throwIn, loop: 'fwd', reps: 2, mv: 0.6, show: [0], label: T("Tez va aniq autlar (sherik oyog'iga): 3–6", 'Резкие точные вбрасывания (на ногу партнёра): 3–6') },
  ],
}
const EX4: Exercise = {
  name: T('Oyoq mushaklari: yon hamlalar', 'Мышцы ног: боковые выпады'), dose: D4,
  cue: T("Shtanga bilan yon tomonga hamla, keyin yon tomonga sakrashlar va havodan uzun aniq pas", 'Боковые выпады со штангой, затем прыжки в сторону и длинный точный пас верхом'),
  seg: [
    { k: [lat0, lat1], reps: 2, label: T('Har oyoqqa 5–10 (yengil shtanga bilan ham)', '5–10 на каждую ногу (также с лёгкой штангой)') },
    { k: [hopL, hopM, hopR], reps: 2, mv: 0.55, hold: 0.2, sc: [['ring', 38], ['ring', 62]], label: T('Yon tomonga 10–20 sakrash', '10–20 прыжков в сторону') },
    { k: kick([98, 4], true, true), loop: 'fwd', reps: 2, mv: 0.5, show: [1], label: T("Havodan uzun aniq pas (30–40 m): o'ng va chap bilan 2 ta", 'Длинный точный пас верхом (30–40 м): 2 (правой и левой)') },
  ],
}
const EX5: Exercise = {
  name: T("Oyoq mushaklari: boldir-to'piq bo'g'imi", 'Мышцы ног: голеностопный сустав'), dose: D4,
  cue: T("Shtanga bilan oyoq uchiga ko'tarilish, tarang oyoqlar bilan konuslardan sakrash, keyin sakrab bosh bilan zarba", 'Подъём на носки со штангой, прыжки через фишки на напряжённых ногах, затем удар головой в прыжке'),
  seg: [
    { k: [calf0, calf1], reps: 3, mv: 0.9, hold: 0.6, label: T("Yuk bilan (shtanga 40–80 kg); izometrik 1–3 × 15–20 s ham", 'С нагрузкой (штанга 40–80 кг); также 1–3 × 15–20 с изометрически') },
    { k: ankleHops, loop: 'fwd', reps: 1, mv: 0.45, hold: 0.1, ghost: true, show: [0, 1, 2, 3, 4], sc: [['cone', 30], ['cone', 50], ['cone', 70]], label: T('Ikki oyoqda 10–20 sakrash (oyoqlar tarang)', '10–20 прыжков на двух ногах (ноги напряжены)') },
    { k: [ah0, ah1, ah2], loop: 'fwd', reps: 2, mv: 0.6, show: [1], label: T('Bosh bilan aniq zarba: 3–5', 'Резкий точный удар головой: 3–5') },
  ],
}

export const SEC10_EX: Record<string, BodyProgram> = {
  'f82-35': { ex: [EX1] }, 'f82-36': { ex: [EX2] }, 'f82-37': { ex: [EX3] }, 'f82-38': { ex: [EX4] }, 'f82-39': { ex: [EX5] },
}

// ---------- 11. Stretching ----------
const DS = T("Mashg'ulot oxirida 15–30 s ushlab turing; badan qizdirishda (1–4-mashqlar) yengil, 5–10 s", 'В конце тренировки — фиксация 15–30 с; в разминке (упр. 1–4) — легко, 5–10 с')
const DS2 = T("Mashg'ulot oxirida 15–30 s ushlab turing", 'В конце тренировки — фиксация 15–30 с')
const st = { reps: 1, mv: 1.6, hold: 3 }
const standing: Pose = { h: [46, 29.6], t: -90, a: [95, 95], l: { to: [46.5, 56.2] }, f: 0 }
const pike: Pose = { h: [44, 31], t: 50, hd: 80, a: { to: [64, 56.2] }, l: { to: [36, 56.1] }, m: { to: [39, 56.1] }, f: 0, g: 0 }
const step0: Pose = { h: [48.5, 25], t: -90, a: [95, 95], l: { to: [46, 51.3] }, m: { to: [52, 51.4] }, f: 0, g: 0 }
const step1: Pose = { ...step0, h: [48.5, 28], l: { to: [44.5, 54] }, f: -28 }
const sit0: Pose = { h: [40, 53.8], t: -90, a: { to: [50, 52] }, l: [0, 0], f: -90 }
const sitKnee: Pose = { h: [40, 53.8], t: -82, a: { to: [50, 40] }, l: { to: [47, 55.6] }, m: [0, 0], f: 0, g: -90 }
const quad0: Pose = { h: [50, 29.6], t: -90, a: [95, 95], l: { to: [50.5, 56.2] }, f: 0 }
const quad1: Pose = { ...quad0, l: [104, -96], m: { to: [50.5, 56.2] }, a: { to: [46.2, 31.5] }, f: -170, g: 0 }
const kneel0: Pose = { h: [46, 39], t: -92, a: { to: [57, 40] }, l: { to: [58, 56.1] }, m: { to: [30, 55.9] }, f: 0, g: 180 }
const kneel1: Pose = { ...kneel0, h: [50, 42], a: { to: [60, 42] } }
const fly0: Pose = { h: [50, 51], t: -90, fr: true, a: { to: [52, 53.5] }, b: { to: [48, 53.5] }, l: { to: [51.5, 55.6], bend: -1 }, m: { to: [48.5, 55.6], bend: 1 }, lk: 0.78, sk: 0.78, f: 180, g: 0 }
const fly1: Pose = { ...fly0, lk: 0.95, sk: 0.9 }
const side0: Pose = { h: [50, 31], t: -90, fr: true, a: [80, 90], b: [100, 90], l: { to: [60, 56.1] }, m: { to: [40, 56.1] } }
const side1: Pose = { ...side0, h: [60, 42], a: { to: [67, 44] }, b: { to: [62, 44] }, l: { to: [70, 56.1] }, m: { to: [36, 56.1] } }
const twist1: Pose = { h: [40, 53.8], t: -95, a: { to: [49.5, 43.5] }, b: { to: [30, 56] }, l: { to: [50, 55.6] }, m: [0, 0], f: 0, g: -90 }
const quadruped: Pose = { h: [38, 41.5], t: 0, a: { to: [55, 56.2] }, l: { to: [25, 55.9] }, f: 180 }
const child: Pose = { h: [31, 46], t: 16, hd: 24, a: { to: [70, 56.2] }, l: { to: [25, 55.9] }, f: 180 }
const cobra0: Pose = { h: [40, 54.2], t: 0, a: { to: [53, 56.3] }, l: [180, 180], f: 168 }
const cobra1: Pose = { ...cobra0, t: -38, hd: -45 }
const arms0: Pose = { h: [50, 30], t: -90, fr: true, a: [92, 90], b: [88, 90], l: { to: [54, 56.1] }, m: { to: [46, 56.1] } }
const arms1: Pose = { ...arms0, a: [-96, 165], b: { to: [54.5, 3.5], bend: 1 } }

export const SEC11_STRETCH: BodyProgram = {
  ex: [
    { name: T('Boldir mushaklari', 'Трицепс голени (икроножные)'), dose: DS,
      cue: T("Qo'llar polda, tovonlar polga bosiladi; yoki oyoq uchi zinapoya chetida, tovon pastga", 'Руки на полу, пятки прижаты к полу; или носок на краю ступеньки, пятка вниз'),
      seg: [{ k: [standing, pike], ...st }, { k: [step0, step1], ...st, sc: [['box', 46, 16, 5]] }] },
    { name: T('Dumba mushagi', 'Ягодичная мышца'), dose: DS,
      cue: T("O'tirib bir tizzani ko'krakka torting, ikkinchi oyoq tekis", 'Сидя, подтяните одно колено к груди, другая нога прямая'),
      seg: [{ k: [sit0, sitKnee], ...st }] },
    { name: T("Sonning to'rt boshli mushagi", 'Четырёхглавая мышца'), dose: DS,
      cue: T("Bir oyoqda turib ikkinchi oyoq panjasini dumbaga torting; yoki bir tizzada turib tosni oldinga suring", 'Стоя на одной ноге, подтяните стопу другой к ягодице; или в выпаде на колене подайте таз вперёд'),
      seg: [{ k: [quad0, quad1], ...st }, { k: [kneel0, kneel1], ...st, sc: [['mat', 20, 70]] }] },
    { name: T('Yaqinlashtiruvchi mushaklar', 'Приводящие мышцы'), dose: DS,
      cue: T("O'tirib oyoq kaftlarini birlashtiring, tizzalarni pastga bosing; yoki yon tomonga keng hamla", 'Сидя, стопы вместе, колени опускайте вниз; или широкий выпад в сторону'),
      seg: [{ k: [fly0, fly1], ...st, sc: [['mat', 26, 74]] }, { k: [side0, side1], ...st }] },
    { name: T('Son, dumba va keng fassiya taranglovchisi', 'Мышцы бедра, ягодиц, напрягатель широкой фасции'), dose: DS2,
      cue: T("O'tirib bir oyoqni ikkinchisi ustidan o'tkazing, tizzani qarama-qarshi qo'l bilan torting va tanani burang", 'Сидя, перекиньте одну ногу через другую, притяните колено противоположной рукой и поверните корпус'),
      seg: [{ k: [sit0, twist1], ...st, sc: [['mat', 20, 70]] }] },
    { name: T('Orqaning yuqori qismi', 'Мышцы верхней части спины'), dose: DS2,
      cue: T("To'rt oyoqda turib tosni tovonlarga qaytaring, qo'llarni polda oldinga cho'zing", 'Из упора на коленях отведите таз к пяткам, руки тянутся по полу вперёд'),
      seg: [{ k: [quadruped, child], ...st, sc: [['mat', 16, 82]] }] },
    { name: T("Orqaning o'rta qismi", 'Мышцы центральной части спины'), dose: DS2,
      cue: T("Qorin bilan yotib qo'llarga tayanib ko'krakni sekin ko'taring", 'Лёжа на животе, опираясь на руки, медленно поднимите грудь'),
      seg: [{ k: [cobra0, cobra1], ...st, sc: [['mat', 8, 80]] }] },
    { name: T("Qo'l mushaklari va biseps", 'Мышцы рук и бицепса'), dose: DS2,
      cue: T("Bir qo'lni bosh orqasiga buking, ikkinchi qo'l bilan tirsakni sekin torting; keyin almashtiring", 'Согните одну руку за головой, другой рукой мягко потяните локоть; затем смените руку'),
      seg: [{ k: [arms0, arms1], ...st }] },
  ],
}

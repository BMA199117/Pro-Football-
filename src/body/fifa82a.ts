import type { Pose } from './pose'
import type { BodyProgram, Scenery } from './program'

/**
 * FIFA part 8.2, section 8 "Stabilisation and strengthening programme" (body weight; source in the
 * book: Mobile, Swiss Federal Office of Sport, Magglingen) and section 9 "General strength
 * programme" (12 stations; source: CardiSport, Dijon). Each exercise has the two positions the
 * book photographs or draws (start and end).
 */
const T = (uz: string, ru: string): [string, string] => [uz, ru]
const DOSE8 = T('2–4 seriya × 20–40 marta (15–60 s), dam 1–2 daqiqa; yoshlarga statik 10–30 s', '2–4 подхода × 20–40 повторов (15–60 с), отдых 1–2 мин; юным — статично 10–30 с')
const DOSE9 = T('Stansiyada 3 × 10 marta yoki aylanmada 2 × 20–30 s', 'На станции 3 × 10 повторов или по кругу 2 × 20–30 с')
const MAT: Scenery = ['mat', 8, 92]

// ---- I. Trunk stability ----
const dorsalA: Pose = { h: [44, 50], t: -12, fc: -1, a: [90, 0], l: { to: [17.6, 56] } }
const dorsalB: Pose = { ...dorsalA, l: [192, 192], m: { to: [17.6, 56] } }
const lateralA: Pose = { h: [46, 44.4], t: -10, fr: true, a: [90, 8], b: { to: [48, 40.5], bend: 1 }, l: { to: [19.5, 56.2] }, m: { to: [20.5, 52] }, f: 175, g: 175 }
const lateralB: Pose = { ...lateralA, m: [196, 196] }
const plankA: Pose = { h: [44, 48.9], t: -8, a: [90, 0], l: { to: [17.6, 55] }, f: 100 }
const plankB: Pose = { ...plankA, l: [189, 189], m: { to: [17.6, 55] }, f: 105, g: 100 }

// ---- II. Arms and shoulder girdle ----
const kneelArmsA: Pose = { h: [38, 42.3], t: 20, hd: 24, a: { to: [71, 56] }, l: { to: [25, 55.9] }, f: 180 }
const kneelArmsB: Pose = { ...kneelArmsA, a: [-6, -6], b: { to: [71, 56] } }
const dipA: Pose = { h: [44, 50], t: -133, hd: -95, a: { to: [30, 56.2] }, l: { to: [66, 56] }, f: 0 }
const dipB: Pose = { h: [43, 54], t: -140, hd: -100, a: { to: [30, 56.2] }, l: { to: [66, 56] }, f: 0 }
const kneePushA: Pose = { h: [46.8, 47.7], t: -36.9, a: { to: [61, 56.2] }, l: [143.1, -125], m: [143.1, -110], f: -150, g: -140 }
const kneePushB: Pose = { ...kneePushA, h: [49.0, 52.3], t: -15 }

// ---- III. Abdominals ----
const crunchA: Pose = { h: [40, 54.2], t: 0, fc: -1, a: [190, 190], l: [-90, 180] }
const crunchB: Pose = { ...crunchA, t: -30, hd: -42, a: [200, 200] }
const obliqueB: Pose = { ...crunchA, t: -26, hd: -36, a: [214, 214], b: { to: [58, 42] } }
const lowerA: Pose = { h: [40, 54.2], t: 0, fc: -1, a: { to: [39, 55.4] }, l: [-90, -78] }
const lowerB: Pose = { h: [41, 50], t: 13, fc: -1, a: { to: [39, 55.4] }, l: [-84, -84] }

// ---- IV. Back ----
const proneA: Pose = { h: [40, 54.2], t: 0, a: [4, 4], l: [180, 180], f: 168 }
const proneB: Pose = { ...proneA, t: -8, hd: -12, a: [-7, -7] }
const supermanB: Pose = { ...proneA, t: -7, hd: -10, a: [-8, -8], l: [187, 187], f: 172 }
const kneelHingeA: Pose = { h: [40, 42.3], t: -80, hd: -84, a: [112, 112], l: { to: [27, 55.9] }, f: 180 }
const kneelHingeB: Pose = { h: [35, 45], t: -6, hd: 12, a: [170, 170], l: { to: [27, 55.9] }, f: 180 }

// ---- V. Legs and glutes ----
const sideLie = (top: Pose['m'], bottom: Pose['l']): Pose => ({
  h: [40, 51.6], t: 0, fr: true, a: [0, -122], b: { to: [52, 55.6], bend: 1 }, l: bottom, m: top, f: 180, g: 180,
})
const adductA = sideLie({ to: [31, 55.8], bend: -1 }, [180, 180])
const adductB = sideLie({ to: [31, 55.8], bend: -1 }, [186, 186])
const abductA = sideLie([179, 179], [181, 172])
const abductB = sideLie([212, 212], [181, 172])
const curlA: Pose = { h: [40, 54.2], t: 0, a: [6, 176], l: [180, -138], m: [180, 180], f: -100, g: 168 }
const curlB: Pose = { ...curlA, l: [180, -86], f: -10 }
const stand: Pose = { h: [50, 29.6], t: -90, a: { to: [53, 31.5] }, l: { to: [50.5, 56.2] }, f: 0 }
const squat: Pose = { h: [45.5, 41], t: -55, hd: -70, a: { to: [48.6, 42.6] }, l: { to: [50.5, 56.1] }, f: 0 }
const oneLegA: Pose = { h: [50, 29.8], t: -88, a: [80, 60], b: [100, 100], l: { to: [50.5, 56.2] }, m: [96, 176], f: 0, g: 160 }
const oneLegB: Pose = { h: [47, 37], t: -68, hd: -80, a: [-18, -18], b: [122, 122], l: { to: [50.5, 56.1] }, m: [122, 172], f: 0, g: 160 }
const calfA: Pose = { h: [58, 29.6], t: -90, a: { to: [71.5, 22] }, l: { to: [58.5, 56.2] }, m: [92, 172], f: 0, g: 150 }
const calfB: Pose = { ...calfA, h: [58, 26.6], l: { to: [58.5, 53.4] }, f: 56 }

export const SEC8_CORE: BodyProgram = {
  ex: [
    { name: T('Dorsal guruh (orqa tomon)', 'Дорсальная группа'), dose: DOSE8, sc: [MAT],
      cue: T("Chalqancha, tirsak va tovonlarga tayanib tanani tekis ko'taring; keyin bir oyoqni ko'taring", 'Лёжа на спине, опора на предплечья и пятки, тело в линию; затем поднимите одну ногу'),
      seg: [{ k: [dorsalA, dorsalB], reps: 3, hold: 0.8 }] },
    { name: T('Lateral guruh (yon tomon)', 'Латеральная группа'), dose: DOSE8, sc: [MAT],
      cue: T("Yonboshlab bilakka tayaning, tana bir chiziqda; yuqoridagi oyoqni ko'tarib tushiring", 'Боковая планка на предплечье, тело в линию; поднимайте и опускайте верхнюю ногу'),
      seg: [{ k: [lateralA, lateralB], reps: 3, hold: 0.8 }] },
    { name: T('Qorin guruhi (old tomon)', 'Брюшная группа'), dose: DOSE8, sc: [MAT],
      cue: T("Bilaklarda planka, bel bukilmaydi; navbatma-navbat bir oyoqni ko'taring", 'Планка на предплечьях, поясница не прогибается; поочерёдно поднимайте ногу'),
      seg: [{ k: [plankA, plankB], reps: 3, hold: 0.8 }] },
  ],
}

export const SEC8_ARMS: BodyProgram = {
  ex: [
    { name: T('Yelka va qo\'llar', 'Плечи и руки'), dose: DOSE8, sc: [MAT],
      cue: T("Tizzada turib qo'llarni polda oldinga cho'zing; navbatma-navbat bir qo'lni ko'tarib ushlab turing", 'Стоя на коленях, руки вытянуты вперёд по полу; поочерёдно поднимайте одну руку'),
      seg: [{ k: [kneelArmsA, kneelArmsB], reps: 3, hold: 0.8 }] },
    { name: T('Qo\'llar (triseps)', 'Руки (трицепсы)'), dose: DOSE8, sc: [MAT],
      cue: T("Orqada qo'llarga tayanib o'tiring, tizzalar bukilgan; tirsaklarni bukib-yozib tanani tushiring va ko'taring", 'Упор сзади, колени согнуты; сгибая и разгибая локти, опускайте и поднимайте корпус'),
      seg: [{ k: [dipA, dipB], reps: 3 }] },
    { name: T('Qo\'llar (biseps)', 'Руки (бицепсы)'), dose: DOSE8, sc: [MAT],
      cue: T("Tizzalarga tayanib qo'llarda turing, boldirlar yuqorida; tirsaklarni bukib tanani tekis tushiring", 'Упор на коленях и руках, голени подняты; сгибая руки, опускайте корпус ровно'),
      seg: [{ k: [kneePushA, kneePushB], reps: 3 }] },
  ],
}

export const SEC8_ABS: BodyProgram = {
  ex: [
    { name: T('Yuqori qorin presi', 'Верхний пресс'), dose: DOSE8, sc: [MAT],
      cue: T("Chalqancha, oyoqlar 90° ko'tarilgan; yelkalarni ko'tarib qo'llarni tizzalarga cho'zing", 'Лёжа на спине, ноги подняты под 90°; поднимайте плечи, тянитесь руками к коленям'),
      seg: [{ k: [crunchA, crunchB], reps: 3 }] },
    { name: T('Yon qorin presi', 'Боковой пресс'), dose: DOSE8, sc: [MAT],
      cue: T("Xuddi shunday, lekin yelkani qarama-qarshi tizza tomon burib ko'taring", 'То же, но поднимайте плечо по диагонали к противоположному колену'),
      seg: [{ k: [crunchA, obliqueB], reps: 3 }] },
    { name: T('Pastki qorin presi', 'Нижний пресс'), dose: DOSE8, sc: [MAT],
      cue: T("Chalqancha, oyoqlar tik yuqorida; tos suyagini poldan biroz ko'tarib oyoqlarni shiftga itaring", 'Лёжа на спине, ноги вверх; слегка отрывайте таз от пола, толкая ноги к потолку'),
      seg: [{ k: [lowerA, lowerB], reps: 3 }] },
  ],
}

export const SEC8_BACK: BodyProgram = {
  ex: [
    { name: T('Orqa', 'Спина'), dose: DOSE8, sc: [MAT],
      cue: T("Qorin bilan yoting, qo'llar oldinda; qo'llar va ko'krakni biroz ko'tarib tushiring", 'Лёжа на животе, руки вперёд; слегка поднимайте руки и грудь'),
      seg: [{ k: [proneA, proneB], reps: 3, hold: 0.7 }] },
    { name: T('Orqa va dumba', 'Спина и ягодицы'), dose: DOSE8, sc: [MAT],
      cue: T("Qorin bilan yotib qo'llar va oyoqlarni bir vaqtda ko'taring", 'Лёжа на животе, одновременно поднимайте руки и ноги'),
      seg: [{ k: [proneA, supermanB], reps: 3, hold: 0.7 }] },
    { name: T('Orqa va bel', 'Спина и поясница'), dose: DOSE8, sc: [MAT],
      cue: T("Tizzada tik turing, qo'llar orqada; belni tekis tutib tanani oldinga egib qaytaring", 'Стоя на коленях, руки назад; с прямой спиной наклоняйте корпус вперёд и возвращайте'),
      seg: [{ k: [kneelHingeA, kneelHingeB], reps: 3 }] },
  ],
}

export const SEC8_LEGS: BodyProgram = {
  ex: [
    { name: T('Yaqinlashtiruvchi mushaklar', 'Приводящие мышцы'), dose: DOSE8, sc: [MAT],
      cue: T("Yonboshlab yoting, ustki oyoq oldinda polda; pastki oyoqni yuqoriga ko'taring", 'Лёжа на боку, верхняя нога впереди на полу; поднимайте нижнюю ногу'),
      seg: [{ k: [adductA, adductB], reps: 3 }] },
    { name: T('Uzoqlashtiruvchi mushaklar', 'Отводящие мышцы'), dose: DOSE8, sc: [MAT],
      cue: T("Yonboshlab yoting; ustki oyoqni tekis holda yuqoriga ko'tarib tushiring", 'Лёжа на боку; поднимайте и опускайте прямую верхнюю ногу'),
      seg: [{ k: [abductA, abductB], reps: 3 }] },
    { name: T('Son orqa mushaklari', 'Задние мышцы бедра'), dose: DOSE8, sc: [MAT],
      cue: T("Qorin bilan yotib bir oyoqni tizzadan bukib tovonni dumbaga torting", 'Лёжа на животе, сгибайте ногу в колене, подтягивая пятку к ягодице'),
      seg: [{ k: [curlA, curlB], reps: 3 }] },
    { name: T('Oyoq yozuvchi mushaklari', 'Разгибающие мышцы ног'), dose: DOSE8,
      cue: T("Qo'llar belda, o'tirib-turish; keyin bir oyoqda tizzani bukish, qo'llar muvozanat uchun", 'Руки на поясе, приседания; затем сгибание колена на одной ноге, руки помогают балансу'),
      seg: [{ k: [stand, squat], reps: 2, label: T("Ikki oyoqda", 'На двух ногах') }, { k: [oneLegA, oneLegB], reps: 2, label: T('Bir oyoqda', 'На одной ноге') }] },
    { name: T('Oyoq panjasini yozuvchi mushaklar', 'Разгибающие мышцы стопы'), dose: DOSE8, flip: true, sc: [['bars', 72]],
      cue: T("Gimnastika devoriga ushlab bir oyoqda turing; oyoq uchiga ko'tarilib tushing", 'Держась за шведскую стенку, стоя на одной ноге, поднимайтесь на носок'),
      seg: [{ k: [calfA, calfB], reps: 3, hold: 0.6 }] },
  ],
}

// ---- Section 9: general strength, 12 stations ----
const barHold = (p: Pose): Pose => ({ ...p, o: [['bar', 'neck', -1.5, -1.5]] })
const s1A = barHold({ h: [50, 29.6], t: -90, a: [102, -62], l: { to: [50.5, 56.2] }, f: 0 })
const s1B = barHold({ h: [46.5, 37.5], t: -66, hd: -80, a: [124, -40], l: { to: [50.5, 56.1] }, f: 0 })
const s2A: Pose = { h: [52, 54.2], t: 180, a: { to: [31, 50.5] }, l: [-52, -2] }
const s2B: Pose = { h: [52, 54.2], t: -150, hd: -138, a: { to: [33, 40] }, l: [-52, -2] }
const s3A: Pose = { h: [58, 41.3], t: 180, a: { to: [43, 35.5] }, l: { to: [76, 56.1] }, f: 0, o: [['bar', 'hands']] }
const s3B: Pose = { h: [58, 41.3], t: 180, a: [-90, -90], l: { to: [76, 56.1] }, f: 0, o: [['bar', 'hands']] }
const s4A = barHold({ h: [48.5, 30.2], t: -86, a: [102, -62], l: { to: [62, 46.2] }, m: { to: [47.5, 56.1] }, f: 0, g: 0 })
const s4B = barHold({ h: [60.5, 20.2], t: -90, a: [102, -62], l: { to: [62, 46.3] }, m: [102, 160], f: 0, g: 110 })
const s5A: Pose = { h: [45, 34.3], t: 118, fc: -1, a: [95, 95], l: [1, 1], o: [['dumb', 'hand']] }
const s5B: Pose = { h: [45, 34.3], t: 180, fc: -1, a: [186, 186], l: [1, 1], o: [['dumb', 'hand']] }
const s6A: Pose = { h: [55, 40.3], t: 180, fc: -1, a: { to: [33, 47] }, l: [0, 0], o: [['disc', 'foot', 1, -3.2]] }
const s6B: Pose = { ...s6A, l: [0, -82] }
const s7A: Pose = { h: [48, 29.6], t: -90, a: { to: [55, 17] }, l: { to: [48.5, 56.2] }, f: 0, o: [['disc', 'neck', -1, -3]] }
const s7B: Pose = { ...s7A, h: [48, 26.8], a: { to: [55, 14.2] }, l: { to: [48.5, 53.4] }, f: 56 }
const wiper = (ang: number, k: number): Pose => ({ h: [50, 40], t: -90, fr: true, hd: -90, a: [0, 0], b: [180, 180], l: [ang, ang], m: [ang, ang], lk: k, sk: k, f: ang, g: ang })
const s8L = wiper(18, 0.95), s8M = wiper(90, 0.28), s8R = wiper(162, 0.95)
const seatPose = (l: Pose['l'], m: Pose['m']): Pose => ({ h: [50, 40], t: -90, fr: true, a: { to: [59, 42], bend: -1 }, b: { to: [41, 42], bend: 1 }, l, m, lk: 0.55, f: 90, g: 90 })
const s9A: Pose = { h: [50, 40], t: -90, fr: true, a: [-80, -80], b: [-100, -100], l: { to: [57, 56.1] }, m: { to: [43, 56.1] }, o: [['rod', 'hands', 19, 0]] }
const s9B: Pose = { ...s9A, a: { to: [60, 21], bend: 1 }, b: { to: [40, 21], bend: -1 } }
const s10A = seatPose([18, 82], [162, 98])
const s10B = seatPose([58, 90], [122, 90])
const s12A: Pose = { h: [58, 41.3], t: 180, a: [-90, -90], l: { to: [76, 56.1] }, f: 0, o: [['dumb', 'hands']] }
const s12B: Pose = { ...s12A, a: [-163, -170] }

export const SEC9_STATIONS: BodyProgram = {
  ex: [
    { name: T('Oyoqlar: yarim o\'tirib-turish', 'Ноги: ½ приседания'), dose: DOSE9, sc: [['arrow', [66, 14], [66, 26]]],
      cue: T("Shtanga yelkada, orqa tekis; yarim o'tirib turing", 'Штанга на плечах, спина прямая; полуприседания'),
      seg: [{ k: [s1A, s1B], reps: 2 }] },
    { name: T('Qorin presi: yelkalarni bukish', 'Пресс: скручивание'), dose: DOSE9, sc: [['bench', 60, 24, 14], ['arrow', [24, 50], [32, 36], [22, 40]]],
      cue: T("Boldirlar skameykada; yelkalarni yumaloqlab ko'taring (10 kg yuk bilan ham)", 'Голени на скамье; скручивание с круглой спиной (также с отягощением 10 кг)'),
      seg: [{ k: [s2A, s2B], reps: 2 }] },
    { name: T("Qo'llar, tana: yotib siqish", 'Руки, торс: жим лёжа'), dose: DOSE9, sc: [['bench', 30, 40, 13], ['arrow', [52, 32], [52, 22]]],
      cue: T("Skameykada yotib shtangani ko'krakdan yuqoriga itaring", 'Лёжа на скамье, выжимайте штангу от груди вверх'),
      seg: [{ k: [s3A, s3B], reps: 2 }] },
    { name: T('Oyoqlar: yuk bilan qadam', 'Ноги: шаги с нагрузкой'), dose: DOSE9, sc: [['box', 56, 18, 10], ['arrow', [40, 42], [52, 24], [40, 28]]],
      cue: T("Shtanga yelkada; bir oyoq bilan qutiga chiqib tushing, oyoqlarni almashtiring", 'Штанга на плечах; шаг на тумбу одной ногой и обратно, смена ног'),
      seg: [{ k: [s4A, s4B], reps: 2 }] },
    { name: T('Bel: tanani ko\'tarish', 'Поясница: подъём туловища'), dose: DOSE9, sc: [['bench', 40, 36, 20], ['arrow', [22, 52], [18, 34], [14, 46]]],
      cue: T("Skameykada qorin bilan yotib tanani ko'taring va tushiring, qo'llar yon tomonda (3–5 kg gantel bilan ham)", 'Лёжа на скамье животом вниз, поднимайте и опускайте туловище, руки в стороны (также с гантелями 3–5 кг)'),
      seg: [{ k: [s5A, s5B], reps: 2 }] },
    { name: T('Son orqa mushaklari: oyoqni bukish', 'Задние мышцы бедра: сгибание ног'), dose: DOSE9, sc: [['curl', 30], ['arrow', [84, 36], [74, 22], [86, 24]]],
      cue: T("Trenajyorda qorin bilan yotib ikkala oyoqni birga yuqoriga buking", 'Лёжа на тренажёре, сгибайте обе ноги одновременно вверх'),
      seg: [{ k: [s6A, s6B], reps: 2 }] },
    { name: T("Boldir: oyoq uchiga ko'tarilish", 'Икры: подъём на носках'), dose: DOSE9, sc: [['calf', 48], ['arrow', [36, 30], [36, 20]]],
      cue: T("Yelkada yostiqcha, oyoq uchida ko'tarilib sekin tushing", 'Плечи под упором, поднимайтесь на носки и медленно опускайтесь'),
      seg: [{ k: [s7A, s7B], reps: 3, hold: 0.6 }] },
    { name: T('Qorin yon mushaklari: «dvorniklar»', 'Косые мышцы: «дворники»'), dose: DOSE9, top: true, sc: [['arrow', [30, 52], [70, 52], [50, 64]]],
      cue: T("Chalqancha, qo'llar yonga yoyilgan; tik ko'tarilgan oyoqlarni o'ngga va chapga tushiring (sherik bilan yoki sheriksiz)", 'Лёжа на спине, руки в стороны; опускайте поднятые ноги вправо и влево (с партнёром или без)'),
      seg: [{ k: [s8L, s8M, s8R], reps: 2, mv: 1.1 }] },
    { name: T("Orqa, yelka: qo'llarni bukish", 'Спина, плечи: сгибание рук'), dose: DOSE9, sc: [['pull', 50], ['arrow', [72, 8], [72, 22]]],
      cue: T("Trenajyorda o'tirib dastakni ko'krak tomon pastga torting", 'Сидя в тренажёре, тяните рукоять вниз к груди'),
      seg: [{ k: [s9A, s9B], reps: 2 }] },
    { name: T('Yaqinlashtiruvchi mushaklar', 'Приводящие мышцы'), dose: T('3 × 10 marta, yengil qarshilik (maksimalning ~30%)', '3 × 10 повторов, лёгкое сопротивление (~30% от макс.)'), sc: [['seat', 50], ['arrow', [72, 50], [60, 50]], ['arrow', [28, 50], [40, 50]]],
      cue: T("Trenajyorda o'tirib oyoqlarni birlashtiring va ajrating", 'Сидя в тренажёре, сводите и разводите ноги'),
      seg: [{ k: [s10A, s10B], reps: 2 }] },
    { name: T('Uzoqlashtiruvchi mushaklar', 'Отводящие мышцы'), dose: DOSE9, sc: [['seat', 50], ['arrow', [60, 50], [72, 50]], ['arrow', [40, 50], [28, 50]]],
      cue: T("Trenajyorda o'tirib oyoqlarni ajrating va birlashtiring", 'Сидя в тренажёре, разводите и сводите ноги'),
      seg: [{ k: [s10B, s10A], reps: 2 }] },
    { name: T("Ko'krak mushaklari, qo'llar", 'Грудные мышцы, руки'), dose: DOSE9, sc: [['bench', 30, 40, 13], ['arrow', [44, 18], [22, 32], [26, 16]]],
      cue: T("Skameykada yotib gantelni ko'krak ustidan bosh orqasiga olib boring va qaytaring", 'Лёжа на скамье, переносите гантель из-за головы и обратно (пуловер)'),
      seg: [{ k: [s12A, s12B], reps: 2 }] },
  ],
}

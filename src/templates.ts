import type { Template, Phase } from './types'

type Row = [id: string, ages: string, group: string, source: string, title: [string, string], focus: [string, string], warm: string[], main: string[], game: string[]]

/**
 * Ready session plans, taken week by week from the books.
 * EPYSA U6–U12 season plans: technical warm-up → small-sided activities → game (same order as the book).
 * The closing game of each week goes at the end of the main part (the books have no separate cool-down).
 * 15–17: sessions built from the FIFA part 8.2 physical exercises, grouped by the quality they train.
 */
const ROWS: Row[] = [
  // EPYSA U6 — game at the end of each week: 3×3
  ['u6w1', '5–6', 'U6', 'epysa6', ['1-hafta: oyoqning barcha qismlari', 'Неделя 1: все части стопы'],
    ["To'pni oyoqning turli qismlari bilan olib yurish va to'xtatish", 'Ведение и остановка мяча разными частями стопы'], ['e6-1'], ['e6-2', 'e6-3'], ['e6-14']],
  ['u6w2', '5–6', 'U6', 'epysa6', ["2-hafta: olib yurish va zarba", 'Неделя 2: ведение и удар'],
    ["Bo'sh joyga olib yurish, nishonga aniq tepish", 'Ведение в свободное место, точный удар в цель'], ['e6-4'], ['e6-5', 'e6-6'], ['e6-14']],
  ['u6w3', '5–6', 'U6', 'epysa6', ['3-hafta: nazorat va aniqlik', 'Неделя 3: контроль и точность'],
    ["To'pni tananing qismlari bilan to'xtatish, konuslarni urib yiqitish", 'Остановка мяча частями тела, удары по фишкам'], ['e6-7'], ['e6-8', 'e6-9'], ['e6-14']],
  ['u6w4', '5–6', 'U6', 'epysa6', ["4-hafta: yo'nalish o'zgartirish", 'Неделя 4: смена направления'],
    ["Darvozachalar orqali olib yurish, quvlashda to'pni saqlash", 'Ведение через воротца, сохранение мяча в пятнашках'], ['e6-10'], ['e6-11', 'e6-3'], ['e6-14']],
  ['u6w5', '5–6', 'U6', 'epysa6', ["5-hafta: to'pni himoya qilish", 'Неделя 5: укрывание мяча'],
    ["Raqib yaqinida to'pni saqlab olib yurish", 'Ведение с сохранением мяча рядом с соперником'], ['e6-1'], ['e6-12', 'e6-13'], ['e6-14']],
  // EPYSA U8 — game: 4×4
  ['u8w1', '7–8', 'U8', 'epysa8', ["1-hafta: to'p bilan erkin harakat", 'Неделя 1: свободное ведение'],
    ["Oyoqning barcha qismlari, boshni ko'tarib olib yurish", 'Все части стопы, ведение с поднятой головой'], ['e6-1'], ['e8-1', 'e6-13'], ['e8-10']],
  ['u8w2', '7–8', 'U8', 'epysa8', ["2-hafta: to'pni saqlash", 'Неделя 2: сохранение мяча'],
    ["Quvlashda to'pni yopish, 2×2 to'rt darvozaga", 'Укрывание мяча в пятнашках, 2×2 на четверо ворот'], ['e8-2'], ['e8-3', 'e8-4'], ['e8-10']],
  ['u8w3', '7–8', 'U8', 'epysa8', ["3-hafta: bo'sh joyni ko'rish", 'Неделя 3: видеть свободное место'],
    ["Rangli zonalar bo'ylab olib yurish va 1×1, 2×2 o'yinlar", 'Ведение по цветным зонам и игры 1×1, 2×2'], ['e8-5'], ['e6-11', 'e6-3'], ['e8-10']],
  ['u8w4', '7–8', 'U8', 'epysa8', ['4-hafta: zarba va aniqlik', 'Неделя 4: удар и точность'],
    ["To'pni uzoqqa va aniq tepish", 'Сильный и точный удар по мячу'], ['e8-6'], ['e6-5', 'e6-3'], ['e8-10']],
  ['u8w5', '7–8', 'U8', 'epysa8', ['5-hafta: pas berish', 'Неделя 5: передача'],
    ["Juftlikda pas, uzluksiz 2×2", 'Передачи в парах, непрерывные 2×2'], ['e6-6'], ['e8-7', 'e8-8'], ['e8-10']],
  ['u8w6', '7–8', 'U8', 'epysa8', ['6-hafta: himoyachilar bilan pas', 'Неделя 6: передачи с защитниками'],
    ["Darvozachalar orqali olib yurish va pas, himoyachi qo'shiladi", 'Ведение и передачи через воротца, добавляется защитник'], ['e6-10'], ['e8-7', 'e8-9'], ['e8-10']],
  ['u8w7', '7–8', 'U8', 'epysa8', ['7-hafta: nishonga pas', 'Неделя 7: передача в цель'],
    ["Konuslarni urib yiqitish, juftlikda va 2×2 da", 'Сбей фишки, в парах и в игре 2×2'], ['e6-8'], ['e8-8'], ['e8-10']],
  ['u8w8', '7–8', 'U8', 'epysa8', ['8-hafta: takrorlash', 'Неделя 8: повторение'],
    ["Olib yurish, zonalar va 2×2 to'rt darvozaga", 'Ведение, зоны и 2×2 на четверо ворот'], ['e6-1'], ['e8-5', 'e8-4'], ['e8-10']],
  // EPYSA U10 — game: 7×7 by formation
  ['u10w1', '9–10', 'U10', 'epysa10', ["1-hafta: dribling va 1×1", 'Неделя 1: дриблинг и 1×1'],
    ["Fintlar, oxirgi zonaga olib kirish, katta va kichik darvozalar", 'Финты, проход в конечную зону, большие и малые ворота'], ['e10-1'], ['e10-2', 'e10-3'], ['e10-28']],
  ['u10w2', '9–10', 'U10', 'epysa10', ["2-hafta: ko'pchilikda hujum", 'Неделя 2: атака в большинстве'],
    ["2×0 kombinatsiya, 3×2, 5×5 darvozalarga", 'Комбинация 2×0, 3×2, 5×5 на ворота'], ['e10-4'], ['e10-5', 'e10-6'], ['e10-28']],
  ['u10w3', '9–10', 'U10', 'epysa10', ['3-hafta: pas va birinchi teginish', 'Неделя 3: передача и первое касание'],
    ["Ketma-ket paslar, 3×3+1, 4×4 qarshi darvozalar bilan", 'Последовательные передачи, 3×3+1, 4×4 с контрворотами'], ['e10-7'], ['e10-8', 'e10-9'], ['e10-28']],
  ['u10w4', '9–10', 'U10', 'epysa10', ["4-hafta: to'pni saqlash", 'Неделя 4: владение мячом'],
    ["Pas berib joyida qolish, konusni yiqitish, paslar soni", 'Отдал — остаёшься, сбей фишку, число передач'], ['e10-10'], ['e10-11', 'e10-12'], ['e10-28']],
  ['u10w5', '9–10', 'U10', 'epysa10', ['5-hafta: zarba', 'Неделя 5: удар по воротам'],
    ["Raqamli zarbalar, darvozabonlar bilan 2×2 va 5×5", 'Удары по номерам, 2×2 и 5×5 с вратарями'], ['e10-13'], ['e10-14', 'e10-15'], ['e10-28']],
  ['u10w6', '9–10', 'U10', 'epysa10', ['6-hafta: himoya 1×1', 'Неделя 6: отбор 1×1'],
    ["Juftlikda himoya texnikasi, 2×2, 4×4", 'Техника отбора в парах, 2×2, 4×4'], ['e10-16'], ['e10-17', 'e10-18'], ['e10-28']],
  ['u10w7', '9–10', 'U10', 'epysa10', ['7-hafta: juft himoya', 'Неделя 7: защита в паре'],
    ["4×2 egallash, 3×3 va 5×5 da sug'urta", '4×2 владение, страховка в 3×3 и 5×5'], ['e10-19'], ['e10-20', 'e10-21'], ['e10-28']],
  ['u10w8', '9–10', 'U10', 'epysa10', ['8-hafta: darvozabon', 'Неделя 8: вратарь'],
    ["Darvozabonlar maydon o'yinchilari orasida, 4×4 darvozalarga", 'Вратари среди полевых, 4×4 на ворота'], ['e10-22'], ['e10-23', 'e10-24'], ['e10-28']],
  ['u10w9', '9–10', 'U10', 'epysa10', ['9-hafta: dribling bilan gol', 'Неделя 9: гол ведением'],
    ["Yaqin masofada olib yurish, 3×3 to'rt darvozachaga", 'Ведение вплотную, 3×3 на четверо воротец'], ['e10-25'], ['e10-26', 'e10-9'], ['e10-28']],
  ['u10w10', '9–10', 'U10', 'epysa10', ['10-hafta: festival', 'Неделя 10: фестиваль'],
    ["4×4 festivali: to'rt xil o'yin", 'Фестиваль 4×4: четыре игры'], [], ['e10-27'], ['e10-28']],
  // EPYSA U12 — game: 9×9 / 8×8 by formation
  ['u12w1', '11–12', 'U12', 'epysa12', ["1-hafta: ko'pchilikda hujum", 'Неделя 1: атака в большинстве'],
    ["Devor bilan kombinatsiya, 3×2, 7×7 katta va kichik darvozalar", 'Комбинация со стенкой, 3×2, 7×7 на большие и малые ворота'], ['e10-4'], ['e10-5', 'e12-1'], ['e12-20']],
  ['u12w2', '11–12', 'U12', 'epysa12', ['2-hafta: dribling zonalarda', 'Неделя 2: дриблинг по зонам'],
    ["Zonani almashtirish, dribling bilan gol, 5×5 uch zonada", 'Смена зон, гол ведением, 5×5 в трёх зонах'], ['e12-2'], ['e12-3', 'e12-4'], ['e12-20']],
  ['u12w3', '11–12', 'U12', 'epysa12', ['3-hafta: oshirma pas', 'Неделя 3: навесная передача'],
    ["H.O.R.S.E., nishon o'yinchiga, 6×6 oshirma bilan", 'H.O.R.S.E., на игрока-мишень, 6×6 с навесами'], ['e12-5'], ['e12-6', 'e12-7'], ['e12-20']],
  ['u12w4', '11–12', 'U12', 'epysa12', ['4-hafta: zarba', 'Неделя 4: удар'],
    ["Konusni urib yiqitish, 4×4 to'rt darvozaga, 5×5", 'Сбей фишку, 4×4 на четверо ворот, 5×5'], ['e12-8'], ['e10-23', 'e12-9'], ['e12-20']],
  ['u12w5', '11–12', 'U12', 'epysa12', ['5-hafta: uzoqdan zarba', 'Неделя 5: удар издали'],
    ["Zarba texnikasi, uch ochkolik chiziq", 'Техника удара, линия трёх очков'], ['e12-10'], ['e12-11', 'e12-12'], ['e12-20']],
  ['u12w6', '11–12', 'U12', 'epysa12', ['6-hafta: juftlikda hujum', 'Неделя 6: атака в паре'],
    ["Juftlikda hujum, 2×2+1, 4×4 qarshi darvozalar bilan", 'Атака в парах, 2×2+1, 4×4 с контрворотами'], ['e12-13'], ['e12-14', 'e10-9'], ['e12-20']],
  ['u12w7', '11–12', 'U12', 'epysa12', ['7-hafta: himoya 1×1', 'Неделя 7: отбор 1×1'],
    ["Juftlikda himoya texnikasi, 2×2, 4×4", 'Техника отбора в парах, 2×2, 4×4'], ['e10-16'], ['e10-17', 'e10-18'], ['e12-20']],
  ['u12w8', '11–12', 'U12', 'epysa12', ['8-hafta: guruh himoyasi', 'Неделя 8: групповая защита'],
    ["Konusni himoya qilish, 3×3 va 4×4 to'rt darvozaga", 'Защити фишку, 3×3 и 4×4 на четверо ворот'], ['e12-15'], ['e12-16', 'e12-17'], ['e12-20']],
  ['u12w9', '11–12', 'U12', 'epysa12', ['9-hafta: darvozabon', 'Неделя 9: вратарь'],
    ["Darvozabonlar maydon o'yinchilari bilan, 4×4 darvozalarga", 'Вратари с полевыми, 4×4 на ворота'], ['e10-22'], ['e10-23', 'e10-24'], ['e12-20']],
  ['u12w10', '11–12', 'U12', 'epysa12', ['10-hafta: darvozabon va zarba', 'Неделя 10: вратарь и удар'],
    ["Siljib ushlash, 2×1 darvozabonlar bilan, 4×4 katta darvozaga", 'Перемещение и ловля, 2×1 с вратарями, 4×4 на большие ворота'], ['e12-18'], ['e12-19', 'e10-24'], ['e12-20']],
  // FIFA 8.2 — 15–17
  ['f82s1', '15–17', 'U16', 'fifa82', ['Aerob chidamlilik', 'Аэробная выносливость'],
    ["Koordinatsiya, to'p bilan aylana, 6×6 fartlek", 'Координация, круг с мячом, игра 6×6 (фартлек)'], ['f82-25'], ['f82-2', 'f82-4'], []],
  ['f82s2', '15–17', 'U16', 'fifa82', ['Aerob quvvat', 'Аэробная мощность'],
    ["Texnik intervallar, 4×4 maksimal aerob quvvat", 'Технические интервалы, 4×4 максимальная аэробная мощность'], ['f82-13'], ['f82-5', 'f82-12'], []],
  ['f82s3', '15–17', 'U16', 'fifa82', ['Tezlik', 'Скорость'],
    ["To'p bilan tezlik, yakunlash bilan tezlik, qarshi hujum", 'Скорость с мячом, с завершением, контратака'], ['f82-14'], ['f82-16', 'f82-17', 'f82-20'], []],
  ['f82s4', '15–17', 'U16', 'fifa82', ['Laktat chidamlilik', 'Лактатная выносливость'],
    ["Maxsus intervallar va 1×1", 'Специальные интервалы и 1×1'], ['f82-25'], ['f82-21', 'f82-23'], []],
  ['f82s5', '15–17', 'U16', 'fifa82', ['Koordinatsiya stansiyalari', 'Координационные станции'],
    ["To'rt stansiya, keyin 5×5 o'yin", 'Четыре станции, затем игра 5×5'], ['f82-25', 'f82-26'], ['f82-27', 'f82-28', 'f82-11'], []],
]

export const TEMPLATE_AGES = ['5–6', '7–8', '9–10', '11–12', '15–17']

export const TEMPLATES: Template[] = ROWS.map(([id, ages, group, source, title, focus, warm, main, game]) => ({
  id, ages, group, source,
  title: { uz: title[0], ru: title[1] }, focus: { uz: focus[0], ru: focus[1] },
  phases: { warm, main: [...main, ...game], cool: [] } as Record<Phase, string[]>,
}))

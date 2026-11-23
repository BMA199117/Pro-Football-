/** Qualities a drill develops (shown as chips under "Nima uchun foydali"). */
export const SKILLS = {
  drib: ["To'p bilan yurish va dribling", 'Ведение и дриблинг'],
  pass: ['Pas berish', 'Передача мяча'],
  touch: ["To'pni qabul qilish", 'Приём мяча'],
  shoot: ['Zarba va yakunlash', 'Удар и завершение'],
  cross: ['Oshirma va uzun pas', 'Навес и длинная передача'],
  head: ["Bosh bilan o'yin", 'Игра головой'],
  duel: ['Yakkama-yakka kurash (1×1)', 'Единоборство 1×1'],
  vision: ["Atrofni ko'rish (skanerlash)", 'Обзор (сканирование)'],
  decide: ['Tez qaror qabul qilish', 'Быстрые решения'],
  position: ['Joy tanlash', 'Выбор позиции'],
  support: ['Ochilish va yordam', 'Открывание и поддержка'],
  team: ["Jamoaviy o'yin", 'Командная игра'],
  press: ['Pressing', 'Прессинг'],
  defend: ['Himoya', 'Оборона'],
  trans: ["Hujum va himoyaga tez o'tish", 'Быстрый переход атака–оборона'],
  speed: ['Tezlik', 'Скорость'],
  agil: ['Chaqqonlik', 'Ловкость'],
  coord: ['Koordinatsiya va muvozanat', 'Координация и баланс'],
  react: ['Reaksiya', 'Реакция'],
  endur: ['Chidamlilik', 'Выносливость'],
  power: ['Kuch va sakrash', 'Сила и прыгучесть'],
  focus: ['Diqqat', 'Внимание'],
  joy: ["Zavq va o'ziga ishonch", 'Удовольствие и уверенность'],
  comm: ['Muloqot', 'Общение на поле'],
  gk: ['Darvozabon texnikasi', 'Техника вратаря'],
  core: ['Tana (korpus) mushaklari', 'Мышцы корпуса'],
  flex: ['Egiluvchanlik', 'Гибкость'],
  injury: ['Jarohatlar profilaktikasi', 'Профилактика травм'],
} as const

export type SkillKey = keyof typeof SKILLS
/** [qualities, why (uz), why (ru)] */
export type Benefit = [SkillKey[], string, string]

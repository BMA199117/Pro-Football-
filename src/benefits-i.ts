import type { Benefit } from './skills'

/** Why each drill from De Zerbi / The Art of Defending / Vertical Play in 4-2-3-1 (Professional section) is useful. */
export const BENEFITS_I: Record<string, Benefit> = {
  'dz-8': [['support', 'vision', 'team'], "Uchinchi o'yinchi g'oyasi butun jamoaga singadi: kim beradi, kim qabul qiladi, kim yugurib kiradi.", 'Идея третьего игрока становится общей: кто отдаёт, кто принимает, кто вбегает.'],
  'dz-18': [['pass', 'position', 'trans'], "Markaziy himoyachilar va tayanchlar «quti»da bir-birini his qilib, bosim ostida to'pni oldinga olib chiqadi.", 'Центральные и опорные в «коробке» чувствуют друг друга и выводят мяч вперёд под прессингом.'],
  'dz-19': [['pass', 'gk', 'decide'], "Darvozabondan boshlab yuqori pressingni yorish va hujumchiga to'pni yetkazish — De Dzerbi uslubining asosi.", 'Пройти высокий прессинг от вратаря и доставить мяч нападающему — основа стиля Де Дзерби.'],
  'dz-20': [['pass', 'touch', 'support'], "«S-kombinatsiya» avtomatizmga aylanadi: tushish, diagonal va bir teginishda o'yin.", '«S-комбинация» доводится до автоматизма: опускание, диагональ и игра в одно касание.'],
  'dz-22': [['support', 'pass', 'trans'], "«Qum soati» shakli markaz orqali o'ynashga o'rgatadi, keyin son ustunligida tez yakunlash.", 'Форма «песочные часы» учит играть через центр, затем быстро завершать в большинстве.'],
  'dz-23': [['pass', 'position', 'press'], "2-4-2-2 tuzilmasidagi vazifalar o'zlashtiriladi: bosimdan chiqib, hujumkor yarim himoyachini topish.", 'Осваиваются роли в 2-4-2-2: выйти из-под прессинга и найти атакующего полузащитника.'],
  'dz-35': [['pass', 'shoot', 'support'], "Past blokka qarshi markaziy naqsh: vertikal pas, qaytarish va jarima maydoniga yugurishlar.", 'Центральная схема против низкого блока: вертикаль, скидка и забегания в штрафную.'],
  'dz-38': [['pass', 'shoot', 'speed'], "Himoya ortiga oshirma va o'z vaqtida yugurish — zich himoyani yorishning yana bir yo'li.", 'Заброс за спину и своевременный рывок — ещё один способ вскрыть плотную оборону.'],
  'ad-7': [['press', 'defend', 'vision'], "Qachon va qayerda bosish kerakligini tanib olish: pas yo'llarini yopish va to'pni ilib olish.", 'Учатся понимать, когда и где прессинговать: закрывать линии и перехватывать.'],
  'ad-8': [['press', 'trans', 'team'], "Yo'qotgan zahoti bosim odatga aylanadi: eng yaqin to'rt kishi darhol hujum qiladi.", 'Прессинг сразу после потери становится привычкой: ближайшие четверо атакуют мяч.'],
  'ad-9': [['press', 'trans', 'comm'], "To'pni yo'qotgan joyning o'zida, 3 ta pas ichida qaytarib olish — kontrpressingning mohiyati.", 'Вернуть мяч там же, за 3 передачи соперника, — суть контрпрессинга.'],
  'ad-13': [['defend', 'team', 'comm'], "Past blokda jamoaviy bosim: ikki kishi to'pga, uchinchisi pas yo'liga — raqib orqaga o'ynaydi.", 'Коллективный прессинг в низком блоке: двое на мяч, третий на линию — соперник играет назад.'],
  'ad-15': [['defend', 'position', 'team'], "Har kim o'z zonasida, lekin to'rtlik bir chiziq bo'lib suriladi — ixcham himoya.", 'Каждый в своей зоне, но четвёрка смещается одной линией — компактная оборона.'],
  'ad-17': [['defend', 'team', 'vision'], "Qanot almashganda butun blok birga suriladi, uzoq tomonda bo'shliq qolmaydi.", 'При смене фланга весь блок смещается вместе, на дальней стороне не остаётся бреши.'],
  'ad-23': [['defend', 'duel', 'decide'], "Ozchilikda qarshi hujumni to'xtatish: sekinlashtirish, markazni himoya qilish va sheriklarni kutish.", 'Остановить контратаку в меньшинстве: задержать, защитить центр, дождаться партнёров.'],
  'ad-26': [['defend', 'head', 'gk'], "Oshirmalarni himoya qilish: 3+1 tuzilmasi, hujumchi va darvoza orasida turish, to'pni tozalash.", 'Защита от навесов: структура 3+1, позиция между нападающим и воротами, вынос.'],
  'vp-7': [['decide', 'pass', 'trans'], "Doim o'zgaruvchi qoidalar fikr tezligini oshiradi: vertikal variant va «yuqoriga – orqaga – oldinga».", 'Постоянно меняющиеся условия ускоряют мышление: вертикаль и «вверх – назад – вперёд».'],
  'vp-14': [['pass', 'gk', 'support'], "Darvozabon, markaziy himoyachilar va tayanchlar markazdan o'yin qurishni o'rganadi.", 'Вратарь, центральные и опорные учатся строить атаку через центр.'],
  'vp-16': [['vision', 'speed', 'decide'], "Raqib baland bosganda uzun pas bilan son tengligida tez hujum — «sun'iy o'tish».", 'Против высокого прессинга — длинный пас и быстрая атака в равенстве: «искусственный переход».'],
  'vp-20': [['pass', 'support', 'touch'], "O'rta blokka qarshi markazda devor pas va bir teginishli o'yin.", 'Стенка и игра в одно касание в центре против среднего блока.'],
  'vp-28': [['cross', 'shoot', 'support'], "Qanotdan diagonal kombinatsiya va orqaga oshirma — past blokka qarshi gol.", 'Диагональная комбинация с фланга и передача назад — гол против низкого блока.'],
  'vp-33a': [['press', 'trans', 'team'], "Bosim ostida to'pni saqlash va olingan to'pni darhol xavfsiz zonaga uzatish.", 'Сохранение мяча под давлением и немедленный перевод отобранного мяча в безопасную зону.'],
  'vp-33b': [['press', 'team', 'speed'], "Signal bo'yicha hujumchilarning yuqori pressingi: yoysimon yugurish va markazni yopish.", 'Высокий прессинг атакующих по сигналу: бег по дуге и закрытый центр.'],
}

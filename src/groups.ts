/** Standard age groups offered everywhere a group is picked, plus the coach's own groups. */
export const STD_GROUPS = ['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'Pro 18+']

const AGE_GROUP: Record<string, string> = { '5–6': 'U6', '7–8': 'U8', '9–10': 'U10', '11–12': 'U12', '13–14': 'U14', '15–17': 'U17', Pro: 'Pro 18+' }

/** The coach's groups first, then the standard ones that are missing. */
export const allGroups = (own: string[]) => [...own, ...STD_GROUPS.filter((g) => !own.includes(g))]

/** Group that matches a ready plan's age band (e.g. '9–10' → 'U10'). */
export const groupForAges = (ages?: string) => (ages && AGE_GROUP[ages]) || undefined

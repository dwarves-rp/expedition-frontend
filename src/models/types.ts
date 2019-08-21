export enum SkillSlug {
  INSIGHT = 'insight',
  LISTEN = 'listen',
  SENSE = 'sense',
  SPOT = 'spot',
  TRACK = 'track'
}

export enum SkillCategorySlug {
  PERCEPTION = 'perception'
}

export enum AttributeSlug {
  APP = 'app',
  CON = 'con',
  DEX = 'dex',
  INT = 'int',
  POW = 'pow',
  SIZ = 'siz',
  STR = 'str'
}

export enum GenderSlug {
  MALE = 'male',
  FEMALE = 'female'
}

export enum VitalSlug {
  HITS = 'hits',
  POW = 'pow',
  SANITY = 'san'
}

export enum ProfessionSlug {
  SMITH = 'smith',
  MINER = 'miner',
  ENGINEER = 'engineer',
  METALLURGIST = 'metallurgist',
  RUNESMITH = 'runesmith',
  STONESMITH = 'stonesmith',
  WOODSMITH = 'woodsmith',
  DELVER = 'delver',
  SCOUT = 'scout',
  SCRIBE = 'scribe',
  APOTHECARY = 'apothecary',
  MERCHANT = 'merchant',
  FOREMAN = 'foreman',
  TROUBADOUR = 'troubadour',
  CLERIC = 'cleric',
  FUNGICULTURIST = 'fungiculturist',
  FARMER = 'farmer',
  DIPLOMAT = 'diplomat',
  HUNTER = 'hunter',
  BREWER = 'brewer'
}

export const genders: { [K in GenderSlug]: { label: string } } = {
  [GenderSlug.MALE]: { label: 'Male' },
  [GenderSlug.FEMALE]: { label: 'Female' }
}

export const attributes: { [K in AttributeSlug]: { label: string } } = {
  [AttributeSlug.APP]: { label: 'Appearance' },
  [AttributeSlug.CON]: { label: 'Constitution' },
  [AttributeSlug.DEX]: { label: 'Dexterity' },
  [AttributeSlug.INT]: { label: 'Intelligence' },
  [AttributeSlug.POW]: { label: 'Power' },
  [AttributeSlug.SIZ]: { label: 'Size' },
  [AttributeSlug.STR]: { label: 'Strength' }
}

export const professions: { [K in ProfessionSlug]: { label: string } } = {
  [ProfessionSlug.SMITH]: { label: 'Smith' },
  [ProfessionSlug.MINER]: { label: 'Miner' },
  [ProfessionSlug.ENGINEER]: { label: 'Engineer' },
  [ProfessionSlug.METALLURGIST]: { label: 'Metallurgist' },
  [ProfessionSlug.RUNESMITH]: { label: 'Rune' },
  [ProfessionSlug.STONESMITH]: { label: 'Stone' },
  [ProfessionSlug.WOODSMITH]: { label: 'Wood' },
  [ProfessionSlug.DELVER]: { label: 'Delver' },
  [ProfessionSlug.SCOUT]: { label: 'Scout' },
  [ProfessionSlug.SCRIBE]: { label: 'Scribe' },
  [ProfessionSlug.APOTHECARY]: { label: 'Apothecary' },
  [ProfessionSlug.MERCHANT]: { label: 'Merchant' },
  [ProfessionSlug.FOREMAN]: { label: 'Foreman' },
  [ProfessionSlug.TROUBADOUR]: { label: 'Troubadour' },
  [ProfessionSlug.CLERIC]: { label: 'Cleric' },
  [ProfessionSlug.FUNGICULTURIST]: { label: 'Fungiculturist' },
  [ProfessionSlug.FARMER]: { label: 'Farmer' },
  [ProfessionSlug.DIPLOMAT]: { label: 'Diplomat' },
  [ProfessionSlug.HUNTER]: { label: 'Hunter' },
  [ProfessionSlug.BREWER]: { label: 'Master Brewer' }
}

export const skills: {
  [K in SkillSlug]: {
    label: string
    base: (dwarf: Dwarf) => number
    skillCategory: SkillCategorySlug
  }
} = {
  insight: {
    base: () => 5,
    label: 'Insight',
    skillCategory: SkillCategorySlug.PERCEPTION
  },
  listen: {
    base: () => 25,
    label: 'Listen',
    skillCategory: SkillCategorySlug.PERCEPTION
  },
  sense: {
    base: () => 10,
    label: 'Sense',
    skillCategory: SkillCategorySlug.PERCEPTION
  },
  spot: {
    base: () => 25,
    label: 'Spot',
    skillCategory: SkillCategorySlug.PERCEPTION
  },
  track: {
    base: () => 10,
    label: 'Track',
    skillCategory: SkillCategorySlug.PERCEPTION
  }
}

export const skillCategories: {
  [K in SkillCategorySlug]: {
    label: string
    value: (dwarf: Dwarf) => number
  }
} = {
  [SkillCategorySlug.PERCEPTION]: {
    label: 'Perception',
    value: (dwarf: Dwarf) => {
      const pow = dwarf.attributes.pow.value + dwarf.attributes.pow.base
      const con = dwarf.attributes.con.value + dwarf.attributes.con.base
      const int = dwarf.attributes.int.value + dwarf.attributes.int.base

      return (
        pow - 10 + (Math.floor((con - 10) / 2) + Math.floor((int - 10) / 2))
      )
    }
  }
}

export interface HealthDiff {
  description: string
  affects: VitalSlug | AttributeSlug
  value: number
  regenRate: number
}

export type AttributeData = { slug: AttributeSlug; value: number; base: number }
export type VitalData = { slug: VitalSlug; value: number }
export type SkillData = { slug: SkillSlug; value: number }

export interface Dwarf {
  name: string
  profession: ProfessionSlug
  age: number
  gender: GenderSlug
  vitals: { [K in VitalSlug]: VitalData }
  attributes: { [K in AttributeSlug]: AttributeData }
  skills: { [K in SkillSlug]?: SkillData }
  isDead: boolean
  health: HealthDiff[]
}

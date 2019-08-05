export type Wound = {
  permanent: boolean
  damage: number
  attribute: 'con'
}

export type Dwarf = {
  id: number
  name: string
  profession: string
  currentHits: number
  attributes: {
    siz: number
    con: number
  }
  isDead: boolean
  wounds: Wound[]
}

type DwarfMaker = (
  name: string,
  profession: string,
  currentHits: number,
  siz: number,
  con: number,
  dead: boolean,
  wounds: Wound[]
) => Dwarf

function dwarfBuilder(): DwarfMaker {
  let id = 1
  return (name, profession, currentHits, siz, con, dead, wounds) => ({
    id: id++,
    name,
    profession,
    currentHits,
    attributes: {
      siz,
      con
    },
    isDead: dead,
    wounds
  })
}

const builder = dwarfBuilder()

const conWound = (damage: number, permanent: boolean): Wound => ({
  attribute: 'con',
  damage,
  permanent
})

export const fakeDwarfList = [
  builder('Sceinur', 'Stonesmith', 16, 8, 15, false, []),
  builder('Jenka', 'Smith', 16, 8, 15, false, []),
  builder('Modsognir', 'Metallurgist', 16, 8, 15, false, []),
  builder('Krannom', 'Brewmaster', 16, 8, 15, false, []),
  builder('Bhelkam', 'Brewmaster', 16, 8, 15, false, []),
  builder('Gadiro', 'Scout', 3, 8, 15, false, []),
  builder('Jasper', 'Scout', 10, 8, 15, false, [conWound(10, false)]),
  builder('Gormur', 'Diplomat', 8, 8, 15, false, [conWound(5, false)]),
  builder('Suthradir', 'Miner', 10, 8, 15, false, [conWound(2, false)]),
  builder('Adeela', 'Woodsmith', 14, 8, 15, false, []),
  builder('Cadara', 'Merchant', 5, 8, 15, false, [conWound(8, true)]),
  builder('Gralram', 'Fungiculturist', 6, 8, 15, false, [conWound(5, false)]),
  builder('Skirfar', 'Woodsmith', 2, 8, 15, false, [conWound(1, true)]),
  builder('Toki', 'Delver', 14, 8, 15, false, [conWound(4, false)]),
  builder('Doldram', 'Woodsmith', 9, 8, 15, false, [conWound(2, false)]),
  builder('Memana', 'Delver', 16, 8, 15, false, []),
  builder('Durggan', 'Stonesmith', 16, 8, 15, false, []),
  builder('Nori', 'Engineer', 16, 8, 15, false, []),
  builder('Glovari', 'Foreman', 16, 8, 15, false, []),
  builder('Davlia', 'Merchant', 16, 8, 15, false, []),
  builder('Dragrola', 'Smith', 16, 8, 15, false, []),
  builder('Galina', 'Diplomat', 16, 8, 15, false, []),
  builder('Voggur', 'Stonesmith', 11, 8, 15, false, []),
  builder('Ivy', 'Priest', 16, 8, 15, false, []),
  builder('Bendan', 'Woodsmith', 16, 8, 15, false, []),
  builder('Marvia', 'Merchant', 16, 8, 15, false, []),
  builder('Onundur', 'Scout', 16, 8, 15, false, []),
  builder('Acaida', 'Fungiculturist', 16, 8, 15, false, []),
  builder('Kamlin Uhn', 'Diplomat', 0, 8, 10, true, []),
  builder('Hazzuli', 'Metallurgist', 0, 8, 10, true, []),
  builder('Krumkohm', 'Sailor', 0, 8, 10, true, []),
  builder('Dolana', 'Engineer', 0, 8, 10, true, []),
  builder('Yngvi', 'Apothecary', 0, 8, 10, true, []),
  builder('Paitor', 'Diplomat', 0, 8, 10, true, []),
  builder('Gindana', 'Metallurgist', 0, 8, 10, true, [])
]

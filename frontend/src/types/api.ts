// src/types/api.ts - Update your types to match the DTOs

export interface Character {
  id: number;
  name: string;
  class: string;
  level: number;
  armorClass: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  imageBase64?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: Item[];
  spells?: Spell[];
}

export interface CharacterSummary {
  id: number;
  name: string;
  class: string;
  level: number;
  armorClass: number;
  imageBase64?: string | null; // ADDED THIS FIELD
  createdAt: string;
}

export interface CreateCharacterRequest {
  name: string;
  class: string;
  level: number;
  armorClass: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  imageBase64?: string | null;
}

// NEW: Patch request type for partial updates
export interface PatchCharacterRequest {
  name?: string;
  class?: string;
  level?: number;
  armorClass?: number;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  imageBase64?: string | null;
}

export interface Item {
  id: number;
  name: string;
  effect: string;
  strengthBonus?: number | null;
  dexterityBonus?: number | null;
  constitutionBonus?: number | null;
  intelligenceBonus?: number | null;
  wisdomBonus?: number | null;
  charismaBonus?: number | null;
  armorBonus?: number | null;
  itemTemplateId?: number | null;
  itemTemplateName?: string | null;
}

export interface Spell {
  id: number;
  name: string;
  effect: string;
  damage?: string | null;
  level: number;
  school?: string | null;
  castingTime?: string | null;
  range?: string | null;
  spellTemplateId?: number | null;
  spellTemplateName?: string | null;
}
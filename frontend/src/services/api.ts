
import axios, { AxiosInstance } from 'axios';
import {
  Character,
  CharacterSummary,
  CreateCharacterRequest,
  Item,
  ItemTemplate,
  Spell,
  SpellTemplate,
  ItemCategory,
  SpellSchool
} from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        throw error;
      }
    );
  }

  
  async getCharacters(): Promise<CharacterSummary[]> {
    const response = await this.client.get('/Characters');
    return response.data;
  }

  async getCharacter(id: number): Promise<Character> {
    const response = await this.client.get(`/Characters/${id}`);
    return response.data;
  }

  async createCharacter(character: CreateCharacterRequest): Promise<Character> {
    const response = await this.client.post('/Characters', character);
    return response.data;
  }

  async updateCharacter(id: number, character: Partial<Character>): Promise<Character> {
    const response = await this.client.put(`/Characters/${id}`, character);
    return response.data;
  }

  async patchCharacter(id: number, updates: Partial<Character>): Promise<Character> {
    const response = await this.client.patch(`/Characters/${id}`, updates);
    return response.data;
  }

  async deleteCharacter(id: number): Promise<void> {
    await this.client.delete(`/Characters/${id}`);
  }

  async getCharactersByClass(className: string): Promise<CharacterSummary[]> {
    const response = await this.client.get(`/Characters/by-class/${className}`);
    return response.data;
  }

  async getCharactersByLevel(minLevel?: number, maxLevel?: number): Promise<CharacterSummary[]> {
    const params = new URLSearchParams();
    if (minLevel) params.append('minLevel', minLevel.toString());
    if (maxLevel) params.append('maxLevel', maxLevel.toString());
    
    const response = await this.client.get(`/Characters/by-level?${params}`);
    return response.data;
  }

  
  async getItems(): Promise<Item[]> {
    const response = await this.client.get('/Items');
    return response.data;
  }

  async getItem(id: number): Promise<Item> {
    const response = await this.client.get(`/Items/${id}`);
    return response.data;
  }

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await this.client.post('/Items', item);
    return response.data;
  }

  async updateItem(id: number, item: Partial<Item>): Promise<Item> {
    const response = await this.client.put(`/Items/${id}`, item);
    return response.data;
  }

  async patchItem(id: number, updates: Partial<Item>): Promise<Item> {
    const response = await this.client.patch(`/Items/${id}`, updates);
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await this.client.delete(`/Items/${id}`);
  }

  async getItemsByCharacter(characterId: number): Promise<Item[]> {
    const response = await this.client.get(`/Items/by-character/${characterId}`);
    return response.data;
  }

  async createItemFromTemplate(templateId: number, characterId: number): Promise<Item> {
    const response = await this.client.post('/Items/from-template', {
      templateId,
      characterId,
    });
    return response.data;
  }

  
  async getItemTemplates(): Promise<ItemTemplate[]> {
    const response = await this.client.get('/ItemTemplates');
    return response.data;
  }

  async getActiveItemTemplates(): Promise<ItemTemplate[]> {
    const response = await this.client.get('/ItemTemplates/active');
    return response.data;
  }

  async getItemTemplate(id: number): Promise<ItemTemplate> {
    const response = await this.client.get(`/ItemTemplates/${id}`);
    return response.data;
  }

  async createItemTemplate(template: Omit<ItemTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ItemTemplate> {
    const response = await this.client.post('/ItemTemplates', template);
    return response.data;
  }

  async updateItemTemplate(id: number, template: Partial<ItemTemplate>): Promise<ItemTemplate> {
    const response = await this.client.put(`/ItemTemplates/${id}`, template);
    return response.data;
  }

  async deleteItemTemplate(id: number): Promise<void> {
    await this.client.delete(`/ItemTemplates/${id}`);
  }

  async getItemTemplatesByCategory(category: ItemCategory): Promise<ItemTemplate[]> {
    const response = await this.client.get(`/ItemTemplates/by-category/${category}`);
    return response.data;
  }

  async getItemCategories(): Promise<ItemCategory[]> {
    const response = await this.client.get('/ItemTemplates/categories');
    return response.data;
  }

  
  async getSpells(): Promise<Spell[]> {
    const response = await this.client.get('/Spells');
    return response.data;
  }

  async getSpell(id: number): Promise<Spell> {
    const response = await this.client.get(`/Spells/${id}`);
    return response.data;
  }

  async createSpell(spell: Omit<Spell, 'id'>): Promise<Spell> {
    const response = await this.client.post('/Spells', spell);
    return response.data;
  }

  async updateSpell(id: number, spell: Partial<Spell>): Promise<Spell> {
    const response = await this.client.put(`/Spells/${id}`, spell);
    return response.data;
  }

  async patchSpell(id: number, updates: Partial<Spell>): Promise<Spell> {
    const response = await this.client.patch(`/Spells/${id}`, updates);
    return response.data;
  }

  async deleteSpell(id: number): Promise<void> {
    await this.client.delete(`/Spells/${id}`);
  }

  async getSpellsByCharacter(characterId: number): Promise<Spell[]> {
    const response = await this.client.get(`/Spells/by-character/${characterId}`);
    return response.data;
  }

  async createSpellFromTemplate(templateId: number, characterId: number): Promise<Spell> {
    const response = await this.client.post('/Spells/from-template', {
      templateId,
      characterId,
    });
    return response.data;
  }

  
  async getSpellTemplates(): Promise<SpellTemplate[]> {
    const response = await this.client.get('/SpellTemplates');
    return response.data;
  }

  async getActiveSpellTemplates(): Promise<SpellTemplate[]> {
    const response = await this.client.get('/SpellTemplates/active');
    return response.data;
  }

  async getSpellTemplate(id: number): Promise<SpellTemplate> {
    const response = await this.client.get(`/SpellTemplates/${id}`);
    return response.data;
  }

  async createSpellTemplate(template: Omit<SpellTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<SpellTemplate> {
    const response = await this.client.post('/SpellTemplates', template);
    return response.data;
  }

  async updateSpellTemplate(id: number, template: Partial<SpellTemplate>): Promise<SpellTemplate> {
    const response = await this.client.put(`/SpellTemplates/${id}`, template);
    return response.data;
  }

  async deleteSpellTemplate(id: number): Promise<void> {
    await this.client.delete(`/SpellTemplates/${id}`);
  }

  async getSpellTemplatesByLevel(level: number): Promise<SpellTemplate[]> {
    const response = await this.client.get(`/SpellTemplates/by-level/${level}`);
    return response.data;
  }

  async getSpellTemplatesBySchool(school: SpellSchool): Promise<SpellTemplate[]> {
    const response = await this.client.get(`/SpellTemplates/by-school/${school}`);
    return response.data;
  }

  async getSpellSchools(): Promise<SpellSchool[]> {
    const response = await this.client.get('/SpellTemplates/schools');
    return response.data;
  }
}


export const apiClient = new ApiClient();
export default apiClient;
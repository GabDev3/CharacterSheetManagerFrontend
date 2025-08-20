// src/components/character/CharacterModal.tsx - WITH ITEM BONUSES
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatGrid } from '@/components/ui/StatGrid';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { Badge } from '@/components/ui/Badge';
import { Character, PatchCharacterRequest } from '@/types/api';
import { Edit, Save, X, Upload, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { usePatchCharacter } from '@/hooks/useCharacters';
import { useItemTemplates } from '@/hooks/useItemTemplates';
import { useSpellTemplates } from '@/hooks/useSpellTemplates';
import { useCreateItemFromTemplate, useDeleteItem } from '@/hooks/useItems';
import { useCreateSpellFromTemplate, useDeleteSpell } from '@/hooks/useSpells';

interface CharacterModalProps {
  character: Character | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ItemBonuses {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  armorClass: number;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  isOpen,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState<Partial<Character>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showItemSelect, setShowItemSelect] = useState(false);
  const [showSpellSelect, setShowSpellSelect] = useState(false);
  
  const patchCharacter = usePatchCharacter();
  const { data: itemTemplates } = useItemTemplates();
  const { data: spellTemplates } = useSpellTemplates();
  const createItemFromTemplate = useCreateItemFromTemplate();
  const deleteItem = useDeleteItem();
  const createSpellFromTemplate = useCreateSpellFromTemplate();
  const deleteSpell = useDeleteSpell();

  // Calculate item bonuses
  const itemBonuses = useMemo((): ItemBonuses => {
    if (!character?.items) return {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      armorClass: 0
    };

    return character.items.reduce((bonuses, item) => ({
      strength: bonuses.strength + (item.strengthBonus || 0),
      dexterity: bonuses.dexterity + (item.dexterityBonus || 0),
      constitution: bonuses.constitution + (item.constitutionBonus || 0),
      intelligence: bonuses.intelligence + (item.intelligenceBonus || 0),
      wisdom: bonuses.wisdom + (item.wisdomBonus || 0),
      charisma: bonuses.charisma + (item.charismaBonus || 0),
      armorClass: bonuses.armorClass + (item.armorBonus || 0),
    }), {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      armorClass: 0
    });
  }, [character?.items]);

  // Calculate effective stats (base + bonuses)
  const effectiveStats = useMemo(() => {
    if (!character) return null;
    
    return {
      strength: character.strength + itemBonuses.strength,
      dexterity: character.dexterity + itemBonuses.dexterity,
      constitution: character.constitution + itemBonuses.constitution,
      intelligence: character.intelligence + itemBonuses.intelligence,
      wisdom: character.wisdom + itemBonuses.wisdom,
      charisma: character.charisma + itemBonuses.charisma,
      armorClass: character.armorClass + itemBonuses.armorClass,
    };
  }, [character, itemBonuses]);

  // Reset editing state when character changes or modal closes
  useEffect(() => {
    if (!isOpen || !character) {
      setIsEditing(false);
      setEditedCharacter({});
      setSelectedImage(null);
      setShowItemSelect(false);
      setShowSpellSelect(false);
    }
  }, [isOpen, character]);

  if (!character || !effectiveStats) return null;

  const stats = [
    { 
      label: 'Strength', 
      value: isEditing ? (editedCharacter.strength ?? character.strength) : character.strength,
      effectiveValue: effectiveStats.strength,
      bonus: itemBonuses.strength,
      color: 'default' as const 
    },
    { 
      label: 'Dexterity', 
      value: isEditing ? (editedCharacter.dexterity ?? character.dexterity) : character.dexterity,
      effectiveValue: effectiveStats.dexterity,
      bonus: itemBonuses.dexterity,
      color: 'default' as const 
    },
    { 
      label: 'Constitution', 
      value: isEditing ? (editedCharacter.constitution ?? character.constitution) : character.constitution,
      effectiveValue: effectiveStats.constitution,
      bonus: itemBonuses.constitution,
      color: 'default' as const 
    },
    { 
      label: 'Intelligence', 
      value: isEditing ? (editedCharacter.intelligence ?? character.intelligence) : character.intelligence,
      effectiveValue: effectiveStats.intelligence,
      bonus: itemBonuses.intelligence,
      color: 'default' as const 
    },
    { 
      label: 'Wisdom', 
      value: isEditing ? (editedCharacter.wisdom ?? character.wisdom) : character.wisdom,
      effectiveValue: effectiveStats.wisdom,
      bonus: itemBonuses.wisdom,
      color: 'default' as const 
    },
    { 
      label: 'Charisma', 
      value: isEditing ? (editedCharacter.charisma ?? character.charisma) : character.charisma,
      effectiveValue: effectiveStats.charisma,
      bonus: itemBonuses.charisma,
      color: 'default' as const 
    },
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCharacter({
      name: character.name,
      level: character.level,
      armorClass: character.armorClass,
      strength: character.strength,
      dexterity: character.dexterity,
      constitution: character.constitution,
      intelligence: character.intelligence,
      wisdom: character.wisdom,
      charisma: character.charisma,
    });
  };

  const handleInputChange = (field: keyof Character, value: string | number) => {
    console.log(`Changing ${field} from ${character[field]} to ${value} (type: ${typeof value})`);
    
    if (typeof value === 'string' && ['level', 'armorClass', 'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].includes(field)) {
      const numValue = parseInt(value);
      
      if (isNaN(numValue)) {
        console.warn(`Invalid number for ${field}: ${value}`);
        return;
      }
      
      const ranges = {
        level: { min: 1, max: 20 },
        armorClass: { min: 1, max: 30 },
        strength: { min: 1, max: 20 },
        dexterity: { min: 1, max: 20 },
        constitution: { min: 1, max: 20 },
        intelligence: { min: 1, max: 20 },
        wisdom: { min: 1, max: 20 },
        charisma: { min: 1, max: 20 }
      };
      
      const range = ranges[field as keyof typeof ranges];
      if (range && (numValue < range.min || numValue > range.max)) {
        console.warn(`${field} value ${numValue} out of range ${range.min}-${range.max}`);
        return;
      }
      
      setEditedCharacter(prev => ({ ...prev, [field]: numValue }));
    } else {
      setEditedCharacter(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    console.log('=== SAVE PROCESS STARTED ===');
    console.log('Original character:', character);
    console.log('Edited character:', editedCharacter);
    
    const patchPayload: PatchCharacterRequest = {};
    const fieldsToCheck = ['name', 'level', 'armorClass', 'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
    
    fieldsToCheck.forEach(field => {
      const editedValue = editedCharacter[field];
      const originalValue = character[field];
      
      if (editedValue !== undefined && editedValue !== originalValue) {
        console.log(`Field ${field} changed: ${originalValue} -> ${editedValue}`);
        (patchPayload as any)[field] = editedValue;
      }
    });

    if (selectedImage) {
      console.log('Adding image to payload (length):', selectedImage.length);
      patchPayload.imageBase64 = selectedImage;
    }

    console.log('Patch payload:', patchPayload);

    if (Object.keys(patchPayload).length > 0) {
      console.log('Sending PATCH request...');
      patchCharacter.mutate(
        { id: character.id, character: patchPayload },
        {
          onSuccess: (data) => {
            console.log('✅ Character updated successfully:', data);
            setIsEditing(false);
            setEditedCharacter({});
            setSelectedImage(null);
          },
          onError: (error: any) => {
            console.error('❌ Failed to update character:', error);
            
            if (error.response) {
              console.error('Response status:', error.response.status);
              console.error('Response data:', error.response.data);
              console.error('Response headers:', error.response.headers);
            } else if (error.request) {
              console.error('Request was made but no response received:', error.request);
            } else {
              console.error('Error setting up request:', error.message);
            }
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data || 
                                error.message || 
                                'Unknown error occurred';
            alert(`Failed to update character: ${errorMessage}`);
          }
        }
      );
    } else {
      console.log('No changes detected, not sending request');
      setIsEditing(false);
      setEditedCharacter({});
      setSelectedImage(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCharacter({});
    setSelectedImage(null);
    setShowItemSelect(false);
    setShowSpellSelect(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please select a file smaller than 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        console.log('Base64 image loaded, length:', base64.length);
        setSelectedImage(base64);
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
        alert('Error reading the image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (templateId: number) => {
    createItemFromTemplate.mutate({
      itemTemplateId: templateId,
      characterId: character.id
    }, {
      onSuccess: () => {
        setShowItemSelect(false);
      }
    });
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem.mutate(itemId);
    }
  };

  const handleAddSpell = (templateId: number) => {
    createSpellFromTemplate.mutate({
      spellTemplateId: templateId,
      characterId: character.id
    }, {
      onSuccess: () => {
        setShowSpellSelect(false);
      }
    });
  };

  const handleDeleteSpell = (spellId: number) => {
    if (window.confirm('Are you sure you want to delete this spell?')) {
      deleteSpell.mutate(spellId);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Character Details">
      <div className="space-y-6">
        {/* Character Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-6">
                <CharacterAvatar
                  imageBase64={selectedImage || character.imageBase64}
                  name={character.name}
                  size="xl"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white text-gray-700 rounded-full p-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={editedCharacter.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold bg-white/10 border-white/20 text-white placeholder-white/70"
                    placeholder={character.name}
                  />
                ) : (
                  <h2 className="text-3xl font-bold mb-2">{character.name}</h2>
                )}
                <p className="text-xl opacity-90">
                  Level {isEditing ? (
                    <input
                      type="number"
                      value={editedCharacter.level ?? character.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                      min={1}
                      max={20}
                    />
                  ) : (
                    character.level
                  )} {character.class}
                </p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant="secondary">
                    AC: {isEditing ? (
                      <input
                        type="number"
                        value={editedCharacter.armorClass ?? character.armorClass}
                        onChange={(e) => handleInputChange('armorClass', e.target.value)}
                        className="w-16 bg-white/10 border border-white/20 rounded px-1 text-white ml-1"
                        min={1}
                        max={30}
                      />
                    ) : (
                      character.armorClass
                    )}
                  </Badge>
                  {itemBonuses.armorClass > 0 && (
                    <Badge variant="success">
                      Total AC: {effectiveStats.armorClass} (+{itemBonuses.armorClass})
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button variant="secondary" onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleSave}
                    isLoading={patchCharacter.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ability Scores */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Ability Scores</h3>
                {Object.values(itemBonuses).some(bonus => bonus > 0) && (
                  <p className="text-sm text-gray-600">Base stats with item bonuses shown</p>
                )}
              </CardHeader>
              <CardBody>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'strength', label: 'Strength' },
                      { key: 'dexterity', label: 'Dexterity' },
                      { key: 'constitution', label: 'Constitution' },
                      { key: 'intelligence', label: 'Intelligence' },
                      { key: 'wisdom', label: 'Wisdom' },
                      { key: 'charisma', label: 'Charisma' }
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <Input
                          label={label}
                          type="number"
                          min={1}
                          max={20}
                          value={editedCharacter[key as keyof Character] ?? character[key as keyof Character]}
                          onChange={(e) => handleInputChange(key as keyof Character, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {stat.value}
                            {stat.bonus > 0 && (
                              <span className="text-lg text-green-600 ml-1">
                                (+{stat.bonus})
                              </span>
                            )}
                          </div>
                          {stat.bonus > 0 && (
                            <div className="text-sm text-green-600 font-medium">
                              Total: {stat.effectiveValue}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Items & Spells */}
          <div className="space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Items</h3>
                  {isEditing && (
                    <Button
                      size="sm"
                      onClick={() => setShowItemSelect(!showItemSelect)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {showItemSelect && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Select Item Template:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {itemTemplates?.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleAddItem(template.id)}
                          className="w-full text-left px-2 py-1 text-sm hover:bg-white rounded transition-colors"
                        >
                          {template.name} ({template.category})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {character.items && character.items.length > 0 ? (
                  <div className="space-y-3">
                    {character.items
                      .filter(item => item.name)
                      .map((item) => (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg relative">
                          {isEditing && (
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <h4 className="font-medium text-gray-900 pr-8">{item.name}</h4>
                          {item.effect && (
                            <p className="text-sm text-gray-600 mt-1">{item.effect}</p>
                          )}
                          {(item.strengthBonus || item.dexterityBonus || item.constitutionBonus || 
                            item.intelligenceBonus || item.wisdomBonus || item.charismaBonus || 
                            item.armorBonus) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.strengthBonus && (
                                <Badge variant="success" size="sm">STR +{item.strengthBonus}</Badge>
                              )}
                              {item.dexterityBonus && (
                                <Badge variant="success" size="sm">DEX +{item.dexterityBonus}</Badge>
                              )}
                              {item.constitutionBonus && (
                                <Badge variant="success" size="sm">CON +{item.constitutionBonus}</Badge>
                              )}
                              {item.intelligenceBonus && (
                                <Badge variant="success" size="sm">INT +{item.intelligenceBonus}</Badge>
                              )}
                              {item.wisdomBonus && (
                                <Badge variant="success" size="sm">WIS +{item.wisdomBonus}</Badge>
                              )}
                              {item.charismaBonus && (
                                <Badge variant="success" size="sm">CHA +{item.charismaBonus}</Badge>
                              )}
                              {item.armorBonus && (
                                <Badge variant="primary" size="sm">AC +{item.armorBonus}</Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No items equipped</p>
                )}
              </CardBody>
            </Card>

            {/* Spells */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Spells</h3>
                  {isEditing && (
                    <Button
                      size="sm"
                      onClick={() => setShowSpellSelect(!showSpellSelect)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {showSpellSelect && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Select Spell Template:</h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {spellTemplates?.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleAddSpell(template.id)}
                          className="w-full text-left px-2 py-1 text-sm hover:bg-white rounded transition-colors"
                        >
                          {template.name} (Level {template.level} {template.school})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {character.spells && character.spells.length > 0 ? (
                  <div className="space-y-3">
                    {character.spells
                      .filter(spell => spell.name)
                      .map((spell) => (
                        <div key={spell.id} className="p-3 bg-gray-50 rounded-lg relative">
                          {isEditing && (
                            <button
                              onClick={() => handleDeleteSpell(spell.id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="flex justify-between items-start mb-1 pr-8">
                            <h4 className="font-medium text-gray-900">{spell.name}</h4>
                            <Badge variant="secondary" size="sm">
                              {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
                            </Badge>
                          </div>
                          {spell.school && (
                            <p className="text-xs text-gray-500 mb-1">{spell.school}</p>
                          )}
                          {spell.effect && (
                            <p className="text-sm text-gray-600 mb-2">{spell.effect}</p>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {spell.damage && (
                              <Badge variant="danger" size="sm">
                                {spell.damage} damage
                              </Badge>
                            )}
                            {spell.castingTime && (
                              <Badge variant="secondary" size="sm">
                                {spell.castingTime}
                              </Badge>
                            )}
                            {spell.range && (
                              <Badge variant="secondary" size="sm">
                                {spell.range}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No spells known</p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Modal>
  );
};
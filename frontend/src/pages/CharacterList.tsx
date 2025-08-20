// src/pages/CharacterList.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CharacterCard } from '@/components/character/CharacterCard';
import { CharacterModal } from '@/components/character/CharacterModal';
import { useCharacters, useCharacter, useDeleteCharacter } from '@/hooks/useCharacters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Users, UserPlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CharacterList: React.FC = () => {
  const navigate = useNavigate();
  const { data: characters, isLoading } = useCharacters();
  const deleteCharacter = useDeleteCharacter();
  
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const { data: selectedCharacter } = useCharacter(selectedCharacterId!);

  const classOptions = [
    { value: '', label: 'All Classes' },
    ...Array.from(new Set(characters?.map(c => c.class) || [])).map(cls => ({
      value: cls,
      label: cls
    }))
  ];

  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: '1-5', label: 'Level 1-5' },
    { value: '6-10', label: 'Level 6-10' },
    { value: '11-15', label: 'Level 11-15' },
    { value: '16-20', label: 'Level 16-20' },
  ];

  const filteredCharacters = characters?.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !classFilter || character.class === classFilter;
    
    let matchesLevel = true;
    if (levelFilter) {
      const [min, max] = levelFilter.split('-').map(Number);
      matchesLevel = character.level >= min && character.level <= max;
    }

    return matchesSearch && matchesClass && matchesLevel;
  }) || [];

  const handleDelete = (id: number) => {
    const character = characters?.find(c => c.id === id);
    if (character && window.confirm(`Are you sure you want to delete ${character.name}?`)) {
      deleteCharacter.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Manage Characters"
        subtitle="View and edit your character collection"
        icon={Users}
        action={{
          label: 'Add New Character',
          onClick: () => navigate('/characters/new'),
          icon: UserPlus,
        }}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={classOptions}
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            />
            <Select
              options={levelOptions}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Character Grid */}
      {filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onView={setSelectedCharacterId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No characters found
            </h3>
            <p className="text-gray-500 mb-6">
              {characters?.length === 0 
                ? "You haven't created any characters yet."
                : "Try adjusting your search or filters."
              }
            </p>
            <button
              onClick={() => navigate('/characters/new')}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create Character
            </button>
          </CardBody>
        </Card>
      )}

      {/* Character Modal */}
      <CharacterModal
        character={selectedCharacter || null}
        isOpen={!!selectedCharacterId}
        onClose={() => setSelectedCharacterId(null)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatGrid } from '@/components/ui/StatGrid';
import { CharacterCard } from '@/components/character/CharacterCard';
import { CharacterModal } from '@/components/character/CharacterModal';
import { useCharacters, useCharacter, useDeleteCharacter } from '@/hooks/useCharacters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Home, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { data: characters, isLoading } = useCharacters();
  const deleteCharacter = useDeleteCharacter();
  const navigate = useNavigate();
  
  
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const { data: selectedCharacter } = useCharacter(selectedCharacterId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalCharacters = characters?.length || 0;
  const avgLevel = totalCharacters > 0 
    ? (characters!.reduce((sum, char) => sum + char.level, 0) / totalCharacters).toFixed(1)
    : '0';
  
  const classCounts = characters?.reduce((acc, char) => {
    acc[char.class] = (acc[char.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const favoriteClass = Object.keys(classCounts).reduce((a, b) => 
    classCounts[a] > classCounts[b] ? a : b, '-'
  );

  const dashboardStats = [
    { label: 'Total Characters', value: totalCharacters, color: 'primary' as const },
    { label: 'Average Level', value: avgLevel, color: 'success' as const },
    { label: 'Favorite Class', value: favoriteClass, color: 'warning' as const },
  ];

  const recentCharacters = characters?.slice(0, 6) || [];

  const handleDelete = (id: number) => {
    const character = characters?.find(c => c.id === id);
    if (character && window.confirm(`Are you sure you want to delete ${character.name}?`)) {
      deleteCharacter.mutate(id);
    }
  };

  return (
    <div>
      <PageHeader
        title="Welcome to Character Sheet Manager"
        subtitle="Manage your D&D characters with ease"
        icon={Home}
        action={{
          label: 'Create New Character',
          onClick: () => navigate('/characters/new'),
          icon: UserPlus,
        }}
      />

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                stat.color === 'primary' ? 'text-primary-600' :
                stat.color === 'success' ? 'text-green-600' :
                stat.color === 'warning' ? 'text-yellow-600' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      {}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Characters</h2>
            <button
              onClick={() => navigate('/characters')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
        </CardHeader>
        <CardBody>
          {recentCharacters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onView={setSelectedCharacterId} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No characters yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start building your party by creating your first character!
              </p>
              <button
                onClick={() => navigate('/characters/new')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Create Character
              </button>
            </div>
          )}
        </CardBody>
      </Card>

      {}
      <CharacterModal
        character={selectedCharacter || null}
        isOpen={!!selectedCharacterId}
        onClose={() => setSelectedCharacterId(null)}
      />
    </div>
  );
};
// src/components/character/CharacterCard.tsx
import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { StatGrid } from '@/components/ui/StatGrid';
import { CharacterSummary } from '@/types/api';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CharacterCardProps {
  character: CharacterSummary;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onView,
  onDelete,
}) => {
  return (
    <Card hover className="h-full">
      <CardBody>
        <div className="flex items-center mb-4">
         <CharacterAvatar
          imageBase64={character.imageBase64 ?? undefined} // undefined zamiast pustego stringa
          name={character.name}
          size="lg"
          className="mr-4"
        />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {character.name}
            </h3>
            <p className="text-gray-600">
              Level {character.level} {character.class}
            </p>
            <Badge variant="secondary" size="sm" className="mt-1">
              AC: {character.armorClass}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(character.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(character.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
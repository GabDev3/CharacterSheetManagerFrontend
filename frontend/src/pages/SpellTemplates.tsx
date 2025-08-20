// src/pages/SpellTemplates.tsx
import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SpellTemplateForm } from '@/components/spells/SpellTemplateForm';
import { 
  useSpellTemplates, 
  useCreateSpellTemplate,
  useUpdateSpellTemplate,
  useDeleteSpellTemplate 
} from '@/hooks/useSpellTemplates';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Sparkles, Plus, Edit, Trash2, Search } from 'lucide-react';
import { SpellTemplate, SpellSchool, CreateSpellTemplateRequest, UpdateSpellTemplateRequest } from '@/types/api';

export const SpellTemplates: React.FC = () => {
  const { data: spellTemplates, isLoading } = useSpellTemplates();
  const createSpellTemplate = useCreateSpellTemplate();
  const updateSpellTemplate = useUpdateSpellTemplate();
  const deleteSpellTemplate = useDeleteSpellTemplate();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSpell, setEditingSpell] = useState<SpellTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');

  const levelOptions = [
    { value: '', label: 'All Levels' },
    { value: '0', label: 'Cantrip' },
    ...Array.from({ length: 9 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}${getOrdinalSuffix(i + 1)} Level`
    }))
  ];

  const schoolOptions = [
    { value: '', label: 'All Schools' },
    'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
    'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
  ].slice(1).map(school => ({ value: school, label: school }));

  schoolOptions.unshift({ value: '', label: 'All Schools' });

  function getOrdinalSuffix(number: number): string {
    const j = number % 10;
    const k = number % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  }

  const getSchoolColor = (school: SpellSchool) => {
    const colors: Record<SpellSchool, 'primary' | 'success' | 'warning' | 'danger' | 'secondary'> = {
      'Abjuration': 'primary',
      'Conjuration': 'success',
      'Divination': 'warning',
      'Enchantment': 'warning',
      'Evocation': 'danger',
      'Illusion': 'secondary',
      'Necromancy': 'secondary',
      'Transmutation': 'success'
    };
    return colors[school] || 'secondary';
  };

  const filteredSpells = spellTemplates?.filter(spell => {
    const matchesSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !levelFilter || spell.level.toString() === levelFilter;
    const matchesSchool = !schoolFilter || spell.school === schoolFilter;
    return matchesSearch && matchesLevel && matchesSchool;
  }) || [];

  const handleCreate = (data: CreateSpellTemplateRequest) => {
    createSpellTemplate.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleUpdate = (data: UpdateSpellTemplateRequest) => {
    if (!editingSpell) return;
    
    updateSpellTemplate.mutate(
      { id: editingSpell.id, data },
      {
        onSuccess: () => {
          setEditingSpell(null);
        },
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteSpellTemplate.mutate(id);
    }
  };

  const handleEdit = (spell: SpellTemplate) => {
    setEditingSpell(spell);
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
        title="Manage Spells"
        subtitle="Create and manage spell templates for your characters"
        icon={Sparkles}
        action={{
          label: 'Add New Spell',
          onClick: () => setIsCreateModalOpen(true),
          icon: Plus,
        }}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search spells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={levelOptions}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            />
            <Select
              options={schoolOptions}
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Spell Grid */}
      {filteredSpells.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpells.map((spell) => {
            const levelText = spell.level === 0 ? 'Cantrip' : `${spell.level}${getOrdinalSuffix(spell.level)} Level`;

            return (
              <Card key={spell.id} hover className={!spell.isActive ? 'opacity-75' : ''}>
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{spell.name}</h3>
                    <Badge variant={getSchoolColor(spell.school)}>{spell.school}</Badge>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span>⭐ {levelText}</span>
                      {spell.damage && <span>⚔️ {spell.damage}</span>}
                    </div>
                  </div>
                  
                  {spell.effect && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{spell.effect}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs text-gray-500">
                    <div>
                      <div className="font-medium">Cast Time</div>
                      <div>{spell.castingTime || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="font-medium">Range</div>
                      <div>{spell.range || 'N/A'}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant={spell.isActive ? 'success' : 'secondary'} size="sm">
                      {spell.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(spell)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(spell.id, spell.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No spells found
            </h3>
            <p className="text-gray-500 mb-6">
              {spellTemplates?.length === 0 
                ? "Start building your spell library by creating your first template!"
                : "Try adjusting your search or filters."
              }
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Spell
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Create Spell Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Spell Template"
        size="2xl"
      >
        <SpellTemplateForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createSpellTemplate.isLoading}
        />
      </Modal>

      {/* Edit Spell Modal */}
      <Modal
        isOpen={!!editingSpell}
        onClose={() => setEditingSpell(null)}
        title="Edit Spell Template"
        size="2xl"
      >
        {editingSpell && (
          <SpellTemplateForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingSpell(null)}
            isLoading={updateSpellTemplate.isLoading}
            initialData={editingSpell}
            isEdit
          />
        )}
      </Modal>
    </div>
  );
};
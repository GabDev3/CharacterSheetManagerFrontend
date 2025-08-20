
import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ItemTemplateForm } from '@/components/items/ItemTemplateForm';
import { 
  useItemTemplates, 
  useCreateItemTemplate, 
  useUpdateItemTemplate,
  useDeleteItemTemplate
} from '@/hooks/useItemTemplates';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Sword, Plus, Edit, Trash2, Search } from 'lucide-react';
import { ItemTemplate, ItemCategory, CreateItemTemplateRequest, UpdateItemTemplateRequest } from '@/types/api';

export const ItemTemplates: React.FC = () => {
  const { data: itemTemplates, isLoading } = useItemTemplates();
  const createItemTemplate = useCreateItemTemplate();
  const updateItemTemplate = useUpdateItemTemplate();
  const deleteItemTemplate = useDeleteItemTemplate();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Weapon', label: 'Weapon' },
    { value: 'Armor', label: 'Armor' },
    { value: 'Accessory', label: 'Accessory' },
    { value: 'Consumable', label: 'Consumable' },
    { value: 'Miscellaneous', label: 'Miscellaneous' },
  ];

  const getCategoryColor = (category: ItemCategory) => {
    const colors: Record<ItemCategory, 'danger' | 'primary' | 'warning' | 'success' | 'secondary'> = {
      'Weapon': 'danger',
      'Armor': 'primary',
      'Accessory': 'warning',
      'Consumable': 'success',
      'Miscellaneous': 'secondary'
    };
    return colors[category] || 'secondary';
  };

  const filteredItems = itemTemplates?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleCreate = (data: CreateItemTemplateRequest) => {
    createItemTemplate.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleUpdate = (data: UpdateItemTemplateRequest) => {
    if (!editingItem) return;
    
    updateItemTemplate.mutate(
      { id: editingItem.id, data },
      {
        onSuccess: () => {
          setEditingItem(null);
        },
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteItemTemplate.mutate(id);
    }
  };

  const handleEdit = (item: ItemTemplate) => {
    setEditingItem(item);
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
        title="Manage Items"
        subtitle="Create and manage item templates for your characters"
        icon={Sword}
        action={{
          label: 'Add New Item',
          onClick: () => setIsCreateModalOpen(true),
          icon: Plus,
        }}
      />

      {}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const bonuses = [];
            if (item.strengthBonus) bonuses.push(`STR +${item.strengthBonus}`);
            if (item.dexterityBonus) bonuses.push(`DEX +${item.dexterityBonus}`);
            if (item.constitutionBonus) bonuses.push(`CON +${item.constitutionBonus}`);
            if (item.intelligenceBonus) bonuses.push(`INT +${item.intelligenceBonus}`);
            if (item.wisdomBonus) bonuses.push(`WIS +${item.wisdomBonus}`);
            if (item.charismaBonus) bonuses.push(`CHA +${item.charismaBonus}`);
            if (item.armorBonus) bonuses.push(`AC +${item.armorBonus}`);

            return (
              <Card key={item.id} hover className={!item.isActive ? 'opacity-75' : ''}>
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <Badge variant={getCategoryColor(item.category)}>{item.category}</Badge>
                  </div>
                  
                  {item.effect && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.effect}</p>
                  )}
                  
                  {bonuses.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {bonuses.map((bonus, index) => (
                          <Badge key={index} variant="success" size="sm">{bonus}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Badge variant={item.isActive ? 'success' : 'secondary'} size="sm">
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id, item.name)}
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
            <Sword className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 mb-6">
              {itemTemplates?.length === 0 
                ? "Start building your item library by creating your first template!"
                : "Try adjusting your search or filters."
              }
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Item
            </Button>
          </CardBody>
        </Card>
      )}

      {}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Item Template"
        size="2xl"
      >
        <ItemTemplateForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createItemTemplate.isLoading}
        />
      </Modal>

      {}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Item Template"
        size="2xl"
      >
        {editingItem && (
          <ItemTemplateForm
            onSubmit={handleUpdate}
            onCancel={() => setEditingItem(null)}
            isLoading={updateItemTemplate.isLoading}
            initialData={editingItem}
            isEdit
          />
        )}
      </Modal>
    </div>
  );
};
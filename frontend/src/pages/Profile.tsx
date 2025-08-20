
import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatGrid } from '@/components/ui/StatGrid';
import { Badge } from '@/components/ui/Badge';
import { useCharacters } from '@/hooks/useCharacters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { User, Trophy, Clock, Users } from 'lucide-react';

export const Profile: React.FC = () => {
  const { data: characters, isLoading } = useCharacters();

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
  const highestLevel = totalCharacters > 0 
    ? Math.max(...characters!.map(char => char.level))
    : 0;
  
  const classCounts = characters?.reduce((acc, char) => {
    acc[char.class] = (acc[char.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const profileStats = [
    { label: 'Total Characters', value: totalCharacters, color: 'primary' as const },
    { label: 'Average Level', value: avgLevel, color: 'success' as const },
    { label: 'Highest Level', value: highestLevel, color: 'warning' as const },
    { label: 'Total Spells', value: '0', color: 'primary' as const }, 
  ];

  const levelRanges = {
    '1-5': 0,
    '6-10': 0,
    '11-15': 0,
    '16-20': 0
  };

  characters?.forEach(char => {
    const level = char.level;
    if (level >= 1 && level <= 5) levelRanges['1-5']++;
    else if (level >= 6 && level <= 10) levelRanges['6-10']++;
    else if (level >= 11 && level <= 15) levelRanges['11-15']++;
    else if (level >= 16 && level <= 20) levelRanges['16-20']++;
  });

  const achievements = [
    {
      title: 'First Steps',
      description: 'Create your first character',
      icon: '👶',
      unlocked: totalCharacters >= 1
    },
    {
      title: 'Party Builder',
      description: 'Create 5 characters',
      icon: '👥',
      unlocked: totalCharacters >= 5
    },
    {
      title: 'Legendary Hero',
      description: 'Have a level 20 character',
      icon: '👑',
      unlocked: highestLevel === 20
    },
    {
      title: 'Class Collector',
      description: 'Have characters of 8 different classes',
      icon: '🎓',
      unlocked: Object.keys(classCounts).length >= 8
    }
  ];

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your D&D character management statistics"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Character Statistics
              </h3>
            </CardHeader>
            <CardBody>
              <StatGrid stats={profileStats} columns={4} className="mb-6" />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Class Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(classCounts)
                    .sort(([,a], [,b]) => b - a)
                    .map(([className, count]) => {
                      const percentage = (count / totalCharacters * 100).toFixed(1);
                      return (
                        <div key={className} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{className}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">
                              {count} ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Level Distribution</h4>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(levelRanges).map(([range, count]) => (
                    <div key={range} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600">Level {range}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
            </CardHeader>
            <CardBody>
              {characters && characters.length > 0 ? (
                <div className="space-y-3">
                  {characters.slice(0, 5).map((character) => (
                    <div key={character.id} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Created {character.name}</div>
                        <div className="text-xs text-gray-500">
                          Level {character.level} {character.class}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No activity yet</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Achievements
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-gray-600">{achievement.description}</div>
                      </div>
                      <Badge
                        variant={achievement.unlocked ? 'success' : 'secondary'}
                        size="sm"
                      >
                        {achievement.unlocked ? 'Unlocked' : 'Locked'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
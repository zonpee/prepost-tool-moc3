import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Hash } from 'lucide-react';
import { getAliasForGuid } from './types/FilterTypes';
import type { FilterData } from './types/FilterTypes';

interface CalculationTargetsProps {
  filters: FilterData;
}

export function CalculationTargets({ filters }: CalculationTargetsProps) {
  const { selectedGuids } = filters;
  
  if (selectedGuids.length === 0) {
    return (
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>計算対象: 全ユーザー</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-4 space-y-3">
      <h4 className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        計算対象 ({selectedGuids.length}件)
      </h4>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Hash className="w-3 h-3" />
          <span className="text-sm">GUID・エイリアス一覧</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {selectedGuids.map(guid => (
            <Badge key={guid} variant="outline" className="text-xs">
              {guid}
              <span className="ml-1 text-blue-600">({getAliasForGuid(guid)})</span>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        上記のGUIDに基づいてデータを集計・表示しています
      </div>
    </Card>
  );
}
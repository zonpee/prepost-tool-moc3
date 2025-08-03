import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar, Settings, Download, X, RefreshCw } from 'lucide-react';
import { buildingData, guidAliasMapping, getAliasForGuid } from './types/FilterTypes';
import type { FilterData } from './types/FilterTypes';

interface FilterPanelProps {
  onDownload: () => void;
  onFilterApply: (filters: FilterData) => void;
}

export function FilterPanel({ onDownload, onFilterApply }: FilterPanelProps) {
  // フィルタ状態
  const [building, setBuilding] = useState('building-a');
  const [floor, setFloor] = useState('floor-1');
  const [area, setArea] = useState('all-areas');
  const [selectedGuids, setSelectedGuids] = useState<string[]>([]);
  const [dateStart, setDateStart] = useState('2024-01-01');
  const [dateEnd, setDateEnd] = useState('2024-01-31');
  const [dayType, setDayType] = useState('all');
  const [timeStart, setTimeStart] = useState('09:00');
  const [timeEnd, setTimeEnd] = useState('18:00');
  const [stayMin, setStayMin] = useState('5');
  const [stayMax, setStayMax] = useState('120');

  const currentBuilding = buildingData[building as keyof typeof buildingData];
  const currentFloor = currentBuilding?.floors[floor as keyof typeof currentBuilding.floors];
  const availableFloors = currentBuilding ? Object.entries(currentBuilding.floors) : [];
  const availableAreas = currentFloor ? Object.entries(currentFloor.areas) : [];
  const availableGuids = currentFloor ? currentFloor.guids : [];

  // 建物が変更されたときの処理
  useEffect(() => {
    if (currentBuilding) {
      const firstFloor = Object.keys(currentBuilding.floors)[0];
      setFloor(firstFloor);
      setArea('all-areas');
      setSelectedGuids([]);
    }
  }, [building, currentBuilding]);

  // フロアが変更されたときの処理
  useEffect(() => {
    setArea('all-areas');
    setSelectedGuids([]);
  }, [floor]);

  const handleGuidToggle = (guid: string) => {
    setSelectedGuids(prev => 
      prev.includes(guid) 
        ? prev.filter(g => g !== guid)
        : [...prev, guid]
    );
  };

  const removeGuid = (guid: string) => {
    setSelectedGuids(prev => prev.filter(g => g !== guid));
  };

  const handleApplyFilters = () => {
    const filterData: FilterData = {
      building,
      floor,
      area,
      selectedGuids,
      dateRange: {
        start: dateStart,
        end: dateEnd
      },
      dayType,
      timeRange: {
        start: timeStart,
        end: timeEnd
      },
      stayDuration: {
        min: stayMin,
        max: stayMax
      }
    };
    onFilterApply(filterData);
  };

  const resetFilters = () => {
    setBuilding('building-a');
    setFloor('floor-1');
    setArea('all-areas');
    setSelectedGuids([]);
    setDateStart('2024-01-01');
    setDateEnd('2024-01-31');
    setDayType('all');
    setTimeStart('09:00');
    setTimeEnd('18:00');
    setStayMin('5');
    setStayMax('120');
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          フィルタ設定
        </h3>
        <Button onClick={onDownload} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          データダウンロード
        </Button>
      </div>

      {/* データ期間 */}
      <div className="space-y-2">
        <Label>データ期間</Label>
        <div className="flex gap-2">
          <Input 
            type="date" 
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            className="flex-1"
          />
          <Input 
            type="date" 
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* 日にち区分 */}
      <div className="space-y-2">
        <Label>日にち区分</Label>
        <Select value={dayType} onValueChange={setDayType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">期間全体</SelectItem>
            <SelectItem value="weekday">平日</SelectItem>
            <SelectItem value="holiday">祝休日</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 時間帯 */}
      <div className="space-y-2">
        <Label>時間帯</Label>
        <div className="flex gap-2">
          <Input 
            type="time" 
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            className="flex-1"
          />
          <Input 
            type="time" 
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* 滞在時間 */}
      <div className="space-y-2">
        <Label>滞在時間</Label>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="最小" 
            value={stayMin}
            onChange={(e) => setStayMin(e.target.value)}
            className="flex-1" 
          />
          <span className="text-sm">分以上</span>
          <Input 
            placeholder="最大" 
            value={stayMax}
            onChange={(e) => setStayMax(e.target.value)}
            className="flex-1" 
          />
          <span className="text-sm">分以下</span>
        </div>
      </div>

      {/* 属性条件 */}
      <div className="space-y-4">
        <Label>属性条件</Label>
        
        {/* 建物名 */}
        <div className="space-y-2">
          <Label>建物名</Label>
          <Select value={building} onValueChange={setBuilding}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(buildingData).map(([key, building]) => (
                <SelectItem key={key} value={key}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* フロア */}
        <div className="space-y-2">
          <Label>フロア</Label>
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableFloors.map(([key, floor]) => (
                <SelectItem key={key} value={key}>
                  {floor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* エリア名 */}
        <div className="space-y-2">
          <Label>エリア名</Label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-areas">全エリア</SelectItem>
              {availableAreas.map(([key, area]) => (
                <SelectItem key={key} value={key}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* GUID（複数選択） */}
        <div className="space-y-2">
          <Label>GUID（複数選択可）</Label>
          <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
            <div className="space-y-2">
              {availableGuids.map(guid => (
                <div key={guid} className="flex items-center space-x-2">
                  <Checkbox
                    id={`guid-${guid}`}
                    checked={selectedGuids.includes(guid)}
                    onCheckedChange={() => handleGuidToggle(guid)}
                  />
                  <Label htmlFor={`guid-${guid}`} className="text-sm flex-1">
                    {guid}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 選択されたGUIDとエイリアス表示 */}
          {selectedGuids.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">選択中のGUID・エイリアス:</Label>
              <div className="flex flex-wrap gap-1">
                {selectedGuids.map(guid => (
                  <Badge key={guid} variant="secondary" className="text-xs">
                    {guid} ({getAliasForGuid(guid)})
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => removeGuid(guid)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* フィルタ適用・リセットボタン */}
      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleApplyFilters} className="flex-1">
          フィルタ適用
        </Button>
        <Button onClick={resetFilters} variant="outline">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
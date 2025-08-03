import React, { useState } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { VisualizationSelector } from './components/VisualizationSelector';
import type { VisualizationType } from './components/VisualizationSelector';
import { MapVisualizations } from './components/visualizations/MapVisualizations';
import { GraphVisualizations } from './components/visualizations/GraphVisualizations';
import { Separator } from './components/ui/separator';
import type { FilterData } from './components/types/FilterTypes';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType>('heatmap');
  const [appliedFilters, setAppliedFilters] = useState<FilterData>({
    building: 'building-a',
    floor: 'floor-1',
    area: 'all-areas',
    selectedGuids: [],
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    dayType: 'all',
    timeRange: {
      start: '09:00',
      end: '18:00'
    },
    stayDuration: {
      min: '5',
      max: '120'
    }
  });

  const handleFilterApply = (filters: FilterData) => {
    setAppliedFilters(filters);
    toast.success('フィルタが適用されました', {
      description: `${filters.selectedGuids.length}件のGUIDが選択されています`
    });
  };

  const handleDownload = () => {
    // モックダウンロード機能
    const mockData = {
      filters: {
        dateRange: `${appliedFilters.dateRange.start} to ${appliedFilters.dateRange.end}`,
        dayType: appliedFilters.dayType,
        timeRange: `${appliedFilters.timeRange.start} to ${appliedFilters.timeRange.end}`,
        stayDuration: `${appliedFilters.stayDuration.min}-${appliedFilters.stayDuration.max}分`,
        building: appliedFilters.building,
        floor: appliedFilters.floor,
        area: appliedFilters.area,
        selectedGuids: appliedFilters.selectedGuids
      },
      visualizationType: selectedVisualization,
      exportTime: new Date().toISOString(),
      totalRecords: Math.floor(Math.random() * 10000) + 1000
    };

    // JSONファイルとしてダウンロードをシミュレート
    const dataStr = JSON.stringify(mockData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `indoor_analytics_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('データをダウンロードしました', {
      description: `${mockData.totalRecords}件のレコードを含むファイルをダウンロードしました。`
    });
  };

  const renderVisualization = () => {
    const mapTypes: VisualizationType[] = ['heatmap', 'cluster', 'trajectory', 'animation'];
    const graphTypes: VisualizationType[] = [
      'guid-timeline', 'guid-movement-stats', 'guid-area-distribution',
      'stay-time-distribution', 'area-cross-tabulation', 'area-time-ratio',
      'area-time-heatmap', 'area-time-comparison', 'floor-movement-analysis',
      'behavior-trends', 'hourly-activity', 'daily-movement-trend',
      'continuous-stay-detection', 'anomaly-detection'
    ];

    if (mapTypes.includes(selectedVisualization)) {
      return <MapVisualizations type={selectedVisualization as any} filters={appliedFilters} />;
    } else if (graphTypes.includes(selectedVisualization)) {
      return <GraphVisualizations type={selectedVisualization as any} filters={appliedFilters} />;
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* ヘッダー */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">屋内位置情報分析ツール</h1>
          <p className="text-muted-foreground mt-1">
            リアルタイム位置データの可視化と分析プラットフォーム
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
          {/* メインコンテンツエリア */}
          <div className="xl:col-span-3 space-y-6">
            {/* 可視化タイプセレクター */}
            <VisualizationSelector 
              selectedType={selectedVisualization}
              onTypeChange={setSelectedVisualization}
            />

            <Separator />

            {/* 可視化エリア */}
            <div className="min-h-[500px]">
              {renderVisualization()}
            </div>
          </div>

          {/* フィルタパネル（右側に移動） */}
          <div className="xl:col-span-1">
            <FilterPanel onDownload={handleDownload} onFilterApply={handleFilterApply} />
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 屋内位置情報分析ツール. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>最終更新: {new Date().toLocaleDateString('ja-JP')}</span>
              <span>|</span>
              <span>データ件数: {Math.floor(Math.random() * 10000) + 1000}件</span>
              {appliedFilters.selectedGuids.length > 0 && (
                <>
                  <span>|</span>
                  <span>選択中: {appliedFilters.selectedGuids.length}件のGUID</span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
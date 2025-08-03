import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Map, 
  BarChart3,
  Users,
  Route,
  Play,
  Clock,
  Calendar,
  PieChart,
  Activity,
  Layers,
  TrendingUp,
  User,
  Target,
  FlameKindling,
  Grid3X3,
  ArrowUpDown,
  Zap,
  AlertTriangle,
  Timer
} from 'lucide-react';

export type VisualizationType = 
  // マップ系
  | 'heatmap' 
  | 'cluster' 
  | 'trajectory' 
  | 'animation'
  // 個人レベル分析
  | 'guid-timeline'
  | 'guid-movement-stats'
  | 'guid-area-distribution'
  // エリアレベル分析
  | 'stay-time-distribution'
  | 'area-cross-tabulation'
  | 'area-time-ratio'
  | 'area-time-heatmap'
  | 'area-time-comparison'
  | 'floor-movement-analysis'
  // 時間分析
  | 'behavior-trends'
  | 'hourly-activity'
  | 'daily-movement-trend'
  // 異常分析
  | 'continuous-stay-detection'
  | 'anomaly-detection';

interface VisualizationSelectorProps {
  selectedType: VisualizationType;
  onTypeChange: (type: VisualizationType) => void;
}

export function VisualizationSelector({ selectedType, onTypeChange }: VisualizationSelectorProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'graph'>('map');

  const mapVisualizations = [
    { 
      type: 'heatmap' as VisualizationType, 
      label: 'ヒートマップ', 
      icon: Map,
      description: '人の密度を色の濃淡で表現'
    },
    { 
      type: 'cluster' as VisualizationType, 
      label: 'クラスターマップ', 
      icon: Users,
      description: '人の集合パターンを可視化'
    },
    { 
      type: 'trajectory' as VisualizationType, 
      label: 'トラジェクトリーマップ', 
      icon: Route,
      description: '移動経路を線で表示'
    },
    { 
      type: 'animation' as VisualizationType, 
      label: 'アニメーションマップ', 
      icon: Play,
      description: '時系列での移動をアニメーション表示'
    }
  ];

  const graphVisualizations = [
    // 個人レベル分析
    { 
      type: 'guid-timeline' as VisualizationType, 
      label: 'GUIDタイムライン', 
      icon: Clock,
      description: 'GUIDごとのエリア滞在タイムライン（例：9:00～10:00 エリアA）',
      category: '個人レベル分析'
    },
    { 
      type: 'guid-movement-stats' as VisualizationType, 
      label: 'GUID移動統計', 
      icon: BarChart3,
      description: 'GUIDごとの移動回数と滞在時間の棒グラフ',
      category: '個人レベル分析'
    },
    { 
      type: 'guid-area-distribution' as VisualizationType, 
      label: 'GUIDエリア分布', 
      icon: PieChart,
      description: 'GUIDごとの滞在エリア分布円グラフ',
      category: '個人レベル分析'
    },
    
    // エリアレベル分析
    { 
      type: 'stay-time-distribution' as VisualizationType, 
      label: '滞在時間分布', 
      icon: Layers,
      description: '滞在時間の分布を箱ひげ図で表示',
      category: 'エリアレベル分析'
    },
    { 
      type: 'area-cross-tabulation' as VisualizationType, 
      label: 'エリア間移動集計', 
      icon: Grid3X3,
      description: 'エリア間の訪問頻度クロス集計（例：看護室→薬剤エリア）',
      category: 'エリアレベル分析'
    },
    { 
      type: 'area-time-ratio' as VisualizationType, 
      label: 'エリア滞在割合', 
      icon: Target,
      description: 'エリア別滞在時間の割合を円グラフで表示',
      category: 'エリアレベル分析'
    },
    { 
      type: 'area-time-heatmap' as VisualizationType, 
      label: 'エリア滞在ヒートマップ', 
      icon: FlameKindling,
      description: 'エリア別滞在時間をヒートマップで可視化',
      category: 'エリアレベル分析'
    },
    { 
      type: 'area-time-comparison' as VisualizationType, 
      label: 'エリア滞在比較', 
      icon: BarChart3,
      description: 'エリア別滞在時間の分布とばらつきを箱ひげ図で比較',
      category: 'エリアレベル分析'
    },
    { 
      type: 'floor-movement-analysis' as VisualizationType, 
      label: 'フロア間移動分析', 
      icon: ArrowUpDown,
      description: 'フロア間移動回数分析による垂直移動負荷の把握',
      category: 'エリアレベル分析'
    },
    
    // 時間分析
    { 
      type: 'behavior-trends' as VisualizationType, 
      label: '行動傾向分析', 
      icon: Calendar,
      description: '曜日・時間帯別の行動傾向をヒートマップで表示',
      category: '時間分析'
    },
    { 
      type: 'hourly-activity' as VisualizationType, 
      label: '時間帯別活動', 
      icon: Activity,
      description: '時間帯別の移動回数・滞在時間で混雑度を把握',
      category: '時間分析'
    },
    { 
      type: 'daily-movement-trend' as VisualizationType, 
      label: '日別移動推移', 
      icon: TrendingUp,
      description: '日時別移動回数の推移を折れ線グラフで表示',
      category: '時間分析'
    },
    
    // 異常分析
    { 
      type: 'continuous-stay-detection' as VisualizationType, 
      label: '連続滞在検出', 
      icon: Timer,
      description: '同一エリア連続滞在の検出による業務集中度分析',
      category: '異常分析'
    },
    { 
      type: 'anomaly-detection' as VisualizationType, 
      label: '異常行動検出', 
      icon: AlertTriangle,
      description: '通常と異なる移動パターンの検出（短時間多エリア移動等）',
      category: '異常分析'
    }
  ];

  // 現在選択されているタイプに基づいてアクティブタブを設定
  useEffect(() => {
    const mapTypes = mapVisualizations.map(v => v.type);
    const graphTypes = graphVisualizations.map(v => v.type);
    
    if (mapTypes.includes(selectedType)) {
      setActiveTab('map');
    } else if (graphTypes.includes(selectedType)) {
      setActiveTab('graph');
    }
  }, [selectedType]);

  const handleTabChange = (value: string) => {
    const newTab = value as 'map' | 'graph';
    setActiveTab(newTab);
    
    // タブ変更時に各カテゴリーの最初のアイテムを選択
    if (newTab === 'map') {
      onTypeChange(mapVisualizations[0].type);
    } else {
      onTypeChange(graphVisualizations[0].type);
    }
  };

  const getCurrentVisualization = (category: 'map' | 'graph') => {
    const visualizations = category === 'map' ? mapVisualizations : graphVisualizations;
    return visualizations.find(v => v.type === selectedType) || visualizations[0];
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="mb-2">可視化タイプ選択</h3>
        <p className="text-sm text-muted-foreground">
          カテゴリーを選択してから、具体的な可視化タイプをお選びください
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            マップ系
            <Badge variant="secondary" className="text-xs ml-1">
              {mapVisualizations.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="graph" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            グラフ系
            <Badge variant="secondary" className="text-xs ml-1">
              {graphVisualizations.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              <h4>マップ系可視化</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              フロアプラン上での位置データを様々な形式で可視化します
            </p>
            
            <Select 
              value={activeTab === 'map' ? selectedType : mapVisualizations[0].type}
              onValueChange={(value) => onTypeChange(value as VisualizationType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(() => {
                    const current = getCurrentVisualization('map');
                    const Icon = current.icon;
                    return (
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {current.label}
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {mapVisualizations.map(({ type, label, icon: Icon, description }) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span>{label}</span>
                        <span className="text-xs text-muted-foreground">{description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="graph" className="mt-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4>グラフ系可視化</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              統計グラフとチャートによる定量的な分析と比較を行います
            </p>
            
            <Select 
              value={activeTab === 'graph' ? selectedType : graphVisualizations[0].type}
              onValueChange={(value) => onTypeChange(value as VisualizationType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(() => {
                    const current = getCurrentVisualization('graph');
                    const Icon = current.icon;
                    return (
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {current.label}
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {graphVisualizations.map(({ type, label, icon: Icon, description }) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div className="flex flex-col">
                        <span>{label}</span>
                        <span className="text-xs text-muted-foreground">{description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {/* 現在選択中の可視化の詳細情報 */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-start gap-3">
          {(() => {
            const allVisualizations = [...mapVisualizations, ...graphVisualizations];
            const current = allVisualizations.find(v => v.type === selectedType);
            if (!current) return null;
            
            const Icon = current.icon;
            return (
              <>
                <Icon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h5 className="font-medium">{current.label}</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    {current.description}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </Card>
  );
}
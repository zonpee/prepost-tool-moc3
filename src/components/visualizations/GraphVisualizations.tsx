import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { CalculationTargets } from '../CalculationTargets';
import type { FilterData } from '../types/FilterTypes';
import { getAliasForGuid } from '../types/FilterTypes';

interface GraphVisualizationsProps {
  type: 'guid-timeline' | 'guid-movement-stats' | 'guid-area-distribution' | 
        'stay-time-distribution' | 'area-cross-tabulation' | 'area-time-ratio' | 
        'area-time-heatmap' | 'area-time-comparison' | 'floor-movement-analysis' |
        'behavior-trends' | 'hourly-activity' | 'daily-movement-trend' |
        'continuous-stay-detection' | 'anomaly-detection';
  filters: FilterData;
}

export function GraphVisualizations({ type, filters }: GraphVisualizationsProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c'];
  const areas = ['エントランス', 'オフィス', '会議室A', '会議室B', 'カフェ', '休憩室', '薬剤エリア', '看護室'];

  // 個人レベル分析: GUIDタイムラインデータ
  const guidTimelineData = useMemo(() => {
    const selectedGuids = filters.selectedGuids.length > 0 ? filters.selectedGuids : ['GUID-A1-001', 'GUID-A1-002'];
    const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];
    
    return selectedGuids.map(guid => {
      const alias = getAliasForGuid(guid);
      return timeSlots.map((timeSlot, index) => {
        // 時間帯に基づいてエリアをランダム選択（業務パターンをシミュレート）
        const areaIndex = Math.floor(Math.sin(index + guid.charCodeAt(0)) * areas.length / 2 + areas.length / 2);
        return {
          guid: `${guid} (${alias})`,
          timeSlot,
          area: areas[areaIndex % areas.length],
          duration: Math.floor(Math.random() * 45 + 15) // 15-60分
        };
      });
    }).flat();
  }, [filters.selectedGuids]);

  // GUID移動統計データ
  const guidMovementStatsData = useMemo(() => {
    const selectedGuids = filters.selectedGuids.length > 0 ? filters.selectedGuids : ['GUID-A1-001', 'GUID-A1-002', 'GUID-A2-001'];
    
    return selectedGuids.map((guid, index) => {
      const alias = getAliasForGuid(guid);
      return {
        guid: `${guid} (${alias})`,
        移動回数: Math.floor(Math.random() * 50 + 20),
        総滞在時間: Math.floor(Math.random() * 300 + 200),
        平均滞在時間: Math.floor(Math.random() * 30 + 15)
      };
    });
  }, [filters.selectedGuids]);

  // GUIDエリア分布データ
  const guidAreaDistributionData = useMemo(() => {
    return areas.map((area, index) => ({
      name: area,
      value: Math.floor(Math.random() * 100 + 50),
      percentage: ((Math.random() * 30 + 10)).toFixed(1)
    }));
  }, [filters.selectedGuids]);

  // エリア間移動クロス集計データ
  const areaCrossTabData = useMemo(() => {
    const crossData = [];
    areas.forEach(fromArea => {
      areas.forEach(toArea => {
        if (fromArea !== toArea) {
          crossData.push({
            from: fromArea,
            to: toArea,
            count: Math.floor(Math.random() * 30 + 5)
          });
        }
      });
    });
    return crossData.sort((a, b) => b.count - a.count).slice(0, 15); // 上位15件
  }, []);

  // 時間分析データ
  const behaviorTrendsData = useMemo(() => {
    const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9-18時
    const days = ['月', '火', '水', '木', '金'];
    const data = [];
    
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        const intensity = Math.sin((dayIndex + hour) * 0.3) * 0.5 + 0.5;
        data.push({
          day,
          hour,
          intensity,
          value: Math.floor(intensity * 100)
        });
      });
    });
    return data;
  }, []);

  // 連続滞在検出データ
  const continuousStayData = useMemo(() => {
    const selectedGuids = filters.selectedGuids.length > 0 ? filters.selectedGuids : ['GUID-A1-001', 'GUID-A1-002'];
    
    return selectedGuids.map(guid => {
      const alias = getAliasForGuid(guid);
      return areas.map(area => ({
        guid: `${guid} (${alias})`,
        area,
        continuousMinutes: Math.floor(Math.random() * 120 + 30),
        isAbnormal: Math.random() > 0.7
      }));
    }).flat().sort((a, b) => b.continuousMinutes - a.continuousMinutes);
  }, [filters.selectedGuids]);

  // 異常行動検出データ
  const anomalyDetectionData = useMemo(() => {
    const selectedGuids = filters.selectedGuids.length > 0 ? filters.selectedGuids : ['GUID-A1-001', 'GUID-A1-002'];
    
    return selectedGuids.map(guid => {
      const alias = getAliasForGuid(guid);
      const anomalies = [];
      
      // 短時間多エリア移動
      if (Math.random() > 0.5) {
        anomalies.push({
          guid: `${guid} (${alias})`,
          type: '短時間多エリア移動',
          description: '10分間で5つのエリアを移動',
          severity: 'high',
          timestamp: '14:25'
        });
      }
      
      // 長時間同一エリア滞在
      if (Math.random() > 0.6) {
        anomalies.push({
          guid: `${guid} (${alias})`,
          type: '長時間同一エリア滞在',
          description: 'オフィスで180分連続滞在',
          severity: 'medium',
          timestamp: '11:00'
        });
      }
      
      return anomalies;
    }).flat();
  }, [filters.selectedGuids]);

  const getIntensityColor = (intensity: number) => {
    const colors = [
      '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', 
      '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'
    ];
    const index = Math.floor(intensity * (colors.length - 1));
    return colors[index];
  };

  // GUIDタイムライン表示
  const renderGuidTimeline = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">GUID</th>
              <th className="border border-gray-300 p-2">時間帯</th>
              <th className="border border-gray-300 p-2">滞在エリア</th>
              <th className="border border-gray-300 p-2">滞在時間</th>
            </tr>
          </thead>
          <tbody>
            {guidTimelineData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{entry.guid}</td>
                <td className="border border-gray-300 p-2">{entry.timeSlot}</td>
                <td className="border border-gray-300 p-2">
                  <Badge variant="outline">{entry.area}</Badge>
                </td>
                <td className="border border-gray-300 p-2">{entry.duration}分</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // GUID移動統計
  const renderGuidMovementStats = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={guidMovementStatsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="guid" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="移動回数" fill="#8884d8" name="移動回数" />
        <Bar dataKey="平均滞在時間" fill="#82ca9d" name="平均滞在時間(分)" />
      </BarChart>
    </ResponsiveContainer>
  );

  // GUIDエリア分布
  const renderGuidAreaDistribution = () => (
    <div className="flex items-center gap-8">
      <ResponsiveContainer width="60%" height={400}>
        <PieChart>
          <Pie
            data={guidAreaDistributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {guidAreaDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex-1">
        <h4 className="mb-4">選択GUID エリア別滞在分布</h4>
        <div className="space-y-2">
          {guidAreaDistributionData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="flex-1">{entry.name}</span>
              <span className="text-sm">{entry.value}回 ({entry.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // エリア間移動クロス集計
  const renderAreaCrossTabulation = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">移動元</th>
              <th className="border border-gray-300 p-2">移動先</th>
              <th className="border border-gray-300 p-2">訪問回数</th>
              <th className="border border-gray-300 p-2">傾向</th>
            </tr>
          </thead>
          <tbody>
            {areaCrossTabData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  <Badge variant="outline">{entry.from}</Badge>
                </td>
                <td className="border border-gray-300 p-2">
                  <Badge variant="outline">{entry.to}</Badge>
                </td>
                <td className="border border-gray-300 p-2 text-center">{entry.count}回</td>
                <td className="border border-gray-300 p-2">
                  {entry.count > 20 ? (
                    <Badge variant="destructive">高頻度</Badge>
                  ) : entry.count > 10 ? (
                    <Badge variant="secondary">中頻度</Badge>
                  ) : (
                    <Badge variant="outline">低頻度</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 行動傾向ヒートマップ
  const renderBehaviorTrends = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-11 gap-1 text-xs">
        <div></div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="text-center font-medium">{i + 9}時</div>
        ))}
        
        {['月', '火', '水', '木', '金'].map(day => (
          <React.Fragment key={day}>
            <div className="text-right pr-2 font-medium">{day}</div>
            {Array.from({ length: 10 }, (_, hour) => {
              const cell = behaviorTrendsData.find(d => d.day === day && d.hour === hour + 9);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-xs cursor-pointer hover:border-gray-400 transition-colors"
                  style={{ 
                    backgroundColor: getIntensityColor(cell?.intensity || 0),
                    color: (cell?.intensity || 0) > 0.5 ? 'white' : 'black'
                  }}
                  title={`${day} ${hour + 9}:00 - 活動度: ${cell?.value || 0}%`}
                >
                  {cell?.value || 0}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">低</span>
        <div className="flex">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="w-4 h-4 border border-gray-300"
              style={{ backgroundColor: getIntensityColor(i / 8) }}
            />
          ))}
        </div>
        <span className="text-sm">高</span>
      </div>
    </div>
  );

  // 連続滞在検出
  const renderContinuousStayDetection = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">GUID</th>
              <th className="border border-gray-300 p-2">エリア</th>
              <th className="border border-gray-300 p-2">連続滞在時間</th>
              <th className="border border-gray-300 p-2">状態</th>
            </tr>
          </thead>
          <tbody>
            {continuousStayData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{entry.guid}</td>
                <td className="border border-gray-300 p-2">
                  <Badge variant="outline">{entry.area}</Badge>
                </td>
                <td className="border border-gray-300 p-2 text-center">{entry.continuousMinutes}分</td>
                <td className="border border-gray-300 p-2">
                  {entry.isAbnormal ? (
                    <Badge variant="destructive">要注意</Badge>
                  ) : entry.continuousMinutes > 90 ? (
                    <Badge variant="secondary">集中作業</Badge>
                  ) : (
                    <Badge variant="outline">正常</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 異常行動検出
  const renderAnomalyDetection = () => (
    <div className="space-y-4">
      {anomalyDetectionData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          選択期間中に異常行動は検出されませんでした
        </div>
      ) : (
        <div className="space-y-3">
          {anomalyDetectionData.map((anomaly, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                      {anomaly.severity === 'high' ? '高' : '中'}
                    </Badge>
                    <span className="font-medium">{anomaly.type}</span>
                    <span className="text-sm text-muted-foreground">{anomaly.timestamp}</span>
                  </div>
                  <p className="text-sm">{anomaly.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">GUID: {anomaly.guid}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );



  const getTitle = () => {
    switch (type) {
      // 個人レベル分析
      case 'guid-timeline': return 'GUIDタイムライン - 時間帯別エリア滞在状況';
      case 'guid-movement-stats': return 'GUID移動統計 - 移動回数と滞在時間';
      case 'guid-area-distribution': return 'GUIDエリア分布 - エリア別滞在割合';
      
      // エリアレベル分析
      case 'stay-time-distribution': return '滞在時間分布 - 箱ひげ図';
      case 'area-cross-tabulation': return 'エリア間移動クロス集計';
      case 'area-time-ratio': return 'エリア別滞在時間割合 - 円グラフ';
      case 'area-time-heatmap': return 'エリア別滞在時間ヒートマップ';
      case 'area-time-comparison': return 'エリア別滞在時間比較 - 箱ひげ図';
      case 'floor-movement-analysis': return 'フロア間移動分析';
      
      // 時間分析
      case 'behavior-trends': return '行動傾向分析 - 曜日・時間帯別ヒートマップ';
      case 'hourly-activity': return '時間帯別活動分析';
      case 'daily-movement-trend': return '日別移動推移 - 折れ線グラフ';
      
      // 異常分析
      case 'continuous-stay-detection': return '連続滞在検出 - 業務集中度分析';
      case 'anomaly-detection': return '異常行動検出 - パターン分析';
      
      default: return 'グラフ分析';
    }
  };

  const getDescription = () => {
    switch (type) {
      // 個人レベル分析
      case 'guid-timeline': return '選択されたGUIDの時間帯別エリア滞在パターンを表形式で詳細表示';
      case 'guid-movement-stats': return 'GUIDごとの移動回数と滞在時間を棒グラフで比較';
      case 'guid-area-distribution': return '選択されたGUIDのエリア別滞在分布を円グラフで可視化';
      
      // エリアレベル分析
      case 'stay-time-distribution': return '全体の滞在時間分布を箱ひげ図で統計的に表示';
      case 'area-cross-tabulation': return 'エリア間の移動パターンを集計し、高頻度の移動経路を特定';
      case 'area-time-ratio': return 'エリア別の総滞在時間の割合を円グラフで表示';
      case 'area-time-heatmap': return 'エリア別の滞在時間をヒートマップで色分け表示';
      case 'area-time-comparison': return 'エリアごとの滞在時間のばらつきと分布を箱ひげ図で比較';
      case 'floor-movement-analysis': return 'フロア間移動の回数分析による垂直移動負荷の把握';
      
      // 時間分析
      case 'behavior-trends': return '曜日と時間帯の組み合わせによる行動傾向をヒートマップで可視化';
      case 'hourly-activity': return '時間帯別の移動回数・滞在時間で混雑度や業務集中時間を把握';
      case 'daily-movement-trend': return '日別の移動回数推移を折れ線グラフで時系列分析';
      
      // 異常分析
      case 'continuous-stay-detection': return '同一エリアでの連続滞在時間を検出し、業務集中度や休憩傾向を分析';
      case 'anomaly-detection': return '通常と異なる移動パターンを検出し、業務異常やトラブルの兆候を特定';
      
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* 計算対象表示 */}
      <CalculationTargets filters={filters} />
      
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="mb-2">{getTitle()}</h3>
          <p className="text-muted-foreground">{getDescription()}</p>
        </div>
        
        <div className="w-full">
          {/* 個人レベル分析 */}
          {type === 'guid-timeline' && renderGuidTimeline()}
          {type === 'guid-movement-stats' && renderGuidMovementStats()}
          {type === 'guid-area-distribution' && renderGuidAreaDistribution()}
          
          {/* エリアレベル分析 */}
          {type === 'stay-time-distribution' && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={[
                {range: '0-15分', count: 45},
                {range: '15-30分', count: 78},
                {range: '30-60分', count: 92},
                {range: '60-120分', count: 67},
                {range: '120分以上', count: 23}
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {type === 'area-cross-tabulation' && renderAreaCrossTabulation()}
          {type === 'area-time-ratio' && renderGuidAreaDistribution()}
          {type === 'area-time-heatmap' && renderBehaviorTrends()}
          {type === 'area-time-comparison' && (
            <div className="text-center py-8 text-muted-foreground">
              エリア別滞在時間の箱ひげ図比較（実装予定）
            </div>
          )}
          {type === 'floor-movement-analysis' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <div className="text-sm">1階→2階移動</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-sm">2階→3階移動</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-orange-600">31</div>
                  <div className="text-sm">階段利用回数</div>
                </div>
              </div>
            </div>
          )}
          
          {/* 時間分析 */}
          {type === 'behavior-trends' && renderBehaviorTrends()}
          {type === 'hourly-activity' && (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={Array.from({length: 10}, (_, i) => ({
                time: `${i + 9}:00`,
                移動回数: Math.floor(Math.random() * 50 + 20),
                滞在時間: Math.floor(Math.random() * 60 + 30)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="移動回数" fill="#8884d8" />
                <Line type="monotone" dataKey="滞在時間" stroke="#ff7300" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
          {type === 'daily-movement-trend' && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={Array.from({length: 30}, (_, i) => ({
                date: `1/${i + 1}`,
                移動回数: Math.floor(Math.random() * 100 + 50)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="移動回数" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
          
          {/* 異常分析 */}
          {type === 'continuous-stay-detection' && renderContinuousStayDetection()}
          {type === 'anomaly-detection' && renderAnomalyDetection()}
        </div>
      </Card>
    </div>
  );
}
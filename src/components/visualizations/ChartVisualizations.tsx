import React, { useMemo } from 'react';
import { Card } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { CalculationTargets } from '../CalculationTargets';
import type { FilterData } from '../types/FilterTypes';

interface ChartVisualizationsProps {
  type: 'timeline' | 'hourly-heatmap' | 'weekday-activity' | 'stay-histogram';
  filters: FilterData;
}

export function ChartVisualizations({ type, filters }: ChartVisualizationsProps) {
  // 固定データ生成（フィルタに基づいて調整）
  const timelineData = useMemo(() => {
    const areas = ['エントランス', 'オフィス', '会議室', 'カフェ'];
    const data = [];
    const filterFactor = filters.selectedGuids.length > 0 ? 0.6 + (filters.selectedGuids.length * 0.1) : 1;
    
    for (let hour = 9; hour <= 18; hour++) {
      const dataPoint: any = { time: `${hour}:00` };
      areas.forEach((area, index) => {
        const baseValue = hour >= 12 && hour <= 14 ? 30 : 20;
        const areaFactor = 1 + Math.sin((hour + index) * 0.5) * 0.3;
        dataPoint[area] = Math.floor(baseValue * areaFactor * filterFactor);
      });
      data.push(dataPoint);
    }
    return data;
  }, [filters.selectedGuids.length]);

  const heatmapData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['月', '火', '水', '木', '金', '土', '日'];
    const data = [];
    
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        const baseActivity = hour >= 9 && hour <= 18 ? 0.7 : 0.2;
        const weekendFactor = dayIndex >= 5 ? 0.3 : 1;
        const hourFactor = hour === 12 || hour === 13 ? 1.2 : 1;
        const filterFactor = filters.selectedGuids.length > 0 ? 0.7 : 1;
        
        const intensity = Math.min(1, Math.max(0, 
          (baseActivity + Math.sin((dayIndex + hour) * 0.2) * 0.3) * weekendFactor * hourFactor * filterFactor
        ));
        
        data.push({
          day,
          hour,
          intensity,
          value: Math.floor(intensity * 100)
        });
      });
    });
    return data;
  }, [filters.selectedGuids.length]);

  const weekdayData = useMemo(() => {
    const days = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];
    const filterFactor = filters.selectedGuids.length > 0 ? 0.7 : 1;
    
    return days.map((day, index) => {
      const isWeekend = index >= 5;
      const baseFactor = isWeekend ? 0.4 : 1;
      const dayFactor = 1 + Math.sin(index * 0.8) * 0.3;
      
      return {
        day,
        移動回数: Math.floor((100 + index * 20) * baseFactor * dayFactor * filterFactor),
        平均滞在時間: 25 + Math.floor(Math.sin(index * 0.5) * 10),
        総移動距離: Math.floor((500 + index * 100) * baseFactor * dayFactor * filterFactor)
      };
    });
  }, [filters.selectedGuids.length]);

  const histogramData = useMemo(() => {
    const ranges = ['0-5分', '5-15分', '15-30分', '30-60分', '60-120分', '120分以上'];
    const weights = [10, 30, 40, 35, 20, 5];
    const filterFactor = filters.selectedGuids.length > 0 ? 0.8 : 1;
    
    return ranges.map((range, index) => ({
      range,
      count: Math.floor(weights[index] * filterFactor) + Math.floor(Math.sin(index) * 5)
    }));
  }, [filters.selectedGuids.length]);

  const getIntensityColor = (intensity: number) => {
    const colors = [
      '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', 
      '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'
    ];
    const index = Math.floor(intensity * (colors.length - 1));
    return colors[index];
  };

  const renderTimeline = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="エントランス" stroke="#8884d8" strokeWidth={2} />
        <Line type="monotone" dataKey="オフィス" stroke="#82ca9d" strokeWidth={2} />
        <Line type="monotone" dataKey="会議室" stroke="#ffc658" strokeWidth={2} />
        <Line type="monotone" dataKey="カフェ" stroke="#ff7300" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderHourlyHeatmap = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-25 gap-1 text-xs">
        <div></div>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="text-center font-medium">{i}</div>
        ))}
        
        {['月', '火', '水', '木', '金', '土', '日'].map(day => (
          <React.Fragment key={day}>
            <div className="text-right pr-2 font-medium">{day}</div>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = heatmapData.find(d => d.day === day && d.hour === hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="w-6 h-6 border border-gray-200 flex items-center justify-center text-xs cursor-pointer hover:border-gray-400 transition-colors"
                  style={{ 
                    backgroundColor: getIntensityColor(cell?.intensity || 0),
                    color: (cell?.intensity || 0) > 0.5 ? 'white' : 'black'
                  }}
                  title={`${day} ${hour}:00 - 活動度: ${cell?.value || 0}%`}
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

  const renderWeekdayActivity = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={weekdayData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="移動回数" fill="#8884d8" />
        <Bar dataKey="平均滞在時間" fill="#82ca9d" />
        <Bar dataKey="総移動距離" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderStayHistogram = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={histogramData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8">
          {histogramData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const getTitle = () => {
    switch (type) {
      case 'timeline': return 'タイムラインチャート';
      case 'hourly-heatmap': return '時間帯別ヒートマップ';
      case 'weekday-activity': return '曜日別アクティビティチャート';
      case 'stay-histogram': return '滞在時間ヒストグラム';
      default: return 'チャート';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'timeline': return '時系列でエリアごとの人数を表示';
      case 'hourly-heatmap': return '時間帯ごとの滞在傾向を色で表現';
      case 'weekday-activity': return '曜日ごとの移動傾向を比較';
      case 'stay-histogram': return '各エリアでの滞在時間の分布';
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
          {type === 'timeline' && renderTimeline()}
          {type === 'hourly-heatmap' && renderHourlyHeatmap()}
          {type === 'weekday-activity' && renderWeekdayActivity()}
          {type === 'stay-histogram' && renderStayHistogram()}
        </div>
      </Card>
    </div>
  );
}
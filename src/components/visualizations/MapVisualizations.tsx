import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { CalculationTargets } from '../CalculationTargets';
import type { FilterData } from '../types/FilterTypes';

interface MapVisualizationsProps {
  type: 'heatmap' | 'cluster' | 'trajectory' | 'animation';
  filters: FilterData;
}

export function MapVisualizations({ type, filters }: MapVisualizationsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // 固定モックデータ（フィルタに基づいて調整）
  const mockData = useMemo(() => {
    const baseData = [];
    const dataCount = filters.selectedGuids.length > 0 ? Math.min(filters.selectedGuids.length * 10, 100) : 100;
    
    for (let i = 0; i < dataCount; i++) {
      baseData.push({
        id: `point-${i}`,
        x: 50 + (Math.sin(i * 0.1) + 1) * 250 + Math.cos(i * 0.05) * 100,
        y: 50 + (Math.cos(i * 0.1) + 1) * 150 + Math.sin(i * 0.08) * 75,
        intensity: 0.3 + Math.sin(i * 0.2) * 0.4 + 0.3,
        cluster: Math.floor(i / 20) % 5,
        timestamp: 1704067200000 + (i * 3600000), // 2024-01-01からの1時間間隔
        userId: filters.selectedGuids.length > 0 ? 
          filters.selectedGuids[i % filters.selectedGuids.length] : 
          `user-${(i % 20) + 1}`,
        area: ['エントランス', 'オフィス', '会議室', 'カフェ'][i % 4]
      });
    }
    return baseData;
  }, [filters.selectedGuids]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 建物のフロアプランを描画
    drawFloorPlan(ctx);

    switch (type) {
      case 'heatmap':
        drawHeatmap(ctx, mockData);
        break;
      case 'cluster':
        drawClusterMap(ctx, mockData);
        break;
      case 'trajectory':
        drawTrajectoryMap(ctx, mockData);
        break;
      case 'animation':
        drawAnimationMap(ctx, mockData, animationStep);
        break;
    }
  }, [type, animationStep, mockData]);

  const drawFloorPlan = (ctx: CanvasRenderingContext2D) => {
    // 外壁
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 500, 300);

    // 部屋の仕切り
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.font = '12px sans-serif';
    
    // エントランス
    ctx.strokeRect(50, 50, 100, 80);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(51, 51, 98, 78);
    ctx.fillStyle = '#333';
    ctx.fillText('エントランス', 70, 95);

    // オフィス
    ctx.strokeRect(150, 50, 200, 150);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(151, 51, 198, 148);
    ctx.fillStyle = '#333';
    ctx.fillText('オフィス', 230, 130);

    // 会議室
    ctx.strokeRect(350, 50, 100, 80);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(351, 51, 98, 78);
    ctx.fillStyle = '#333';
    ctx.fillText('会議室', 380, 95);

    // カフェ
    ctx.strokeRect(450, 50, 100, 150);
    ctx.fillStyle = '#e8f5e8';
    ctx.fillRect(451, 51, 98, 148);
    ctx.fillStyle = '#333';
    ctx.fillText('カフェ', 485, 130);

    // 廊下
    ctx.strokeRect(50, 130, 500, 70);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(51, 131, 498, 68);
    ctx.fillStyle = '#333';
    ctx.fillText('廊下', 290, 170);
  };

  const drawHeatmap = (ctx: CanvasRenderingContext2D, data: any[]) => {
    data.forEach(point => {
      const intensity = point.intensity;
      const radius = 30;
      
      // グラデーションを作成
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 0, ${intensity * 0.4})`);
      gradient.addColorStop(1, `rgba(255, 255, 0, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawClusterMap = (ctx: CanvasRenderingContext2D, data: any[]) => {
    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff'];
    
    data.forEach(point => {
      ctx.fillStyle = colors[point.cluster];
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // クラスター番号
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText(point.cluster.toString(), point.x - 3, point.y + 3);
    });
  };

  const drawTrajectoryMap = (ctx: CanvasRenderingContext2D, data: any[]) => {
    // データを時系列でソート
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    sortedData.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();
    
    // 開始点と終了点をマーク
    if (sortedData.length > 0) {
      // 開始点（緑）
      ctx.fillStyle = '#4caf50';
      ctx.beginPath();
      ctx.arc(sortedData[0].x, sortedData[0].y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // 終了点（赤）
      ctx.fillStyle = '#f44336';
      ctx.beginPath();
      ctx.arc(sortedData[sortedData.length - 1].x, sortedData[sortedData.length - 1].y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawAnimationMap = (ctx: CanvasRenderingContext2D, data: any[], step: number) => {
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    const maxStep = sortedData.length;
    const currentIndex = Math.floor((step / 100) * maxStep);
    
    // 軌跡を描画
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < currentIndex && i < sortedData.length; i++) {
      const point = sortedData[i];
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    
    ctx.stroke();
    
    // 現在位置
    if (currentIndex < sortedData.length) {
      const currentPoint = sortedData[currentIndex];
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // パルス効果
      ctx.strokeStyle = '#ff9800';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, 12 + Math.sin(step / 10) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const startAnimation = () => {
    setIsAnimating(true);
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 100) {
          setIsAnimating(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    setAnimationStep(0);
    setIsAnimating(false);
  };

  const getTitle = () => {
    switch (type) {
      case 'heatmap': return 'ヒートマップ';
      case 'cluster': return 'クラスターマップ';
      case 'trajectory': return 'トラジェクトリーマップ';
      case 'animation': return 'アニメーションマップ';
      default: return 'マップ';
    }
  };

  return (
    <div className="space-y-4">
      {/* 計算対象表示 */}
      <CalculationTargets filters={filters} />
      
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="mb-1">{getTitle()}</h3>
            <p className="text-sm text-muted-foreground">
              表示データ数: {mockData.length}件
            </p>
          </div>
          {type === 'animation' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isAnimating ? stopAnimation : startAnimation}
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={resetAnimation}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full h-auto border"
          />
        </div>
        
        {type === 'animation' && (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">進行度:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${animationStep}%` }}
                />
              </div>
              <span className="text-sm">{animationStep}%</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
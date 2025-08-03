export interface FilterData {
  building: string;
  floor: string;
  area: string;
  selectedGuids: string[];
  dateRange: {
    start: string;
    end: string;
  };
  dayType: string;
  timeRange: {
    start: string;
    end: string;
  };
  stayDuration: {
    min: string;
    max: string;
  };
}

export interface GuidAliasMapping {
  guid: string;
  alias: string;
  building: string;
  floor: string;
}

// モックデータ構造
export const buildingData = {
  'building-a': {
    name: 'ビルディングA',
    floors: {
      'floor-1': {
        name: '1階',
        areas: {
          'area-entrance': 'エントランス',
          'area-lobby': 'ロビー',
          'area-elevator': 'エレベーターホール'
        },
        guids: ['GUID-A1-001', 'GUID-A1-002', 'GUID-A1-003', 'GUID-A1-004']
      },
      'floor-2': {
        name: '2階',
        areas: {
          'area-office': 'オフィス',
          'area-meeting': '会議室',
          'area-break': '休憩室'
        },
        guids: ['GUID-A2-001', 'GUID-A2-002', 'GUID-A2-003', 'GUID-A2-004', 'GUID-A2-005']
      },
      'floor-3': {
        name: '3階',
        areas: {
          'area-dev': '開発室',
          'area-server': 'サーバー室',
          'area-storage': '倉庫'
        },
        guids: ['GUID-A3-001', 'GUID-A3-002', 'GUID-A3-003']
      }
    }
  },
  'building-b': {
    name: 'ビルディングB',
    floors: {
      'floor-1': {
        name: '1階',
        areas: {
          'area-cafe': 'カフェ',
          'area-shop': 'ショップ',
          'area-entrance-b': 'エントランス'
        },
        guids: ['GUID-B1-001', 'GUID-B1-002', 'GUID-B1-003']
      },
      'floor-2': {
        name: '2階',
        areas: {
          'area-restaurant': 'レストラン',
          'area-kitchen': 'キッチン'
        },
        guids: ['GUID-B2-001', 'GUID-B2-002', 'GUID-B2-003', 'GUID-B2-004']
      }
    }
  },
  'building-c': {
    name: 'ビルディングC',
    floors: {
      'floor-1': {
        name: '1階',
        areas: {
          'area-gym': 'ジム',
          'area-pool': 'プール',
          'area-locker': 'ロッカールーム'
        },
        guids: ['GUID-C1-001', 'GUID-C1-002', 'GUID-C1-003', 'GUID-C1-004']
      }
    }
  }
};

// GUID-エイリアスマッピング
export const guidAliasMapping: GuidAliasMapping[] = [
  // Building A - Floor 1
  { guid: 'GUID-A1-001', alias: '受付スタッフ', building: 'building-a', floor: 'floor-1' },
  { guid: 'GUID-A1-002', alias: '警備員', building: 'building-a', floor: 'floor-1' },
  { guid: 'GUID-A1-003', alias: '清掃員', building: 'building-a', floor: 'floor-1' },
  { guid: 'GUID-A1-004', alias: '来訪者A', building: 'building-a', floor: 'floor-1' },
  
  // Building A - Floor 2
  { guid: 'GUID-A2-001', alias: '営業部長', building: 'building-a', floor: 'floor-2' },
  { guid: 'GUID-A2-002', alias: '営業担当A', building: 'building-a', floor: 'floor-2' },
  { guid: 'GUID-A2-003', alias: '営業担当B', building: 'building-a', floor: 'floor-2' },
  { guid: 'GUID-A2-004', alias: 'マネージャー', building: 'building-a', floor: 'floor-2' },
  { guid: 'GUID-A2-005', alias: 'アシスタント', building: 'building-a', floor: 'floor-2' },
  
  // Building A - Floor 3
  { guid: 'GUID-A3-001', alias: '開発リーダー', building: 'building-a', floor: 'floor-3' },
  { guid: 'GUID-A3-002', alias: 'エンジニアA', building: 'building-a', floor: 'floor-3' },
  { guid: 'GUID-A3-003', alias: 'エンジニアB', building: 'building-a', floor: 'floor-3' },
  
  // Building B - Floor 1
  { guid: 'GUID-B1-001', alias: '店長', building: 'building-b', floor: 'floor-1' },
  { guid: 'GUID-B1-002', alias: 'スタッフA', building: 'building-b', floor: 'floor-1' },
  { guid: 'GUID-B1-003', alias: 'スタッフB', building: 'building-b', floor: 'floor-1' },
  
  // Building B - Floor 2
  { guid: 'GUID-B2-001', alias: 'シェフ', building: 'building-b', floor: 'floor-2' },
  { guid: 'GUID-B2-002', alias: 'コック', building: 'building-b', floor: 'floor-2' },
  { guid: 'GUID-B2-003', alias: 'ウェイター', building: 'building-b', floor: 'floor-2' },
  { guid: 'GUID-B2-004', alias: '店員', building: 'building-b', floor: 'floor-2' },
  
  // Building C - Floor 1
  { guid: 'GUID-C1-001', alias: 'トレーナーA', building: 'building-c', floor: 'floor-1' },
  { guid: 'GUID-C1-002', alias: 'トレーナーB', building: 'building-c', floor: 'floor-1' },
  { guid: 'GUID-C1-003', alias: 'スタッフ', building: 'building-c', floor: 'floor-1' },
  { guid: 'GUID-C1-004', alias: '利用者', building: 'building-c', floor: 'floor-1' }
];

export const getAliasForGuid = (guid: string): string => {
  const mapping = guidAliasMapping.find(m => m.guid === guid);
  return mapping ? mapping.alias : guid;
};

export const getGuidsForBuildingAndFloor = (building: string, floor: string): string[] => {
  return guidAliasMapping
    .filter(m => m.building === building && m.floor === floor)
    .map(m => m.guid);
};
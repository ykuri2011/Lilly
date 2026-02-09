import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageCircle, Database, Map, Shield, Save, Download, Edit3, Plus, Check, AlertCircle, Archive, Trash2, Clock, RefreshCw, StickyNote, Send, Users, Lightbulb, X, CheckSquare, Square } from 'lucide-react';

const PharmaMarketingSolution = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [savedInsights, setSavedInsights] = useState([]);
  const [journey, setJourney] = useState(null);
  const [savedActions, setSavedActions] = useState([]);
  const [legalChecks, setLegalChecks] = useState({});
  const [editingJourney, setEditingJourney] = useState(false);
  const [editedJourney, setEditedJourney] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Firestore永続化用の状態
  const [firestoreInsights, setFirestoreInsights] = useState([]);
  const [firestoreJourneys, setFirestoreJourneys] = useState([]);
  const [firestoreLegalResults, setFirestoreLegalResults] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);

  // ダッシュボードメモ機能
  const [dashboardMemos, setDashboardMemos] = useState([]);
  const [memoInput, setMemoInput] = useState('');
  const [memoAuthor, setMemoAuthor] = useState(() => {
    try { return localStorage.getItem('memoAuthor') || ''; } catch { return ''; }
  });
  const [memoCategory, setMemoCategory] = useState('');
  const [selectedMemoIds, setSelectedMemoIds] = useState(new Set());
  const [memoInsightMode, setMemoInsightMode] = useState(false);
  const [memoInsightChat, setMemoInsightChat] = useState([]);
  const [memoInsightInput, setMemoInsightInput] = useState('');
  const [isMemoInsightGenerating, setIsMemoInsightGenerating] = useState(false);

  const API_BASE_URL = '/api';

  // 疾患リスト
  const diseases = ['糖尿病', '肥満症', '関節リウマチ', '乾癬', 'アトピー性皮膚炎', 'アルツハイマー病', '偏頭痛'];
  const [selectedDisease, setSelectedDisease] = useState('糖尿病');

  // 疾患切り替え時のアニメーション処理
  const handleDiseaseChange = (newDisease) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDisease(newDisease);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // 疾患別データ定義
  const diseaseData = {
    '糖尿病': {
      kpi: {
        tam: { value: '450万人', change: '+2.3%' },
        sam: { value: '180万人', change: '+3.1%' },
        som: { value: '45万人', change: '+5.8%' },
        share: { value: '25%', change: '+1.2%' },
        patients: { value: '11.2万', change: '+4.5%' },
        retention: { value: '78%', change: '+2.1%' }
      },
      competitorShare: [
        { name: '自社製品', value: 25, color: '#D52B1E' },
        { name: '競合A', value: 35, color: '#94A3B8' },
        { name: '競合B', value: 22, color: '#CBD5E1' },
        { name: '競合C', value: 18, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 120, growth: 5.2 },
        { region: '東北', sales: 180, growth: 3.8 },
        { region: '関東', sales: 580, growth: 8.1 },
        { region: '中部', sales: 320, growth: 6.4 },
        { region: '近畿', sales: 450, growth: 7.2 },
        { region: '中国', sales: 140, growth: 4.1 },
        { region: '四国', sales: 95, growth: 2.9 },
        { region: '九州', sales: 215, growth: 5.8 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 62 },
        { category: '副作用への懸念', score: 78 },
        { category: '服薬アドヒアランス', score: 71 },
        { category: '情報収集意欲', score: 85 },
        { category: 'QOL改善期待', score: 89 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 45, adoption: 82, trend: 'up' },
        { type: '総合病院', count: 238, adoption: 67, trend: 'up' },
        { type: 'クリニック', count: 1842, adoption: 43, trend: 'stable' },
        { type: '専門病院', count: 92, adoption: 91, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 8200 },
        { month: '2月', value: 8900 },
        { month: '3月', value: 9400 },
        { month: '4月', value: 10100 },
        { month: '5月', value: 10800 },
        { month: '6月', value: 11200 }
      ],
      macroTrends: [
        { trend: '高齢化の進行', impact: '高', indicator: '患者数増加予測', value: '+12%/年' },
        { trend: 'オンライン診療拡大', impact: '中', indicator: '利用率', value: '28%' },
        { trend: '予防医療への関心', impact: '高', indicator: '検診受診率', value: '+8%' },
        { trend: '医療費抑制政策', impact: '中', indicator: 'ジェネリック率', value: '82%' }
      ]
    },
    '肥満症': {
      kpi: {
        tam: { value: '320万人', change: '+5.2%' },
        sam: { value: '125万人', change: '+6.8%' },
        som: { value: '28万人', change: '+9.3%' },
        share: { value: '18%', change: '+2.8%' },
        patients: { value: '5.1万', change: '+11.2%' },
        retention: { value: '65%', change: '+5.3%' }
      },
      competitorShare: [
        { name: '自社製品', value: 18, color: '#D52B1E' },
        { name: '競合A', value: 42, color: '#94A3B8' },
        { name: '競合B', value: 25, color: '#CBD5E1' },
        { name: '競合C', value: 15, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 85, growth: 8.5 },
        { region: '東北', sales: 95, growth: 7.2 },
        { region: '関東', sales: 420, growth: 12.3 },
        { region: '中部', sales: 180, growth: 9.8 },
        { region: '近畿', sales: 290, growth: 11.1 },
        { region: '中国', sales: 72, growth: 6.5 },
        { region: '四国', sales: 48, growth: 5.8 },
        { region: '九州', sales: 125, growth: 8.9 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 58 },
        { category: '副作用への懸念', score: 72 },
        { category: '服薬アドヒアランス', score: 64 },
        { category: '情報収集意欲', score: 81 },
        { category: 'QOL改善期待', score: 92 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 38, adoption: 75, trend: 'up' },
        { type: '総合病院', count: 185, adoption: 58, trend: 'up' },
        { type: 'クリニック', count: 2140, adoption: 32, trend: 'up' },
        { type: '専門病院', count: 54, adoption: 88, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 3200 },
        { month: '2月', value: 3800 },
        { month: '3月', value: 4200 },
        { month: '4月', value: 4600 },
        { month: '5月', value: 4900 },
        { month: '6月', value: 5100 }
      ],
      macroTrends: [
        { trend: '生活習慣病の増加', impact: '高', indicator: '肥満率上昇', value: '+3.2%/年' },
        { trend: 'GLP-1製剤の注目', impact: '高', indicator: '市場成長率', value: '+45%' },
        { trend: '美容目的利用の拡大', impact: '中', indicator: '自由診療比率', value: '38%' },
        { trend: '保険適用拡大', impact: '高', indicator: '適用患者数', value: '+28%' }
      ]
    },
    '関節リウマチ': {
      kpi: {
        tam: { value: '95万人', change: '+1.8%' },
        sam: { value: '42万人', change: '+2.5%' },
        som: { value: '12万人', change: '+4.2%' },
        share: { value: '31%', change: '+0.9%' },
        patients: { value: '3.7万', change: '+3.8%' },
        retention: { value: '84%', change: '+1.5%' }
      },
      competitorShare: [
        { name: '自社製品', value: 31, color: '#D52B1E' },
        { name: '競合A', value: 28, color: '#94A3B8' },
        { name: '競合B', value: 24, color: '#CBD5E1' },
        { name: '競合C', value: 17, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 52, growth: 3.8 },
        { region: '東北', sales: 78, growth: 4.1 },
        { region: '関東', sales: 285, growth: 5.2 },
        { region: '中部', sales: 142, growth: 4.8 },
        { region: '近畿', sales: 198, growth: 5.5 },
        { region: '中国', sales: 68, growth: 3.5 },
        { region: '四国', sales: 45, growth: 2.9 },
        { region: '九州', sales: 98, growth: 4.2 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 68 },
        { category: '副作用への懸念', score: 75 },
        { category: '服薬アドヒアランス', score: 79 },
        { category: '情報収集意欲', score: 88 },
        { category: 'QOL改善期待', score: 91 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 42, adoption: 89, trend: 'up' },
        { type: '総合病院', count: 215, adoption: 72, trend: 'stable' },
        { type: 'クリニック', count: 1250, adoption: 48, trend: 'up' },
        { type: '専門病院', count: 78, adoption: 95, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 3100 },
        { month: '2月', value: 3250 },
        { month: '3月', value: 3400 },
        { month: '4月', value: 3550 },
        { month: '5月', value: 3650 },
        { month: '6月', value: 3700 }
      ],
      macroTrends: [
        { trend: '早期診断の普及', impact: '高', indicator: '診断時期短縮', value: '-6ヶ月' },
        { trend: '生物学的製剤の進化', impact: '高', indicator: 'バイオ製剤使用率', value: '58%' },
        { trend: '寛解目標治療の浸透', impact: '中', indicator: '寛解達成率', value: '42%' },
        { trend: 'バイオシミラー普及', impact: '中', indicator: 'BS切替率', value: '35%' }
      ]
    },
    '乾癬': {
      kpi: {
        tam: { value: '62万人', change: '+2.1%' },
        sam: { value: '28万人', change: '+3.4%' },
        som: { value: '8.5万人', change: '+5.8%' },
        share: { value: '22%', change: '+1.8%' },
        patients: { value: '1.9万', change: '+6.2%' },
        retention: { value: '72%', change: '+3.1%' }
      },
      competitorShare: [
        { name: '自社製品', value: 22, color: '#D52B1E' },
        { name: '競合A', value: 38, color: '#94A3B8' },
        { name: '競合B', value: 26, color: '#CBD5E1' },
        { name: '競合C', value: 14, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 28, growth: 5.5 },
        { region: '東北', sales: 42, growth: 4.8 },
        { region: '関東', sales: 185, growth: 7.2 },
        { region: '中部', sales: 88, growth: 6.1 },
        { region: '近畿', sales: 125, growth: 6.8 },
        { region: '中国', sales: 38, growth: 4.2 },
        { region: '四国', sales: 22, growth: 3.5 },
        { region: '九州', sales: 58, growth: 5.3 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 55 },
        { category: '副作用への懸念', score: 68 },
        { category: '服薬アドヒアランス', score: 66 },
        { category: '情報収集意欲', score: 83 },
        { category: 'QOL改善期待', score: 94 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 35, adoption: 86, trend: 'up' },
        { type: '総合病院', count: 152, adoption: 64, trend: 'up' },
        { type: 'クリニック', count: 980, adoption: 38, trend: 'stable' },
        { type: '専門病院', count: 42, adoption: 92, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 1520 },
        { month: '2月', value: 1650 },
        { month: '3月', value: 1740 },
        { month: '4月', value: 1820 },
        { month: '5月', value: 1880 },
        { month: '6月', value: 1900 }
      ],
      macroTrends: [
        { trend: '生物学的製剤の拡大', impact: '高', indicator: 'バイオ製剤使用率', value: '48%' },
        { trend: 'QOL重視の高まり', impact: '高', indicator: 'PASI改善率', value: '75%' },
        { trend: '皮膚科専門医連携', impact: '中', indicator: '専門医紹介率', value: '62%' },
        { trend: '患者会活動の活発化', impact: '中', indicator: '参加率', value: '28%' }
      ]
    },
    'アトピー性皮膚炎': {
      kpi: {
        tam: { value: '580万人', change: '+1.5%' },
        sam: { value: '215万人', change: '+2.8%' },
        som: { value: '52万人', change: '+4.5%' },
        share: { value: '20%', change: '+1.5%' },
        patients: { value: '10.4万', change: '+5.8%' },
        retention: { value: '68%', change: '+2.8%' }
      },
      competitorShare: [
        { name: '自社製品', value: 20, color: '#D52B1E' },
        { name: '競合A', value: 32, color: '#94A3B8' },
        { name: '競合B', value: 28, color: '#CBD5E1' },
        { name: '競合C', value: 20, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 142, growth: 4.2 },
        { region: '東北', sales: 185, growth: 3.8 },
        { region: '関東', sales: 685, growth: 6.5 },
        { region: '中部', sales: 325, growth: 5.1 },
        { region: '近畿', sales: 485, growth: 5.8 },
        { region: '中国', sales: 158, growth: 3.9 },
        { region: '四国', sales: 95, growth: 3.2 },
        { region: '九州', sales: 245, growth: 4.8 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 51 },
        { category: '副作用への懸念', score: 82 },
        { category: '服薬アドヒアランス', score: 59 },
        { category: '情報収集意欲', score: 87 },
        { category: 'QOL改善期待', score: 95 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 48, adoption: 78, trend: 'up' },
        { type: '総合病院', count: 298, adoption: 61, trend: 'up' },
        { type: 'クリニック', count: 3580, adoption: 35, trend: 'up' },
        { type: '専門病院', count: 68, adoption: 89, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 8800 },
        { month: '2月', value: 9200 },
        { month: '3月', value: 9600 },
        { month: '4月', value: 9900 },
        { month: '5月', value: 10200 },
        { month: '6月', value: 10400 }
      ],
      macroTrends: [
        { trend: '新規治療法の登場', impact: '高', indicator: '生物学的製剤使用率', value: '35%' },
        { trend: '小児患者の増加', impact: '高', indicator: '小児患者比率', value: '+5%/年' },
        { trend: 'プロアクティブ療法普及', impact: '中', indicator: '再燃率低減', value: '-42%' },
        { trend: '医療費助成制度', impact: '中', indicator: '制度利用率', value: '52%' }
      ]
    },
    'アルツハイマー病': {
      kpi: {
        tam: { value: '280万人', change: '+4.2%' },
        sam: { value: '98万人', change: '+5.8%' },
        som: { value: '22万人', change: '+7.5%' },
        share: { value: '15%', change: '+2.5%' },
        patients: { value: '3.3万', change: '+8.2%' },
        retention: { value: '81%', change: '+1.8%' }
      },
      competitorShare: [
        { name: '自社製品', value: 15, color: '#D52B1E' },
        { name: '競合A', value: 45, color: '#94A3B8' },
        { name: '競合B', value: 28, color: '#CBD5E1' },
        { name: '競合C', value: 12, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 95, growth: 7.2 },
        { region: '東北', sales: 128, growth: 6.8 },
        { region: '関東', sales: 385, growth: 9.1 },
        { region: '中部', sales: 185, growth: 7.8 },
        { region: '近畿', sales: 285, growth: 8.5 },
        { region: '中国', sales: 88, growth: 6.2 },
        { region: '四国', sales: 58, growth: 5.5 },
        { region: '九州', sales: 145, growth: 7.3 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 45 },
        { category: '副作用への懸念', score: 71 },
        { category: '服薬アドヒアランス', score: 77 },
        { category: '情報収集意欲', score: 91 },
        { category: 'QOL改善期待', score: 88 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 52, adoption: 92, trend: 'up' },
        { type: '総合病院', count: 285, adoption: 75, trend: 'up' },
        { type: 'クリニック', count: 1580, adoption: 42, trend: 'up' },
        { type: '専門病院', count: 125, adoption: 96, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 2800 },
        { month: '2月', value: 2950 },
        { month: '3月', value: 3050 },
        { month: '4月', value: 3150 },
        { month: '5月', value: 3250 },
        { month: '6月', value: 3300 }
      ],
      macroTrends: [
        { trend: '超高齢社会の進展', impact: '高', indicator: '患者数増加予測', value: '+8%/年' },
        { trend: '新薬開発の加速', impact: '高', indicator: '臨床試験数', value: '+25件' },
        { trend: '早期診断技術の進歩', impact: '中', indicator: 'MCI診断率', value: '38%' },
        { trend: '介護負担の増大', impact: '高', indicator: '介護者支援ニーズ', value: '85%' }
      ]
    },
    '偏頭痛': {
      kpi: {
        tam: { value: '840万人', change: '+1.2%' },
        sam: { value: '325万人', change: '+2.5%' },
        som: { value: '68万人', change: '+6.8%' },
        share: { value: '28%', change: '+3.2%' },
        patients: { value: '19万', change: '+9.5%' },
        retention: { value: '74%', change: '+4.2%' }
      },
      competitorShare: [
        { name: '自社製品', value: 28, color: '#D52B1E' },
        { name: '競合A', value: 31, color: '#94A3B8' },
        { name: '競合B', value: 23, color: '#CBD5E1' },
        { name: '競合C', value: 18, color: '#E2E8F0' }
      ],
      regionalSales: [
        { region: '北海道', sales: 185, growth: 8.8 },
        { region: '東北', sales: 242, growth: 7.5 },
        { region: '関東', sales: 825, growth: 11.2 },
        { region: '中部', sales: 428, growth: 9.3 },
        { region: '近畿', sales: 615, growth: 10.1 },
        { region: '中国', sales: 195, growth: 7.2 },
        { region: '四国', sales: 128, growth: 6.5 },
        { region: '九州', sales: 312, growth: 8.9 }
      ],
      consumerInsights: [
        { category: '治療への満足度', score: 64 },
        { category: '副作用への懸念', score: 69 },
        { category: '服薬アドヒアランス', score: 72 },
        { category: '情報収集意欲', score: 86 },
        { category: 'QOL改善期待', score: 93 }
      ],
      medicalInstitutions: [
        { type: '大学病院', count: 38, adoption: 85, trend: 'up' },
        { type: '総合病院', count: 195, adoption: 68, trend: 'up' },
        { type: 'クリニック', count: 2850, adoption: 45, trend: 'up' },
        { type: '専門病院', count: 58, adoption: 91, trend: 'up' }
      ],
      prescriptionTrend: [
        { month: '1月', value: 16200 },
        { month: '2月', value: 16800 },
        { month: '3月', value: 17400 },
        { month: '4月', value: 18100 },
        { month: '5月', value: 18600 },
        { month: '6月', value: 19000 }
      ],
      macroTrends: [
        { trend: 'CGRP製剤の台頭', impact: '高', indicator: 'CGRP製剤使用率', value: '42%' },
        { trend: 'ストレス社会の影響', impact: '高', indicator: '新規患者増加率', value: '+6%/年' },
        { trend: '予防療法の普及', impact: '中', indicator: '予防薬使用率', value: '38%' },
        { trend: 'オンライン診療対応', impact: '中', indicator: 'オンライン処方率', value: '32%' }
      ]
    }
  };

  // 現在選択されている疾患のデータを取得
  const currentData = diseaseData[selectedDisease];

  const competitorShare = currentData.competitorShare;
  const regionalSales = currentData.regionalSales;
  const consumerInsights = currentData.consumerInsights;

  // Firestore データ取得
  const fetchFirestoreData = async () => {
    try {
      const [insightsRes, journeysRes, legalRes, logsRes, memosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/insights`).catch(() => null),
        fetch(`${API_BASE_URL}/journeys`).catch(() => null),
        fetch(`${API_BASE_URL}/legal-results`).catch(() => null),
        fetch(`${API_BASE_URL}/logs`).catch(() => null),
        fetch(`${API_BASE_URL}/memos`).catch(() => null)
      ]);

      if (insightsRes && insightsRes.ok) {
        const data = await insightsRes.json();
        setFirestoreInsights(data.insights || []);
      }
      if (journeysRes && journeysRes.ok) {
        const data = await journeysRes.json();
        setFirestoreJourneys(data.actions || []);
      }
      if (legalRes && legalRes.ok) {
        const data = await legalRes.json();
        setFirestoreLegalResults(data.results || []);
      }
      if (logsRes && logsRes.ok) {
        const data = await logsRes.json();
        setActivityLogs(data.logs || []);
      }
      if (memosRes && memosRes.ok) {
        const data = await memosRes.json();
        setDashboardMemos(data.memos || []);
      }
    } catch (error) {
      console.warn('Firestore data fetch failed:', error);
      setFirestoreAvailable(false);
    }
  };

  useEffect(() => {
    fetchFirestoreData();
  }, []);

  // Firestore インサイト保存
  const saveInsightToFirestore = async (message) => {
    try {
      const res = await fetch(`${API_BASE_URL}/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message.content,
          disease: selectedDisease,
          messageId: String(message.id)
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFirestoreInsights(prev => [{ id: data.id, content: message.content, disease: selectedDisease, messageId: String(message.id), createdAt: new Date().toISOString() }, ...prev]);
        fetchFirestoreData();
      }
    } catch (error) {
      console.warn('Insight save to Firestore failed:', error);
    }
  };

  // Firestore インサイト削除
  const deleteInsightFromFirestore = async (firestoreId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/insights/${firestoreId}`, { method: 'DELETE' });
      if (res.ok) {
        setFirestoreInsights(prev => prev.filter(i => i.id !== firestoreId));
        fetchFirestoreData();
      }
    } catch (error) {
      console.warn('Insight delete from Firestore failed:', error);
    }
  };

  // Firestore 施策保存
  const saveJourneyToFirestore = async (stageName, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/journeys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: stageName,
          action: action,
          disease: selectedDisease
        })
      });
      if (res.ok) {
        fetchFirestoreData();
      }
    } catch (error) {
      console.warn('Journey save to Firestore failed:', error);
    }
  };

  // Firestore 施策削除
  const deleteJourneyFromFirestore = async (firestoreId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/journeys/${firestoreId}`, { method: 'DELETE' });
      if (res.ok) {
        setFirestoreJourneys(prev => prev.filter(j => j.id !== firestoreId));
        fetchFirestoreData();
      }
    } catch (error) {
      console.warn('Journey delete from Firestore failed:', error);
    }
  };

  // Firestore Legal Check結果保存
  const saveLegalResultToFirestore = async (actionData, checks) => {
    try {
      const res = await fetch(`${API_BASE_URL}/legal-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionData.action,
          stage: actionData.stage,
          disease: actionData.disease,
          checks: checks
        })
      });
      if (res.ok) {
        fetchFirestoreData();
      }
    } catch (error) {
      console.warn('Legal result save to Firestore failed:', error);
    }
  };

  // Firestore Legal Check結果削除
  const deleteLegalResultFromFirestore = async (firestoreId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/legal-results/${firestoreId}`, { method: 'DELETE' });
      if (res.ok) {
        setFirestoreLegalResults(prev => prev.filter(l => l.id !== firestoreId));
        fetchFirestoreData();
      }
    } catch (error) {
      console.warn('Legal result delete from Firestore failed:', error);
    }
  };

  // ログ削除
  const deleteLog = async (logId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs/${logId}`, { method: 'DELETE' });
      if (res.ok) {
        setActivityLogs(prev => prev.filter(l => l.id !== logId));
      }
    } catch (error) {
      console.warn('Log delete failed:', error);
    }
  };

  // ダッシュボードメモ保存
  const saveMemo = async () => {
    if (!memoInput.trim() || !memoAuthor.trim()) return;
    try {
      localStorage.setItem('memoAuthor', memoAuthor);
    } catch {}

    const newMemo = {
      id: 'local_' + Date.now(),
      content: memoInput.trim(),
      author: memoAuthor.trim(),
      disease: selectedDisease,
      category: memoCategory,
      createdAt: new Date().toISOString()
    };

    // ローカルに即時反映
    setDashboardMemos(prev => [newMemo, ...prev]);
    setMemoInput('');
    setMemoCategory('');

    // Firestoreへの保存を試行
    try {
      const res = await fetch(`${API_BASE_URL}/memos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMemo.content,
          author: newMemo.author,
          disease: newMemo.disease,
          category: newMemo.category
        })
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardMemos(prev => prev.map(m => m.id === newMemo.id ? { ...m, id: data.id } : m));
      }
    } catch (error) {
      console.warn('Memo save to Firestore failed (local memo preserved):', error);
    }
  };

  // メモ削除
  const deleteMemo = async (memoId) => {
    // ローカルから即時削除
    setDashboardMemos(prev => prev.filter(m => m.id !== memoId));
    setSelectedMemoIds(prev => {
      const next = new Set(prev);
      next.delete(memoId);
      return next;
    });

    // ローカルIDの場合はFirestore削除不要
    if (String(memoId).startsWith('local_')) return;

    try {
      await fetch(`${API_BASE_URL}/memos/${memoId}`, { method: 'DELETE' });
    } catch (error) {
      console.warn('Memo delete from Firestore failed:', error);
    }
  };

  // メモ選択トグル
  const toggleMemoSelection = (memoId) => {
    setSelectedMemoIds(prev => {
      const next = new Set(prev);
      if (next.has(memoId)) {
        next.delete(memoId);
      } else {
        next.add(memoId);
      }
      return next;
    });
  };

  // メモインサイト会話を開始
  const startMemoInsightConversation = () => {
    const selectedMemos = dashboardMemos.filter(m => selectedMemoIds.has(m.id));
    if (selectedMemos.length === 0) return;
    setMemoInsightChat([]);
    setMemoInsightInput('');
    setMemoInsightMode(true);
  };

  // メモインサイト会話で送信
  const sendMemoInsightMessage = async () => {
    if (!memoInsightInput.trim()) return;
    const selectedMemos = dashboardMemos.filter(m => selectedMemoIds.has(m.id));
    const userMessage = { role: 'user', content: memoInsightInput, timestamp: new Date() };
    setMemoInsightChat(prev => [...prev, userMessage]);
    setMemoInsightInput('');
    setIsMemoInsightGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-memo-insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memos: selectedMemos.map(m => ({ content: m.content, author: m.author, disease: m.disease, category: m.category })),
          userMessage: memoInsightInput,
          conversationHistory: memoInsightChat.slice(-10),
          disease: selectedDisease
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMemoInsightChat(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }]);
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      alert(`接続エラー: ${error.message}`);
    } finally {
      setIsMemoInsightGenerating(false);
    }
  };

  // AIペルソナチャット
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate-persona-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: selectedDisease,
          userMessage: chatInput,
          conversationHistory: chatMessages.slice(-10) // 直近10件のみ送信
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          id: Date.now()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      alert(`接続エラー: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveInsight = (messageId) => {
    const message = chatMessages.find(m => m.id === messageId);
    if (message && !savedInsights.find(s => s.id === messageId)) {
      setSavedInsights(prev => [...prev, message]);
      saveInsightToFirestore(message);
    }
  };

  // Patient Journey生成
  const generateJourney = async () => {
    setIsGenerating(true);
    setActiveTab('journey');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-journey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: selectedDisease,
          dashboardData: {
            tam: currentData.kpi.tam.value,
            sam: currentData.kpi.sam.value,
            som: currentData.kpi.som.value,
            marketShare: currentData.kpi.share.value
          },
          savedInsights: savedInsights
        })
      });

      const data = await response.json();

      if (response.ok) {
        setJourney(data.journey);
        setEditedJourney(JSON.parse(JSON.stringify(data.journey)));
      } else {
        alert(`エラー: ${data.error}`);
        // フォールバック：デフォルトのJourneyを使用
        generateDefaultJourney();
      }
    } catch (error) {
      alert(`接続エラー: ${error.message}\n\nデフォルトのJourneyを表示します。`);
      generateDefaultJourney();
    } finally {
      setIsGenerating(false);
    }
  };

  // デフォルトのJourney生成（APIエラー時のフォールバック）
  const generateDefaultJourney = () => {
    const journeyData = {
      stages: [
        {
          name: '認知',
          behavior: '症状に気づき、情報を検索し始める',
          touchpoints: 'Web検索、SNS、家族・友人との会話',
          thoughts: '何が起きているのか不安。早く原因を知りたい',
          triggers: '症状の悪化、周囲からの指摘',
          marketingPoints: '正確でわかりやすい疾患情報の提供が重要',
          actions: [
            '疾患啓発Webサイトの最適化',
            'SNS上での信頼できる情報発信',
            '患者コミュニティとの連携'
          ]
        },
        {
          name: '関心',
          behavior: '医療機関を受診し、診断を受ける',
          touchpoints: '医療機関、医師、看護師、薬剤師',
          thoughts: '治療法はあるのか。自分に合った治療を見つけたい',
          triggers: '医師からの診断、治療選択肢の提示',
          marketingPoints: '医療従事者向けの詳細な製品情報提供',
          actions: [
            'MR活動の強化',
            '医師向けWebinarの実施',
            '患者向け啓発資材の提供'
          ]
        },
        {
          name: '検討',
          behavior: '治療オプションについて情報収集し、比較検討する',
          touchpoints: '医師との対話、患者会、オンラインコミュニティ',
          thoughts: '副作用は大丈夫か。費用負担はどのくらいか',
          triggers: '治療効果への期待、副作用への不安',
          marketingPoints: '安全性データと患者サポートプログラムの訴求',
          actions: [
            '患者サポートプログラムの拡充',
            '治療継続支援ツールの提供',
            '医療費助成制度の情報提供'
          ]
        },
        {
          name: '決定',
          behavior: '治療を開始し、服薬管理を行う',
          touchpoints: '薬局、服薬アプリ、定期診察',
          thoughts: 'ちゃんと続けられるか。効果が出てほしい',
          triggers: '医師の推奨、治療への意欲',
          marketingPoints: 'アドヒアランス向上施策が鍵',
          actions: [
            '服薬管理アプリの開発',
            '薬剤師との連携強化',
            '患者フォローアップ体制の構築'
          ]
        },
        {
          name: '継続・共有',
          behavior: '治療効果を実感し、経験を他者と共有する',
          touchpoints: '患者会、SNS、医療機関',
          thoughts: '同じ悩みを持つ人の役に立ちたい',
          triggers: 'QOL改善の実感、他患者との交流',
          marketingPoints: 'ロイヤルティ向上とアドボカシー育成',
          actions: [
            '患者コミュニティプラットフォームの構築',
            '体験談の収集と活用',
            'ピアサポートプログラムの展開'
          ]
        }
      ]
    };
    setJourney(journeyData);
    setEditedJourney(JSON.parse(JSON.stringify(journeyData)));
  };

  // 編集モード切り替え
  const toggleEditMode = () => {
    if (editingJourney) {
      // 編集完了 - 変更を保存
      setJourney(JSON.parse(JSON.stringify(editedJourney)));
    } else {
      // 編集開始 - 現在のデータをコピー
      setEditedJourney(JSON.parse(JSON.stringify(journey)));
    }
    setEditingJourney(!editingJourney);
  };

  // Journey フィールド更新
  const updateJourneyField = (stageIndex, field, value) => {
    const updated = JSON.parse(JSON.stringify(editedJourney));
    updated.stages[stageIndex][field] = value;
    setEditedJourney(updated);
  };

  // Journey アクション更新
  const updateJourneyAction = (stageIndex, actionIndex, value) => {
    const updated = JSON.parse(JSON.stringify(editedJourney));
    updated.stages[stageIndex].actions[actionIndex] = value;
    setEditedJourney(updated);
  };

  // Journey アクション追加
  const addJourneyAction = (stageIndex) => {
    const updated = JSON.parse(JSON.stringify(editedJourney));
    updated.stages[stageIndex].actions.push('新しい施策');
    setEditedJourney(updated);
  };

  // Journey アクション削除
  const deleteJourneyAction = (stageIndex, actionIndex) => {
    const updated = JSON.parse(JSON.stringify(editedJourney));
    updated.stages[stageIndex].actions.splice(actionIndex, 1);
    setEditedJourney(updated);
  };

  const saveAction = (stageName, action) => {
    const actionData = {
      id: Date.now(),
      stage: stageName,
      action: action,
      disease: selectedDisease,
      timestamp: new Date()
    };
    setSavedActions(prev => [...prev, actionData]);
    saveJourneyToFirestore(stageName, action);
  };

  // Legal Check
  const performLegalCheck = async (actionId) => {
    const action = savedActions.find(a => a.id === actionId);
    if (!action) return;

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/legal-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease: action.disease,
          action: action.action,
          stage: action.stage
        })
      });

      const data = await response.json();

      if (response.ok) {
        setLegalChecks(prev => ({ ...prev, [actionId]: data.legalCheck.checks }));
        saveLegalResultToFirestore(action, data.legalCheck.checks);
      } else {
        alert(`エラー: ${data.error}`);
        // フォールバック：デフォルトのチェック結果を使用
        performDefaultLegalCheck(actionId);
      }
    } catch (error) {
      alert(`接続エラー: ${error.message}\n\nデフォルトのチェック結果を表示します。`);
      performDefaultLegalCheck(actionId);
    } finally {
      setIsGenerating(false);
    }
  };

  // デフォルトのLegal Check（APIエラー時のフォールバック）
  const performDefaultLegalCheck = (actionId) => {
    const checks = [
      {
        issue: '効能効果の標榜',
        status: 'warning',
        detail: '疾患啓発コンテンツにおいて、製品の効能効果を直接的に訴求している表現が含まれる可能性があります。',
        alternatives: [
          '疾患情報と製品情報を明確に分離する',
          '一般的な治療選択肢の一つとして中立的に記載する',
          '医療従事者向けページに詳細情報を配置する'
        ]
      },
      {
        issue: '医薬品広告規制',
        status: 'caution',
        detail: 'SNS発信において、広告であることの明示が必要です。',
        alternatives: [
          '投稿に「広告」「PR」の表記を追加',
          '医療従事者監修の明記',
          '問い合わせ先の明確な記載'
        ]
      },
      {
        issue: '比較広告',
        status: 'clear',
        detail: '競合製品との直接比較は行われていません。適切です。',
        alternatives: []
      }
    ];

    setLegalChecks(prev => ({ ...prev, [actionId]: checks }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F5F7',
      fontFamily: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
      color: '#2D2D2D'
    }}>
      {/* ローディングオーバーレイ */}
      {isGenerating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              border: '3px solid #E5E7EB',
              borderTop: '3px solid #D52B1E',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{
              fontSize: '15px',
              fontWeight: '500',
              color: '#374151'
            }}>AI生成中...</div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header style={{
        background: '#FFFFFF',
        color: '#1A1A1A',
        padding: '0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
            gap: '16px',
            flexWrap: 'wrap',
            minHeight: '68px'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(18px, 3.5vw, 24px)',
              fontWeight: '600',
              letterSpacing: '-0.3px'
            }}>
              <span style={{ color: '#D52B1E', fontWeight: '700' }}>Lilly</span>
              <span style={{ color: '#6B7280', fontWeight: '400', marginLeft: '6px', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>Pharma Intelligence</span>
            </h1>
            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <select
                value={selectedDisease}
                onChange={(e) => handleDiseaseChange(e.target.value)}
                style={{
                  background: '#F8F9FA',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  fontWeight: '500',
                  color: '#1A1A1A',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {diseases.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: '68px',
        zIndex: 999,
        overflowX: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: '0',
          minWidth: 'max-content'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Database },
            { id: 'chat', label: 'AI Persona', icon: MessageCircle },
            { id: 'journey', label: 'Patient Journey', icon: Map },
            { id: 'legal', label: 'Legal Check', icon: Shield },
            { id: 'saved', label: 'Saved Data', icon: Archive }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'transparent',
                  color: activeTab === tab.id ? '#D52B1E' : '#6B7280',
                  border: 'none',
                  padding: '16px 20px',
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  borderBottom: activeTab === tab.id ? '2px solid #D52B1E' : '2px solid transparent',
                  position: 'relative',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 32px) clamp(20px, 4vw, 24px)'
      }}>
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div style={{
            display: 'grid',
            gap: '20px',
            animation: 'fadeIn 0.5s ease',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.3s ease'
          }}>
            {/* KPI Overview Row */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px 28px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #E5E7EB',
              borderLeft: '4px solid #D52B1E',
              animation: isTransitioning ? 'none' : 'slideInDown 0.5s ease both',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: '500',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>現在の分析対象</div>
                <h2 style={{
                  margin: 0,
                  fontSize: 'clamp(22px, 3.5vw, 28px)',
                  fontWeight: '600',
                  color: '#1A1A1A',
                  animation: isTransitioning ? 'none' : 'numberPulse 0.6s ease 0.2s both'
                }}>{selectedDisease}</h2>
              </div>
              <div style={{
                background: '#F8F9FA',
                borderRadius: '8px',
                padding: '10px 16px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '2px' }}>
                  データ更新時刻
                </div>
                <div style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '600' }}>
                  {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* KPI Overview Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {[
                { label: 'TAM', value: currentData.kpi.tam.value, change: currentData.kpi.tam.change, desc: '総市場規模' },
                { label: 'SAM', value: currentData.kpi.sam.value, change: currentData.kpi.sam.change, desc: '獲得可能市場' },
                { label: 'SOM', value: currentData.kpi.som.value, change: currentData.kpi.som.change, desc: '実現可能市場' },
                { label: '市場シェア', value: currentData.kpi.share.value, change: currentData.kpi.share.change, desc: '対前年比' },
                { label: '処方患者数', value: currentData.kpi.patients.value, change: currentData.kpi.patients.change, desc: '月間平均' },
                { label: '継続率', value: currentData.kpi.retention.value, change: currentData.kpi.retention.change, desc: '6ヶ月時点' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '20px 16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: '1px solid #E5E7EB',
                  animation: isTransitioning ? 'none' : `slideInUp 0.5s ease ${i * 0.05}s both`,
                  transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#9CA3AF',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>{item.label}</div>
                  <div style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '4px',
                    animation: isTransitioning ? 'none' : `numberPulse 0.6s ease ${i * 0.05 + 0.2}s both`
                  }}>{item.value}</div>
                  <div style={{
                    fontSize: '11px',
                    color: '#9CA3AF',
                    marginBottom: '6px'
                  }}>{item.desc}</div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: item.change.startsWith('+') ? '#16A34A' : '#DC2626',
                    animation: isTransitioning ? 'none' : `fadeInScale 0.5s ease ${i * 0.05 + 0.3}s both`
                  }}>{item.change}</div>
                </div>
              ))}
            </div>

            {/* Main Analytics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {/* Regional Sales */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
                animation: isTransitioning ? 'none' : 'slideInLeft 0.6s ease 0.3s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#1A1A1A'
                  }}>エリア別販売状況</h3>
                  <div style={{
                    fontSize: '11px',
                    color: '#6B7280',
                    background: '#F0F1F3',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontWeight: '600'
                  }}>前月比</div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={regionalSales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="region" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#374151" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="growth" fill="#D52B1E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Competitor Share */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.4s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>競合シェア</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={competitorShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {competitorShare.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '8px',
                  marginTop: '16px'
                }}>
                  {competitorShare.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: '#F8F9FA',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          background: item.color,
                          borderRadius: '2px'
                        }} />
                        <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '500' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A' }}>
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consumer Insights */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
                animation: isTransitioning ? 'none' : 'slideInRight 0.6s ease 0.5s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>生活者インサイト</h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {consumerInsights.map((item, i) => (
                    <div key={i}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px'
                      }}>
                        <span style={{
                          fontSize: '12px',
                          color: '#1A1A1A',
                          fontWeight: '600'
                        }}>{item.category}</span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#D52B1E'
                        }}>{item.score}</span>
                      </div>
                      <div style={{
                        background: '#F0F1F3',
                        height: '8px',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: item.score > 75 ? '#D52B1E' : '#9CA3AF',
                          height: '100%',
                          width: `${item.score}%`,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {/* Medical Institution Analysis */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.6s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>医療機関分析</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {currentData.medicalInstitutions.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#F8F9FA',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A' }}>
                          {item.type}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {item.count}施設
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#D52B1E' }}>
                          {item.adoption}%
                        </div>
                        <div style={{ fontSize: '10px', color: item.trend === 'up' ? '#16A34A' : '#9CA3AF', fontWeight: '600' }}>
                          {item.trend === 'up' ? '↑' : '→'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Trend */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.7s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>処方推移</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={currentData.prescriptionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#D52B1E" strokeWidth={3} dot={{ fill: '#D52B1E', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Macro Trends */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.8s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>マクロトレンド</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentData.macroTrends.map((item, i) => (
                    <div key={i} style={{
                      padding: '12px',
                      background: '#F8F9FA',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${item.impact === '高' ? '#D52B1E' : '#D1D5DB'}`
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#1A1A1A',
                        marginBottom: '4px'
                      }}>{item.trend}</div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '6px'
                      }}>
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                          {item.indicator}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#D52B1E' }}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Memos - 社内共有メモ */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.9s both',
              opacity: isTransitioning ? 0 : 1,
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '20px 28px',
                borderBottom: '1px solid #E5E7EB',
                background: '#F8F9FA',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <StickyNote size={20} color="#D52B1E" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>
                    チームメモ
                  </h3>
                  <span style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    社内共有
                  </span>
                </div>
                {selectedMemoIds.size > 0 && (
                  <button
                    onClick={startMemoInsightConversation}
                    style={{
                      background: 'linear-gradient(135deg, #D52B1E 0%, #B91C1C 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 8px rgba(213, 43, 30, 0.2)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Lightbulb size={16} />
                    選択したメモ（{selectedMemoIds.size}件）からインサイトを深掘り
                  </button>
                )}
              </div>

              {/* メモ入力フォーム */}
              <div style={{
                padding: '20px 28px',
                borderBottom: '1px solid #F0F1F3',
                background: '#FAFBFC'
              }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={memoAuthor}
                    onChange={(e) => setMemoAuthor(e.target.value)}
                    placeholder="あなたの名前"
                    style={{
                      width: '160px',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  />
                  <select
                    value={memoCategory}
                    onChange={(e) => setMemoCategory(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: memoCategory ? '#1A1A1A' : '#9CA3AF',
                      outline: 'none',
                      background: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">カテゴリ（任意）</option>
                    <option value="市場動向">市場動向</option>
                    <option value="競合分析">競合分析</option>
                    <option value="患者インサイト">患者インサイト</option>
                    <option value="施策アイデア">施策アイデア</option>
                    <option value="リスク・課題">リスク・課題</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <textarea
                    value={memoInput}
                    onChange={(e) => setMemoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveMemo();
                    }}
                    placeholder="ダッシュボードから得た気づきをメモしてチームに共有しましょう... (Ctrl+Enterで投稿)"
                    rows={2}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      outline: 'none',
                      background: '#fff',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                  <button
                    onClick={saveMemo}
                    disabled={!memoInput.trim() || !memoAuthor.trim()}
                    style={{
                      background: (!memoInput.trim() || !memoAuthor.trim()) ? '#D1D5DB' : '#D52B1E',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: (!memoInput.trim() || !memoAuthor.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      alignSelf: 'flex-end',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Send size={14} />
                    投稿
                  </button>
                </div>
              </div>

              {/* メモ一覧 */}
              <div style={{
                padding: '16px 28px',
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                {dashboardMemos.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '14px',
                    padding: '40px 0'
                  }}>
                    まだメモがありません。ダッシュボードを見て気づいたことをメモしましょう。
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {dashboardMemos.map((memo) => (
                      <div
                        key={memo.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          padding: '16px',
                          background: selectedMemoIds.has(memo.id) ? '#FEF2F2' : '#F8F9FA',
                          borderRadius: '10px',
                          border: selectedMemoIds.has(memo.id) ? '2px solid #D52B1E' : '1px solid #E5E7EB',
                          transition: 'all 0.15s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => toggleMemoSelection(memo.id)}
                      >
                        {/* チェックボックス */}
                        <div style={{
                          flexShrink: 0,
                          marginTop: '2px',
                          color: selectedMemoIds.has(memo.id) ? '#D52B1E' : '#9CA3AF'
                        }}>
                          {selectedMemoIds.has(memo.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                        </div>

                        {/* メモ内容 */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '6px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#1A1A1A'
                            }}>{memo.author}</span>
                            <span style={{
                              background: '#FEE2E2',
                              color: '#DC2626',
                              padding: '1px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>{memo.disease}</span>
                            {memo.category && (
                              <span style={{
                                background: '#E0E7FF',
                                color: '#3730A3',
                                padding: '1px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>{memo.category}</span>
                            )}
                            <span style={{
                              fontSize: '11px',
                              color: '#9CA3AF'
                            }}>
                              {memo.createdAt ? new Date(memo.createdAt).toLocaleString('ja-JP') : ''}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#1A1A1A',
                            lineHeight: '1.7',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {memo.content}
                          </div>
                        </div>

                        {/* 削除ボタン */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMemo(memo.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#9CA3AF',
                            cursor: 'pointer',
                            padding: '4px',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* メモインサイト会話モーダル */}
            {memoInsightMode && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(4px)',
                padding: '20px',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  width: '100%',
                  maxWidth: '800px',
                  maxHeight: '90vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }}>
                  {/* ヘッダー */}
                  <div style={{
                    padding: '20px 28px',
                    borderBottom: '1px solid #E5E7EB',
                    background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Lightbulb size={22} color="#D52B1E" />
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1A1A1A' }}>
                          インサイト深掘り
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>
                          選択した{selectedMemoIds.size}件のメモをAIが分析します
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMemoInsightMode(false)}
                      style={{
                        background: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* 選択中のメモ一覧 */}
                  <div style={{
                    padding: '16px 28px',
                    borderBottom: '1px solid #E5E7EB',
                    background: '#FAFBFC',
                    maxHeight: '180px',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#6B7280',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>選択中のメモ</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dashboardMemos.filter(m => selectedMemoIds.has(m.id)).map((memo) => (
                        <div key={memo.id} style={{
                          padding: '10px 14px',
                          background: '#fff',
                          borderRadius: '8px',
                          borderLeft: '3px solid #D52B1E',
                          fontSize: '13px',
                          lineHeight: '1.5'
                        }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>{memo.author}</span>
                          <span style={{ color: '#9CA3AF', margin: '0 6px' }}>-</span>
                          <span style={{ color: '#1A1A1A' }}>{memo.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* チャット領域 */}
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 28px',
                    minHeight: '200px'
                  }}>
                    {memoInsightChat.length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        color: '#9CA3AF',
                        fontSize: '14px',
                        padding: '40px 20px',
                        lineHeight: '1.8'
                      }}>
                        選択したメモについてAIに質問しましょう。<br />
                        例：「これらのメモに共通するインサイトは？」「戦略的な示唆は？」
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {memoInsightChat.map((msg, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex',
                              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                              gap: '10px',
                              alignItems: 'flex-start'
                            }}
                          >
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: msg.role === 'user' ? '#374151' : '#D52B1E',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '700',
                              flexShrink: 0
                            }}>
                              {msg.role === 'user' ? 'Y' : 'AI'}
                            </div>
                            <div style={{
                              background: msg.role === 'user' ? '#1A1A1A' : '#F0F1F3',
                              color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                              padding: '14px 18px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              lineHeight: '1.7',
                              maxWidth: '75%'
                            }}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isMemoInsightGenerating && (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: '#D52B1E',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '700',
                              flexShrink: 0
                            }}>AI</div>
                            <div style={{
                              background: '#F0F1F3',
                              padding: '14px 18px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              color: '#9CA3AF'
                            }}>
                              分析中...
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 入力欄 */}
                  <div style={{
                    padding: '16px 28px',
                    borderTop: '1px solid #E5E7EB',
                    background: '#F8F9FA'
                  }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        value={memoInsightInput}
                        onChange={(e) => setMemoInsightInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isMemoInsightGenerating && sendMemoInsightMessage()}
                        placeholder="メモの背景にあるインサイトについて質問..."
                        disabled={isMemoInsightGenerating}
                        style={{
                          flex: 1,
                          padding: '14px 18px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          background: '#fff'
                        }}
                      />
                      <button
                        onClick={sendMemoInsightMessage}
                        disabled={!memoInsightInput.trim() || isMemoInsightGenerating}
                        style={{
                          background: (!memoInsightInput.trim() || isMemoInsightGenerating) ? '#D1D5DB' : '#D52B1E',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '14px 24px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: (!memoInsightInput.trim() || isMemoInsightGenerating) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        送信
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Section */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
              borderRadius: '12px',
              padding: '32px 40px',
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: window.innerWidth < 768 ? '20px' : '0',
              justifyContent: 'space-between',
              alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #E5E7EB'
            }}>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>包括的な市場分析完了</h3>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#6B7280'
                }}>次のステップ：AIペルソナとの対話で患者インサイトを深掘りしましょう</p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                style={{
                  background: '#D52B1E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 32px',
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(213, 43, 30, 0.15)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(213, 43, 30, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 43, 30, 0.15)';
                }}
              >
                AIペルソナと対話 →
              </button>
            </div>
          </div>
        )}

        {/* AI Persona Chat */}
        {activeTab === 'chat' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '2fr 1fr',
            gap: '24px',
            minHeight: 'calc(100vh - 280px)',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid #E5E7EB',
                background: '#F8F9FA'
              }}>
                <h2 style={{
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>
                  AIペルソナチャット - {selectedDisease}患者
                </h2>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  color: '#6B7280'
                }}>
                  患者の視点で対話し、深いインサイトを発見してください
                </p>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 32px'
              }}>
                {chatMessages.length === 0 ? (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF',
                    fontSize: '15px'
                  }}>
                    患者に質問を投げかけてみましょう
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                          gap: '12px',
                          alignItems: 'flex-start'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: msg.role === 'user' ? '#374151' : '#D52B1E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '700',
                          flexShrink: 0
                        }}>
                          {msg.role === 'user' ? 'Y' : 'AI'}
                        </div>
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div style={{
                            background: msg.role === 'user' ? '#1A1A1A' : '#F0F1F3',
                            color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            maxWidth: '80%',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
                          }}>
                            {msg.content}
                          </div>
                          {msg.role === 'assistant' && msg.id && (
                            <button
                              onClick={() => saveInsight(msg.id)}
                              disabled={savedInsights.find(s => s.id === msg.id)}
                              style={{
                                alignSelf: 'flex-start',
                                background: savedInsights.find(s => s.id === msg.id) ? '#16A34A' : '#D52B1E',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: savedInsights.find(s => s.id === msg.id) ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                opacity: savedInsights.find(s => s.id === msg.id) ? 0.7 : 1
                              }}
                            >
                              {savedInsights.find(s => s.id === msg.id) ? (
                                <>
                                  <Check size={14} />
                                  保存済み
                                </>
                              ) : (
                                <>
                                  <Save size={14} />
                                  インサイトを保存
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{
                padding: '24px 32px',
                borderTop: '1px solid #E5E7EB',
                background: '#F8F9FA'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="患者に質問してください..."
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      border: '2px solid #D1D5DB',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      background: '#D52B1E',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    送信
                  </button>
                </div>
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>保存済みインサイト</h3>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {savedInsights.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '14px',
                    padding: '40px 20px'
                  }}>
                    重要なインサイトを保存して<br />Journey作成に活用しましょう
                  </div>
                ) : (
                  savedInsights.map((insight, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#F8F9FA',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#1A1A1A',
                        borderLeft: '3px solid #D52B1E'
                      }}
                    >
                      {insight.content}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                          onClick={() => {
                            setSavedInsights(prev => prev.filter((_, idx) => idx !== i));
                            const fsInsight = firestoreInsights.find(fi => fi.messageId === String(insight.id));
                            if (fsInsight) deleteInsightFromFirestore(fsInsight.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            padding: '2px 6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px'
                          }}
                        >
                          <Trash2 size={12} />
                          削除
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {savedInsights.length > 0 && (
                <button
                  onClick={generateJourney}
                  style={{
                    marginTop: '20px',
                    background: '#D52B1E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Map size={18} />
                  Patient Journey生成
                </button>
              )}
            </div>
          </div>
        )}

        {/* Patient Journey */}
        {activeTab === 'journey' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            {!journey ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '80px 40px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB'
              }}>
                <Map size={56} color='#D52B1E' style={{ margin: '0 auto 24px auto' }} />
                <h2 style={{
                  margin: '0 0 16px 0',
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1A1A1A'
                }}>Patient Journeyを生成</h2>
                <p style={{
                  fontSize: '15px',
                  color: '#6B7280',
                  maxWidth: '600px',
                  margin: '0 auto 32px',
                  lineHeight: '1.7'
                }}>
                  ダッシュボードデータとAIペルソナとの対話から得たインサイトを統合し、<br />
                  包括的なPatient Journeyを自動生成します
                </p>
                <button
                  onClick={generateJourney}
                  style={{
                    background: '#D52B1E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '16px 40px',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(213, 43, 30, 0.15)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Journey生成を開始
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: 'clamp(20px, 4vw, 28px)',
                  marginBottom: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  gap: window.innerWidth < 768 ? '20px' : '0',
                  justifyContent: 'space-between',
                  alignItems: window.innerWidth < 768 ? 'flex-start' : 'center'
                }}>
                  <div>
                    <h2 style={{
                      margin: '0 0 8px 0',
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#1A1A1A'
                    }}>Patient Journey - {selectedDisease}</h2>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>患者の行動変容プロセスと各ステージでのマーケティング施策</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={toggleEditMode}
                      style={{
                        background: editingJourney ? '#16A34A' : '#FFFFFF',
                        color: editingJourney ? '#fff' : '#374151',
                        border: editingJourney ? 'none' : '1px solid #D1D5DB',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {editingJourney ? <Check size={16} /> : <Edit3 size={16} />}
                      {editingJourney ? '編集を保存' : '編集モード'}
                    </button>
                    <button
                      style={{
                        background: '#D52B1E',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Download size={16} />
                      エクスポート
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  paddingBottom: '20px'
                }}>

                  {(editingJourney ? editedJourney : journey).stages.map((stage, index) => (
                    <div
                      key={index}
                      style={{
                        minWidth: window.innerWidth < 768 ? '300px' : '360px',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        border: '1px solid #E5E7EB',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        background: index === 0 ? '#D52B1E' : '#374151',
                        color: '#fff',
                        padding: '20px',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          opacity: 0.9,
                          marginBottom: '8px'
                        }}>STEP {index + 1}</div>
                        <h3 style={{
                          margin: 0,
                          fontSize: '22px',
                          fontWeight: '700'
                        }}>{stage.name}</h3>
                      </div>

                        <div style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#D52B1E',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>行動</div>
                          {editingJourney ? (
                            <textarea
                              value={stage.behavior}
                              onChange={(e) => updateJourneyField(index, 'behavior', e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '14px',
                                color: '#1A1A1A',
                                lineHeight: '1.6',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                padding: '12px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          ) : (
                            <div style={{
                              fontSize: '14px',
                              color: '#1A1A1A',
                              lineHeight: '1.6'
                            }}>{stage.behavior}</div>
                          )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#D52B1E',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>接触媒体</div>
                          {editingJourney ? (
                            <textarea
                              value={stage.touchpoints}
                              onChange={(e) => updateJourneyField(index, 'touchpoints', e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '14px',
                                color: '#1A1A1A',
                                lineHeight: '1.6',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                padding: '12px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          ) : (
                            <div style={{
                              fontSize: '14px',
                              color: '#1A1A1A',
                              lineHeight: '1.6'
                            }}>{stage.touchpoints}</div>
                          )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#D52B1E',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>患者の思考</div>
                          {editingJourney ? (
                            <textarea
                              value={stage.thoughts}
                              onChange={(e) => updateJourneyField(index, 'thoughts', e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '14px',
                                color: '#1A1A1A',
                                lineHeight: '1.6',
                                fontStyle: 'italic',
                                background: '#F8F9FA',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #D1D5DB',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          ) : (
                            <div style={{
                              fontSize: '14px',
                              color: '#1A1A1A',
                              lineHeight: '1.6',
                              fontStyle: 'italic',
                              background: '#F8F9FA',
                              padding: '12px',
                              borderRadius: '8px'
                            }}>"{stage.thoughts}"</div>
                          )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#D52B1E',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>行動変容要因</div>
                          {editingJourney ? (
                            <textarea
                              value={stage.triggers}
                              onChange={(e) => updateJourneyField(index, 'triggers', e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '14px',
                                color: '#1A1A1A',
                                lineHeight: '1.6',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                padding: '12px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          ) : (
                            <div style={{
                              fontSize: '14px',
                              color: '#1A1A1A',
                              lineHeight: '1.6'
                            }}>{stage.triggers}</div>
                          )}
                        </div>

                        <div style={{
                          background: '#FFFBEB',
                          border: '1px solid #FCD34D',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '20px'
                        }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#1A1A1A',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>マーケティングポイント</div>
                          {editingJourney ? (
                            <textarea
                              value={stage.marketingPoints}
                              onChange={(e) => updateJourneyField(index, 'marketingPoints', e.target.value)}
                              style={{
                                width: '100%',
                                fontSize: '14px',
                                color: '#1A1A1A',
                                lineHeight: '1.6',
                                fontWeight: '500',
                                border: '1px solid #FCD34D',
                                borderRadius: '8px',
                                padding: '12px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '60px',
                                background: '#fff'
                              }}
                            />
                          ) : (
                            <div style={{
                              fontSize: '14px',
                              color: '#1A1A1A',
                              lineHeight: '1.6',
                              fontWeight: '500'
                            }}>{stage.marketingPoints}</div>
                          )}
                        </div>

                        <div>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#D52B1E',
                            marginBottom: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>推奨施策</span>
                            {editingJourney && (
                              <button
                                onClick={() => addJourneyAction(index)}
                                style={{
                                  background: '#16A34A',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 12px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Plus size={12} />
                                追加
                              </button>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {stage.actions.map((action, i) => (
                              <div
                                key={i}
                                style={{
                                  background: '#F8F9FA',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  color: '#1A1A1A',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                              >
                                {editingJourney ? (
                                  <>
                                    <input
                                      type="text"
                                      value={action}
                                      onChange={(e) => updateJourneyAction(index, i, e.target.value)}
                                      style={{
                                        flex: 1,
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        padding: '8px',
                                        fontSize: '13px',
                                        fontFamily: 'inherit',
                                        background: '#fff'
                                      }}
                                    />
                                    <button
                                      onClick={() => deleteJourneyAction(index, i)}
                                      style={{
                                        background: '#DC2626',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        flexShrink: 0
                                      }}
                                    >
                                      削除
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span style={{ flex: 1 }}>{action}</span>
                                    <button
                                      onClick={() => saveAction(stage.name, action)}
                                      disabled={savedActions.find(a => a.action === action)}
                                      style={{
                                        background: savedActions.find(a => a.action === action) ? '#16A34A' : '#D52B1E',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: savedActions.find(a => a.action === action) ? 'default' : 'pointer',
                                        flexShrink: 0,
                                        opacity: savedActions.find(a => a.action === action) ? 0.7 : 1
                                      }}
                                    >
                                      {savedActions.find(a => a.action === action) ? (
                                        <Check size={14} />
                                      ) : (
                                        <Save size={14} />
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legal Check */}
        {activeTab === 'legal' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB'
            }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>Legal Check</h2>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#6B7280'
              }}>保存した施策案を薬事法コンプライアンスの観点から審査し、リスクと代替案を提示します</p>
            </div>

            {savedActions.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '80px 40px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB'
              }}>
                <Shield size={48} color='#D52B1E' style={{ margin: '0 auto 24px auto' }} />
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>チェック対象の施策がありません</h3>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#6B7280'
                }}>Patient Journeyから施策を保存してください</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {savedActions.map((action) => (
                  <div
                    key={action.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '32px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '20px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'inline-block',
                          background: '#F8F9FA',
                          color: '#D52B1E',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          marginBottom: '12px'
                        }}>
                          {action.stage} | {action.disease}
                        </div>
                        <h3 style={{
                          margin: '0 0 8px 0',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1A1A1A'
                        }}>{action.action}</h3>
                      </div>
                      <button
                        onClick={() => performLegalCheck(action.id)}
                        disabled={legalChecks[action.id]}
                        style={{
                          background: legalChecks[action.id] ? '#16A34A' : '#D52B1E',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: legalChecks[action.id] ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          opacity: legalChecks[action.id] ? 0.7 : 1
                        }}
                      >
                        <Shield size={16} />
                        {legalChecks[action.id] ? 'チェック済み' : 'Legal Check実行'}
                      </button>
                    </div>

                    {legalChecks[action.id] && (
                      <div style={{
                        borderTop: '1px solid #E5E7EB',
                        paddingTop: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        {legalChecks[action.id].map((check, i) => (
                          <div
                            key={i}
                            style={{
                              background: check.status === 'warning' ? '#FFF7ED' :
                                         check.status === 'caution' ? '#FFFBEB' : '#F0FDF4',
                              border: `1px solid ${check.status === 'warning' ? '#FDBA74' :
                                                   check.status === 'caution' ? '#FDE68A' : '#BBF7D0'}`,
                              borderRadius: '10px',
                              padding: '20px'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px'
                            }}>
                              {check.status !== 'clear' && <AlertCircle size={20} color={check.status === 'warning' ? '#F59E0B' : '#FBBF24'} />}
                              <h4 style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#1A1A1A'
                              }}>{check.issue}</h4>
                            </div>
                            <p style={{
                              margin: '0 0 16px 0',
                              fontSize: '14px',
                              color: '#1A1A1A',
                              lineHeight: '1.6'
                            }}>{check.detail}</p>

                            {check.alternatives.length > 0 && (
                              <div>
                                <div style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: '#1A1A1A',
                                  marginBottom: '8px'
                                }}>推奨される代替案・回避策:</div>
                                <ul style={{
                                  margin: 0,
                                  paddingLeft: '20px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px'
                                }}>
                                  {check.alternatives.map((alt, j) => (
                                    <li key={j} style={{
                                      fontSize: '14px',
                                      color: '#1A1A1A',
                                      lineHeight: '1.6'
                                    }}>{alt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Data */}
        {activeTab === 'saved' && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1A1A1A'
                }}>Saved Data</h2>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#6B7280'
                }}>Firestoreに保存されたインサイト、施策、Legal Check結果、アクティビティログを管理します</p>
              </div>
              <button
                onClick={fetchFirestoreData}
                style={{
                  background: '#F8F9FA',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <RefreshCw size={14} />
                更新
              </button>
            </div>

            {!firestoreAvailable && (
              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '12px',
                padding: '20px 32px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertCircle size={20} color="#F59E0B" />
                <span style={{ fontSize: '14px', color: '#92400E' }}>
                  Firestoreに接続できません。環境変数を確認してください。ローカルの状態のみ使用中です。
                </span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* 保存済みインサイト */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E5E7EB',
                  background: '#F8F9FA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <MessageCircle size={18} color="#D52B1E" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>
                    保存済みインサイト ({firestoreInsights.length})
                  </h3>
                </div>
                <div style={{ padding: '16px 24px', maxHeight: '400px', overflowY: 'auto' }}>
                  {firestoreInsights.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '14px', padding: '32px 0' }}>
                      保存されたインサイトはありません
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {firestoreInsights.map((insight) => (
                        <div key={insight.id} style={{
                          background: '#F8F9FA',
                          padding: '14px 16px',
                          borderRadius: '8px',
                          borderLeft: '3px solid #D52B1E',
                          position: 'relative'
                        }}>
                          <div style={{
                            display: 'inline-block',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            marginBottom: '8px'
                          }}>{insight.disease}</div>
                          <div style={{ fontSize: '13px', color: '#1A1A1A', lineHeight: '1.6', marginBottom: '8px' }}>
                            {insight.content}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {insight.createdAt ? new Date(insight.createdAt).toLocaleString('ja-JP') : ''}
                            </span>
                            <button
                              onClick={() => deleteInsightFromFirestore(insight.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#DC2626',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <Trash2 size={14} />
                              削除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 保存済み施策 */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E5E7EB',
                  background: '#F8F9FA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Map size={18} color="#D52B1E" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>
                    保存済み施策 ({firestoreJourneys.length})
                  </h3>
                </div>
                <div style={{ padding: '16px 24px', maxHeight: '400px', overflowY: 'auto' }}>
                  {firestoreJourneys.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '14px', padding: '32px 0' }}>
                      保存された施策はありません
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {firestoreJourneys.map((item) => (
                        <div key={item.id} style={{
                          background: '#F8F9FA',
                          padding: '14px 16px',
                          borderRadius: '8px',
                          borderLeft: '3px solid #374151'
                        }}>
                          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                            <span style={{
                              background: '#FEE2E2',
                              color: '#DC2626',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>{item.disease}</span>
                            <span style={{
                              background: '#E5E7EB',
                              color: '#374151',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>{item.stage}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#1A1A1A', lineHeight: '1.6', marginBottom: '8px' }}>
                            {item.action}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {item.createdAt ? new Date(item.createdAt).toLocaleString('ja-JP') : ''}
                            </span>
                            <button
                              onClick={() => deleteJourneyFromFirestore(item.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#DC2626',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <Trash2 size={14} />
                              削除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Check結果 */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E5E7EB',
                  background: '#F8F9FA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Shield size={18} color="#D52B1E" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>
                    Legal Check結果 ({firestoreLegalResults.length})
                  </h3>
                </div>
                <div style={{ padding: '16px 24px', maxHeight: '400px', overflowY: 'auto' }}>
                  {firestoreLegalResults.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '14px', padding: '32px 0' }}>
                      保存されたLegal Check結果はありません
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {firestoreLegalResults.map((result) => (
                        <div key={result.id} style={{
                          background: '#F8F9FA',
                          padding: '14px 16px',
                          borderRadius: '8px',
                          borderLeft: '3px solid #F59E0B'
                        }}>
                          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                            <span style={{
                              background: '#FEE2E2',
                              color: '#DC2626',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>{result.disease}</span>
                            <span style={{
                              background: '#E5E7EB',
                              color: '#374151',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>{result.stage}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: '600', marginBottom: '6px' }}>
                            {result.action}
                          </div>
                          {result.checks && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {result.checks.map((check, ci) => (
                                <span key={ci} style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: check.status === 'warning' ? '#FEF3C7' :
                                             check.status === 'caution' ? '#FFF7ED' : '#DCFCE7',
                                  color: check.status === 'warning' ? '#92400E' :
                                         check.status === 'caution' ? '#9A3412' : '#166534',
                                  fontWeight: '600'
                                }}>
                                  {check.status === 'warning' ? '!' : check.status === 'caution' ? '?' : '+'} {check.issue}
                                </span>
                              ))}
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {result.createdAt ? new Date(result.createdAt).toLocaleString('ja-JP') : ''}
                            </span>
                            <button
                              onClick={() => deleteLegalResultFromFirestore(result.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#DC2626',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px'
                              }}
                            >
                              <Trash2 size={14} />
                              削除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* アクティビティログ */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #E5E7EB',
                background: '#F8F9FA',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={18} color="#D52B1E" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>
                  アクティビティログ ({activityLogs.length})
                </h3>
              </div>
              <div style={{ padding: '16px 24px', maxHeight: '500px', overflowY: 'auto' }}>
                {activityLogs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '14px', padding: '32px 0' }}>
                    アクティビティログはありません
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activityLogs.map((log) => (
                      <div key={log.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: '#F8F9FA',
                        borderRadius: '8px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: log.type === 'insight' ? '#D52B1E' :
                                     log.type === 'journey' ? '#374151' :
                                     log.type === 'legal' ? '#F59E0B' : '#9CA3AF',
                          flexShrink: 0
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              color: log.type === 'insight' ? '#D52B1E' :
                                     log.type === 'journey' ? '#374151' :
                                     log.type === 'legal' ? '#F59E0B' : '#6B7280'
                            }}>
                              {log.type === 'insight' ? 'インサイト' :
                               log.type === 'journey' ? '施策' :
                               log.type === 'legal' ? 'Legal Check' : log.type}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: log.action === 'save' ? '#16A34A' : '#DC2626',
                              fontWeight: '600'
                            }}>
                              {log.action === 'save' ? '保存' : '削除'}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.4' }}>
                            {log.detail}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                            {log.createdAt ? new Date(log.createdAt).toLocaleString('ja-JP') : ''}
                          </span>
                          <button
                            onClick={() => deleteLog(log.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#9CA3AF',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap');

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes numberPulse {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F4F5F7;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }

        @media (max-width: 768px) {
          nav {
            -webkit-overflow-scrolling: touch;
          }
          
          h1 {
            font-size: 20px !important;
          }
          
          h2 {
            font-size: 20px !important;
          }
          
          h3 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PharmaMarketingSolution;
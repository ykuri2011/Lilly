import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageCircle, Database, Map, Shield, Save, Download, Edit3, Plus, Check, AlertCircle, ChevronRight, ArrowRight } from 'lucide-react';

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
  
  // API設定
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const API_BASE_URL = 'http://localhost:3001/api';

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

  // API Key設定
  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      alert('API Keyを入力してください');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/set-api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setIsApiKeySet(true);
        setShowApiSettings(false);
        alert('API Keyが設定されました！');
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (error) {
      alert(`接続エラー: ${error.message}\n\nバックエンドサーバーが起動していることを確認してください。`);
    }
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
        { name: '自社製品', value: 25, color: '#d52b1e' },
        { name: '競合A', value: 35, color: '#757575' },
        { name: '競合B', value: 22, color: '#bdbdbd' },
        { name: '競合C', value: 18, color: '#e0e0e0' }
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
        { name: '自社製品', value: 18, color: '#d52b1e' },
        { name: '競合A', value: 42, color: '#757575' },
        { name: '競合B', value: 25, color: '#bdbdbd' },
        { name: '競合C', value: 15, color: '#e0e0e0' }
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
        { name: '自社製品', value: 31, color: '#d52b1e' },
        { name: '競合A', value: 28, color: '#757575' },
        { name: '競合B', value: 24, color: '#bdbdbd' },
        { name: '競合C', value: 17, color: '#e0e0e0' }
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
        { name: '自社製品', value: 22, color: '#d52b1e' },
        { name: '競合A', value: 38, color: '#757575' },
        { name: '競合B', value: 26, color: '#bdbdbd' },
        { name: '競合C', value: 14, color: '#e0e0e0' }
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
        { name: '自社製品', value: 20, color: '#d52b1e' },
        { name: '競合A', value: 32, color: '#757575' },
        { name: '競合B', value: 28, color: '#bdbdbd' },
        { name: '競合C', value: 20, color: '#e0e0e0' }
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
        { name: '自社製品', value: 15, color: '#d52b1e' },
        { name: '競合A', value: 45, color: '#757575' },
        { name: '競合B', value: 28, color: '#bdbdbd' },
        { name: '競合C', value: 12, color: '#e0e0e0' }
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
        { name: '自社製品', value: 28, color: '#d52b1e' },
        { name: '競合A', value: 31, color: '#757575' },
        { name: '競合B', value: 23, color: '#bdbdbd' },
        { name: '競合C', value: 18, color: '#e0e0e0' }
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

  // ダッシュボードデータ
  const marketData = {
    tam: 4500000,
    sam: 1800000,
    som: 450000
  };

  const competitorShare = currentData.competitorShare;
  const regionalSales = currentData.regionalSales;
  const consumerInsights = currentData.consumerInsights;

  // AIペルソナチャット
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    if (!isApiKeySet) {
      alert('先にGemini API Keyを設定してください');
      setShowApiSettings(true);
      return;
    }

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
    }
  };

  // Patient Journey生成
  const generateJourney = async () => {
    if (!isApiKeySet) {
      alert('先にGemini API Keyを設定してください');
      setShowApiSettings(true);
      return;
    }

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
  };

  // Legal Check
  const performLegalCheck = async (actionId) => {
    const action = savedActions.find(a => a.id === actionId);
    if (!action) return;

    if (!isApiKeySet) {
      alert('先にGemini API Keyを設定してください');
      setShowApiSettings(true);
      return;
    }

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
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif'
    }}>
      {/* API設定モーダル */}
      {showApiSettings && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#212121',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Shield size={28} color='#d52b1e' />
              Gemini API Key 設定
            </h2>
            
            <p style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: '#757575',
              lineHeight: '1.6'
            }}>
              AI機能（AIペルソナ、Patient Journey生成、Legal Check）を使用するには、Google Gemini API Keyが必要です。
            </p>

            <div style={{
              background: '#f5f5f5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <strong>API Keyの取得方法：</strong><br />
              1. <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#d52b1e' }}>Google AI Studio</a> にアクセス<br />
              2. Googleアカウントでログイン<br />
              3. "Get API Key" をクリックしてAPI Keyを生成<br />
              4. 生成されたキーをコピーして下記に貼り付け
            </div>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Keyを入力してください"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '24px',
                fontFamily: 'monospace',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d52b1e'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowApiSettings(false)}
                style={{
                  background: '#e0e0e0',
                  color: '#212121',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleSetApiKey}
                style={{
                  background: '#d52b1e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                設定する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ローディングオーバーレイ */}
      {isGenerating && (
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
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f5f5f5',
              borderTop: '4px solid #d52b1e',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#212121'
            }}>AI生成中...</div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <header style={{
        background: '#212121',
        color: '#fff',
        padding: '0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px',
            gap: '16px',
            flexWrap: 'wrap',
            minHeight: '80px'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(20px, 4vw, 28px)',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              <span style={{ color: '#d52b1e' }}>PHARMA</span> Intelligence
            </h1>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setShowApiSettings(true)}
                style={{
                  background: isApiKeySet ? '#4caf50' : '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Shield size={16} />
                {isApiKeySet ? 'API設定済み' : 'API設定'}
              </button>
              <select
                value={selectedDisease}
                onChange={(e) => handleDiseaseChange(e.target.value)}
                style={{
                  background: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  fontWeight: '500',
                  color: '#212121',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease'
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
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: '80px',
        zIndex: 999,
        overflowX: 'auto'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: '0',
          minWidth: 'max-content'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Database },
            { id: 'chat', label: 'AI Persona', icon: MessageCircle },
            { id: 'journey', label: 'Patient Journey', icon: Map },
            { id: 'legal', label: 'Legal Check', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? '#d52b1e' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#212121',
                  border: 'none',
                  padding: '20px 24px',
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  borderBottom: activeTab === tab.id ? '3px solid #d52b1e' : '3px solid transparent',
                  position: 'relative',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: 'clamp(20px, 4vw, 40px)'
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
              background: 'linear-gradient(135deg, #d52b1e 0%, #a82218 100%)',
              borderRadius: '12px',
              padding: '20px 32px',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(213, 43, 30, 0.2)',
              animation: isTransitioning ? 'none' : 'slideInDown 0.5s ease both',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(-20px)' : 'translateY(0)',
              transition: 'all 0.3s ease'
            }}>
              <div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>現在の分析対象</div>
                <h2 style={{
                  margin: 0,
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: '700',
                  color: '#fff',
                  animation: isTransitioning ? 'none' : 'numberPulse 0.6s ease 0.2s both'
                }}>{selectedDisease}</h2>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '12px 20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
                  データ更新時刻
                </div>
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
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
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderLeft: i < 3 ? '3px solid #d52b1e' : '3px solid #212121',
                  animation: isTransitioning ? 'none' : `slideInUp 0.5s ease ${i * 0.05}s both`,
                  transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#757575',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>{item.label}</div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#212121',
                    marginBottom: '4px',
                    animation: isTransitioning ? 'none' : `numberPulse 0.6s ease ${i * 0.05 + 0.2}s both`
                  }}>{item.value}</div>
                  <div style={{
                    fontSize: '11px',
                    color: '#757575',
                    marginBottom: '6px'
                  }}>{item.desc}</div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: item.change.startsWith('+') ? '#4caf50' : '#f44336',
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
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                animation: isTransitioning ? 'none' : 'slideInLeft 0.6s ease 0.3s both',
                transform: isTransitioning ? 'translateX(-20px)' : 'translateX(0)',
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
                    color: '#212121'
                  }}>エリア別販売状況</h3>
                  <div style={{
                    fontSize: '11px',
                    color: '#757575',
                    background: '#f5f5f5',
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
                    <Bar dataKey="sales" fill="#212121" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="growth" fill="#d52b1e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Competitor Share */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.4s both',
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#212121'
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
                      background: '#f5f5f5',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '10px',
                          height: '10px',
                          background: item.color,
                          borderRadius: '2px'
                        }} />
                        <span style={{ fontSize: '13px', color: '#212121', fontWeight: '500' }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#212121' }}>
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consumer Insights */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                animation: isTransitioning ? 'none' : 'slideInRight 0.6s ease 0.5s both',
                transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#212121'
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
                          color: '#212121',
                          fontWeight: '600'
                        }}>{item.category}</span>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#d52b1e'
                        }}>{item.score}</span>
                      </div>
                      <div style={{
                        background: '#f5f5f5',
                        height: '8px',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: item.score > 75 ? '#d52b1e' : '#757575',
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
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.6s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#212121'
                }}>医療機関分析</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {currentData.medicalInstitutions.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: '#f5f5f5',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#212121' }}>
                          {item.type}
                        </div>
                        <div style={{ fontSize: '11px', color: '#757575', marginTop: '2px' }}>
                          {item.count}施設
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#d52b1e' }}>
                          {item.adoption}%
                        </div>
                        <div style={{ fontSize: '10px', color: item.trend === 'up' ? '#4caf50' : '#757575', fontWeight: '600' }}>
                          {item.trend === 'up' ? '↑' : '→'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Trend */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.7s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#212121'
                }}>処方推移</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={currentData.prescriptionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '11px' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#d52b1e" strokeWidth={3} dot={{ fill: '#d52b1e', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Macro Trends */}
              <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                animation: isTransitioning ? 'none' : 'slideInUp 0.6s ease 0.8s both',
                opacity: isTransitioning ? 0 : 1,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#212121'
                }}>マクロトレンド</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentData.macroTrends.map((item, i) => (
                    <div key={i} style={{
                      padding: '12px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      borderLeft: `3px solid ${item.impact === '高' ? '#d52b1e' : '#757575'}`
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#212121',
                        marginBottom: '4px'
                      }}>{item.trend}</div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '6px'
                      }}>
                        <span style={{ fontSize: '11px', color: '#757575' }}>
                          {item.indicator}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#d52b1e' }}>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div style={{
              background: 'linear-gradient(135deg, #212121 0%, #424242 100%)',
              borderRadius: '12px',
              padding: '32px 40px',
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: window.innerWidth < 768 ? '20px' : '0',
              justifyContent: 'space-between',
              alignItems: window.innerWidth < 768 ? 'stretch' : 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#fff'
                }}>包括的な市場分析完了</h3>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#bdbdbd'
                }}>次のステップ：AIペルソナとの対話で患者インサイトを深掘りしましょう</p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                style={{
                  background: '#d52b1e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 32px',
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(213, 43, 30, 0.4)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(213, 43, 30, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(213, 43, 30, 0.4)';
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
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '24px 32px',
                borderBottom: '1px solid #e0e0e0',
                background: '#f5f5f5'
              }}>
                <h2 style={{
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#212121'
                }}>
                  AIペルソナチャット - {selectedDisease}患者
                </h2>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  color: '#757575'
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
                    color: '#bdbdbd',
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
                          background: msg.role === 'user' ? '#212121' : '#d52b1e',
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
                            background: msg.role === 'user' ? '#212121' : '#f5f5f5',
                            color: msg.role === 'user' ? '#fff' : '#212121',
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
                                background: savedInsights.find(s => s.id === msg.id) ? '#4caf50' : '#d52b1e',
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
                borderTop: '1px solid #e0e0e0',
                background: '#f5f5f5'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="患者に質問してください..."
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      background: '#fff'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      background: '#d52b1e',
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
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#212121'
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
                    color: '#bdbdbd',
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
                        background: '#f5f5f5',
                        padding: '16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#212121',
                        borderLeft: '3px solid #d52b1e'
                      }}
                    >
                      {insight.content}
                    </div>
                  ))
                )}
              </div>
              {savedInsights.length > 0 && (
                <button
                  onClick={generateJourney}
                  style={{
                    marginTop: '20px',
                    background: '#212121',
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
                background: '#fff',
                borderRadius: '16px',
                padding: '80px 40px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Map size={64} color='#d52b1e' style={{ margin: '0 auto 24px auto' }} />
                <h2 style={{
                  margin: '0 0 16px 0',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#212121'
                }}>Patient Journeyを生成</h2>
                <p style={{
                  fontSize: '16px',
                  color: '#757575',
                  maxWidth: '600px',
                  margin: '0 auto 32px'
                }}>
                  ダッシュボードデータとAIペルソナとの対話から得たインサイトを統合し、<br />
                  包括的なPatient Journeyを自動生成します
                </p>
                <button
                  onClick={generateJourney}
                  style={{
                    background: '#d52b1e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px 48px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(213, 43, 30, 0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Journey生成を開始
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: 'clamp(20px, 4vw, 32px)',
                  marginBottom: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  gap: window.innerWidth < 768 ? '20px' : '0',
                  justifyContent: 'space-between',
                  alignItems: window.innerWidth < 768 ? 'flex-start' : 'center'
                }}>
                  <div>
                    <h2 style={{
                      margin: '0 0 8px 0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#212121'
                    }}>Patient Journey - {selectedDisease}</h2>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#757575'
                    }}>患者の行動変容プロセスと各ステージでのマーケティング施策</p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={toggleEditMode}
                      style={{
                        background: editingJourney ? '#4caf50' : '#212121',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {editingJourney ? <Check size={16} /> : <Edit3 size={16} />}
                      {editingJourney ? '編集を保存' : '編集モード'}
                    </button>
                    <button
                      style={{
                        background: '#d52b1e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
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
                        minWidth: window.innerWidth < 768 ? '300px' : '380px',
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        background: index === 0 ? '#d52b1e' : '#212121',
                        color: '#fff',
                        padding: '24px',
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
                            color: '#d52b1e',
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
                                color: '#212121',
                                lineHeight: '1.6',
                                border: '2px solid #d52b1e',
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
                              color: '#212121',
                              lineHeight: '1.6'
                            }}>{stage.behavior}</div>
                          )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#d52b1e',
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
                                color: '#212121',
                                lineHeight: '1.6',
                                border: '2px solid #d52b1e',
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
                              color: '#212121',
                              lineHeight: '1.6'
                            }}>{stage.touchpoints}</div>
                          )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#d52b1e',
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
                                color: '#212121',
                                lineHeight: '1.6',
                                fontStyle: 'italic',
                                background: '#f5f5f5',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '2px solid #d52b1e',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                minHeight: '60px'
                              }}
                            />
                          ) : (
                            <div style={{
                              fontSize: '14px',
                              color: '#212121',
                              lineHeight: '1.6',
                              fontStyle: 'italic',
                              background: '#f5f5f5',
                              padding: '12px',
                              borderRadius: '8px'
                            }}>"{stage.thoughts}"</div>
                          )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#d52b1e',
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
                                color: '#212121',
                                lineHeight: '1.6',
                                border: '2px solid #d52b1e',
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
                              color: '#212121',
                              lineHeight: '1.6'
                            }}>{stage.triggers}</div>
                          )}
                        </div>

                        <div style={{
                          background: '#fffbf0',
                          border: '2px solid #ffd700',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '20px'
                        }}>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#212121',
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
                                color: '#212121',
                                lineHeight: '1.6',
                                fontWeight: '500',
                                border: '2px solid #ffd700',
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
                              color: '#212121',
                              lineHeight: '1.6',
                              fontWeight: '500'
                            }}>{stage.marketingPoints}</div>
                          )}
                        </div>

                        <div>
                          <div style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#d52b1e',
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
                                  background: '#4caf50',
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
                                  background: '#f5f5f5',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  color: '#212121',
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
                                        border: '2px solid #d52b1e',
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
                                        background: '#f44336',
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
                                        background: savedActions.find(a => a.action === action) ? '#4caf50' : '#d52b1e',
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
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#212121'
              }}>Legal Check - 薬事法コンプライアンス</h2>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#757575'
              }}>保存した施策案を薬事法の観点から審査し、リスクと代替案を提示します</p>
            </div>

            {savedActions.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '80px 40px',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}>
                <Shield size={64} color='#d52b1e' style={{ margin: '0 auto 24px auto' }} />
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#212121'
                }}>チェック対象の施策がありません</h3>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#757575'
                }}>Patient Journeyから施策を保存してください</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {savedActions.map((action) => (
                  <div
                    key={action.id}
                    style={{
                      background: '#fff',
                      borderRadius: '16px',
                      padding: '32px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
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
                          background: '#f5f5f5',
                          color: '#d52b1e',
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
                          color: '#212121'
                        }}>{action.action}</h3>
                      </div>
                      <button
                        onClick={() => performLegalCheck(action.id)}
                        disabled={legalChecks[action.id]}
                        style={{
                          background: legalChecks[action.id] ? '#4caf50' : '#d52b1e',
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
                        borderTop: '1px solid #e0e0e0',
                        paddingTop: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        {legalChecks[action.id].map((check, i) => (
                          <div
                            key={i}
                            style={{
                              background: check.status === 'warning' ? '#fff3e0' :
                                         check.status === 'caution' ? '#fff9e6' : '#e8f5e9',
                              border: `2px solid ${check.status === 'warning' ? '#ff9800' :
                                                   check.status === 'caution' ? '#ffc107' : '#4caf50'}`,
                              borderRadius: '12px',
                              padding: '20px'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px'
                            }}>
                              {check.status !== 'clear' && <AlertCircle size={20} color={check.status === 'warning' ? '#ff9800' : '#ffc107'} />}
                              <h4 style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#212121'
                              }}>{check.issue}</h4>
                            </div>
                            <p style={{
                              margin: '0 0 16px 0',
                              fontSize: '14px',
                              color: '#212121',
                              lineHeight: '1.6'
                            }}>{check.detail}</p>

                            {check.alternatives.length > 0 && (
                              <div>
                                <div style={{
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  color: '#212121',
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
                                      color: '#212121',
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
      </main>

      <style>{`
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
          background: #f5f5f5;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9e9e9e;
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
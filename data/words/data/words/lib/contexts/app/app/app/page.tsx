'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { lookupWord, loadCoreDictionary } from '@/lib/dictionary';
import { WordEntry } from '@/types';

export default function Home() {
  const { progress, addXP } = useUser();
  const [searchWord, setSearchWord] = useState('');
  const [searchResult, setSearchResult] = useState<WordEntry | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string>('');
  
  // لغات التطبيق الخمس
  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
    { code: 'en', name: 'English (الإنجليزية)', flag: '🇬🇧' },
    { code: 'fr', name: 'Français (الفرنسية)', flag: '🇫🇷' },
    { code: 'es', name: 'Español (الإسبانية)', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch (الألمانية)', flag: '🇩🇪' }
  ];

  useEffect(() => {
    // تحميل القواميس الأساسية في الخلفية
    loadCoreDictionary('ar');
    loadCoreDictionary('en');
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchWord.trim()) return;
    setSearching(true);
    // البحث الافتراضي من العربية إلى الإنجليزية كمثال ويمكن التغيير بالواجهة
    const result = await lookupWord(searchWord.trim(), 'ar', 'en');
    setSearchResult(result);
    setSearching(false);
    if (result) {
      addXP(5); // مكافأة البحث عن كلمة جديدة والتعلم
    }
  };

  return (
    <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col rtl">
      {/* شريط علوي عصري - بدون قلوب */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
            🌟 مستوى {progress.level}
          </div>
        </div>
        <h1 className="text-xl font-black tracking-wide">ليرنر • Learner</h1>
        <div className="flex items-center gap-1 font-bold text-yellow-300">
          🔥 {progress.xp} XP
        </div>
      </header>

      <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* قسم محرك البحث والمعجم الذكي */}
        <section className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
            🔍 المعجم الفوري الذكي
          </h2>
          <p className="text-xs text-orange-600 mb-3">ابحث عن أي كلمة لترجمتها وحفظها في معجمك وتكسب 5 XP!</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="اكتب كلمة بالعربية..."
              className="flex-1 px-4 py-2 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-black text-center"
            />
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition">
              {searching ? '...' : 'بحث'}
            </button>
          </form>

          {searchResult && (
            <div className="mt-4 bg-white border border-orange-200 rounded-xl p-3 shadow-inner text-right">
              <p className="font-bold text-xl text-indigo-900 border-b pb-1 mb-2 text-center">{searchResult.word}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {searchResult.translations.en && <div>🇬🇧 الإنجليزية: <span className="font-semibold text-black">{searchResult.translations.en}</span></div>}
                {searchResult.translations.fr && <div>🇫🇷 الفرنسية: <span className="font-semibold text-black">{searchResult.translations.fr}</span></div>}
                {searchResult.translations.es && <div>🇪🇸 الإسبانية: <span className="font-semibold text-black">{searchResult.translations.es}</span></div>}
                {searchResult.translations.de && <div>🇩🇪 الألمانية: <span className="font-semibold text-black">{searchResult.translations.de}</span></div>}
              </div>
              {searchResult.category && <span className="inline-block mt-3 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-md">📁 {searchResult.category}</span>}
            </div>
          )}
        </section>

        {/* قسم مسارات اللغات الخمس */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">🧭 اختر مسار اللغة المفضل لديك:</h2>
          <div className="grid grid-cols-1 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedPath(lang.code)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold ${
                  selectedPath === lang.code
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {selectedPath === lang.code ? '🎯 نشط' : 'ابدأ'}
              </button>
            ))}
          </div>
        </section>

        {/* قسم الألعاب التعليمية والألعاب المصغرة */}
        <section className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
            🎮 ساحة الألعاب التفاعلية (Gamification)
          </h2>
          <p className="text-xs text-blue-600 mb-4">اختبر ذاكرتك واكسب نقاط XP لترقية مستواك البرمجي واللغوي!</p>
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => alert('جاري تحميل لعبة بطاقات الذاكرة...')} className="bg-white hover:bg-blue-100 border-2 border-blue-300 p-3 rounded-xl flex flex-col items-center gap-1 transition shadow-sm text-center">
              <span className="text-2xl">🎴</span>
              <span className="font-bold text-sm text-gray-800">بطاقات الذاكرة</span>
            </button>
            <button onClick={() => alert('جاري تشغيل لعبة التوصيل والربط...')} className="bg-white hover:bg-blue-100 border-2 border-blue-300 p-3 rounded-xl flex flex-col items-center gap-1 transition shadow-sm text-center">
              <span className="text-2xl">🔗</span>
              <span className="font-bold text-sm text-gray-800">لعبة التوصيل الذكي</span>
            </button>
          </div>
        </section>
      </div>

      <footer className="p-3 bg-gray-50 border-t text-center text-xs text-gray-400 font-semibold">
        تطبيق ليرنر الذكي لتعلم اللغات 🚀 2026
      </footer>
    </main>
  );
}

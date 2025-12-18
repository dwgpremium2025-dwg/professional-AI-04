
import React, { useState, useRef, useEffect } from 'react';
import { User, Role, Language, DICTIONARY, ImageState, TranslationKey } from './types';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import { geminiService } from './services/geminiService';
import { authService } from './services/authService';

// Icons
const IconUndo = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>;
const IconRedo = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15 21 9m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0-2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>;
const IconRotate = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const IconPhoto = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
const IconUploadLarge = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>;
const IconKey = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>;
const IconLightning = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.981 9.75h7.263a.75.75 0 0 1 .53 1.28l-15.39 12.024a.75.75 0 0 1-1.187-.806l2.355-8.248H.75a.75.75 0 0 1-.53-1.28L11.96 1.012a.75.75 0 0 1 .808-.053l1.847.636Z" clipRule="evenodd" /></svg>;
const IconStar = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>;

const IconBrandLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/10 group overflow-hidden relative">
    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white relative z-10">
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258c.94-.236 1.674-.97 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z" clipRule="evenodd" />
    </svg>
  </div>
);

const EXTERIOR_PRESETS = [
  {
    label: "Modern Village (หมู่บ้านจัดสรร)",
    value: "Transform into a lively modern housing village. Add large transplanted trees with wooden supports (props) following new landscaping styles. Lush green lawns. Clean, well-kept village roads. Modern architecture, bright atmosphere."
  },
  {
    label: "Vibrant Modern Village (หมู่บ้านจัดสรรที่มีชีวิตชีวา)",
    value: "A vibrant, lively modern housing estate. Incorporate large transplanted trees with visible wooden support frames in a contemporary landscaping style. Include lush, manicured green lawns and exceptionally clean, pristine village roads. Bright daylight, welcoming atmosphere."
  },
  {
    label: "Lively Garden (สวนไม้ขุดล้อม)",
    value: "Change to a lively modern housing village. Add large transplanted trees with wooden supports according to new gardening styles. Lush green lawns. Clean village roads."
  },
  { label: "Modern Minimalist", value: "Luxurious modern minimalist building, white cubic forms, glass balcony, swimming pool, palm trees, midday sun." },
  { label: "Backyard Landscape", value: "Luxurious backyard, infinity pool, stone tiles, sun loungers, tropical plants, resort atmosphere." },
  { label: "Khao Yai Modern", value: "Modern house, concrete and wood slats, floor to ceiling glass, mountain backdrop, reflecting pool, morning sun." }
];

const INTERIOR_PRESETS = [
  {
    label: "Plan to 3D",
    value: `Envisioning Interior Spaces\nRealistic perspective view based on floor plans. Entrance view encompassing bed, wardrobe, and bathroom access. Modern, minimalist, and warm aesthetic. Light wood, linen, and marble-like tile. Harmonious and inviting atmosphere.`
  },
  { label: "Modern Living Room", value: "Modern living room, large windows, natural light, beige sofa, wooden floor, minimalist decor." },
  { label: "Luxury Bedroom", value: "Master bedroom, king size bed, soft lighting, luxury hotel style, city view." }
];

const PLAN_PRESETS = [
  { label: "2D Floor Plan", value: "Architectural 2D floor plan, room labels, furniture layout, blueprint style." },
  { label: "3D Floor Plan", value: "3D isometric floor plan cutaway, realistic textures, furniture placement." }
];

const IMAGE_STYLES: { labelKey: TranslationKey; value: string }[] = [
  { labelKey: 'stylePhoto', value: 'Photorealistic style, 8k, highly detailed' },
  { labelKey: 'styleOil', value: 'Oil painting style, textured' },
  { labelKey: 'stylePencil', value: 'Pencil sketch style' }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>(Language.TH);
  const [showAdmin, setShowAdmin] = useState(false);

  const [mainPrompt, setMainPrompt] = useState('');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'EXTERIOR' | 'INTERIOR' | 'PLAN'>('EXTERIOR');
  const [useProModel, setUseProModel] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(true);
  const [imageStyleOpen, setImageStyleOpen] = useState(true);
  
  const [history, setHistory] = useState<ImageState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [referenceImage, setReferenceImage] = useState<{data: string, mime: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [isAiStudioSupported, setIsAiStudioSupported] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  const t = DICTIONARY[lang];
  const currentPresets = activeTab === 'EXTERIOR' ? EXTERIOR_PRESETS : activeTab === 'INTERIOR' ? INTERIOR_PRESETS : PLAN_PRESETS;

  useEffect(() => {
    if (!user) return;
    const unsubscribe = authService.listenToUserSession(user.id, (userData) => {
        if (!userData || !userData.isActive) {
            setUser(null);
            alert("Session expired.");
        }
    });
    return () => unsubscribe();
  }, [user]);

  // Check if selection tool is available in this environment
  useEffect(() => {
    const checkAvailability = async () => {
        const aiStudio = (window as any).aistudio;
        if (aiStudio && typeof aiStudio.hasSelectedApiKey === 'function' && typeof aiStudio.openSelectKey === 'function') {
            setIsAiStudioSupported(true);
            const selected = await aiStudio.hasSelectedApiKey();
            setHasKey(selected);
        } else {
            setIsAiStudioSupported(false);
        }
    };
    checkAvailability();
    const interval = setInterval(checkAvailability, 5000); // Check less frequently
    return () => clearInterval(interval);
  }, []);

  const handleOpenKeyDialog = async () => {
    try {
        const aiStudio = (window as any).aistudio;
        if (aiStudio && typeof aiStudio.openSelectKey === 'function') {
            await aiStudio.openSelectKey();
            setHasKey(true); // Assume success per instructions
        }
    } catch (e) {
        console.error("Error opening key dialog:", e);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    
    // For Pro model, ensure a key is selected if the tool is supported
    if (useProModel && isAiStudioSupported) {
        const aiStudio = (window as any).aistudio;
        const selected = await aiStudio.hasSelectedApiKey();
        if (!selected) {
            await aiStudio.openSelectKey();
            // Proceed immediately
        }
    }

    setLoading(true);
    try {
      const effectivePrompt = historyIndex > 0 && refinePrompt ? refinePrompt : mainPrompt;
      let promptToSend = effectivePrompt;
      if (!promptToSend && referenceImage) promptToSend = "Apply style of reference image.";
      else if (!promptToSend) {
        alert("Enter prompt or image.");
        setLoading(false); return;
      }

      const currentResult = history[historyIndex];
      const genData = await geminiService.generateImage(
          promptToSend, 
          currentResult?.data, currentResult?.mimeType,
          referenceImage?.data, referenceImage?.mime,
          useProModel
      );

      const newImg: ImageState = { data: genData, mimeType: 'image/png', id: `g-${Date.now()}`, timestamp: Date.now() };
      const newHistory = [...history.slice(0, historyIndex + 1), newImg];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setRefinePrompt('');
    } catch (error: any) {
      console.error("Generation error:", error);
      if (error.message === "API_KEY_MISSING") {
          alert("No API Key found. Please select a Project Key to use AI features.");
          if (isAiStudioSupported) await handleOpenKeyDialog();
      } else if (error.message === "PROJECT_KEY_INVALID" || (error.message && error.message.includes("Requested entity was not found"))) {
          alert("Your Project Key doesn't have access to this model. Please select a valid key with billing enabled.");
          if (isAiStudioSupported) await handleOpenKeyDialog();
      } else {
          alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpscale4K = async () => {
    const currentImg = history[historyIndex];
    if (!currentImg) return;
    
    if (isAiStudioSupported) {
        const aiStudio = (window as any).aistudio;
        if (!(await aiStudio.hasSelectedApiKey())) {
            await aiStudio.openSelectKey();
        }
    }

    setLoading(true);
    try {
      const upData = await geminiService.upscaleImage4K(currentImg.data, currentImg.mimeType);
      const newImg = { data: upData, mimeType: 'image/png', id: `u-${Date.now()}`, timestamp: Date.now() };
      setHistory([...history.slice(0, historyIndex + 1), newImg]);
      setHistoryIndex(historyIndex + 1);
    } catch (e: any) {
      if (e.message && e.message.includes("Requested entity was not found")) {
          alert("Upscale requires a Pro Project Key.");
          if (isAiStudioSupported) await handleOpenKeyDialog();
      } else {
          alert("Upscale failed: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (p: any) => {
     setMainPrompt(p.value);
     setActivePreset(p.label);
     setActiveStyle(null);
  }

  const applyImageStyle = (s: any) => {
    setMainPrompt(prev => prev.includes(s.value) ? prev : `${prev}, ${s.value}`.trim());
    setActiveStyle(s.labelKey);
  };

  if (!user) return <Login onLogin={setUser} lang={lang} />;

  const currentImage = history[historyIndex];

  return (
    <div className="flex flex-col h-screen bg-brand-dark text-white font-sans">
      <header className="h-16 bg-brand-panel border-b border-gray-700 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
            <IconBrandLogo />
            <div className="flex flex-col">
                <div className="text-xl font-black">PROFESSIONAL <span className="text-brand-blue">AI</span></div>
            </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setHistoryIndex(0)} disabled={historyIndex <= 0} className="text-gray-400 text-xs flex items-center gap-1 disabled:opacity-30 hover:text-white transition-colors"><IconRefresh /> {t.reset}</button>
          <button onClick={() => { setHistory([]); setHistoryIndex(-1); setMainPrompt(''); setReferenceImage(null); }} className="text-gray-400 text-xs hover:text-white transition-colors">+ {t.newProject}</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:underline mb-0.5">Billing Docs</a>
            
            {/* Show selection button only if the tool is available in the environment */}
            {isAiStudioSupported && (
                <button 
                onClick={handleOpenKeyDialog} 
                className={`flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-[10px] px-2.5 py-1 rounded-md border ${hasKey ? 'border-green-500/50' : 'border-gray-600'} active:scale-95 transition-all shadow-sm group`}
                title="Select a Project Key to enable Pro features"
                >
                <div className={`w-1.5 h-1.5 rounded-full ${hasKey ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <IconKey /> 
                <span className="font-bold group-hover:text-brand-blue">Project Key</span>
                </button>
            )}
          </div>
          <button onClick={() => setLang(lang === Language.TH ? Language.EN : Language.TH)} className="text-xs font-bold bg-black/40 px-2 py-1 rounded border border-gray-600 hover:bg-black/60">{lang}</button>
          <div className="flex items-center gap-2">
            {user.role === Role.ADMIN && <button onClick={() => setShowAdmin(true)} className="text-[10px] bg-blue-700 px-2 py-1 rounded hover:bg-blue-600">Admin</button>}
            <button onClick={() => setUser(null)} className="text-[10px] bg-red-900/50 px-2 py-1 rounded hover:bg-red-800">{t.logout}</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[300px] bg-brand-panel border-r border-gray-700 flex flex-col p-3 z-10 shadow-lg overflow-y-auto">
          <div className="flex bg-black/40 p-1 rounded-lg border border-gray-600 mb-3">
             {['EXTERIOR', 'INTERIOR', 'PLAN'].map(tab => (
               <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-all ${activeTab === tab ? 'bg-brand-blue text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}>
                 {tab === 'EXTERIOR' ? t.tabExterior : tab === 'INTERIOR' ? t.tabInterior : t.tabPlan}
               </button>
             ))}
          </div>

          <div className="mb-4 bg-black/40 p-1 rounded-lg flex border border-gray-600">
            <button onClick={() => setUseProModel(false)} className={`flex-1 py-2 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${!useProModel ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}><IconLightning /> Standard</button>
            <button onClick={() => setUseProModel(true)} className={`flex-1 py-2 text-[10px] font-bold rounded-md flex items-center justify-center gap-1 transition-all ${useProModel ? 'bg-brand-blue text-white shadow' : 'text-gray-400 hover:text-gray-200'}`} title={isAiStudioSupported ? "Requires Project Key" : "Pro Features"}><IconStar /> Pro (2K)</button>
          </div>

          <div className="mb-3">
            <label className="text-[10px] text-brand-blue font-bold uppercase mb-1 block tracking-wider">{t.mainPrompt}</label>
            <textarea value={mainPrompt} onChange={(e) => { setMainPrompt(e.target.value); setActivePreset(null); }} className="w-full bg-black/30 border border-gray-600 rounded p-2.5 text-xs text-white h-24 focus:border-brand-blue outline-none leading-relaxed transition-colors resize-none shadow-inner" placeholder="Describe your design..."/>
          </div>

          {historyIndex >= 0 && (
            <div className="mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block tracking-wider">{t.refinePrompt}</label>
              <textarea value={refinePrompt} onChange={(e) => setRefinePrompt(e.target.value)} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-xs text-white h-14 focus:border-brand-blue outline-none transition-colors" placeholder="Modify specific parts..."/>
            </div>
          )}

          <div className="mb-3">
             <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block tracking-wider">{t.uploadRef}</label>
             <input type="file" accept="image/*" ref={refFileInputRef} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setReferenceImage({ data: (ev.target?.result as string).split(',')[1], mime: file.type });
                    reader.readAsDataURL(file);
                }
             }} className="hidden" />
             {!referenceImage ? (
                <button onClick={() => refFileInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-brand-blue hover:bg-brand-blue/5 hover:border-brand-blue/50 transition-all bg-black/20 group"><IconPhoto /><span className="text-[10px] mt-2 font-bold group-hover:text-brand-blue transition-colors">+ Reference Style</span></button>
             ) : (
                <div className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-600 bg-black group cursor-pointer" onClick={() => refFileInputRef.current?.click()}>
                  <img src={`data:${referenceImage.mime};base64,${referenceImage.data}`} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                  <button onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }} className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 rounded-full p-1 transition-colors text-white shadow-lg"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" /></svg></button>
                </div>
             )}
          </div>

          <div className="mb-2 border-t border-gray-700 pt-3">
             <div onClick={() => setImageStyleOpen(!imageStyleOpen)} className="flex items-center justify-between w-full cursor-pointer text-[10px] font-black tracking-widest text-gray-400 mb-2 uppercase hover:text-white transition-colors">
                <span>{t.imageStyle}</span><span>{imageStyleOpen ? '−' : '+'}</span>
             </div>
             {imageStyleOpen && (
               <div className="grid grid-cols-1 gap-1.5 animate-in fade-in duration-300">
                  {IMAGE_STYLES.map((s, i) => (
                    <button key={i} onClick={() => applyImageStyle(s)} className={`text-left text-[11px] px-3 py-2 rounded-md border transition-all ${activeStyle === s.labelKey ? 'bg-brand-blue border-brand-blue text-white shadow-md' : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-brand-blue/50 hover:bg-gray-800'}`}>
                      {t[s.labelKey]}
                    </button>
                  ))}
                </div>
             )}
          </div>

          <div className="flex-1 mb-4 border-t border-gray-700 pt-3">
             <div onClick={() => setPresetsOpen(!presetsOpen)} className="flex items-center justify-between w-full cursor-pointer text-[10px] font-black tracking-widest text-gray-400 mb-2 uppercase hover:text-white transition-colors">
                <span>{t.presets}</span><span>{presetsOpen ? '−' : '+'}</span>
             </div>
             {presetsOpen && (
               <div className="space-y-1 animate-in fade-in duration-300">
                  {currentPresets.map((p, i) => (
                    <button key={i} onClick={() => applyPreset(p)} className={`w-full text-left text-[11px] px-3 py-2 rounded-md border transition-all ${activePreset === p.label ? 'bg-brand-blue border-brand-blue text-white shadow-md' : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-brand-blue/50 hover:bg-gray-800'}`}>
                      {p.label}
                    </button>
                  ))}
               </div>
             )}
          </div>

          <button onClick={handleGenerate} disabled={loading} className="w-full bg-brand-blue text-white text-sm font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <><IconSparkles /> {t.generate}</>}
          </button>
        </aside>

        <main className="flex-1 relative bg-black flex flex-col items-center justify-center overflow-hidden">
           <div className="relative w-full h-full flex items-center justify-center p-12 pb-28">
              {currentImage ? (
                 <div className="relative group max-w-full max-h-full">
                    <img src={`data:${currentImage.mimeType};base64,${currentImage.data}`} className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-500 rounded-sm" style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})` }} />
                    <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="w-full max-w-2xl aspect-video border-4 border-dashed border-brand-blue/20 rounded-[40px] bg-brand-blue/5 hover:bg-brand-blue/10 hover:border-brand-blue/40 transition-all flex flex-col items-center justify-center cursor-pointer group shadow-2xl">
                   <div className="text-brand-blue mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 opacity-60 group-hover:opacity-100"><IconUploadLarge /></div>
                   <h3 className="text-3xl font-black text-brand-blue/80 mb-3 tracking-tight group-hover:text-brand-blue transition-colors">Upload Main Design</h3>
                   <p className="text-gray-500 text-sm font-medium tracking-wide">Drag & drop your architectural photo or click to browse</p>
                   <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                              const base64 = (ev.target?.result as string).split(',')[1];
                              const newImg = { data: base64, mimeType: file.type, id: `o-${Date.now()}`, timestamp: Date.now() };
                              setHistory([newImg]); setHistoryIndex(0); setRotation(0); setFlipH(false);
                          };
                          reader.readAsDataURL(file);
                      }
                   }} className="hidden" />
                </div>
              )}
           </div>

           {currentImage && (
             <div className="absolute bottom-8 bg-brand-panel/95 backdrop-blur-md border border-gray-700/50 rounded-[28px] px-8 py-4 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 animate-in slide-in-from-bottom-6 duration-500">
                <button onClick={() => setHistoryIndex(historyIndex - 1)} disabled={historyIndex <= 0} className="flex flex-col items-center text-gray-400 hover:text-white disabled:opacity-20 transition-all active:scale-90"><IconUndo /><span className="text-[10px] mt-1.5 font-bold tracking-tighter">{t.undo}</span></button>
                <button onClick={() => setHistoryIndex(historyIndex + 1)} disabled={historyIndex >= history.length - 1} className="flex flex-col items-center text-gray-400 hover:text-white disabled:opacity-20 transition-all active:scale-90"><IconRedo /><span className="text-[10px] mt-1.5 font-bold tracking-tighter">{t.redo}</span></button>
                <div className="w-px h-10 bg-gray-700/50"></div>
                <button onClick={() => setFlipH(!flipH)} className="flex flex-col items-center text-gray-400 hover:text-white group transition-all active:scale-90"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg><span className="text-[10px] mt-1.5 font-bold tracking-tighter">Flip</span></button>
                <button onClick={() => setRotation(r => r - 90)} className="flex flex-col items-center text-gray-400 hover:text-white transition-all active:scale-90"><IconRotate /><span className="text-[10px] mt-1.5 font-bold tracking-tighter">Rotate</span></button>
                <div className="w-px h-10 bg-gray-700/50"></div>
                <button onClick={handleUpscale4K} className="flex flex-col items-center text-white hover:text-brand-blue group transition-all active:scale-95">
                    <span className="font-black text-xl leading-none group-hover:scale-110 transition-transform">4K</span>
                    <span className="text-[10px] mt-1 font-bold tracking-tighter">Upscale</span>
                </button>
                <div className="w-px h-10 bg-gray-700/50"></div>
                <button onClick={() => {
                   const link = document.createElement('a');
                   link.href = `data:${currentImage.mimeType};base64,${currentImage.data}`;
                   link.download = `professional-ai-${Date.now()}.png`;
                   link.click();
                }} className="flex flex-col items-center text-brand-blue hover:text-blue-400 font-bold transition-all active:scale-90"><IconDownload /><span className="text-[10px] mt-1.5 font-bold tracking-tighter">{t.download}</span></button>
             </div>
           )}
        </main>
      </div>

      {showAdmin && user.role === Role.ADMIN && <AdminPanel user={user} lang={lang} onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;

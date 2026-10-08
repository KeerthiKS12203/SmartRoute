'use client';

import { useState, type ChangeEvent } from 'react';
import { Package, MapPin, Calendar, Weight } from 'lucide-react';

type TabType = 'Create' | 'Current' | 'History';

function CreateLoad(){
    const [language, setLanguage] = useState<"en"| "kn">("en");
    const text={
        en:{
            title:"Trader Form",
            load_item: "Load Item",
            weight: "Weight",
            weightNote: "Enter weight in kg",
            from:"From",
            to:"To",
            departureBy: "Departure By",
            submit:"Submit",
            vehicleError:"Enter exactly 10 digits",
            weightPlaceholder:"Enter weight",
            fromPlaceholder:"Enter starting location",
            toPlaceholder:"Enter destination",
        },
        kn:{
            title: "ವ್ಯಾಪಾರಕರ ಫಾರ್ಮ್",
            load_item: "ಸರಕಿನ ವಸ್ತು",
            weight: "ತೂಕ",
            weightNote: "ತೂಕವನ್ನು ಕಿಲೋಗ್ರಾಂಗಳಲ್ಲಿ (ಕೆಜಿ) ನಮೂದಿಸಿ.",
            from: "ಇಂದ",
            to: "ಗೆ",
            availableFrom: "ಲಭ್ಯವಿರುವ ಸಮಯ",
            departureBy: "ನಿರ್ಗಮನದ ಸಮಯ",
            submit: "ಸಲ್ಲಿಸಿ",
            vehicleError: "ದಯವಿಟ್ಟು ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ.",
            weightPlaceholder: "ತೂಕವನ್ನು ನಮೂದಿಸಿ",
            fromPlaceholder: "ಪ್ರಾರಂಭದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ",
            toPlaceholder: "ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಮೂದಿಸಿ",
        }
    };
    const t = text[language];

    return(
        <div>
            <style>{`
                .trader-form-page{
                    margin:32px auto;
                    padding:24px;
                }
                .trader-field-pair{
                    display:grid;
                    grid-template-columns: repeat(2, minmax(0,1fr));
                    gap:16px;

                }
                .trader-field-pair>div{
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .trader-field-pair input{
                    width: 100%;
                    box-sizing: border-box;
                }
                @media (max-width:640 px){
                    .trader-form-page{
                        margin: 16px;
                        padding: 16px;
                    }
                    .trader-field-pair{
                    grid-template-columns: 1fr;

                    }
                }
            `}</style>

            <div className="trader-form-page" >
                {/*LANGUAGE TOGGLE*/}
            <div>
                <button onClick={() =>setLanguage("en")}>
                    English
                </button>
                <button onClick = {() => setLanguage("kn")}>
                    ಕನ್ನಡ
                </button>
            </div>
            <br />
            <h2>{t.title}</h2>
            {/* LOAD ITEM */}
            <label>{t.load_item}</label>
            <br />
            <input
             type="text"
             placeholder={t.load_item}
            />

            <br />
            <br />

            {/* WEIGHT */}
            <label>{t.weight}</label>
            <br />
            <input
             type="text"
             placeholder={t.weightPlaceholder}
            />
            <small
                style={{
                    display:"block",
                    marginTop:"6px",
                    color:"#64748b"
                }}
            >
                {t.weightNote}
            </small>
            <br />
            <br />
            {/* FROM / TO */}
            <div className="trader-field-pair">
             <div>
               <label>{t.from}</label>
               <input
                 type="text"
                 placeholder={t.fromPlaceholder}
                />
             </div>

            <div>
                <label>{t.to}</label>
                <input
                    type="text"
                    placeholder={t.toPlaceholder}
                />
            </div>
        </div>

      <br />
      <br />

      {/* AVAILABLE FROM / DEPARTURE BY */}
      <div className="trader-field-pair">
        <div>
          <label>{t.departureBy}</label>
          <input type="datetime-local" />
        </div>
      </div>

      <br />
      <br />


      <button>{t.submit}</button>
      </div>
      </div>
    );
}

// 1. Define the TypeScript interface for the shipment data
interface ShipmentItem {
  id: string;
  item: string;
  source: string;
  destination: string;
  departBy: string;
  weight: string;
}

// Mock Data
const sampleItems: ShipmentItem[] = [
  {
    id: '1',
    item: 'Industrial Engine Parts',
    source: 'Chicago, IL',
    destination: 'Austin, TX',
    departBy: 'Oct 12, 2026',
    weight: '1,250 lbs',
  },
  {
    id: '2',
    item: 'Medical Supplies (Boxes)',
    source: 'Boston, MA',
    destination: 'Miami, FL',
    departBy: 'Oct 15, 2026',
    weight: '340 lbs',
  },
];

function currentLoads() {
  return (
    <div className="w-full py-4">
      {/* 50% width on md screens, full width on mobile screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" style={{ display: 'grid', width: '100%', gap: '1.5rem' }}>
        {sampleItems.map((data) => (
          <div
            key={data.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 text-left"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem',
              textAlign: 'left'
            }}
          >
            {/* Header: Load Item Name */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg" style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '0.5rem', color: '#2563eb' }}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
                    Load Item
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {data.load_item}
                  </h3>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                Active
              </span>
            </div>

            {/* Body: From & To Routes */}
            <div className="relative pl-6 space-y-4 my-4 ml-3" style={{ position: 'relative', paddingLeft: '1.5rem', marginLeft: '0.75rem', borderLeft: '2px dashed #e5e7eb' }}>
              {/* From */}
              <div className="relative" style={{ marginBottom: '1rem' }}>
                <div className="absolute bg-white p-0.5 text-gray-400" style={{ position: 'absolute', left: '-31px', top: '2px', backgroundColor: '#ffffff', padding: '0.125rem' }}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>From</p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{data.from}</p>
              </div>

              {/* To */}
              <div className="relative">
                <div className="absolute bg-white p-0.5 text-gray-600" style={{ position: 'absolute', left: '-31px', top: '2px', backgroundColor: '#ffffff', padding: '0.125rem' }}>
                  <MapPin className="w-4 h-4 text-blue-600" style={{ color: '#2563eb' }} />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>To</p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{data.to}</p>
              </div>
            </div>

            {/* Footer: Weight Field */}
            <div className="pt-4 border-t border-gray-100 text-sm" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', fontSize: '0.875rem' }}>
              <div className="flex items-center space-x-2.5" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Weight className="w-4 h-4 text-gray-400 shrink-0" style={{ color: '#9ca3af' }} />
                <div>
                  <p className="text-xs text-gray-500" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Weight</p>
                  <p className="font-medium text-gray-800" style={{ fontWeight: 500, color: '#1f2937', margin: 0 }}>{data.weight}</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

function CreateTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">📊 Add Load</h2>
      <CreateLoad/>
    </div>
  );
}

function CurrentTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">📋 Technical Current</h2>
      {currentLoads()}
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">⚙️ Load History</h2>
      <p className="text-gray-600">Manage your preferences, configure layout thresholds, or toggle options here.</p>
    </div>
  );
}

export default function LoadPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Current');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Create':
        return <CreateTab />;
      case 'Current':
        return <CurrentTab />;
      case 'History':
        return <HistoryTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">-----------------------------------------------------------------------------------------------------------------------------------</h1>

      <div className="flex border-b border-gray-200 mb-6" role="tablist">
        {(['Create', 'Current', 'History'] as TabType[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`py-2 px-4 font-medium capitalize border-b-2 transition-all -mb-[2px] ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 animate-fade-in">
        {renderTabContent()}
      </div>
    </div>
  );
}

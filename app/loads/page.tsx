'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { Package, MapPin, Calendar, RefreshCw, RotateCw, Weight, CheckCircle } from 'lucide-react';

type TabType = 'Create' | 'Current' | 'History';

  const API_BASE_URL = "https://8000-kode-ws-c69bd7bb1.hebbale.academy"

interface FormState {
  item: string;
  weight: string;
  source: string;
  desti: string;
  depart_by: string;
}

function CreateLoad() {
  const [language, setLanguage] = useState<"en" | "kn">("en");
  
  // Input fields form states
  const [formData, setFormData] = useState<FormState>({
    item: '',
    weight: '',
    source: '',
    desti: '',
    depart_by: ''
  });

  // Action status indicators
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const text = {
    en: {
      title: "Add New Load",
      load_item: "Load Item",
      weight: "Weight",
      weightNote: "Enter weight in kg",
      from: "From",
      to: "To",
      departureBy: "Departure By",
      submit: "Submit",
      submitting: "Submitting...",
      weightPlaceholder: "Enter weight",
      fromPlaceholder: "Enter starting location",
      toPlaceholder: "Enter destination",
      loadPlaceholder: "Enter load item type",
      missingPhoneError: "Phone number not found. Please log in.",
      validationError: "Please fill out all the input fields correctly.",
      successMessage: "Successfully added the load to queue!"
    },
    kn: {
      title: "ಹೊಸ ಸಾಗಣೆ",
      load_item: "ಸರಕಿನ ವಸ್ತು",
      weight: "ತೂಕ",
      weightNote: "ತೂಕವನ್ನು ಕಿಲೋಗ್ರಾಂಗಳಲ್ಲಿ (ಕೆಜಿ) ನಮೂದಿಸಿ.",
      from: "ಇಂದ",
      to: "ಗೆ",
      departureBy: "ನಿರ್ಗಮನದ ಸಮಯ",
      submit: "ಸಲ್ಲಿಸಿ",
      submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
      weightPlaceholder: "ತೂಕವನ್ನು ನಮೂದಿಸಿ",
      fromPlaceholder: "ಪ್ರಾರಂಭದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ",
      toPlaceholder: "ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಮೂದಿಸಿ",
      loadPlaceholder: "ಸರಕಿನ ವಸ್ತುವನ್ನು ನಮೂದಿಸಿ",
      missingPhoneError: "ಫೋನ್ ಸಂಖ್ಯೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಲಾಗ್ ಇನ್ ಮಾಡಿ.",
      validationError: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಸರಿಯಾಗಿ ಭರ್ತಿ ಮಾಡಿ.",
      successMessage: "ಸರಕನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕ್ಯೂಗೆ ಸೇರಿಸಲಾಗಿದೆ!"
    }
  };

  const t = text[language];
  const API_BASE_URL = "http://localhost:8000";

  // Handles text transformations and data input binds
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Handler processing target values to FastAPI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Pull phone parameters out from browser local storage safely
    const storedPhone = localStorage.getItem("temp_register_phone");
    if (!storedPhone) {
      setStatusMessage({ type: 'error', text: t.missingPhoneError });
      return;
    }

    // Basic Input Validations
    if (!formData.item || !formData.weight || !formData.source || !formData.desti || !formData.depart_by) {
      setStatusMessage({ type: 'error', text: t.validationError });
      return;
    }

    setLoading(true);

    try {
      // Setup payload matching the backend BaseModel schema requirements
      const payload = {
        trader_phno: parseInt(storedPhone, 10),
        item: formData.item,
        weight: parseInt(formData.weight, 10) || 0,
        source: formData.source,
        desti: formData.desti,
        // Map native local string parameters directly into ISO String timestamps
        depart_by: new Date(formData.depart_by).toISOString(),
        // arrive_by defaults to 24 hours post departure if not explicitly separated on UI
        arrive_by: new Date(new Date(formData.depart_by).getTime() + 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/create/load`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Unable to add the load to queue");
      }

      // Clear layout fields upon completed successful executions
      setStatusMessage({ type: 'success', text: t.successMessage });
      setFormData({ item: '', weight: '', source: '', desti: '', depart_by: '' });

    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || "Network layout connectivity failure." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        .trader-form-page {
          margin: 32px auto;
          padding: 32px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          text-align: left;
          max-width: 600px;
        }
        .lang-btn {
          padding: 6px 16px;
          margin-right: 8px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #d1d5db;
          background-color: #ffffff;
          transition: all 0.2s;
        }
        .lang-btn.active {
          background-color: #2563eb;
          color: white;
          border-color: #2563eb;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 14px;
          font-size: 15px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .trader-field-pair {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .trader-field-pair > div {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background-color: #2563eb;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #1d4ed8;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .alert-box {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .alert-success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        /* Correct media block padding compilation */
        @media (max-width: 640px) {
          .trader-form-page {
            margin: 16px;
            padding: 20px;
          }
          .trader-field-pair {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>

      <div className="trader-form-page">
        {/* LANGUAGE TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button 
            type="button"
            className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button 
            type="button"
            className={`lang-btn ${language === 'kn' ? 'active' : ''}`} 
            onClick={() => setLanguage("kn")}
          >
            ಕನ್ನಡ
          </button>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>
          {t.title}
        </h2>

        {/* Dynamic Submission Alerts */}
        {statusMessage && (
          <div className={`alert-box ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* LOAD ITEM */}
          <div>
            <label className="form-label">{t.load_item}</label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleInputChange}
              className="form-input"
              placeholder={t.loadPlaceholder}
            />
          </div>

          {/* WEIGHT */}
          <div>
            <label className="form-label">{t.weight}</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-input"
              placeholder={t.weightPlaceholder}
              min="1"
            />
            <small style={{ display: "block", marginTop: "6px", color: "#64748b", fontSize: '12px' }}>
              {t.weightNote}
            </small>
          </div>
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
      </form>
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


// TypeScript interface matching your FastAPI schema mapping
interface LoadItem {
  load_id: number;
  trader_phno: number;
  item: string | null;
  weight: number | null;
  source: string;
  desti: string;
  depart_by: string | null;
  arrive_by: string | null;
  timestamp: string;
  match_id: string | null;
}

function CurrentLoads() {
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Configuration base URL for your FastAPI server engine

  const handleFetchLoads = async () => {
    setError("");
    setLoading(true);

    // Pull phone parameters out from browser local storage safely
    const phno = localStorage.getItem("temp_register_phone");
    
    if (!phno) {
      setError("No phone number found in storage. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/current_load/${phno}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setLoads([]);
          throw new Error("No active matching loads found.");
        }
        throw new Error("Failed to communicate with data engine.");
      }
      
      const data: LoadItem[] = await res.json();
      setLoads(data);
    } catch (err: any) {
      setError(err.message || "Server error. Is your FastAPI engine active?");
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when the dashboard viewport initialises
  useEffect(() => {
    handleFetchLoads();
  }, []);

  return (
    <div className="w-full py-4 text-left">
      {/* Action Header bar with Reload Status Trigger */}
      <div className="flex items-center justify-between mb-4" style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button 
          onClick={handleFetchLoads}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline border-none bg-transparent cursor-pointer disabled:opacity-50"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2563eb', cursor: 'pointer', background: 'transparent', border: 'none' }}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating...' : 'Refresh List'}
        </button>
      </div>

      {/* Conditional Error notifications */}
      {error && (
        <div className="p-4 mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200" style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.5rem', color: '#b45309', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Empty State Handler fallback */}
      {!loading && loads.length === 0 && !error && (
        <div className="p-8 text-center text-sm text-gray-400 bg-white rounded-xl border border-dashed border-gray-200" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', backgroundColor: '#ffffff', border: '1px dashed #e5e7eb', borderRadius: '0.75rem' }}>
          No records are currently registered under this account profile.
        </div>
      )}

      {/* Responsive Structural View layout grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" style={{ display: 'grid', width: '100%', gap: '1.5rem' }}>
        {loads.map((data) => (
          <div
            key={data.load_id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem'
            }}
          >
            {/* Header: Load Item Title */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg" style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '0.5rem', color: '#2563eb' }}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
                    Load ID #{data.load_id}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {data.item || 'Unlabeled Freight'}
                  </h3>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                Active
              </span>
            </div>

            {/* Body: From (Source) & To (Desti) Metrics */}
            <div className="relative pl-6 space-y-4 my-4 ml-3" style={{ position: 'relative', paddingLeft: '1.5rem', marginLeft: '0.75rem', borderLeft: '2px dashed #e5e7eb' }}>
              {/* Source (from) */}
              <div className="relative" style={{ marginBottom: '1rem' }}>
                <div className="absolute bg-white p-0.5 text-gray-400" style={{ position: 'absolute', left: '-31px', top: '2px', backgroundColor: '#ffffff', padding: '0.125rem' }}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>From</p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{data.source}</p>
              </div>

              {/* Destination (desti) */}
              <div className="relative">
                <div className="absolute bg-white p-0.5 text-blue-600" style={{ position: 'absolute', left: '-31px', top: '2px', backgroundColor: '#ffffff', padding: '0.125rem' }}>
                  <MapPin className="w-4 h-4 text-blue-600" style={{ color: '#2563eb' }} />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>To</p>
                <p className="text-sm font-semibold text-gray-800" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>{data.desti}</p>
              </div>
            </div>

            {/* Footer: Mass Weight Attributes */}
            <div className="pt-4 border-t border-gray-100 text-sm" style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', fontSize: '0.875rem' }}>
              <div className="flex items-center space-x-2.5" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Weight className="w-4 h-4 text-gray-400 shrink-0" style={{ color: '#9ca3af' }} />
                <div>
                  <p className="text-xs text-gray-500" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Weight Metric</p>
                  <p className="font-medium text-gray-800" style={{ fontWeight: 500, color: '#1f2937', margin: 0 }}>
                    {data.weight ? `${data.weight.toLocaleString()} kg` : 'Weight Unspecified'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

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
      <h2 className="text-xl font-semibold text-gray-800">📋 Current Loads</h2>
      {CurrentLoads()}
    </div>
  );
}


// TypeScript interface matching your FastAPI schema mapping
interface HistoryLoadItem {
  load_id: number;
  trader_phno: number;
  item: string | null;
  weight: number | null;
  source: string;
  desti: string;
  depart_by: string | null;
  arrive_by: string | null;
  timestamp: string;
  match_id: string | null;
}

export function HistoryTab() {
  const [historyLoads, setHistoryLoads] = useState<HistoryLoadItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Configuration base URL for your FastAPI server engine

  const handleFetchHistory = async () => {
    setError("");
    setLoading(true);

    // Pull phone parameters out from browser local storage safely
    const phno = localStorage.getItem("temp_register_phone");
    
    if (!phno) {
      setError("No phone number found in storage. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/history_load/${phno}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setHistoryLoads([]);
          throw new Error("No past records found for this phone number.");
        }
        throw new Error("Failed to communicate with data engine.");
      }
      
      const data: HistoryLoadItem[] = await res.json();
      setHistoryLoads(data);
    } catch (err: any) {
      setError(err.message || "Server error. Is your FastAPI engine active?");
    } finally {
      setLoading(false);
    }
  };

  // Run automatically when the history view initialises
  useEffect(() => {
    handleFetchHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'left' }}>
      
      {/* Header bar with Reload Status Trigger */}
      <div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 className="text-xl font-semibold text-gray-800" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>⚙️ Load History</h2>
        <button 
          onClick={handleFetchHistory}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-gray-600 font-medium hover:underline border-none bg-transparent cursor-pointer disabled:opacity-50"
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4b5563', cursor: 'pointer', background: 'transparent', border: 'none' }}
        >
          <RotateCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Updating...' : 'Refresh History'}
        </button>
      </div>

      {/* Conditional Error notifications */}
      {error && (
        <div className="p-4 mb-4 text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200" style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.5rem', color: '#b45309', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Empty State Handler fallback */}
      {!loading && historyLoads.length === 0 && !error && (
        <div className="p-8 text-center text-sm text-gray-400 bg-white rounded-xl border border-dashed border-gray-200" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', backgroundColor: '#ffffff', border: '1px dashed #e5e7eb', borderRadius: '0.75rem' }}>
          No archived or completed shipments found under this profile.
        </div>
      )}

      {/* Responsive Structural View layout grid: full screen on mobile, half screen on larger viewports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" style={{ display: 'grid', width: '100%', gap: '1.5rem', gridTemplateColumns: historyLoads.length > 0 ? 'repeat(auto-fit, minmax(300px, 1fr))' : '1fr' }}>
        {historyLoads.map((data) => (
          <div
            key={data.load_id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 opacity-90 transition-shadow duration-200"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '1.5rem'
            }}
          >
            {/* Header: Load Item Title */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div className="flex items-center space-x-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="p-2 bg-gray-50 text-gray-500 rounded-lg" style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', borderRadius: '0.5rem', color: '#6b7280' }}>
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Load ID #{data.load_id}
                  </span>
                  <h3 className="text-lg font-bold text-gray-700 leading-tight" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#374151', margin: 0 }}>
                    {data.item || 'Unlabeled Freight'}
                  </h3>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" style={{ backgroundColor: '#f3f4f6', color: '#1f2937', padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500 }}>
                Matched
              </span>
            </div>

            {/* Body: From (Source) & To (Desti) Metrics */}
            <div className="relative pl-6 space-y-4 my-4 ml-3" style={{ position: 'relative', paddingLeft: '1.5rem', marginLeft: '0.75rem', borderLeft: '2px dashed #d1d5db' }}>
              {/* Source (from) */}
              <div className="relative" style={{ marginBottom: '1rem' }}>
                <div className="absolute bg-white p-0.5 text-gray-400" style={{ position: 'absolute', left: '-31px', top: '2px', backgroundColor: '#ffffff', padding: '0.125rem' }}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400 font-medium uppercase" style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0, textTransform: 'uppercase' }}>From</p>
                <p className="text-sm font-semibold text-gray-600" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', margin: 0 }}>{data.source}</p>
              </div>

              {/* Destination (desti) */}
              <div className="relative">
                <div className="absolute bg-white p-0.5 text-gray-400" style={{ position: 'absolute', left: '-31px', top: '2px', backgroundColor: '#ffffff', padding: '0.125rem' }}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase" style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, textTransform: 'uppercase' }}>To</p>
                <p className="text-sm font-semibold text-gray-600" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563', margin: 0 }}>{data.desti}</p>
              </div>
            </div>

            {/* Footer: Mass Weight Attributes & Match System Assignment Data */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1rem', fontSize: '0.875rem' }}>
              <div className="flex items-center space-x-2.5" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Weight className="w-4 h-4 text-gray-400 shrink-0" style={{ color: '#9ca3af' }} />
                <div>
                  <p className="text-xs text-gray-400" style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Weight Metric</p>
                  <p className="font-medium text-gray-600" style={{ fontWeight: 500, color: '#4b5563', margin: 0 }}>
                    {data.weight ? `${data.weight.toLocaleString()} kg` : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs text-green-700 font-medium" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#15803d', fontWeight: 500 }}>
                <CheckCircle className="w-3.5 h-3.5 text-green-600" style={{ color: '#16a34a' }} />
                <span>ID: {data.match_id || 'Archived'}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
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

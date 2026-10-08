'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  MapPin,
  RefreshCw,
  RotateCw,
  Weight,
  CheckCircle,
} from 'lucide-react';

type TabType = 'Create' | 'Current' | 'History';

const API_BASE_URL =
  'https://8000-kode-ws-c69bd7bb1.hebbale.academy';

interface FormState {
  item: string;
  weight: string;
  source: string;
  desti: string;
  depart_by: string;
}

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

/* =========================================================
   CREATE LOAD
========================================================= */

function CreateLoad() {
  const [language, setLanguage] = useState<'en' | 'kn'>('en');

  const [storedPhone, setStoredPhone] = useState<string>('');

  const [formData, setFormData] = useState<FormState>({
    item: '',
    weight: '',
    source: '',
    desti: '',
    depart_by: '',
  });

  const [loading, setLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  /*
   * Get logged-in user's phone number.
   *
   * IMPORTANT:
   * Login/Register must store:
   *
   * localStorage.setItem("user_phone", phone);
   */
  useEffect(() => {
    const savedPhone = localStorage.getItem('user_phone') || '';
    setStoredPhone(savedPhone);
  }, []);

  const text = {
    en: {
      title: 'Add New Load',
      load_item: 'Load Item',
      weight: 'Weight',
      weightNote: 'Enter weight in kg',
      from: 'From',
      to: 'To',
      departureBy: 'Departure By',
      submit: 'Submit',
      submitting: 'Submitting...',
      weightPlaceholder: 'Enter weight',
      fromPlaceholder: 'Enter starting location',
      toPlaceholder: 'Enter destination',
      loadPlaceholder: 'Enter load item type',
      missingPhoneError: 'Phone number not found. Please log in.',
      validationError: 'Please fill out all the input fields correctly.',
      successMessage: 'Successfully added the load to queue!',
    },

    kn: {
      title: 'ಹೊಸ ಸಾಗಣೆ',
      load_item: 'ಸರಕಿನ ವಸ್ತು',
      weight: 'ತೂಕ',
      weightNote: 'ತೂಕವನ್ನು ಕಿಲೋಗ್ರಾಂಗಳಲ್ಲಿ (ಕೆಜಿ) ನಮೂದಿಸಿ.',
      from: 'ಇಂದ',
      to: 'ಗೆ',
      departureBy: 'ನಿರ್ಗಮನದ ಸಮಯ',
      submit: 'ಸಲ್ಲಿಸಿ',
      submitting: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
      weightPlaceholder: 'ತೂಕವನ್ನು ನಮೂದಿಸಿ',
      fromPlaceholder: 'ಪ್ರಾರಂಭದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ',
      toPlaceholder: 'ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಮೂದಿಸಿ',
      loadPlaceholder: 'ಸರಕಿನ ವಸ್ತುವನ್ನು ನಮೂದಿಸಿ',
      missingPhoneError:
        'ಫೋನ್ ಸಂಖ್ಯೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಲಾಗ್ ಇನ್ ಮಾಡಿ.',
      validationError:
        'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಸರಿಯಾಗಿ ಭರ್ತಿ ಮಾಡಿ.',
      successMessage: 'ಸರಕನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕ್ಯೂಗೆ ಸೇರಿಸಲಾಗಿದೆ!',
    },
  };

  const t = text[language];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setStatusMessage(null);

    /*
     * Read directly from localStorage at submit time.
     * This makes sure we always use the latest logged-in phone.
     */
    const phone =
      localStorage.getItem('user_phone') || storedPhone;

    if (!phone) {
      setStatusMessage({
        type: 'error',
        text: t.missingPhoneError,
      });
      return;
    }

    if (
      !formData.item ||
      !formData.weight ||
      !formData.source ||
      !formData.desti ||
      !formData.depart_by
    ) {
      setStatusMessage({
        type: 'error',
        text: t.validationError,
      });
      return;
    }

    const weight = parseInt(formData.weight, 10);

    if (isNaN(weight) || weight <= 0) {
      setStatusMessage({
        type: 'error',
        text: t.validationError,
      });
      return;
    }

    setLoading(true);

    try {
      const departureDate = new Date(formData.depart_by);

      if (isNaN(departureDate.getTime())) {
        throw new Error('Invalid departure date.');
      }

      const arriveDate = new Date(
        departureDate.getTime() + 24 * 60 * 60 * 1000
      );

      const payload = {
        trader_phno: parseInt(phone, 10),
        item: formData.item,
        weight: weight,
        source: formData.source,
        desti: formData.desti,
        depart_by: departureDate.toISOString(),
        arrive_by: arriveDate.toISOString(),
      };

      console.log('Sending load payload:', payload);

      const response = await fetch(
        `${API_BASE_URL}/create/load`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      let result: any = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.detail || 'Unable to add the load to queue'
        );
      }

      setStatusMessage({
        type: 'success',
        text: t.successMessage,
      });

      setFormData({
        item: '',
        weight: '',
        source: '',
        desti: '',
        depart_by: '',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text:
          err.message ||
          'Network connectivity failure.',
      });
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
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .trader-field-pair {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
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

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '16px',
          }}
        >
          <button
            type="button"
            className={`lang-btn ${
              language === 'en' ? 'active' : ''
            }`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>

          <button
            type="button"
            className={`lang-btn ${
              language === 'kn' ? 'active' : ''
            }`}
            onClick={() => setLanguage('kn')}
          >
            ಕನ್ನಡ
          </button>
        </div>

        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '24px',
            color: '#111827',
          }}
        >
          {t.title}
        </h2>

        {statusMessage && (
          <div
            className={`alert-box ${
              statusMessage.type === 'success'
                ? 'alert-success'
                : 'alert-error'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >

          {/* LOAD ITEM */}

          <div>
            <label className="form-label">
              {t.load_item}
            </label>

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
            <label className="form-label">
              {t.weight}
            </label>

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-input"
              placeholder={t.weightPlaceholder}
              min="1"
            />

            <small
              style={{
                display: 'block',
                marginTop: '6px',
                color: '#64748b',
                fontSize: '12px',
              }}
            >
              {t.weightNote}
            </small>
          </div>

          {/* FROM / TO */}

          <div className="trader-field-pair">

            <div>
              <label className="form-label">
                {t.from}
              </label>

              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="form-input"
                placeholder={t.fromPlaceholder}
              />
            </div>

            <div>
              <label className="form-label">
                {t.to}
              </label>

              <input
                type="text"
                name="desti"
                value={formData.desti}
                onChange={handleInputChange}
                className="form-input"
                placeholder={t.toPlaceholder}
              />
            </div>

          </div>

          {/* DEPARTURE BY */}

          <div>
            <label className="form-label">
              {t.departureBy}
            </label>

            <input
              type="datetime-local"
              name="depart_by"
              value={formData.depart_by}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? t.submitting : t.submit}
          </button>

        </form>
      </div>
    </div>
  );
}

/* =========================================================
   CURRENT LOADS
========================================================= */

function CurrentLoads() {
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchLoads = async () => {
    setError('');
    setLoading(true);

    const phno = localStorage.getItem('user_phone');

    if (!phno) {
      setError(
        'No phone number found in storage. Please log in.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/current_load/${phno}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          setLoads([]);
          throw new Error(
            'No active matching loads found.'
          );
        }

        throw new Error(
          'Failed to communicate with data engine.'
        );
      }

      const data: LoadItem[] = await res.json();

      setLoads(data);
    } catch (err: any) {
      setError(
        err.message ||
          'Server error. Is your FastAPI engine active?'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchLoads();
  }, []);

  return (
    <div className="w-full py-4 text-left">

      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: '1rem',
        }}
      >
        <button
          onClick={handleFetchLoads}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: '#2563eb',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
        >
          <RefreshCw
            className={
              loading ? 'animate-spin' : ''
            }
            size={14}
          />

          {loading
            ? 'Updating...'
            : 'Refresh List'}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '0.5rem',
            color: '#b45309',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        loads.length === 0 &&
        !error && (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af',
              backgroundColor: '#ffffff',
              border: '1px dashed #e5e7eb',
              borderRadius: '0.75rem',
            }}
          >
            No records are currently registered
            under this account profile.
          </div>
        )}

      {/* LOAD CARDS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          width: '100%',
        }}
      >
        {loads.map((data) => (
          <div
            key={data.load_id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
            }}
          >

            {/* CARD HEADER */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom:
                  '1px solid #f3f4f6',
                paddingBottom: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#eff6ff',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    color: '#2563eb',
                  }}
                >
                  <Package size={20} />
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      textTransform: 'uppercase',
                    }}
                  >
                    Load ID #{data.load_id}
                  </span>

                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#111827',
                      margin: 0,
                    }}
                  >
                    {data.item ||
                      'Unlabeled Freight'}
                  </h3>
                </div>
              </div>

              <span
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  padding: '0.125rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  height: 'fit-content',
                }}
              >
                Active
              </span>
            </div>

            {/* ROUTE */}

            <div
              style={{
                paddingLeft: '1.5rem',
                marginLeft: '0.75rem',
                borderLeft:
                  '2px dashed #e5e7eb',
              }}
            >

              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin size={16} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    }}
                  >
                    FROM
                  </span>
                </div>

                <p
                  style={{
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {data.source}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin
                    size={16}
                    color="#2563eb"
                  />

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    }}
                  >
                    TO
                  </span>
                </div>

                <p
                  style={{
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {data.desti}
                </p>
              </div>

            </div>

            {/* WEIGHT */}

            <div
              style={{
                borderTop:
                  '1px solid #f3f4f6',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Weight
                size={18}
                color="#9ca3af"
              />

              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  Weight
                </p>

                <p
                  style={{
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {data.weight
                    ? `${data.weight.toLocaleString()} kg`
                    : 'Weight Unspecified'}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   CREATE TAB
========================================================= */

function CreateTab() {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        border: '1px solid #f3f4f6',
        borderRadius: '0.75rem',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1f2937',
        }}
      >
        📊 Add Load
      </h2>

      <CreateLoad />
    </div>
  );
}

/* =========================================================
   CURRENT TAB
========================================================= */

function CurrentTab() {
  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        border: '1px solid #f3f4f6',
        borderRadius: '0.75rem',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1f2937',
        }}
      >
        📋 Current Loads
      </h2>

      <CurrentLoads />
    </div>
  );
}

/* =========================================================
   HISTORY LOADS
========================================================= */

function HistoryLoads() {
  const [historyLoads, setHistoryLoads] =
    useState<LoadItem[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchHistory = async () => {
    setError('');
    setLoading(true);

    const phno = localStorage.getItem('user_phone');

    if (!phno) {
      setError(
        'No phone number found in storage. Please log in.'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/history_load/${phno}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          setHistoryLoads([]);

          throw new Error(
            'No past records found for this phone number.'
          );
        }

        throw new Error(
          'Failed to communicate with data engine.'
        );
      }

      const data: LoadItem[] = await res.json();

      setHistoryLoads(data);
    } catch (err: any) {
      setError(
        err.message ||
          'Server error. Is your FastAPI engine active?'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchHistory();
  }, []);

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        textAlign: 'left',
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1f2937',
            margin: 0,
          }}
        >
          ⚙️ Load History
        </h2>

        <button
          onClick={handleFetchHistory}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: '#4b5563',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
          }}
        >
          <RotateCw
            size={14}
            className={
              loading ? 'animate-spin' : ''
            }
          />

          {loading
            ? 'Updating...'
            : 'Refresh History'}
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '0.5rem',
            color: '#b45309',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        historyLoads.length === 0 &&
        !error && (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af',
              backgroundColor: '#ffffff',
              border: '1px dashed #e5e7eb',
              borderRadius: '0.75rem',
            }}
          >
            No archived or completed
            shipments found under this profile.
          </div>
        )}

      {/* HISTORY CARDS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {historyLoads.map((data) => (
          <div
            key={data.load_id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              opacity: 0.9,
            }}
          >

            {/* HEADER */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom:
                  '1px solid #f3f4f6',
                paddingBottom: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    color: '#6b7280',
                  }}
                >
                  <Package size={20} />
                </div>

                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    Load ID #{data.load_id}
                  </span>

                  <h3
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#374151',
                      margin: 0,
                    }}
                  >
                    {data.item ||
                      'Unlabeled Freight'}
                  </h3>
                </div>
              </div>

              <span
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#1f2937',
                  padding: '0.125rem 0.625rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  height: 'fit-content',
                }}
              >
                Matched
              </span>
            </div>

            {/* ROUTE */}

            <div
              style={{
                paddingLeft: '1.5rem',
                marginLeft: '0.75rem',
                borderLeft:
                  '2px dashed #d1d5db',
              }}
            >

              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin
                    size={16}
                    color="#9ca3af"
                  />

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                    }}
                  >
                    FROM
                  </span>
                </div>

                <p
                  style={{
                    fontWeight: 600,
                    color: '#4b5563',
                    margin: 0,
                  }}
                >
                  {data.source}
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin
                    size={16}
                    color="#9ca3af"
                  />

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                    }}
                  >
                    TO
                  </span>
                </div>

                <p
                  style={{
                    fontWeight: 600,
                    color: '#4b5563',
                    margin: 0,
                  }}
                >
                  {data.desti}
                </p>
              </div>

            </div>

            {/* FOOTER */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop:
                  '1px solid #f3f4f6',
                paddingTop: '1rem',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}
              >
                <Weight
                  size={18}
                  color="#9ca3af"
                />

                <div>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      margin: 0,
                    }}
                  >
                    Weight
                  </p>

                  <p
                    style={{
                      fontWeight: 500,
                      color: '#4b5563',
                      margin: 0,
                    }}
                  >
                    {data.weight
                      ? `${data.weight.toLocaleString()} kg`
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: '#15803d',
                  fontWeight: 500,
                }}
              >
                <CheckCircle
                  size={14}
                  color="#16a34a"
                />

                <span>
                  ID: {data.match_id || 'Archived'}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   HISTORY TAB
========================================================= */

function HistoryTab() {
  return <HistoryLoads />;
}

/* =========================================================
   MAIN LOAD PAGE
========================================================= */

export default function LoadPage() {
  const [activeTab, setActiveTab] =
    useState<TabType>('Current');

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
    <div
      style={{
        maxWidth: '64rem',
        margin: '0 auto',
        padding: '1.5rem',
      }}
    >

      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: '#111827',
        }}
      >
        ----------------------------------------------------------------
      </h1>

      {/* TABS */}

      <div
        style={{
          display: 'flex',
          borderBottom:
            '1px solid #e5e7eb',
          marginBottom: '1.5rem',
        }}
        role="tablist"
      >
        {(
          ['Create', 'Current', 'History'] as TabType[]
        ).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={
              activeTab === tab
            }
            onClick={() =>
              setActiveTab(tab)
            }
            style={{
              padding:
                '0.5rem 1rem',
              fontWeight:
                activeTab === tab
                  ? 600
                  : 500,
              color:
                activeTab === tab
                  ? '#2563eb'
                  : '#6b7280',
              background: 'transparent',
              border: 'none',
              borderBottom:
                activeTab === tab
                  ? '2px solid #2563eb'
                  : '2px solid transparent',
              cursor: 'pointer',
              marginBottom: '-2px',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}

      {renderTabContent()}
    </div>
  );
}

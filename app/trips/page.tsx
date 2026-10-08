'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  MapPin,
  Calendar,
  RefreshCw,
  RotateCw,
  Weight,
  CheckCircle,
  Truck,
  IndianRupee,
  AlertCircle,
} from 'lucide-react';

type TabType = 'Create' | 'Current' | 'History';

const API_BASE_URL =
  'https://8000-kode-ws-c69bd7bb1.hebbale.academy';

interface TripFormState {
  vehicleNumber: string;
  weight: string;
  source: string;
  desti: string;
  available_from: string;
  depart_by: string;
  price: string;
}

interface TripItem {
  trip_id: number;
  source: string;
  desti: string;
  depart_by: string | null;
  available_from: string | null;
  weight: number | null;
  driver_phno: number;
  match_id: string | null;
}

interface MatchLoad {
  load_id: number;
  load_source: string;
  load_desti: string;
  load_depart_by: string | null;
  load_weight: number | null;
  load_match_id: string | null;

  trip_id: number;
  trip_source: string;
  trip_desti: string;
  trip_depart_by: string | null;
  trip_available_from: string | null;
  trip_weight: number | null;
  driver_phno: number;
  trip_match_id: string | null;
}

interface PriceRange {
  price_from: number;
  price_to: number;
}

interface SelectedLoad {
  load_id: number;
  price: string;
}

type HistoryTrip = TripItem;

function formatDateTime(value: string | null) {
  if (!value) return 'N/A';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatWeight(value: number | null) {
  return value == null ? 'N/A' : `${value.toLocaleString()} kg`;
}

/* -------------------------------------------------------------------------- */
/* CREATE TRIP                                                                */
/* -------------------------------------------------------------------------- */

function CreateTrip() {
  const [language, setLanguage] = useState<'en' | 'kn'>('en');

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<TripFormState>({
    vehicleNumber: '',
    weight: '',
    source: '',
    desti: '',
    available_from: '',
    depart_by: '',
    price: '',
  });

  const text = {
    en: {
      title: 'Add New Trip',
      vehicleNumber: 'Vehicle Number',
      weight: 'Weight',
      weightNote: 'Enter weight in kg',
      from: 'From',
      to: 'To',
      availableFrom: 'Available From',
      departureBy: 'Departure By',
      price: 'Price',
      submit: 'Submit',
      vehicleError: 'Enter appropriate vehicle number',
      vehiclePlaceholder: 'Enter Vehicle Number',
      weightPlaceholder: 'Enter weight',
      fromPlaceholder: 'Enter starting location',
      toPlaceholder: 'Enter destination',
      pricePlaceholder: 'Enter price',
    },
    kn: {
      title: 'ಹೊಸ ಪ್ರವಾಸ',
      vehicleNumber: 'ವಾಹನ ಸಂಖ್ಯೆ',
      weight: 'ತೂಕ',
      weightNote: 'ತೂಕವನ್ನು ಕಿಲೋಗ್ರಾಂಗಳಲ್ಲಿ (ಕೆಜಿ) ನಮೂದಿಸಿ.',
      from: 'ಇಂದ',
      to: 'ಗೆ',
      availableFrom: 'ಲಭ್ಯವಿರುವ ಸಮಯ',
      departureBy: 'ನಿರ್ಗಮನದ ಸಮಯ',
      price: 'ಬೆಲೆ',
      submit: 'ಸಲ್ಲಿಸಿ',
      vehicleError: 'ದಯವಿಟ್ಟು ನಿಖರವಾಗಿ ನಮೂದಿಸಿ.',
      vehiclePlaceholder: 'ವಾಹನ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
      weightPlaceholder: 'ತೂಕವನ್ನು ನಮೂದಿಸಿ',
      fromPlaceholder: 'ಪ್ರಾರಂಭದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ',
      toPlaceholder: 'ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಮೂದಿಸಿ',
      pricePlaceholder: 'ಬೆಲೆಯನ್ನು ನಮೂದಿಸಿ',
    },
  };

  const t = text[language];

  const handleChange = (
    name: keyof TripFormState,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleChange = (value: string) => {
    handleChange('vehicleNumber', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitMessage('');
    setSubmitError('');

    const phno = localStorage.getItem('user_phone');

    if (!phno) {
      setSubmitError(
        'No phone number found. Please log in again.'
      );
      return;
    }


    if (!formData.weight || Number(formData.weight) <= 0) {
      setSubmitError('Please enter a valid weight.');
      return;
    }

    if (
      !formData.source.trim() ||
      !formData.desti.trim()
    ) {
      setSubmitError(
        'Please enter both source and destination.'
      );
      return;
    }

    if (
      !formData.available_from ||
      !formData.depart_by
    ) {
      setSubmitError(
        'Please select both date and time fields.'
      );
      return;
    }

    if (
      new Date(formData.depart_by) <
      new Date(formData.available_from)
    ) {
      setSubmitError(
        'Departure time cannot be before available-from time.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        driver_phno: Number(phno),
        vehicle_no: formData.vehicleNumber,
        weight: Number(formData.weight),
        source: formData.source.trim(),
        desti: formData.desti.trim(),

        available_from:
          formData.available_from.replace('T', ' ') + ':00',

        depart_by:
          formData.depart_by.replace('T', ' ') + ':00',
      };

      const response = await fetch(
        `${API_BASE_URL}/create/trip`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            'Unable to add the trip to queue.'
        );
      }

      setSubmitMessage(
        result?.message ||
          'Trip successfully added to the queue.'
      );

      setFormData({
        vehicleNumber: '',
        weight: '',
        source: '',
        desti: '',
        available_from: '',
        depart_by: '',
        price: '',
      });
    } catch (error: any) {
      setSubmitError(
        error.message || 'Unable to submit the trip.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <style>{`
        .driver-form-page {
          margin: 32px auto;
          padding: 32px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.1),
            0 2px 4px -1px rgba(0,0,0,0.06);
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
        }

        .form-input:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px rgba(37,99,235,0.1);
        }

        .driver-field-pair {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .driver-field-pair > div {
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
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .driver-form-page {
            margin: 16px;
            padding: 20px;
          }

          .driver-field-pair {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>

      <div className="driver-form-page">
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

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <label className="form-label">
              {t.vehicleNumber}
            </label>

            <input
              className="form-input"
              type="text"
              required
              value={formData.vehicleNumber}
              onChange={(e) =>
                handleVehicleChange(e.target.value)
              }
              placeholder={t.vehiclePlaceholder}
            />
          </div>

          <div>
            <label className="form-label">
              {t.weight}
            </label>

            <input
              className="form-input"
              type="number"
              min="1"
              value={formData.weight}
              onChange={(e) =>
                handleChange('weight', e.target.value)
              }
              placeholder={t.weightPlaceholder}
              required
            />

            <small
              style={{
                display: 'block',
                marginTop: '6px',
                color: '#64748b',
              }}
            >
              {t.weightNote}
            </small>
          </div>

          <div className="driver-field-pair">
            <div>
              <label className="form-label">
                {t.from}
              </label>

              <input
                className="form-input"
                type="text"
                value={formData.source}
                onChange={(e) =>
                  handleChange(
                    'source',
                    e.target.value
                  )
                }
                placeholder={t.fromPlaceholder}
                required
              />
            </div>

            <div>
              <label className="form-label">
                {t.to}
              </label>

              <input
                className="form-input"
                type="text"
                value={formData.desti}
                onChange={(e) =>
                  handleChange(
                    'desti',
                    e.target.value
                  )
                }
                placeholder={t.toPlaceholder}
                required
              />
            </div>
          </div>

          <div className="driver-field-pair">
            <div>
              <label className="form-label">
                {t.availableFrom}
              </label>

              <input
                className="form-input"
                type="datetime-local"
                value={formData.available_from}
                onChange={(e) =>
                  handleChange(
                    'available_from',
                    e.target.value
                  )
                }
                required
              />
            </div>

            <div>
              <label className="form-label">
                {t.departureBy}
              </label>

              <input
                className="form-input"
                type="datetime-local"
                value={formData.depart_by}
                onChange={(e) =>
                  handleChange(
                    'depart_by',
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              {t.price}
            </label>

            <input
              className="form-input"
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) =>
                handleChange(
                  'price',
                  e.target.value
                )
              }
              placeholder={t.pricePlaceholder}
            />
          </div>

          {submitError && (
            <div
              style={{
                padding: '12px 14px',
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {submitError}
            </div>
          )}

          {submitMessage && (
            <div
              style={{
                padding: '12px 14px',
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              {submitMessage}
            </div>
          )}

          <button
            className="submit-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Submitting...'
              : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TRIP SUMMARY                                                               */
/* -------------------------------------------------------------------------- */

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: 10,
        padding: 13,
        border: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          color: '#64748b',
          fontSize: 12,
          marginBottom: 5,
        }}
      >
        {icon}
        <span>{label}</span>
      </div>

      <div
        style={{
          fontWeight: 600,
          color: '#1f2937',
          fontSize: 14,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TripSummaryCard({
  trip,
}: {
  trip: TripItem;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #dbeafe',
        borderRadius: 14,
        padding: 22,
        boxShadow:
          '0 4px 12px rgba(15,23,42,0.06)',
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              background: '#eff6ff',
              color: '#2563eb',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Truck size={22} />
          </div>

          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase',
              }}
            >
              Trip #{trip.trip_id}
            </div>

            <h3
              style={{
                margin: '3px 0 0',
                fontSize: 20,
                color: '#111827',
              }}
            >
              Current Trip
            </h3>
          </div>
        </div>

        <span
          style={{
            background: '#dcfce7',
            color: '#166534',
            borderRadius: 999,
            padding: '5px 10px',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Active
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        <InfoBox
          icon={<MapPin size={17} />}
          label="From"
          value={trip.source}
        />

        <InfoBox
          icon={<MapPin size={17} />}
          label="To"
          value={trip.desti}
        />

        <InfoBox
          icon={<Weight size={17} />}
          label="Vehicle Capacity"
          value={formatWeight(trip.weight)}
        />

        <InfoBox
          icon={<Calendar size={17} />}
          label="Available From"
          value={formatDateTime(
            trip.available_from
          )}
        />

        <InfoBox
          icon={<Calendar size={17} />}
          label="Departure By"
          value={formatDateTime(
            trip.depart_by
          )}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MATCH LOAD CARD                                                            */
/* -------------------------------------------------------------------------- */

function MatchLoadCard({
  load,
  selected,
  disabled,
  priceRange,
  price,
  onToggle,
  onPriceChange,
}: {
  load: MatchLoad;
  selected: boolean;
  disabled: boolean;
  priceRange?: PriceRange;
  price: string;
  onToggle: () => void;
  onPriceChange: (value: string) => void;
}) {
  const cardBackgrounds = [
    '#eff6ff',
    '#f0fdf4',
    '#fff7ed',
    '#fdf4ff',
    '#ecfeff',
    '#fefce8',
  ];

  const colorIndex =
    load.load_id % cardBackgrounds.length;

  return (
    <div
      style={{
        background: disabled
          ? '#f3f4f6'
          : cardBackgrounds[colorIndex],
        border: selected
          ? '2px solid #2563eb'
          : '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 18,
        opacity: disabled ? 0.55 : 1,
        transition: 'all 0.2s ease',
        boxShadow: selected
          ? '0 0 0 3px rgba(37,99,235,0.10)'
          : '0 2px 8px rgba(15,23,42,0.04)',
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        style={{
          width: '100%',
          border: 0,
          background: 'transparent',
          padding: 0,
          textAlign: 'left',
          cursor: disabled
            ? 'not-allowed'
            : 'pointer',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: selected
                  ? '#2563eb'
                  : '#ffffff',
                color: selected
                  ? '#ffffff'
                  : '#2563eb',
                border: '1px solid #dbeafe',
              }}
            >
              {selected ? (
                <CheckCircle size={20} />
              ) : (
                <Package size={20} />
              )}
            </div>

            <div>
              <div
                style={{
                  color: '#2563eb',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                LOAD #{load.load_id}
              </div>

              <div
                style={{
                  color: '#111827',
                  fontSize: 16,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {load.load_weight?.toLocaleString() ??
                  'N/A'}{' '}
                kg
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: disabled
                ? '#6b7280'
                : '#166534',
              background: disabled
                ? '#e5e7eb'
                : '#dcfce7',
              borderRadius: 999,
              padding: '5px 8px',
            }}
          >
            {disabled
              ? 'Capacity Exceeded'
              : selected
                ? 'Selected'
                : 'Select'}
          </span>
        </div>

        <div
          style={{
            marginTop: 16,
            paddingLeft: 10,
            borderLeft:
              '2px dashed #cbd5e1',
          }}
        >
          <div style={{ marginBottom: 11 }}>
            <div
              style={{
                fontSize: 11,
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              From
            </div>

            <div
              style={{
                fontWeight: 600,
                color: '#1f2937',
              }}
            >
              {load.load_source}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                color: '#64748b',
                textTransform: 'uppercase',
              }}
            >
              To
            </div>

            <div
              style={{
                fontWeight: 600,
                color: '#1f2937',
              }}
            >
              {load.load_desti}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop:
              '1px solid rgba(148,163,184,0.25)',
            fontSize: 12,
            color: '#475569',
          }}
        >
          Departure:{' '}
          <strong>
            {formatDateTime(
              load.load_depart_by
            )}
          </strong>
        </div>
      </button>

      {selected && (
        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          style={{
            marginTop: 15,
            paddingTop: 14,
            borderTop:
              '1px solid rgba(37,99,235,0.18)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              gap: 10,
              marginBottom: 8,
              fontSize: 12,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: '#334155',
              }}
            >
              Acceptable Price
            </span>

            {priceRange ? (
              <span
                style={{
                  color: '#166534',
                  fontWeight: 700,
                }}
              >
                ₹{priceRange.price_from} - ₹
                {priceRange.price_to}
              </span>
            ) : (
              <span
                style={{
                  color: '#b45309',
                }}
              >
                Loading range...
              </span>
            )}
          </div>

          <div
            style={{
              position: 'relative',
            }}
          >
            <IndianRupee
              size={16}
              style={{
                position: 'absolute',
                left: 11,
                top: 12,
                color: '#64748b',
              }}
            />

            <input
              type="number"
              min={priceRange?.price_from}
              max={priceRange?.price_to}
              step="1"
              value={price}
              disabled={!priceRange}
              onChange={(e) =>
                onPriceChange(
                  e.target.value
                )
              }
              placeholder={
                priceRange
                  ? `Enter ₹${priceRange.price_from} - ₹${priceRange.price_to}`
                  : 'Loading price...'
              }
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding:
                  '10px 12px 10px 32px',
                borderRadius: 9,
                border:
                  '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: 14,
              }}
            />
          </div>

          {priceRange &&
            price !== '' &&
            (Number(price) <
              priceRange.price_from ||
              Number(price) >
                priceRange.price_to) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 7,
                  color: '#dc2626',
                  fontSize: 12,
                }}
              >
                <AlertCircle size={14} />
                Enter a price between ₹
                {priceRange.price_from} and ₹
                {priceRange.price_to}.
              </div>
            )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CURRENT TRIPS                                                              */
/* -------------------------------------------------------------------------- */

function CurrentTrips() {
  const [trip, setTrip] =
    useState<TripItem | null>(null);

  const [loads, setLoads] =
    useState<MatchLoad[]>([]);

  const [selectedLoads, setSelectedLoads] =
    useState<Record<number, SelectedLoad>>({});

  const [priceRanges, setPriceRanges] =
    useState<Record<number, PriceRange>>({});

  const [loadingTrip, setLoadingTrip] =
    useState(false);

  const [loadingLoads, setLoadingLoads] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const fetchCurrentTrip = async () => {
    setLoadingTrip(true);
    setError('');
    setSuccess('');

    const phno =
      localStorage.getItem('user_phone');

    if (!phno) {
      setError(
        'No phone number found in storage. Please log in.'
      );
      setLoadingTrip(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/current_trip/${phno}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setTrip(null);
          setLoads([]);
          throw new Error(
            'No current trip found for this phone number.'
          );
        }

        throw new Error(
          'Failed to fetch current trip.'
        );
      }

      const data =
        await response.json();

      const currentTrip: TripItem | null =
        Array.isArray(data)
          ? data[0] ?? null
          : data;

      setTrip(currentTrip);
    } catch (error: any) {
      setError(
        error.message ||
          'Unable to fetch current trip.'
      );
    } finally {
      setLoadingTrip(false);
    }
  };

  const fetchMatchableLoads = async () => {
    setLoadingLoads(true);
    setError('');

    const phno =
      localStorage.getItem('user_phone');

    if (!phno) {
      setError(
        'No phone number found in storage. Please log in.'
      );
      setLoadingLoads(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/match_load/${phno}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setLoads([]);
          throw new Error(
            'No matching loads found for the current trip.'
          );
        }

        throw new Error(
          'Failed to fetch matching loads.'
        );
      }

      const data: MatchLoad[] =
        await response.json();

      setLoads(data);
      setSelectedLoads({});
      setPriceRanges({});
    } catch (error: any) {
      setError(
        error.message ||
          'Unable to fetch matching loads.'
      );
      setLoads([]);
    } finally {
      setLoadingLoads(false);
    }
  };

  const refreshAll = async () => {
    setError('');
    setSuccess('');

    await fetchCurrentTrip();
    await fetchMatchableLoads();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const selectedWeight = useMemo(() => {
    return Object.keys(
      selectedLoads
    ).reduce((sum, id) => {
      const load = loads.find(
        (item) =>
          item.load_id === Number(id)
      );

      return (
        sum + (load?.load_weight ?? 0)
      );
    }, 0);
  }, [selectedLoads, loads]);

  const tripCapacity =
    trip?.weight ?? 0;

  const remainingCapacity = Math.max(
    tripCapacity - selectedWeight,
    0
  );

  const isPriceValid = (
    loadId: number
  ) => {
    const selected =
      selectedLoads[loadId];

    const range =
      priceRanges[loadId];

    if (
      !selected ||
      !range ||
      selected.price === ''
    ) {
      return false;
    }

    const value =
      Number(selected.price);

    return (
      Number.isFinite(value) &&
      value >= range.price_from &&
      value <= range.price_to
    );
  };

  const allSelectedPricesValid =
    Object.keys(selectedLoads).every(
      (id) =>
        isPriceValid(Number(id))
    );

  const toggleLoad = async (
    load: MatchLoad
  ) => {
    if (
      selectedLoads[load.load_id]
    ) {
      setSelectedLoads((prev) => {
        const next = {
          ...prev,
        };

        delete next[load.load_id];

        return next;
      });

      return;
    }

    const loadWeight =
      load.load_weight ?? 0;

    if (
      selectedWeight +
        loadWeight >
      tripCapacity
    ) {
      return;
    }

    setSelectedLoads((prev) => ({
      ...prev,
      [load.load_id]: {
        load_id: load.load_id,
        price: '',
      },
    }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/prices/${loadWeight}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not get price range for load #${load.load_id}.`
        );
      }

      const range: PriceRange =
        await response.json();

      setPriceRanges((prev) => ({
        ...prev,
        [load.load_id]: range,
      }));
    } catch (error: any) {
      setError(
        error.message ||
          'Unable to fetch price range.'
      );

      setSelectedLoads((prev) => {
        const next = {
          ...prev,
        };

        delete next[load.load_id];

        return next;
      });
    }
  };

  const handlePriceChange = (
    loadId: number,
    value: string
  ) => {
    setSelectedLoads((prev) => ({
      ...prev,
      [loadId]: {
        ...prev[loadId],
        price: value,
      },
    }));
  };

  const isLoadDisabled = (
    load: MatchLoad
  ) => {
    if (
      selectedLoads[load.load_id]
    ) {
      return false;
    }

    const weight =
      load.load_weight ?? 0;

    return (
      selectedWeight + weight >
      tripCapacity
    );
  };

  const submitMatches = async () => {
    setError('');
    setSuccess('');

    if (!trip) {
      setError(
        'No current trip available.'
      );
      return;
    }

    const selected =
      Object.values(selectedLoads);

    if (selected.length === 0) {
      setError(
        'Select at least one load.'
      );
      return;
    }

    if (
      selectedWeight >
      tripCapacity
    ) {
      setError(
        'Selected load weight exceeds the vehicle capacity.'
      );
      return;
    }

    if (!allSelectedPricesValid) {
      setError(
        'Enter a valid price for every selected load before submitting.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        trip_id: trip.trip_id,
        loads: selected.map(
          (load) => ({
            load_id: load.load_id,
            price: Number(load.price),
          })
        ),
      };

      const response = await fetch(
        `${API_BASE_URL}/users/match`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            'Unable to create the trip-load match.'
        );
      }

      setSuccess(
        'Selected loads have been matched to the trip successfully.'
      );

      setSelectedLoads({});
      setPriceRanges({});

      await refreshAll();
    } catch (error: any) {
      setError(
        error.message ||
          'Unable to submit selected loads.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading =
    loadingTrip || loadingLoads;

  return (
    <div
      style={{
        width: '100%',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#1f2937',
              margin: 0,
            }}
          >
            📋 Current Trip
          </h2>

          {trip && (
            <p
              style={{
                margin:
                  '4px 0 0',
                color: '#64748b',
                fontSize: 13,
              }}
            >
              Select one or more loads
              to fill this vehicle.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={
            isLoading || submitting
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            border: 0,
            background:
              'transparent',
            color: '#2563eb',
            fontSize: 12,
            fontWeight: 600,
            cursor:
              isLoading
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          <RefreshCw
            size={14}
            className={
              isLoading
                ? 'animate-spin'
                : ''
            }
          />

          {isLoading
            ? 'Updating...'
            : 'Refresh'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 15px',
            marginBottom: 16,
            background: '#fef2f2',
            color: '#991b1b',
            border:
              '1px solid #fecaca',
            borderRadius: 9,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '12px 15px',
            marginBottom: 16,
            background: '#f0fdf4',
            color: '#166534',
            border:
              '1px solid #bbf7d0',
            borderRadius: 9,
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      {loadingTrip && !trip ? (
        <div
          style={{
            padding: 35,
            textAlign: 'center',
            color: '#64748b',
            background: '#ffffff',
            border:
              '1px dashed #cbd5e1',
            borderRadius: 12,
          }}
        >
          Loading current trip...
        </div>
      ) : trip ? (
        <>
          <TripSummaryCard
            trip={trip}
          />

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 14,
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#1f2937',
                }}
              >
                Matchable Loads
              </h3>

              <p
                style={{
                  margin:
                    '4px 0 0',
                  fontSize: 12,
                  color: '#64748b',
                }}
              >
                Loads matching this
                trip's route and timing.
              </p>
            </div>

            <div
              style={{
                background:
                  remainingCapacity === 0
                    ? '#dcfce7'
                    : '#eff6ff',
                color:
                  remainingCapacity === 0
                    ? '#166534'
                    : '#1d4ed8',
                padding:
                  '8px 12px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {selectedWeight.toLocaleString()} /{' '}
              {tripCapacity.toLocaleString()} kg used
              {' · '}
              {remainingCapacity.toLocaleString()} kg remaining
            </div>
          </div>

          {loadingLoads ? (
            <div
              style={{
                padding: 30,
                textAlign: 'center',
                color: '#64748b',
                background: '#ffffff',
                border:
                  '1px dashed #cbd5e1',
                borderRadius: 12,
              }}
            >
              Loading matchable loads...
            </div>
          ) : loads.length === 0 ? (
            <div
              style={{
                padding: 30,
                textAlign: 'center',
                color: '#94a3b8',
                background: '#ffffff',
                border:
                  '1px dashed #cbd5e1',
                borderRadius: 12,
              }}
            >
              No matchable loads are
              currently available.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: 16,
                }}
              >
                {loads.map((load) => (
                  <MatchLoadCard
                    key={
                      load.load_id
                    }
                    load={load}
                    selected={Boolean(
                      selectedLoads[
                        load.load_id
                      ]
                    )}
                    disabled={isLoadDisabled(
                      load
                    )}
                    priceRange={
                      priceRanges[
                        load.load_id
                      ]
                    }
                    price={
                      selectedLoads[
                        load.load_id
                      ]?.price ?? ''
                    }
                    onToggle={() =>
                      toggleLoad(
                        load
                      )
                    }
                    onPriceChange={(
                      value
                    ) =>
                      handlePriceChange(
                        load.load_id,
                        value
                      )
                    }
                  />
                ))}
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  background: '#ffffff',
                  border:
                    '1px solid #e5e7eb',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: 15,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      marginBottom: 3,
                    }}
                  >
                    Selected loads
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#1f2937',
                    }}
                  >
                    {
                      Object.keys(
                        selectedLoads
                      ).length
                    }{' '}
                    load(s) ·{' '}
                    {selectedWeight.toLocaleString()}{' '}
                    kg
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    submitMatches
                  }
                  disabled={
                    submitting ||
                    Object.keys(
                      selectedLoads
                    ).length === 0 ||
                    !allSelectedPricesValid ||
                    selectedWeight >
                      tripCapacity
                  }
                  style={{
                    border: 0,
                    borderRadius: 9,
                    padding:
                      '11px 20px',
                    background:
                      submitting ||
                      Object.keys(
                        selectedLoads
                      ).length === 0 ||
                      !allSelectedPricesValid ||
                      selectedWeight >
                        tripCapacity
                        ? '#94a3b8'
                        : '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor:
                      submitting ||
                      Object.keys(
                        selectedLoads
                      ).length === 0 ||
                      !allSelectedPricesValid ||
                      selectedWeight >
                        tripCapacity
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  {submitting
                    ? 'Matching...'
                    : 'Confirm Selected Loads'}
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <div
          style={{
            padding: 35,
            textAlign: 'center',
            color: '#94a3b8',
            background: '#ffffff',
            border:
              '1px dashed #cbd5e1',
            borderRadius: 12,
          }}
        >
          No current trip found.
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HISTORY                                                                    */
/* -------------------------------------------------------------------------- */

function HistoryTripCard({
  trip,
}: {
  trip: HistoryTrip;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border:
          '1px solid #e5e7eb',
        borderRadius: 14,
        padding: 20,
        boxShadow:
          '0 3px 10px rgba(15,23,42,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent:
            'space-between',
          gap: 10,
          paddingBottom: 13,
          marginBottom: 14,
          borderBottom:
            '1px solid #f1f5f9',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              padding: 9,
              borderRadius: 9,
            }}
          >
            <Truck size={20} />
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#6b7280',
                textTransform:
                  'uppercase',
              }}
            >
              Trip #{trip.trip_id}
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#374151',
              }}
            >
              {trip.source} →{' '}
              {trip.desti}
            </div>
          </div>
        </div>

        <span
          style={{
            background: '#f3f4f6',
            color: '#374151',
            padding: '5px 9px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Matched
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 10,
        }}
      >
        <InfoBox
          icon={<MapPin size={15} />}
          label="From"
          value={trip.source}
        />

        <InfoBox
          icon={<MapPin size={15} />}
          label="To"
          value={trip.desti}
        />

        <InfoBox
          icon={<Weight size={15} />}
          label="Capacity"
          value={formatWeight(
            trip.weight
          )}
        />

        <InfoBox
          icon={<Calendar size={15} />}
          label="Departure"
          value={formatDateTime(
            trip.depart_by
          )}
        />

        <InfoBox
          icon={<Calendar size={15} />}
          label="Available From"
          value={formatDateTime(
            trip.available_from
          )}
        />
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop:
            '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#15803d',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <CheckCircle size={14} />
        Match ID:{' '}
        {trip.match_id || 'Matched'}
      </div>
    </div>
  );
}

function HistoryTabContent() {
  const [historyTrips, setHistoryTrips] =
    useState<HistoryTrip[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');

    const phno =
      localStorage.getItem('user_phone');

    if (!phno) {
      setError(
        'No phone number found in storage. Please log in.'
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/history_trip/${phno}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setHistoryTrips([]);

          throw new Error(
            'No past trip records found for this phone number.'
          );
        }

        throw new Error(
          'Failed to fetch trip history.'
        );
      }

      const data: HistoryTrip[] =
        await response.json();

      setHistoryTrips(data);
    } catch (error: any) {
      setError(
        error.message ||
          'Unable to fetch trip history.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ textAlign: 'left' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
          }}
        >
          ⚙️ Trip History
        </h2>

        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            color: '#4b5563',
            background:
              'transparent',
            border: 0,
            cursor: loading
              ? 'not-allowed'
              : 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <RotateCw
            size={14}
            className={
              loading
                ? 'animate-spin'
                : ''
            }
          />

          {loading
            ? 'Updating...'
            : 'Refresh History'}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 14,
            marginBottom: 16,
            background: '#fffbeb',
            border:
              '1px solid #fde68a',
            borderRadius: 9,
            color: '#b45309',
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {!loading &&
        historyTrips.length === 0 &&
        !error && (
          <div
            style={{
              padding: 35,
              textAlign: 'center',
              color: '#9ca3af',
              background: '#ffffff',
              border:
                '1px dashed #e5e7eb',
              borderRadius: 12,
            }}
          >
            No past trip records
            found.
          </div>
        )}

      {loading &&
      historyTrips.length === 0 ? (
        <div
          style={{
            padding: 35,
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          Loading trip history...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 18,
          }}
        >
          {historyTrips.map(
            (trip) => (
              <HistoryTripCard
                key={trip.trip_id}
                trip={trip}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TABS                                                                       */
/* -------------------------------------------------------------------------- */

function CreateTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <CreateTrip />
    </div>
  );
}

function CurrentTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <CurrentTrips />
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <HistoryTabContent />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function TripPage() {
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        -----------------------------------------------------------------------------------------------------------------------------------
      </h1>

      <div
        className="flex border-b border-gray-200 mb-6"
        role="tablist"
      >
        {(
          [
            'Create',
            'Current',
            'History',
          ] as TabType[]
        ).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={
              activeTab === tab
            }
            className={`py-2 px-4 font-medium capitalize border-b-2 transition-all -mb-[2px] ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() =>
              setActiveTab(tab)
            }
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
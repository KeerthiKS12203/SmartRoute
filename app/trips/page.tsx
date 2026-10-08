'use client';

import { useState, type ChangeEvent } from 'react';

type TabType = 'Create' | 'Current' | 'History';

function CreateTrip(){
    const [language, setLanguage] = useState<"en"| "kn">("en");
    const [vehicleNumber, setVehicleNumber]= useState<string>("");
    const text={
        en:{
            title:"Driver FORM",
            vehicleNumber: "Vehicle Number",
            weight: "Weight",
            weightNote: "Enter weight in kg",
            from:"From",
            to:"To",
            availableFrom: "Avilable From",
            departureBy: "Departure By",
            price: "price",
            submit:"Submit",
            vehicleError:"Enter exactly 10 digits",
            vehiclePlaceholder:"Enter Vehicle Number",
            weightPlaceholder:"Enter weight",
            fromPlaceholder:"Enter starting location",
            toPlaceholder:"Enter destination",
            pricePlaceholder: "Enter price"
        },
        kn:{
            title: "ಚಾಲಕರ ಫಾರ್ಮ್",
            vehicleNumber: "ವಾಹನ ಸಂಖ್ಯೆ",
            weight: "ತೂಕ",
            weightNote: "ತೂಕವನ್ನು ಕಿಲೋಗ್ರಾಂಗಳಲ್ಲಿ (ಕೆಜಿ) ನಮೂದಿಸಿ.",
            from: "ಇಂದ",
            to: "ಗೆ",
            availableFrom: "ಲಭ್ಯವಿರುವ ಸಮಯ",
            departureBy: "ನಿರ್ಗಮನದ ಸಮಯ",
            price: "ಬೆಲೆ",
            submit: "ಸಲ್ಲಿಸಿ",
            vehicleError: "ದಯವಿಟ್ಟು ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ.",
            vehiclePlaceholder: "ವಾಹನ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
            weightPlaceholder: "ತೂಕವನ್ನು ನಮೂದಿಸಿ",
            fromPlaceholder: "ಪ್ರಾರಂಭದ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ",
            toPlaceholder: "ಗಮ್ಯಸ್ಥಾನವನ್ನು ನಮೂದಿಸಿ",
            pricePlaceholder: "ಬೆಲೆಯನ್ನು ನಮೂದಿಸಿ"
        }
    };
    const t = text[language];
    const handleVehicleNumberChange=(
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setVehicleNumber(
            event.target.value.replace(/\D/g, "").slice(0,10)
        );
    };
    return(
        <div>
            <style>{`
                .driver-form-page{
                    margin:32px auto;
                    padding:24px;
                }
                .driver-field-pair{
                    display:grid;
                    grid-template-columns: repeat(2, minmax(0,1fr));
                    gap:16px;

                }
                .driver-field-pair>div{
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .driver-field-pair input{
                    width: 100%;
                    box-sizing: border-box;
                }
                @media (max-width:640 px){
                    .driver-form-page{
                        margin: 16px;
                        padding: 16px;
                    }
                    .driver-field-pair{
                    grid-template-columns: 1fr;

                    }
                }
            `}</style>

            <div className="driver-form-page" >
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
            {/* VEHICLE NUMBER */}
            <label>{t.vehicleNumber}</label>
            <br />
            <input
             type="text"
             inputMode="numeric"
             maxLength={10}
             pattern="[0-9]{10}"
             required
             value={vehicleNumber}
             onChange={handleVehicleNumberChange}
             placeholder={t.vehiclePlaceholder}
            />
            {vehicleNumber.length>0 && vehicleNumber.length <10 && (
                    <small style={{ display:"block", color:"#dc2626"}}>
                        {t.vehicleError}

                    </small>
            )}
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
            <div className="driver-field-pair">
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
      <div className="driver-field-pair">
        <div>
          <label>{t.availableFrom}</label>
          <input type="datetime-local" />
        </div>

        <div>
          <label>{t.departureBy}</label>
          <input type="datetime-local" />
        </div>
      </div>

      <br />
      <br />

      {/* PRICE */}
      <label>{t.price}</label>
      <br />

      <input
        type="text"
        placeholder={t.pricePlaceholder}
      />

      <br />
      <br />

      <button>{t.submit}</button>
      </div>
      </div>
    );
}

function CreateTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">Add Transport Trip</h2>
      <CreateTrip/>
    </div>
  );
}

function CurrentTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">Technical Current</h2>
      <p className="text-gray-600">This section handles data tables, specifications, or granular logs.</p>
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
      <h2 className="text-xl font-semibold text-gray-800">⚙️ Trips History</h2>
      <p className="text-gray-600">Manage your preferences, configure layout thresholds, or toggle options here.</p>
    </div>
  );
}

export default function age() {
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

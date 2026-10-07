"use client"
//import {useEffect} from "react";
//import { useRouter } from "next/navigation";

//export default function PhoneRegister() {
    //return (
        //<div>Load: new, current, history</div>
    //);
//}
import { useState, type ChangeEvent } from "react";
function App(){
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
            <style>{
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
            }</style>

            <div className="driver-form-page">
                {/*LANGUAGE TOGGLE*/}
            <div>
                <button on click={() =>setLanguage("en")}>
                    English
                </button>
                <button on click = {() => setLanguage("kn")}>
                    ಕನ್ನಡ
                </button>
            </div>
            <br />
            <h2>{t.title}</h2>
            {/* VEHICLE NUMBER */}
            <LABEL>{t.vehicleNumber}</LABEL>
            <br />
            <input
             type="text"
             inputMode="numeric"
             maxLength={10}
             patter="[0-9]{10}"
             required
             value={vehicleNumber}
             onChange={handleVehicleNumberChang}
             placeholder={t.vehiclePlaceholer}
            />
            {vehicleNumber.length.length>0 && vehicleNumber.length <10 && (
                    <small style={{ display:"block", color:"#dc2626"}}>
                        {t.vehicleError}

                    </small>
            )}
            <br />
            <br />
            {/* WEIGHT */}
            <label>{t.weight}</label>
            </br>
            <input
             type="text"
             placeholder={t.weightPlaceholde}
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

export default App;
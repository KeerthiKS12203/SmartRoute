"use client"
//import {useEffect} from "react";
//import { useRouter } from "next/navigation";

//export default function PhoneRegister() {
    //return (
        //<div>Load: new, current, history</div>
    //);
//}
import { useState, type ChangeEvent } from 'react';
export default function Load(){
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
            vehicleError:"Enter Appropriate Vehicle Number",
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

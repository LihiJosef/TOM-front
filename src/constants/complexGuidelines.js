// Constants
import { serviceTypes } from "./serviceTypes";

export const complexGuidelines = () => {
  return (
    <>
      <u>Rules:</u>
      <ol>
        <li>If you cannot come, please cancel the appointment.</li>
        <li>Please maintain order and cleanliness.</li>
      </ol>
    </>
  );
};

export const entryPermitsGuidelines = serviceType => {
  let textWalk = "";
  let textVehicle = "";

  if (serviceTypes.HOVA.includes(serviceType) || serviceTypes.KEVA.includes(serviceType)) {
    textWalk = "בהצגת תעודת חוגר/קצין.";
    textVehicle = "באישור מפקדת מחנה תל השומר.";
  } else if (serviceTypes.MILOEEM.includes(serviceType)) {
    textWalk = 'עד דרגת סא"ל כולל – בהצגת תעודת מילואים וצו מילואים פעיל.';
    textVehicle =
      'בהצגת תעודת מילואים וצו מילואים פעיל, באישור מפקדת מחנה תל השומר, מדרגת תא"ל – בהצגת תעודת מילואים.';
  } else {
    textWalk = 'בהצגת תעודת עובד צה"ל.';
  }

  return (
    <>
      <u>אישור כניסה למחנה תל השומר:</u>
      <ol>
        <li>המתחם נמצא מול הכוורת בבסיס.</li>
        {textWalk !== "" && <li>אישור כניסה רגלי - {textWalk}</li>}
        {textVehicle !== "" && <li>אישור כניסה רכוב - {textVehicle}</li>}
      </ol>
    </>
  );
};

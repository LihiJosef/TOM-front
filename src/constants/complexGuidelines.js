
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

export const entryPermitsGuidelines = () => {
  let textWalk = "";
  let textVehicle = "";

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

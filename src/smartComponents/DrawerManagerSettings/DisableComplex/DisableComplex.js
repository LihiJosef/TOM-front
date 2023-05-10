import { Typography, TextField, Button } from "@material-ui/core";
import { useState } from "react";
import moment from "moment";
import { Close } from "@material-ui/icons";
import style from "./DisableComplex.module.scss";

export const DisableComplex = ({ complexData, setComplexData, setComplexDataAfterUpdate }) => {
  const [disableStartDate, setDisableStartDate] = useState(null);
  const [disableEndDate, setDisableEndDate] = useState(null);
  const [disableReason, setDisableReason] = useState(null);
  const [complexDisable, setComplexDisable] = useState(complexData.complexDisable);

  const addDisableTime = () => {
    const newDisable = {
      start_date: disableStartDate,
      end_date: disableEndDate,
      title: disableReason
    };
    setComplexDataAfterUpdate({ ...complexData, complexDisable: [...complexDisable, newDisable] });
    setComplexDisable([...complexDisable, newDisable]);
  };

  const removeDisableTime = itemId => {
    const newArray = complexDisable.filter((item, key) => item.id !== itemId);
    setComplexDataAfterUpdate({ ...complexData, complexDisable: newArray });
    setComplexDisable(newArray);
  };
  const complexDisabledDates = complexDisable.map((item, key) => {
    return (
      <Typography key={"complexDisable" + key} className={style["disable-future-row"]}>
        <span className={style["disable-future-name"]}>{item.title}</span>
        <span className={style["disable-future-value"]}>
          {` ${moment(item.start_date).format("DD/MM/YYYY HH:mm")}  -  
        ${moment(item.end_date).format("DD/MM/YYYY HH:mm")}`}

          <Close
            className={style["delete-disable-btn"]}
            key={"complexDisableCloseBtn" + key}
            onClick={() => removeDisableTime(item.id)}
          />
        </span>
      </Typography>
    );
  });

  return (
    <>
      <Typography className={style["disable-title"]}>
        <u> Disabling Complex </u>{" "}
      </Typography>
      <Typography className={style["disable-second-title"]}>
        <u>Disable for certain dates</u>
      </Typography>
      <div className={style["disable-date-container"]}>
        <TextField
          className={style["disable-start-date"]}
          id="datetime-local"
          label="Start Date"
          type="datetime-local"
          value={disableStartDate}
          defaultValue={new Date()}
          onChange={({ target }) => setDisableStartDate(target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="datetime-local"
          label="End Date"
          type="datetime-local"
          value={disableEndDate}
          defaultValue={new Date()}
          onChange={({ target }) => setDisableEndDate(target.value)}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
      <div className={style["disable-reason-btn-container"]}>
        <TextField
          id="standard-basic"
          onChange={({ target }) => setDisableReason(target.value)}
          label="Disable Reason"
          value={disableReason}
          variant="standard"
        />
        <Button
          className={style["add-disable-button"]}
          disabled={!disableEndDate || !disableStartDate || !disableReason}
          variant="contained"
          onClick={addDisableTime}
        >
          Add Disabling
        </Button>
      </div>
      <br />
      <br />
      <Typography>
        <u className={style["disable-future"]}>Future Disabling</u>
      </Typography>
      {complexDisabledDates}
    </>
  );
};

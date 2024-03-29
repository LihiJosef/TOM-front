import classNames from "clsx";
import { useState, useEffect } from "react";
import { Card } from "../../stories/Card/Card";
import styles from "./appointments.module.scss";
import { useAuth } from "../../context/authContext";
import { Dialog } from "../../stories/Dialog/Dialog";
import { Button } from "../../stories/Button/Button";
import { backgroundColor } from "../../styles/colors";
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignDialog } from "../../constants/appointments";
import { dateFormat, weekdays } from "../../constants/date";
import { useAsyncThrowError } from "../../hooks/useAsyncThrowError";
import { getDateWithFormat, getHourSpan } from "../../utilities/date";
import { cancelAppointmentUser, updateRating } from "../../services/appointmentService";
import Rating from "@material-ui/lab/Rating";

export const Appointments = ({ loading, appointments, setAppointments, canBeCanceled }) => {
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { user } = useAuth();
  const { throwError } = useAsyncThrowError("dialog");

  const handleCancelClick = appointment => {
    setOpen(true);
    setSelectedAppointment(appointment);
  };

  const handleChangeRatingClick = async (appointment, newRating) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointment.id) {
          apt.rating = newRating;
        }

        return apt;
      })
    );
    await updateRatingInDb(appointment.id, appointment.station_id, newRating);
  };

  const updateRatingInDb = async (appointmentId, stationId, newRating) => {
    try {
      await updateRating(appointmentId, stationId, newRating);
    } catch (error) {
      throwError(error);
    }
  };

  const handleCancelAppointment = async () => {
    handleCancelDialog();
    try {
      const { data } = await cancelAppointmentUser(selectedAppointment.id, user.id);
      data &&
        setTimeout(() => {
          setAppointments(prev => prev.filter(item => item.id !== selectedAppointment.id));
        }, 200);
    } catch (err) {
      throwError(err);
    }
  };

  const handleCancelDialog = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const getDate = appointment => {
    return getDateWithFormat(appointment.start_datetime, dateFormat.DATE_DOTS);
  };

  const getCardTitle = appointment => {
    if (appointment["Station.name"]) {
      return ` - ${appointment["Station.name"]}`;
    } else {
      return `#${appointment?.station_id}`;
    }
  };

  const card = appointment => {
    if (canBeCanceled) {
      return (
        <div className={styles["grid-container"]}>
          <div className={styles["grid-item"]}>{cardContent(appointment)}</div>
          <div className={classNames(styles["grid-item"], styles["vl"], styles["centered"])} />
          <div className={classNames(styles["grid-item"], styles["centered"])}>
            Can't attend?
            <br />
            <Button
              id={COMPONENT_IDS.CUSTOMER.BUTTONS.CANCEL_ORDER}
              onClick={() => {
                handleCancelClick(appointment);
              }}
              outline={false}
              color={backgroundColor.darkGreen}
            >
              Cancel appointment
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles["grid-container"]}>
          <div className={styles["grid-item"]}>{cardContent(appointment)}</div>
          <div className={classNames(styles["grid-item"], styles["vl"], styles["centered"])} />
          {appointment.user_info.id == user.id ? (
            appointment["Station.StationType.name"] == "Personal workstation" ? (
              <div className={classNames(styles["grid-item"], styles["centered"])}>
                How was the station?
                <br />
                <Rating
                  value={appointment.rating ? appointment.rating : 0}
                  onChange={(event, newValue) => {
                    handleChangeRatingClick(appointment, newValue);
                  }}
                  disabled={appointment.rating != null}
                />
              </div>
            ) : (
              <div className={classNames(styles["grid-item"], styles["centered"])}>
                {`You can only rate personal workstation`}
              </div>
            )
          ) : (
            <div className={classNames(styles["grid-item"], styles["centered"])}>
              {`Only ${appointment.user_info.fullName} can rate it`}
            </div>
          )}
        </div>
      );
    }
  };

  const cardContent = appointment => {
    return (
      <>
        <div className={styles["card-title"]}>
          {appointment["Station.StationType.name"]} {getCardTitle(appointment)}
        </div>
        <div>
          Complex {appointment["Station.Complex.name"]} <br />
        </div>
        {user.id !== appointment["user_info"].id && (
          <div>
            For {appointment["user_info"].fullName} <br />
          </div>
        )}
        {weekdays[new Date(appointment["start_datetime"]).getDay()]}, {getDate(appointment)}
        <br />
        {getHourSpan(appointment)}
      </>
    );
  };

  return (
    <>
      <div className={styles["appointments-container"]}>
        {loading
          ? [...Array(8).keys()].map(i => (
              <Card key={i} outline={true} margin={"15px 0px"} padding={"10px 15px"} minHeight={77}>
                <div className={styles["grid-container"]}>
                  <div className={styles["grid-item"]}>
                    <div className={styles["card-skeleton"]} style={{ width: "125px" }} />
                    <div className={styles["card-skeleton"]} style={{ width: "120px" }} />
                    <div className={styles["card-skeleton"]} style={{ width: "90px" }} />
                  </div>
                </div>
              </Card>
            ))
          : appointments.map(appointment => (
              <Card key={appointment.id} outline={true} margin={"15px 0px"} padding={"10px 15px"}>
                {card(appointment)}
              </Card>
            ))}
      </div>
      {selectedAppointment && (
        <Dialog
          open={open}
          onOk={handleCancelAppointment}
          onCancel={handleCancelDialog}
          title={"Cancel appointment?"}
          {...propsDesignDialog}
        >
          Canceling appointment on {getDate(selectedAppointment)} at {getHourSpan(selectedAppointment)} will
          allow others to scheadule this appointment instead
        </Dialog>
      )}
    </>
  );
};

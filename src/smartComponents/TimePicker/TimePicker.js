// Style
import styles from "./timePicker.module.scss";

// Constants
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignButton } from "../../constants/newAppointment";

// Design component
import { GridButtons } from "../../stories/GridButtons/GridButtons";

// Img SVG
import { PositionsAreOccupiedImg } from "../../imgSvg/PositionsAreOccupiedImg/PositionsAreOccupiedImg";

// Utils
import { isTimeComparedSmallCurrentTime, getLastAppointmentTime } from "../../utilities/date";

const getUserMsg = ({ isMaxExceeded, maxNum, endHour }) => {
  if (isMaxExceeded) {
    return {
      title: (
        <span className={styles["time-messages"]}>
          You can not order more than {maxNum} orders in the same day. You can order for other day or cancel
          other order from this day
        </span>
      )
    };
  } else if (isTimeComparedSmallCurrentTime(endHour)) {
    return {
      title: <span className={styles["time-messages"]}>Time Passed</span>,
      img: <PositionsAreOccupiedImg />
    };
  } else {
    return {
      title: (
        <span className={styles["time-messages"]}>
          No available time was found to make an order on this date
        </span>
      ),
      img: <PositionsAreOccupiedImg />
    };
  }
};

const isAllTimesAreBusy = (busyTimes, potentialTimes) => {
  if (!busyTimes) return false;
  if (!potentialTimes) return true;

  const busyArray = Array.from(busyTimes);
  const potentialArray = Array.from(potentialTimes.keys());

  return potentialArray.every(potentialTime => busyArray.includes(potentialTime));
};

export const TimePicker = ({
  endHour,
  onClick,
  timeSelectionMap,
  loadingTime,
  intervalTime,
  maxExceeded: { isMaxExceeded, maxNum },
  arrayBusyHoursState
}) => {
  const userMsg = getUserMsg({
    isMaxExceeded,
    maxNum,
    endHour: getLastAppointmentTime(endHour, intervalTime)
  });
  return (
    <div className={styles["time-picker"]} id={COMPONENT_IDS.CUSTOMER.INPUTS.ORDER_TIME}>
      {(!isMaxExceeded && !isAllTimesAreBusy(arrayBusyHoursState, timeSelectionMap)) || loadingTime ? (
        <div>
          <div className={styles["empty-positions-query"]}>
            <p>
              <span>What Time?</span>
            </p>
          </div>
          <GridButtons
            onClick={onClick}
            {...propsDesignButton}
            lengthLabelSkeleton={4}
            isDisplaySkeleton={loadingTime}
            arrayDisabledItems={arrayBusyHoursState}
            itemSelectionMap={timeSelectionMap}
          />
          {!loadingTime && (
            <div className={styles["time-messages"]}>
              <p>
                <span>{`The duration for each appointment is for ${intervalTime} minutes. If necessary, you can schedule another appointment.`}</span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles["occupied-positions"]}>
          <div className={styles["occupied-positions-query"]}>
            <p>{userMsg.title}</p>
          </div>
          {userMsg.img}
        </div>
      )}
    </div>
  );
};

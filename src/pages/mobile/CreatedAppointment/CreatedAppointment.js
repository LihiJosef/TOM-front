// Constants
import { dateFormat } from "../../../constants/date";

// Style
import styles from "./createdAppointment.module.scss";
import { backgroundColor } from "../../../styles/colors";

// Design component
import { Button } from "../../../stories/Button/Button";

// Hooks
import { useMediaQuery } from "../../../hooks/useMediaQuery";

// Utilities
import { getDateWithFormat, getHourSpan } from "../../../utilities/date";

// Img SVG
import { CreatedAppointmentImg } from "../../../imgSvg/CreatedAppointment/CreatedAppointment";

export default function CreatedAppointment({ infoList, goBack, goNext }) {
  const { width, height } = useMediaQuery();

  const getStationInfo = () => {
    if (infoList[0]?.station_name) {
      return ` - ${infoList[0]?.station_name}`;
    } else {
      return infoList[0].station_id;
    }
  };

  return (
    <div
      className={styles["created-appointment-container"]}
      style={{ height: width < 768 ? height - 115 : `calc(${height - 115}px - 5vh)` }}
    >
      <div>
        <h2>Your Appointment Created!</h2>
        {infoList?.length && (
          <p className={styles["info"]}>
            <span>
              {`We Saved You Station ${getStationInfo()}`} <br />
              {`In Date ${getDateWithFormat(infoList[0].start_datetime, dateFormat.DATE_DOTS_NO_YEAR)}`}
              <br />
              At{" "}
              {infoList.map(info => (
                <>
                  {getHourSpan(info)}
                  <br />
                </>
              ))}
            </span>
          </p>
        )}
        <CreatedAppointmentImg />
        <div className={styles["buttons"]}>
          <div className={styles["button"]}>
            <Button
              outline={true}
              onClick={goBack}
              color={backgroundColor.darkGreen}
              colorOutline={backgroundColor.darkGreen}
              size={width > 340 ? "large" : width > 300 ? "medium" : "small"}
            >
              New Order
            </Button>
          </div>
          <div className={styles["button"]}>
            <Button
              outline={true}
              onClick={goNext}
              colorOutline={backgroundColor.darkGreen}
              backgroundColor={backgroundColor.darkGreen}
              size={width > 340 ? "large" : width > 300 ? "medium" : "small"}
            >
              View My Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

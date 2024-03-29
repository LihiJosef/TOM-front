import history from "../../../router/history";
import useStyles from "./MyAppointments.style";
import { Typography } from "@material-ui/core";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/authContext";
import { isFutureDate } from "../../../utilities/date";
import { Button } from "../../../stories/Button/Button";
import { backgroundColor } from "../../../styles/colors";
import { COMPONENT_IDS } from "../../../constants/componentIds";
import { UserMenu } from "../../../smartComponents/UserMenu/UserMenu";
import { useAsyncThrowError } from "../../../hooks/useAsyncThrowError";
import { getUserAppointments } from "../../../services/appointmentService";
import { Appointments } from "../../../smartComponents/Appointments/Appointments";
import { NoAppointmentsImg } from "../../../imgSvg/NoAppointmentsImg/NoAppointmentsImg";
import { FixedBottomButton } from "../../../smartComponents/FixedBottomButton/FixedBottomButton";

const filterAppointments = (appointments, showAll) => {
  const pastAppointments = appointments?.filter(item => {
    return !isFutureDate(item?.start_datetime);
  });

  if (pastAppointments?.length === 0) {
    return [];
  }

  return showAll ? pastAppointments : [pastAppointments[0]];
};

export default function MyAppointments() {
  const classes = useStyles();
  const [appointments, setAppointments] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const pastAppointments = useMemo(() => filterAppointments(appointments, showAll), [appointments, showAll]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { throwError } = useAsyncThrowError("dialog");

  useEffect(() => {
    (async () => {
      if (user?.id) {
        try {
          const { data } = await getUserAppointments(user.id);
          setAppointments(data);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          throwError(err);
        }
      }
    })();
  }, [user]);

  const onClick = () => {
    history.push("/new-appointment");
  };

  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };

  return (
    <div className={classes.myAppointments}>
      <div className={classes.title}>
        <Typography classes={{ root: classes.myAppointmentsTitle }}>My Appointments</Typography>
        <UserMenu />
      </div>

      {loading || appointments?.length > 0 ? (
        <div className={classes.appointmentsData}>
          {
            <Appointments
              loading={loading}
              appointments={appointments.filter(item => isFutureDate(item.start_datetime))}
              setAppointments={setAppointments}
              canBeCanceled={true}
            />
          }

          <div className={classes.title}>
            <Typography classes={{ root: classes.myAppointmentsTitle }}>Past Appointments</Typography>
            <div>
              <Typography onClick={toggleShowAll} classes={{ root: classes.showAll }}>
                Show All
              </Typography>
            </div>
          </div>
          {pastAppointments.length > 0 && (
            <Appointments
              loading={loading}
              appointments={pastAppointments}
              setAppointments={setAppointments}
              canBeCanceled={false}
            />
          )}
          <FixedBottomButton
            id={COMPONENT_IDS.CUSTOMER.BUTTONS.NEW_ORDER}
            isDisabled={loading}
            onClick={onClick}
            textLabel={"New Order"}
          />
        </div>
      ) : (
        <div className={classes.noAppointments}>
          <NoAppointmentsImg />
          <p>You have no booked appointments. Would you like to book one?</p>
          <br />
          <Button onClick={onClick} backgroundColor={backgroundColor.darkGreen} size={"large"}>
            New appointment
          </Button>
        </div>
      )}
    </div>
  );
}

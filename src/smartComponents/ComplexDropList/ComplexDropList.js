// Style
import styles from "./complexDropList.module.scss";

// Context
import { useAuth } from "@Context/authContext";
import { useCodes } from "../../context/codesContext";

// Design component
import { DropList } from "../../stories/DropList/DropList";

// Constants
import { COMPONENT_IDS } from "../../constants/componentIds";
import { propsDesignDropList } from "../../constants/newAppointment";

export const ComplexDropList = ({ complexId, onChangeComplex }) => {
  const { user } = useAuth();
  const { organization } = useCodes();

  return (
    <div>
      {user?.organizationId && (
        <>
          <div className={styles["complex-drop-list-query"]}>
            <p>
              <span>Which Complex?</span>
            </p>
          </div>
          <DropList
            id={COMPONENT_IDS.CUSTOMER.DROPDOWNS.COMPLEX_MENU}
            fullWidth={true}
            value={complexId}
            options={organization?.find(o => o.id == user.organizationId)?.Complexes || null}
            onChange={onChangeComplex}
            {...propsDesignDropList}
          />
        </>
      )}
    </div>
  );
};

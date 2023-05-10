import history from "../../router/history";
import styles from "./dialogError.module.scss";
import { Dialog } from "../../stories/Dialog/Dialog";
import { propsDesignDialogError } from "../../constants/general";
import { GeneralError } from "../../imgSvg/GeneralError/GeneralError";

export const DialogError = ({ messageDialog, fullScreen, open, onClose, onOK }) => {
  const handleClickOk = () => {
    onOK();
    history.push("/");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onOk={handleClickOk}
      fullScreen={fullScreen}
      isDisplayCloseButton={true}
      {...propsDesignDialogError}
      {...(fullScreen ? {} : { title: "Somthing went wrong..." })}
    >
      <div>
        {fullScreen && <h3 className={styles["title"]}>{"Somthing went wrong..."}</h3>}
        <p className={styles["info"]}>
          <span>{messageDialog ? messageDialog : "and recommend to try again later"}</span>
        </p>
      </div>
      <GeneralError />
    </Dialog>
  );
};

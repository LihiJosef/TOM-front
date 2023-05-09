import { COMPONENT_IDS } from "./componentIds";
import { backgroundColor, transparent } from "../styles/colors";

export const propsDesignDialog = {
  messages: { cancel: "Nevermind", ok: "Yes, cancel appointment" },
  propsButtonOk: {
    id: COMPONENT_IDS.CUSTOMER.BUTTONS.CONFIRM_CANCELATION,
    color: "#fff",
    fullWidth: true,
    fontWeight: 400,
    backgroundColor: backgroundColor.darkGreen
  },
  propsButtonCancel: {
    id: COMPONENT_IDS.CUSTOMER.BUTTONS.REGRET_CANCELATION,
    outline: true,
    fullWidth: true,
    fontWeight: 400,
    color: backgroundColor.darkGreen,
    colorOutline: backgroundColor.darkGreen,
    backgroundColor: transparent
  },
  style: {
    textAlign: "center",
    fontFamily: "'Heebo Bold', 'Heebo Regular', 'Heebo', sans-serif"
  }
};

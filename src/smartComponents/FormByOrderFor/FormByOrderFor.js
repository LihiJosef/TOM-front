import style from "./formByOrderFor.module.scss";
import { Input } from "../../stories/Input/Input";
import { useAuth } from "../../context/authContext";
import { useState, useEffect, useRef, useMemo } from "react";

import { getUserValid } from "../../services/newAppointmentService";
import { inputs, ID_MAX_LENGTH, orderFor } from "../../constants/newAppointment";

export const FormByOrderFor = ({
  shape,
  userInfo,
  fullWidth,
  setUserInfo,
  orderForIndex,
  backgroundColorObj
}) => {
  const inputsRef = useRef([]);

  const [isIdProper, setIsIdProper] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const finalUserId = useMemo(() => (userInfo?.id?.length === ID_MAX_LENGTH ? userInfo.id : ""));

  useEffect(() => {
    (async () => {
      setIsIdProper(false);
      if (finalUserId) {
        if (orderFor.someoneElse === orderForIndex) {
          setUserInfo(prev => ({ ...prev, [event.target.name]: event.target.value }));
          setLoading(true);
          const { data } = await getUserValid(finalUserId);

          setLoading(false);
          if (data?.fullName && data?.phone) {
            setUserInfo(prev => ({ ...prev, fullName: data.fullName, phone: data.phone }));
            setIsIdProper(true);
          } else {
            setUserInfo(prev => ({ ...prev, fullName: "", phone: "" }));
            setIsIdProper(false);
          }
        } else {
          setUserInfo(prev => ({ ...prev, ...({ fullName: user.name, phone: user.phone } || {}) }));
          setIsIdProper(true);
        }
        inputsRef.current[0]?.focus();
      } else {
        setUserInfo(prev => ({ ...prev, fullName: "", phone: "" }));
      }
    })();
  }, [finalUserId, orderForIndex]);

  const handleInputChange = event => {
    setUserInfo(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <>
      {inputs[orderForIndex]?.map((input, i) => (
        <div className={style["input"]} key={i}>
          <Input
            id={input.id}
            key={i}
            shape={shape}
            name={input.name}
            type={input.type}
            fullWidth={fullWidth}
            onFocus={input.onFocus}
            maxLength={input.maxLength}
            onKeyDown={input.onKeyDown}
            onChange={handleInputChange}
            value={userInfo[input.name]}
            marginInput={"5px 25px"}
            inputProps={input.inputProps}
            placeholder={input.placeholder}
            autoComplete={input.autoComplete}
            ref={el => (inputsRef.current[i] = el)}
            backgroundColor={
              input.disabled({
                loading,
                isIdProper
              })
                ? backgroundColorObj.disabled
                : backgroundColorObj.normal
            }
            disabled={input.disabled({
              loading,
              isIdProper
            })}
            error={!input.validation?.(userInfo[input.name])}
            endAdornment={input.endAdornment?.({
              loading,
              isIdProper,
              value: userInfo[input.name]
            })}
          />
          {userInfo[input.name] !== "" && !input.validation?.(userInfo[input.name]) && (
            <p className={style["text-error"]}>{input.textError}</p>
          )}
        </div>
      ))}
    </>
  );
};

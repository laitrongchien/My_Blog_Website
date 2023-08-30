import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Toast = ({ title, body, bgColor }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "ALERT", payload: {} });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: "60px", right: "5px", zIndex: 50, minWidth: "200px" }}
    >
      <div className={`toast-header text-light ${bgColor}`}>
        <strong className="me-auto">{title}</strong>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleClose}
        />
      </div>

      <div className="toast-body">
        {typeof body === "string" ? (
          body
        ) : (
          <ul>
            {body.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Toast;

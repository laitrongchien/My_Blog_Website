import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { googleLogin } from "../../redux/actions/authAction";

const SocialLogin = () => {
  const dispatch = useDispatch();
  return (
    <div className="mt-2">
      <GoogleLogin
        // shape="circle"
        width="343px"
        // theme="filled_blue"
        onSuccess={(credentialResponse) => {
          const id_token = credentialResponse.credential;
          dispatch(googleLogin(id_token));
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default SocialLogin;

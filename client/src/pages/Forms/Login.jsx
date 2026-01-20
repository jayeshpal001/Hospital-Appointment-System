import { useForm } from "react-hook-form";
import { FaUser, FaLock } from "react-icons/fa";
import {
  GlassInput,
  GradientButton,
  showToast,
} from "../../components/ui/Form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { useLoginMutation } from "../../redux/api/apiSlice";

const Login = ({ onToggle }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();

  const [loginApi, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data).unwrap();

      console.log("Login Response:", res);

      if (res.user) {
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("userId", res.user.id);
        setIsAuth(true);

        showToast("success", "Welcome Back! Login Successful.");

        if (res.user.role === "patient") {
          navigate("/findDoctors");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);

      const errorMsg = error?.data?.message || "Invalid email or password.";
      showToast("error", errorMsg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-full px-10"
    >
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300 mb-2 tracking-tight drop-shadow-lg">
        Login
      </h1>

      <div className="h-1 w-16 bg-linear-to-r from-cyan-400 to-blue-600 rounded-full mb-8 shadow-[0_0_15px_rgba(0,242,254,0.6)]"></div>

      <div className="w-full space-y-2">
        <GlassInput
          placeholder="Email Address"
          icon={FaUser}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
          })}
          error={errors.email}
        />

        <GlassInput
          type="password"
          placeholder="Password"
          icon={FaLock}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 chars" },
          })}
          error={errors.password}
        />
      </div>

      <a
        href="#"
        className="text-sm text-gray-300 mt-2 mb-6 hover:text-cyan-300 transition-colors font-light self-end"
      >
        Forgot password?
      </a>

      {/* Submit Button (Cyan Variant) */}
      <div className="w-48">
        {/* Pass isLoading from RTK Query to the button */}
        <GradientButton loading={isLoading} variant="cyan">
          Sign In
        </GradientButton>
      </div>

      <p className="text-sm text-gray-400 mt-6 font-light">
        Don't have an account?{" "}
        <span
          onClick={onToggle}
          className="text-cyan-400 font-bold cursor-pointer hover:text-cyan-300 hover:underline transition-colors"
        >
          Sign Up
        </span>
      </p>
    </form>
  );
};

export default Login;

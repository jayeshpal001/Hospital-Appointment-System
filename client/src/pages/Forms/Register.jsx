import { useForm } from "react-hook-form";
import axios from "axios";
import { FaUser, FaLock, FaEnvelope, FaUserMd } from "react-icons/fa";
import {
  GlassInput,
  GlassSelect,
  GradientButton,
  showToast,
} from "../../components/ui/Form";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// import { GlassInput, GlassSelect, GradientButton, showToast } from "../../components/ui/Form/FormComponents";

const Register = ({ onToggle, onDoctorSuccess, onPatientSuccess }) => {
  const { setIsAuth } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { role: "patient" },
  });

  const roleValue = watch("role");

  // Register.jsx ka onSubmit function update karein:

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      console.log("Register Response:", res.data);

      if (res.data?.success) {
        
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", res.data.user.id);
        if (data.role === "doctor") {
          localStorage.setItem("role", data.role);
          localStorage.setItem("userId", res.data.user.id);
          showToast("success", "Account created! Setting up Doctor Profile...");
          onDoctorSuccess(data);
        } else {
          showToast(
            "success",
            "Account created! Setting up Patient Profile...",
          );
          onPatientSuccess(data);
        }
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Registration Failed.";
      showToast("error", errorMsg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-full px-10 h-full justify-center"
    >
      {/* Header */}
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300 mb-2 tracking-tight drop-shadow-lg">
        Create Account
      </h1>
      {/* Decorative Glow Line (Pink/Orange theme for Register) */}
      <div className="h-1 w-16 bg-linear-to-r from-pink-500 to-orange-500 rounded-full mb-8 shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>

      {/* Inputs Container */}
      <div className="w-full space-y-2">
        <GlassInput
          placeholder="Full Name"
          icon={FaUser}
          {...register("name", { required: "Full Name is required" })}
          error={errors.name}
        />

        <GlassInput
          placeholder="Email Address"
          icon={FaEnvelope}
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
            minLength: { value: 6, message: "Must be at least 6 chars" },
          })}
          error={errors.password}
        />

        <GlassSelect
          icon={FaUserMd}
          options={[
            { label: "Patient", value: "patient" },
            { label: "Doctor", value: "doctor" },
          ]}
          value={roleValue}
          onChange={(val) => setValue("role", val)}
          error={errors.role}
        />
      </div>

      {/* Submit Button (Pink Variant) */}
      <div className="mt-6 w-48">
        <GradientButton loading={isSubmitting} variant="pink">
          Sign Up
        </GradientButton>
      </div>

      {/* Footer Link */}
      <p className="text-sm text-gray-400 mt-6 font-light">
        Already have an account?{" "}
        <span
          onClick={onToggle}
          className="text-pink-400 font-bold cursor-pointer hover:text-pink-300 hover:underline transition-colors"
        >
          Sign In
        </span>
      </p>
    </form>
  );
};

export default Register;

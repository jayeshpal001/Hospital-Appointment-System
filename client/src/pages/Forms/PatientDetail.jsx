import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaVenusMars, FaTint, FaNotesMedical, FaAllergies 
} from "react-icons/fa";

import { GlassInput, GlassSelect, GradientButton, showToast } from "../../components/ui/Form";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PatientDetail = ({ onBack }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      age: "",
      gender: "",
      bloodGroup: "",
      phone: "",
      address: "",
      nationality: "",
      medicalHistory: "",
    }
  });

  const genderValue = watch("gender");
  const bloodValue = watch("bloodGroup");
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    console.log("Submitting Patient Data:", data);
    try {
        await new Promise(r => setTimeout(r, 1000)); // Smooth Fake Delay

        // ACTUAL API CALL
        const res = await api.post(
            "/user/patientData", 
            {
                ...data,
                age: Number(data.age),
            }
        );

        console.log(res.data);
        showToast("success", "Patient Profile Created! Redirecting...");
        navigate("/patientProfile")

    } catch (error) {
        console.error(error.response?.data?.message);
        const errorMsg = error.response?.data?.message || "Failed to save profile.";
        showToast("error", errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full px-10 py-6 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={onBack} className="text-gray-400 hover:text-white text-sm transition-colors">← Back</button>
          <h1 className="text-3xl font-bold text-white">Patient Profile</h1>
          <div className="w-8"></div>
      </div>
      
      {/* Decorative Glow Line (Green/Teal for Patients) */}
      <div className="h-1 w-20 bg-linear-to-r from-green-400 to-teal-600 rounded-full mx-auto mb-6 shadow-[0_0_15px_rgba(52,211,153,0.6)]"></div>

      <div className="space-y-1">
        
        {/* Row 1: Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
            <GlassInput 
                type="number" 
                placeholder="Age" 
                icon={FaUser}
                {...register("age", { required: "Required", min: 0, max: 120 })}
                error={errors.age}
            />
            <GlassSelect 
                icon={FaVenusMars}
                placeholder="Gender"
                options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" }
                ]}
                value={genderValue}
                onChange={(val) => setValue("gender", val)}
                error={errors.gender}
            />
        </div>

        {/* Row 2: Blood Group & Phone */}
        <div className="grid grid-cols-2 gap-4">
            <GlassSelect 
                icon={FaTint}
                placeholder="Blood Group"
                options={[
                    { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
                    { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
                    { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
                    { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" },
                ]}
                value={bloodValue}
                onChange={(val) => setValue("bloodGroup", val)}
                error={errors.bloodGroup}
            />
            <GlassInput 
                type="tel"
                placeholder="Phone Number" 
                icon={FaPhone}
                {...register("phone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10 digits" } })}
                error={errors.phone}
            />
        </div>

        {/* Row 3: Nationality & Address */}
        <GlassInput 
            placeholder="Nationality" 
            icon={FaGlobe}
            {...register("nationality", { required: "Required" })}
            error={errors.nationality}
        />
        
        <GlassInput 
            placeholder="Full Address" 
            icon={FaMapMarkerAlt}
            {...register("address", { required: "Required" })}
            error={errors.address}
        />

        {/* Row 4: Medical History (TextArea style input) */}
        <div className="pt-2">
            <label className="text-gray-400 text-xs ml-2 mb-1 block items-center gap-2">
                <FaNotesMedical className="text-green-400"/> Existing Medical Conditions (Optional)
            </label>
            <GlassInput 
                placeholder="e.g. Diabetes, Asthma (Leave blank if none)" 
                icon={FaAllergies}
                {...register("medicalHistory")}
            />
        </div>

      </div>

      <div className="mt-4 pb-4">
         {/* Green Variant Button for Patient */}
         <GradientButton loading={isSubmitting} variant="green">
             Complete Registration
         </GradientButton>
      </div>
    </form>
  );
};

export default PatientDetail;
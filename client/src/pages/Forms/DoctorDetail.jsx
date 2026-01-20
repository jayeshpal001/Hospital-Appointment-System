import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { 
  FaStethoscope, FaBriefcase, FaCalendarAlt, FaClock, FaDollarSign, FaPlus, FaTrash, 
  FaGraduationCap, FaUser, FaPhone, FaMapMarkerAlt, FaGlobe, FaVenusMars 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// 1. Added GlassSelect to imports
import { GlassInput, GlassTimePicker, GlassSelect, GradientButton, showToast } from "../../components/ui/Form";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const DoctorDetail = ({ onBack }) => {
  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      degree: "",
      specialization: "",
      experience: "",
      age: "",
      gender: "", // 2. Added gender default value
      phone: "",
      address: "",
      nationality: "",
      consultationFee: "",
      availableDays: [],
      availableSlots: [{ startTime: "09:00", endTime: "17:00" }]
    }
  });
   const { setIsAuth } = useAuth();
  const { fields, append, remove } = useFieldArray({ control, name: "availableSlots" });
  const selectedDays = watch("availableDays");
  const genderValue = watch("gender"); // 3. Watch gender value for the dropdown

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const navigate = useNavigate();

  const toggleDay = (day) => {
    const current = selectedDays || [];
    const updated = current.includes(day) 
        ? current.filter(d => d !== day) 
        : [...current, day];
    setValue("availableDays", updated);
  };

  const onSubmit = async (data) => {
    console.log("Submitting Doctor Data:", data);
    try {
        await new Promise(r => setTimeout(r, 1000)); 

        const res = await api.post(
            "/user/doctorData", 
            {
                ...data,
                experience: Number(data.experience),
                age: Number(data.age),
                consultationFee: Number(data.consultationFee)
            },
            
        );
        setIsAuth(true);

        console.log(res.data);
        showToast("success", "Profile Setup Complete! Redirecting...");
        navigate("/doctorProfile");

    } catch (error) {
        console.error(error);
        const errorMsg = error.response?.data?.message || "Failed to save profile. Please try again.";
        showToast("error", errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full px-10 py-6 overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={onBack} className="text-gray-400 hover:text-white text-sm transition-colors">← Back</button>
          <h1 className="text-3xl font-bold text-white">Doctor Profile</h1>
          <div className="w-8"></div>
      </div>
      
      <div className="h-1 w-20 bg-linear-to-r from-cyan-400 to-blue-600 rounded-full mx-auto mb-6 shadow-[0_0_15px_rgba(0,242,254,0.6)]"></div>

      <div className="space-y-1">
        
        {/* Row 1: Degree & Specialization */}
        <div className="grid grid-cols-2 gap-4">
            <GlassInput 
                placeholder="Degree (e.g. MBBS)" 
                icon={FaGraduationCap}
                {...register("degree", { required: "Required" })}
                error={errors.degree}
            />
            <GlassInput 
                placeholder="Specialization" 
                icon={FaStethoscope}
                {...register("specialization", { required: "Required" })}
                error={errors.specialization}
            />
        </div>

        {/* Row 2: Experience & Age */}
        <div className="grid grid-cols-2 gap-4">
            <GlassInput 
                type="number" 
                placeholder="Exp (Yrs)" 
                icon={FaBriefcase}
                {...register("experience", { required: "Required", min: 0 })}
                error={errors.experience}
            />
            <GlassInput 
                type="number" 
                placeholder="Age" 
                icon={FaUser}
                {...register("age", { required: "Required", min: 18 })}
                error={errors.age}
            />
        </div>

        {/* Row 3: Gender & Phone (Added Gender Here) */}
        <div className="grid grid-cols-2 gap-4">
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
            <GlassInput 
                type="tel"
                placeholder="Phone Number" 
                icon={FaPhone}
                {...register("phone", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "10 digits" } })}
                error={errors.phone}
            />
        </div>

        {/* Row 4: Nationality */}
        <GlassInput 
            placeholder="Nationality" 
            icon={FaGlobe}
            {...register("nationality", { required: "Required" })}
            error={errors.nationality}
        />

        {/* Row 5: Address */}
        <GlassInput 
            placeholder="Clinic/Hospital Address" 
            icon={FaMapMarkerAlt}
            {...register("address", { required: "Required" })}
            error={errors.address}
        />

        {/* Row 6: Available Days */}
        <div className="mb-5">
           <label className="block text-sm text-gray-300 mb-2 font-medium ml-1 items-center gap-2">
             <FaCalendarAlt className="text-cyan-400"/> Available Days
           </label>
           
           <div className="flex flex-wrap gap-2">
             {daysList.map((day) => (
               <button 
                 type="button" 
                 key={day} 
                 onClick={() => toggleDay(day)}
                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border duration-300
                   ${selectedDays.includes(day) 
                     ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-[0_0_15px_rgba(0,242,254,0.4)] scale-105" 
                     : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"}`}
               >
                 {day}
               </button>
             ))}
           </div>
           {selectedDays.length === 0 && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">Please select at least one day</p>}
        </div>

        {/* Row 7: Time Slots */}
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-gray-300 font-medium ml-1 items-center gap-2">
                    <FaClock className="text-cyan-400"/> Time Slots
                </label>
                <button type="button" onClick={() => append({ startTime: "", endTime: "" })} className="text-cyan-400 text-xs hover:text-white flex items-center gap-1 transition-colors font-semibold">
                    <FaPlus /> Add Slot
                </button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end animate-fadeIn">
                        <GlassTimePicker 
                            label={index === 0 ? "Start" : ""}
                            {...register(`availableSlots.${index}.startTime`, { required: true })}
                            error={errors.availableSlots?.[index]?.startTime}
                        />
                        <GlassTimePicker 
                            label={index === 0 ? "End" : ""}
                            {...register(`availableSlots.${index}.endTime`, { required: true })}
                            error={errors.availableSlots?.[index]?.endTime}
                        />
                        <button type="button" onClick={() => remove(index)} className="mb-2.5 p-2 text-red-400 hover:text-red-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Remove Slot">
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Row 8: Fee */}
        <GlassInput 
            type="number" 
            placeholder="Consultation Fee ($)" 
            icon={FaDollarSign}
            {...register("consultationFee", { required: "Required" })}
            error={errors.consultationFee}
        />
      </div>

      <div className="mt-4 pb-4">
         <GradientButton loading={isSubmitting} variant="cyan">Save Profile</GradientButton>
      </div>
    </form>
  );
};

export default DoctorDetail;
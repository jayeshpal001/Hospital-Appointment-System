import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // e.g., http://localhost:5000/api

export const apiSlice = createApi({
  reducerPath: 'api', // Store me is naam se dikhega
  baseQuery: fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: 'include', // 🔥 Important for Cookies (Token handling)
  }),
  // 🔥 Tags caching aur invalidation ke liye
  tagTypes: ['User', 'Appointment', 'DoctorStats', 'PatientProfile', 'DoctorProfile'],
  
  endpoints: (builder) => ({
    
    // --- 🔐 AUTH ENDPOINTS ---
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Appointment'], // Login hote hi purana cache saaf
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      // Logout par sab kuch reset/invalidate kar do
      invalidatesTags: ['User', 'Appointment', 'DoctorStats', 'PatientProfile', 'DoctorProfile'], 
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    // --- 👤 USER & PROFILE ENDPOINTS ---
    getDoctorProfile: builder.query({
      query: () => '/user/doctorProfile',
      providesTags: ['DoctorProfile'],
    }),

    getPatientProfile: builder.query({
      query: () => '/user/patientProfile',
      providesTags: ['PatientProfile'],
    }),

    setupProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile-setup',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'DoctorProfile', 'PatientProfile'],
    }),

    // --- 📅 APPOINTMENT ENDPOINTS ---
    getMyAppointments: builder.query({
      query: () => '/appointment/my-appointments',
      providesTags: ['Appointment'], // Is tag se data cache hoga
    }),

    bookAppointment: builder.mutation({
      query: (data) => ({
        url: '/appointment/book',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Appointment', 'DoctorStats'], // Book hote hi list aur stats refresh
    }),

    updateAppointmentStatus: builder.mutation({
      query: ({ appointmentId, status }) => ({
        url: '/appointment/status',
        method: 'PUT',
        body: { appointmentId, status },
      }),
      invalidatesTags: ['Appointment', 'DoctorStats'], // Status change hote hi list refresh
    }),

    // --- 📊 DOCTOR STATS ---
    getDoctorStats: builder.query({
      query: () => '/appointment/stats',
      providesTags: ['DoctorStats'],
    }),

  }),
});

// 🔥 Auto-generated Hooks export karein
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetDoctorProfileQuery,
  useGetPatientProfileQuery,
  useSetupProfileMutation,
  useGetMyAppointmentsQuery,
  useBookAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useGetDoctorStatsQuery,
} = apiSlice;
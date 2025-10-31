import React, { useState, useEffect } from 'react';
import { doctorsAPI, appointmentsAPI } from '../services/api';
import AppointmentForm from '../components/AppointmentForm';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsResponse, doctorsResponse] = await Promise.all([
        appointmentsAPI.getUserAppointments(),
        doctorsAPI.getDoctors()
      ]);
      setAppointments(appointmentsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    setShowForm(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsAPI.cancelAppointment(appointmentId);
        fetchData(); // Refresh the list
      } catch (error) {
        console.error('Error canceling appointment:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAppointment(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditAppointment = (appointment) => {
    return appointment.status === 'pending' || appointment.status === 'confirmed';
  };

  const canCancelAppointment = (appointment) => {
    return appointment.status === 'pending' || appointment.status === 'confirmed';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your appointments and healthcare</p>
      </div>

      <div className="mb-6">
        <button
          onClick={handleBookAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200"
        >
          Book New Appointment
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <AppointmentForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            editAppointment={editingAppointment}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Appointments</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500">
              No appointments scheduled. Book your first appointment above.
            </li>
          ) : (
            appointments.map((appointment) => (
              <li key={appointment._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctor.name}
                      </p>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <p>Specialization: {appointment.doctor.specialization}</p>
                      <p>Date: {new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                      <p>Reason: {appointment.reason}</p>
                      {appointment.notes && <p>Notes: {appointment.notes}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {canEditAppointment(appointment) && (
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                    )}
                    {canCancelAppointment(appointment) && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Doctors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h4 className="text-lg font-medium text-gray-900">Dr. {doctor.name}</h4>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
                <p className="text-sm text-gray-600">{doctor.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

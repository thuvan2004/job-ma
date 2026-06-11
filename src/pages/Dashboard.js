import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '', role: '', status: 'Applied', salary: '', jobUrl: '', notes: ''
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ company: '', role: '', status: 'Applied', salary: '', jobUrl: '', notes: '' });
      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const statusColor = (status) => {
    if (status === 'Applied') return 'bg-blue-100 text-blue-700';
    if (status === 'Interview') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Offer') return 'bg-green-100 text-green-700';
    if (status === 'Rejected') return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">JobTracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">👋 {user?.name}</span>
          <button onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {['Applied', 'Interview', 'Offer', 'Rejected'].map(s => (
            <div key={s} className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">
                {jobs.filter(j => j.status === s).length}
              </div>
              <div className="text-sm text-gray-500">{s}</div>
            </div>
          ))}
        </div>

        {/* Add Job Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">My Applications</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Add Job
          </button>
        </div>

        {/* Add Job Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Job Application</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Company</label>
                  <input type="text" value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full border rounded px-3 py-2" placeholder="Google" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Role</label>
                  <input type="text" value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full border rounded px-3 py-2" placeholder="Frontend Engineer" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full border rounded px-3 py-2">
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Salary</label>
                  <input type="text" value={formData.salary}
                    onChange={e => setFormData({...formData, salary: e.target.value})}
                    className="w-full border rounded px-3 py-2" placeholder="$90,000" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Job URL</label>
                  <input type="text" value={formData.jobUrl}
                    onChange={e => setFormData({...formData, jobUrl: e.target.value})}
                    className="w-full border rounded px-3 py-2" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Notes</label>
                  <textarea value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full border rounded px-3 py-2" rows="2" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                  Save
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600">Company</th>
                <th className="text-left px-4 py-3 text-gray-600">Role</th>
                <th className="text-left px-4 py-3 text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-gray-600">Salary</th>
                <th className="text-left px-4 py-3 text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No jobs yet — Add your first application!
                  </td>
                </tr>
              ) : (
                jobs.map(job => (
                  <tr key={job._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{job.company}</td>
                    <td className="px-4 py-3 text-gray-600">{job.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.salary || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteJob(job._id)}
                        className="text-red-500 hover:text-red-700 text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
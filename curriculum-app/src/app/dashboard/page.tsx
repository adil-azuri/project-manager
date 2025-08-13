import React from 'react';

const DashboardSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">title</h2>

    </div>
  );
};

const Dashboard = () => {
  // Data dummy untuk contoh tampilan
  const ownedProjects = [
    { id: 1, name: 'Aplikasi Manajemen Proyek', status: 'In Progress' },
    { id: 2, name: 'Sistem Informasi Sekolah', status: 'Pending' },
  ];

  const assignedTasks = [
    { id: 1, name: 'Merancang database', project: 'Aplikasi Manajemen Proyek' },
    { id: 2, name: 'Mendesain UI/UX', project: 'Sistem Informasi Sekolah' },
  ];

  const managedProjects = [
    { id: 3, name: 'Website Portofolio Tim', status: 'Completed' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      {/* Bagian Header dan Sapaan */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Halo, Pengguna! 👋</h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali di dashboard Anda. Berikut ringkasan aktivitas terbaru Anda.</p>
      </div>

      {/* Bagian Utama Dashboard dengan Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1: Proyek yang Dimiliki */}
        <div title="Proyek Anda">
          {ownedProjects.length > 0 ? (
            <ul className="space-y-3">
              {ownedProjects.map(project => (
                <li key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{project.name}</p>
                    <span className={`text-sm ${project.status === 'In Progress' ? 'text-blue-500' : 'text-yellow-500'}`}>{project.status}</span>
                  </div>
                  <button className="text-sm text-blue-500 hover:underline">Lihat</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Anda belum memiliki proyek.</p>
          )}
        </div>

        {/* Kolom 2: Tugas yang Ditugaskan */}
        <div title="Tugas untuk Anda">
          {assignedTasks.length > 0 ? (
            <ul className="space-y-3">
              {assignedTasks.map(task => (
                <li key={task.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-700">{task.name}</p>
                  <p className="text-sm text-gray-500">Proyek: {task.project}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Anda tidak memiliki tugas yang ditugaskan.</p>
          )}
        </div>

        {/* Kolom 3: Proyek yang Dikelola */}
        <div title="Proyek Kolaborasi">
          {managedProjects.length > 0 ? (
            <ul className="space-y-3">
              {managedProjects.map(project => (
                <li key={project.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">{project.name}</p>
                    <span className={`text-sm ${project.status === 'Completed' ? 'text-green-500' : ''}`}>{project.status}</span>
                  </div>
                  <button className="text-sm text-blue-500 hover:underline">Lihat</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Anda belum tergabung dalam proyek kolaborasi.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
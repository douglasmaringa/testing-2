import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

function Home() {
  const [monitors, setMonitors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [port, setPort] = useState(443);
  const [frequency, setFrequency] = useState(1);
  const [type, setType] = useState("web");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      const fetchMonitors = async () => {
        try {
            const response = await axios.post(
                'https://monitornew.zc.al/api/monitor/monitors/all',
                { token }
              );
              //console.log(response)

          if (response.status === 200) {
            setMonitors(response?.data?.monitors);
          } else {
            // Handle fetch monitors error
            console.error('Failed to fetch monitors.');
          }
        } catch (error) {
          console.error('Error occurred while fetching monitors:', error);
        }
      };

      fetchMonitors();
    }
  }, []);

  const handleViewDetails = (monitorId) => {
    navigate(`/details/${monitorId}`);
  };

  const handleAddMonitor = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(url,port,frequency)

    const token = localStorage.getItem('token');
    const monitorData = {
      url: `${url}`,
      token,
      port,
      type,
      frequency,
    };

    try {
      const response = await axios.post('https://monitornew.zc.al/api/monitor/monitors', monitorData);

      if (response.status === 201) {
        setIsModalOpen(false);
        setUrl('');
        setPort(443);
        setFrequency(1);
        // Refresh the monitor list
       
            try {
                const response = await axios.post(
                    'https://monitornew.zc.al/api/monitor/monitors/all',
                    { token }
                  );
                  //console.log(response)
    
              if (response.status === 200) {
                setMonitors(response?.data?.monitors);
              } else {
                // Handle fetch monitors error
                console.error('Failed to fetch monitors.');
              }
            } catch (error) {
              console.error('Error occurred while fetching monitors:', error);
            }
          
        
      } else {
        console.error('Failed to add monitor.');
      }
    } catch (error) {
      console.error('Error occurred while adding monitor:', error);
    }
  };
  
  const handlePauseMonitor = async (monitorId) => {
    try {
      await axios.put(`https://monitornew.zc.al/api/monitor/monitors/${monitorId}/pause`);
      alert('Monitor paused successfully.');
    } catch (error) {
      console.error('Failed to pause monitor:', error);
    }
  };

  return (
    <div>
      <h2>Home</h2>
      <button className=' px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mt-5 focus:outline-none focus:bg-blue-600' onClick={handleAddMonitor}>Add New Monitor</button>
      <table className="w-full border mt-10 border-gray-300">
  <thead>
    <tr>
      <th className="px-4 py-2 bg-gray-100 border-b">URL</th>
      <th className="px-4 py-2 bg-gray-100 border-b">Test Type</th>
      <th className="px-4 py-2 bg-gray-100 border-b">Frequency</th>
      <th className="px-4 py-2 bg-gray-100 border-b">Status</th>
      <th className="px-4 py-2 bg-gray-100 border-b"></th>
    </tr>
  </thead>
  <tbody>
    {monitors.map((monitor) => (
      <tr key={monitor._id}>
        <td className="text-center px-4 py-2 border-b">{monitor.url}</td>
        <td className="text-center px-4 py-2 border-b">{monitor.type}</td>
        <td className="text-center px-4 py-2 border-b">{monitor.frequency} minute</td>
        <td className="text-center px-4 py-2 border-b">{monitor?.isPaused? "Paused":"Active"}</td>
        <td className="text-center px-4 py-2 border-b">
          <button className="text-blue-500" onClick={() => handleViewDetails(monitor._id)}>
            View Details
          </button>
          <button
                  className="text-red-500 ml-5"
                  onClick={() => handlePauseMonitor(monitor._id)}
                >
                    {monitor?.isPaused? "Resume Monitor":" Pause Monitor"}
                 
                </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Modal */}
      <Transition.Root show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-y-auto" onClose={handleCloseModal}>
          <div className="flex items-center justify-center min-h-screen px-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Add New Monitor
                </Dialog.Title>

                <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                      Test Type:
                    </label>
                    <select
                      id="frequency"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value={"web"}>Website Availablity Test</option>
                      <option value={"ping"}>Ping Test</option>
                      <option value={"port"}>Port Test</option>
                    </select>
                  </div>
                
                {
                  type === "web" &&
                  <div className="mt-4">
               <label htmlFor="url" className="block text-sm font-medium text-gray-700">
               Web URL:http://www.example.com or Ip:http://142.251.32.46
               </label>
               <div className="flex">
               <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => {
                const enteredUrl = e.target.value;
                setUrl(enteredUrl.startsWith("http://") ? enteredUrl : `http://${enteredUrl}`);
                  }}
                className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-t border-r border-b border-gray-300 rounded-r-md"
                />
              </div>
              </div>
                }

                {
                  type === "ping" &&
                  <div className="mt-4">
               <label htmlFor="url" className="block text-sm font-medium text-gray-700">
               Ping URL:www.example.com or Ip:142.251.32.46
               </label>
               <div className="flex">
               <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => {
                const enteredUrl = e.target.value;
                setUrl(enteredUrl)
                  }}
                className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-t border-r border-b border-gray-300 rounded-r-md"
                />
              </div>
              </div>
                }

               {
                  type === "port" &&
                  <div className="mt-4">
               <label htmlFor="url" className="block text-sm font-medium text-gray-700">
               Port URL:www.example.com or Ip:142.251.32.46
               </label>
               <div className="flex">
               <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => {
                const enteredUrl = e.target.value;
                setUrl(enteredUrl)
                  }}
                className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-t border-r border-b border-gray-300 rounded-r-md"
                />
              </div>
              </div>
                }
                
                {
                  type === "port" &&
                  <div className="mt-4">
                    <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                      Port:
                    </label>
                    <input
                      id="port"
                      type="number"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                    }

                  <div className="mt-4">
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                      Frequency:
                    </label>
                    <select
                      id="frequency"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value={1}>1 minute</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    >
                      Add Monitor
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="ml-4 inline-flex justify-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';

function Details() {
  const location = useLocation();
  const [uptimeEvents, setUptimeEvents] = useState([]);
  const [url, setUrl] = useState("");
  const [freq, setFreq] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const monitorId = location.pathname.split('/').pop();
    console.log(monitorId)
    fetchUptimeEvents(token,monitorId);
  }, [location.pathname]);

  const fetchUptimeEvents = async (token,monitorId) => {
    setIsLoading(true);

    try {
      const response = await axios.post('https://monitornew.zc.al/api/monitor/monitors/uptimeevents', {
        id: monitorId,
        token,
      });
      console.log(response)

      if (response.status === 200) {
        setUptimeEvents(response?.data?.uptimeEvents);
        setUrl(response?.data?.Url)
        setFreq(response?.data?.frequency)
        setType(response?.data?.type)
      } else {
        console.error('Failed to fetch uptime events.');
      }
    } catch (error) {
      console.error('Error occurred while fetching uptime events:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  const convertResponseTimeToSeconds = (responseTime) => {
    return responseTime / 1000;
  };

  const refresh = ()=>{
    setIsLoading(true)
    const token = localStorage.getItem('token');
    const monitorId = location.pathname.split('/').pop();
    console.log(monitorId)
    fetchUptimeEvents(token,monitorId);
  }

  console.log(uptimeEvents)

  return (
    <div>
        <Link to={"/home"}>Back</Link>
      <h2 className="mb-4 text-2xl font-semibold">Details Page</h2>
      <button onClick={refresh} className="mb-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
       {isLoading? "Loading...":"Refresh"} 
      </button>
      <h1>URL:{url}</h1>
      <h1>Frequency: every {freq} minute</h1>
      <h1>{uptimeEvents?.length} total results</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
          <th className="px-4 py-2 bg-gray-100 border-b">Response Time</th>
          {
            type === "web" &&
            <th className="px-4 py-2 bg-gray-100 border-b">Availabity</th>
          }
          {
            type === "ping" &&
            <th className="px-4 py-2 bg-gray-100 border-b">Ping</th>
          }
          {
            type === "port" &&
            <th className="px-4 py-2 bg-gray-100 border-b">Port</th>
          }
            
            
            <th className="px-4 py-2 bg-gray-100 border-b">Response Time</th>
            <th className="px-4 py-2 bg-gray-100 border-b">Proccessed by</th>
           
          </tr>
        </thead>
        <tbody>
          {uptimeEvents.map((event) => (
            <tr key={event._id}>
                <td className="text-center px-4 py-2 border-b">{formatTimestamp(event?.timestamp)}</td>
                {
                 type === "web" &&
                 <td className="text-center px-4 py-2 border-b">{event.availability}</td>
                }

                {
                 type === "ping" &&
                 <td className="text-center px-4 py-2 border-b">{event.ping}</td>
              
                }

                 {
                 type === "port" &&
                 <td className="text-center px-4 py-2 border-b">{event.port}</td>
              
                }
              
              <td className="text-center px-4 py-2 border-b">{convertResponseTimeToSeconds(event?.responseTime)}</td>
              <td className="text-center px-4 py-2 border-b">{event.confirmedByAgent}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Details;

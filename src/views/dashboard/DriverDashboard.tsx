import { useState, useEffect } from 'react';
import { QueueItem } from '../../models/types';
import { socketService } from '../../services/socketService';
import '../../styles/dashboard/driverDashboard.css';

const DriverDashboard = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      console.log('Connected to socket server');
      setResponse('Socket Connected');
      socket.emit("test", "Hello from driver");
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      setResponse('Socket Disconnected');
    });

    // Listen for queue updates and map the backend data
    socket.on('queueUpdate', (data: any) => {
      console.log('Queue Update:', data);
      const items = data.queueDetails.map((detail: any) => ({
        id: detail.user.email,
        studentName: detail.user.name,
        timestamp: detail.user.timestamp ? detail.user.timestamp : new Date().toISOString(),
        status: detail.user.status || 'waiting'
      }));
      setResponse(`Queue Updated: ${data.length} items`);
      setQueueItems(items);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleAccept = async (id: string) => {
    try {
      setLoading(true);
      const socket = socketService.getSocket();
      socket.emit('queue_leave', { id, status: 'accepted' });
    } catch (error) {
      console.error('Failed to accept student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setLoading(true);
      const socket = socketService.getSocket();
      socket.emit('queue_cancel', { id, status: 'rejected' });
    } catch (error) {
      console.error('Failed to reject student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Driver Queue Management</h1>
      
      {response && (
        <div className={`response-message ${response.includes('Error') ? 'error' : 'success'}`}>
          {response}
        </div>
      )}

      <div className="queue-list">
        <table className="queue-table">
          <thead>
            <tr>
              <th className="col-position">Position</th>
              <th className="col-name">Student Name</th>
              <th className="col-time">Time</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queueItems.map((item, index) => (
              <tr key={item.id} className={`queue-item ${item.status}`}>
                <td className="col-position">{index + 1}</td>
                <td className="col-name">{item.studentName}</td>
                <td className="col-time">{new Date(item.timestamp).toLocaleTimeString()}</td>
                <td className="col-status">{item.status}</td>
                <td className="col-actions">
                  {item.status === 'waiting' && (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleAccept(item.id)}
                        className="accept-button"
                        disabled={loading}
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => handleReject(item.id)}
                        className="reject-button"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverDashboard;
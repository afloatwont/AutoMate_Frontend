import { useState, useEffect } from "react";
import { QueueState, QueueItem, QueueData } from "../../models/types";
import { socketService } from "../../services/socketService";
import "../../styles/dashboard/studentDashboard.css";
import { logger } from "../../services/logger";

const StudentDashboard = () => {
  const [queueState, setQueueState] = useState<QueueState>({
    items: [],
    isInQueue: false,
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on("connect", () => {
      logger.info("Connected to socket server");
      setResponse("Connected to queue service");
    });

    socket.on("disconnect", () => {
      logger.info("Disconnected from socket server");
      setResponse("Disconnected from queue service");
    });

    // Listen for queue position updates
    socket.on("position", (data: { position: number }) => {
      logger.info("Position update:", data);
      setPosition(data.position);
      setResponse(`Your position in queue: ${data.position}`);
    });

    // Listen for queue status updates
    socket.on("queueUpdate", (data: QueueData) => {
      logger.info("Queue status update:", data);
      const items: QueueItem[] = data.queueDetails.map((detail) => ({
        id: detail.user.email,
        studentName: detail.user.name,
        timestamp: new Date().toISOString(),
        status: detail.user.status || "waiting",
        position: detail.position,
      }));

      setLoading(false);
      setQueueState((prev) => ({
        ...prev,
        items,
        currentPosition: data.queueDetails.find(
          (detail) => detail.user.email === socket.id
        )?.position,
      }));
      setResponse(`Queue updated: ${data.queue.length} students waiting`);
    });

    // Listen for errors
    socket.on("error", (error: { message: string }) => {
      logger.error("Socket error:", error);
      setResponse(`Error: ${error.message}`);
      setLoading(false);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleJoinQueue = async () => {
    try {
      setLoading(true);
      const socket = socketService.getSocket();
      logger.info("Attempting to join queue");
      socket.emit("queue_join");
    } catch (error) {
      logger.error("Failed to join queue:", error);
      setResponse("Failed to join queue. Please try again.");
      setLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    try {
      setLoading(true);
      const socket = socketService.getSocket();
      logger.info("Attempting to leave queue");
      socket.emit("queue_leave");
    } catch (error) {
      logger.error("Failed to leave queue:", error);
      setResponse("Failed to leave queue. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Student Queue Dashboard</h1>
      {position && (
        <div className="queue-position">Position in Queue: {position}</div>
      )}
      <div className="queue-list">
        <table className="queue-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {queueState.items.map((item) => (
              <tr key={item.id} className={`queue-item ${item.status}`}>
                <td>{item.position}</td>
                <td>{item.studentName}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="queue-controls">
        {!queueState.isInQueue ? (
          <button
            onClick={handleJoinQueue}
            className="join-button"
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Queue"}
          </button>
        ) : (
          <button
            onClick={handleLeaveQueue}
            className="leave-button"
            disabled={loading}
          >
            {loading ? "Leaving..." : "Leave Queue"}
          </button>
        )}
      </div>
      {response && (
        <div
          className={`response-message ${
            response.includes("Error") ? "error" : "success"
          }`}
        >
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

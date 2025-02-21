import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css'; // Import the CSS file

const socket = io('https://task-management-backend-ecjo.onrender.com'); // Updated backend URL

interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status?: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    socket.on('taskUpdate', (task: Task) => {
      setTasks((prevTasks) => [...prevTasks, task]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const register = async () => {
    try {
      await axios.post('https://task-management-backend-ecjo.onrender.com/register', {
        username,
        password,
      });
      alert('User registered successfully!');
    } catch (error) {
      alert('Failed to register user');
    }
  };

  const login = async () => {
    try {
      const response = await axios.post('https://task-management-backend-ecjo.onrender.com/login', {
        username,
        password,
      });
      setToken(response.data);
      alert('Logged in successfully!');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const createTask = async () => {
    if (!input.trim()) {
      alert('Task title cannot be empty');
      return;
    }
    try {
      await axios.post(
        'https://task-management-backend-ecjo.onrender.com/tasks',
        { title: input },
        { headers: { Authorization: token } }
      );
      setInput('');
    } catch (error) {
      alert('Failed to create task');
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <h1 className="header">Task Management System</h1>

      {/* Authentication Section */}
      <div className="card">
        <h2>Authentication</h2>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input-field"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input-field"
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={register} className="button button-primary">
              Register
            </button>
            <button onClick={login} className="button button-secondary">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Task Creation Section */}
      <div className="card">
        <h2>Create a New Task</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter task title"
            className="input-field"
          />
          <button onClick={createTask} className="button button-primary">
            Create Task
          </button>
        </div>
      </div>

      {/* Task List Section */}
      <div className="card">
        <h2>Task List</h2>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <span className="task-title">{task.title}</span>
              <span className="task-status">{task.status || 'Pending'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
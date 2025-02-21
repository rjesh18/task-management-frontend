import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://task-management-backend-ecjo.onrender.com');

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
    await axios.post('https://task-management-backend-ecjo.onrender.com/register', {
      username,
      password,
    });
    alert('User registered successfully!');
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Real-Time Task Management
        </h1>

        {/* Auth Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Authentication</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <button
                onClick={register}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Register
              </button>
              <button
                onClick={login}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Task Creation Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Create a New Task</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter task title"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={createTask}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              Create Task
            </button>
          </div>
        </div>

        {/* Task List Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Task List</h2>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
              >
                <span className="text-gray-800">{task.title}</span>
                <span className="text-sm text-gray-500">
                  {task.status || 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';

function TaskFlow() {
  const [columns, setColumns] = useState({
    todo: {
      name: 'To Do',
      items: [{ id: '1', content: 'Task 1' }],
    },
    inProgress: {
      name: 'In Progress',
      items: [{ id: '4', content: 'Task 4' }],
    },
    done: {
      name: 'Done',
      items: [{ id: '7', content: 'Task 7' }],
    },
  });

  const [newTask, setNewTask] = useState('');
  const [activeColumn, setActiveColumn] = useState('todo');
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === '') return;
    const updatedColumns = { ...columns };

    updatedColumns[activeColumn].items.push({
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updatedColumns);
    setNewTask('');
  };

  const removeTask = (columnId, taskId) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns(updatedColumns);
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const updatedColumns = { ...columns };
    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter(
      (i) => i.id !== item.id
    );
    updatedColumns[columnId].items.push(item);

    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyle = {
    todo: {
      header: 'bg-gradient-to-r from-blue-600 to-blue-400',
      border: 'border-blue-400',
    },
    inProgress: {
      header: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
      border: 'border-yellow-400',
    },
    done: {
      header: 'bg-gradient-to-r from-green-600 to-green-400',
      border: 'border-green-400',
    },
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="font-bold mb-8 text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">
          TaskFlow
        </h1>

        <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 bg-zinc-700 text-white"
            onKeyDown={(e) => e.key === 'Enter' && addNewTask()}
          />

          <select
            value={activeColumn}
            onChange={(e) => setActiveColumn(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600"
          >
            {Object.keys(columns).map((columnId) => (
              <option value={columnId} key={columnId}>
                {columns[columnId].name}
              </option>
            ))}
          </select>

          <button
            onClick={addNewTask}
            className="p-3 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-400 transition-all duration-200 cursor-pointer"
          >
            Add
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 w-full">
          {Object.keys(columns).map((columnId) => (
            <div
              key={columnId}
              className={`flex-shrink-0 w-80 rounded-md shadow-xl border-t-4 ${columnStyle[columnId].border}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyle[columnId].header}`}>
                {columns[columnId].name}
                <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm">
                  {columns[columnId].items.length}
                </span>
              </div>

              <div className="p-3 min-h-64 bg-zinc-800">
                {columns[columnId].items.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 italic text-sm">
                    Drop tasks here
                  </div>
                ) : (
                  columns[columnId].items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 mb-3 bg-zinc-700 text-white rounded-md shadow-md cursor-move flex items-center justify-between transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      draggable
                      onDragStart={() => handleDragStart(columnId, item)}
                    >
                      <span className="mr-2">{item.content}</span>
                      <button
                        onClick={() => removeTask(columnId, item.id)}
                        className="text-zinc-400 hover:text-red-400 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600"
                      >
                        <span className="text-lg cursor-pointer">x</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskFlow;

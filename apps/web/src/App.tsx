import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

import { Todo } from './types/todo';
import { STATUS, TodoStatus } from './types/status';
import { useCreateTodo, useTodos, useUpdateTodo } from './hooks/todo';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [title, setTitle] = React.useState('');
  const [status, setStatus] = React.useState<TodoStatus>(STATUS.CREATED);
  const [problemDesc, setProblemDesc] = React.useState('');
  const [selected, setSelected] = React.useState<Todo | null>(null);
  const [editingTodo, setEditingTodo] = React.useState<Partial<Todo> | null>(
    null,
  );

  const search = searchParams.get('search') || '';

  const ref = React.useRef<HTMLDialogElement>(null);
  const { data: todos, isLoading, isError, error } = useTodos(search);
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleCloseDetail();
      }
    };

    if (selected) document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selected]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createTodoMutation.mutate({
        title: title,
        status: status,
        ...(status === STATUS.PROBLEM && problemDesc
          ? { problem_desc: problemDesc }
          : {}),
      });
      setTitle('');
      setStatus(STATUS.CREATED);
      setProblemDesc('');
    }
  };

  const handleUpdateStatus = (id: number, status: TodoStatus) => {
    updateTodoMutation.mutate({ id, data: { status } });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) setSearchParams({ search: value });
    else setSearchParams({});
  };

  const handleShowDetail = (todo: Todo) => {
    setSelected(todo);
    setEditingTodo({ ...todo });
  };

  const handleCloseDetail = () => {
    setSelected(null);
    setEditingTodo(null);
  };

  const handleEditChange = (field: keyof Todo, value: string | boolean) => {
    if (editingTodo) {
      let newTodo = { ...editingTodo, [field]: value as never };

      if (field === 'status') {
        if (value !== STATUS.PROBLEM) {
          newTodo = { ...newTodo, problem_desc: undefined };
        } else if (!editingTodo.problem_desc && editingTodo.status !== STATUS.PROBLEM) {
          newTodo = { ...newTodo, problem_desc: '' };
        }
      }

      setEditingTodo(newTodo);
    }
  };

  const handleSaveChanges = () => {
    if (editingTodo && selected) {
      updateTodoMutation.mutate({
        id: selected.id,
        data: {
          status: editingTodo.status as TodoStatus,
          problem_desc: editingTodo.problem_desc,
        },
      });
      setSelected({ ...selected, ...editingTodo });
      setEditingTodo(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1>Todo Application</h1>

      <form onSubmit={handleAddTodo}>
        <div className="grid">
          <div className="col-6">
            <label htmlFor="title-input">Title</label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter new todo..."
              disabled={createTodoMutation.isPending}
              className="contrast"
            />
          </div>
          <div className="col-3">
            <label htmlFor="status-select">Status</label>
            <select
              id="status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as TodoStatus)}
              className="contrast"
            >
              <option value={STATUS.CREATED}>Created</option>
              <option value={STATUS.COMPLETED}>Completed</option>
              <option value={STATUS.ON_GOING}>On Going</option>
              <option value={STATUS.PROBLEM}>Problem</option>
            </select>
          </div>
          <div className="col-3">
            <label>&nbsp;</label>
            <button
              type="submit"
              disabled={createTodoMutation.isPending}
              className="secondary contrast"
            >
              {createTodoMutation.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
        {status === STATUS.PROBLEM && (
          <div className="grid">
            <div className="col-9">
              <label htmlFor="problem-desc">Problem Description</label>
              <textarea
                id="problem-desc"
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                placeholder="Describe the problem..."
                className="contrast"
                rows={2}
              />
            </div>
          </div>
        )}
      </form>

      <div className="row">
        <div className="col-6">
          <label htmlFor="search">Search Todos</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search todos..."
            className="contrast"
          />
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <p>Loading todos...</p>
        </div>
      )}

      {isError && (
        <div className="error">
          <p>Error: {error?.message || 'Failed to load todos'}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <table className="striped" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'left' }}>#</th>
              <th scope="col" style={{ textAlign: 'left' }}>Title</th>
              <th scope="col" style={{ textAlign: 'left' }}>Status</th>
              <th scope="col" style={{ textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos?.map((todo: Todo, index: number) => (
              <tr key={todo.id} style={{ verticalAlign: 'middle' }}>
                <td style={{ verticalAlign: 'middle' }}>{index + 1}</td>
                <td style={{ verticalAlign: 'middle' }}>{todo.title}</td>
                <td style={{ verticalAlign: 'middle' }}>
                  <select
                    value={todo.status}
                    onChange={(e) =>
                      handleUpdateStatus(todo.id, e.target.value as TodoStatus)
                    }
                    disabled={updateTodoMutation.isPending}
                    className="contrast"
                    style={{ minWidth: '120px' }}
                  >
                    <option value={STATUS.CREATED}>Created</option>
                    <option value={STATUS.COMPLETED}>Completed</option>
                    <option value={STATUS.ON_GOING}>On Going</option>
                    <option value={STATUS.PROBLEM}>Problem</option>
                  </select>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <button
                    onClick={() => handleShowDetail(todo)}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}
                  >
                    Show Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div className={`modal ${selected ? 'modal-is-open' : ''}`}>
          <div className="modal-overlay" onClick={handleCloseDetail}></div>
          <dialog ref={ref} open className="modal-container">
            <article>
              <header>
                <h2>Todo Detail</h2>
              </header>
              <div>
                <p>
                  <strong>ID:</strong> {selected.id}
                </p>
                <p>
                  <strong>Title:</strong> {selected.title}
                </p>
                <div className="grid">
                  <div className="col-6">
                    <label htmlFor="status-select">Status</label>
                    <select
                      id="status-select"
                      value={editingTodo?.status || selected.status}
                      onChange={(e) =>
                        handleEditChange('status', e.target.value)
                      }
                      className="contrast"
                    >
                      <option value={STATUS.CREATED}>Created</option>
                      <option value={STATUS.COMPLETED}>Completed</option>
                      <option value={STATUS.ON_GOING}>On Going</option>
                      <option value={STATUS.PROBLEM}>Problem</option>
                    </select>
                  </div>
                </div>
                {(editingTodo?.status === STATUS.PROBLEM) && (
                  <div className="mb-2">
                    <label htmlFor="problem-desc">Problem Description</label>
                    <textarea
                      id="problem-desc"
                      value={
                        editingTodo?.problem_desc || selected.problem_desc || ''
                      }
                      onChange={(e) =>
                        handleEditChange('problem_desc', e.target.value)
                      }
                      placeholder="Describe the problem..."
                      className="contrast"
                      rows={3}
                    />
                  </div>
                )}
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <footer>
                <button onClick={handleSaveChanges} className="primary">
                  Save Changes
                </button>
                <button onClick={handleCloseDetail} className="secondary">
                  Close
                </button>
              </footer>
            </article>
          </dialog>
        </div>
      )}
    </div>
  );
}

export default App;

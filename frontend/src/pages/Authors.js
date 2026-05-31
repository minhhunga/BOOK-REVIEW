import { useState, useEffect } from 'react';
import { authorAPI } from '../services/api';

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const fetchAuthors = async () => {
    const res = await authorAPI.getAll(page);
    setAuthors(res.data.content);
    setTotalPages(res.data.totalPages);
    setPageSize(res.data.size ?? res.data.pageable?.pageSize ?? pageSize);
  };

  useEffect(() => { fetchAuthors(); }, [page]);

  const handleCreate = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    await authorAPI.create({ name });
    setName(''); setError(''); setShowCreateModal(false);
    fetchAuthors();
  };

  const handleUpdate = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    await authorAPI.update(selectedAuthor.id, { name });
    setName(''); setError(''); setShowEditModal(false);
    fetchAuthors();
  };

  const handleDelete = async () => {
    await authorAPI.delete(selectedAuthor.id);
    setShowDeleteModal(false);
    fetchAuthors();
  };

  const getPageItems = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    if (page <= 2) {
      return [0, 1, 2, 'ellipsis', totalPages - 1];
    }

    if (page >= totalPages - 3) {
      return [0, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1];
    }

    return [0, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages - 1];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Authors</h1>
        <button
          onClick={() => { setName(''); setError(''); setShowCreateModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Author
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">No</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Name</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Books</th>
              <th className="text-right px-6 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-400">No authors yet</td></tr>
            ) : (
              authors.map((author, i) => (
                <tr key={author.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{page * pageSize + i + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{author.name}</td>
                  <td className="px-6 py-4 text-gray-600">{author.books?.length ?? 0}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => { setSelectedAuthor(author); setName(author.name); setError(''); setShowEditModal(true); }}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                    >Edit</button>
                    <button
                      onClick={() => { setSelectedAuthor(author); setShowDeleteModal(true); }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <div className="flex items-center gap-2">
            {getPageItems().map((item, i) => (
              item === 'ellipsis' ? (
                <span key={`e-${i}`} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`px-3 py-1 rounded border ${page === item ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >{item + 1}</button>
              )
            ))}
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <Modal title="Add Author" onClose={() => setShowCreateModal(false)}>
          <input
            className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Author name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit Author" onClose={() => setShowEditModal(false)}>
          <input
            className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Author name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleUpdate} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500">Update</button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal title="Delete Author" onClose={() => setShowDeleteModal(false)}>
          <p className="text-gray-600 mb-4">Are you sure you want to delete <strong>{selectedAuthor?.name}</strong>?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
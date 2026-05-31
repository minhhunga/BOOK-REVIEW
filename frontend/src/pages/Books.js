import { useState, useEffect } from 'react';
import { bookAPI, authorAPI } from '../services/api';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    const res = await bookAPI.getAll(page);
    setBooks(res.data.content);
    setPageSize(res.data.size ?? res.data.pageable?.pageSize ?? pageSize);
    setTotalPages(res.data.totalPages);
  };

  const fetchAuthors = async () => {
    const res = await authorAPI.getAll(0, 100);
    setAuthors(res.data.content);
  };

  useEffect(() => { fetchBooks(); fetchAuthors(); }, [page]);

  const handleCreate = async () => {
    if (!title.trim() || !authorId) { setError('All fields are required'); return; }
    const parsedAuthorId = Number(authorId);
    if (!Number.isFinite(parsedAuthorId)) { setError('Invalid author'); return; }
    await bookAPI.create({ title, author: { id: parsedAuthorId } });
    setTitle(''); setAuthorId(''); setError(''); setShowCreateModal(false);
    fetchBooks();
  };

  const handleUpdate = async () => {
    if (!title.trim() || !authorId) { setError('All fields are required'); return; }
    const parsedAuthorId = Number(authorId);
    if (!Number.isFinite(parsedAuthorId)) { setError('Invalid author'); return; }
    await bookAPI.update(selectedBook.id, { title, author: { id: parsedAuthorId } });
    setTitle(''); setAuthorId(''); setError(''); setShowEditModal(false);
    fetchBooks();
  };

  const handleDelete = async () => {
    await bookAPI.delete(selectedBook.id);
    setShowDeleteModal(false);
    fetchBooks();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>
        <button
          onClick={() => { setTitle(''); setAuthorId(''); setError(''); setShowCreateModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >+ Add Book</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">#</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Title</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Author</th>
              <th className="text-right px-6 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-gray-400">No books yet</td></tr>
            ) : (
              books.map((book, i) => (
                <tr key={book.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{page * pageSize + i + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{book.title}</td>
                  <td className="px-6 py-4 text-gray-600">{book.author?.name}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => { setSelectedBook(book); setTitle(book.title); setAuthorId(book.author?.id); setError(''); setShowEditModal(true); }}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                    >Edit</button>
                    <button
                      onClick={() => { setSelectedBook(book); setShowDeleteModal(true); }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`px-3 py-1 rounded ${page === i ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
            >{i + 1}</button>
          ))}
        </div>
      )}

      {showCreateModal && (
        <Modal title="Add Book" onClose={() => setShowCreateModal(false)}>
          <input className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Book title" value={title} onChange={e => setTitle(e.target.value)} />
          <select className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={authorId} onChange={e => setAuthorId(e.target.value)}>
            <option value="">Select author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </Modal>
      )}

      {showEditModal && (
        <Modal title="Edit Book" onClose={() => setShowEditModal(false)}>
          <input className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Book title" value={title} onChange={e => setTitle(e.target.value)} />
          <select className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={authorId} onChange={e => setAuthorId(e.target.value)}>
            <option value="">Select author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleUpdate} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500">Update</button>
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal title="Delete Book" onClose={() => setShowDeleteModal(false)}>
          <p className="text-gray-600 mb-4">Are you sure you want to delete <strong>{selectedBook?.title}</strong>?</p>
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
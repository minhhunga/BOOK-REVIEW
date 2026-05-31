import { useState, useEffect } from 'react';
import { reviewAPI, bookAPI } from '../services/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [bookId, setBookId] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    const res = await reviewAPI.getAll(page);
    setReviews(res.data.content);
    setPageSize(res.data.size ?? res.data.pageable?.pageSize ?? pageSize);
    setTotalPages(res.data.totalPages);
  };

  const fetchBooks = async () => {
    const res = await bookAPI.getAll(0, 100);
    setBooks(res.data.content);
  };

  useEffect(() => { fetchReviews(); fetchBooks(); }, [page]);

  const handleCreate = async () => {
    if (!reviewText.trim() || !bookId) { setError('All fields are required'); return; }
    await reviewAPI.create({ reviewText, book: { id: bookId } });
    setReviewText(''); setBookId(''); setError(''); setShowCreateModal(false);
    fetchReviews();
  };

  const handleUpdate = async () => {
    if (!reviewText.trim() || !bookId) { setError('All fields are required'); return; }
    await reviewAPI.update(selectedReview.id, { reviewText, book: { id: bookId } });
    setReviewText(''); setBookId(''); setError(''); setShowEditModal(false);
    fetchReviews();
  };

  const handleDelete = async () => {
    await reviewAPI.delete(selectedReview.id);
    setShowDeleteModal(false);
    fetchReviews();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
        <button
          onClick={() => { setReviewText(''); setBookId(''); setError(''); setShowCreateModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >+ Add Review</button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">#</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Book</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Author</th>
              <th className="text-left px-6 py-3 text-gray-600 font-semibold">Review</th>
              <th className="text-right px-6 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-gray-400">No reviews yet</td></tr>
            ) : (
              reviews.map((review, i) => (
                <tr key={review.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{page * pageSize + i + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{review.book?.title}</td>
                  <td className="px-6 py-4 text-gray-600">{review.book?.author?.name}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{review.reviewText}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => { setSelectedReview(review); setReviewText(review.reviewText); setBookId(review.book?.id); setError(''); setShowEditModal(true); }}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                    >Edit</button>
                    <button
                      onClick={() => { setSelectedReview(review); setShowDeleteModal(true); }}
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
        <Modal title="Add Review" onClose={() => setShowCreateModal(false)}>
          <select className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={bookId} onChange={e => setBookId(e.target.value)}>
            <option value="">Select book</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
          <textarea className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Write your review..." rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)} />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </Modal>
      )}

      {showEditModal && (
        <Modal title="Edit Review" onClose={() => setShowEditModal(false)}>
          <select className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={bookId} onChange={e => setBookId(e.target.value)}>
            <option value="">Select book</option>
            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
          </select>
          <textarea className="w-full border rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Write your review..." rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)} />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleUpdate} className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500">Update</button>
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal title="Delete Review" onClose={() => setShowDeleteModal(false)}>
          <p className="text-gray-600 mb-4">Are you sure you want to delete this review?</p>
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
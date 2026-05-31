package com.book_review.service;

import com.book_review.entity.Book;
import com.book_review.entity.Review;
import com.book_review.repository.BookRepository;
import com.book_review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public Page<Review> getAllReviews(int page, int size) {
        return reviewRepository.findAll(PageRequest.of(page, size));
    }

    public Review createReview(Review review) {
        Book book = bookRepository.findById(review.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        review.setBook(book);
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, Review updatedReview) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Book book = bookRepository.findById(updatedReview.getBook().getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        review.setReviewText(updatedReview.getReviewText());
        review.setBook(book);

        return reviewRepository.save(review);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
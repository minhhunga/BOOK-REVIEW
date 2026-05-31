package com.book_review.service;

import com.book_review.entity.Author;
import com.book_review.entity.Book;
import com.book_review.repository.AuthorRepository;
import com.book_review.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public Page<Book> getAllBooks(int page, int size) {
        return bookRepository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Book createBook(Book book) {
        Author author = authorRepository.findById(book.getAuthor().getId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        book.setAuthor(author);
        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        Author author = authorRepository.findById(updatedBook.getAuthor().getId())
                .orElseThrow(() -> new RuntimeException("Author not found"));
        book.setTitle(updatedBook.getTitle());
        book.setAuthor(author);
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
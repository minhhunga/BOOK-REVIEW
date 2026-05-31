package com.book_review.service;

import com.book_review.entity.Author;
import com.book_review.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor  // Lombok tự tạo constructor inject AuthorRepository
public class AuthorService {

    private final AuthorRepository authorRepository;

    // Lấy tất cả author (có phân trang)
    public Page<Author> getAllAuthors(int page, int size) {
        return authorRepository.findAll(PageRequest.of(page, size));
    }

    // Tạo author mới
    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    // Cập nhật author
    public Author updateAuthor(Long id, Author updatedAuthor) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        author.setName(updatedAuthor.getName());
        return authorRepository.save(author);
    }

    // Xóa author
    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }
}
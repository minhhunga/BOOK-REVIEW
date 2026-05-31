package com.book_review.repository;

import com.book_review.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    // JpaRepository tự có sẵn: findAll, findById, save, delete...
    // Không cần viết thêm gì!
}
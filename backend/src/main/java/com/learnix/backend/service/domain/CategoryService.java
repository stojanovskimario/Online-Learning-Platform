package com.learnix.backend.service.domain;

import com.learnix.backend.model.domain.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<Category> findAll();

    Optional<Category> findById(Long id);

    Category create(Category category);

    Optional<Category> update(Long id, Category category);

    Optional<Category> deleteById(Long id);
}

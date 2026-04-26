package com.learnix.backend.service.application.impl;

import com.learnix.backend.model.domain.Category;
import com.learnix.backend.model.dto.CreateCategoryDto;
import com.learnix.backend.model.dto.DisplayCategoryDto;
import com.learnix.backend.service.application.CategoryApplicationService;
import com.learnix.backend.service.domain.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryApplicationServiceImpl implements CategoryApplicationService {

    private final CategoryService categoryService;

    public CategoryApplicationServiceImpl(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Override
    public List<DisplayCategoryDto> findAll() {
        return DisplayCategoryDto.from(categoryService.findAll());
    }

    @Override
    public Optional<DisplayCategoryDto> findById(Long id) {
        return categoryService
                .findById(id)
                .map(DisplayCategoryDto::from);
    }

    @Override
    public DisplayCategoryDto create(CreateCategoryDto createCategoryDto) {
        Category createdCategory = categoryService.create(createCategoryDto.toCategory());
        return DisplayCategoryDto.from(createdCategory);
    }

    @Override
    public Optional<DisplayCategoryDto> update(Long id, CreateCategoryDto createCategoryDto) {
        return categoryService
                .update(id, createCategoryDto.toCategory())
                .map(DisplayCategoryDto::from);
    }

    @Override
    public Optional<DisplayCategoryDto> deleteById(Long id) {
        return categoryService
                .deleteById(id)
                .map(DisplayCategoryDto::from);
    }
}

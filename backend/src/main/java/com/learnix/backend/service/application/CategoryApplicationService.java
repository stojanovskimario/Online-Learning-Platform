package com.learnix.backend.service.application;

import com.learnix.backend.model.dto.CreateCategoryDto;
import com.learnix.backend.model.dto.DisplayCategoryDto;

import java.util.List;
import java.util.Optional;

public interface CategoryApplicationService {
    List<DisplayCategoryDto> findAll();

    Optional<DisplayCategoryDto> findById(Long id);

    DisplayCategoryDto create(CreateCategoryDto createCategoryDto);

    Optional<DisplayCategoryDto> update(Long id, CreateCategoryDto createCategoryDto);

    Optional<DisplayCategoryDto> deleteById(Long id);
}

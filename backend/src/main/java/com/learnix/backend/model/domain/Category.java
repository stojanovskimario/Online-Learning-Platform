package com.learnix.backend.model.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "categories")
public class Category extends BaseEntity{
    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    public Category(String name, String description){
        this.name=name;
        this.description = description;
    }
}

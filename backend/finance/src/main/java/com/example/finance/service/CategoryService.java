package com.example.finance.service;

import com.example.finance.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> listAll();
    Category add(Category category);
    Category update(Integer id, String name);
    void delete(Integer id);
    List<Category> getByType(String type);
}
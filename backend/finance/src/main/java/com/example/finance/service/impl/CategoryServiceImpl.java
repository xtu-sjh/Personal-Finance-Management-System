package com.example.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.finance.entity.Category;
import com.example.finance.mapper.CategoryMapper;
import com.example.finance.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    public List<Category> listAll() {
        return categoryMapper.selectList(null);
    }

    @Override
    public Category add(Category category) {
        // 检查是否已存在同名同类型分类
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getName, category.getName())
               .eq(Category::getType, category.getType());
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new IllegalArgumentException("该分类已存在");
        }
        categoryMapper.insert(category);
        return category;
    }

    @Override
    public Category update(Integer id, String name) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new IllegalArgumentException("分类不存在");
        }
        // 重名检查（排除自身）
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getName, name)
               .eq(Category::getType, category.getType())
               .ne(Category::getId, id);
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new IllegalArgumentException("该分类名称已存在");
        }
        category.setName(name);
        categoryMapper.updateById(category);
        return category;
    }

    @Override
    public void delete(Integer id) {
        // 可添加业务校验：检查是否有账单使用该分类
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new IllegalArgumentException("分类不存在");
        }
        // TODO: 可进一步检查 record 表中是否还有记录引用此分类，如有可阻止删除或置空
        categoryMapper.deleteById(id);
    }

    @Override
    public List<Category> getByType(String type) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getType, type);
        return categoryMapper.selectList(wrapper);
    }
}
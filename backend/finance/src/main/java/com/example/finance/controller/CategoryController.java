package com.example.finance.controller;

import com.example.finance.common.Result;
import com.example.finance.entity.Category;
import com.example.finance.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 获取所有分类
    @GetMapping
    public Result<List<Category>> list(@RequestParam(required = false) String type) {
        List<Category> categories;
        if (type != null && !type.isEmpty()) {
            categories = categoryService.getByType(type);
        } else {
            categories = categoryService.listAll();
        }
        return Result.success(categories);
    }

    // 新增分类
    @PostMapping
    public Result<Category> add(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return Result.error(400, "分类名称不能为空");
        }
        if (!"income".equals(category.getType()) && !"expense".equals(category.getType())) {
            return Result.error(400, "分类类型不正确");
        }
        Category saved = categoryService.add(category);
        return Result.success("添加成功", saved);
    }

    // 修改分类名称
    @PutMapping("/{id}")
    public Result<Category> update(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            return Result.error(400, "分类名称不能为空");
        }
        Category updated = categoryService.update(id, name);
        return Result.success("修改成功", updated);
    }

    // 删除分类
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return Result.success("删除成功", null);
    }
}
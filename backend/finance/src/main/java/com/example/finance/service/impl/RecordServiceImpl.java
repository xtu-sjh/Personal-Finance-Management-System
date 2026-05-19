package com.example.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.finance.entity.Record;
import com.example.finance.mapper.RecordMapper;
import com.example.finance.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RecordServiceImpl implements RecordService {

    private final RecordMapper recordMapper;

    @Override
    public Record add(Record record) {
        // 👇👇👇 新增：金额校验（测试清单要求：金额为0不能添加）
        if (record.getAmount() == null || record.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("金额必须大于0");
        }

        // 直接插入，MyBatis-Plus会自动回填自增ID
        recordMapper.insert(record);
        System.out.println("联调日志：已成功添加记录，ID=" + record.getId());

        if ("expense".equals(record.getType())) {
            String month = record.getRecordDate().toString().substring(0, 7); // 格式：2026-05
            System.out.println("预算检查：用户" + record.getUserId() + "在" + month + "添加了一笔支出");
        }
        return record;
    }

    @Override
    public Record update(Record record) {
        // 👇👇👇 新增：修改时也校验金额
        if (record.getAmount() == null || record.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("金额必须大于0");
        }

        // 根据ID更新
        recordMapper.updateById(record);
        return record;
    }

    @Override
    public void delete(Long id) {
        // 👇👇👇 新增：检查记录是否存在
        if (id == null || recordMapper.selectById(id) == null) {
            throw new IllegalArgumentException("记录不存在，无法删除");
        }

        // 根据ID删除
        recordMapper.deleteById(id);
    }

    @Override
    public Page<Record> page(Long userId, Integer page, Integer size,
                             String month, String category) {
        // 1. 构建查询条件
        LambdaQueryWrapper<Record> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Record::getUserId, userId); // 只查当前用户的数据

        // 2. 如果传了月份，就按月份筛选（使用SQL函数 DATE_FORMAT）
        if (month != null && !month.isEmpty()) {
            wrapper.apply("DATE_FORMAT(record_date, '%Y-%m') = {0}", month);
        }

        // 3. 如果传了分类，就按分类筛选
        if (category != null && !category.isEmpty()) {
            wrapper.eq(Record::getCategory, category);
        }

        // 4. 按记账日期倒序排列（最新的在最前面）
        wrapper.orderByDesc(Record::getRecordDate);

        // 5. 构建分页对象并执行查询
        Page<Record> pageParam = new Page<>(page, size);
        return recordMapper.selectPage(pageParam, wrapper);
    }

    @Override
    public Map<String, Object> monthlySummary(Long userId, String month) {
        // 1. 调用Mapper的自定义SQL：按类型（收入/支出）统计总金额
        List<Map<String, Object>> typeSummary = recordMapper.summaryByMonth(userId, month);
        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expense = BigDecimal.ZERO;

        // 2. 遍历结果，分离收入和支出
        for (Map<String, Object> row : typeSummary) {
            String type = (String) row.get("type");
            BigDecimal total = (BigDecimal) row.get("total");
            if ("income".equals(type)) {
                income = total;
            } else if ("expense".equals(type)) {
                expense = total;
            }
        }

        // 3. 调用Mapper的自定义SQL：支出分类统计和收入分类统计
        List<Map<String, Object>> expenseCategoryStats = recordMapper.expenseCategoryStats(userId, month);
        List<Map<String, Object>> incomeCategoryStats = recordMapper.incomeCategoryStats(userId, month);

        // 4. 组装返回结果
        Map<String, Object> result = new HashMap<>();
        result.put("income", income); // 总收入
        result.put("expense", expense); // 总支出
        result.put("balance", income.subtract(expense)); // 结余
        result.put("categoryStats", expenseCategoryStats); // 支出分类饼图数据（兼容旧版）
        result.put("expenseCategoryStats", expenseCategoryStats); // 支出分类明细
        result.put("incomeCategoryStats", incomeCategoryStats); // 收入分类明细
        return result;
    }

    @Override
    public Map<String, Object> trendStats(Long userId, Integer months) {
        // 直接调用Mapper的自定义SQL：近N个月收支趋势（用于折线图）
        List<Map<String, Object>> trendData = recordMapper.trendStats(userId, months);
        Map<String, Object> result = new HashMap<>();
        result.put("trend", trendData);
        return result;
    }
}
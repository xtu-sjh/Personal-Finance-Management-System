package com.example.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.finance.entity.Record;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Mapper
public interface RecordMapper extends BaseMapper<Record> {

    // 月度收支汇总：按类型统计总金额
    @Select("SELECT type, SUM(amount) AS total FROM record " +
            "WHERE user_id = #{userId} AND DATE_FORMAT(record_date, '%Y-%m') = #{month} " +
            "GROUP BY type")
    List<Map<String, Object>> summaryByMonth(@Param("userId") Long userId,
                                             @Param("month") String month);

    // 支出分类统计（用于饼图）
    @Select("SELECT category, SUM(amount) AS total FROM record " +
            "WHERE user_id = #{userId} AND type = 'expense' " +
            "AND DATE_FORMAT(record_date, '%Y-%m') = #{month} " +
            "GROUP BY category ORDER BY total DESC")
    List<Map<String, Object>> expenseCategoryStats(@Param("userId") Long userId,
                                                   @Param("month") String month);

    // 收入分类统计
    @Select("SELECT category, SUM(amount) AS total FROM record " +
            "WHERE user_id = #{userId} AND type = 'income' " +
            "AND DATE_FORMAT(record_date, '%Y-%m') = #{month} " +
            "GROUP BY category ORDER BY total DESC")
    List<Map<String, Object>> incomeCategoryStats(@Param("userId") Long userId,
                                                  @Param("month") String month);

    // 近N个月收支趋势
    @Select("SELECT DATE_FORMAT(record_date, '%Y-%m') AS month, " +
            "SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income, " +
            "SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense " +
            "FROM record WHERE user_id = #{userId} " +
            "AND record_date >= DATE_SUB(CURDATE(), INTERVAL #{months} MONTH) " +
            "GROUP BY DATE_FORMAT(record_date, '%Y-%m') ORDER BY month")
    List<Map<String, Object>> trendStats(@Param("userId") Long userId,
                                         @Param("months") Integer months);

    // 查询某分类的当月已消费金额（用于预算进度计算）
    @Select("SELECT COALESCE(SUM(amount), 0) FROM record " +
            "WHERE user_id = #{userId} AND category = #{category} AND type = 'expense' " +
            "AND DATE_FORMAT(record_date, '%Y-%m') = #{month}")
    BigDecimal getCategorySpent(@Param("userId") Long userId,
                                @Param("category") String category,
                                @Param("month") String month);
}
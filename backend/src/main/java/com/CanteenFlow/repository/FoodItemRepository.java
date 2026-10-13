
package com.CanteenFlow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.CanteenFlow.entity.FoodItem;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByCategoryIgnoreCase(String category);
    List<FoodItem> findByAvailable(Boolean available);
    List<FoodItem> findByNameContainingIgnoreCase(String name);
}

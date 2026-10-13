package com.CanteenFlow.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.CanteenFlow.entity.FoodItem;
import com.CanteenFlow.repository.FoodItemRepository;

@Service
@Transactional
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;

    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    public List<FoodItem> getAllFoodItems(String category, String search) {
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            return foodItemRepository.findByCategoryIgnoreCase(category);
        }
        if (search != null && !search.isBlank()) {
            return foodItemRepository.findByNameContainingIgnoreCase(search);
        }
        return foodItemRepository.findAll();
    }

    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with ID: " + id));
    }

    public FoodItem createFoodItem(FoodItem foodItem) {
        if (foodItem.getAvailable() == null) {
            foodItem.setAvailable(true);
        }
        if (foodItem.getIsVeg() == null) {
            foodItem.setIsVeg(true);
        }
        return foodItemRepository.save(foodItem);
    }

    public FoodItem updateFoodItem(Long id, FoodItem updatedItem) {
        FoodItem existing = getFoodItemById(id);
        if (updatedItem.getName() != null) existing.setName(updatedItem.getName());
        if (updatedItem.getDescription() != null) existing.setDescription(updatedItem.getDescription());
        if (updatedItem.getPrice() != null) existing.setPrice(updatedItem.getPrice());
        if (updatedItem.getCategory() != null) existing.setCategory(updatedItem.getCategory());
        if (updatedItem.getImageUrl() != null) existing.setImageUrl(updatedItem.getImageUrl());
        if (updatedItem.getPreparationTime() != null) existing.setPreparationTime(updatedItem.getPreparationTime());
        if (updatedItem.getAvailable() != null) existing.setAvailable(updatedItem.getAvailable());
        if (updatedItem.getIsVeg() != null) existing.setIsVeg(updatedItem.getIsVeg());
        return foodItemRepository.save(existing);
    }

    public void deleteFoodItem(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new RuntimeException("Food item not found with ID: " + id);
        }
        foodItemRepository.deleteById(id);
    }

    public FoodItem toggleAvailability(Long id) {
        FoodItem item = getFoodItemById(id);
        item.setAvailable(!Boolean.TRUE.equals(item.getAvailable()));
        return foodItemRepository.save(item);
    }
}

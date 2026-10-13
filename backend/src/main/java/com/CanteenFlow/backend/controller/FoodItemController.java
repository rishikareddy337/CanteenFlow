package com.CanteenFlow.backend.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.CanteenFlow.entity.FoodItem;
import com.CanteenFlow.service.FoodItemService;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class FoodItemController {

    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(foodItemService.getAllFoodItems(category, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItemById(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.getFoodItemById(id));
    }

    @PostMapping
    public ResponseEntity<FoodItem> createFoodItem(@RequestBody FoodItem foodItem) {
        FoodItem created = foodItemService.createFoodItem(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> updateFoodItem(
            @PathVariable Long id,
            @RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodItemService.updateFoodItem(id, foodItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<FoodItem> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.toggleAvailability(id));
    }
}

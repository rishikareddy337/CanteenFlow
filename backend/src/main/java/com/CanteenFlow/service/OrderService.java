package com.CanteenFlow.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.CanteenFlow.dto.CreateOrderRequest;
import com.CanteenFlow.dto.OrderItemRequest;
import com.CanteenFlow.dto.OrderStatsResponse;
import com.CanteenFlow.entity.FoodItem;
import com.CanteenFlow.entity.Order;
import com.CanteenFlow.entity.OrderItem;
import com.CanteenFlow.repository.FoodItemRepository;
import com.CanteenFlow.repository.OrderRepository;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final FoodItemRepository foodItemRepository;
    private final Random random = new Random();

    public OrderService(OrderRepository orderRepository, FoodItemRepository foodItemRepository) {
        this.orderRepository = orderRepository;
        this.foodItemRepository = foodItemRepository;
    }

    public Order createOrder(CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one food item.");
        }

        Order order = new Order();
        order.setCustomerName(request.getCustomerName().trim());
        order.setCustomerEmail(request.getCustomerEmail() != null ? request.getCustomerEmail().trim() : null);
        order.setCustomerPhone(request.getCustomerPhone().trim());
        order.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Cash on Pickup");
        order.setStatus("Pending");
        order.setPaymentStatus("Cash on Pickup".equalsIgnoreCase(request.getPaymentMethod()) ? "Pending" : "Completed");

        // Generate unique order number (e.g. CF-651294)
        String orderNumber;
        do {
            orderNumber = "CF-" + (100000 + random.nextInt(900000));
        } while (orderRepository.findByOrderNumber(orderNumber).isPresent());
        order.setOrderNumber(orderNumber);

        double calculatedTotal = 0.0;
        int maxItemPrepTime = 0;

        for (OrderItemRequest itemReq : request.getItems()) {
            FoodItem foodItem = foodItemRepository.findById(itemReq.getFoodItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Food item not found with ID: " + itemReq.getFoodItemId()));

            if (Boolean.FALSE.equals(foodItem.getAvailable())) {
                throw new IllegalStateException("Food item '" + foodItem.getName() + "' is currently unavailable.");
            }

            int quantity = itemReq.getQuantity() != null && itemReq.getQuantity() > 0 ? itemReq.getQuantity() : 1;
            double itemPrice = foodItem.getPrice();
            double itemTotal = itemPrice * quantity;
            calculatedTotal += itemTotal;

            int itemPrepTime = foodItem.getPreparationTime() != null ? foodItem.getPreparationTime() : 10;
            if (itemPrepTime > maxItemPrepTime) {
                maxItemPrepTime = itemPrepTime;
            }

            OrderItem orderItem = new OrderItem(
                    foodItem.getId(),
                    foodItem.getName(),
                    itemPrice,
                    quantity,
                    itemTotal
            );
            order.addItem(orderItem);
        }

        // Active queue impact: add 2 mins per active order in Pending or Preparing
        long activeOrdersCount = orderRepository.countByStatusIgnoreCase("Pending")
                + orderRepository.countByStatusIgnoreCase("Preparing");
        int queueBufferMinutes = (int) (activeOrdersCount * 2);
        int totalEstimatedWaitTime = Math.max(5, maxItemPrepTime + queueBufferMinutes);

        order.setSubtotal(calculatedTotal);
        order.setTotalAmount(calculatedTotal);
        order.setEstimatedWaitTime(totalEstimatedWaitTime);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber.trim())
                .orElseThrow(() -> new RuntimeException("Order not found with Order Number: " + orderNumber));
    }

    public List<Order> getAllOrders(String status) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            return orderRepository.findByStatusIgnoreCaseOrderByCreatedAtDesc(status.trim());
        }
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        String formattedStatus = normalizeStatus(status);
        order.setStatus(formattedStatus);
        order.setUpdatedAt(LocalDateTime.now());
        if ("Completed".equalsIgnoreCase(formattedStatus)) {
            order.setPaymentStatus("Completed");
        }
        return orderRepository.save(order);
    }

    public OrderStatsResponse getOrderStats() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatusIgnoreCase("Pending");
        long preparingOrders = orderRepository.countByStatusIgnoreCase("Preparing");
        long readyOrders = orderRepository.countByStatusIgnoreCase("Ready for Pickup");
        long completedOrders = orderRepository.countByStatusIgnoreCase("Completed");
        long cancelledOrders = orderRepository.countByStatusIgnoreCase("Cancelled");
        Double revenue = orderRepository.calculateTotalRevenue();
        double totalRevenue = revenue != null ? revenue : 0.0;
        int activeQueueCount = (int) (pendingOrders + preparingOrders);

        return new OrderStatsResponse(
                totalOrders,
                pendingOrders,
                preparingOrders,
                readyOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue,
                activeQueueCount
        );
    }

    private String normalizeStatus(String status) {
        if (status == null) return "Pending";
        String s = status.trim().toLowerCase();
        return switch (s) {
            case "confirmed" -> "Confirmed";
            case "preparing" -> "Preparing";
            case "ready", "ready for pickup", "ready_for_pickup" -> "Ready for Pickup";
            case "completed" -> "Completed";
            case "cancelled", "canceled" -> "Cancelled";
            default -> "Pending";
        };
    }
}

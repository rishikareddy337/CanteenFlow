package com.CanteenFlow.backend.controller;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.CanteenFlow.dto.CreateOrderRequest;
import com.CanteenFlow.dto.OrderStatsResponse;
import com.CanteenFlow.dto.UpdateStatusRequest;
import com.CanteenFlow.entity.Order;
import com.CanteenFlow.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order savedOrder = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.getStatus()));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<Order> trackOrderByNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @GetMapping("/stats")
    public ResponseEntity<OrderStatsResponse> getOrderStats() {
        return ResponseEntity.ok(orderService.getOrderStats());
    }
}

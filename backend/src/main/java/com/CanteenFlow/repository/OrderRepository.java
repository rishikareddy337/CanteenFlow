package com.CanteenFlow.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.CanteenFlow.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
    List<Order> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    long countByStatusIgnoreCase(String status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE UPPER(o.status) != 'CANCELLED'")
    Double calculateTotalRevenue();
}

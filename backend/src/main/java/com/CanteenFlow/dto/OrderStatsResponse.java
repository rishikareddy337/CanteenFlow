package com.CanteenFlow.dto;

public class OrderStatsResponse {

    private long totalOrders;
    private long pendingOrders;
    private long preparingOrders;
    private long readyOrders;
    private long completedOrders;
    private long cancelledOrders;
    private double totalRevenue;
    private int activeQueueCount;

    public OrderStatsResponse() {
    }

    public OrderStatsResponse(long totalOrders, long pendingOrders, long preparingOrders, long readyOrders, long completedOrders, long cancelledOrders, double totalRevenue, int activeQueueCount) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.preparingOrders = preparingOrders;
        this.readyOrders = readyOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue;
        this.activeQueueCount = activeQueueCount;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getPreparingOrders() {
        return preparingOrders;
    }

    public void setPreparingOrders(long preparingOrders) {
        this.preparingOrders = preparingOrders;
    }

    public long getReadyOrders() {
        return readyOrders;
    }

    public void setReadyOrders(long readyOrders) {
        this.readyOrders = readyOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public int getActiveQueueCount() {
        return activeQueueCount;
    }

    public void setActiveQueueCount(int activeQueueCount) {
        this.activeQueueCount = activeQueueCount;
    }
}

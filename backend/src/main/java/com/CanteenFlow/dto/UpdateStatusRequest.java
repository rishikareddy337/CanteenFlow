package com.CanteenFlow.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateStatusRequest {

    @NotBlank(message = "Status cannot be blank")
    private String status;

    public UpdateStatusRequest() {
    }

    public UpdateStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class StatusCount {
    private String status;
    private Long cnt;

    public StatusCount() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getCnt() { return cnt; }
    public void setCnt(Long cnt) { this.cnt = cnt; }
}
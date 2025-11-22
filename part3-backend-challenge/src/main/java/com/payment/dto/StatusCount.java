package com.payment.dto;

import io.micronaut.core.annotation.Introspected;

@Introspected
public interface StatusCount {
    String getStatus();
    Long getCnt();
}
package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class DateRange {
    private String start;
    private String end;

    public DateRange() {}

    public DateRange(String start, String end) {
        this.start = start;
        this.end = end;
    }

    public String getStart() { return start; }
    public void setStart(String start) { this.start = start; }

    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }
}

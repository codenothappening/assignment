package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class PaginationDTO {
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;

    public PaginationDTO() {}

    public PaginationDTO(int page, int size, int totalPages, long totalElements) {
        this.page = page;
        this.size = size;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
}

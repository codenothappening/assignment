package com.payment.dto;

import io.micronaut.serde.annotation.Serdeable;

import java.util.List;

@Serdeable
public class MerchantTransactionsResponse {
    private String merchantId;
    private DateRange dateRange;
    private SummaryDTO summary;
    private java.util.List<TransactionDTO> transactions;
    private PaginationDTO pagination;

    public MerchantTransactionsResponse() {}

    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }

    public DateRange getDateRange() { return dateRange; }
    public void setDateRange(DateRange dateRange) { this.dateRange = dateRange; }

    public SummaryDTO getSummary() { return summary; }
    public void setSummary(SummaryDTO summary) { this.summary = summary; }

    public List<TransactionDTO> getTransactions() { return transactions; }
    public void setTransactions(List<TransactionDTO> transactions) { this.transactions = transactions; }

    public PaginationDTO getPagination() { return pagination; }
    public void setPagination(PaginationDTO pagination) { this.pagination = pagination; }
}

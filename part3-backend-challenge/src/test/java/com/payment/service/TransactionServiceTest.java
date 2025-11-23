package com.payment.service;

import com.payment.dto.MerchantTransactionsResponse;
import com.payment.exception.NotFoundException;
import io.micronaut.test.extensions.junit5.annotation.MicronautTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@MicronautTest
public class TransactionServiceTest {

    @Inject
    TransactionService transactionService;

    @Test
    void testGetTransactionsByMerchant_Success() {
        MerchantTransactionsResponse resp = transactionService.getMerchantTransactions(
                "MCH-00001",
                Optional.of(0),
                Optional.of(5),
                Optional.of("2025-11-16"),
                Optional.of("2025-11-18"),
                Optional.empty()
        );
        assertNotNull(resp);
        assertEquals("MCH-00001", resp.getMerchantId());
        assertNotNull(resp.getTransactions());
        assertTrue(resp.getTransactions().size() <= 5);
        assertNotNull(resp.getSummary());
        assertEquals(resp.getPagination().getTotalElements(), resp.getSummary().getTotalTransactions());
        assertEquals("USD", resp.getSummary().getCurrency());
        assertEquals(0, resp.getPagination().getPage());
        assertEquals(5, resp.getPagination().getSize());
        assertEquals("2025-11-16T00:00:00Z", resp.getDateRange().getStart());
        assertEquals("2025-11-18T23:59:59Z", resp.getDateRange().getEnd());
    }

    @Test
    void testInvalidDateRange() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                transactionService.getMerchantTransactions(
                        "MCH-00001",
                        Optional.of(0),
                        Optional.of(5),
                        Optional.of("2025-11-18"),
                        Optional.of("2025-11-16"),
                        Optional.empty()
                )
        );
        assertTrue(ex.getMessage().toLowerCase().contains("enddate"));
    }

    @Test
    void testInvalidDateFormat() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                transactionService.getMerchantTransactions(
                        "MCH-00001",
                        Optional.of(0),
                        Optional.of(5),
                        Optional.of("2025/11/16"),
                        Optional.of("2025-11-18"),
                        Optional.empty()
                )
        );
        assertTrue(ex.getMessage().toLowerCase().contains("invalid date format"));
    }

    @Test
    void testMerchantNotFound() {
        Assertions.assertThrows(NotFoundException.class, () ->
                transactionService.getMerchantTransactions(
                        "UNKNOWN",
                        Optional.of(0),
                        Optional.of(5),
                        Optional.of("2025-11-16"),
                        Optional.of("2025-11-18"),
                        Optional.empty()
                )
        );
    }

    @Test
    void testStatusFilteringCompleted() {
        MerchantTransactionsResponse resp = transactionService.getMerchantTransactions(
                "MCH-00001",
                Optional.of(0),
                Optional.of(5),
                Optional.of("2025-11-16"),
                Optional.of("2025-11-18"),
                Optional.of("completed")
        );
        assertNotNull(resp);
        assertNotNull(resp.getTransactions());
        resp.getTransactions().forEach(t -> assertEquals("completed", t.getStatus()));
        assertNotNull(resp.getSummary().getByStatus());
        assertEquals(1, resp.getSummary().getByStatus().size());
        assertTrue(resp.getSummary().getByStatus().containsKey("completed"));
    }

    @Test
    void testPagination_Success() {
        MerchantTransactionsResponse page0 = transactionService.getMerchantTransactions(
                "MCH-00001",
                Optional.of(0),
                Optional.of(5),
                Optional.of("2025-11-16"),
                Optional.of("2025-11-18"),
                Optional.empty()
        );
        MerchantTransactionsResponse page1 = transactionService.getMerchantTransactions(
                "MCH-00001",
                Optional.of(1),
                Optional.of(5),
                Optional.of("2025-11-16"),
                Optional.of("2025-11-18"),
                Optional.empty()
        );
        assertEquals(0, page0.getPagination().getPage());
        assertEquals(1, page1.getPagination().getPage());
        assertEquals(5, page0.getPagination().getSize());
        assertEquals(5, page1.getPagination().getSize());
        if (!page0.getTransactions().isEmpty() && !page1.getTransactions().isEmpty()) {
            Long a = page0.getTransactions().get(0).getTxnId();
            Long b = page1.getTransactions().get(0).getTxnId();
            assertNotEquals(a, b);
        }
    }
}

package com.payment.service;

import com.payment.dto.*;
import com.payment.entity.Member;
import com.payment.entity.TransactionDetail;
import com.payment.entity.TransactionMaster;
import com.payment.repository.MemberRepository;
import com.payment.repository.TransactionDetailRepository;
import com.payment.repository.TransactionRepository;
import io.micronaut.data.model.Page;
import io.micronaut.data.model.Pageable;
import io.micronaut.data.model.Sort;
import jakarta.inject.Singleton;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;
import com.payment.exception.NotFoundException;

@Singleton
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionDetailRepository detailRepository;
    private final MemberRepository memberRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  TransactionDetailRepository detailRepository,
                                  MemberRepository memberRepository) {
        this.transactionRepository = transactionRepository;
        this.detailRepository = detailRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    public MerchantTransactionsResponse getMerchantTransactions(String merchantId,
                                                                Optional<Integer> pageOpt,
                                                                Optional<Integer> sizeOpt,
                                                                Optional<String> startDateOpt,
                                                                Optional<String> endDateOpt,
                                                                Optional<String> statusOpt) {
        int page = Math.max(0, pageOpt.orElse(0));
        int size = sizeOpt.orElse(20);
        if (size <= 0) size = 20;
        if (size > 100) size = 100;

        LocalDate startLd;
        LocalDate endLd;
        try {
            startLd = startDateOpt.map(LocalDate::parse).orElse(LocalDate.of(1970, 1, 1));
            endLd = endDateOpt.map(LocalDate::parse).orElse(LocalDate.of(3000, 1, 1));
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
        if (endLd.isBefore(startLd)) {
            throw new IllegalArgumentException("endDate must be on or after startDate");
        }
        Date start = Date.valueOf(startLd);
        Date end = Date.valueOf(endLd);

        // Validate merchant existence (based on having any transactions historically)
        if (!transactionRepository.existsByMerchantId(merchantId)) {
            throw new NotFoundException("Merchant", merchantId);
        }

        // Validate status if provided
        Optional<String> normalizedStatus = statusOpt.map(String::trim).map(String::toLowerCase);
        Set<String> allowedStatuses = Set.of("pending", "completed", "failed", "reversed");
        if (normalizedStatus.isPresent() && !allowedStatuses.contains(normalizedStatus.get())) {
            throw new IllegalArgumentException("Invalid status. Allowed: pending, completed, failed, reversed");
        }

        // Sort transactions by localTxnDateTime DESC for stable ordering
        Pageable pageable = Pageable.from(page, size, Sort.of(Sort.Order.desc("localTxnDateTime")));
        Page<TransactionMaster> txPage;
        if (normalizedStatus.isPresent() && !normalizedStatus.get().isBlank()) {
            txPage = transactionRepository.findByMerchantIdAndTxnDateBetweenAndStatus(
                    merchantId, start, end, normalizedStatus.get(), pageable);
        } else {
            txPage = transactionRepository.findByMerchantIdAndTxnDateBetween(
                    merchantId, start, end, pageable);
        }

        List<TransactionMaster> masters = txPage.getContent();
        List<Long> txnIds = masters.stream().map(TransactionMaster::getTxnId).filter(Objects::nonNull).collect(Collectors.toList());

        Map<Long, List<TransactionDetail>> detailsByTxnId;
        if (!txnIds.isEmpty()) {
            List<TransactionDetail> details = detailRepository.findByMasterTxnIdInList(txnIds);
            detailsByTxnId = details.stream().collect(Collectors.groupingBy(TransactionDetail::getMasterTxnId));
        } else {
            detailsByTxnId = Collections.emptyMap();
        }

        Set<Long> memberIds = new HashSet<>();
        for (TransactionMaster m : masters) {
            if (m.getGpAcquirerId() != null) memberIds.add(m.getGpAcquirerId());
            if (m.getGpIssuerId() != null) memberIds.add(m.getGpIssuerId());
        }
        Map<Long, String> memberNameById = new HashMap<>();
        if (!memberIds.isEmpty()) {
            List<Member> members = memberRepository.findByMemberIdInList(new ArrayList<>(memberIds));
            for (Member mem : members) {
                memberNameById.put(mem.getMemberId(), mem.getMemberName());
            }
        }

        List<TransactionDTO> txnDtos = masters.stream().map(m -> {
            TransactionDTO dto = new TransactionDTO();
            dto.setTxnId(m.getTxnId());
            dto.setAmount(m.getAmount());
            dto.setCurrency(m.getCurrency());
            dto.setStatus(m.getStatus());
            dto.setTimestamp(m.getLocalTxnDateTime());
            dto.setCardType(m.getCardType());
            dto.setCardLast4(m.getCardLast4());
            dto.setAcquirer(m.getGpAcquirerId() == null ? null : memberNameById.get(m.getGpAcquirerId()));
            dto.setIssuer(m.getGpIssuerId() == null ? null : memberNameById.get(m.getGpIssuerId()));

            List<TransactionDetail> dets = detailsByTxnId.getOrDefault(m.getTxnId(), List.of());
            List<TransactionDetailDTO> detDtos = dets.stream().map(d -> {
                TransactionDetailDTO dd = new TransactionDetailDTO();
                dd.setDetailId(d.getTxnDetailId());
                dd.setType(d.getDetailType());
                dd.setAmount(d.getAmount());
                dd.setCurrency(d.getCurrency());
                dd.setDescription(d.getDescription());
                dd.setTimestamp(d.getLocalTxnDateTime());
                return dd;
            }).collect(Collectors.toList());
            dto.setDetails(detDtos);

            return dto;
        }).collect(Collectors.toList());

        long totalElements = txPage.getTotalSize();
        int totalPages = txPage.getTotalPages();

        BigDecimal totalAmount = normalizedStatus.isPresent()
                ? transactionRepository.sumAmountWithStatus(merchantId, start, end, normalizedStatus.get())
                : transactionRepository.sumAmount(merchantId, start, end);
        List<StatusCount> statusCounts = normalizedStatus.isPresent()
                ? transactionRepository.aggregateStatusCountsFiltered(merchantId, start, end, normalizedStatus.get())
                : transactionRepository.aggregateStatusCounts(merchantId, start, end);
        Map<String, Long> byStatus = new HashMap<>();
        for (StatusCount sc : statusCounts) {
            byStatus.put(sc.getStatus(), sc.getCnt());
        }

        SummaryDTO summary = new SummaryDTO();
        summary.setTotalTransactions(totalElements);
        summary.setTotalAmount(totalAmount);
        summary.setCurrency("USD");
        summary.setByStatus(byStatus);

        PaginationDTO pagination = new PaginationDTO(page, size, totalPages, totalElements);

        DateRange dateRange = new DateRange(startLd.toString() + "T00:00:00Z", endLd.toString() + "T23:59:59Z");

        MerchantTransactionsResponse response = new MerchantTransactionsResponse();
        response.setMerchantId(merchantId);
        response.setDateRange(dateRange);
        response.setSummary(summary);
        response.setTransactions(txnDtos);
        response.setPagination(pagination);
        return response;
    }
}

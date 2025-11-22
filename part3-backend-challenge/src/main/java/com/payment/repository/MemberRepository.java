package com.payment.repository;

import com.payment.entity.Member;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import java.util.Optional;
import java.util.List;

/**
 * Repository for Member entities.
 */
@Repository
@JdbcRepository(dialect = Dialect.POSTGRES)
public interface MemberRepository extends CrudRepository<Member, Long> {

    Optional<Member> findByMemberCode(String memberCode);

    List<Member> findByMemberIdInList(List<Long> memberIds);

    Member save(Member entity);
}

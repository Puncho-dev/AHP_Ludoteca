package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.loan.model.Loan;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import org.springframework.data.domain.Page;

import java.time.LocalDate;

public interface LoanService {
    public Page<Loan> findPage(LoanSearchDto dto, Long idGame, Long idClient, LocalDate date);

    void delete(Long id) throws Exception;

    void save(LoanDto dto) throws Exception;
}
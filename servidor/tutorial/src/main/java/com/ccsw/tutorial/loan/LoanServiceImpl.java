package com.ccsw.tutorial.loan;

import com.ccsw.tutorial.client.ClientService;
import com.ccsw.tutorial.common.criteria.SearchCriteria;
import com.ccsw.tutorial.game.GameService;
import com.ccsw.tutorial.loan.model.Loan;
import com.ccsw.tutorial.loan.model.LoanDto;
import com.ccsw.tutorial.loan.model.LoanSearchDto;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@Transactional
public class LoanServiceImpl implements LoanService {
    @Autowired
    LoanRepository loanRepository;

    @Autowired
    ClientService clientService;

    @Autowired
    GameService gameService;

    @Override
    public Page<Loan> findPage(LoanSearchDto dto, Long idGame, Long idClient, LocalDate date) {
        LoanSpecification gameSpec = new LoanSpecification(new SearchCriteria("game.id", ":", idGame));
        LoanSpecification clientSpec = new LoanSpecification(new SearchCriteria("client.id", ":", idClient));
        LoanSpecification dateStartSpec = new LoanSpecification(new SearchCriteria("dateStart", "<=", date));
        LoanSpecification dateEndSpec = new LoanSpecification(new SearchCriteria("dateEnd", ">=", date));

        Specification<Loan> spec = Specification.where(gameSpec).and(clientSpec).and(dateStartSpec).and(dateEndSpec);

        return this.loanRepository.findAll(spec, dto.getPageable().getPageable());
    }

    @Override
    public void delete(Long id) throws Exception {
        if (this.loanRepository.findById(id).orElse(null) == null) {
            throw new Exception("Not Exists");
        }

        this.loanRepository.deleteById(id);
    }

    @Override
    public void save(LoanDto dto) throws Exception {
        Loan loan = new Loan();

        BeanUtils.copyProperties(dto, loan, "id");

        Long idGame = dto.getGame().getId();
        Long idClient = dto.getClient().getId();

        loan.setGame(gameService.get(idGame));
        loan.setClient(clientService.get(idClient));

        Specification<Loan> clientOrGame = new LoanSpecification(new SearchCriteria("game.id", ":", idGame)).or(new LoanSpecification(new SearchCriteria("client.id", ":", idClient)));

        Specification<Loan> dateOverlap = new LoanSpecification(new SearchCriteria("dateStart", "<=", dto.getDateEnd())).and(new LoanSpecification(new SearchCriteria("dateEnd", ">=", dto.getDateStart())));

        Specification<Loan> spec = Specification.where(clientOrGame).and(dateOverlap);

        if (this.loanRepository.count(spec) == 0) {
            this.loanRepository.save(loan);
        } else {
            throw new Exception("Existing Loan");
        }
    }
}
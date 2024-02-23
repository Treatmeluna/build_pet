package com.wproject.pet.service;

import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.wproject.pet.dto.BoardReportDTO;
import com.wproject.pet.entity.BoardReport;
import com.wproject.pet.repository.BoardReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardReportService {
	
	private final BoardReportRepository boardReportRepository;
	
	private Page<BoardReportDTO> convertToDto(Page<BoardReport> breport){
		
		return new PageImpl<>(
				breport.getContent().stream()
					.map(report -> new BoardReportDTO(
							report.getBrid(),
							report.getB_reason(),
							report.getB_reporter(),
							report.getReportStatus(),
							report.getReportDate(),
							report.getCommunity()
							))
					.collect(Collectors.toList()),
				breport.getPageable(),
				breport.getTotalElements()
				);
	}
	
	public Page<BoardReportDTO> findAll(Pageable pageable){
		Page<BoardReport> breports = boardReportRepository.findAll(pageable);
		
		return convertToDto(breports);
	}
	
	@Transactional
	public BoardReportDTO view(int brid){
		System.out.println("View method called for br_id: " + brid);
		Optional<BoardReport> boardPage = boardReportRepository.findById(brid);
		BoardReport boardReport = boardPage.get();
		return new BoardReportDTO(
				boardReport.getBrid(),
				boardReport.getB_reason(),
				boardReport.getB_reporter(),
				boardReport.getReportStatus(),
				boardReport.getReportDate(),
				boardReport.getCommunity()
				);
	}
	
	@Transactional
	public void statusChange(int brid) {
		BoardReport boardReport = boardReportRepository.findById(brid).get();
		boardReport.setReportStatus("yes");
		boardReportRepository.save(boardReport);
	}

}

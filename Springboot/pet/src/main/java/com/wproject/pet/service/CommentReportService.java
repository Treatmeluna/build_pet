package com.wproject.pet.service;

import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.wproject.pet.dto.CommentReportDTO;
import com.wproject.pet.entity.CommentReport;
import com.wproject.pet.repository.CommentReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentReportService {
	
	private final CommentReportRepository commentReportRepository;
	
	public Page<CommentReportDTO> convertToDto(Page<CommentReport> creport){
		return new PageImpl<>(
				creport.getContent().stream()
				.map(report -> new CommentReportDTO(
						report.getCrid(),
						report.getC_reason(),
						report.getC_reporter(),
						report.getReportStatus(),
						report.getReportDate(),
						report.getCommunity(),
						report.getComment()
						))
				.collect(Collectors.toList()),
				creport.getPageable(),
				creport.getTotalElements()
				);
	}
	
	public Page<CommentReportDTO> findAll(Pageable pageable){
		
		Page<CommentReport> creports = commentReportRepository.findAll(pageable);
		
		return convertToDto(creports);
	}

	@Transactional
	public CommentReportDTO view(int crid) {
		System.out.println("View method called for cr_id: " + crid);
		Optional<CommentReport> commentPage = commentReportRepository.findById(crid);
		CommentReport commentReport = commentPage.get();
		return new CommentReportDTO(
				commentReport.getCrid(),
				commentReport.getC_reason(),
				commentReport.getC_reporter(),
				commentReport.getReportStatus(),
				commentReport.getReportDate(),
				commentReport.getCommunity(),
				commentReport.getComment()
				);
	}
	
	@Transactional
	public void statusChange(int crid) {
		CommentReport commentReport = commentReportRepository.findById(crid).get();
		commentReport.setReportStatus("yes");
		commentReportRepository.save(commentReport);
	}
}

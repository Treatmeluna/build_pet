package com.wproject.pet.service;

import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.wproject.pet.dto.BoardReportDTO;
import com.wproject.pet.dto.CommunityDTO;
import com.wproject.pet.entity.BoardReport;
import com.wproject.pet.entity.Community;
import com.wproject.pet.repository.BoardReportRepository;
import com.wproject.pet.repository.CommentReportRepository;
import com.wproject.pet.repository.CommentRepository;
import com.wproject.pet.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {
	private final CommunityRepository communityRepository;
	private final BoardReportRepository boardReportRepository;
	private final CommentRepository commentRepository;
	private final CommentReportRepository commentReportRepository;
	
	@Transactional
	public void insert(CommunityDTO communityDTO) {
		Community community = new Community();
		community.setCategory(communityDTO.getB_category());
		community.setContent(communityDTO.getB_content());
		community.setTitle(communityDTO.getB_title());
		community.setWriter(communityDTO.getB_writer());
		communityRepository.save(community);
	}
	
	//DTO변환
	private Page<CommunityDTO> convertToDtoPage(Page<Community> communityPage) {
	    return new PageImpl<>(
	            communityPage.getContent().stream()
	                    .map(community -> new CommunityDTO(
	                            community.getBnum(),
	                            community.getCategory(),
	                            community.getTitle(),
	                            community.getContent(),
	                            community.getWriter(),
	                            community.getB_date(),
	                            community.getB_like(),
	                            community.getHitcount(),
	                            community.getB_comments()
	                    ))
	                    .collect(Collectors.toList()),
	            communityPage.getPageable(),
	            communityPage.getTotalElements()
	    );
	}

	//전체보기 페이징 
	public Page<CommunityDTO> findAll(Pageable pageable){
		Page<Community> lists = communityRepository.findAll(pageable);

		return convertToDtoPage(lists);
		}
	
	//검색 
	public Page<CommunityDTO> search(String field, String word, Pageable pageable){
		Page<Community> lists;
		
		switch(field){
			case "b_title":
				lists = communityRepository.findByTitleContaining(word.toLowerCase(), pageable);
				break;
			case "b_content":
				lists = communityRepository.findByContentContaining(word.toLowerCase(), pageable);
				break;
			case "b_writer":
				lists = communityRepository.findByWriterContaining(word.toLowerCase(), pageable);
				break;
			case "b_category":
				lists = communityRepository.findByCategoryContaining(word, pageable);
				break;
			default: lists = communityRepository.findAll(pageable);
		}
		return convertToDtoPage(lists);	
	}
	
	//상세보기
	@Transactional
	public CommunityDTO view(Long bnum) {
		System.out.println("View method called for bnum: " + bnum);
		Optional<Community> communityOptional = communityRepository.findById(bnum);
		if(communityOptional.isPresent()) {
			Community community = communityOptional.get();
			community.setHitcount(community.getHitcount()+1);
			return new CommunityDTO(
					community.getBnum(),
					community.getCategory(),
	                community.getTitle(),
	                community.getContent(),
	                community.getWriter(),
	                community.getB_date(),
	                community.getB_like(),
	                community.getHitcount(),
	                community.getB_comments()
					);
		}else {
			return null;
		}
	}
	
	//수정
	@Transactional
	public void update(CommunityDTO communityDTO) {
		Community community = communityRepository.findById(communityDTO.getBnum()).get();
		community.setCategory(communityDTO.getB_category());
		community.setTitle(communityDTO.getB_title());
		community.setContent(communityDTO.getB_content());
		community.setB_date(communityDTO.getB_date());
		communityRepository.save(community);
	}
	
	//삭제 
	@Transactional
	public void delete(Long bnum) {
		Community community = communityRepository.findById(bnum).get();
		boardReportRepository.deleteAllByCommunity(community);
		commentReportRepository.deleteAllByCommunity(community);
		commentRepository.deleteAllByCommunity(community);
		communityRepository.deleteById(bnum);
	}
	
	public void like(Long bnum) {
		Community community = communityRepository.findById(bnum).get();
		community.setB_like(community.getB_like()+1);
		communityRepository.save(community);
	}
	
	public void send(Long bnum, BoardReportDTO boardReportDTO) {
		Community community = communityRepository.findById(bnum).get();
		BoardReport boardReport = new BoardReport();
		boardReport.setB_reporter(boardReportDTO.getB_reporter());
		boardReport.setB_reason(boardReportDTO.getB_reason());
		boardReport.setCommunity(community);
		boardReport.setReportStatus("no");
		boardReportRepository.save(boardReport);
	}
}

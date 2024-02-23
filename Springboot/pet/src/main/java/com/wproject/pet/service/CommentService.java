package com.wproject.pet.service;


import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.wproject.pet.dto.CommentDTO;
import com.wproject.pet.dto.CommentReportDTO;
import com.wproject.pet.entity.Comment;
import com.wproject.pet.entity.CommentReport;
import com.wproject.pet.entity.Community;
import com.wproject.pet.repository.CommentReportRepository;
import com.wproject.pet.repository.CommentRepository;
import com.wproject.pet.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	private final CommentRepository commentRepository;
	private final CommunityRepository communityRepository;
	private final CommentReportRepository commentReportRepository;
	
	@Transactional
	public void insert(Long bnum, CommentDTO commentDTO) {
		Community community = communityRepository.findById(bnum).get();
		Comment comment = new Comment();
		community.setB_comments(community.getB_comments()+1);
		comment.setC_writer(commentDTO.getC_writer());
		comment.setC_content(commentDTO.getC_content());
		comment.setCommunity(community);
		commentRepository.save(comment);
	}
	
	public List<Comment> findAll(Long bnum){
		return commentRepository.findCommentsByBId(bnum);
	}
	
	public void like(int c_id) {
		Comment comment = commentRepository.findById(c_id).get();
		comment.setC_like(comment.getC_like()+1);
		commentRepository.save(comment);
	}
	
	@Transactional
	public void delete(int c_id) {
		Comment comment = commentRepository.findById(c_id).get();
		if (comment != null) {
			Community community = comment.getCommunity();
			community.setB_comments(community.getB_comments()-1);
			commentReportRepository.deleteAllByComment(comment);
			commentRepository.deleteById(c_id);
		}
	}
	
	public void send(int c_id, CommentReportDTO commentReportDTO) {
		Comment comment = commentRepository.findById(c_id).get();
		CommentReport commentReport = new CommentReport();
		commentReport.setC_reporter(commentReportDTO.getC_reporter());
		commentReport.setC_reason(commentReportDTO.getC_reason());
		commentReport.setComment(comment);
		commentReport.setCommunity(comment.getCommunity());
		commentReport.setReportStatus("no");
		commentReportRepository.save(commentReport);
	}
}

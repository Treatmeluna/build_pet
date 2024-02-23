package com.wproject.pet.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.wproject.pet.entity.Comment;
import com.wproject.pet.entity.CommentReport;
import com.wproject.pet.entity.Community;

public interface CommentReportRepository extends JpaRepository<CommentReport, Integer> {

	public void deleteAllByComment(Comment comment);
	
	public void deleteAllByCommunity(Community community);
}

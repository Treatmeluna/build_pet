package com.wproject.pet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.wproject.pet.entity.Comment;
import com.wproject.pet.entity.Community;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
	
	@Query("SELECT c From Comment c WHERE c.community.bnum = :bnum")
	public List<Comment> findCommentsByBId(@Param("bnum") Long bnum);
	
	public void deleteAllByCommunity(Community community);

}

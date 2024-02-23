package com.wproject.pet.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.wproject.pet.entity.Community;

public interface CommunityRepository extends JpaRepository<Community, Long>{
	public Page<Community> findByTitleContaining(String word, Pageable pageable);
	public Page<Community> findByContentContaining(String word, Pageable pageable);
	public Page<Community> findByWriterContaining(String word, Pageable pageable);
	public Page<Community> findByCategoryContaining(String word, Pageable pageable);
	
}

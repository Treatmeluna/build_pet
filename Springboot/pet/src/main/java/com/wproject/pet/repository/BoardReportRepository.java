package com.wproject.pet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wproject.pet.entity.BoardReport;
import com.wproject.pet.entity.Community;

public interface BoardReportRepository extends JpaRepository<BoardReport, Integer>{

	public void deleteAllByCommunity(Community community);
}

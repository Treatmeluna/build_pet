package com.wproject.pet.dto;

import java.util.Date;

import com.wproject.pet.entity.Community;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BoardReportDTO {
	private int br_id;
	private String b_reason;
	private String b_reporter;
	private String reportStatus;
	private Date reportDate;
	private Community community;
	
}

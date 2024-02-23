package com.wproject.pet.dto;

import java.util.Date;

import com.wproject.pet.entity.Comment;
import com.wproject.pet.entity.Community;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommentReportDTO {
	private int cr_id;
	private String c_reason;
	private String c_reporter;
	private String reportStatus;
	private Date reportDate;
	private Community community;
	private Comment comment;

}
